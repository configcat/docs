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

## Stickiness & Consistency

The percentage-based targeting is sticky by design and consistent across all SDKs.

Percentage-based targeting by default is based on the identifier of the `User Object` passed to the SDK's `getValue()` methods.
The SDKs are hashing the concatenated value of the `User Object's` `identifier` and the requested feature flag's `Key`. Then they assign a 0-99 number to the User for a specific feature flag. This number is used to evaluate a particular feature flag's value based on the targeting rules.
This number is fix and consistent for each User across all SDKs. The SDKs check if the assigned number is greater or less than the percentage set on the ConfigCat Dashboard.

:::caution
As not only the User's identifier is hashed but the User's identifier concatenated with the evaluated feature flag's key, we can ensure that you won't test on the same userbase for all of your feature flags.
:::

:::info
As the evaluation happens in the SDKs, your User's sensitive information will never leave your system. The data flow is unidirectional (only from ConfigCat CDN servers to your SDKs), and ConfigCat doesn't receive or store any of the User Object's attributes passed to the SDKs.
:::

### Example

> ez legyen mashol valami advanced reszen

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

## Percentage options based on User Attributes

By default the percentage-based targeting is based on the User's identifier. You can also use other user attributes to evaluate the percentage-based targeting.

You can change the evaluation attribute by clicking the 3 dots on the top right corner of the feature flag and select the **Change percentage attribute** option.