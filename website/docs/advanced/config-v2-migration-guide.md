---
id: config-v2-migration-guide
title: Config V2 Migration Guide
description: A detailed guide on how to migrate from Config V1 to Config V2.
---

This guide will help you migrate from Config V1 to Config V2.

:::info
This migration guide is for ConfigCat users who have Config V2 enabled. If you don't have Config V2 enabled, you can [contact us](https://configcat.com/support/) to add you to the Beta program.
:::

## What is Config V2?

Config V2 is the next generation of ConfigCat. It comes with a new Dashboard, Public Management API and SDKs.

Config V2 supports all the features of V1, so you can continue using those, but it offers interesting new features as well. However, you won't be able to use the new features with the V1 versions of the Dashboard, Public Management API and SDKs.

Read more about the new features in the [Config V2 Overview](/advanced/config-v2).

## A few things to consider before migration

- Migration from Config V1 means that a V2 config will be copied from the V1 config. The V1 config will remain unchanged and accessible. The V2 version will have a new SDK key for each environment.
- Config V2 and V1 are completely separate. They don't affect each other in any way. You can use them side by side.
- Every newly created config will be a V2 config by default.
- There is no automatic sync between the V1 and V2 configs. If you want to keep them in sync, you have to manually update the V2 config when you make changes to the V1 config and vice versa.
- There is no pressure to migrate. Although we have plans to phase out V1 eventually, you can stay on it for a long time.
- Once the migration process is started, it's recommended to migrate your V1 configs to V2 as quickly as possible to avoid confusion. 

## Migrating from Config V1 to Config V2

The migration process starts with copying your V1 config to a new V2 one and updating your applications to use the new config. The complete process is the following:

### Step 1: Create the V2 config

1. Open the ConfigCat Dashboard and click on the `Start migration` button on top of a V1 config.
2. Click `Create V2 config` to create a new config with the same settings as the V1 config.

It's important to note that the V2 config will be created with the same settings as the V1 config and the V1 config will still be accessible and unchanged.

### Step 2: Upgrade the ConfigCat SDK version

In your application, upgrade the ConfigCat SDK to the latest version. Old versions of the SDK will not be able to access the new config. Make sure you upgrade every application that uses the migrated V2 config.

Here is a list of the SDKs that support Config V2: [See the supported SDK versions.](advanced/config-v2-sdk-compatibility.md)

### Step 3: Update the ConfigCat SDK Key

In your application, replace the old ConfigCat SDK Key with the new one (i.e. with the one that belongs to the V2 version of the config) in every environment. The new key can be found on the ConfigCat Dashboard on the V2 config's page.

### Step 4: Deploy your application

Deploy your application to production and wait until all your users upgrade to the new version. You can check the migration status on the ConfigCat Dashboard on the V2 config's page.

### Step 5: Clean up

Once you are sure that all your users are upgraded to the new version of your application (i.e. the migration status page reports that the V1 configs are not downloaded for a long while), you can complete the migration process by deleting the V1 config. This will prevent confusion and accidental use of the old config.

:::caution
Once you delete the V1 config, you won't be able to restore it.
:::