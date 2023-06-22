---
id: main-concepts
title: Main Concepts
description: This page explains the basics of feature flags and how to use them. Displays how configs, products and settings are organized within the feature flag service.
---

## Feature Flag or Setting

A _Setting_ is an essential bit of _ConfigCat_. It can be of multiple types like on/off switch (bool), number (int, double) or any text (string) your application requires to be modified without the need of a new deployment.

A _Feature Flag_ is a _Setting_ of type Bool.

### Anatomy of a _Feature Flag_ or _Setting_

| Properties | Description                                                                                                            |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| Name       | A human readable name that differentiates the _Setting_ on the _ConfigCat Dashboard_. e.g., `My Cool Feature enabled`. |
| Key        | A variable name within your code. e.g., `isCoolFeatureEnabled`.                                                        |
| Type       | Type of information you'd like to keep in the _Setting_. e.g., On/Off Toggle, Text, Number                             |
| Value      | The actual value of your _Setting_. e.g., `true`, `false`. Can be different in each environment.                       |

### About _Setting_ types:

| Setting Kind   | Setting Type | Description                                                                       |
| -------------- | ------------ | --------------------------------------------------------------------------------- |
| On/Off Toggle  | Boolean      | true/false, usually referenced as Feature Flag, Feature Toggle or Feature switch. |
| Text           | String       | any string, max. 100000 characters                                                 |
| Whole Number   | Integer      | any whole number within the range of `Int32`                                      |
| Decimal Number | Double       | any decimal number within the range of `double`                                   |

## Config

A _Config_ is a collection of _Settings_. _Configs_ help you organize settings around topics, or around your software components. A _Config_ is like an online version of a traditional config file.

## Environment

An environment in ConfigCat represents an environment in your development lifecycle (like production, staging, development etc.). Different environments have the same settings but can have different values.
:::info
Each environment-config pair has its own SDK Key which must be used to initialize the ConfigCat SDK within your application.
:::

## Product

A collection of _Configs_, _Environments_ and _Team members_. A _Product_ typically represents your application (or your service) and the people working on it. It might be a good idea to invite others to your _Product_ to collaborate.

## Organization

An _Organization_ represents a collection of preferences that are valid for all the _Products_ and _Members_ who belong to
an _Organization_. Like billing information, authentication rules or data privacy preferences.
