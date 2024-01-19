---
id: targeting-overview
title: Targeting Overview
description: Overview of the ConfigCat targeting feature with examples.
---

Using this feature you will be able to set different setting values for specific users or groups of users in your application. Typical use cases are:
- Beta testing
- A/B testing
- Phased rollouts, canary releases

## How does it work?

1. On the <a href="https://app.configcat.com" target="_blank">ConfigCat Dashboard</a>, you add [Targeting rules] and/or [Percentage options] to your feature flag.
2. In your application, you pass a [User Object] to the setting evaluation functions of the ConfigCat SDK (`getValue`, `getAllValues`, etc.)
3. The ConfigCat SDK will use the attributes in the User Object and the rules defined on the ConfigCat Dashboard to evaluate the feature flag, that is, to determine whether or not the related feature should be enabled for the user.

## What is what?
*TODO - new screenshot*
![Targeting Overview](../../static/assets/targeting/targeting-overview/targeting.png)

### Feature Flag / Setting

A feature flag is a named boolean setting that can be turned ON or OFF. It is also known as a feature toggle, feature switch, feature flipper, conditional feature, etc.

The setting is a **string**, **integer**, **double** value that can be used to configure your application. It is also known as a configuration value, configuration setting, configuration parameter, etc.

### Targeting Rule

A targeting rule is a collection of conditions (IF / AND items) and values (THEN item). It is used to determine whether a feature flag or setting is enabled or not for a specific user. More about targeting rules [here].

### Condition (IF / AND item)

A condition is a boolean expression that can be evaluated to true or false. It is used to determine whether a targeting rule is a match or not for a specific user. More about conditions [here].

### Value

A value is the served value of a feature flag or setting. It can be a boolean, string, integer, or double value.

### Percentage option

A percentage option is a value that is served to a specific percentage of users. More about percentage options [here].

### "To all users" value / Fallback value

A fallback value is a value that is served to users who are not matched by any targeting rule. Or serves as a fallback value if a [User Object] is not given.

### User Object

A user object is a collection of user attributes that can be used to target users. You have to pass a user object to the ConfigCat SDK in your application to use the targeting feature. More about user object [here]. 

## Examples

### Phased rollout / Canary release / Percentage rollout Scenario

**Intent:** In our sample company (Galactic AI Inc.), we want to release a new feature (Advanced Cognition) to 10% of our users and everyone at our company. We want to make sure that the new feature is working as expected before we release it to everyone.

**Solution:** Have a feature flag called `Enable Advanced Cognition` with a percentage option of 10% and a targeting rule that matches everyone whose email address ends with `@galactic.example`.

#### Dashboard
![Targeting Example 1](../../static/assets/targeting/targeting-overview/example1.png)

#### Code

```js
// Create a user object
var user = {
    identifier: '867428724',
    email: 'isaac@galactic.example'
};

// Get the value of the feature flag
```


*TODO - come up with new examples and screenshots*

*TODO - Have a code example in parallel with the screenshots*

This is the simplest feature flag you can create. It is enabled for everyone.
![Basic Feature Flag](../../static/assets/targeting/basic.png)

This feature flag is enabled for everyone whose email address ends with `@example.com`.
![Simple Feature Flag](../../static/assets/targeting/simple.png)

This is a more complex feature flag. It is enabled for everyone whose email address ends with `@example.com` AND the OS is `iOS or Android`. This flag is also enabled for everyone who is among the `Beta Users` segment. Read more about segments [here](/targeting/targeting-rules/segment-condition).
![Complex Feature Flag](../../static/assets/targeting/complex.png)