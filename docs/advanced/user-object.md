---
id: user-object
title: The User Object
---
The User Object represents a user in your application that contains all the user specific information required by ConfigCat to evaluate what Feature Flag state or setting value should be returned.

>The *User Object* is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature.

## Security concerns first
>In ConfigCat the Feature Flag and Setting **evaluation is on the Client** side within the ConfigCat SDK. This means that your **user data will never leave your system**. 

Keeping your user data safe was one of our main goals when designing ConfigCat.

## User Object's structure


Property|Description
---|---
Identifier|**REQUIRED** Unique identifier of a user in your application. e.g: userId ("123456"), email ("configcat@example.com"), GUID ("kjfh893bjd2273hl")