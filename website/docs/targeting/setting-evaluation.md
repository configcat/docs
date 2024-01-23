---
id: setting-evaluation
title: Setting Evaluation
description: This document offers an in-depth guide on how the SDK determines the value of a setting.
---

# Setting Evaluation

This document offers an in-depth guide on how the SDK determines the value of a setting when the `GetValue` call is made. Understanding this process requires prior knowledge of targeting concepts.

The setting's value is influenced by:

- Rules established on the Dashboard,
- The [User Object] provided to the `GetValue` function, and
- The `default value` assigned in the `GetValue` function.

The setting's value is derived from exactly one rule, following this algorithm:

1. **Targeting Rules Assessment:** If targeting rules are present, the SDK evaluates each one sequentially. It checks if the user meets the conditions in the rule's IF section.
   - If the conditions are met, the THEN section sets the value, which is then returned. Note: If the THEN section involves a [Percentage option] and the necessary user attribute is missing, the SDK will bypass this rule and proceed.
   - If the conditions aren't met, the SDK moves to the next targeting rule or to step 2 (below) if there are no more rules.
2. **Percentage Option Rule:** If a percentage option rule exists, the SDK calculates the value based on the [Evaluation of percentage options] algorithm and returns it. If the necessary user attribute is missing, the SDK skips to step 3 (below).
3. **Default Value Assignment:** At this stage, the only remaining option is the default value specified at the end of the setting, which the SDK then returns.

In the event of an unexpected error during evaluation, the SDK defaults to the value provided in the `GetValue` function.

## Evaluation of a Targeting Rule

The SDK sequentially checks each targeting rule. A condition can be evaluated as `true`, `false`, or `indeterminable (cannot evaluate)`.

Indeterminable results occur if the necessary user attribute is missing or incorrectly formatted (the SDK logs these instances as warnings).

A rule is considered a match only if all conditions are true. Otherwise, it's not a match.

### Evaluation of a User Condition

The SDK compares the user attribute from the [User Object] with the condition set on the Dashboard using the specified comparator. This comparison yields a `true` or `false` outcome.

If the necessary user attribute is missing or incorrectly formatted, the outcome is `indeterminable (cannot evaluate)`.

### Evaluation of a Prerequisite Flag Condition

The SDK evaluates the prerequisite flag as a separate setting using the same [User Object]. The result of this evaluation is compared with the Dashboard's set value using the specified comparator, resulting in a `true` or `false` outcome.

If an error occurs during this evaluation, the process stops, and the SDK returns the default value.

### Evaluation of a Segment Condition

The SDK evaluates segment conditions similarly to [user conditions].

If the user condition is `true` and the comparator is `IS IN SEGMENT`, or if the user condition is `false` and the comparator is `IS NOT IN SEGMENT`, the segment condition yields `true`.

Conversely, if the user condition is `false` and the comparator is `IS IN SEGMENT`, or if the user condition is `true` and the comparator is `IS NOT IN SEGMENT`, the segment condition yields `false`.

If the user condition is `indeterminable (cannot evaluate)`, so is the segment condition.

## Evaluation of Percentage Options

Percentage options are designed to be consistent and sticky across all SDKs, ensuring a reliable experience.

This approach primarily relies by default on the identifier ([this can be changed to any attribute]) from the [User Object] provided to the SDK's `getValue()` function. Here's how it works:
- The SDKs create a hash from the combination of the [User Object]'s attribute and the specific feature flag's `Key`.
- This hash process assigns a unique 0-99 number to each User for a specific feature flag.
- The assigned number determines the user's eligibility for a feature flag based on the percentage options set on the Dashboard.
- Importantly, this number remains fixed and consistent for each User across all SDKs, ensuring uniformity in feature flag evaluation.

:::caution
By hashing both the User's attribute and the feature flag's key, we ensure diverse user bases for different feature flags. This method prevents the same group of users from being repeatedly targeted across various feature flags.
:::

:::info
The evaluation process is entirely implemented within the SDKs, meaning your users' sensitive data never leaves your system. The data flow is one-way – from ConfigCat CDN servers to your SDKs – and ConfigCat does not receive or store any attributes of the [User Object] passed to the SDKs. This design prioritizes the privacy and security of user data.
:::

### Percentage Evaluation Attribute

The default attribute used for percentage evaluation is the [User Object]'s `Identifier`. However, you can change this to any attribute you want.

*TODO - Where and how to change this*

### Example Scenarios for Percentage-Based Targeting

Imagine you have two users, Jane and Joe, and you're experimenting with two different feature flags (`isTwitterSharingEnabled` and `isFacebookSharingEnabled`) that use percentage-based targeting. In these scenarios, we see how percentage-based targeting allows for a controlled and gradual rollout of features, ensuring a smooth transition for users like Jane and Joe.

First, the users are assigned a number between 0-99 based on the hash of their identifier and the feature flag's key. This number determines their eligibility for a feature flag based on the percentage options set on the Dashboard.

|      | isTwitterSharingEnabled                                                   | isFacebookSharingEnabled                                                    |
| ---- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Jane | `hash('Jane' + 'isTwitterSharingEnabled') mod 100` <br/> Results in **8** | `hash('Jane' + 'isFacebookSharingEnabled') mod 100` <br/> Results in **64** |
| Joe  | `hash('Joe' + 'isTwitterSharingEnabled') mod 100` <br/> Results in **32** | `hash('Joe' + 'isFacebookSharingEnabled') mod 100` <br/> Results in **12**  |

1. **Initial Setting: 0% ON / 100% OFF**

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
Despite both feature flags being set to 10% ON / 90% OFF, Jane is only enabled for the `isTwitterSharingEnabled` feature flag. Because Jane and Joe have different identifiers, they're assigned different numbers, which determines their eligibility for each feature flag.
:::

3. **Increasing `isTwitterSharingEnabled` to 40% ON / 60% OFF**

|      | isTwitterSharingEnabled <br/> 40% ON / 60% OFF | isFacebookSharingEnabled <br/> 10% ON / 90% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 40 <br/>-> **ON**                          | 64 >= 10 <br/>-> **OFF**                        |
| Joe  | 32 < 40 <br/>-> **ON**                         | 12 >= 10 <br/>-> **OFF**                        |

4. **Rolling Back to a Safer 10% ON / 90% OFF**
> Same setup as in Step 2.
There are cases when you want to roll back a feature flag to a safer state. In this case, you can simply change the percentage options to 10% ON / 90% OFF. The sticky nature of percentage-based targeting ensures that the same user base is served **ON** as in Step 2, not another random 10% of users.

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


# Examples - TODO

## Simple feature flag

[Egy kőegyszerű ff kiértékelésének bemutatása]

## Percentage options

[Egy egyszerű percentage optionsös ff-en a %-os elosztás működésének bemutatása - ide jöhetne ez: https://configcat.com/docs/advanced/targeting/#example-1]

## Targeting rules with AND conditions

[Egy egyszerűbb, 2 targeting rule-os ff-en az OR és AND kapcsolatok működésének bemutatása]

## Segment condition

[Segment condition kiértékelésének bemutatása]

## Prerequisite flag condition

[Prerequisite flag condition kiértékelésének bemutatása]