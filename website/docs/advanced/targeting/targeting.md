---
id: targeting
title: Targeting Rules
description: Targeting allows you to define targeting rules for feature flags. This way you can target a specific user group with a specific feature.
---

Using this feature you will be able to set different setting values for different users in your application. Let's say you would like to enable a feature only for the users within your company or only to a small percentage of your users before releasing it to the entire world.

## Targeting specific users

### Enable feature

1. <a href="https://app.configcat.com/auth/login" target="_blank">Log in</a> to access the _Dashboard_
2. Go to **Feature Flags & Settings**
3. Select **TARGET SPECIFIC USERS** after clicking the actions icon.

<img src="/docs/assets/targeting-1.png" className="zoomable" alt="targeting-1" />

## Anatomy of a Targeting Rule

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

> In case **attribute is not passed** to the SDK or it's value is **falsy** (unknown, null, ""), targeting rule **evaluation will be skipped**.

:::caution
Consider using Confidential text comparators if you are planning to target users by their sensitive information e.g: email address or company domain!
:::

| Comparator                   | Description                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| IS ONE OF (cleartext)        | Checks if the _Comparison attribute_ is listed in the _Comparison value_. _Comparison value_ should be a comma-separated list. |
| IS NOT ONE OF (cleartext)    | True if the _Comparison attribute_ is not listed in the _Comparison value_.                                                    |
| CONTAINS (cleartext)         | True if the _Comparison attribute_ contains the _Comparison value_.                                                            |
| DOES NOT CONTAIN (cleartext) | True if the _Comparison attribute_ doesn't contain the _Comparison value_.                                                     |

#### Confidential text comparators

We recommend confidential text comparators in case of frontend applications targeting users based on sensitive data (like email addresses, names, etc).
In this case, the feature flag evaluation is based on the secure hashes of the comparison values.

| Comparator             | Description                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
|EQUALS| True if the _Comparison attribute_ equals the _Comparison value_.                                                                |
| NOT EQUALS             | True if the _Comparison attribute_ does not equal the _Comparison value_.                                                       |
| IS ONE OF (hashed)     | Checks if the _Comparison attribute_ is listed in the _Comparison value_. _Comparison value_ should be a comma-separated list. |
| IS NOT ONE OF (hashed) | True if the _Comparison attribute_ is not listed in the _Comparison value_.                                                    |
|STARTS WITH ANY OF| True if the _Comparison attribute_ starts with any of the values in _Comparison value_.                                         |
| ENDS WITH ANY OF       | True if the _Comparison attribute_ ends with any of the values in _Comparison value_.                                           |
|NOT STARTS WITH ANY OF| True if the _Comparison attribute_ does not start with any of the values in _Comparison value_.                                 |
| NOT ENDS WITH ANY OF   | True if the _Comparison attribute_ does not end with any of the values in _Comparison value_.                                   |
| CONTAINS ANY OF        | True if the _Comparison attribute_ contains any of the values in _Comparison value_.                                            |
| NOT CONTAINS ANY OF    | True if the _Comparison attribute_ does not contain any of the values in _Comparison value_.                                    |

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
const value = configCatClient.getValue(key, defaultValue, callback, userObject);
```

Support for confidential comparators was introduced in these SDK versions:

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

#### Date and time comparators

The following comparators assume that _Comparison attribute_ and _Comparison value_ contain date and time values.

:::tip
The ConfigCat SDKs don't provide date and time values. You have to pass them to the SDKs as custom attributes in UNIX timestamp format.
:::

| Comparator | Description                                                  |
| ---------- | ------------------------------------------------------------ |
| BEFORE     | True if _Comparison attribute_ is before _Comparison value_. |
| AFTER      | True if _Comparison attribute_ is after _Comparison value_.  |

##### Example
If you want to target users who registered before a certain date, you have to pass the registration date to the SDK as a custom attribute in UNIX timestamp format.

```js
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

| Comparator                | Description                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| ARRAY CONTAINS ANY OF     | True if _Comparison attribute_ contains any of the values in _Comparison value_.         |
| ARRAY NOT CONTAINS ANY OF | True if _Comparison attribute_ does not contain any of the values in _Comparison value_. |

### Served value

The exact value that will be served to the users who match the targeting rule. Depending on the kind of your setting this could be:

| Setting Kind   | Setting Type | Description                                     |
| -------------- | ------------ | ----------------------------------------------- |
| On/Off Toggle  | Boolean      | true/false, usually the state of a feature flag |
| Text           | String       | any string, max. 100000 characters              |
| Whole Number   | Integer      | any whole number within the range of `int32`    |
| Decimal Number | Double       | any decimal number within the range of `double` |

### Multiple targeting rules, ordering and evaluation sequence

See the [Targeting Rule Evaluation Sequence](/docs/advanced/targeting/evaluation-sequence) page.




