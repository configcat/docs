---
id: segment-condition
title: Segment Condition
description: Segments allow you to define user groups based on any user attributes. Ideal for beta testing on a certain group of users.
---

## What is a Segment Condition? What is a segment?

A *Segment Condition* is a condition that is based on the evaluation of a segment. A *segment* is a reusable, predefined [User Condition](../user-condition).

Segments allow you to define user groups based on any user attributes. You can reference segments in Targeting Rules. When you update a segment definition, the changes will be reflected automatically in all the Targeting Rules that reference it.

*For example, you can define a segment called "Beta Testers" and use that segment for all features you want to be available to beta testers.*

One segment belongs to one product and can be used in multiple feature flags within the same product.

## How does the Segment Condition work?

The segment is evaluated with the [User Object](../../user-object), and the result is checked against the comparator you set on the Dashboard. In the case of `IS IN SEGMENT`, the result of the Segment Condition will be the same as that of the segment. The result will be negated in the case of `IS NOT IN SEGMENT`.

For more details on the evaluation of Segment Conditions, please refer to [Feature Flag Evaluation](../../feature-flag-evaluation).

## How to set a Segment Condition?

You can add a Targeting Rule with a Segment Condition on the Dashboard by clicking on the `+IF` ("Add Targeting Rule") button.

![Add Segment Condition](/assets/targeting/targeting-rule/segment-condition/add-segment-condition.jpg)

## Where can I define segments?

You can define your segments on the [ConfigCat Dashboard under the Segments tab](https://app.configcat.com/product/segments).

![Ass segment](/assets/targeting/targeting-rule/segment-condition/add-segment.jpg)


## Anatomy of a Segment Condition

![Segment Condition anatomy](/assets/targeting/targeting-rule/segment-condition/segment-condition-anatomy.jpg)

A *Segment Condition* consists of two parts: 

- **Segment comparator:** The comparison operator defines the relation between the user and the segment.
- **Segment:** The segment that the condition is based on.

| Comparator        | Description                                             |
| ----------------- | ------------------------------------------------------- |
| IS IN SEGMENT     | Checks whether the user is in the selected segment.     |
| IS NOT IN SEGMENT | Checks whether the user is not in the selected segment. |

## Anatomy of a Segment

| Field                | Purpose                                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name                 | The name of the segment.                                                                                                                             |
| Description          | The description of the segment. It's a good idea to add a hint that helps you remember what the segment is for.                                      |
| Comparison attribute | The attribute that the segment is based on. Could be "User ID", "Email", "Country" or any custom attribute.                                          |
| Comparator           | The comparison operator. Defines the relation between the comparison attribute and the comparison value.                                             |
| Comparison value     | The value that the attribute is compared to. Could be a string, a number, a semantic version or a comma-separated list, depending on the comparator. |

### Comparison attribute

A property of your user (e.g. _email address_, _geographic location_). Your application should pass the attribute values (e.g. *jane&#64;example.com*, _Europe_) to the ConfigCat SDK as a [User Object](../../user-object).

There are 3 predefined attributes. Additionally, you can define your **_custom attributes_** as well:

| Comparison attribute name | Description                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `Identifier`              | Usually, it is a unique user identifier in your application.                         |
| `Email`                   | The e-mail address of your user.                                                     |
| `Country`                 | Might be useful for testing a new feature only in one country.                       |
| `Custom`                  | **_Define any attribute (e.g. `OS version`), by typing its name into the textbox._** |

### Comparison Value

Any string, number, or comma-separated list. Will be compared to the selected _Comparison attribute_ using the _Comparator_. **Max Length: 65535 chars**.

### Comparator

#### Confidential Text Comparators

We recommend using confidential text comparators when targeting users based on their sensitive data (like email address, name, etc).
In this case, the feature flag evaluation is performed using the SHA256 hashes of the values to ensure that the comparison values are not exposed. This can cause an increase in the size of the config JSON file and the overall network traffic. Yet it is not recommended to use the cleartext version of the confidential comparators unless the increased network traffic becomes an issue.

The following comparators expect the *Comparison attribute* to be a string value and the *Comparison value* to be a string or a list of strings.

| Comparator             | Description                                                                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| IS ONE OF (hashed)     | Checks whether the comparison attribute is equal to any of the comparison values. (_Comparison value_ should be a comma-separated list.)     |
| IS NOT ONE OF (hashed) | Checks whether the comparison attribute is not equal to any of the comparison values. (_Comparison value_ should be a comma-separated list.) |

#### Text comparators

The following comparators expect the *Comparison attribute* to be a string value and the *Comparison value* to be a string or a list of strings.

:::info
Consider using Confidential text comparators if you plan to target users by their sensitive data, e.g.: email address or company domain.
:::

| Comparator                   | Description                                                                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| CONTAINS (cleartext)         | Checks whether the comparison attribute contains the comparison value as a substring.                                                        |
| DOES NOT CONTAIN (cleartext) | Checks whether the comparison attribute does not contain the comparison value as a substring.                                                |
| IS ONE OF (cleartext)        | Checks whether the comparison attribute is equal to any of the comparison values. (_Comparison value_ should be a comma-separated list.)     |
| IS NOT ONE OF (cleartext)    | Checks whether the comparison attribute is not equal to any of the comparison values. (_Comparison value_ should be a comma-separated list.) |

#### Semantic version comparators

The following comparators expect the *Comparison attribute* to be a string containing a valid semantic version and the *Comparison value* to be a semantic version or a list of semantic versions.

Evaluation is based on <a target="_blank" href="https://semver.org/">the SemVer Semantic Version Specification</a>.

| Comparator             | Description                                                                                                                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IS ONE OF (semver)     | Checks whether the comparison attribute interpreted as a semantic version is equal to any of the comparison values. (_Comparison value_ should be a comma-separated list of semantic versions.)     |
| IS NOT ONE OF (semver) | Checks whether the comparison attribute interpreted as a semantic version is not equal to any of the comparison values. (_Comparison value_ should be a comma-separated list of semantic versions.) |
| < (semver)             | Checks whether the comparison attribute interpreted as a semantic version is less than the comparison value.                                                                                        |
| <= (semver)            | Checks whether the comparison attribute interpreted as a semantic version is less than or equal to the comparison value.                                                                            |
| \> (semver)            | Checks whether the comparison attribute interpreted as a semantic version is greater than the comparison value.                                                                                     |
| \>= (semver)           | Checks whether the comparison attribute interpreted as a semantic version is greater than or equal to the comparison value.                                                                         |

#### Number comparators

The following comparators expect the *Comparison attribute* and the *Comparison value* to be numbers.

| Comparator         | Description                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| = (number)         | Checks whether the comparison attribute interpreted as a decimal number is equal to the comparison value.                 |
| <&#8203;> (number) | Checks whether the comparison attribute interpreted as a decimal number is not equal to the comparison value.             |
| < (number)         | Checks whether the comparison attribute interpreted as a decimal number is less than the comparison value.                |
| <= (number)        | Checks whether the comparison attribute interpreted as a decimal number is less than or equal to the comparison value.    |
| \> (number)        | Checks whether the comparison attribute interpreted as a decimal number is greater than the comparison value.             |
| \>= (number)       | Checks whether the comparison attribute interpreted as a decimal number is greater than or equal to the comparison value. |

## Examples

### Beta Testing Scenario

#### Context
The developers at our demo company, Whisker Co. just finished implementing a nice new feature which allows users to personalize the layout of the webshop. It's time for a beta test.

#### Goal
We want to make the `Personalized Layout` feature of the webshop available to the beta testers.

#### Solution
We could simply achieve our goal using a Targeting Rule with a User Condition. However, `Personalized Layout` is certainly not the last feature developed at Whisker Co., so it's a good idea to create a segment named e.g. `Beta Testers` for our beta testers. This makes it easier for us to release further features for beta testing in the future.

After creating the segment, we can complete our task by adding a Targeting Rule containing a Segment Condition to `Enable Personalized Layout`, then referencing the `Beta Testers` segment in the condition and setting the comparator to `IS IN SEGMENT`.

On the Dashboard:
![Segment Condition example](/assets/targeting/targeting-rule/segment-condition/beta-testers.jpg)