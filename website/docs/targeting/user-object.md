---
id: user-object
title: User Object
description: The User Object is a collection of *user attributes* that describe the properties of a user. The User Object is essential for targeting.
---

The *User Object* is a collection of *user attributes* that describe the properties of a user. The *User Object* is necessary to evaluate [Targeting Rules](../targeting-rule/targeting-rule-overview) and [Percentage Options](../percentage-options).
It allows you to pass the user attributes that are referenced in the rules of the feature flag to the ConfigCat SDK. The User Object represents a user in your application.

:::info
The *User Object* is essential if you'd like to use ConfigCat's [Targeting](../targeting-overview) feature.
:::

## The relationship between the User Object and Targeting Rules

**As a product manager**, you can define [Targeting Rules](../targeting-rule/targeting-rule-overview) on the <a href="https://app.configcat.com" target="_blank">ConfigCat Dashboard</a> based on the user attributes that are provided by your application.

**As a developer**, User Object allows you to pass user attributes to the ConfigCat SDK, which you (or your teammates) can reference in the [Targeting Rules](../targeting-rule/targeting-rule-overview) on the <a href="https://app.configcat.com" target="_blank">Dashboard</a>.

## Security and privacy concerns

ConfigCat was designed with security and privacy in mind. The evaluation process is entirely implemented within the SDKs, meaning **your users' sensitive data never leaves your system**. The data flow is one-way – from ConfigCat CDN servers to your SDKs – and ConfigCat does not receive or store any attributes of the User Object passed to the SDKs. This design prioritizes the privacy and security of user data.

## Anatomy of the User Object

The data that can be stored in the User Object:

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

To use custom attributes, you need to pass a User Object containing the `custom` attribute to the ConfigCat SDK.

> The custom attribute's value can be multiple types. e.g.: string, number, date, array of strings, etc. Check the [SDK reference](../../sdk-reference/overview) for more details.

### Example: Enable a feature for users with a specific subscription type

#### Context
Our demo company, Whisker Co. developed a new feature called `Personalized Layout` to enhance the user experience of their most valuable customers.

#### Goal
We want to enable the `Personalized Layout` feature but only for customers with the `Pro` subscription type.

#### Solution
To achieve this goal, we need a custom attribute named e.g. `SubscriptionType`, which stores the subscription type of the customer.

This allows us to define a Targeting Rule that turns on the feature for the customers whose `SubscriptionType` attribute is `Pro`. Finally, we need to make sure that the "To all others" value is OFF so the feature is turned off for the rest of the customers.

#### Dashboard
![User Object example](/assets/targeting/user-object/user-object-example.jpg)

#### Code
Add the `SubscriptionType` custom attribute to the User Object in your application code.

```js
let userObject = new configcat.User('<unique-identifier-here>', undefined, undefined, { 
    SubscriptionType: 'Pro',
});
```