---
id: targeting-rule-overview
title: Targeting Rule Overview
description: Targeting rules allow you to set different feature flag or setting values for specific users or groups of users in your application.
---

# Targeting Rule

## What is a Targeting Rule?

Targeting rules allow you to set different feature flag or setting values for specific users or groups of users in your application. You can set conditions based on user attributes, feature flags, or segments within a targeting rule.

### AND and OR relationships

The conditions within a targeting rule are in an **AND** relationship, meaning that all of them must evaluate to true for the targeting rule to match.

The targeting rules are in an **OR** relationship, meaning that the targeting rule which matches first in order, from top to bottom, will provide the value of the feature flag.

## How to add a Targeting Rule?

You can add a targeting rule to a feature flag on the Dashboard by clicking on the `+IF` ("Add targeting rule") button.
![Add targeting rule](/assets/targeting/targeting-rule/add-rule.jpg)

## How does it work? - Anatomy of a Targeting Rule

A targeting rule consists of two parts: the **IF part** and the **THEN part**.

![Targeting rule anatomy](/assets/targeting/targeting-rule/targeting-rule.jpg)

### IF part

The IF part contains the conditions, which are logical expressions that evaluate to true or false.

The conditions are in an **AND** relationship, meaning that all of them must evaluate to true for the targeting rule to match.

The conditions can be added to the targeting rule on the Dashboard. There are three types of conditions:
- [User condition](/targeting/targeting-rules/user-condition) - User attribute based targeting.
- [Flag condition (Prerequisite)](/targeting/targeting-rules/) - Feature flag based targeting.
- [Segment condition](/targeting/targeting-rules/segment-condition) - Segment based targeting.

### THEN part

The THEN part contains either a value or percentage options that will be used to determine the result of the feature flag when the rule matches.

## Multiple targeting rules and ordering
You can add multiple targeting rules to a feature flag. The targeting rules are evaluated in order, from top to bottom.
The targeting rules are in an **OR** relationship, meaning that the targeting rule which matches first in order, from top to bottom, will provide the value of the feature flag.

### How to change the order of the targeting rules?

The order of the targeting rules can be changed on the Dashboard.

*TODO - add screenshot and steps*

## Examples

### Single targeting rule

*TODO - add screenshot and steps*

### Multiple targeting rules

*TODO - add screenshot and steps*