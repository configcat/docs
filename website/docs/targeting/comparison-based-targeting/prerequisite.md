---
id: prerequisite
title: Prerequisite Feature Flags
description: A prerequisite feature flag is a type of feature flag that is used to control the availability of another feature flag.
---

## What is a prerequisite feature flag?

A prerequisite feature flag is a type of feature flag that is used to control the availability of another feature flag. It acts as a condition that must be met before the dependent feature flag becomes active. This allows developers to ensure that certain conditions or requirements are fulfilled before users can access a particular feature. Prerequisite feature flags are particularly useful for managing complex feature dependencies and ensuring a smooth user experience during feature rollouts.

## How does it work?

The prerequisite feature flag is evaluated first before the dependent feature flag is evaluated with the same User Object. The prerequisite feature flag's value is then compared to the comparison value that you set on the Dashboard. If the prerequisite feature flag's value is equal to the comparison value, the dependent feature flag is enabled. Otherwise, the dependent feature flag is disabled.

## How to set a prerequisite feature flag?

You can set a prerequisite feature flag for a feature flag on the ConfigCat Dashboard. The prerequisite feature flag can be any feature flag that is already defined on the Dashboard. You can also set a comparison value that the prerequisite feature flag's value will be compared to.

> TODO add steps and screenshot

## Example

> TODO add screenshot and explanation