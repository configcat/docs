---
id: flag-condition
title: Flag Condition (Prerequisite)
description: A Flag Condition is a condition that is based on the comparison of another feature flag's value and a preset value (comparison value).
---

## What is a Flag Condition? What is a prerequisite flag?

A *Flag Condition* is a condition that is based on the comparison of another feature flag's value and a preset value (*comparison value*). In other words, a Flag Condition creates a dependency between the feature flag containing the condition (dependent flag) and another feature flag (prerequisite flag, aka. master feature flag, master switch, inter-dependent feature flag, global toggle, etc.)

This allows you to control the value of multiple feature flags by changing the value of a single, central feature flag. Prerequisite flags are useful for managing complex feature dependencies and ensuring a smooth user experience during feature rollouts.

## How does the Flag Condition work?

The prerequisite flag is evaluated with the same user object as the one used to evaluate the dependent flag, and then the result is checked against the comparator that you set on the Dashboard. 

The prerequisite flag can be other than a feature flag (boolean setting), in which case the prerequisite flag's evaluated value will be compared to the comparison value that you set on the Dashboard. The comparison is done according to the selected comparator and will result in true or false. This will be the result of the condition.

For more details on the evaluation of Flag Conditions, please refer to the [feature flag evaluation](../../feature-flag-evaluation).

## How to set a Flag Condition?

You can set a Flag Condition for a feature flag on the ConfigCat Dashboard. The prerequisite flag can be any feature flag already defined in the same config on the Dashboard. In the case of settings other than feature flags (*boolean* settings), you can also set a comparison value to which the prerequisite flag's value will be compared.

![Flag Condition](/assets/targeting/targeting-rule/flag-condition/flag-condition.jpg)

## Anatomy of a Flag Condition

#### Prerequisite is a feature flag (boolean setting)
![Flag Condition anatomy 1](/assets/targeting/targeting-rule/flag-condition/flag-condition-anatomy1.jpg)

#### Prerequisite is a string, integer or double setting
![Flag Condition anatomy 2](/assets/targeting/targeting-rule/flag-condition/flag-condition-anatomy2.jpg)

A Flag Condition consists of the following: 

- **Prerequisite flag key**: The key of the feature flag (or setting) on which the condition is based.
- **Comparator**: The comparison operator that defines the relation between the prerequisite flag's value and the comparison value. See the available comparators below.
- **Comparison value**: Available only in the case of string, integer and double settings. The value that the prerequisite flag's value is compared to.

### Comparators

Different comparators are available for different types of prerequisites.

When the prerequisite is a feature flag (boolean setting), the following comparators are available:

| Comparator | Description                                           |
| ---------- | ----------------------------------------------------- |
| IS ON      | Checks whether the prerequisite flag is ON.  |
| IS OFF     | Checks whether the prerequisite flag is OFF. |

When the prerequisite is a string, integer or double setting, the following comparators are available:

| Comparator | Description                                                                                 |
| -----------| ------------------------------------------------------------------------------------------- |
| EQUALS     | Checks whether the prerequisite flag's value is equal to the comparison value.     |
| NOT EQUALS | Checks whether the prerequisite flag's value is not equal to the comparison value. |

## Example

### Prerequisite flag is a feature flag

#### Goal
In our mobile app, let's have `Cafe Notifications` enabled only if `Cafe Ratings` are enabled. So, users will only receive notifications about their favorite cafes if they can rate them.

#### Solution
In this case, `Cafe Ratings` is the prerequisite flag. The comparator is `IS ON`, meaning that the `Cafe Notifications` feature flag will be enabled only if the `Cafe Ratings` feature flag is ON.

On the Dashboard:
![Flag Condition example](/assets/targeting/targeting-rule/flag-condition/flag-condition-example.jpg)