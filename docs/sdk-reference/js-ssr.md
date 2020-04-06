---
title: "JavaScript (SSR)"
id: "js-ssr"
---
*For Server-Side Rendered JavaScript frameworks like <a href="https://nuxtjs.org" target="_blank">NuxtJS</a>*
## Getting started

### 1. Install and import package

*via NPM:*
```bash
npm i configcat-js-ssr
```
```js
import * as configcat from "configcat-js-ssr";
```

### 2. Create the *ConfigCatClient* with your SDK Key:

```js
var configCatClient = configcat.createClient("#YOUR-SDK-KEY#");
```

### 3. Get your setting value:

The Promise (async/await) way:
```js
configCatClient.getValueAsync("isMyAwesomeFeatureEnabled", false)
.then((value) => {
    if(value) {
        do_the_new_thing();
    } else {
        do_the_old_thing();
    }
});
```
or the Callback way:
```js
configCatClient.getValue("isMyAwesomeFeatureEnabled", false, (value) => {
    if(value) {
        do_the_new_thing();
    } else {
        do_the_old_thing();
    }
});
```

## Creating the *ConfigCat* Client

*ConfigCat Client* is responsible for:
- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`createClient()` returns a client with default options.

| Properties | Description                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| `sdkKey`   | **REQUIRED.** SDK Key to access your feature flags and configurations. Get it from *ConfigCat Dashboard*. |

`createClientWithAutoPoll()`, `createClientWithLazyLoad()`, `createClientWithManualPoll()`  
Creating the client is different for each polling mode.
[See below](#polling-modes) for details.

> We strongly recommend using the *ConfigCat Client* as a Singleton object in your application.

## Anatomy of `getValue()`

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `callback`     | **REQUIRED.** Called with the actual setting value.                                                          |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
```js
configCatClient.getValue(
    "keyOfMySetting", // Setting Key
    false, // Default value
    function(value) { console.log(value) }, // Callback function
    { identifier : "435170f4-8a8b-4b67-a723-505ac7cdea92" } // Optional User Object
);
```

## `getValueAsync()`

Returns a Promise with the value.

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```js
const value = await configCatClient.getValueAsync(
    "keyOfMySetting", // Setting Key
    false, // Default value
    { identifier : "435170f4-8a8b-4b67-a723-505ac7cdea92" } // Optional User Object
);
```
or
```js
configCatClient.getValueAsync(
    "keyOfMySetting", // Setting Key
    false, // Default value
    { identifier : "435170f4-8a8b-4b67-a723-505ac7cdea92" }) // Optional User Object
.then((value) => { console.log(value) });
```

### User Object

The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature. 
For simple targeting:
``` javascript
var userObject = {
    identifier : "435170f4-8a8b-4b67-a723-505ac7cdea92"
};   
```
or
``` javascript
var userObject = {
    identifier : "john@example.com"
};   
```

| Parameters   | Description                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier` | **REQUIRED.** Unique identifier of a user in your application. Can be any `string` value, even an email address.                |
| `email`      | Optional parameter for easier targeting rule definitions.                                                                       |
| `country`    | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom`     | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |

For advanced targeting:
``` javascript
var userObject = {
    identifier : "435170f4-8a8b-4b67-a723-505ac7cdea92",
    email : "john@example.com",
    country : "United Kingdom",
    custom : {
        "SubscriptionType": "Pro",
        "UserRole": "Admin"
    }
};
```

## Polling Modes

The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all requests are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.

### Auto polling (default)

The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

#### `createClientWithAutoPoll(sdkKey, options)`

| Option Parameter      | Description                                                                                                                | Default        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `pollIntervalSeconds` | Polling interval. Range: `1 - Number.MAX_SAFE_INTEGER`                                                                     | 60             |
| `configChanged`       | Callback to get notified about changes.                                                                                    | -              |
| `logger`              | Custom logger. See below for details.                                                                                      | Console logger |
| `requestTimeoutMs`    | The amount of milliseconds the SDK waits for a response from the ConfigCat servers before returning values from the cache. | 30000          |

Use the `pollIntervalSeconds` option parameter to change the polling interval.
```js
configcat.createClientWithAutoPoll("#YOUR-SDK-KEY#", { pollIntervalSeconds: 95 });
```
Adding a callback to `configChanged` option parameter will get you notified about changes.
```js
configcat.createClientWithAutoPoll("#YOUR-SDK-KEY#", { configChanged: function() {
    console.log("Your config has been changed!");
}});
```

### Lazy loading

When calling `getValue()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `callback` will be called after the cache is updated.

#### `createClientWithLazyLoad(sdkKey, options)`

| Option Parameter         | Description                                                                                                                | Default        |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `cacheTimeToLiveSeconds` | Cache TTL. Range: `1 - Number.MAX_SAFE_INTEGER`                                                                            | 60             |
| `logger`                 | Custom logger. See below for details.                                                                                      | Console logger |
| `requestTimeoutMs`       | The amount of milliseconds the SDK waits for a response from the ConfigCat servers before returning values from the cache. | 30000          |

Use `cacheTimeToLiveSeconds` option parameter to set cache lifetime.

```js
configcat.createClientWithLazyLoad("#YOUR-SDK-KEY#", { cacheTimeToLiveSeconds: 600 });
```

### Manual polling
Manual polling gives you full control over when the setting values are downloaded. *ConfigCat SDK* will not update them automatically. Calling `forceRefresh()` or `forceRefreshAsync()` is your application's responsibility.

#### `createClientWithManualPoll(sdkKey, options)`

| Option Parameter   | Description                                                                                                                | Default        |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `logger`           | Custom logger. See below for details.                                                                                      | Console logger |
| `requestTimeoutMs` | The amount of milliseconds the SDK waits for a response from the ConfigCat servers before returning values from the cache. | 30000          |

```js
let configCatClient = configcat.createClientWithManualPoll("#YOUR-SDK-KEY#");

configCatClient.forceRefresh(() =>{

    configCatClient.getValue("key", "my default value", (value)=>{
        
        console.log(value);
    });
});
```

> `getValue()` returns `defaultValue` if the cache is empty. Call `forceRefresh()` or `forceRefreshAsync()` to update the cache.

```js
let configCatClient = configcat.createClientWithManualPoll("#YOUR-SDK-KEY#");

configCatClient.getValue("key", "my default value", (value)=>{

    console.log(value) // console: "my default value"
});

configCatClient.forceRefresh(() =>{

    configCatClient.getValue("key", "my default value", (value)=>{

        console.log(value); // console: "value from server"
    });
});
```

## Logging

### Setting log levels

```js
const logger = configcat.createConsoleLogger(3); // Setting log level to 3 (= Info)

const configCatClient = configcat.createClientWithAutoPoll('#YOUR-SDK-KEY#', 
    { logger: logger }
);
```

Available log levels:
| Level | Name  | Description                                             |
| ----- | ----- | ------------------------------------------------------- |
| -1    | Off   | Nothing gets logged.                                    |
| 1     | Error | Only error level events are logged.                     |
| 2     | Warn  | Errors and Warnings are logged.                         |
| 3     | Info  | Errors, Warnings and feature flag evaluation is logged. |

Info level logging helps to inspect the feature flag evaluation process:
```bash
ConfigCat - INFO - Evaluate 'isPOCFeatureEnabled'
 User : {"identifier":"#SOME-USER-ID#","email":"configcat@example.com"}
 Evaluating rule: 'configcat@example.com' CONTAINS '@something.com' => no match
 Evaluating rule: 'configcat@example.com' CONTAINS '@example.com' => MATCH
 Returning value : true
```

## `getAllKeys()`

You can query the keys from your configuration in the SDK with the `getAllKeys()` method.

```js
var configCatClient = configcat.createClient("#YOUR-SDK-KEY#");
configCatClient.getAllKeys(function(keys) {
    console.log(keys);
});
```

## `getAllKeysAsync()`

You can query the keys from your configuration in the SDK with the `getAllKeys()` method.

```js
let configCatClient = configcat.createClient("#YOUR-SDK-KEY#");
const keys = await configCatClient.getAllKeysAsync();
console.log(keys);
```
## Sample Applications

- <a href="https://github.com/configcat/js-ssr-sdk/tree/master/samples/nuxt-ssr" target="_blank">NuxtJS</a>

## Look under the hood

* <a href="https://github.com/configcat/js-ssr-sdk" target="_blank">ConfigCat JavaScript (SSR) SDK on GitHub</a>
* <a href="https://www.npmjs.com/package/configcat-js-ssr" target="_blank">ConfigCat JavaScript (SSR) SDK in NPM</a>
