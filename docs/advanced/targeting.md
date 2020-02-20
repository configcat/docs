---
id: targeting
title: Targeting
---
Using this feature you will be able to set different setting values for different users in your application. Lets say you would like to enable a feature only for the users within your company  or only to a small percentage of your users before releasing it to the entire world.

## Targeting specific users

### Enable feature

1. <a href="https://app.configcat.com/login" target="_blank">Log in</a> to access the *Dashboard*
2. Go to **Feature Flags & Settings**
3. Select **TARGET SPECIFIC USERS** after clicking the actions icon.

![targeting-1](assets/targeting-1.png)

## Anatomy of a Targeting Rule

By adding a rule, you specify a group of your users and specify what feature flag - or other setting - value they should get. A rule consists of an **Attribute** of a user in your application (e.g. email address), a **Comparison value** (e.g. a list of email addresses) and a **Comparator** (e.g. IS ONE OF). ConfigCat evaluates the targeting rule every time your application requires and decides what value to serve.

### Attribute

A property of your user (e.g. *email address*, *geographic location*). Your application should pass the attribute values (e.g. *jane@example.com*, *Europe*) to ConfigCat for comparison.

There are 3 predefined attributes. Additionally you can define your own ***custom attributes*** as well:

| Attribute Name | Description                                                                        |
| -------------- | ---------------------------------------------------------------------------------- |
| `Email`        | The e-mail address of your user.                                                   |
| `Identifier`   | Usually a unique user identifier in your application.                              |
| `Country`      | Might come useful for testing a new feature only in one country.                   |
| `Custom`       | ***Define any attribute (e.g. `OS version`), by typing its name to the textbox.*** |

### Comparison value

Any string, number or comma separated list. Will be compared to the selected *Attribute* using the *Comparator*. **Max Length: 65535 chars**

### Comparator

#### Text comparators

The following comparators assume that *Attribute* and *Comparison value* contain string/text.

| Comparator       | Description                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| IS ONE OF        | Checks if the *Attribute* is listed in the *Comparison value*. *Comparison value* should be a comma separated list. |
| IS NOT ONE OF    | True if the *Attribute* is not listed in the *Comparison value*.                                                    |
| CONTAINS         | True if the *Attribute* contains the *Comparison value*.                                                            |
| DOES NOT CONTAIN | True if the *Attribute* doesn't contain the *Comparison value*.                                                     |

#### Sensitive text comparators (Beta)

If you don't see them among your comparators, please <a href="https://configcat.com/Support/ContactUs" target="_blank">contact us</a> 
and we are happy to turn this feature on.

> Please note that sensitive text comparators are only available in configcat-js (from v2.1.1) and configcat-node (from v3.1.1). 
> Accessing feature flags using other SDKs might cause critical errors in your application.

Use sensitive text comparators if you are using ConfigCat with frontend applications and you are targeting users based on sensitive data 
(like email addresses). In this case the feature flag evaluation is based on the secure hashes of your comparison values. So whenever 
the ConfigCat SDK downloads the feature flag values and all the targeting rules associated with them the exact values of the rules are not visible.

| Comparator                | Description                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| IS ONE OF (Sensitive)     | Checks if the *Attribute* is listed in the *Comparison value*. *Comparison value* should be a comma separated list. |
| IS NOT ONE OF (Sensitive) | True if the *Attribute* is not listed in the *Comparison value*.                                                    |

Since sensitive text comparators don't support CONTAINS like comparisons, here is an example how to target users from the same company. 
Adding a `domain` custom attribute and using only sensitive comparators to target them.

On the Dashboard:
![targeting-1](assets/sensitive1.png)

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

#### Semantic version comparators

The following comparators assume that *Attribute* and *Comparison value* contain semantic versions.
Evaluation is based on <a target="_blank" href="https://semver.org/">the SemVer Semantic Version Specification</a>.

| Comparator             | Description                                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| IS ONE OF (Semver)     | True if *Attribute* is listed in the *Comparison value*. *Comparison value* should be a comma separated list of semantic versions. |
| IS NOT ONE OF (Semver) | True if the *Attribute* is not listed in the *Comparison value*.                                                                   |
| < (Semver)             | True if *Attribute* is a smaller version number than *Comparison value*.                                                           |
| <= (Semver)            | True if *Attribute* is smaller than or equals *Comparison value*.                                                                  |
| \> (Semver)            | True if *Attribute* is a larger version number than *Comparison value*.                                                            |
| \>= (Semver)           | True if *Attribute* is larger than or equals *Comparison value*.                                                                   |

All semantic version comparators return `false` if either *Attribute* or *Comparison value* is not a valid <a target="_blank" href="https://semver.org/">semantic version</a>.

#### Number comparators

The following comparators assume that *Attribute* and *Comparison value* contain numbers. 

| Comparator   | Description                                                      |
| ------------ | ---------------------------------------------------------------- |
| = (Number)   | True if *Attribute* equals *Comparison value*.                   |
| <> (Number)  | True if *Attribute* does not equal *Comparison value*.           |
| < (Number)   | True if *Attribute* is less than *Comparison value*.             |
| <= (Number)  | True if *Attribute* is less than or equals *Comparison value*.   |
| \> (Number)  | True if *Attribute* is a larger than *Comparison value*.         |
| \>= (Number) | True if *Attribute* is larger than or equals *Comparison value*. |

All number comparators return `false` if either *Attribute* or *Comparison value* is not a valid number.

### Served value

The exact value that will be served to the users who match the targeting rule. Depending on the kind of your setting this could be:

| Setting Kind   | Setting Type | Description                                     |
| -------------- | ------------ | ----------------------------------------------- |
| On/Off Toggle  | Boolean      | true/false, usually the state of a feature flag |
| Text           | String       | any string, max. 65535 characters               |
| Whole Number   | Integer      | any whole number within the range of `int`      |
| Decimal Number | Double       | any decimal number within the range of `double` |

### Multiple targeting rules and ordering

Add new rule by clicking on the *Actions* icon.

By adding multiple targeting rules you can create more complex rule sets.
>Rule sets are evaluated one by one, from top to bottom direction.

>Change the order of targeting rules by drag n' drop.

#### Example

*Enable a feature only to users within your company except the sales team (Susan and Simon) by adding two targeting rules:*

| #   | Attribute | Comparator | Comparison value                           | Served value |
| --- | --------- | ---------- | ------------------------------------------ | ------------ |
| 1   | Email     | CONTAINS   | `susan@mycompany.com, simon@mycompany.com` | OFF          |
| 2   | Email     | CONTAINS   | `@mycompany.com`                           | ON           |
All other cases: OFF

### To all other users, serve

This value will be served as a fallback if none of the above rules apply or a [`User Object`](advanced/user-object.md) is not passed to the [ConfigCat SDK](sdk-reference/overview.md) correctly within your application.

## Targeting a percentage of users

With percentage-based user targeting you can specify a randomly selected fraction of your users whom a feature will be enabled or a different value will be served.

### Enable feature

1. <a href="https://app.configcat.com/login" target="_blank">Log in</a> to access the *Dashboard*
2. Go to **Feature Flags & Settings**
3. Select **TARGET % OF USERS** after clicking the actions icon.

![targeting-1](assets/targeting-1.png)

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
| Whole Number   | Integer      | any whole number within the range of `int`      |
| Decimal Number | Double       | any decimal number within the range of `double` |

## Multiple options

### On/Off Toggle

When the Setting Kind is On/Off Toggle the number of options must be 2. One for the *On* and one for the *Off* state.

### Text and Number

When the Setting Kind is *Text*, *Whole Number* or *Decimal Number* the maximum number options depends on your subscription plan. You can add/remove options by clicking the *Actions* icon.

> The sum of all *% values* must be equal to 100.

### All other cases

This value will be served as a fallback if none of the above rules apply or a [`User Object`](advanced/user-object.md) was not passed to the [ConfigCat SDK](sdk-reference/overview.md) correctly within your application.
