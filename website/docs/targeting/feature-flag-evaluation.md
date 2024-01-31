---
id: feature-flag-evaluation
title: Feature Flag Evaluation
description: This document offers an in-depth explanation of how the ConfigCat SDK determines the value of a feature flag.
---

# Feature Flag Evaluation

This document offers an in-depth explanation of how the SDK determines the value of a feature flag when executing the `GetValue` function. Understanding this process requires prior knowledge of targeting concepts.

The feature flag's value is influenced by:

- The feature flag's rules defined on the Dashboard,
- The [User Object] provided to the `GetValue` function, and
- The *default value* passed to the `GetValue` function.

The feature flag's value always comes from exactly one rule, following this algorithm:

1. **Evaluation of Targeting Rules:** If targeting rules are present, the SDK evaluates them one by one, from top to bottom. It checks if all the conditions in the rule's IF part are met (i.e. all the conditions evaluate to true).
   - If the conditions are met, the THEN part determines the value to return. Note: If the THEN part contains [Percentage Options] and the necessary user attribute is missing, the SDK will skip the targeting rule and continue with the next rule - even though the targeting rule's conditions are met!
   - If the conditions aren't met, the SDK moves to the next targeting rule, or to step 2 (below) if there are no more targeting rules.
2. **Evaluation of Percentage Options:** If a percentage option rule exists, the SDK executes the [Evaluation of percentage options] algorithm to determine which percentage option applies to the user and returns the value associated with that option. If the necessary user attribute is missing, the SDK skips to step 3 (below).
3. **Returning simple value:** At this stage, the only remaining "rule" is the simple value specified at the end of the feature flag, which the SDK then returns.

In the event of an unexpected error during evaluation, the SDK returns the default value passed to the `GetValue` function.

## Evaluation of a Targeting Rule

The SDK evaluates the conditions in the rule's IF part one by one, from top to bottom. The result of a condition can be one of the following: `true`, `false` or `cannot evaluate`.

The result `cannot evaluate` occurs when the necessary user attribute is missing, invalid or incorrectly formatted (the SDK logs these issues as warnings).

A targeting rule matches only when all its conditions evaluates to `true`. In any other cases, it doesn't match.

### Evaluation of a User Condition

The SDK looks up the comparison attribute (the user attribute referenced by the condition) in the [User Object]. It compares the attribute value to the comparison value that is set on the Dashboard. The comparison is done according to the selected comparator, resulting in a `true` or `false` value. This will be the result of the condition.

The result of the condition will be `cannot evaluate` in case the comparison attribute is missing (`null`, `undefined`, `""`) or invalid (not of the type expected by the comparator or not formatted properly). In such cases, the targeting rule containing the condition will be skipped, and the evaluation will continue with the next rule.

### Evaluation of a Flag Condition

Using the same User Object used to evaluate the dependent flag, the SDK evaluates the prerequisite flag (the feature flag referenced by the condition). Then, the result is sent to the comparison value set on the Dashboard. The comparison is done according to the selected comparator, resulting in a `true` or `false` value. This will be the result of the condition.

In case the referenced feature flag is missing or there is a type mismatch between the return value and the comparison value, the evaluation process stops, and the SDK will return the [default value]. (Though this can happen only when using the [flag overrides] feature with invalid data.)

### Evaluation of a Segment Condition

The SDK looks up the segment referenced by the condition and evaluates the condition described by the segment similarly to [user conditions]. In the case of `IS IN SEGMENT` the result of the segment condition will be the same as the result of the segment. The result will be negated in the case of `IS NOT IN SEGMENT`.

If the segment evaluates to `cannot evaluate`, so is the segment condition.

The evaluation process stops if the referenced segment is missing, and the SDK will return the [default value]. (Though this can happen only when using the [flag overrides] feature with invalid data.)

## Evaluation of Percentage Options

Percentage options are designed to be consistent and sticky across all SDKs, which means that users with the same attributes fall in the same group and get the same feature flag value across the supported platforms.

The SDK looks up the [percentage evaluation attribute] in the [User Object] and:
- The SDK creates a hash from the combination of the value of the percentage evaluation attribute and the specific feature flag's key.
- The hash algorithm assigns the user a number between 0 and 99.
- The assigned number determines which group the user falls into, i.e. which percentage option applies to the user.

The fact that the above algorithm is implemented across all SDKs guarantees [stickiness] and [consistency].

By hashing the combination of the user attribute and the feature flag's key, we ensure diverse user groups for different feature flags. In other words, this method prevents the same users from being assigned to the same percentage options for different feature flags.

:::info
The evaluation process is entirely implemented within the SDKs, meaning your users' sensitive data never leaves your system. The data flow is one-way – from ConfigCat CDN servers to your SDKs – and ConfigCat does not receive or store any attributes of the [User Object] passed to the SDKs. This design prioritizes the privacy and security of user data.
:::

### Example Scenarios for Percentage Options

Imagine you have two users, Jane and Joe, and you're experimenting with two different feature flags (`isTwitterSharingEnabled` and `isFacebookSharingEnabled`) that use percentage-based targeting. In these scenarios, we see how percentage options allows for a controlled and gradual rollout of features, ensuring a smooth transition for users like Jane and Joe.

First, the users are assigned a number between 0-99 based on the hash of their identifier and the feature flag's key. This number determines their eligibility for a feature based on the percentage options set on the Dashboard.

|      | isTwitterSharingEnabled                                                   | isFacebookSharingEnabled                                                    |
| ---- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Jane | `hash('Jane' + 'isTwitterSharingEnabled') mod 100` <br/> Results in **8** | `hash('Jane' + 'isFacebookSharingEnabled') mod 100` <br/> Results in **64** |
| Joe  | `hash('Joe' + 'isTwitterSharingEnabled') mod 100` <br/> Results in **32** | `hash('Joe' + 'isFacebookSharingEnabled') mod 100` <br/> Results in **12**  |

1. **Initial Setup: 0% ON / 100% OFF**

|      | isTwitterSharingEnabled <br/> 0% ON / 100% OFF | isFacebookSharingEnabled <br/> 0% ON / 100% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 >= 0 <br/>-> **OFF**                         | 64 >= 0 <br/>-> **OFF**                         |
| Joe  | 32 >= 0 <br/>-> **OFF**                        | 12 >= 0 <br/>-> **OFF**                         |

2. **Adjustment to 10% ON / 90% OFF**
In this case both feature flags are enabled for only 10% of users.

|      | isTwitterSharingEnabled <br/> 10% ON / 90% OFF | isFacebookSharingEnabled <br/> 10% ON / 90% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 10 <br/>-> **ON**                          | 64 >= 10 <br/>-> **OFF**                        |
| Joe  | 32 >= 10 <br/>-> **OFF**                       | 12 >= 10 <br/>-> **OFF**                        |

:::info
Despite both feature flags being set to 10% ON / 90% OFF, the `isTwitterSharingEnabled` feature flag is only enabled for Jane. Because Jane and Joe have different identifiers, they're assigned different numbers, determining their eligibility for each feature.
:::

3. **Increasing `isTwitterSharingEnabled` to 40% ON / 60% OFF**

|      | isTwitterSharingEnabled <br/> 40% ON / 60% OFF | isFacebookSharingEnabled <br/> 10% ON / 90% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 40 <br/>-> **ON**                          | 64 >= 10 <br/>-> **OFF**                        |
| Joe  | 32 < 40 <br/>-> **ON**                         | 12 >= 10 <br/>-> **OFF**                        |

4. **Rolling Back to a Safer 10% ON / 90% OFF**
> Same setup as in Step 2.
There are cases when you want to roll back a feature flag to a safer state. In this case, you can change the percentage options to 10% ON / 90% OFF. The sticky nature of percentage-based targeting ensures that the same user base is served **ON** as in Step 2, not another random 10% of users.

|      | isTwitterSharingEnabled <br/> 10% ON / 90% OFF | isFacebookSharingEnabled <br/> 10% ON / 90% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 10 <br/>-> **ON**                          | 64 >= 10 <br/>-> **OFF**                        |
| Joe  | 32 >= 10 <br/>-> **OFF**                       | 12 >= 10 <br/>-> **OFF**                        |

5. **Final Step: Moving to 100% ON / 0% OFF**

After testing the feature flags, you can safely move them to 100% ON. This ensures that all users are receiving the features.

|      | isTwitterSharingEnabled <br/> 100% ON / 0% OFF | isFacebookSharingEnabled <br/> 100% ON / 0% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 100 <br/>-> **ON**                         | 64 < 100 <br/>-> **ON**                         |
| Joe  | 32 < 100 <br/>-> **ON**                        | 12 < 100 <br/>-> **ON**                         |