---
id: percentage-based
title: Percentage-based Targeting
description: With percentage-based user targeting is a technique used in software development and feature management to gradually release a new feature to a subset of users.
---

```
mi az a % alapú targetálás alias “% options”, mire jó, mit lehet vele elérni? - “…a specific percentage of users are selected to receive access to the feature. This allows developers to control and monitor the impact of the new feature in a controlled manner.”
hol tud % options-t hozzáadni egy ff-hez a dashboardon
hogyan működik nagy vonalakban? - csak amennyire egy product managernek értenie kell, kb:
a csoportosítás egy user objectben beadott attibútumon alapul (defaultból ez a User.Identifier, de át lehet állítani ff szinten + hol lehet átállítani screenshottal)
a csoportosítás véletlenszerű, de sticky (az, hogy a stickységet technikailag hogyan érjük el, az nem ide tartozik, max. egy link lenne a technikai leírásra)
mi történik, ha nem adják be a % options kiértékeléséhez szükséges user attribútumot? (ilyenkor ff végén lévő fallback value lesz az eredmény)
példa - dashboard screenshot egy feltétel nélküli % optionös ff-ről, rövid szöveges magyarázattal, pl. “ha a User.Identifierben ezt az X értéket adják be, akkor ebbe a csoportba kerül, ha azt az Y értéket, akkor meg abba a csoportba”
```

Percentage-based targeting, also known as percentage rollouts or feature rollouts, is a technique used in software development and feature management to gradually release a new feature to a subset of users. Instead of releasing a feature to all users at once, a specific percentage of users are selected to receive access to the feature. This allows developers to control and monitor the impact of the new feature in a controlled manner.


### Enable feature

1. <a href="https://app.configcat.com/auth/login" target="_blank">Log in</a> to access the _Dashboard_
2. Go to **Feature Flags & Settings**
3. Select **TARGET % OF USERS** after clicking the actions icon.

<img src="/docs/assets/targeting-2.png" className="zoomable" alt="targeting-2" />

## Anatomy of the percentage-based targeting

Percentage-based targeting consists of **% value** and the **Served value** pairs.

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

## Multiple options

### On/Off Toggle

When the Setting Kind is On/Off Toggle, the number of options must be 2. One for the _On_ and one for the _Off_ state.

### Text and Number

When the Setting Kind is _Text_, _Whole Number_, or _Decimal Number_ the maximum number options depend on your subscription plan. You can add/remove options by clicking the _Actions_ icon.

> The sum of all _% values_ must be equal to 100.

### All other cases

This value will be served as a fallback if none of the above rules apply or a [`User Object`](advanced/user-object.md) was not passed to the [ConfigCat SDK](sdk-reference/overview.md) correctly within your application.

## Percentage options based on User Attributes

By default the percentage-based targeting is based on the User's identifier. You can also use other user attributes to evaluate the percentage-based targeting.

You can change the evaluation attribute by clicking the 3 dots on the top right corner of the feature flag and select the **Change percentage attribute** option.