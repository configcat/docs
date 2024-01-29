---
id: flag-condition
title: Flag Condition (Prerequisite)
description: A prerequisite feature flag is a type of feature flag that is used to control the availability of another feature flag.
---

## What is a flag condition? What is a prerequisite flag?

A *flag condition* is a condition that is based on the comparison of another feature flag's value and a preset value (*comparison value*). In other words, a flag condition creates a dependency between the feature flag containing the condition (*dependent flag*) and another feature flag (*prerequisite flag*, aka. master feature flag, master switch, inter-dependent feature flag, global toggle, etc.)

This allows you to control the value of multiple feature flags by changing the value of a single, central feature flag. Prerequisite flags are particularly useful for managing complex feature dependencies and ensuring a smooth user experience during feature rollouts.

## How does the flag condition work?

The prerequisite flag is evaluated with the same user object as the one that is used to evaluate the dependent flag, then the result is checked against the comparator that you set on the Dashboard. 

The prerequisite flag can be other than a feature flag (boolean setting), in which case the prerequisite flag's evaluated value will be compared to the comparison value that you set on the Dashboard. The comparison is done according to the selected comparator and will result in true or false. This will be the result of the condition.

For more details on the evaluation of flag conditions, please refer to [Setting Evaluation].

## How to set a flag condition?

You can set a flag condition for a feature flag on the ConfigCat Dashboard. The prerequisite feature flag can be any feature flag that is already defined in the same config on the Dashboard. You can also set a comparison value that the prerequisite feature flag's value will be compared to.

![Flag condition](/assets/targeting/targeting-rule/flag-condition/flag-condition.jpg)

## Anatomy of a flag condition

#### Prerequisite is a feature flag (boolean setting)
![Flag condition anatomy 1](/assets/targeting/targeting-rule/flag-condition/flag-condition-anatomy1.jpg)

#### Prerequisite is a string, number or double setting
![Flag condition anatomy 2](/assets/targeting/targeting-rule/flag-condition/flag-condition-anatomy2.jpg)

A flag condition consists of the following: 

- **Prerequisite feature flag or setting key**: The feature flag or setting key that the condition is based on.
- **Comparator**: The comparison operator that defines the relation between the prerequisite flag's value and the comparison value. See the available comparators below.
- **Comparison value**: Only available for string, number and double settings. The value that the prerequisite flag's value is compared to.

## Comparators

Different comparators are available for different types of prerequisites.

When the prerequisite is a feature flag (boolean setting), the following comparators are available:

| Comparator | Description                                           |
| ---------- | ----------------------------------------------------- |
| IS ON      | It matches when the prerequisite flag is ON.  |
| IS OFF     | It matches when the prerequisite flag is OFF. |

When the prerequisite is a string, number or double setting the following comparators are available:

| Comparator          | Description                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------- |
| EQUALS (hashed)     | It matches when the prerequisite flag's value is equal to the comparison value.     |
| NOT EQUALS (hashed) | It matches when the prerequisite flag's value is not equal to the comparison value. |

## Example

### Prerequisite flag is a feature flag

#### Intent
In our mobile app let's have `Cafe Notifications` enabled only if `Cafe Ratings` are enabled. So users will only receive notifications about their favorite cafes if they can rate them.

#### Solution
In this case, `Cafe Ratings` is the prerequisite flag. The comparator is `IS ON`, which means that the `Cafe Notifications` feature flag will be enabled only if the `Cafe Ratings` feature flag is ON.

#### Dashboard
![Flag condition example](/assets/targeting/targeting-rule/flag-condition/flag-condition-example.jpg)