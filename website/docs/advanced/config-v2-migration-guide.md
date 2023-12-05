---
id: config-v2-migration-guide
title: Config V2 Migration Guide
description: A detailed guide on how to migrate from Config V1 to Config V2.
---

This guide will help you migrate from Config V1 to Config V2.

> legyen kulona config v2 leiras es a migracios doksi

> mi az a Config V2?
> mien mas mint a V1?
> uj dashboard, uj api, uj sdk, uj **feature**-ek, uj config json schema (v6), lehet linkelni a github repora amiben a json schema van
> feature-oket leirni,

> a regi configokban nem lehet az uj feature-eket hasznalni
> ha az uj feature-eket hasznalod akkor uj configot kell letrehozni vagy a regit konvertalni
> a migracio utan megmarad a v1 es parhuzamosan letezik a v2 config is
> nincsennek hatassal egymasra, valtozasok nem szinkronizalodnak
> v1 et adddig hasznalod amig csak akrod
>

## Migrating from Config V1 to Config V2

> lehet hogy kene egy pelda

### Step 1: Create the V2 config

1. Open the ConfigCat Dashboard and click on the `Start migration` button on top of a V1 config.
2. Click `Create V2 config` to create a new config with the same settings as the V1 config.

It's important to note that the V2 config was created with the same settings as the V1 config and the V1 config is still accessible and unchanged.

### Step 2: Update the ConfigCat SDK

In your application, update the ConfigCat SDK to the latest version. Old versions of the SDK will not be able to access the new config. Make sure you update every application that uses the migrated config.

> mutatni az SDK minimum verziokat egy tablazatban, make sure you have ...

### Step 3: Update the ConfigCat SDK Key

In your application, update the ConfigCat SDK Key to the one that belongs to the V2 config. The new key can be found on the ConfigCat Dashboard on the V2 config's page.

> sdk kety update minden envben
>
> Step 4: deployolja ki es varja meg amig a userei atallnak 
>
> migracio statuszat tudja nezni, ezt az oldalt linkelni

### Step 4: Clean up

> amokor mar a regi konfigokra nincs behivas egy jo ideje, akkor kitorolheti oket
>ne pusholjuk oket
> vigyazzz a regi configokat nem lehet visszaallitani

After you've updated all your applications to use the V2 config, you can delete the V1 config. You can check the config JSON download trends page to see if there are any applications that still access the V1 config.

> Of course, the new SDKs have to be backward compatible with the old V1 Dashboard. But the new V2 Dashboard will not be compatible with the old SDKs. This will be an important aspect during the migration.
Basically, there will be V1 and V2 configs. At first, the current, V1 versions will be there and your applications will download the config.json from the V1 version.
You will be able to migrate your V1 configs to V2. That will mean that a V1 and a V2 version of your config will be available at the same time. The V2 version will have a new SDK key for each environment. The V2 SDK keys will have a new format too, making them easy to distinguish.
You'll have to update the SDK in your applications and replace the SDK keys to the V2 ones (for each of your environments). This way you'll be able to gradually switch to the new UI and the new SDKs.
When you'll be ready with the migration, you will have to delete the V1 config (to prevent confusions).
So during the migration you'll have a V1 and a V2 config next to each other. The whole migration process won't be a must have. If you want it, you'll be able to stay on the V1 config for a long time (we don't have a short or even a long term ETA for stopping supporting the V1 UI). e.g. For your production stuff you can stay on V1 for a while and start using the V2 UI for only new configs. And if you think you are ready to migrate with your production stuff, you'll be able to start the process anytime.
This applies to the Beta as well. You'll be able to stay on V1 for your production stuff, while testing the new features with a new Config.