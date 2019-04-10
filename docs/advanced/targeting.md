---
id: targeting
title: Targeting
---
Using this feature you will be able set different setting values for different users in your application. Lets say you would like to enable a feature only for the users within your company  or only to a small percentage of your users before releasing it to the entire world.

## Targeting specific users
### Enable feature
1. <a href="https://app.configcat.com/login" target="_blank">Log in</a> to access the *Management Console*
2. Go to **Feature Flags & Settings**
3. Select **TARGET SPECIFIC USERS** after clicking the actions icon.

![targeting-1](assets/targeting-1.png)

## Anatomy of a Targeting Rule
By adding a rule you can specify a group of your users whom a feature will be enabled or a different value will be served. A rule consists of an **Attribute** of a user in your application, a **Comparison value** (e.g., a list of email addresses) and a **Comparator**. ConfigCat evaluates the targeting rule every time your application requires and decides what value to serve.
### Attribute
A property of your user (e.g. *email address*, *geographic location*). Your application should pass the attribute values (e.g. *jane@example.com*, *Europe*) to ConfigCat for comparison.

There are 3 preset attributes. Additionally you can define your ***custom attributes*** as well:
Attribute Name|Description
---|---
`Email`|The e-mail address of your user.
`Identifier`|Usually a unique user identifier in your application.
`Country`|Might come useful for testing a new feature only in one country.
`Custom`|***Define any attribute (e.g. `OS version`), by typing its name to the textbox.***

### Comparison value
Any string, number or comma separated list to be compared with the selected *Attribute* using the *Comparator*.

### Comparator
Comparator|Description
---|---
IS IN|Checks if the *Attribute* passed by your application is within the *Comparison value*.
IS NOT IN|True if the *Attribute* is not within the *Comparison value*.
CONTAINS|True if the *Attribute* contains the *Comparison value*.
NOT CONTAINS|True if the *Attribute* doesn't contain the *Comparison value*.

### Served value
The exact value that will be served to the users that match the targeting rule. Depending on the kind of your setting this could be:
Setting Kind|Setting Type|Description
---|---|---
On/Off Toggle|Boolean|true/false, usually the state of a feature flag
Text|String|any string, max. 1000 characters
Whole Number|Integer|any whole number within the range of `int`
Decimal Number|Double|any decimal number within the range of `double`

### Multiple targeting rules and ordering
Add new rule by clicking on the *Actions* icon.

By adding multiple targeting rules you can create more complex rule sets.
>Rule sets are evaluated one by one, from top to bottom direction.

>Change the order of targeting rules by drag n' drop.

#### Example
*Enable a feature only to users within your company except the sales team (Susan and Simon) by adding two targeting rules:*
#|Attribute|Comparator|Comparison value|Served value
---|---|---|---|---|
1|Email|CONTAINS|`susan@mycompany.com, simon@mycompany.com`|OFF
2|Email|CONTAINS|`@mycompany.com`|ON
All other cases: OFF

### All other cases
This value will be served as a fallback if none of the above rules apply or a [`User Object`](user-object) was not passed to the [ConfigCat SDK](sdk-reference/overview.md) correctly within your application.

## Targeting a percentage of users
With percentage-based user targeting you can specify a randomly selected fraction of your users whom a feature will be enabled or a different value will be served.

### Enable feature
1. <a href="https://app.configcat.com/login" target="_blank">Log in</a> to access the *Management Console*
2. Go to **Feature Flags & Settings**
3. Select **TARGET % OF USERS** after clicking the actions icon.

![targeting-1](assets/targeting-1.png)

## Anatomy of the percentage targeting
Percentage based targeting add up from the **% value** and the **Served value**.
### % value
Any *number between 0 and 100* that represents a randomly allocated fraction of your users.
### Served value
The exact value that will be served to the users that fall into that fraction. Depending on the kind of your setting this could be:
Setting Kind|Setting Type|Description
---|---|---
On/Off Toggle|Boolean|true/false, usually the state of a feature flag
Text|String|any `string`, max. 1000 characters
Whole Number|Integer|any whole number within the range of `int`
Decimal Number|Double|any decimal number within the range of `double`

## Multiple options
### On/Off Toggle
When the Setting Kind is On/Off Toggle the number of options must be 2. One for the *On* and one for the *Off* state.
### Text and Number
When the Setting Kind is *Text*, *Whole Number* or *Decimal Number* the maximum number options depends on your subscription plan. You can add/remove options by clicking the *Actions* icon.

> The sum of all *% values* must be equal to 100.

### All other cases
This value will be served as a fallback if none of the above rules apply or a [`User Object`](user-object) was not passed to the [ConfigCat SDK](sdk-reference/overview.md) correctly within your application.