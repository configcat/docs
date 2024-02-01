---
id: amplitude
title: Amplitude - Add feature flag changes to your charts
description: ConfigCat Amplitude integration reference. This is a step-by-step guide on how to use feature flags in your Amplitude project.
---

## Overview

Every feature flag change in ConfigCat is annotated on the Amplitude charts as a vertical line and some details are added automatically about the change.

<img src="/docs/assets/amplitude_chart.png" className="zoomable" alt="amplitude_chart" />

## Installation

1. Have an <a href="https://www.amplitude.com/" target="_blank">Amplitude subscription.</a>
2. Get an <a href="https://www.docs.developers.amplitude.com/analytics/find-api-credentials/" target="_blank">Amplitude API Key and Secret Key.</a>
   <img src="/docs/assets/amplitude_apikey_secretkey.png" className="zoomable" alt="amplitude_apikey_secretkey" />
3. Open the <a href="https://app.configcat.com/product/integrations" target="_blank">integrations tab</a> on ConfigCat Dashboard.
4. Click on Amplitude's CONNECT button and set your Amplitude API key and Secret key.
5. You're all set. Go ahead and make some changes on your feature flags then check your charts in Amplitude.

## Un-installation

1. Open the <a href="https://app.configcat.com/product/integrations" target="_blank">integrations tab</a> on ConfigCat Dashboard.
2. Click on Amplitude's DISCONNECT button.

## Chart Annotation

Every annotation sent to Amplitude by ConfigCat has:

- **Name:** A brief summary of the change.
- **Description:** A direct link to the Product/Config/Environment of the feature flag in ConfigCat.

<img src="/docs/assets/amplitude_annotation.png" className="zoomable" alt="amplitude_annoation" />
