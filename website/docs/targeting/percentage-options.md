---
id: percentage-options
title: Percentage Options
description: Using Percentage Options, you can define that a certain percentage of users should receive a specific value for a feature flag or setting. This way, you can gradually release a new feature to a subset of users.
---

## What are Percentage Options?

Using *Percentage Options*, you can define that a certain percentage of users should receive a specific value for a feature flag or setting. This way, you can gradually release a new feature to a subset of users. Instead of releasing a feature to all users simultaneously, a specific percentage of users are selected to receive access to the feature. This allows developers to control and monitor the impact of the new feature in a controlled manner.

## How to add Percentage Options?

You can add Percentage Options to a feature flag on the Dashboard by clicking on the `+%` button.

![Add Percentage Option](/assets/targeting/percentage-options/add-percentage-option.jpg)

## How does it work? - Anatomy of a Percentage Option

The grouping is random and based on the [User Object](../user-object)'s identifier by default. You can also use [other user attributes](#percentage-evaluation-attribute) to evaluate the Percentage Options. Percentage Options are designed to be **consistent** and **sticky** across all SDKs, ensuring a reliable experience.
- **Sticky** means the same user will always get the same value for a specific feature flag and for a certain Percentage Option set. Read more below.
- **Consistent** means that the same user will always get the same value for a specific feature flag across all SDKs. Read more below.

If the required attribute is not present in the Checks [User Object](../user-object) whether, the ["To unidentified" value](../targeting-overview/#to-all-users--to-all-other--to-unidentified-value) will be returned.

Read more about the technical details of the [percentage evaluation here](../feature-flag-evaluation/#evaluation-of-percentage-options).

Percentage Options are a list of **% value** and **Served value** pairs, where % values add up to 100.

### % value

Any _number between 0 and 100_ that represents a randomly allocated fraction of your users.

### Served value

The value that will be served to the users who fall into the group determined by the percentage.

## Number of Percentage Options

### On/Off Toggle

When the Setting Kind is On/Off Toggle, the number of options must be 2. One for the _On_ and one for the _Off_ state.

### Text and Number

When the Setting Kind is _Text_, _Whole Number_, or _Decimal Number_, the maximum number of options depends on your subscription plan. You can add/remove options by clicking the _Actions_ icon.

## Percentage Options in combination with Targeting Rules

Percentage Options can be used in combination with Targeting Rules. In this case, the Percentage Options will be evaluated only when the Targeting Rule matches. In other words, the Percentage Options apply only to the users that matched the Targeting Rule.

![Percentage Options with Targeting Rules](/assets/targeting/percentage-options/percentage-options-with-targeting-rules.jpg)

## Percentage Evaluation Attribute

The *Percentage Evaluation Attribute* is the attribute that is used to split the users into groups. The Percentage Evaluation Attribute is the [User Object's](../user-object) `Identifier` attribute by default. You can also use other user attributes as the basis of the grouping (see an example use case below).

### How to change the Percentage Attribute?

Click the 3 dots on the top right corner of the feature flag and select the **Change Percentage Attribute** option.

> Changing the Percentage Attribute will be valid for all Percentage Options within the feature flag.

![Change Percentage Attribute](/assets/targeting/percentage-options/change-percentage-attribute.jpg)

## Stickiness

Stickiness means that the same user will always get the same value for a specific feature flag, no matter the history of the feature flag. This is achieved by implementing a deterministic hashing algorithm based on the feature flag's key and the Percentage Evaluation Attribute.

*For example, if you have a feature flag with a Percentage Option of `20%` `ON`, then you change the Percentage Option to `40%` `ON`, and then back to `20%` `ON`, the same `20%` of users will get the `ON` value for the feature flag just like the first time.*

## Consistency

Consistency means that the same user will always get the same value for a specific feature flag, no matter which SDK they use. This is achieved by using the same hashing algorithm across all SDKs.

*For example, if you have a feature flag with a Percentage Option of `20%` `ON`, then the same `20%` of users will get the `ON` value across all SDKs. No matter if a user is on iOS, Android, or Web, they will always get the same value for the feature flag.*

## Randomness

The same user might get different values in the case of different feature flags. The hashing algorithm is based on the feature flag's key and the Percentage Evaluation Attribute. The key of each feature flag is different.

*For example, if you have two feature flags with Percentage Options of `20%` `ON`, then a different `20%` of users will get the `ON` value for each feature flag.*

## Examples

### Simple phased rollout / Canary release / Percentage rollout Scenario

#### Context
Our demo company, Whisker Co. is about to release a new feature called `Park Weather Info`. The stakeholders want to make sure that the new feature will be received well by the customers.

#### Goal
To get some feedback from our customers before releasing it to everyone, we initially want to make the feature available to `20%` of the customers only.

#### Solution
Let's create a feature flag called `Enable Park Weather Info` with Percentage Options set to `20%` `ON` and `80%` `OFF`.

![Targeting Example 1](/assets/targeting/percentage-options/example1.jpg)

### A/B/C Testing Scenario

#### Context
The marketing specialists at Whisker Co. want to introduce a discount method to encourage more purchases in the webshop. They have multiple ideas but, without data, they can't decide which is the most effective.

#### Goal
To learn which is the most effective discount method, we want to perform an A/B/C test.

#### Solution
We need a string or integer setting for this task because we need to represent 3 different variations. Let's create a string setting named `Discount Type` (as textual values tell more than numbers).

The go-to feature for A/B testing is Percentage Options. So let's add one with 3 options, each covering 1/3rd of our customers.

![Targeting Example 2](/assets/targeting/percentage-options/example2.jpg)

### Complex phased rollout / Canary release / Percentage rollout Scenario

#### Context
Whisker Co. is about to release a new feature called `Park Weather Info`. The stakeholders want to make sure that releasing the new feature will go smoothly and it will be received well by the customers.

#### Goal
To do some in-house testing and also get some feedback from our customers before releasing it to everyone, we initially want to make the feature available to the employees and to `20%` of the customers only.

#### Solution
Let's create a feature flag called `Enable Park Weather Info` with a Targeting Rule that matches employees at Whisker Co. and Percentage Options set to `20%` `ON` and `80%` `OFF` for the rest of the users (i.e. for the customers).

![Targeting Example 3](/assets/targeting/percentage-options/example3.jpg)

### Platform-specific phased rollout

#### Context
Whisker Co. is about to release a new feature called `Cafe Notifications` in their mobil app, which has an Android and an iOS version. We know that the user base of the iOS app is much larger than the Android app. The stakeholders want to make sure that the new feature will be received well by the customers.

#### Goal
To get some feedback from our customers before releasing it to everyone, we initially want to make the feature available to a limited number of customers only. We also want to release the feature to roughly the same number of Android and iOS users.

#### Solution
Let's create a feature flag called `Cafe Notifications` with two targeting rules: one that matches Android users and one that matches iOS users. Then change the THEN part of both to Percentage Options. Finally, set the percentages so that the feature is enabled for roughly the same number of users (e.g. 60% for `Android` users, 20% for `iOS` users).

![Targeting Example 4](/assets/targeting/percentage-options/example4.jpg)

### Percentage Options based on other User Attributes

#### Context
Let's imagine that at Whisker Co., we have a custom attribute named `Tenant ID` that is used to identify the tenants of our customers.

#### Goal
We want to release a new feature, `Park Weather Info`, to 20% of our customers based on their `Tenant ID`.

#### Solution
Let's create a feature flag called `Enable Park Weather Info` with Percentage Options set to `20%` `ON` and `80%` `OFF`. Finally, set the Percentage Evaluation Attribute to `Tenant ID`.

![Targeting Example 4](/assets/targeting/percentage-options/example5.jpg)