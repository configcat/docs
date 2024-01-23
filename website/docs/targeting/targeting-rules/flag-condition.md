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

The following comparators are available for flag conditions:

### Text comparators

:::note
In case **attribute is not passed** to the SDK or it's value is **falsy** (unknown, null, ""), targeting rule **evaluation will be skipped**.
:::

:::caution
Consider using Confidential text comparators if you are planning to target users by their sensitive information e.g: email address or company domain!
:::

| Comparator                   | Description                                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| IS ONE OF (cleartext)        | It matches when the comparison attribute is equal to any of the comparison values               |
| IS NOT ONE OF (cleartext)    | It matches when the comparison attribute is not equal to any of the comparison values.          |
| CONTAINS (cleartext)         | It matches when the comparison attribute contains any comparison values as a substring.         |
| DOES NOT CONTAIN (cleartext) | It matches when the comparison attribute does not contain any comparison values as a substring. |

### Confidential text comparators

We recommend using confidential text comparators especially in case of frontend applications targeting users based on sensitive data (like email addresses, names, etc).
In this case, the feature flag evaluation is performed using the SHA256 hashes of the values to ensure that the comparison values are not exposed. This can cause an increase in the size of the config.json file and the overall network traffic. It is recommended to use confidential comparators only when necessary.

| Comparator                      | Description                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------ |
| IS ONE OF (hashed)              | It matches when the comparison attribute is equal to any of the comparison values          |
| IS NOT ONE OF (hashed)          | It matches when the comparison attribute is not equal to any of the comparison values.     |

### Semantic version comparators

The following comparators assume that _Comparison attribute_ and _Comparison value_ contain semantic versions.
Evaluation is based on <a target="_blank" href="https://semver.org/">the SemVer Semantic Version Specification</a>.

| Comparator             | Description                                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| IS ONE OF (Semver)     | It matches when the comparison attribute interpreted as a semantic version is equal to any of the comparison values.         |
| IS NOT ONE OF (Semver) | It matches when the comparison attribute interpreted as a semantic version is not equal to any of the comparison values.     |
| < (Semver)             | It matches when the comparison attribute interpreted as a semantic version is less than the comparison value.                |
| <= (Semver)            | It matches when the comparison attribute interpreted as a semantic version is less than or equal to the comparison value.    |
| \> (Semver)            | It matches when the comparison attribute interpreted as a semantic version is greater than the comparison value.             |
| \>= (Semver)           | It matches when the comparison attribute interpreted as a semantic version is greater than or equal to the comparison value. |

All semantic version comparators return `false` if either _Comparison attribute_ or _Comparison value_ is not a valid <a target="_blank" href="https://semver.org/">semantic version</a>.

### Number comparators

The following comparators assume that _Comparison attribute_ and _Comparison value_ contain numbers.

| Comparator         | Description                                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| = (Number)         | It matches when the comparison attribute interpreted as a decimal number is equal to the comparison value.                 |
| <&#8203;> (Number) | It matches when the comparison attribute interpreted as a decimal number is not equal to the comparison value.             |
| < (Number)         | It matches when the comparison attribute interpreted as a decimal number is less than the comparison value.                |
| <= (Number)        | It matches when the comparison attribute interpreted as a decimal number is less than or equal to the comparison value.    |
| \> (Number)        | It matches when the comparison attribute interpreted as a decimal number is greater than the comparison value.             |
| \>= (Number)       | It matches when the comparison attribute interpreted as a decimal number is greater than or equal to the comparison value. |

All number comparators return `false` if either _Comparison attribute_ or _Comparison value_ is not a valid number.

## Example

> TODO add screenshot and explanation