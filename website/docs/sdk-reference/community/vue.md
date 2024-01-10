---
id: vue
title: ConfigCat SDK for Vue.js
description: Unofficial Vue SDK for ConfigCat Feature Flags. Based on ConfigCat's JavaScript SDK.
---

<!-- export const VueSchema = require('@site/src/schema-markup/sdk-reference/community/vue.json');

<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(VueSchema) }}></script> -->

:::caution
As this is a community-maintained package, ConfigCat can't guarantee its stability, and safety and can't provide official customer support.
:::

<a href="https://github.com/codedbychavez/configcat-vue" target="_blank">ConfigCat SDK for Vue.js on GitHub</a>

## Getting Started

### 1. Install the package

_via [npm](https://www.npmjs.com/package/configcat-vue)_

```bash
npm i configcat-vue
```

### 2. Import and install the `ConfigCatPlugin` with your SDK Key

In **main.ts**:

```js
import { ConfigCatPlugin } from "configcat-vue";
```

```js
app.use(ConfigCatPlugin, {
  sdkKey: "YOUR-CONFIGCAT-SDK-KEY-GOES-HERE", // sdkKey is required
});
```

### 3. Get your setting value

This SDK includes a **FeatureWrapper** component. It enables users to control the visibility of specific parts within their Vue.js application (such as components or HTML elements) when the feature flag is enabled.

In any **.vue** component file:

```vue
<script setup lang="ts">

import { FeatureWrapper } from "configcat-vue";

</script>
```

Add the feature flag key as a prop:

```js
<template>
  <div class="my-app">
    <FeatureWrapper featureKey="YOUR-FEATURE-KEY-GOES-HERE">
      {/* This is displayed when the feature flag is turned on */}
      <TheNewFeature />
    </FeatureWrapper>
  </div>
</template>
```

Optionally, the **FeatureWrapper** component also provides an **#else** and **#loading** template. Components or HTML elements can be included within these templates that would display when the feature flag is **turned off** or **loading** respectively.

```js
<FeatureWrapper
  featureKey="YOUR-FEATURE-KEY-GOES-HERE"
>
  <TheNewFeature />
  <template #else>
    {/* Displayed when the feature flag is turned off. Add anything in this block, like HTML elements or other Vue components */}
    <div class="feature-not-available-wrapper">
      <p>Sorry, this feature is not available. Your feature flag is off.</p>
    </div>
  </template>
  <template #loading>
    {/* Display while the feature flag is loading. Add anything in this block, like HTML elements or other Vue components */}
    <div class="loading-wrapper">
      <p>Loading...</p>
    </div>
  </template>
</FeatureWrapper>
```

## Advanced Usage

### Specifying a polling mode

Polling modes are used to control how often ConfigCat's SDK client downloads the values of feature flags from ConfigCat's servers. The default polling mode is **AutoPoll**. Auto Polling fetches the latest feature flag values every 60 seconds by default. To change this, Specify a polling mode and set the polling interval (in seconds) via the **pollingIntervalInSeconds** property.

Import:

```js
import { PollingMode } from "configcat-vue";
```

Add **pollingMode** to the **ConfigCatPlugin** options and set the polling interval via the **clientOptions** property:

```js
app.use(ConfigCatPlugin, {
    sdkKey: "YOUR-CONFIGCAT-SDKKEY-GOES-HERE",
    pollingMode: PollingMode.AutoPoll, // Optional. Default is AutoPoll
    clientOptions: {
        pollIntervalSeconds: 5 // Optional. Specify the polling interval in seconds. The default is 60 seconds.
    }
});

```

**pollingMode** can be set to: **PollingMode.AutoPoll**, **PollingMode.ManualPoll** and **PollingMode.LazyLoad**

> See documentation here: <https://configcat.com/docs/advanced/caching/>

### Using the plugin with a logger

You may want to log the actions of the underlying ConfigCat SDK client. To do this, specify a logger in **clientOptions**:

> See documentation here: <https://configcat.com/docs/sdk-reference/js/#logging>

Add **createConsoleLogger**, and **LoggerLevel** to your import:

```js
import { createConsoleLogger, LogLevel } from "configcat-vue"; 
```

Create the logger with a specified log level:

> Documentation: <https://configcat.com/docs/sdk-reference/js/#setting-log-levels>

Use the logger in **clientOptions**:

```js
app.use(ConfigCatPlugin, {
  sdkKey: "YOUR-CONFIGCAT-SDK-KEY-GOES-HERE", // // sdkKey is required
  clientOptions: { // clientOptions is optional
    // ...
    logger: createConsoleLogger(LogLevel.Info),
  }
});
```

The following methods are available on **LogLevel**:

- **LogLevel.Debug** - All events are logged.
- **LogLevel.Info** - Info, Warn and Error are logged. Debug events are discarded.
- **LogLevel.Warn** - Warn and Error events are logged. Info and Debug events are discarded.
- **LogLevel.Error** - Error events are logged. All other events are discarded.
- **LogLevel.Off** - No events are logged.

### Specifying a User Object

The [User Object](https://configcat.com/docs/advanced/user-object/) represents a user in your application. It works hand in hand with ConfigCat's [Targeting](https://configcat.com/docs/advanced/targeting/) rules for targeting specific users with feature flags. A User Object can be passed as a prop to the **FeatureWrapper** component.

> See documentation here: <https://configcat.com/docs/advanced/user-object/>

Define the User Object:

```js
<script setup lang="ts">
import { ref } from 'vue';
import { User } from 'configcat-vue';

// Define the User Object
const user = new User('john@example.com');
const userObject = ref<User>(user)

</script>
```

Pass it to the **FeatureWrapper** component:

```js
<template>
  <div class="my-app">
    <FeatureWrapper featureKey="YOUR-FEATURE-KEY-GOES-HERE" :userObject="userObject">
      <TheNewFeature />
      
    </FeatureWrapper>
  </div>
</template>
```

### Listening to flag changes emitted from the FeatureWrapper component

When a feature flag is toggled ON or OFF in the [ConfigCat dashboard](https://app.configcat.com) the **FeatureWrapper** component emits the updated feature flag value. How quickly the updated value is emitted depends on the polling interval set in the **clientOptions** property of the **ConfigCatPlugin**.

Listen and handle changes using **@flag-value-changed**:

```js
<template>
  <div class="my-app">
    <FeatureWrapper featureKey="YOUR-FEATURE-KEY-GOES-HERE" @flag-value-changed="handleFlagValueChange">
      <TheNewFeature />
      
    </FeatureWrapper>
  </div>
</template>
```

```js
<script setup lang="ts">
{/* Handle to the flag value changes */}
const handleFlagValueChange = (flagValue: boolean) => {
  console.log('Flag value changed to: ', flagValue);
}

</script>
```

### Listening to events emitted by the underlying ConfigCat client

This plugin exposes (provides) the underlying ConfigCat client. One of the ways it can be used is by subscribing to events emitted by the ConfigCat client.

> See documentation here: <https://configcat.com/docs/sdk-reference/js/#hooks>

Inject the ConfigCat client into your component:

```js
<script setup lang="ts">
import { inject, onBeforeMount } from 'vue';
import { FeatureWrapper } from "configcat-vue";
// ...

// Import the ConfigCat client interface
import type { IConfigCatClient } from 'configcat-vue';

// Inject the ConfigCat client
const configCatClient = inject<IConfigCatClient>('configCatClient');

onBeforeMount(() => {
  // Subscribe to the events using the .on method of the ConfigCat SDK client
  configCatClient?.on('flagEvaluated', () => {
    console.log('Flag evaluated');
  });
});

</script>
```
