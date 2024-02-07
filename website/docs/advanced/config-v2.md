---
id: config-v2
title: Config V2 Overview
description: Config V2 is the next generation of ConfigCat. It comes with a new Dashboard, Public Management API, SDKs and features.
---

Config V2 is a new version of ConfigCat. It comes with a new Dashboard, Public Management API, SDKs, and features.

## What's new?

- A bunch of new features and improvements listed below.
- New config editor UI on the Dashboard.
- [New and improved config JSON schema.](https://github.com/configcat/config-json)
- New API: [See the API Docs.](https://api.configcat.com/docs/)
- New SDKs: [See the supported SDK versions.](../config-v2-sdk-compatibility)

## How to migrate from Config V1 to Config V2?

See the [Config V2 Migration Guide](../config-v2-migration-guide). If you get stuck or have any questions about the migration, feel free to [contact us](https://configcat.com/support/).

## New features

### AND conditions

With AND conditions, you can define more complex Targeting Rules, such as "serve this value for the users who use my Android app AND whose email domain is '@example.com'".

You can add multiple conditions to a Targeting Rule and they will be evaluated with an AND connection between them.

![AND conditions](/assets/config-v2/and-conditions.jpg)

### New comparators

With the new comparators, you can create Targeting Rules which are based on dates, based on comparing arrays etc.

- New text and confidential text comparators: `EQUALS`, `NOT EQUALS`, `STARTS WITH ANY OF`, `ENDS WITH ANY OF`, `NOT STARTS WITH ANY OF`, `NOT ENDS WITH ANY OF`.
- New array comparators: `ARRAY CONTAINS ANY OF`, `ARRAY NOT CONTAINS ANY OF`.
- New date comparators: `BEFORE`, `AFTER`.

![New comparators](/assets/config-v2/new-comparators.jpg)

### Prerequisite flags

With prerequisite flags, you can create feature flags that depend on other feature flags. Prerequisite feature flags (aka. master feature flag, inter-dependent feature flag, global toggle) are particularly useful for managing complex feature dependencies and ensuring a smooth user experience during feature rollouts.

![Prerequisite flags](/assets/config-v2/prerequisite-flags.jpg)

### Comparison value hints

With comparison value hints, you can associate arbitrary text with your comparison values. This way you can add a description to your comparison value list items that helps you remember what they are for.

### Percentage Options within Targeting Rules

You can add Percentage Options to your Targeting Rules. This is useful if you want to create more complex Targeting Rules, such as "turn on the feature for 20% of the users who are on iOS, and off for 80%".

![Percentage Options within Targeting Rules](/assets/config-v2/percentage-options-within-targeting-rules.jpg)

### Custom Percentage Attributes

With custom Percentage Attributes, you can create Percentage Options based on custom attributes. This way you can create Percentage Options based on any of your user attributes. For example, you can create a Percentage Option that is based on the user's company or organization. So you can serve a value for 20% of the users from company A and serve another value for 80% of the users from company B.

![Custom Percentage Attributes](/assets/config-v2/custom-percentage-attributes.jpg)