---
id: targeting-rule-overview
title: Targeting Rule Overview
description: Targeting allows you to define targeting rules for feature flags. This way you can target a specific user group with a specific feature.
---

# Comparison-based Targeting Overview

## What is Comparison-based Targeting?

Comparison-based targeting allows you to define targeting rules for feature flags. This way you can target a specific user group with a specific feature. Using this feature you will be able to set different feature flag or setting values for different users in your application (based on the conditions you specify).

### AND and OR relationships

The conditions within a targeting rule are evaluated in an **AND** relationship, meaning that all of them must evaluate to true for the targeting rule to match. The targeting rules are in an **OR** relationship, meaning that if a targeting rule matches, the other targeting rules will not be evaluated.

## How to add a Targeting Rule?

*TODO - add screenshot and steps*

## How does it work? - Anatomy of a Targeting Rule

A targeting rule has two parts: the IF part and the THEN part.

*TODO - add screenshot*

### IF part

The IF part contains the conditions. The conditions are evaluated in order, from top to bottom. The first condition that matches the user will be used to determine the setting value.

The conditions are evaluated in an **AND** relationship, meaning that all of them must evaluate to true for the targeting rule to match.

The conditions can be added to the targeting rule in the dashboard. There three types of conditions:
- [User conditions - User attribute based targeting](TODO)
- [Prerequisite conditions - Feature flag based targeting](TODO)
- [Segment conditions - Segment based targeting](TODO)

### THEN part

The THEN part contains the setting value that will be used if the targeting rule matches. The setting value can be a simple value or a [percentage-based value](TODO).
If the targeting rules do not match or no [Uer Object](TODO) is given, the fallback value ("To Unidentified" / "To all other") will be used.

## Multiple targeting rules and ordering
You can add multiple targeting rules to a feature flag. The targeting rules are evaluated in order, from top to bottom.
The targeting rules are in an **OR** relationship, meaning that if a targeting rule matches, the other targeting rules will not be evaluated.

### How to change the order of the targeting rules?

The order of the targeting rules can be changed in the dashboard.

*TODO - add screenshot and steps*

## Examples

### Single targeting rule

*TODO - add screenshot and steps*

### Multiple targeting rules

*TODO - add screenshot and steps*