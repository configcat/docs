---
id: 'js'
title: JavaScript SDK Reference
description: ConfigCat JavaScript SDK Reference. This is a step-by-step guide on how to use feature flags in your JavaScript applications.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[![Star on GitHub](https://img.shields.io/github/stars/configcat/js-sdk.svg?style=social)](https://github.com/configcat/js-sdk/stargazers)
[![JS CI](https://github.com/configcat/js-sdk/actions/workflows/js-ci.yml/badge.svg?branch=master)](https://github.com/configcat/js-sdk/actions/workflows/js-ci.yml)
[![codecov](https://codecov.io/gh/configcat/js-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/configcat/js-sdk)
[![Known Vulnerabilities](https://snyk.io/test/github/configcat/js-sdk/badge.svg?targetFile=package.json)](https://snyk.io/test/github/configcat/js-sdk?targetFile=package.json)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=configcat_js-sdk&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=configcat_js-sdk)
[![JSDELIVR](https://data.jsdelivr.com/v1/package/npm/configcat-js/badge)](https://www.jsdelivr.com/package/npm/configcat-js)

:::info
For JavaScript SSR (Server-Side Rendered) applications we recommend using [ConfigCat JS-SSR SDK](js-ssr.md).
:::

<a href="https://github.com/configcat/js-sdk" target="_blank">ConfigCat JavaScript SDK on GitHub</a>

## Getting started

### 1. Install and import package

<Tabs groupId="js-install">
<TabItem value="NPM" label="NPM">

```bash
npm i configcat-js
```

```js
import * as configcat from 'configcat-js';
```

</TabItem>
<TabItem value="CDN" label="CDN">

```html
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/configcat-js@latest/dist/configcat.min.js"
></script>
```

</TabItem>
</Tabs>

### 2. Create the _ConfigCat_ client with your SDK Key:

```js
var configCatClient = configcat.createClient('#YOUR-SDK-KEY#');
```

### 3. Get your setting value

The Promise (async/await) way:

```js
configCatClient
  .getValueAsync('isMyAwesomeFeatureEnabled', false)
  .then((value) => {
    if (value) {
      do_the_new_thing();
    } else {
      do_the_old_thing();
    }
  });
```

or the Callback way:

```js
configCatClient.getValue('isMyAwesomeFeatureEnabled', false, (value) => {
  if (value) {
    do_the_new_thing();
  } else {
    do_the_old_thing();
  }
});
```

### 4. Dispose _ConfigCat_ client

You can safely `dispose()` the client instance and release all associated resources on application exit.

```js
configCatClient.dispose();
```

## Working Demo on CodePen

See the Pen [ConfigCat Feature Flag Demo](https://codepen.io/configcat/pen/pozaLLV) on [CodePen](https://codepen.io).

## Creating the _ConfigCat_ Client

_ConfigCat Client_ is responsible for:

- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`createClient(sdkKey, options)` returns a client with default options.

| Properties | Description                                                                                               | Default |
| ---------- | --------------------------------------------------------------------------------------------------------- | ------- |
| `sdkKey`   | **REQUIRED.** SDK Key to access your feature flags and configurations. Get it from _ConfigCat Dashboard_. | -       |
| `options`  | Optional. [More about the options parameter](#auto-polling-default).                                      | -       |

`createClientWithAutoPoll()`, `createClientWithLazyLoad()`, `createClientWithManualPoll()`  
Creating the client is different for each polling mode.
[See below](#polling-modes) for details.

:::caution
We strongly recommend you to use the _ConfigCat Client_ as a Singleton object in your application.
If you want to use multiple SDK Keys in the same application, create only one _ConfigCat Client_ per SDK Key.
:::

## Anatomy of `getValue()`

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on _ConfigCat Dashboard_ for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `callback`     | **REQUIRED.** Called with the actual setting value.                                                          |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```js
configCatClient.getValue(
  'keyOfMySetting', // Setting Key
  false, // Default value
  function (value) {
    console.log(value);
  }, // Callback function
  { identifier: '#UNIQUE-USER-IDENTIFIER#' }, // Optional User Object
);
```

## Anatomy of `getValueAsync()`

Returns a Promise with the value.

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on _ConfigCat Dashboard_ for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```js
const value = await configCatClient.getValueAsync(
  'keyOfMySetting', // Setting Key
  false, // Default value
  { identifier: '#UNIQUE-USER-IDENTIFIER#' }, // Optional User Object
);
```

or

```js
configCatClient
  .getValueAsync(
    'keyOfMySetting', // Setting Key
    false, // Default value
    { identifier: '#UNIQUE-USER-IDENTIFIER#' },
  ) // Optional User Object
  .then((value) => {
    console.log(value);
  });
```

## User Object

The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature.
For simple targeting:

```javascript
var userObject = {
  identifier: '#UNIQUE-USER-IDENTIFIER#',
};
```

or

```javascript
var userObject = {
  identifier: 'john@example.com',
};
```

| Parameters   | Description                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier` | **REQUIRED.** Unique identifier of a user in your application. Can be any `string` value, even an email address.                |
| `email`      | Optional parameter for easier targeting rule definitions.                                                                       |
| `country`    | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom`     | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |

For advanced targeting:

```javascript
var userObject = {
  identifier: '#UNIQUE-USER-IDENTIFIER#',
  email: 'john@example.com',
  country: 'United Kingdom',
  custom: {
    SubscriptionType: 'Pro',
    UserRole: 'Admin',
  },
};
```

## Polling Modes

The _ConfigCat SDK_ supports 3 different polling mechanisms to acquire the setting values from _ConfigCat_. After latest setting values are downloaded, they are stored in the internal cache then all `getValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.  
[More about polling modes.](/advanced/caching/)

### Auto polling (default)

The _ConfigCat SDK_ downloads the latest values and stores them automatically every 60 seconds.

#### `createClientWithAutoPoll(sdkKey, options)`

| Option Parameter         | Description                                                                                                                                                                                                                                                                                      | Default                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| `pollIntervalSeconds`    | Polling interval. Range: `1 - Number.MAX_SAFE_INTEGER`                                                                                                                                                                                                                                           | 60                      |
| `configChanged`          | Callback to get notified about changes.                                                                                                                                                                                                                                                          | -                       |
| `logger`                 | Custom logger. See below for details.                                                                                                                                                                                                                                                            | Console logger          |
| `requestTimeoutMs`       | The amount of milliseconds the SDK waits for a response from the ConfigCat servers before returning values from the cache.                                                                                                                                                                       | 30000                   |
| `dataGovernance`         | Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `DataGovernance.Global`, `DataGovernance.EuOnly`. | `DataGovernance.Global` |
| `maxInitWaitTimeSeconds` | Maximum waiting time between the client initialization and the first config acquisition in seconds.                                                                                                                                                                                              | 5                       |
| `flagOverrides`          | Local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides).                                                                                                                                                                                                    | -                       |

Use the `pollIntervalSeconds` option parameter to change the polling interval.

```js
configcat.createClientWithAutoPoll('#YOUR-SDK-KEY#', {
  pollIntervalSeconds: 95,
});
```

Adding a callback to `configChanged` option parameter will get you notified about changes.

```js
configcat.createClientWithAutoPoll('#YOUR-SDK-KEY#', {
  configChanged: function () {
    console.log('Your config has been changed!');
  },
});
```

### Lazy loading

When calling `getValue()` the _ConfigCat SDK_ downloads the latest setting values if they are not present or expired in the cache. In this case the `callback` will be called after the cache is updated.

#### `createClientWithLazyLoad(sdkKey, options)`

| Option Parameter         | Description                                                                                                                                                                                                                                                                                      | Default                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| `cacheTimeToLiveSeconds` | Cache TTL. Range: `1 - Number.MAX_SAFE_INTEGER`                                                                                                                                                                                                                                                  | 60                      |
| `logger`                 | Custom logger. See below for details.                                                                                                                                                                                                                                                            | Console logger          |
| `requestTimeoutMs`       | The amount of milliseconds the SDK waits for a response from the ConfigCat servers before returning values from the cache.                                                                                                                                                                       | 30000                   |
| `dataGovernance`         | Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `DataGovernance.Global`, `DataGovernance.EuOnly`. | `DataGovernance.Global` |
| `flagOverrides`          | Local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides).                                                                                                                                                                                                    | -                       |

Use `cacheTimeToLiveSeconds` option parameter to set cache lifetime.

```js
configcat.createClientWithLazyLoad('#YOUR-SDK-KEY#', {
  cacheTimeToLiveSeconds: 600,
});
```

### Manual polling

Manual polling gives you full control over when the `config.json` (with the setting values) is downloaded. _ConfigCat SDK_ will not update them automatically. Calling `forceRefresh()` or `forceRefreshAsync()` is your application's responsibility.

#### `createClientWithManualPoll(sdkKey, options)`

| Option Parameter   | Description                                                                                                                                                                                                                                                                                      | Default                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| `logger`           | Custom logger. See below for details.                                                                                                                                                                                                                                                            | Console logger          |
| `requestTimeoutMs` | The amount of milliseconds the SDK waits for a response from the ConfigCat servers before returning values from the cache.                                                                                                                                                                       | 30000                   |
| `dataGovernance`   | Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `DataGovernance.Global`, `DataGovernance.EuOnly`. | `DataGovernance.Global` |
| `flagOverrides`    | Local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides).                                                                                                                                                                                                    | -                       |

```js
const configCatClient = configcat.createClientWithManualPoll('#YOUR-SDK-KEY#');

configCatClient.forceRefresh(() => {
  configCatClient.getValue('key', 'my default value', (value) => {
    console.log(value);
  });
});
```

> `getValue()` returns `defaultValue` if the cache is empty. Call `forceRefresh()` or `forceRefreshAsync()` to update the cache.

```js
const configCatClient = configcat.createClientWithManualPoll('#YOUR-SDK-KEY#');

configCatClient.getValue('key', 'my default value', (value) => {
  console.log(value); // console: "my default value"
});

configCatClient.forceRefresh(() => {
  configCatClient.getValue('key', 'my default value', (value) => {
    console.log(value); // console: "value from server"
  });
});
```

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local/Offline mode** (`OverrideBehaviour.LocalOnly`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour.LocalOverRemote`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour.RemoteOverLocal`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can set up the SDK to load your feature flag & setting overrides from a `{ [name: string]: any }` map.

```js
const configCatClient = configcat.createClientWithAutoPoll('#YOUR-SDK-KEY#', {
  flagOverrides: configcat.createFlagOverridesFromMap(
    {
      enabledFeature: true,
      disabledFeature: false,
      intSetting: 5,
      doubleSetting: 3.14,
      stringSetting: 'test',
    },
    configcat.OverrideBehaviour.LocalOnly,
  ),
});
```

## Logging

### Setting log levels

```js
const logger = configcat.createConsoleLogger(3); // Setting log level to 3 (= Info)

const configCatClient = configcat.createClientWithAutoPoll('#YOUR-SDK-KEY#', {
  logger: logger,
});
```

Available log levels:

| Level | Name  | Description                                             |
| ----- | ----- | ------------------------------------------------------- |
| -1    | Off   | Nothing gets logged.                                    |
| 1     | Error | Only error level events are logged.                     |
| 2     | Warn  | Errors and Warnings are logged.                         |
| 3     | Info  | Errors, Warnings and feature flag evaluation is logged. |
| 4     | Debug | All of the above plus debug info is logged.             |

You can use `LogLevel` enum type from `configcat-common` package:

```
import { LogLevel } from 'configcat-common';

const logger = configcat.createConsoleLogger(LogLevel.Info);
```

Info level logging helps to inspect the feature flag evaluation process:

```bash
ConfigCat - INFO - Evaluate 'isPOCFeatureEnabled'
 User : {"identifier":"#SOME-USER-ID#","email":"configcat@example.com"}
 Evaluating rule: 'configcat@example.com' CONTAINS '@something.com' => no match
 Evaluating rule: 'configcat@example.com' CONTAINS '@example.com' => MATCH
 Returning value : true
```

## `getAllKeys()`, `getAllKeysAsync()`

You can query the keys from your configuration in the SDK with the `getAllKeys()` or `getAllKeysAsync()` method.

```js
const configCatClient = configcat.createClient('#YOUR-SDK-KEY#');
configCatClient.getAllKeys(function (keys) {
  console.log(keys);
});
```

```js
const configCatClient = configcat.createClient('#YOUR-SDK-KEY#');
const keys = await configCatClient.getAllKeysAsync();
console.log(keys);
```

## `getAllValues()`, `getAllValuesAsync()`

Evaluates and returns the values of all feature flags and settings. Passing a [User Object](#user-object) is optional.

```js
const configCatClient = configcat.createClient('#YOUR-SDK-KEY#');

configCatClient.getAllValues(function (settingValues) {
  settingValues.forEach((i) =>
    console.log(i.settingKey + ' -> ' + i.settingValue),
  );
});

// invoke with user object
const userObject = { identifier: 'john@example.com' };
configCatClient.getAllValues(function (settingValues) {
  settingValues.forEach((i) =>
    console.log(i.settingKey + ' -> ' + i.settingValue),
  );
}, userObject);
```

```js
const configCatClient = configcat.createClient('#YOUR-SDK-KEY#');

const settingValues = await configCatClient.getAllValuesAsync();
settingValues.forEach((i) =>
  console.log(i.settingKey + ' -> ' + i.settingValue),
);

// invoke with user object
const userObject = { identifier: 'john@example.com' };
const settingValuesTargeting = await configCatClient.getAllValuesAsync(
  userObject,
);
settingValuesTargeting.forEach((i) =>
  console.log(i.settingKey + ' -> ' + i.settingValue),
);
```

## Using custom cache implementation

Config's data stored in a cache, it is efficiency increases in retrieval of data and performance of the client. If you would like to use your cache solution (for example your system uses external or distributed cache) you can implement those function and set to `cache` parameters in the setting.

```js
function myCustomCache() {}

myCustomCache.prototype.get = function (key) {
  // `key` [string] - a unique cachekey
  // insert here your cache read logic
};

myCustomCache.prototype.set = function (key, item) {
  // `key` [string] - a unique cachekey
  // `item` [object] - configcat's cache config item
  // insert here your cache write logic
};

// set the `myCustomCache` when create a client instance

const configCatClient = configcat.createClientWithAutoPoll(
  'PKDVCLf-Hq-h-kCzMp-L7Q/HhOWfwVtZ0mb30i9wi17GQ',
  {
    cache: new myCustomCache(),
  },
);
```

## Sensitive information handling

The frontend/mobile SDKs are running in your users' browsers/devices. The SDK is downloading a [config.json](/requests/) file from ConfigCat's CDN servers. The URL path for this config.json file contains your SDK key, so the SDK key and the content of your config.json file (feature flag keys, feature flag values, targeting rules, % rules) can be visible to your users.
This SDK key is read-only, it only allows downloading your config.json file, but nobody can make any changes with it in your ConfigCat account.

If you do not want to expose the SDK key or the content of the config.json file, we recommend using the SDK in your backend components only. You can always create a backend endpoint using the ConfigCat SDK that can evaluate feature flags for a specific user, and call that backend endpoint from your frontend/mobile applications.

Also, we recommend using [confidential targeting comparators](/advanced/targeting/#confidential-text-comparators) in the targeting rules of those feature flags that are used in the frontend/mobile SDKs.

## Browser compatibility

This SDK should be compatible with all modern browsers.

The SDK is [tested](https://github.com/configcat/js-sdk/blob/master/.github/workflows/js-ci.yml) against the following browsers:

- Chrome (stable, latest, beta)
- Chromium (64.0.3282.0, 72.0.3626.0, 80.0.3987.0)
- Firefox (latest, latest-beta, 84.0).

These tests are running on each pull request, before each deploy, and on a daily basis.
You can view a sample run [here](https://github.com/configcat/js-sdk/actions/runs/2420592907).

## Sample Applications

- <a href="https://github.com/configcat/js-sdk/tree/master/samples/angular-sample" target="_blank">Angular 2+</a>
- <a href="https://github.com/configcat/js-sdk/tree/master/samples/react-sample" target="_blank">React</a>
- <a href="https://github.com/configcat/js-sdk/tree/master/samples/html" target="_blank">Pure HTML + JS</a>

## Guides

See the guides on how to use ConfigCat's JavaScript SDK with the following libraries and frameworks:

- <a href="https://configcat.com/blog/2021/12/13/feature-flags-in-react/" target="_blank">React</a>
- <a href="https://configcat.com/blog/2022/08/09/using-feature-flags-in-angular/" target="_blank">Angular</a>
- <a href="https://configcat.com/blog/2022/01/28/how-to-use-feature-flag-in-vuejs/" target="_blank">VueJS</a>
- <a href="https://configcat.com/blog/2022/07/29/how-to-use-feature-flags-in-ionic-js/" target="_blank">Ionic</a>
- <a href="https://configcat.com/blog/2022/02/04/feature-flags-in-phaser/" target="_blank">Phaser</a>
- <a href="https://configcat.com/blog/2022/11/11/how-to-use-feature-flags-in-solidjs/" target="_blank">Solid.js</a>
- <a href="https://configcat.com/blog/2022/02/19/feature-flags-in-melonjs/" target="_blank">melonJS</a>

## Look under the hood

- <a href="https://github.com/configcat/js-sdk" target="_blank">ConfigCat JavaScript SDK on GitHub</a>
- <a href="https://www.npmjs.com/package/configcat-js" target="_blank">ConfigCat JavaScript SDK in NPM</a>
