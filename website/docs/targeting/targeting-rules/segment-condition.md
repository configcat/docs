---
id: segment-condition
title: Segment Condition
description: Segments help you define user segments and assign them to your feature flags. Ideal for beta testing on a certain group of users.
---

## What is a segment condition?

A segment condition is a condition that is based on the evaluation of a [segment]. It is used to determine whether a targeting rule is a match or not for a specific user.

A segment is a re-usable user condition that defines a user group based on any of their properties.

## How does it work?

The segment condition is evaluated with the same [User Object]. The segment's value is then compared to the comparison value that you set on the Dashboard. If the segment's value is equal to the comparison value, the targeting rule is a match. Otherwise, the targeting rule is not a match.

## How to add a segment condition?

> TODO add steps and screenshot

## Example

> TODO add screenshot and explanation

---
> TODISCUSS talan az alabbi reszt egy kulon oldalon kene targyalni

## What is a segment?

Segments allow you to group your users based on any of their properties. This way you can
define segments of your users and then assign them to specific feature flags. If you update a segment definition, it will update all
feature flags that are assigned to it. You can think of segments as reusable targeting rules. If you have groups of users that you want to target regularly with
different features, it's a good idea to define a segment for each group.

_For example, you can define a segment called "Beta Users" and assign that segment to all future features that you want to be available for beta users._

One segment belongs to one product and can be used in multiple feature flags within the same product.

## Where can I define segments?

You can define your segments on the [ConfigCat Dashboard under the Segments tab](https://app.configcat.com/product/segments).

> TODO add screenshot

## Anatomy of a Segment

| Field                | Purpose                                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name                 | The name of the segment.                                                                                                                             |
| Description          | The description of the segment. It's a good idea to add a hint that helps you remember what the segment is for.                                      |
| Comparison attribute | The attribute that the segment is based on. Could be "User ID", "Email", "Country" or any custom attribute.                                          |
| Comparator           | The comparison operator. Holds the connection between the attribute and the value.                                                                   |
| Comparison value     | The value that the attribute is compared to. Could be a string, a number, a semantic version or a comma-separated list, depending on the comparator. |

### Comparison attribute

A property of your user (e.g. _email address_, _geographic location_). Your application should pass the attribute values (e.g. *jane@example.com*, _Europe_) to ConfigCat for comparison.

There are 3 predefined attributes. Additionally, you can define your **_custom attributes_** as well:

| Comparison attribute name | Description                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `Email`                   | The e-mail address of your user.                                                     |
| `Identifier`              | Usually a unique user identifier in your application.                                |
| `Country`                 | Might come in useful for testing a new feature only in one country.                  |
| `Custom`                  | **_Define any attribute (e.g. `OS version`), by typing its name into the textbox._** |

### Comparison value

Any string, number, or comma-separated list. Will be compared to the selected _Comparison attribute_ using the _Comparator_. **Max Length: 65535 chars**.

### Comparator

#### Text comparators

The following comparators assume that _Comparison attribute_ and _Comparison value_ contain string/text.

| Comparator                   | Description                                                                |
| ---------------------------- | -------------------------------------------------------------------------- |
| CONTAINS (cleartext)         | True if the _Comparison attribute_ contains the _Comparison value_.        |
| DOES NOT CONTAIN (cleartext) | True if the _Comparison attribute_ doesn't contain the _Comparison value_. |

#### Confidential text comparators

We recommend confidential text comparators in case of frontend applications targeting users based on sensitive data (like email addresses, names, etc).
In this case, the feature flag evaluation is based on the secure hashes of the comparison values.

| Comparator             | Description                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| IS ONE OF (hashed)     | Checks if the _Comparison attribute_ is listed in the _Comparison value_. _Comparison value_ should be a comma-separated list. |
| IS NOT ONE OF (hashed) | True if the _Comparison attribute_ is not listed in the _Comparison value_.                                                    |

#### Semantic version comparators

The following comparators assume that _Comparison attribute_ and _Comparison value_ contain semantic versions.
Evaluation is based on <a target="_blank" href="https://semver.org/">the SemVer Semantic Version Specification</a>.

| Comparator             | Description                                                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| IS ONE OF (Semver)     | True if _Comparison attribute_ is listed in the _Comparison value_. _Comparison value_ should be a comma-separated list of semantic versions. |
| IS NOT ONE OF (Semver) | True if the _Comparison attribute_ is not listed in the _Comparison value_.                                                                   |
| < (Semver)             | True if _Comparison attribute_ is a smaller version number than _Comparison value_.                                                           |
| <= (Semver)            | True if _Comparison attribute_ is smaller than or equals _Comparison value_.                                                                  |
| \> (Semver)            | True if _Comparison attribute_ is a larger version number than _Comparison value_.                                                            |
| \>= (Semver)           | True if _Comparison attribute_ is larger than or equals _Comparison value_.                                                                   |

All semantic version comparators return `false` if either _Comparison attribute_ or _Comparison value_ is not a valid <a target="_blank" href="https://semver.org/">semantic version</a>.

#### Number comparators

The following comparators assume that _Comparison attribute_ and _Comparison value_ contain numbers.

| Comparator         | Description                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| = (Number)         | True if _Comparison attribute_ equals _Comparison value_.                   |
| <&#8203;> (Number) | True if _Comparison attribute_ does not equal _Comparison value_.           |
| < (Number)         | True if _Comparison attribute_ is less than _Comparison value_.             |
| <= (Number)        | True if _Comparison attribute_ is less than or equals _Comparison value_.   |
| \> (Number)        | True if _Comparison attribute_ is a larger than _Comparison value_.         |
| \>= (Number)       | True if _Comparison attribute_ is larger than or equals _Comparison value_. |

All number comparators return `false` if either _Comparison attribute_ or _Comparison value_ is not a valid number.