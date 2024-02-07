---
id: targeting-overview
title: Targeting Overview
description: Overview of the ConfigCat targeting feature with examples.
---

Targeting allows you to enable or disable a feature for specific users or groups of users in your application. Typical use cases are:
- Beta testing
- A/B testing
- Phased rollouts, canary releases

## How does it work?

1. On the <a href="https://app.configcat.com" target="_blank">ConfigCat Dashboard</a>, you add [Targeting Rules](../targeting-rule/targeting-rule-overview) and/or [Percentage Options](../percentage-options) to your feature flag.
2. You pass a [User Object](../user-object) to the ConfigCat SDK in your application.
3. The ConfigCat SDK will use the User Object and the rules defined on the Dashboard to determine whether the feature should be enabled for the user.

## What is what?
![Targeting Overview](/assets/targeting/targeting-overview/targeting.jpg)

### Feature Flag / Setting

A *setting* is a set of rules that yields a **boolean**, **string**, **integer** or **double** value, which can be used to configure your application. It is also known as a configuration value, configuration setting, configuration parameter, etc.

A *feature flag* is a **boolean** setting used to decide whether an application feature should be turned ON or OFF. It is also known as a feature toggle, feature switch, feature flipper, conditional feature, etc.

:::info
Throughout this documentation, we generally use the term *feature flag* to refer to both feature flags and settings for simplicity because feature flags are the most common type of settings.
:::

### Targeting Rule

A *Targeting Rule* consists of a collection of conditions and a value to serve. If the conditions are met (the Targeting Rule *matches*), the value is served to the user. More about [Targeting Rules here](../targeting-rule/targeting-rule-overview).

### Condition

A *condition* is a logical expression that can be evaluated to true or false. There are three types of conditions: [User Condition](../targeting-rule/user-condition), [Flag Condition (Prerequisite)](../targeting-rule/flag-condition), [Segment Condition](../targeting-rule/segment-condition). For a Targeting Rule to match, all of its conditions must evaluate to true.

### Percentage Options

*Percentage Options* are used to split users into groups that will receive a specific value for the feature flag. The groups are allocated based on the ratio of the percentages. Percentage Options are often used for A/B testing or phased rollouts. More about [Percentage Options here](../percentage-options).

### "To all users" / "To all other" / "To unidentified" value

A feature flag always contains a trivial "rule", a simple value after the actual rules. This value is returned when none of the preceding rules yields a result.

### Default value

The ConfigCat SDK's feature flag evaluation functions (e.g. `GetValue`) requires you to provide a *default value*. This value will be returned in case the SDK fails to fetch the config or some other error occurs during the evaluation of the feature flag.

### User Object

A *User Object* is a collection of *user attributes* that describe the properties of a user. Referencing these attributes in conditions allows you to define rules for targeting users. More about the [User Object here](../user-object).

## Examples

### Phased rollout / Canary release / Percentage rollout Scenario

#### Context
Our demo company, Whisker Co. is about to release a new feature called `Park Weather Info`. The stakeholders want to make sure that releasing the new feature will go smoothly and it will be received well by the customers.

#### Goal
To make sure that the new feature is working as expected before releasing it to everyone, we initially want to make the feature available to the employees and to `20%` of the customers only.

#### Solution
Let's create a feature flag called `Enable Park Weather Info` with a Targeting Rule that matches the employees at Whisker Co. and Percentage Options set to `20%` `ON` and `80%` `OFF` for the rest of the users (i.e. for the customers).

Here is what such a feature flag looks like on the Dashboard:
![Phased rollout Example](../../static/assets/targeting/targeting-overview/phased-rollout.jpg)

Here is how we get the value of the feature flag in your application:
```js
// Create the User Object
const userObject = new configcat.User(
  // Identifier - used by the Percentage Options to split the users into groups
  '867428724',
  // Email - used by the Targeting Rule's User Condition to determine whether
  // the user is an employee at Whisker Co.
  'isaac@whisker.example'
);

// Get the value of the feature flag
const value = await configCatClient.getValueAsync(
  // Feature flag key
  'enableParkWeatherInfo',
  // Default value - by providing `false` we specify that the feature should not be
  // enabled if the SDK fails to fetch the config or some other error occurs
  false,
  // User Object
  userObject
);
```