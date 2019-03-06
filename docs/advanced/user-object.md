---
id: user-object
title: The User Object
---
The User Object is an optional parameter when getting a feature flag or setting value from ConfigCat. It represents a user in your application. 

>The *User Object* is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature.

Also, it contains user-specific information as a basis to evaluate what Feature Flag state or setting value should be returned by ConfigCat.

## Security concerns first
Keeping your user data safe was one of our main goals when designing ConfigCat. The main concept here is that the ConfigCat SDK which connects your application to our servers always pulls your configs and never pushes back any data.

>In ConfigCat the Feature Flag and Setting **evaluation is on the Client** side within the ConfigCat SDK. This means that your **user data will never leave your system**. 

This way you can create your targeting rules even based on data considered sensitive.
You can double check the above since all the [ConfigCat SDKs are open source and on GitGub](https://github.com/configcat).

## User Object's structure

The data that could and should be passed to the User Object.

Property|Description
---|---
Identifier|**REQUIRED** Unique identifier of a user in your application. e.g: userId ("123456"), email ("configcat@example.com"), GUID ("kjfh893bjd2273hl"). Required because we need at least one unique item per user to differentiate them from each other. And to be able to evaluate the setting value for percentage based targeting.
Email|**OPTIONAL** Email address of your user. By adding this parameter you will be able to create Email address based targeting. e.g: Turn on a feature for only users with @example.com addresses.
Country|**OPTIONAL** Fill this for location or country based targeting. e.g: Turn on a feature for users in Canada only.
Custom|**OPTIONAL** This parameter will let you create targeting based on any user data you like. e.g: Age, Subscription type, User role etc.