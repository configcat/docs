---
id: targeting-rule-overview
title: Targeting Rule Overview
description: Targeting allows you to define targeting rules for feature flags. This way you can target a specific user group with a specific feature.
---

# Targeting Rules

## What are Targeting Rules?

Targeting rules allow you to set different feature flag or setting values for specific users or groups of users in your application. You can set conditions based on user attributes, feature flags, or segments within a targeting rule.


### AND and OR relationships

The conditions within a targeting rule are in an **AND** relationship, meaning that all of them must evaluate to true for the targeting rule to match.

The targeting rules are in an **OR** relationship, meaning that the targeting rule which matches first in order, from top to bottom, will provide the value of the feature flag.

## How to add a Targeting Rule?

*TODO - add screenshot and steps*

## How does it work? - Anatomy of a Targeting Rule

A targeting rule consists of two parts: the IF part and the THEN part.

*TODO - add screenshot*

### IF part

The IF part contains the conditions, which are logical expressions that evaluate to true or false.

The conditions are in an **AND** relationship, meaning that all of them must evaluate to true for the targeting rule to match.

The conditions can be added to the targeting rule on the Dashboard. There are three types of conditions:
- [User conditions - User attribute based targeting]
- [Prerequisite conditions - Feature flag based targeting]
- [Segment conditions - Segment based targeting]

### THEN part

The THEN part contains the setting value that will be used if the targeting rule matches. The setting value can be a simple value or a [percentage-based value].
If the targeting rules do not match or no [Uer Object] is given, the fallback value ("To Unidentified" / "To all other") will be used.

## Multiple targeting rules and ordering
You can add multiple targeting rules to a feature flag. The targeting rules are evaluated in order, from top to bottom.
The targeting rules are in an **OR** relationship, meaning that if a targeting rule matches, the other targeting rules will not be evaluated.

### How to change the order of the targeting rules?

The order of the targeting rules can be changed on the Dashboard.

*TODO - add screenshot and steps*

## Examples

### Single targeting rule

*TODO - add screenshot and steps*

### Multiple targeting rules

*TODO - add screenshot and steps*