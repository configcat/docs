---
id: segments
title: Segmentation & Segments
description: Segments help you define user segments and assign them to your feature flags. Ideal for beta testing on a certain group of users.
---
Segments allow you to group your users based on any of their properties. This way you can 
define segments of your users and then assign them to specific feature flags. If you update a segment definition, it will update all 
feature flags that are assigned to it. You can think of segments as reusable targeting rules. If you have groups of users that you want to target regularly with 
different features, it's a good idea to define a segment for each group.

*For example, you can define a segment called "Beta Users" and assign that segment to all future features that you want to be available for beta users.*

You can define your segments on the [ConfigCat Dashboard](https://app.configcat.com/product/segments).

One segment belongs to one product and can be used in multiple feature flags within the same product.

## Anatomy of a Segment

| Field                | Purpose                                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name                 | The name of the segment.                                                                                                                             |
| Description          | The description of the segment. It's a good idea to add a hint that helps you remember what the segment is for.                                        |
| Comparison attribute | The attribute that the segment is based on. Could be "User ID", "Email", "Country" or any custom attribute.                                          |
| Comparator           | The comparison operator. Holds the connection between the attribute and the value.                                                                   |
| Comparison value     | The value that the attribute is compared to. Could be a string, a number, a semantic version or a comma-separated list, depending on the comparator. |

### Comparison attribute

A property of your user (e.g. *email address*, *geographic location*). Your application should pass the attribute values (e.g. *jane@example.com*, *Europe*) to ConfigCat for comparison.

There are 3 predefined attributes. Additionally, you can define your ***custom attributes*** as well:

| Comparison attribute name | Description                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------- |
| `Email`                   | The e-mail address of your user.                                                   |
| `Identifier`              | Usually a unique user identifier in your application.                              |
| `Country`                 | Might come useful for testing a new feature only in one country.                   |
| `Custom`                  | ***Define any attribute (e.g. `OS version`), by typing its name to the textbox.*** |

### Comparison value

Any string, number, or comma-separated list. Will be compared to the selected *Comparison attribute* using the *Comparator*. **Max Length: 65535 chars**.

### Comparator

#### Text comparators

The following comparators assume that *Comparison attribute* and *Comparison value* contain string/text.

| Comparator                   | Description                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| CONTAINS (cleartext)         | True if the *Comparison attribute* contains the *Comparison value*.                                                            |
| DOES NOT CONTAIN (cleartext) | True if the *Comparison attribute* doesn't contain the *Comparison value*.                                                     |

#### Confidential text comparators

We recommend confidential text comparators in case of frontend applications targeting users based on sensitive data (like email addresses, names, etc).
In this case, the feature flag evaluation is based on the secure hashes of the comparison values.

| Comparator             | Description                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| IS ONE OF (hashed)     | Checks if the *Comparison attribute* is listed in the *Comparison value*. *Comparison value* should be a comma-separated list. |
| IS NOT ONE OF (hashed) | True if the *Comparison attribute* is not listed in the *Comparison value*.                                                    |

#### Semantic version comparators

The following comparators assume that *Comparison attribute* and *Comparison value* contain semantic versions.
Evaluation is based on <a target="_blank" href="https://semver.org/">the SemVer Semantic Version Specification</a>.

| Comparator             | Description                                                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| IS ONE OF (Semver)     | True if *Comparison attribute* is listed in the *Comparison value*. *Comparison value* should be a comma-separated list of semantic versions. |
| IS NOT ONE OF (Semver) | True if the *Comparison attribute* is not listed in the *Comparison value*.                                                                   |
| < (Semver)             | True if *Comparison attribute* is a smaller version number than *Comparison value*.                                                           |
| <= (Semver)            | True if *Comparison attribute* is smaller than or equals *Comparison value*.                                                                  |
| \> (Semver)            | True if *Comparison attribute* is a larger version number than *Comparison value*.                                                            |
| \>= (Semver)           | True if *Comparison attribute* is larger than or equals *Comparison value*.                                                                   |

All semantic version comparators return `false` if either *Comparison attribute* or *Comparison value* is not a valid <a target="_blank" href="https://semver.org/">semantic version</a>.

#### Number comparators

The following comparators assume that *Comparison attribute* and *Comparison value* contain numbers. 

| Comparator         | Description                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| = (Number)         | True if *Comparison attribute* equals *Comparison value*.                   |
| <&#8203;> (Number) | True if *Comparison attribute* does not equal *Comparison value*.           |
| < (Number)         | True if *Comparison attribute* is less than *Comparison value*.             |
| <= (Number)        | True if *Comparison attribute* is less than or equals *Comparison value*.   |
| \> (Number)        | True if *Comparison attribute* is a larger than *Comparison value*.         |
| \>= (Number)       | True if *Comparison attribute* is larger than or equals *Comparison value*. |

All number comparators return `false` if either *Comparison attribute* or *Comparison value* is not a valid number.