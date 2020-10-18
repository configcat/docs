---
id: datadog
title: DataDog
---

## Overview

Ensures that every setting change in ConfigCat is sent to DataDog as an Event.

![datadog_event](/assets/datadog_event.png)

## Installation

1. Have a <a href="https://www.datadoghq.com/" target="_blank">DataDog subscription.</a>
2. Get a <a href="https://docs.datadoghq.com/account_management/api-app-keys/#api-keys" target="_blank">DataDog API Key.</a>
![datadog_event](/assets/datadog_apikey.png)
1. Open the <a href="https://app.configcat.com/product/integrations" target="_blank">integrations tab</a> on ConfigCat Dashboard.
2. Click on DataDog's CONNECT button and set your DataDog API key.
3. You're all set. Go ahead and make some changes on your feature flags then check your Events in DataDog.

## Un-installation
1. Open the <a href="https://app.configcat.com/product/integrations" target="_blank">integrations tab</a> on ConfigCat Dashboard.
2. Click on DataDog's DISCONNECT button.


## Event details

Every event sent to DataDog by ConfigCat has a *source* property of `configcat` and *tagged* with the `product_name`, `config_name` and
 `environment_name` where the change has happened.

### Searching for Events

For example here is how to search for events that happened in the production environment: ```sources:configcat production```

![datadog_filtering](/assets/datadog_filtering.png)

