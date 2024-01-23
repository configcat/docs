---
id: user-object
title: User Object
description: The user object lets you target users based on their properties with different features. The user object is essential for beta and A/B testing.
---

The *User Object*  is a collection of *user attributes* that describe the properties of a user. The *User Object* is necessary define [targeting rules] and [percentage options].
It allows you to pass potential [Targeting rule](/advanced/targeting) variables to the ConfigCat SDK.
And represents a user in your application.

:::info
The *User Object* is essential if you'd like to use ConfigCat's [Targeting](/advanced/targeting) feature.
:::

## The relationship between User Object and Targeting rules

**As a product manager**, you can define [Targeting rules](/advanced/targeting) on the <a href="https://app.configcat.com" target="_blank">ConfigCat Dashboard</a> based on the user attributes that are provided by your application.

**As a developer**, User Object allows you to pass user attributes to the ConfigCat SDK, which you (or your teammates) can reference in the [Targeting rules](/advanced/targeting) <a href="https://app.configcat.com" target="_blank">ConfigCat Dashboard</a>.

### Example

Let's say on the <a href="https://app.configcat.com" target="_blank">Dashboard</a> you'd like to have the following targeting rule:

`myAwesomeFeature` is `ON` if `User's Email` `CONTAINS` `@example.com`, otherwise it is `OFF`.

The ConfigCat SDK will return `true` for a _User Object_ with an email address of `jane@example.com`, and it will return `false` for a _User Object_ with an email address of `jane@gmail.com`

To achieve this, your application needs to pass the email address of your user to the ConfigCat SDK via _User Object_.

```csharp
User user = new User("jane@example.com")

var isEnabled = client.GetValue("myAwesomeFeature", false, user);
```

Or if you want to target based on other user details as well.

```csharp
User user = new User("##SOME-USER-IDENTIFICATION##")
{
    Country = "Awesomnia",
    Email = "jane@example.com",
    Custom =
    {
        { "SubscriptionType", "Pro"},
        { "Role", "Knight of Awesomnia"}
    }
};

var isEnabled = client.GetValue("myAwesomeFeature", false, user);

```

## Security concerns

Keeping your user data safe was one of our main goals when designing ConfigCat. The main concept here is that the ConfigCat SDK which connects your application to our servers never pushes any data to the ConfigCat servers. It pulls only configs and targeting rules.

:::info
Feature Flag and Setting **evaluation is on the Client** side within the [ConfigCat SDKs](https://github.com/configcat). This means that **any sensitive data passed to ConfigCat will never leave your system**.
:::

## User Object's structure

The data that could and should be passed to the User Object.

| Attribute  | Description                                                                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Identifier | **REQUIRED** We recommend adding a UserID, Email address, or SessionID.                                                                                                  |
| Email      | **OPTIONAL** By adding this parameter you will be able to create Email address-based targeting. e.g: Only turn on a feature for users with @example.com addresses.       |
| Country    | **OPTIONAL** Fill this for location or country-based targeting. e.g: Turn on a feature for users in Canada only.                                                         |
| Custom     | **OPTIONAL** This parameter will let you create targeting based on any user data you like. e.g: Age, Subscription type, User role, Device type, App version number, etc. |

### Identifier attribute

Unique identifier of a user in your application. This is a **REQUIRED** attribute which enables ConfigCat to differentiate your users from each other and to evaluate the feature flag values for percentage options.

Our recommendation as an identifier:

- User ID - If you have one in your application you can use the same User ID with ConfigCat.
- Email address - In most cases adding an email address works perfectly here, as long as it is unique.
- SessionId - This is useful for when you want to target users who are not logged in to your application.

### Custom attributes

First, you need to pass a User Object containing the `custom` attribute to the ConfigCat SDK.

> In case **a custom attribute is not passed** to the SDK or it's value is **falsy** (unknown, null, ""), the corresponding **targeting rule will be skipped** and the evaluation will continue with the next rule.

> The custom attribute's value can be multiple types. e.g: string, number, date, array of strings, etc. Check the [SDK reference](sdk-reference/overview) for more details.

Example:

```javascript
var userObject = {
  identifier: '<unique-identifier-here>', // required
  custom: {
    SubscriptionType: 'Pro',
    UserRole: 'Admin',
  },
};
```

_The above code sample is in JavaScript. You can find code samples for other platforms in the [SDK reference.](sdk-reference/overview)_

On the Dashboard a targeting rule for the custom attribute `EyeColor` would look like:
<img src="/docs/assets/custom-property-ui.png" className="zoomable" alt="customPropertyUsageDashboard" />
