---
id: config-v2
title: Config V2 Overview
description: Config V2 is the next generation of ConfigCat. It comes with a new dashboard, API, SDKs, and features.
---

Config V2 is a new version of ConfigCat. It comes with a new dashboard, API, SDKs, and features.


## What's new?

- A bunch of new features and improvements listed below.
- New config editor UI on the Dashboard.
- [New config JSON schema.](https://github.com/configcat/config-json)
- New API: [See the API Docs.](TODO)
- New SDKs: [See the supported SDK versions.](TODO)

## [How to migrate from Config V1 to Config V2?](TODO)

See the [Config V2 Migration Guide](TODO). If you get stuck or have any questions about the migration, [contact us](TODO).

## New features

### AND conditions

With AND conditions, you can create more complex targeting rule sets for your feature flags. You can add multiple conditions to a targeting rule and they will be evaluated as a logical AND.

> TODO add screenshot

### Prerequisite flags

With prerequisite flags, you can create feature flags that depend on other feature flags. Prerequisite feature flags are particularly useful for managing complex feature dependencies and ensuring a smooth user experience during feature rollouts.

> TODO add screenshot

### Targeting rule hints

With targeting rule hints, you can add hints to targeting rules to navigate better in complex rule sets.

> TODO add screenshot

### New comparators

With the new comparators, you can create date based targeting rules and schedule releases, compare arrays etc.

> TODO list new comparators