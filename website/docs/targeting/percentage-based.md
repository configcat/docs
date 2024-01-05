---
id: percentage-based
title: Percentage-based Targeting
description: With percentage-based user targeting is a technique used in software development and feature management to gradually release a new feature to a subset of users.
---

## What is Percentage-based Targeting?

Percentage-based targeting, also known as percentage rollouts or feature rollouts, is a technique used in software development and feature management to gradually release a new feature to a subset of users. Instead of releasing a feature to all users at once, a specific percentage of users are selected to receive access to the feature. This allows developers to control and monitor the impact of the new feature in a controlled manner.

## How to add a percentage-based targeting?

*TODO - add screenshot and steps*


### Enable feature

1. <a href="https://app.configcat.com/auth/login" target="_blank">Log in</a> to access the _Dashboard_
2. Go to **Feature Flags & Settings**
3. Select **TARGET % OF USERS** after clicking the actions icon.

<img src="/docs/assets/targeting-2.png" className="zoomable" alt="targeting-2" />

## How does it work? - Anatomy of a percentage-based targeting

The grouping is random and based on the [User Object](TODO)'s identifier by default. You can also use [other user attributes](TODO) to evaluate the percentage-based targeting. Percentage options are designed to be **consistent** and **sticky** across all SDKs, ensuring a reliable experience.
- **Sticky** means that the same user will always get the same value for a specific feature flag.
- **Consistent** means that the same user will always get the same value for a specific feature flag across all SDKs.

If the required attribute is not present in the [User Object](TODO), the [fallback value](TODO) will be served.

Read more about the technical details of the [percentage evaluation here](TODO).

Percentage-based targeting consists of **% value** and the **Served value** pairs.

*TODO - add screenshot*

### % value

Any _number between 0 and 100_ that represents a randomly allocated fraction of your users.

### Served value

The exact value that will be served to the users that fall into that fraction.

## Example

*TODO - add screenshot and steps* pl. “ha a User.Identifierben ezt az X értéket adják be, akkor ebbe a csoportba kerül, ha azt az Y értéket, akkor meg abba a csoportba”

## Multiple percentage options

### On/Off Toggle

When the Setting Kind is On/Off Toggle, the number of options must be 2. One for the _On_ and one for the _Off_ state.

### Text and Number

When the Setting Kind is _Text_, _Whole Number_, or _Decimal Number_ the maximum number options depend on your subscription plan. You can add/remove options by clicking the _Actions_ icon.

> The sum of all _% values_ must be equal to 100.

### All other cases

This value will be served as a fallback if none of the above rules apply or a [User Object](advanced/user-object.md) was not passed to the [ConfigCat SDK](sdk-reference/overview.md) correctly within your application.

## Percentage options based on other User Attributes

By default the percentage-based targeting is based on the User's `Identifier` attribute. You can also use other user attributes to evaluate the percentage-based targeting.

You can change the evaluation attribute by clicking the 3 dots on the top right corner of the feature flag and select the **Change percentage attribute** option.

*TODO - add screenshot*