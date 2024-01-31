---
id: percentage-options
title: Percentage Options
description: Using Percentage Options, you can define if a certain percentage of users should receive a specific value for a feature flag or setting. This way, you can gradually release a new feature to a subset of users.
---

## What are Percentage Options?

Using *Percentage Options*, you can define if a certain percentage of users should receive a specific value for a feature flag or setting. This way, you can gradually release a new feature to a subset of users. Instead of releasing a feature to all users simultaneously, a specific percentage of users are selected to receive access to the feature. This allows developers to control and monitor the impact of the new feature in a controlled manner.

## How to add Percentage Options?

You can add Percentage Options to a feature flag on the Dashboard by clicking on the `+%` button.

![Add percentage option](/assets/targeting/percentage-options/add-percentage-option.jpg)

## How does it work? - Anatomy of a percentage option

The grouping is random and based on the [User Object]'s identifier by default. You can also use [other user attributes] to evaluate the Percentage Options. Percentage options are designed to be **consistent** and **sticky** across all SDKs, ensuring a reliable experience.
- **Sticky** means the same user will always get the same value for a specific feature flag and for a certain Percentage Option set. Read more below.
- **Consistent** means that the same user will always get the same value for a specific feature flag across all SDKs. Read more below.

If the required attribute is not present in the [User Object], the [fallback value] will be served.

Read more about the technical details of the [percentage evaluation here].

Percentage-based targeting consists of **% value** and the **Served value** pairs.

### % value

Any _number between 0 and 100_ that represents a randomly allocated fraction of your users.

### Served value

The exact value will be served to the users that fall into that fraction.

## Multiple Percentage Options

### On/Off Toggle

When the Setting Kind is On/Off Toggle, the number of options must be 2. One for the _On_ and one for the _Off_ state.

### Text and Number

When the Setting Kind is _Text_, _Whole Number_, or _Decimal Number_, the maximum number options depend on your subscription plan. You can add/remove options by clicking the _Actions_ icon.

> The sum of all _% values_ must be equal to 100.

### All other cases

This value will be served as a fallback if none of the above rules apply or a [User Object](advanced/user-object) was not passed to the [ConfigCat SDK](sdk-reference/overview) correctly within your application.

## Percentage options in combination with targeting rules

Percentage options can be used in combination with targeting rules. In this case, the Percentage Options will be evaluated after the targeting rule only on the users that matched the targeting rule.

![Percentage options with targeting rules](/assets/targeting/percentage-options/percentage-options-with-targeting-rules.jpg)

## Percentage Evaluation Attribute

The *Percentage Evaluation Attribute* is the attribute that is used to split the users into groups. The Percentage Evaluation Attribute is the [User Object]'s `Identifier` attribute by default. You can also use other user attributes as the basis of the grouping (see an [example use case] below).

### How to change the Percentage Attribute?

Click the 3 dots on the top right corner of the feature flag and select the **Change Percentage Attribute** option.

> Changing the Percentage Attribute will be valid for all Percentage Options within the feature flag.

![Change Percentage Attribute](/assets/targeting/percentage-options/change-percentage-attribute.jpg)

## Stickiness

Stickiness means that the same user will always get the same value for a specific feature flag, no matter the history of the feature flag. This is achieved by implementing a deterministic hashing algorithm based on the feature flag's key and the Percentage Evaluation Attribute.

*For example, if you have a feature flag with a percentage option of `20%` `ON`, then you change the percentage option to `40%` `ON`, and then back to `20%` `ON`, the same `20%` of users will get the `ON` value for the feature flag just like the first time.*

## Consistency

Consistency means that the same user will always get the same value for a specific feature flag, no matter which SDK they use. This is achieved by using the same hashing algorithm across all SDKs.

*For example, if you have a feature flag with a percentage option of `20%` `ON`, then the same `20%` of users will get the `ON` value across all SDKs. No matter if a user is on iOS, Android, or Web, they will always get the same value for the feature flag.*

The same user might get different values in the case of different feature flags. The hashing algorithm is based on the feature flag's key and the Percentage Evaluation Attribute. The key of each feature flag is different.

*For example, if you have two feature flags with Percentage Options of `20%` `ON`, then a different `20%` of users will get the `ON` value for each feature flag.*

## Examples

### Simple phased rollout / Canary release / Percentage rollout Scenario

**Goal:** In our sample company (Whisker Co.), we want to release a new feature, `Enable Park Weather Info` to 20% of our users. We want to ensure the new feature is working as expected before we release it to everyone.

**Solution:** Have a percentage option of `20%` `ON`.

![Targeting Example 1](/assets/targeting/percentage-options/example1.jpg)

### A/B/C Testing Scenario

**Goal:** Let's test three variations of the `Discount Type`, each with 1/3rd of our users. We want to decide which variation is the most effective. 

**Solution:** A text setting with three options set to `33% / 33% / 34%` defines the different variations.

![Targeting Example 2](/assets/targeting/percentage-options/example2.jpg)

### Complex phased rollout / Canary release / Percentage rollout Scenario

**Goal:** In our sample company (Whisker Co.), we want to release a new feature, `Enable Park Weather Info` to all users within our `Whisker Co.` company `AND` `20%` of the rest of our users. We want to ensure the new feature is working as expected before we release it to everyone.

**Solution:** Have a percentage option of `20%` `ON` and a targeting rule that matches everyone whose email address ends with `@whisker.example`.

![Targeting Example 3](/assets/targeting/percentage-options/example3.jpg)

### Platform-specific phased rollout

**Goal:** Let's enable `Cafe Notifications` for 20% of our users on `iOS` and 60% of our users on `Android`.

**Solution:** Have a targeting rule that matches everyone whose `Platform` is `iOS` and a percentage option of `20%` `ON`. Have a targeting rule that matches everyone whose `Platform` is `Android` and a percentage option of `60%` `ON`.

![Targeting Example 4](/assets/targeting/percentage-options/example4.jpg)

### Percentage options based on other User Attributes

**Goal:** Let's imagine that at our sample company (Whisker Co.), we have a `Tenant ID` attribute that is used to identify the tenants of our users. We want to release a new feature, `Enable Park Weather Info`, to 20% of our users based on their `Tenant ID`.

**Solution:** Have a percentage option of `20%` `ON` and set the Percentage Attribute to `Tenant ID`.

![Targeting Example 4](/assets/targeting/percentage-options/example5.jpg)