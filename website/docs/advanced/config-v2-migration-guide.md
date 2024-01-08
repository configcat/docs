---
id: config-v2-migration-guide
title: Config V2 Migration Guide
description: A detailed guide on how to migrate from Config V1 to Config V2.
---

This guide will help you migrate from Config V1 to Config V2.

## What is Config V2?

Config V2 is the next generation of ConfigCat. It comes with a new dashboard, API, SDKs, and features. It's not backward compatible with Config V1. Read more about the new features in the [Config V2 Overview](TODO).

## A few things to consider before migration

- Config V2 and V1 are completely separate. They don't affect each other in any way. You can use them side by side.
- Every newly created config is a V2 config.
- You can migrate your V1 configs to V2. That will mean that a V1 and a V2 version of your config will be available at the same time. The V2 version will have a new SDK key for each environment.
- There is no automatic sync between the V1 and V2 configs. You have to manually update the V2 config if you make changes to the V1 config and vice versa.
- Once started it's recommended to migrate your V1 configs to V2 as quickly as possible to avoid confusion.
- There is no pressure to migrate. You can stay on V1 for a long time.

## Migrating from Config V1 to Config V2

### Step 1: Create the V2 config

1. Open the ConfigCat Dashboard and click on the `Start migration` button on top of a V1 config.
2. Click `Create V2 config` to create a new config with the same settings as the V1 config.

It's important to note that the V2 config was created with the same settings as the V1 config and the V1 config is still accessible and unchanged.

### Step 2: Update the ConfigCat SDK

In your application, update the ConfigCat SDK to the latest version. Old versions of the SDK will not be able to access the new config. Make sure you update every application that uses the migrated config.

Here is a list of the SDKs that support Config V2: [See the supported SDK versions.](advanced/config-v2-sdk-compatibility.md)

### Step 3: Update the ConfigCat SDK Key

In your application, update the ConfigCat SDK Key to the one that belongs to the V2 config in every environment. The new key can be found on the ConfigCat Dashboard on the V2 config's page.

### Step 4: Deploy your application

Deploy your application to production and wait until all your users are migrated to the new config. You can check the [migration status](TODO) on the ConfigCat Dashboard on the V2 config's page.

### Step 5: Clean up

Once you are sure that all your users are migrated (no downloads on the V1 configs for a long while) to the new config, you can delete the V1 config. This will prevent confusion and accidental use of the old config.

:::caution
Once you delete the V1 config, you won't be able to restore it.
:::