---
id: user-condition
title: User Condition
description: A user condition is a condition that is based on the comparison of a user attribute and a preset value (comparison value). It allows you to define Targeting Rules which target users based on their properties.
---

## What is a user condition?

A *user condition* is a condition that is based on the comparison of a user attribute and a preset value (*comparison value*). It allows you to define Targeting Rules which target users based on their properties.

## How does the user condition work?

The *comparison attribute*'s value from the [User Object](../../user-object) is compared to the *comparison value* you set on the Dashboard. The comparison is done according to the selected comparator and will result in true or false. This will be the result of the condition.

For more details on the evaluation of user conditions, please refer to the [feature flag evaluation](../../feature-flag-evaluation).

## How to set a user condition?

You can add a Targeting Rule with a condition on the Dashboard by clicking on the `+IF` ("Add Targeting Rule") button. Add more conditions by clicking on the `+AND` button.

![Add user condition](/assets/targeting/targeting-rule/user-condition/user-condition.jpg)

## Anatomy of a User Condition

![User condition anatomy](/assets/targeting/targeting-rule/user-condition/user-condition-anatomy.jpg)

A *user condition* consists of three parts:

- **Comparison attribute:** The user attribute on which the condition is based. Could be "User ID", "Email", "Country", or any custom attribute.
- **Comparator:** The comparison operator that defines the relation between the comparison attribute and the comparison value.
- **Comparison value:** The preset value to which the comparison attribute is compared. Depending on the comparator, could be a string, a list of strings, a number, a semantic version, a list of semantic versions or a date.

### Comparison Attribute

A property of your user (e.g. _email address_, _geographic location_). Your application should pass the attribute values (e.g. *jane@example.com*, _Europe_) to the ConfigCat SDK as a [User Object](../../user-object).

There are 3 predefined attributes. Additionally, you can define your **_custom attributes_** as well:

| Comparison attribute name | Description                                                                    |
| ------------------------- | ------------------------------------------------------------------------------ |
| `Identifier`              | Usually, it is a unique user identifier in your application.                   |
| `Email`                   | The e-mail address of your user.                                               |
| `Country`                 | Might be useful for testing a new feature only in one country.                 |
| `Custom`                  | Define any attribute (e.g. `OS version`), by typing its name into the textbox. |

### Comparison Value

A string, a list of strings, a number, a semantic version, a list of semantic versions or a date value. Will be compared to the selected _Comparison attribute_ using the _Comparator_. The length of the _Comparison value_ is limited, and the limit depends on your subscription plan. See the [plan limits page](../../../subscription-plan-limits) for more details.

### Comparator

#### Text Comparators

The following comparators expect the *Comparison attribute* to be a string value and the *Comparison value* to be a string or a list of strings.

:::caution
Consider using Confidential text comparators if you plan to target users by their sensitive information, e.g.: email address or company domain.
:::


| Comparator                         | Description                                                                                     |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| EQUALS (cleartext)                 | Checks whether the comparison attribute equals the comparison value.                           |
| NOT EQUALS (cleartext)             | Checks whether the comparison attribute is not equal to the comparison value.                  |
| IS ONE OF (cleartext)              | Checks whether the comparison attribute is equal to any of the comparison values.              |
| IS NOT ONE OF (cleartext)          | Checks whether the comparison attribute is not equal to any of the comparison values.          |
| STARTS WITH ANY OF (cleartext)     | Checks whether the comparison attribute starts with any of the comparison values.              |
| NOT STARTS WITH ANY OF (cleartext) | Checks whether the comparison attribute does not start with any of the comparison values.      |
| ENDS WITH ANY OF (cleartext)       | Checks whether the comparison attribute ends with any of the comparison values.                |
| NOT ENDS WITH ANY OF (cleartext)   | Checks whether the comparison attribute does not end with any of the comparison values.        |
| CONTAINS ANY OF (cleartext)        | Checks whether the comparison attribute contains any comparison values as a substring.         |
| NOT CONTAINS ANY OF (cleartext)    | Checks whether the comparison attribute does not contain any comparison values as a substring. |

#### Confidential Text Comparators

We recommend using confidential text comparators especially in case of frontend applications targeting users based on sensitive data (like email addresses, names, etc).
In this case, the feature flag evaluation is performed using the SHA256 hashes of the values to ensure that the comparison values are not exposed. This can cause an increase in the size of the config.json file and the overall network traffic. It is recommended to use confidential comparators only when necessary.

| Comparator                      | Description                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------ |
| EQUALS (hashed)                 | Checks whether the comparison attribute is equal to the comparison value.                 |
| NOT EQUALS (hashed)             | Checks whether the comparison attribute is not equal to the comparison value.             |
| IS ONE OF (hashed)              | Checks whether the comparison attribute is equal to any of the comparison values.         |
| IS NOT ONE OF (hashed)          | Checks whether the comparison attribute is not equal to any of the comparison values.     |
| STARTS WITH ANY OF (hashed)     | Checks whether the comparison attribute starts with any of the comparison values.         |
| NOT STARTS WITH ANY OF (hashed) | Checks whether the comparison attribute does not start with any of the comparison values. |
| ENDS WITH ANY OF (hashed)       | Checks whether the comparison attribute ends with any of the comparison values.           |
| NOT ENDS WITH ANY OF (hashed)   | Checks whether the comparison attribute does not end with any of the comparison values.   |

#### Semantic Version Comparators

The following comparators expect the *Comparison attribute* to be a string containing a valid semantic version and the *Comparison value* to be a semantic version or a list of semantic versions.

Evaluation is based on <a target="_blank" href="https://semver.org/">the SemVer Semantic Version Specification</a>.

| Comparator             | Description                                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| IS ONE OF (semver)     | Checks whether the comparison attribute interpreted as a semantic version is equal to any of the comparison values.         |
| IS NOT ONE OF (semver) | Checks whether the comparison attribute interpreted as a semantic version is not equal to any of the comparison values.     |
| < (semver)             | Checks whether the comparison attribute interpreted as a semantic version is less than the comparison value.                |
| <= (semver)            | Checks whether the comparison attribute interpreted as a semantic version is less than or equal to the comparison value.    |
| \> (semver)            | Checks whether the comparison attribute interpreted as a semantic version is greater than the comparison value.             |
| \>= (semver)           | Checks whether the comparison attribute interpreted as a semantic version is greater than or equal to the comparison value. |


#### Number Comparators

The following comparators expect the *Comparison attribute* and the *Comparison value* to be numbers.

| Comparator         | Description                                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| = (number)         | Checks whether the comparison attribute interpreted as a decimal number is equal to the comparison value.                 |
| <&#8203;> (number) | Checks whether the comparison attribute interpreted as a decimal number is not equal to the comparison value.             |
| < (number)         | Checks whether the comparison attribute interpreted as a decimal number is less than the comparison value.                |
| <= (number)        | Checks whether the comparison attribute interpreted as a decimal number is less than or equal to the comparison value.    |
| \> (number)        | Checks whether the comparison attribute interpreted as a decimal number is greater than the comparison value.             |
| \>= (number)       | Checks whether the comparison attribute interpreted as a decimal number is greater than or equal to the comparison value. |


#### Date and Time Comparators

The following comparators expect the *Comparison attribute* to be a date value (a second-based [Unix timestamp](https://en.wikipedia.org/wiki/Unix_time) or a platform-specific date object), and the *Comparison value* to be a date.

| Comparator | Description                                                                                                                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BEFORE     | Checks whether the comparison attribute interpreted as a second-based [Unix timestamp](https://en.wikipedia.org/wiki/Unix_time") is less than the comparison value.    |
| AFTER      | Checks whether the comparison attribute interpreted as a second-based [Unix timestamp](https://en.wikipedia.org/wiki/Unix_time") is greater than the comparison value. |

#### Array Comparators

The following comparators expect the *Comparison attribute* to be an array of strings (or an array of strings serialized to JSON), and the *Comparison value* to be a list of strings.

| Comparator                | Description                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| ARRAY CONTAINS ANY OF     | Checks whether the comparison attribute interpreted as an array of strings contains any of the comparison values.        |
| ARRAY NOT CONTAINS ANY OF | Checks whether the comparison attribute interpreted as an array of strings does not contain any of the comparison values |

## Examples

### Confidential CONTAINS and NOT CONTAINS

#### Goal
Let's target users who are from the same company confidentially. However, text comparators don't support `CONTAINS` or `NOT CONTAINS` comparisons. How can we solve this?

#### Solution
Let's add a custom attribute called `domain` and use only confidential comparators in the Targeting Rule.

On the Dashboard:
<img src="/docs/assets/targeting/targeting-rule/user-condition/user-condition-example1.jpg" className="zoomable" alt="User Condition Example" />

In the code:

```js
const userDomain = userEmail.split('@').pop();
const userObject = {
  identifier: '<SOME USER ID>',
  email: userEmail,
  custom: { domain: userDomain },
};
const value = await configCatClient.getValueAsync(key, defaultValue, userObject);
```