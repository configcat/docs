---
id: config-v2
title: Config V2 Overview
description: Config V2 is the next generation of ConfigCat. It comes with a new dashboard, API, SDKs and features.
---

Config V2 is a new version of ConfigCat. It comes with a new dashboard, API, SDKs, and features.

## What's new?

- A bunch of new features and improvements listed below.
- New config editor UI on the Dashboard.
- [New and improved config JSON schema.](https://github.com/configcat/config-json)
- New API: [See the API Docs.](https://api.configcat.com/docs/)
- New SDKs: [See the supported SDK versions.](advanced/config-v2-sdk-compatibility)

## How to migrate from Config V1 to Config V2?

See the [Config V2 Migration Guide](/advanced/config-v2-migration-guide). If you get stuck or have any questions about the migration, feel free to [contact us](https://configcat.com/support/).

## New features

### AND conditions

With AND conditions, you can define more complex targeting rules, such as "serve this value for the users who use my Android app AND whose email domain is '@example.com'".

You can add multiple conditions to a targeting rule and they will be evaluated with an AND connection between them.

### New comparators

With the new comparators, you can create targeting rules which are based on dates, based on comparing arrays etc.

- New text and sensitive text comparators: EQUALS, NOT EQUALS, STARTS WITH ANY OF, ENDS WITH ANY OF, NOT STARTS WITH ANY OF, NOT ENDS WITH ANY OF.
- New array comparators: ARRAY CONTAINS ANY OF, ARRAY NOT CONTAINS ANY OF.
- New date comparators: BEFORE, AFTER.

### Prerequisite flags

With prerequisite flags, you can create feature flags that depend on other feature flags. Prerequisite feature flags (aka. master feature flag, inter-dependent feature flag, global toggle) are particularly useful for managing complex feature dependencies and ensuring a smooth user experience during feature rollouts.

### Comparison value hints

With comparison value hints, you can associate arbitrary text with your comparison values. This way you can add a description to your comparison value list items that helps you remember what they are for.

### Percentage options for targeting rules

You can add percentage options to your targeting rules. This is useful if you want to create more complex targeting rules, such as "turn on the feature for 20% of the users who are on iOS, and off for 80%".

### Custom percentage attributes

With custom percentage attributes, you can create percentage options based on custom attributes. This way you can create percentage options based on any of your user attributes. For example, you can create a percentage option that is based on the user's company or organization. So you can serve a value for 20% of the users from company A and serve another value for 80% of the users from company B.