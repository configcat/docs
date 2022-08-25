---
id: targeting
title: Targeting
description: Targeting allows you to define targeting rules for feature flags. This way you can target a specific user group with a specific feature.
---
Using this feature you will be able to set different setting values for different users in your application. Let's say you would like to enable a feature only for the users within your company or only to a small percentage of your users before releasing it to the entire world.

## Targeting specific users

### Enable feature

1. <a href="https://app.configcat.com/login" target="_blank">Log in</a> to access the *Dashboard*
2. Go to **Feature Flags & Settings**
3. Select **TARGET SPECIFIC USERS** after clicking the actions icon.

![targeting-1](/assets/targeting-1.png)

## Anatomy of a Targeting Rule

By adding a rule, you specify a group of your users and what feature flag or setting value they should get. A rule consists of a **Comparison attribute** of a user in your application (e.g. email address), a **Comparison value** (e.g. a list of email addresses), and a **Comparator** (e.g. IS ONE OF). ConfigCat evaluates the targeting rule every time your application requires and decides what value to serve.

![Confidential](/assets/sensitive2.png)

| Field                | Purpose                                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Comparison attribute | The attribute that the targeting rule is based on. Could be "User ID", "Email", "Country" or any custom attribute.                                   |
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
> In case **attribute is not passed** to the SDK or it's value is **falsy** (unknown, null, ""), targeting rule **evaluation will be skipped**.

:::caution
Consider using Confidential text comparators if you are planning to target users by their sensitive information e.g: email address or company domain!
:::

| Comparator                   | Description                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| IS ONE OF (cleartext)        | Checks if the *Comparison attribute* is listed in the *Comparison value*. *Comparison value* should be a comma-separated list. |
| IS NOT ONE OF (cleartext)    | True if the *Comparison attribute* is not listed in the *Comparison value*.                                                    |
| CONTAINS (cleartext)         | True if the *Comparison attribute* contains the *Comparison value*.                                                            |
| DOES NOT CONTAIN (cleartext) | True if the *Comparison attribute* doesn't contain the *Comparison value*.                                                     |

#### Confidential text comparators

We recommend confidential text comparators in case of frontend applications targeting users based on sensitive data (like email addresses, names, etc).
In this case, the feature flag evaluation is based on the secure hashes of the comparison values.

| Comparator             | Description                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| IS ONE OF (hashed)     | Checks if the *Comparison attribute* is listed in the *Comparison value*. *Comparison value* should be a comma-separated list. |
| IS NOT ONE OF (hashed) | True if the *Comparison attribute* is not listed in the *Comparison value*.                                                    |

Since confidential text comparators don't support CONTAINS or DOES NOT CONTAIN comparisons, here is an example of how to target users from the same company. Which used to be handled by a rule like:

![Confidential](/assets/sensitive2.png)


You can add a custom attribute called `domain` and use only confidential comparators in the targeting rule.

On the Dashboard:
![Confidential](/assets/sensitive1.png)

In your code:
```js
const userDomain = userEmail.split('@').pop();
const userObject = {
    identifier: '<SOME USER ID>',
    email: userEmail,
    custom: { domain: userDomain }
}
const value = configCatClient.getValue(key, defaultValue, callback, userObject);
```
Confidential comparators are supported from these SDK versions:

| SDK     | Version |
| ------- | ------- |
| JS      | v3.0.0  |
| Node    | v4.0.0  |
| PHP     | v3.0.2  |
| Python  | v3.0.2  |
| Ruby    | v2.0.3  |
| Go      | v4.0.2  |
| Java    | v4.0.1  |
| Android | v4.0.0  |
| .NET    | v4.0.0  |
| Swift   | v4.0.0  |

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

### Served value

The exact value that will be served to the users who match the targeting rule. Depending on the kind of your setting this could be:

| Setting Kind   | Setting Type | Description                                     |
| -------------- | ------------ | ----------------------------------------------- |
| On/Off Toggle  | Boolean      | true/false, usually the state of a feature flag |
| Text           | String       | any string, max. 65535 characters               |
| Whole Number   | Integer      | any whole number within the range of `int32`    |
| Decimal Number | Double       | any decimal number within the range of `double` |

### Multiple targeting rules and ordering

Add new rule by clicking on the *Actions* icon.

By adding multiple targeting rules you can create more complex rule sets.
>Rule sets are evaluated one by one, from top to bottom direction.

>Change the order of targeting rules by drag n' drop.

#### Example

*Enable a feature only to users within your company except for the sales team (Susan and Simon) by adding two targeting rules:*

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

1. <a href="https://app.configcat.com/login" target="_blank">Log in</a> to access the *Dashboard*
2. Go to **Feature Flags & Settings**
3. Select **TARGET % OF USERS** after clicking the actions icon.

![targeting-2](/assets/targeting-2.png)

## Anatomy of the percentage-based targeting

Percentage based targeting consists of **% value** and the **Served value** pairs.

### % value

Any *number between 0 and 100* that represents a randomly allocated fraction of your users.

### Served value

The exact value that will be served to the users that fall into that fraction. Depending on the kind of your setting this could be:

| Setting Kind   | Setting Type | Description                                     |
| -------------- | ------------ | ----------------------------------------------- |
| On/Off Toggle  | Boolean      | true/false, usually the state of a feature flag |
| Text           | String       | any `string`, max. 65535 characters             |
| Whole Number   | Integer      | any whole number within the range of `Int32`    |
| Decimal Number | Double       | any decimal number within the range of `double` |

## Stickiness & Consistency

The percentage-based targeting is sticky by design and consistent across all SDKs.

Percentage-based targeting is based on the identifier of the `User Object` passed to the SDK's `getValue()` methods.
The SDKs are hashing the concatenated value of the `User Object's` `identifier` and the requested Feature Flag's `Key`. Then they assign a 0-99 number to the User for a specific Feature Flag. This number is used to evaluate a particular Feature Flag's value based on it's configured rules.  
This number is fix and consistent for each User across all SDKs. The SDKs check if the assigned number is greater or less than the percentage set on the ConfigCat Dashboard.

:::caution
As not only the User's identifier is hashed but the User's identifier concatenated with the evaluated Feature Flag's key, we can ensure that you won't test on the same userbase for all of your Feature Flags.
:::

:::info
As the evaluation happens in the SDKs, your User's sensitive information will never leave your system. The data flow is unidirectional (only from ConfigCat CDN servers to your SDKs), and ConfigCat doesn't receive or store any of the User Object's attributes passed to the SDKs.
:::

### Example

Let's say you have two users and two different Feature Flags with percentage-based targeting.  

|      | isTwitterSharingEnabled                                                                 | isFacebookSharingEnabled                                                                   |
| ---- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Jane | `hash('Jane' + 'isTwitterSharingEnabled') mod 100` <br/>-> The assigned number is **8** | `hash('Jane' + 'isFacebookSharingEnabled') mod 100`  <br/>-> The assigned number is **64** |
| Joe  | `hash('Joe' + 'isTwitterSharingEnabled') mod 100` <br/>-> The assigned number is **32** | `hash('Joe' + 'isFacebookSharingEnabled') mod 100` <br/>-> The assigned number is **12**   |

1. Let's start with both Feature Flags set to **0% ON / 100% OFF**.

|      | isTwitterSharingEnabled <br/> 0% ON / 100% OFF | isFacebookSharingEnabled <br/> 0% ON / 100% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 >= 0 <br/>-> **OFF**                         | 64 >= 0 <br/>-> **OFF**                         |
| Joe  | 32 >= 0 <br/>-> **OFF**                        | 12 >= 0 <br/>-> **OFF**                         |

2. Let's set both Feature Flags to **10% ON / 90% OFF**.

|      | isTwitterSharingEnabled <br/> 10% ON / 90% OFF | isFacebookSharingEnabled <br/> 10% ON / 90% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 10 <br/>-> **ON**                          | 64 >= 10 <br/>-> **OFF**                        |
| Joe  | 32 >= 10 <br/>-> **OFF**                       | 12 >= 10 <br/>-> **OFF**                        |

:::caution
Although both Feature Flags are set to 10% ON / 90% OFF, Jane is only evaluated to **ON** for the `isTwitterSharingEnabled` Feature Flag.
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

5. If everything seems alright, we can safely increase both Feature Flags to **100% ON / 0% OFF**.

|      | isTwitterSharingEnabled <br/> 100% ON / 0% OFF | isFacebookSharingEnabled <br/> 100% ON / 0% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 100 <br/>-> **ON**                         | 64 < 100 <br/>-> **ON**                         |
| Joe  | 32 < 100 <br/>-> **ON**                        | 12 < 100 <br/>-> **ON**                         |

## Multiple options

### On/Off Toggle

When the Setting Kind is On/Off Toggle, the number of options must be 2. One for the *On* and one for the *Off* state.

### Text and Number

When the Setting Kind is *Text*, *Whole Number*, or *Decimal Number* the maximum number options depend on your subscription plan. You can add/remove options by clicking the *Actions* icon.

> The sum of all *% values* must be equal to 100.

### All other cases

This value will be served as a fallback if none of the above rules apply or a [`User Object`](advanced/user-object.md) was not passed to the [ConfigCat SDK](sdk-reference/overview.md) correctly within your application.
