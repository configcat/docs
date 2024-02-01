---
id: targeting-rule-overview
title: Targeting Rule Overview
description: Targeting Rules allow you to set different feature flag or setting values for specific users or groups of users in your application.
---

# Targeting Rule

## What is a Targeting Rule?

*Targeting Rules* allow you to set different feature flag or setting values for specific users or groups of users in your application. You can set conditions based on user attributes, feature flags, or segments within a Targeting Rule.

### AND and OR relationships

The conditions within a Targeting Rule are in an **AND** relationship, meaning that all of them must evaluate to true for the Targeting Rule to match.

The Targeting Rules are in an **OR** relationship, meaning that the Targeting Rule which matches first in order, from top to bottom, will provide the value of the feature flag.

## How to add a Targeting Rule?

You can add a Targeting Rule to a feature flag on the Dashboard by clicking on the `+IF` ("Add Targeting Rule") button. Add more Targeting Rules by clicking on the `+OR` button at the bottom of the Targeting Rule.
![Add Targeting Rule](/assets/targeting/targeting-rule/add-rule.jpg)

## How does it work? - Anatomy of a Targeting Rule

A Targeting Rule consists of an **IF part** and a **THEN part**.

![Targeting Rule anatomy](/assets/targeting/targeting-rule/targeting-rule.jpg)

### IF part

The *IF part* contains the conditions, which are logical expressions that evaluate to true or false.

The conditions are in an **AND** relationship, meaning that all of them must evaluate to true for the Targeting Rule to match.

The conditions can be added to the Targeting Rule on the Dashboard. There are three types of conditions:
- [User Condition](../user-condition) - A condition that is based on some property of the user.
- [Flag Condition (Prerequisite)](../flag-condition) - A condition that is based on the value of another feature flag.
- [Segment Condition](../segment-condition) - A condition that is based on a segment.

### THEN part

The *THEN part* contains either a value or Percentage Options that will be used to determine the result of the feature flag when the Targeting Rule matches.

## Multiple Targeting Rules and ordering
The order of Targeting Rules matters because they are in an **OR** relationship, meaning that the Targeting Rule which matches first in order, from top to bottom, will provide the value of the feature flag.

### How to change the order of the Targeting Rules?

The order of the Targeting Rules can be changed on the Dashboard by dragging and dropping the Targeting Rules.

![Change Targeting Rule order](/assets/targeting/targeting-rule/reorder.jpg)

## Examples

### AND relationship between Conditions

#### Context
In our demo company (Whisker Co.) we have a new feature in our mobile app that notifies frequent shopper cat owners about the cat-friendly cafés in the neighborhood. 

#### Goal
Since this feature is new, we want to make sure that only frequent shoppers and cat owners who have the right version of the app receive these notifications. The earlier versions of the app don't have this feature, so we want to make sure that anyone higher than version 3.0.0 receives the notifications.

#### Solution
We can achieve this by adding a Targeting Rule to the `Enable Cafe Notifications` feature flag. The Targeting Rule will have two conditions:
- User Condition: `AppVersion` is greater than `3.0.0`
- Segment Condition: `Frequent Shoppers`

On the Dashboard:
![Targeting Rule example](/assets/targeting/targeting-rule/and-example.jpg)

In the code:
```js
const userObject = {
  identifier: '<SOME USER ID>',
  email: userEmail,
  custom: { AppVersion: `<APP VERSION>` },
};
const value = await configCatClient.getValueAsync("enableCafeNotifications", false, userObject);
```