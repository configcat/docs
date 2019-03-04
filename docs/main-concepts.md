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

## Projects
A *Project* is a collection of *Settings* and *Environments*. One *Project* usually represents a website, an application or any kind of software.

## Environments
An environment in ConfigCat represents an environment in your development lifecycle (like production, staging, development etc.). Different environments have the same settings but can have different values. By default every project comes with a predefined *Production* environment but you can rename it or create more.
> Each environment has its own API key which must be used to initialize the ConfigCat SDK within your application.

## Teams
A collection of *Projects*. It might be a good idea to invite others to your *Team* to collaborate.
