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
3. The ConfigCat SDK will use the User Object and the rules defined on the Dashboard to determine whether the feature should be enabled for the user.

## What is what?
![Targeting Overview](/assets/targeting/targeting-overview/targeting.jpg)

### Feature Flag / Setting

A *setting* is a set of rules that yields a **boolean**, **string**, **integer** or **double** value, which can be used to configure your application. It is also known as a configuration value, configuration setting, configuration parameter, etc.

A *feature flag* is a **boolean** setting that is used to decide whether an application feature should be turned ON or OFF. It is also known as a feature toggle, feature switch, feature flipper, conditional feature, etc.

:::info
Throughout this documentation, we generally use the term *feature flag* to refer to both feature flags and settings for simplicity, because feature flags are the most common type of settings.
:::

### Targeting Rule

A *targeting rule* consists of two parts: a collection of conditions and a value to serve. In case the conditions are met (the targeting rule *matches*), the value is served to the user. More about targeting rules [here].

### Condition

A *condition* is a logical expression that can be evaluated to true or false. There are three types of conditions: [User condition], [Flag condition (Prerequisite)], [Segment condition]. For a targeting rule to match, all of its conditions must evaluate to true. More about conditions [here].

### Percentage Options

*Percentage options* are used to split users into groups that will receive a specific value for a feature flag. The groups are allocated based on the ratio of the percentages. Percentage options are often used for A/B testing or phased rollouts. More about percentage options [here].

### "To all users" / "To all other" / "To unidentified" value

A feature flag always contains a trivial "rule", a simple value, which comes after the actual rules. This value is returned when none of the preceding rules yields a result.

### User Object

A *user object* is a collection of *user attributes* that describe the properties of a user. Referencing these attributes in conditions allows you to define rules for targeting users. More about the user object [here].

### Default value

This value will be returned by the [ConfigCat SDK] in case of an error. The default value is a required parameter when you use the SDK in your application code to get the value of a feature flag.

## Examples

### Phased rollout / Canary release / Percentage rollout Scenario

**Intent:** In our sample company (Whisker Co.), we want to release a new feature called `Park Weather Info`. Let's release the feature everyone at Whisker Co. and to `20%` of our users. We want to make sure that the new feature is working as expected before we release it to everyone.

**Solution:** Have a feature flag called `Enable Park Weather Info` with a targeting rule that matches everyone at Whisker Co. and a percentage option of `20%` `ON`.

#### Dashboard
Here is how the feature flag looks like on the Dashboard:
![Phased rollout Example](../../static/assets/targeting/targeting-overview/phased-rollout.jpg)

#### Code
Here is how you can get the value of the feature flag in your application code:
```js
import * as configcat from 'configcat-js';

// Create the user object
let userObject = new configcat.User(
  '867428724', // Identifier (required)
  'isaac@whisker.example', // Email (optional)
);

// Get the value of the feature flag
const value = await configCatClient.getValueAsync(
  'enableParkWeatherInfo', // Feature flag key
  false, // Default value
  userObject, // User object
);
```