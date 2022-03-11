---
id: amplitude
title: Amplitude
description: ConfigCat Amplitude integration reference. This is step-by-step gide on how to use feature flags in your Amplitude project.
---

## Overview

Every setting change in ConfigCat is annotated on the Amplitude charts as a vertical line and some details are added automatically about the change.

![amplitude_chart](/assets/amplitude_chart.png)

## Installation

1. Have an <a href="https://www.amplitude.com/" target="_blank">Amplitude subscription.</a>
2. Get an <a href="https://help.amplitude.com/hc/en-us/articles/360035522372#h_52731f6f-5c45-4c28-b1e1-5c0074f83ee5" target="_blank">Amplitude API Key and Secret Key.</a>
![amplitude_apikey_secretkey](/assets/amplitude_apikey_secretkey.png)
1. Open the <a href="https://app.configcat.com/product/integrations" target="_blank">integrations tab</a> on ConfigCat Dashboard.
2. Click on Amplitude's CONNECT button and set your Amplitude API key and Secret key.
3. You're all set. Go ahead and make some changes on your feature flags then check your charts in Amplitude.

## Un-installation
1. Open the <a href="https://app.configcat.com/product/integrations" target="_blank">integrations tab</a> on ConfigCat Dashboard.
2. Click on Amplitude's DISCONNECT button.


## Chart Annotation

Every annotation sent to Amplitude by ConfigCat has:
- **Name:** A brief summary of the change.
- **Description:** A direct link to the Product/Config/Environment of the feature flag in ConfigCat.

![amplitude_annoation](/assets/amplitude_annotation.png)
