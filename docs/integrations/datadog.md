---
id: datadog
title: DataDog
---

# DataDog

<img src="../../img/datadog_event.png"/>

## Overview

DataDog integration ensures that all ConfigCat settings changes send to DataDog as an Event. With this feature you can see your system behaviour when changing your settings. You can setup the DataDog integration for a products in the ConfigCat.

## Setup

First of all you need DataDog subscription and [DataDog API key](https://docs.datadoghq.com/account_management/api-app-keys/#api-keys).
<img src="../../img/datadog_apikey.png"/>

1. Navigate to product's settings page

<img src="../../img/datadog_manageproduct.png"/>

2. Select *Integrations* tab

<img src="../../img/datadog_connect.png"/>

3. Click to DataDog's CONNECT button and set a DataDog API key

## Remove
1. Navigate to product's settings page
2. Select *Integrations* tab
3. Click to DataDog's DISCONNECT button

## DataDog filtering

All configcat related events *source* property is ```configcat``` and tagged with product, config environment names to easy to setup any monitor/alert.

### Example

Search all events where the environment is production: ```sources:configcat production```

<img src="../../img/datadog_filtering.png"/>

