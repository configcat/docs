---
id: user-condition
title: User Condition
description: A user condition is a condition that is based on the evaluation of a user attribute. It is used to determine whether a targeting rule is a match or not for a specific user.
---

## What is a user condition?

A user condition is a condition that is based on the evaluation of a user attribute. It is used to determine whether a targeting rule is a match or not for a specific user.

## How does it work?

The user condition is evaluated with the same [User Object]. The user attribute's value is then compared to the comparison value that you set on the Dashboard. If the user attribute's value is equal to the comparison value, the targeting rule is a match. Otherwise, the targeting rule is not a match.

## How to add a user condition?

*TODO - rewrite this part and add screenshot*

1. <a href="https://app.configcat.com/auth/login" target="_blank">Log in</a> to access the _Dashboard_
2. Go to **Feature Flags & Settings**
3. Select **TARGET SPECIFIC USERS** after clicking the actions icon.

<img src="/docs/assets/targeting-1.png" className="zoomable" alt="targeting-1" />

## Anatomy of a User Condition

By adding a rule, you specify a group of your users and what feature flag or setting value they should get. A rule consists of a **Comparison attribute** of a user in your application (e.g. email address), a **Comparison value** (e.g. a list of email addresses), and a **Comparator** (e.g. IS ONE OF). ConfigCat evaluates the targeting rule every time your application requires and decides what value to serve.

<img src="/docs/assets/sensitive2.png" className="zoomable" alt="Confidential" />

| Field                | Purpose                                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Comparison attribute | The attribute that the targeting rule is based on. Could be "User ID", "Email", "Country" or any custom attribute.                                   |
| Comparator           | The comparison operator. Holds the connection between the attribute and the value.                                                                   |
| Comparison value     | The value that the attribute is compared to. Could be a string, a number, a semantic version or a comma-separated list, depending on the comparator. |

### Comparison attribute

A property of your user (e.g. _email address_, _geographic location_). Your application should pass the attribute values (e.g. *jane@example.com*, _Europe_) to ConfigCat for comparison.

There are 3 predefined attributes. Additionally, you can define your **_custom attributes_** as well:

| Comparison attribute name | Description                                                                    |
| ------------------------- | ------------------------------------------------------------------------------ |
| `Email`                   | The e-mail address of your user.                                               |
| `Identifier`              | Usually a unique user identifier in your application.                          |
| `Country`                 | Might come in useful for testing a new feature only in one country.            |
| `Custom`                  | Define any attribute (e.g. `OS version`), by typing its name into the textbox. |

### Comparison value

Any string, number, or comma-separated list. Will be compared to the selected _Comparison attribute_ using the _Comparator_. **Max Length: 65535 chars**.

### Comparator

#### Text comparators

The following comparators assume that _Comparison attribute_ and _Comparison value_ contain string/text.

:::note
In case **attribute is not passed** to the SDK or it's value is **falsy** (unknown, null, ""), targeting rule **evaluation will be skipped**.
:::

:::caution
Consider using Confidential text comparators if you are planning to target users by their sensitive information e.g: email address or company domain!
:::

| Comparator                         | Description                                                                                     |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| EQUALS (cleartext)                 | It matches when the comparison attribute is equal to the comparison value.                      |
| NOT EQUALS (cleartext)             | It matches when the comparison attribute is not equal to the comparison value.                  |
| IS ONE OF (cleartext)              | It matches when the comparison attribute is equal to any of the comparison values               |
| IS NOT ONE OF (cleartext)          | It matches when the comparison attribute is not equal to any of the comparison values.          |
| STARTS WITH ANY OF (cleartext)     | It matches when the comparison attribute starts with any of the comparison values.              |
| ENDS WITH ANY OF (cleartext)       | It matches when the comparison attribute ends with any of the comparison values.                |
| CONTAINS ANY OF (cleartext)        | It matches when the comparison attribute contains any comparison values as a substring.         |
| NOT STARTS WITH ANY OF (cleartext) | It matches when the comparison attribute does not start with any of the comparison values.      |
| NOT ENDS WITH ANY OF (cleartext)   | It matches when the comparison attribute does not end with any of the comparison values.        |
| NOT CONTAINS ANY OF (cleartext)    | It matches when the comparison attribute does not contain any comparison values as a substring. |

#### Confidential text comparators

We recommend using confidential text comparators especially in case of frontend applications targeting users based on sensitive data (like email addresses, names, etc).
In this case, the feature flag evaluation is performed using the SHA256 hashes of the values to ensure that the comparison values are not exposed. This can cause an increase in the size of the config.json file and the overall network traffic. It is recommended to use confidential comparators only when necessary.

| Comparator                      | Description                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------ |
| EQUALS (hashed)                 | It matches when the comparison attribute is equal to the comparison value.                 |
| NOT EQUALS (hashed)             | It matches when the comparison attribute is not equal to the comparison value.             |
| IS ONE OF (hashed)              | It matches when the comparison attribute is equal to any of the comparison values          |
| IS NOT ONE OF (hashed)          | It matches when the comparison attribute is not equal to any of the comparison values.     |
| STARTS WITH ANY OF (hashed)     | It matches when the comparison attribute starts with any of the comparison values.         |
| ENDS WITH ANY OF (hashed)       | It matches when the comparison attribute ends with any of the comparison values.           |
| NOT STARTS WITH ANY OF (hashed) | It matches when the comparison attribute does not start with any of the comparison values. |
| NOT ENDS WITH ANY OF (hashed)   | It matches when the comparison attribute does not end with any of the comparison values.   |

Since confidential text comparators don't support CONTAINS or DOES NOT CONTAIN comparisons, here is an example of how to target users from the same company. Which used to be handled by a rule like:

<img src="/docs/assets/sensitive2.png" className="zoomable" alt="Confidential" />

You can add a custom attribute called `domain` and use only confidential comparators in the targeting rule.

On the Dashboard:
<img src="/docs/assets/sensitive1.png" className="zoomable" alt="Confidential" />

In your code:

```js
const userDomain = userEmail.split('@').pop();
const userObject = {
  identifier: '<SOME USER ID>',
  email: userEmail,
  custom: { domain: userDomain },
};
const value = await configCatClient.getValueAsync(key, defaultValue, userObject);
```

Support for confidential comparators was introduced in the following SDK versions:

| SDK     | Version                                                                |
| ------- | ---------------------------------------------------------------------- |
| .NET    | [v4.0.0](https://github.com/configcat/.net-sdk/releases/tag/v4.0.0)    |
| C++     | [v1.0.0](https://github.com/configcat/cpp-sdk/releases/tag/v1.0.0)     |
| Dart    | [v1.0.0](https://github.com/configcat/dart-sdk/releases/tag/1.0.0)     |
| Elixir  | [v1.0.0](https://github.com/configcat/elixir-sdk/releases/tag/v1.0.0)  |
| Go      | [v4.0.2](https://github.com/configcat/go-sdk/releases/tag/v4.0.2)      |
| Java    | [v4.0.1](https://github.com/configcat/java-sdk/releases/tag/v4.0.1)    |
| Android | [v4.0.0](https://github.com/configcat/android-sdk/releases/tag/v4.0.0) |
| JS      | [v3.0.0](https://github.com/configcat/js-sdk/releases/tag/v3.0.0)      |
| JS SSR  | [v1.0.1](https://github.com/configcat/js-ssr-sdk/releases/tag/v1.0.1)  |
| React   | [v1.0.0](https://github.com/configcat/react-sdk/releases/tag/v1.0.0)   |
| Kotlin  | [v1.0.0](https://github.com/configcat/kotlin-sdk/releases/tag/1.0.0)   |
| Node    | [v4.0.0](https://github.com/configcat/node-sdk/releases/tag/v4.0.0)    |
| PHP     | [v3.0.2](https://github.com/configcat/php-sdk/releases/tag/v3.0.2)     |
| Python  | [v3.0.2](https://github.com/configcat/python-sdk/releases/tag/v3.0.2)  |
| Ruby    | [v2.0.3](https://github.com/configcat/ruby-sdk/releases/tag/v2.0.3)    |
| Swift   | [v4.0.0](https://github.com/configcat/swift-sdk/releases/tag/4.0.0)    |

#### Semantic version comparators

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

#### Number comparators

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

#### Date and time comparators

The following comparators expect _Comparison attribute_ to be a double-precision floating-point number representing a second-based [Unix timestamp](https://en.wikipedia.org/wiki/Unix_time). Values that can be converted to a Unix timestamp are also accepted, including platform specific standard date types.

:::note
In case _Comparison attribute_ is not passed to the SDK or its value is not a valid Unix timestamp, a warning will be logged, the targeting rule will be ignored and the evaluation will continue with the next rule.
:::

:::tip
The ConfigCat SDKs don't provide date and time values. You have to pass them to the SDKs as custom attributes in UNIX timestamp format.
:::

:::info
You cannot store date and time values directly in User Object attributes. You have to pass them to the SDKs as second-based [UNIX timestamps](https://en.wikipedia.org/wiki/Unix_time), converted to string. (Most SDKs provide a helper method named like `User.AttributeValueFrom` to convert a date and time value to the expected string representation.)
:::


| Comparator | Description                                                                                                                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BEFORE     | It matches when the comparison attribute interpreted as the seconds elapsed since <a href="https://en.wikipedia.org/wiki/Unix_time">Unix Epoch</a> is less than the comparison value.          |
| AFTER      | It matches when the comparison attribute interpreted as the seconds elapsed since <a href="https://en.wikipedia.org/wiki/Unix_time">Unix Epoch</a> is greater than the comparison value.value. |

##### Example
If you want to target users who registered before a certain date, you have to pass the registration date to the SDK as a custom attribute in [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time) format.

```cs
var user = new User(appUserData.Identifier)
{
    Custom =
    {
        ["RegisteredAt"] = User.AttributeValueFrom(appUserData.RegistrationTime),
    }
};
```

#### Array comparators

The following comparators assume that _Comparison attribute_ and _Comparison value_ contain arrays.

| Comparator                | Description                                                                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| ARRAY CONTAINS ANY OF     | It matches when the comparison attribute interpreted as a comma-separated list contains any of the comparison values.        |
| ARRAY NOT CONTAINS ANY OF | It matches when the comparison attribute interpreted as a comma-separated list does not contain any of the comparison values |