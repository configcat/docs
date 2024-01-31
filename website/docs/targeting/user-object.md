---
id: user-object
title: User Object
description: The user object lets you target users based on their properties with different features. The user object is essential for beta and A/B testing.
---

The *User Object*  is a collection of *user attributes* that describe the properties of a user. The *User Object* is necessary to define [targeting rules] and [Percentage Options].
It allows you to pass potential [Targeting rule](/advanced/targeting) variables to the ConfigCat SDK. The user object represents a user in your application.

:::info
The *User Object* is essential if you'd like to use ConfigCat's [Targeting](/advanced/targeting) feature.
:::

## The relationship between the User Object and Targeting rules

**As a product manager**, you can define [Targeting rules](/advanced/targeting) on the <a href="https://app.configcat.com" target="_blank">ConfigCat Dashboard</a> based on the user attributes that are provided by your application.

**As a developer**, User Object allows you to pass user attributes to the ConfigCat SDK, which you (or your teammates) can reference in the [Targeting rules](/advanced/targeting) on the <a href="https://app.configcat.com" target="_blank">Dashboard</a>.

## Security and privacy concerns

ConfigCat was designed with security and privacy in mind. The evaluation process is entirely implemented within the SDKs, meaning **your users' sensitive data never leaves your system**. The data flow is one-way – from ConfigCat CDN servers to your SDKs – and ConfigCat does not receive or store any attributes of the User Object passed to the SDKs. This design prioritizes the privacy and security of user data.

## Anatomy of the User Object

The data that could and should be passed to the User Object.

| Attribute  | Description                                                                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Identifier | **REQUIRED** We recommend adding a UserID, Email address, or SessionID.                                                                                                  |
| Email      | **OPTIONAL** By adding this parameter, you can create Email address-based targeting. e.g.: Only turn on a feature for users with @example.com addresses.                 |
| Country    | **OPTIONAL** Fill this for location or country-based targeting. e.g.: Turn on a feature for users in Canada only.                                                        |
| Custom     | **OPTIONAL** This parameter will let you create targeting based on any user data you like. e.g: Age, Subscription type, User role, Device type, App version number, etc. |

### Code example

```js
let userObject = new configcat.User(
  '#UNIQUE-USER-IDENTIFIER#', // Identifier attribute (Required)
  'john@example.com', // Email attribute (Optional)
  'United Kingdom', // Country attribute (Optional)
  { // Custom attributes (Optional)
    SubscriptionType: 'Pro', 
    UserRole: 'Admin',
  },
);
```

### Identifier attribute

Unique identifier of a user in your application. This is a **REQUIRED** attribute which enables ConfigCat to differentiate your users from each other and to evaluate the feature flag values for Percentage Options.

Our recommendation as an identifier:

- User ID - If you have one in your application, you can use the same User ID with ConfigCat.
- Email address - In most cases, adding an email address works perfectly here, as long as it is unique.
- SessionId - This is useful for targeting users who are not logged in to your application.

### Custom attributes

First, you must pass a User Object containing the `custom` attribute to the ConfigCat SDK.

> In case **a custom attribute is not passed** to the SDK or its value is **falsy** (unknown, null, ""), the corresponding **targeting rule will be skipped**, and the evaluation will continue with the next rule.

> The custom attribute's value can be multiple types. e.g.: string, number, date, array of strings, etc. Check the [SDK reference](sdk-reference/overview) for more details.

### Example: Enable a feature for users with a specific subscription type

#### Goal
Let's enable the `Personalized Layout` feature for users with a `Pro` subscription type.

#### Solution
In this case, `SubscriptionType` is the custom attribute. The comparator is `EQUALS`, meaning the `Enable Personalized Layout` feature flag will be enabled only if the `SubscriptionType` custom attribute is `Pro`.

#### Dashboard
![User object example](/assets/targeting/user-object/user-object-example.jpg)

#### Code
Add the `SubscriptionType` custom attribute to the User Object in your application code.

```js
var userObject = {
  identifier: '<unique-identifier-here>', // required
  custom: {
    SubscriptionType: 'Pro',
  },
};
```



