---
id: flag-condition
title: Flag Condition (Prerequisite)
description: A prerequisite feature flag is a type of feature flag that is used to control the availability of another feature flag.
---

## What is a flag condition? What is a prerequisite flag?

A *flag condition* is a condition that is based on the comparison of another feature flag's value and a preset value (*comparison value*). In other words, a flag condition creates a dependency between the feature flag containing the condition (*dependent flag*) and another feature flag (*prerequisite flag*, aka. master feature flag, master switch, inter-dependent feature flag, global toggle, etc.)

This allows you to control the value of multiple feature flags by changing the value of a single, central feature flag. Prerequisite flags are particularly useful for managing complex feature dependencies and ensuring a smooth user experience during feature rollouts.

## How does it work?

The prerequisite feature flag is evaluated first before the dependent feature flag is evaluated with the same User Object. The prerequisite feature flag's value is then compared to the comparison value that you set on the Dashboard. If the prerequisite feature flag's value is equal to the comparison value, the dependent feature flag is enabled. Otherwise, the dependent feature flag is disabled.

## How to set a flag condition?

You can set a flag condition for a feature flag on the ConfigCat Dashboard. The prerequisite feature flag can be any feature flag that is already defined on the Dashboard. You can also set a comparison value that the prerequisite feature flag's value will be compared to.

> TODO add steps and screenshot

## Comparators

Different comparators are available for different types of prerequisites.

When the prerequisite is a feature flag (boolean setting), the following comparators are available:

| Comparator | Description                                           |
| ---------- | ----------------------------------------------------- |
| IS ON      | It matches when the prerequisite feature flag is ON.  |
| IS OFF     | It matches when the prerequisite feature flag is OFF. |

When the prerequisite is a string, number or double setting the following comparators are available:

| Comparator          | Description                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------- |
| EQUALS (hashed)     | It matches when the prerequisite feature flag's value is equal to the comparison value.     |
| NOT EQUALS (hashed) | It matches when the prerequisite feature flag's value is not equal to the comparison value. |

## Example

> TODO add screenshot and explanation