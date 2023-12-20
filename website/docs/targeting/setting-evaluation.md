---
id: setting-evaluation
title: Setting Evaluation
description: This document offers an in-depth guide on how the SDK determines the value of a setting.
---

# Setting Evaluation

This document offers an in-depth guide on how the SDK determines the value of a setting when the `GetValue` call is made. Understanding this process requires prior knowledge of targeting concepts.

The setting's value is influenced by:

- Rules established on the Dashboard,
- The [User Object](TODO) provided to the `GetValue` function, and
- The default value assigned in the `GetValue` function.

The setting's value is derived from exactly one rule, following this algorithm:

1. **Targeting Rules Assessment:** If targeting rules are present, the SDK evaluates each one sequentially. It checks if the user meets the conditions in the rule's IF section.
   - If the conditions are met, the THEN section sets the value, which is then returned. Note: If the THEN section involves a [Percentage option](TODO) and the necessary user attribute is missing, the SDK will bypass this rule and proceed.
   - If the conditions aren't met, the SDK moves to the next targeting rule or to step 2 (below) if there are no more rules.
2. **Percentage Option Rule:** If a percentage option rule exists, the SDK calculates the value based on the [Evaluation of percentage options](TODO) algorithm and returns it. If the necessary user attribute is missing, the SDK skips to step 3 (below).
3. **Default Value Assignment:** At this stage, the only remaining option is the default value specified at the end of the setting, which the SDK then returns.

In the event of an unexpected error during evaluation, the SDK defaults to the value provided in the `GetValue` function.

## Evaluation of a Targeting Rule

The SDK sequentially checks each targeting rule. A condition can be evaluated as `true`, `false`, or `indeterminable (cannot evaluate)`.

Indeterminable results occur if the necessary user attribute is missing or incorrectly formatted (the SDK logs these instances as warnings).

A rule is considered a match only if all conditions are true. Otherwise, it's not a match.

### Evaluation of a User Condition

The SDK compares the user attribute from the [User Object](TODO) with the condition set on the dashboard using the specified comparator. This comparison yields a `true` or `false` outcome.

If the necessary user attribute is missing or incorrectly formatted, the outcome is `indeterminable (cannot evaluate)`.

### Evaluation of a Prerequisite Flag Condition

The SDK evaluates the prerequisite flag as a separate setting using the same [User Object](TODO). The result of this evaluation is compared with the Dashboard's set value using the specified comparator, resulting in a `true` or `false` outcome.

If an error occurs during this evaluation, the process stops, and the SDK returns the default value.

### Evaluation of a Segment Condition

The SDK evaluates segment conditions similarly to [user conditions](TODO).

If the user condition is `true` and the comparator is `IS IN SEGMENT`, or if the user condition is `false` and the comparator is `IS NOT IN SEGMENT`, the segment condition yields `true`.

Conversely, if the user condition is `false` and the comparator is `IS IN SEGMENT`, or if the user condition is `true` and the comparator is `IS NOT IN SEGMENT`, the segment condition yields `false`.

If the user condition is `indeterminable (cannot evaluate)`, so is the segment condition.

## Evaluation of Percentage Options

Percentage options are designed to be consistent and sticky across all SDKs, ensuring a reliable experience.

This approach primarily relies by default on the identifier ([this can be changed to any attribute](TODO)) from the [User Object](TODO) provided to the SDK's `getValue()` function. Here's how it works:
- The SDKs create a hash from the combination of the [User Object](TODO)'s attribute and the specific feature flag's `Key`.
- This hash process assigns a unique 0-99 number to each User for a specific feature flag.
- The assigned number determines the user's eligibility for a feature flag based on the percentage options set on the Dashboard.
- Importantly, this number remains fixed and consistent for each User across all SDKs, ensuring uniformity in feature flag evaluation.

:::caution
By hashing both the User's attribute and the feature flag's key, we ensure diverse user bases for different feature flags. This method prevents the same group of users from being repeatedly targeted across various feature flags.
:::

:::info
The evaluation process is entirely contained within the SDKs, meaning your User's sensitive data never leaves your system. The data flow is one-way – from ConfigCat CDN servers to your SDKs – and ConfigCat does not receive or store any attributes of the [User Object](TODO) passed to the SDKs. This design prioritizes the privacy and security of user data.
:::

### Percentage Evaluation Attribute

The default attribute used for percentage evaluation is the [User Object](TODO)'s `Identifier`. However, you can change this to any attribute you want.

*TODO - Where and how to change this*

### Example Scenarios for Percentage-Based Targeting

Imagine you have two users, Jane and Joe, and you're experimenting with two different feature flags that use percentage-based targeting.

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

|      | isTwitterSharingEnabled <br/> 10% ON / 90% OFF | isFacebookSharingEnabled <br/> 10% ON / 90% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 10 <br/>-> **ON**                          | 64 >= 10 <br/>-> **OFF**                        |
| Joe  | 32 >= 10 <br/>-> **OFF**                       | 12 >= 10 <br/>-> **OFF**                        |

:::caution
Notice how, despite both feature flags being set to 10% ON / 90% OFF, Jane is only enabled for the `isTwitterSharingEnabled` feature flag.
:::

3. **Increasing `isTwitterSharingEnabled` to 40% ON / 60% OFF**

|      | isTwitterSharingEnabled <br/> 40% ON / 60% OFF | isFacebookSharingEnabled <br/> 10% ON / 90% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 40 <br/>-> **ON**                          | 64 >= 10 <br/>-> **OFF**                        |
| Joe  | 32 < 40 <br/>-> **ON**                         | 12 >= 10 <br/>-> **OFF**                        |

4. **Rolling Back to a Safer 10% ON / 90% OFF**

|      | isTwitterSharingEnabled <br/> 10% ON / 90% OFF | isFacebookSharingEnabled <br/> 10% ON / 90% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 10 <br/>-> **ON**                          | 64 >= 10 <br/>-> **OFF**                        |
| Joe  | 32 >= 10 <br/>-> **OFF**                       | 12 >= 10 <br/>-> **OFF**                        |

> The sticky nature of percentage-based targeting ensures that the same user base is toggled **ON** as in step 2.

5. **Final Step: Moving to 100% ON / 0% OFF**

|      | isTwitterSharingEnabled <br/> 100% ON / 0% OFF | isFacebookSharingEnabled <br/> 100% ON / 0% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 100 <br/>-> **ON**                         | 64 < 100 <br/>-> **ON**                         |
| Joe  | 32 < 100 <br/>-> **ON**                        | 12 < 100 <br/>-> **ON**                         |

In these scenarios, we see how percentage-based targeting allows for a controlled and gradual rollout of features, ensuring a smooth transition for users like Jane and Joe.


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
---
