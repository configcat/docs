---
id: targeting-rule-overview
title: Targeting Rule Overview
description: Targeting rules allow you to set different feature flag or setting values for specific users or groups of users in your application.
---

# Targeting Rule

## What is a Targeting Rule?

*Targeting rules* allow you to set different feature flag or setting values for specific users or groups of users in your application. You can set conditions based on user attributes, feature flags, or segments within a targeting rule.

### AND and OR relationships

The conditions within a targeting rule are in an **AND** relationship, meaning that all of them must evaluate to `true` for the targeting rule to match.

The targeting rules are in an **OR** relationship, meaning that the targeting rule which matches first in order, from top to bottom, will provide the value of the feature flag.

## How to add a targeting rule?

You can add a targeting rule to a feature flag on the Dashboard by clicking on the `+IF` ("Add targeting rule") button. Add more targeting rules by clicking on the `+OR` button at the bottom of a targeting rule.
![Add targeting rule](/assets/targeting/targeting-rule/add-rule.jpg)

## How does it work? - Anatomy of a Targeting Rule

A targeting rule consists of an **IF part** and a **THEN part**.

![Targeting rule anatomy](/assets/targeting/targeting-rule/targeting-rule.jpg)

### IF part

The *IF part* contains the conditions, which are logical expressions that evaluate to `true` or `false`.

The conditions are in an **AND** relationship, meaning that all of them must evaluate to `true` for the targeting rule to match.

The conditions can be added to the targeting rule on the Dashboard. There are three types of conditions:
- [User condition](/targeting/targeting-rules/user-condition) - A condition that is based on some property of the user.
- [Flag condition (Prerequisite)](/targeting/targeting-rules/) - A condition that is based on the value of another feature flag.
- [Segment condition](/targeting/targeting-rules/segment-condition) - A condition that is based on a segment.

### THEN part

The THEN part contains either a value or Percentage Options that will be used to determine the result of the feature flag when the rule matches.

## Multiple targeting rules and ordering
The order of targeting rules matters because they are in an **OR** relationship, meaning that the targeting rule which matches first in order, from top to bottom, will provide the value of the feature flag.

### How to change the order of the targeting rules?

The order of the targeting rules can be changed on the Dashboard by dragging and dropping the targeting rules.

![Change targeting rule order](/assets/targeting/targeting-rule/reorder.jpg)