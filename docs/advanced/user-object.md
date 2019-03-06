---
id: user-object
title: The User Object
---

The User Object is an optional parameter when getting a feature flag or setting value from ConfigCat. 
It allows you to pass potential [Targeting rule](advanced/targeting.md) variables to the ConfigCat SDK.
And represents a user in your application. 

>The *User Object* is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature.

Also, it contains user-specific information as a basis to evaluate what Feature Flag state or setting value should be returned by ConfigCat.

## The relationship between User Object and Targeting rules

**As a product manager**, you can set [Targeting rules](advanced/targeting.md) in the <a href="https://configcat.com/App" target="_blank">ConfigCat Admin Console</a> based on the parameters given to ConfigCat by your application.

**As a developer**, User Object allows you to pass optional parameters to the ConfigCat SDK, which you (or your teammates) can use in the <a href="https://configcat.com/App" target="_blank">ConfigCat Admin Console</a> to apply [Targeting rules](advanced/targeting.md) on.

### Example
Let's say in the <a href="https://configcat.com/App" target="_blank">Admin Console</a> you'd like to have the following targeting rule:

`newUI` feature is `ON` if `User's Email contains @example.com`, otherwise it is `OFF`.

The ConfigCat SDK will return `true` for a User Object with an email address of `jane@example.com`, and it will return `false` for a User Object with an email address of `john@gmail.com`

To achieve this, your application needs to pass the email address of your user to the ConfigCat SDK via User Object.

## Security concerns
Keeping your user data safe was one of our main goals when designing ConfigCat. The main concept here is that the ConfigCat SDK which connects your application to our servers always pulls your configs and never pushes back any data.

>Feature Flag and Setting **evaluation is on the Client** side within the ConfigCat SDK. This means that your **user data will never leave your system**. 

This allows you to create targeting rules based on sensitive data.
You can double check the above since all the <a href="https://github.com/configcat" target="_blank">ConfigCat SDKs are open source and on GitHub.</a>

## User Object's structure

The data that could and should be passed to the User Object.

Property|Description
---|---
Identifier|**REQUIRED** *Please see description below the table.*
Email|**OPTIONAL** Email address of your user. By adding this parameter you will be able to create Email address based targeting. e.g: Turn on a feature for only users with @example.com addresses.
Country|**OPTIONAL** Fill this for location or country based targeting. e.g: Turn on a feature for users in Canada only.
Custom|**OPTIONAL** This parameter will let you create targeting based on any user data you like. e.g: Age, Subscription type, User role etc.

### Identifier property
Unique identifier of a user in your application. Required because we need to differentiate your users  from each other and to be able to evaluate the setting value for percentage based targeting.

Our recommendation as an identifier:
- User ID - If you have one in your application you can use the same User ID with ConfigCat.
- Email address - In most cases adding an email address works perfectly here. As long as it is unique.
- SessionId - This comes useful when you'd like to target users who aren't logged in your application.




