---
title: "JavaScript"
id: "js"
---
## Getting started

### 1. Install and import package
*via NPM:*
```bash
npm i configcat-js
```
```js
import * as configcat from "configcat-js";
```

*via CDN:*
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/configcat-js@latest/dist/configcat.min.js"></script>
```
### 2. Create the *ConfigCatClient* with your API Key:
```js
var configCatClient = configcat.createClient("#YOUR-API-KEY#");
```
### 3. Get your setting value:
```js
configCatClient.getValue("isMyAwesomeFeatureEnabled", false, function(value) {
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
| Properties | Description                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `apiKey`   | **REQUIRED.** API Key to access your feature flags and configurations. Get it from *ConfigCat Management Console*. |

`createClientWithAutoPoll()`, `createClientWithLazyLoad()`, `createClientWithManualPoll()`  
Creating the client is different for each polling mode.
[See below](#polling-modes) for details.

> We strongly recommend using the *ConfigCat Client* as a Singleton object in your application.

## Anatomy of `getValue()`
| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set in *ConfigCat Management Console* for each setting.                  |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `callback`     | **REQUIRED.** Called with the actual setting value.                                                          |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](../../advanced/targeting) |
```js
configCatClient.getValue(
    "keyOfMySetting", // Setting Key
    false, // Default value
    function(value) { console.log(value) }, // Callback function
    { identifier : "435170f4-8a8b-4b67-a723-505ac7cdea92" } // Optional User Object
);
```
### User Object 
``` javascript
var userObject = {
    identifier : "435170f4-8a8b-4b67-a723-505ac7cdea92"
};   
```
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

Use the `pollIntervalSeconds` option parameter to change the polling interval.
```js
configcat.createClientWithAutoPoll("#YOUR-API-KEY#", { pollIntervalSeconds: 95 });
```
Adding a callback to `configChanged` option parameter will get you notified about changes.
```js
configcat.createClientWithAutoPoll("#YOUR-API-KEY#", { configChanged: function() {
    console.log("Your config has been changed!");
}});
```
Available options:
| Option Parameter      | Description                                            | Default        |
| --------------------- | ------------------------------------------------------ | -------------- |
| `pollIntervalSeconds` | Polling interval. Range: `1 - Number.MAX_SAFE_INTEGER` | 60             |
| `configChanged`       | Callback to get notified about changes.                | -              |
| `logger`              | Custom logger. See below for details.                  | Console logger |

### Lazy loading
When calling `getValue()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `callback` will be called after the cache is updated.

Use `cacheTimeToLiveSeconds` option parameter to set cache lifetime.
```js
configcat.createClientWithLazyLoad("#YOUR-API-KEY#", { cacheTimeToLiveSeconds: 600 });
```
Available options:
| Option Parameter         | Description                                     | Default |
| ------------------------ | ----------------------------------------------- | ------- |
| `cacheTimeToLiveSeconds` | Cache TTL. Range: `1 - Number.MAX_SAFE_INTEGER` | 60      |
| `logger`                 | Custom logger.                                  |

### Manual polling
Manual polling gives you full control over when the setting values are downloaded. *ConfigCat SDK* will not update them automatically. Calling `forceRefresh()` is your application's responsibility.

```js
configcat.createClientWithManualPoll("#YOUR-API-KEY#");
configcat.forceRefresh();
```
Available options:
| Option Parameter | Description                           | Default        |
| ---------------- | ------------------------------------- | -------------- |
| `logger`         | Custom logger. See below for details. | Console logger |
> `getValue()` returns `defaultValue` if the cache is empty. Call `forceRefresh()` to update the cache.
```js
var client = configcat.createClientWithManualPoll("#YOUR-API-KEY#");
client.getValue("key", "my default value", function(value) {
    console.log(value) // console: "my default value"
});
configcat.forceRefresh();
client.getValue("key", "my default value", function(value) {
    console.log(value) // console: "value from server"
});
```
## Logging
To customize logging create a logger instance and add it to Options object when creating the ConfigCat client. 2 log levels are supported: `log` and `error`.
```js
var customLogger = {
    log: function(message) {
        console.log('ConfigCat log: ' + message);
    },
    error: function(message) {
        console.error('ConfigCat log: ' + message);
    }
};

configcat.createClientWithManualPoll("#YOUR-API-KEY#", { logger: customLogger });
```
## CDN base url (forward proxy, dedicated subscription)
You can customize your CDN path in the SDK with `baseUrl` property in the `options` parameter.

```js
var configCatClient = configcat.createClientWithManualPoll("#YOUR-API-KEY#", { baseUrl: "https://myCDN.configcat.com" });
```
## Get All Keys
You can query the keys from your config file in the SDK with the `getAllKeys` method.

```js
var configCatClient = configcat.createClient("#YOUR-API-KEY#");
configCatClient.getAllKeys(function(keys) {
    console.log(keys);
});
```


## Sample Applications
- <a href="https://github.com/configcat/js-sdk/tree/master/samples/angular-sample" target="_blank">Angular 2+</a>
- <a href="https://github.com/configcat/js-sdk/tree/master/samples/react-sample" target="_blank">React</a>
- <a href="https://github.com/configcat/js-sdk/tree/master/samples/html" target="_blank">Pure HTML + JS</a>

## Look under the hood
* <a href="https://github.com/configcat/js-sdk" target="_blank">ConfigCat's JavaScript SDK on GitHub</a>
* <a href="https://www.npmjs.com/package/configcat-js" target="_blank">ConfigCat JavaScript SDK in NPM</a>
