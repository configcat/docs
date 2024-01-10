---
id: targeting-overview
title: Targeting Overview
description: Overview of the ConfigCat targeting feature with examples.
---

Using this feature you will be able to set different setting values for different users in your application. Typical use cases are:
- Beta testing
- A/B testing
- Phased rollouts, canary releases

## How does it work?

1. You define a [Targeting rule](TODO) on the <a href="https://app.configcat.com" target="_blank">ConfigCat Dashboard</a>.
2. You pass a [User Object](TODO) to the ConfigCat SDK in your application.
3. ConfigCat will use the User Object and the Targeting Rule to determine which features are enabled for the user.

## What is what?
*TODO - new screenshot*
![Targeting Overview](../../static/assets/targeting/targeting.png)

### Feature Flag / Setting

A feature flag is a named boolean setting that can be turned ON or OFF. It is also known as a feature toggle, feature switch, feature flipper, conditional feature, etc.

The setting is a **string**, **integer**, **double** value that can be used to configure your application. It is also known as a configuration value, configuration setting, configuration parameter, etc.

### Targeting Rule

A targeting rule is a collection of conditions (IF / AND items) and values (THEN item). It is used to determine whether a feature flag or setting is enabled or not for a specific user. More about targeting rules [here](TODO).

### Condition (IF / AND item)

A condition is a boolean expression that can be evaluated to true or false. It is used to determine whether a targeting rule is a match or not for a specific user. More about conditions [here](TODO).

### Value

A value is the served value of a feature flag or setting. It can be a boolean, string, integer, or double value.

### Percentage option

A percentage option is a value that is served to a specific percentage of users. More about percentage options [here](TODO).

### "To all users" value / Fallback value

A fallback value is a value that is served to users who are not matched by any targeting rule. Or serves as a fallback value if a [User Object](TODO) is not given. More about fallback values [here](TODO).

### User Object

A user object is a collection of user attributes that can be used to target users. More about user objects [here](TODO).

## Examples

*TODO - come up with new examples and screenshots*

*TODO - Have a code example in parallel with the screenshots*

This is the simplest feature flag you can create. It is enabled for everyone.
![Basic Feature Flag](../../static/assets/targeting/basic.png)

This feature flag is enabled for everyone whose email address ends with `@example.com`.
![Simple Feature Flag](../../static/assets/targeting/simple.png)

This is a more complex feature flag. It is enabled for everyone whose email address ends with `@example.com` AND the OS is `iOS or Android`. This flag is also enabled for everyone who is among the `Beta Users` segment. Read more about segments [here](segments.md).
![Complex Feature Flag](../../static/assets/targeting/complex.png)