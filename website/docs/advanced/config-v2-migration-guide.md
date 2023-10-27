---
id: config-v2-migration-guide
title: Config V2 Migration Guide
description: A detailed guide on how to migrate from Config V1 to Config V2.
---

This guide will help you migrate from Config V1 to Config V2.

## Migrating from Config V1 to Config V2

### Step 1: Create the V2 config

1. Open the ConfigCat Dashboard and click on the `Start migration` button on top of a V1 config.
2. Click `Create V2 config` to create a new config with the same settings as the V1 config.

It's important to note that the V2 config was created with the same settings as the V1 config and the V1 config is still accessible and unchanged.

### Step 2: Update the ConfigCat SDK

In your application, update the ConfigCat SDK to the latest version. Old versions of the SDK will not be able to access the new config. Make sure you update every application that uses the migrated config.

### Step 3: Update the ConfigCat SDK Key

In your application, update the ConfigCat SDK Key to the one that belongs to the V2 config. The new key can be found on the ConfigCat Dashboard on the V2 config's page.

### Step 4: Clean up

After you've updated all your applications to use the V2 config, you can delete the V1 config. You can check the config JSON download trends page to see if there are any applications that still access the V1 config.
