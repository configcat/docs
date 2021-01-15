---
id: node
title: Node.js
---
[![Star on GitHub](https://img.shields.io/github/stars/configcat/node-sdk.svg?style=social)](https://github.com/configcat/node-sdk/stargazers)
[![Build Status](https://travis-ci.com/configcat/node-sdk.svg?branch=master)](https://travis-ci.com/configcat/node-sdk) [![codecov](https://codecov.io/gh/configcat/node-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/configcat/node-sdk) [![Known Vulnerabilities](https://snyk.io/test/github/configcat/node-sdk/badge.svg?targetFile=package.json)](https://snyk.io/test/github/configcat/node-sdk?targetFile=package.json) ![License](https://img.shields.io/github/license/configcat/node-sdk.svg) 

>For JavaScript SSR (Server-Side Rendered) applications we recommend using [ConfigCat JS-SSR SDK](js-ssr.md)

## Getting started

### 1. Install *ConfigCat SDK*

*via NPM*
```bash
npm i configcat-node
```

### 2. Import package

```js
const configcat = require("configcat-node");
```

### 3. Create the *ConfigCat* client with your *SDK Key*

```js
let configCatClient = configcat.createClient("#YOUR-SDK-KEY#");
```

### 4. Get your setting value

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

## Creating the *ConfigCat Client*

*ConfigCat Client* is responsible for:

- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`createClient(sdkKey, options)` returns a client with default options.

| Parameters | Description                                                                                               | Default |
| ---------- | --------------------------------------------------------------------------------------------------------- | ------- |
| `sdkKey`   | **REQUIRED.** SDK Key to access your feature flags and configurations. Get it from *ConfigCat Dashboard*. | - |
| `options`  | Optional. [More about the options parameter](#auto-polling-default). | - |

`createClientWithAutoPoll()`, `createClientWithLazyLoad()`, `createClientWithManualPoll()`  
Creating the client is different for each polling mode.
[See below](#polling-modes) for details.

:::caution
We strongly recommend using the *ConfigCat Client* as a Singleton object in your application.
:::

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
    (value) => { console.log(value) }, // Callback function
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

``` javascript
let userObject = {
    identifier : "435170f4-8a8b-4b67-a723-505ac7cdea92"
};
```

``` javascript
let userObject = {
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
let userObject = {
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

The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all `getValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.

### Auto polling (default)

The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

#### `createClientWithAutoPoll(sdkKey, options)`

| Option Parameter      | Description                                                                                                                | Default        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `pollIntervalSeconds` | Polling interval. Range: `1 - Number.MAX_SAFE_INTEGER`                                                                     | 60             |
| `configChanged`       | Callback to get notified about changes.                                                                                    | -              |
| `logger`              | Custom logger. See below for details.                                                                                      | Console logger |
| `requestTimeoutMs`    | The amount of milliseconds the SDK waits for a response from the ConfigCat servers before returning values from the cache. | 30000          |
| `dataGovernance` | Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `Global`, `EuOnly`. | `Global` |
| `maxInitWaitTimeSeconds` | Maximum waiting time between the client initialization and the first config acquisition in seconds.                     | 5              |
| `cache`               | Cache implementation for config cache                                                                                      | InMemoryCache  |

Use the `pollIntervalSeconds` option parameter to change the polling interval.

```js
let configCatClient = configcat.createClientWithAutoPoll("#YOUR-SDK-KEY#", { pollIntervalSeconds: 95 });
```

Adding a callback to `configChanged` option parameter will get you notified about changes.

```js
let configCatClient = configcat.createClientWithAutoPoll("#YOUR-SDK-KEY#", { configChanged: () => {
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
| `dataGovernance` | Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `Global`, `EuOnly`. | `Global` |
| `cache`                  | Cache implementation for config cache                                                                                      | InMemoryCache  |

Use `cacheTimeToLiveSeconds` option parameter to set cache lifetime.

```js
let configCatClient = configcat.createClientWithLazyLoad("#YOUR-SDK-KEY#", { cacheTimeToLiveSeconds: 600 });
```

### Manual polling

Manual polling gives you full control over when the setting values are downloaded. *ConfigCat SDK* will not update them automatically. Calling `forceRefresh()` or `forceRefreshAsync()` is your application's responsibility.

#### `createClientWithManualPoll(sdkKey, options)`

| Option Parameter   | Description                                                                                                                | Default        |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `logger`           | Custom logger. See below for details.                                                                                      | Console logger |
| `requestTimeoutMs` | The amount of milliseconds the SDK waits for a response from the ConfigCat servers before returning values from the cache. | 30000          |
| `dataGovernance` | Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `Global`, `EuOnly`. | `Global` |
| `cache`            | Cache implementation for config cache                                                                                      | InMemoryCache  |

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
const configCatClient = configcat.createClient("#YOUR-SDK-KEY#");
configCatClient.getAllKeys((keys)=>{
    console.log(keys);
});
```

## `getAllKeysAsync()`

You can query the keys from your configuration in the SDK with the `getAllKeys()` method.

```js
const configCatClient = configcat.createClient("#YOUR-SDK-KEY#");
const keys = await configCatClient.getAllKeysAsync();
console.log(keys);
```

## `getAllValues()`

Evaluates and returns the values of all feature flags and settings. Passing a [User Object](#user-object) is optional.

```js
const configCatClient = configcat.createClient("#YOUR-SDK-KEY#");
configCatClient.getAllValues(function(settingValues) {
    settingValues.forEach(i => console.log(i.settingKey + ' -> ' + i.settingValue));
});


// invoke with user object
const userObject = {
    identifier : "john@example.com"
}; 

configCatClient.getAllValues(function(settingValues) {
    settingValues.forEach(i => console.log(i.settingKey + ' -> ' + i.settingValue));
}, userObject);
```

## `getAllValuesAsync()`

Evaluates and returns the values of all feature flags and settings. Passing a [User Object](#user-object) is optional.

```js
const configCatClient = configcat.createClient("#YOUR-SDK-KEY#");
const settingValues = await configCatClient.getAllValuesAsync();
settingValues.forEach(i => console.log(i.settingKey + ' -> ' + i.settingValue));

// invoke with user object
const userObject = {
    identifier : "john@example.com"
}; 

const settingValuesTargeting = await configCatClient.getAllValuesAsync(userObject);
settingValuesTargeting.forEach(i => console.log(i.settingKey + ' -> ' + i.settingValue));
```

## Using ConfigCat behind a proxy

Provide your own proxy server settings (proxy server/port) by adding a `proxy` option parameter when creating the ConfigCat client.

```js
const options = { pollIntervalSeconds: 2, proxy: 'http://192.168.1.1:8080' }

const configCatClient = configcat.createClientWithAutoPoll('PKDVCLf-Hq-h-kCzMp-L7Q/HhOWfwVtZ0mb30i9wi17GQ', options );
```

## Using custom cache implementation

Config's data stored in a cache, it is efficiency increases in retrieval of data and performance of the client. If you would like to use your cache solution (for example your system uses external or distributed cache) you can implement those function and set to `cache` parameters in the setting.

```js
function myCustomCache() { }

myDebugCache.prototype.get = function(key) {
    // `key` [string] - a unique cachekey

    // insert here your cache read logic

}

myDebugCache.prototype.set = function(key, item) {
    // `key` [string] - a unique cachekey
    // `item` [object] - configcat's cache config item

    // insert here your cache write logic
}

// set the `myCustomCache` when create a client instance

const configCatClient = configcat.createClientWithAutoPoll('PKDVCLf-Hq-h-kCzMp-L7Q/HhOWfwVtZ0mb30i9wi17GQ',
{
     cache: new myCustomCache()
});
```

> In some cases (eg: fs) you have to use [promisify](https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original) to create promisies from callback style funtions.

[See implementation of redis cache.](https://github.com/configcat/node-sdk/tree/master/samples/customcache)

## Sample Application

- [Sample Console App](https://github.com/configcat/node-sdk/blob/master/samples/console)
- [Sample Console App with custom cache](https://github.com/configcat/node-sdk/tree/master/samples/customcache)

## Look under the hood

- [ConfigCat Node.js SDK on GitHub](https://github.com/configcat/node-sdk)
- [ConfigCat's Node.js SDK in NPM](https://www.npmjs.com/package/configcat-node)
