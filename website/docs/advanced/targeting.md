---
id: targeting
title: Targeting
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
| IS ONE OF (hashed)     | Checks if the _Comparison attribute_ is listed in the _Comparison value_. _Comparison value_ should be a comma-separated list. |
| IS NOT ONE OF (hashed) | True if the _Comparison attribute_ is not listed in the _Comparison value_.                                                    |

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

### Served value

The exact value that will be served to the users who match the targeting rule. Depending on the kind of your setting this could be:

| Setting Kind   | Setting Type | Description                                     |
| -------------- | ------------ | ----------------------------------------------- |
| On/Off Toggle  | Boolean      | true/false, usually the state of a feature flag |
| Text           | String       | any string, max. 100000 characters               |
| Whole Number   | Integer      | any whole number within the range of `int32`    |
| Decimal Number | Double       | any decimal number within the range of `double` |

### Multiple targeting rules and ordering

Add new rule by clicking on the _Actions_ icon.

By adding multiple targeting rules you can create more complex rule sets.

> Rule sets are evaluated one by one, from top to bottom direction.

> Change the order of targeting rules by drag n' drop.

#### Example

_Enable a feature only to users within your company except for the sales team (Susan and Simon) by adding two targeting rules:_

| #   | Comparison attribute | Comparator | Comparison value                           | Served value |
| --- | -------------------- | ---------- | ------------------------------------------ | ------------ |
| 1   | Email                | CONTAINS   | `susan@mycompany.com, simon@mycompany.com` | OFF          |
| 2   | Email                | CONTAINS   | `@mycompany.com`                           | ON           |

All other cases: OFF

### To all other users, serve

This value will be served as a fallback if none of the above rules apply or a [`User Object`](advanced/user-object.md) is not passed to the [ConfigCat SDK](sdk-reference/overview.md) correctly within your application.

## Targeting a percentage of users

With percentage-based user targeting, you can specify a randomly selected fraction of your users whom a feature will be enabled or a different value will be served.

### Enable feature

1. <a href="https://app.configcat.com/auth/login" target="_blank">Log in</a> to access the _Dashboard_
2. Go to **Feature Flags & Settings**
3. Select **TARGET % OF USERS** after clicking the actions icon.

<img src="/docs/assets/targeting-2.png" className="zoomable" alt="targeting-2" />

## Anatomy of the percentage-based targeting

Percentage based targeting consists of **% value** and the **Served value** pairs.

### % value

Any _number between 0 and 100_ that represents a randomly allocated fraction of your users.

### Served value

The exact value that will be served to the users that fall into that fraction. Depending on the kind of your setting this could be:

| Setting Kind   | Setting Type | Description                                     |
| -------------- | ------------ | ----------------------------------------------- |
| On/Off Toggle  | Boolean      | true/false, usually the state of a feature flag |
| Text           | String       | any `string`, max. 100000 characters             |
| Whole Number   | Integer      | any whole number within the range of `Int32`    |
| Decimal Number | Double       | any decimal number within the range of `double` |

## Stickiness & Consistency

The percentage-based targeting is sticky by design and consistent across all SDKs.

Percentage-based targeting is based on the identifier of the `User Object` passed to the SDK's `getValue()` methods.
The SDKs are hashing the concatenated value of the `User Object's` `identifier` and the requested feature flag's `Key`. Then they assign a 0-99 number to the User for a specific feature flag. This number is used to evaluate a particular feature flag's value based on the targeting rules.
This number is fix and consistent for each User across all SDKs. The SDKs check if the assigned number is greater or less than the percentage set on the ConfigCat Dashboard.

:::caution
As not only the User's identifier is hashed but the User's identifier concatenated with the evaluated feature flag's key, we can ensure that you won't test on the same userbase for all of your feature flags.
:::

:::info
As the evaluation happens in the SDKs, your User's sensitive information will never leave your system. The data flow is unidirectional (only from ConfigCat CDN servers to your SDKs), and ConfigCat doesn't receive or store any of the User Object's attributes passed to the SDKs.
:::

### Example

Let's say you have two users and two different feature flags with percentage-based targeting.

|      | isTwitterSharingEnabled                                                                 | isFacebookSharingEnabled                                                                  |
| ---- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Jane | `hash('Jane' + 'isTwitterSharingEnabled') mod 100` <br/>-> The assigned number is **8** | `hash('Jane' + 'isFacebookSharingEnabled') mod 100` <br/>-> The assigned number is **64** |
| Joe  | `hash('Joe' + 'isTwitterSharingEnabled') mod 100` <br/>-> The assigned number is **32** | `hash('Joe' + 'isFacebookSharingEnabled') mod 100` <br/>-> The assigned number is **12**  |

1. Let's start with both feature flags set to **0% ON / 100% OFF**.

|      | isTwitterSharingEnabled <br/> 0% ON / 100% OFF | isFacebookSharingEnabled <br/> 0% ON / 100% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 >= 0 <br/>-> **OFF**                         | 64 >= 0 <br/>-> **OFF**                         |
| Joe  | 32 >= 0 <br/>-> **OFF**                        | 12 >= 0 <br/>-> **OFF**                         |

2. Let's set both feature flags to **10% ON / 90% OFF**.

|      | isTwitterSharingEnabled <br/> 10% ON / 90% OFF | isFacebookSharingEnabled <br/> 10% ON / 90% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 10 <br/>-> **ON**                          | 64 >= 10 <br/>-> **OFF**                        |
| Joe  | 32 >= 10 <br/>-> **OFF**                       | 12 >= 10 <br/>-> **OFF**                        |

:::caution
Although both feature flags are set to 10% ON / 90% OFF, Jane is only evaluated to **ON** for the `isTwitterSharingEnabled` feature flag.
:::

3. The Twitter Sharing Feature seems alright, so let's increase the `isTwitterSharingEnabled` to **40% ON / 60% OFF**.

|      | isTwitterSharingEnabled <br/> 40% ON / 60% OFF | isFacebookSharingEnabled <br/> 10% ON / 90% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 40 <br/>-> **ON**                          | 64 >= 10 <br/>-> **OFF**                        |
| Joe  | 32 < 40 <br/>-> **ON**                         | 12 >= 10 <br/>-> **OFF**                        |

4. Something seems strange with the Twitter Sharing Feature, so let's rollback to the safe **10% ON / 90% OFF**.

|      | isTwitterSharingEnabled <br/> 10% ON / 90% OFF | isFacebookSharingEnabled <br/> 10% ON / 90% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 10 <br/>-> **ON**                          | 64 >= 10 <br/>-> **OFF**                        |
| Joe  | 32 >= 10 <br/>-> **OFF**                       | 12 >= 10 <br/>-> **OFF**                        |

> As percentage-based targeting is sticky, the same user base is evaluated to **ON** like in the 2. step.

5. If everything seems alright, we can safely increase both feature flags to **100% ON / 0% OFF**.

|      | isTwitterSharingEnabled <br/> 100% ON / 0% OFF | isFacebookSharingEnabled <br/> 100% ON / 0% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 100 <br/>-> **ON**                         | 64 < 100 <br/>-> **ON**                         |
| Joe  | 32 < 100 <br/>-> **ON**                        | 12 < 100 <br/>-> **ON**                         |

## Multiple options

### On/Off Toggle

When the Setting Kind is On/Off Toggle, the number of options must be 2. One for the _On_ and one for the _Off_ state.

### Text and Number

When the Setting Kind is _Text_, _Whole Number_, or _Decimal Number_ the maximum number options depend on your subscription plan. You can add/remove options by clicking the _Actions_ icon.

> The sum of all _% values_ must be equal to 100.

### All other cases

This value will be served as a fallback if none of the above rules apply or a [`User Object`](advanced/user-object.md) was not passed to the [ConfigCat SDK](sdk-reference/overview.md) correctly within your application.
