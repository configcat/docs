---
id: getting-started
title: Getting Started
---
This page is an overview and a short guide on how to get started.

**ConfigCat** is a cloud-based service that lets you release a feature without needing to deploy new code.

You can use it with many similar techniques such as feature flags/toggles, canary releases, soft launches, A-B testing, remote configuration management, and phased rollouts.

# The birth of a Feature Flag

First **add a feature flag** on the *ConfigCat Dashboard*, 
then you can **connect your app** to the ConfigCat service to access your feature flag.

## Create a feature flag on *ConfigCat Dashboard*
1. <a href="https://app.configcat.com/login" target="_blank">Log in</a> to access the *Dashboard*
2. **Create** a **product, environment** and  **config** if necessary. These will store your feature flag.
3. Click *ADD FEATURE FLAG* and give it a name.

![getting-started](assets/getting-started-1.png)

## Connect your app
We have many great code examples to get you up and running. Our <a href="https://app.configcat.com/sdkkey" target="_blank">*SDK Key*</a> page does a great job of teaching you the ropes showing you the integration process with our SDKs, and since we support all major SDKs, chances are you will feel right at home using ConfigCat. Once implemented, you are good to go and can access the values of your switches!

Here's a short example code snippet to show how simple SDK integration is:
```bash
npm i configcat-client
```
```js
var configcat = require("configcat-client");
var client = configcat.createClient("YOUR SDK KEY HERE");

client.getValue("isMyFeatureEnabled", false, (value) => {
    if (value === true) {
        do_the_new_thing();
    } else {
        do_the_old_thing();
    }
});
```
