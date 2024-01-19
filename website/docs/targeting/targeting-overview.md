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
2. In your application, you pass a [User Object] to the ConfigCat SDK.
3. The ConfigCat SDK will use the User Object and the rules defined on the Dashboard to determine whether feature should be enabled for the user.

## What is what?
*TODO - new screenshot*
![Targeting Overview](../../static/assets/targeting/targeting-overview/targeting.png)

### Feature Flag / Setting

A *setting* is a set of rules that yields a **boolean**, **string**, **integer** or **double** value, which can be used to configure your application. It is also known as a configuration value, configuration setting, configuration parameter, etc.

A *feature flag* is a setting that yields a **boolean** value, that is used to decide whether an application feature should be turned ON or OFF. It is also known as a feature toggle, feature switch, feature flipper, conditional feature, etc.

:::info
Since the most common type of settings is feature flag, we usually use that term throughout the documentation for the sake of simplicity - even though setting is the more general term. In other words, when feature flags are mentioned, it also applies to settings unless stated otherwise.
:::

### Targeting Rule

A *targeting rule* consists of two parts: a collection of conditions and a value to serve. In case the conditions are met (the targeting rule *matches*), the value is served to the user. More about targeting rules [here].

### Condition (IF / AND item)

A *condition* is a logical expression that can be evaluated to true or false. There are three types of conditions: [User condition], [Flag condition (Prerequisite)], [Segment condition]. For a targeting rule to match, all of its conditions must evaluate to true. More about conditions [here].

### Value

A *value* is the outcome of a feature flag or setting. It can be a boolean, string, integer, or double value.

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