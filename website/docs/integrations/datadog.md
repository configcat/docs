---
id: datadog
title: Datadog
description: ConfigCat Datadog integration. This is step-by-step gide on how to connect the ConfigCat feature flag service events to Datadog.
---

## Overview

Ensures that every setting change in ConfigCat is sent to Datadog as an Event.

![datadog_event](/assets/datadog_event.png)

## Installation

1. Have a <a href="https://www.datadoghq.com/" target="_blank">Datadog subscription.</a>
2. Get a <a href="https://docs.datadoghq.com/account_management/api-app-keys/#api-keys" target="_blank">Datadog API Key.</a>
![datadog_event](/assets/datadog_apikey.png)
3. Open the <a href="https://app.configcat.com/product/integrations" target="_blank">integrations tab</a> on ConfigCat Dashboard.
4. Click on Datadog's CONNECT button and set your Datadog API key.
5. OPTIONAL - Set the proper site of your Datadog account. [More about Datadog site](https://docs.datadoghq.com/getting_started/site/).
6. You're all set. Go ahead and make some changes on your feature flags then check your Events in Datadog.

## Un-installation
1. Open the <a href="https://app.configcat.com/product/integrations" target="_blank">integrations tab</a> on ConfigCat Dashboard.
2. Click on Datadog's DISCONNECT button.


## Event details

Every event sent to Datadog by ConfigCat has a *source* property of `configcat` and *tagged* with the `product_name`, `config_name` and
 `environment_name` where the change has happened.

### Searching for Events

For example here is how to search for events that happened in the production environment: ```sources:configcat production```

![datadog_filtering](/assets/datadog_filtering.png)
