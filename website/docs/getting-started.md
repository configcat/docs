---
id: getting-started
title: Getting Started
description: This is a step-by-step guide on how to get started with ConfigCat feature flags and on how to implement feature flags in an application.
---
This page is an overview and a short guide on how to get started.

**ConfigCat** is a cloud-based service that lets you release a feature without needing to deploy new code.

You can use it with many similar techniques such as feature flags/toggles, canary releases, soft launches, A-B testing, remote configuration management, and phased rollouts.

# The birth of a Feature Flag

First, **add a feature flag** on the *ConfigCat Dashboard*, 
then you can **connect your application** to the ConfigCat service to access your feature flag.

## Create a feature flag on the *ConfigCat Dashboard*
1. <a href="https://app.configcat.com/login" target="_blank">Log in</a> to the *Dashboard*
2. Click *ADD FEATURE FLAG* and give it a name.

![getting-started](/assets/getting-started-1.png)

## Connect your application



There are ready to use code snippets for `.NET`, `Java`, `Android`, `iOS`, `Node`, `JavaScript`, `Python`, `Go`, `PHP`, `Elixir` on the <a href="https://app.configcat.com" target="_blank">ConfigCat Dashboard</a>, just scroll down to the **SDK Key and steps to connect your application** section.

All the ConfigCat SDKs are open-source and available on <a href="https://github.com/configcat" target="_blank">GitHub</a>.

See the detailed [Docs on how to use the ConfigCat SDKs.](/sdk-reference/overview.md)

Here's a short example to demonstrate the concept:
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
