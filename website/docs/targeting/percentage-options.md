---
id: percentage-options
title: Percentage Options
description: Percentage options are used to define the percentage of users that will receive a specific value for a feature flag or setting. This way you can gradually release a new feature to a subset of users.
---

## What are Percentage Options?

Percentage options are used to define the percentage of users that will receive a specific value for a feature flag or setting. This way you can gradually release a new feature to a subset of users. Instead of releasing a feature to all users at once, a specific percentage of users are selected to receive access to the feature. This allows developers to control and monitor the impact of the new feature in a controlled manner.

## How to add Percentage Options?

*TODO - add screenshot and steps*

1. <a href="https://app.configcat.com/auth/login" target="_blank">Log in</a> to access the _Dashboard_
2. Go to **Feature Flags & Settings**
3. Select **TARGET % OF USERS** after clicking the actions icon.

<img src="/docs/assets/targeting-2.png" className="zoomable" alt="targeting-2" />

## How does it work? - Anatomy of a percentage option

The grouping is random and based on the [User Object]'s identifier by default. You can also use [other user attributes] to evaluate the percentage options. Percentage options are designed to be **consistent** and **sticky** across all SDKs, ensuring a reliable experience.
- **Sticky** means that the same user will always get the same value for a specific feature flag.
- **Consistent** means that the same user will always get the same value for a specific feature flag across all SDKs.

If the required attribute is not present in the [User Object], the [fallback value] will be served.

Read more about the technical details of the [percentage evaluation here].

Percentage-based targeting consists of **% value** and the **Served value** pairs.

*TODO - add screenshot*

### % value

Any _number between 0 and 100_ that represents a randomly allocated fraction of your users.

### Served value

The exact value that will be served to the users that fall into that fraction.

## Multiple percentage options

### On/Off Toggle

When the Setting Kind is On/Off Toggle, the number of options must be 2. One for the _On_ and one for the _Off_ state.

### Text and Number

When the Setting Kind is _Text_, _Whole Number_, or _Decimal Number_ the maximum number options depend on your subscription plan. You can add/remove options by clicking the _Actions_ icon.

> The sum of all _% values_ must be equal to 100.

### All other cases

This value will be served as a fallback if none of the above rules apply or a [User Object](advanced/user-object) was not passed to the [ConfigCat SDK](sdk-reference/overview) correctly within your application.

## Percentage options in combination with targeting rules

Percentage options can be used in combination with targeting rules. In this case, the percentage options will be evaluated after the targeting rule only on the users that matched the targeting rule.

*TODO - add screenshot*

## Percentage options based on other User Attributes

By default the percentage-based targeting is based on the User's `Identifier` attribute. You can also use other user attributes to evaluate the percentage-based targeting.

You can change the evaluation attribute by clicking the 3 dots on the top right corner of the feature flag and select the **Change percentage attribute** option.

### How to change the percentage attribute?

*TODO - add screenshot*

# Examples

*TODO - add screenshot and steps* pl. “ha a User.Identifierben ezt az X értéket adják be, akkor ebbe a csoportba kerül, ha azt az Y értéket, akkor meg abba a csoportba”

example: 
- toggle: 20%, 80%
- text, A/B/C
- sensitiveeknek nem a tobbinek: 20%, 80%
- ios: 20%/80% , android: 30%/70%
- percentage attribute legyen tenant id, onnantol a tenanton tudok kiserletezni