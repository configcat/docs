---
id: main-concepts
title: Main Concepts 
---
## Setting
A *Setting* is an essential bit of *ConfigCat*. It can represent a feature flag/toggle, a number or any text your application requires to be modified without the need of a new deployment.
### Anatomy of a *Setting*
Properties|Description
---|---
Name|A human readable name that differentiates the *Setting* within the *ConfigCat Management Console*. e.g., `My Cool Feature enabled`.
Key|A variable name within your code. e.g., `isCoolFeatureEnabled`.
Type|Type of information you'd like to keep in the *Setting*. e.g., On/Off Toggle, Text, Number
Value|The actual value of your *Setting*. e.g., `true`, `false`. Can be different in each environment.

### About *Setting* types:
Setting Kind|Setting Type|Description
---|---|---
On/Off Toggle|Boolean|true/false, usually the state of a feature flag
Text|String|any string, max. 1000 characters
Whole Number|Integer|any whole number within the range of `int`
Decimal Number|Double|any decimal number within the range of `double`

## Config
A *Config* is a collection of *Settings*. *Configs* help you organize settings around topics, or around your software components. A *Config* is like an online version of a traditional config file.

## Environment
An environment in ConfigCat represents an environment in your development lifecycle (like production, staging, development etc.). Different environments have the same settings but can have different values.
> Each environment-config pair has its own API key which must be used to initialize the ConfigCat SDK within your application.

## Product
A collection of *Configs*, *Environments* and *Team members*. A *Product* typically represents your application (or your service) and the people working on it. It might be a good idea to invite others to your *Product* to collaborate.
