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
const configCatClient = configcat.getClient('#YOUR-SDK-KEY#');
```

### 3. Get your setting value

The async/await way:

```js
const value = await configCatClient.getValueAsync('isMyAwesomeFeatureEnabled', false);

if (value) {
  do_the_new_thing();
} else {
  do_the_old_thing();
}
```

(Please note that [top-level await in modules](https://exploringjs.com/impatient-js/ch_modules.html#top-level-await) may not be available [in older browsers](https://caniuse.com/mdn-javascript_operators_await_top_level). If you need to target such browser versions, you will need to take the Promise way or to wrap your code in an async function or to configure your build tools to downlevel this language feature.)

The Promise way:

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

### 4. Dispose _ConfigCat_ client

You can safely dispose all clients at once or individually and release all associated resources on application exit.

```js
configcat.disposeAllClients(); // disposes all clients
// -or-
configCatClient.dispose(); // disposes a specific client
```

## Working Demo on CodePen

See the Pen [ConfigCat Feature Flag Demo](https://codepen.io/configcat/pen/pozaLLV) on [CodePen](https://codepen.io).

## Creating the _ConfigCat_ Client

_ConfigCat Client_ is responsible for:

- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`configcat.getClient('<sdkKey>')` returns a client with default options.

The `getClient` function has optional parameters, which can be used to adjust the behavior of the client.

| Parameters    | Description                                                                                               | Default |
| ------------- | --------------------------------------------------------------------------------------------------------- | ------- |
| `sdkKey`      | **REQUIRED.** SDK Key to access your feature flags and configurations. Get it from _ConfigCat Dashboard_. | - |
| `pollingMode` | Optional. The polling mode to use to acquire the setting values from the ConfigCat servers. [More about polling modes](#polling-modes). | `PollingMode.AutoPoll` |
| `options`     | Optional. The options object. See the table below. | - |

The available options depends on the chosen polling mode. However, there are some common options which can be set in the case of every polling mode:

| Option Parameter         | Description | Default |
| ------------------------ |------------ | ------- |
| `logger`                 | Custom logger. [More about logging](#logging). | Console logger |
| `requestTimeoutMs`       | The amount of milliseconds the SDK waits for a response from the ConfigCat servers before returning values from the cache. | 30000 |
| `baseUrl`                | Sets the CDN base url (forward proxy, dedicated subscription) from where the SDK will download the config.json. | |
| `dataGovernance`         | Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `DataGovernance.Global`, `DataGovernance.EuOnly`. | `DataGovernance.Global` |
| `cache`                  | Cache implementation for config cache. | `InMemoryCache` |
| `flagOverrides`          | Local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides). | - |
| `defaultUser`            | Sets the default user. [More about default user](#default-user). | `undefined` (none) |
| `offline`                | Determines whether the client should be initialized to offline mode or not. [More about offline mode](#online--offline-mode). | `false` |

Options also include a property named `setupHook`, which you can use to subscribe to the hooks (events) of the SDK at initialization time. [More about hooks](#hooks).

For example:

```js
const configCatClient = configcat.getClient('#YOUR-SDK-KEY#', configcat.PollingMode.AutoPoll, {
  setupHooks: hooks => hooks.on('clientReady', () => console.log('Client is ready!'))
});
```

:::caution
We strongly recommend you to use the _ConfigCat Client_ as a Singleton object in your application.
You can acquire singleton client instances for your SDK keys using the `configcat.getClient('<sdkKey>')` function.
(However, please keep in mind that subsequent calls to `getClient()` with the *same SDK Key* return a *shared* client instance, which was set up by the first call.)
You can close all open clients at once using the `configcat.disposeAllClients()` function or do it individually using the `configCatClient.dispose()` method.
:::

## Anatomy of `getValueAsync()`

Returns a Promise with the value.

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** The key of a specific setting or feature flag. Set on _ConfigCat Dashboard_ for each setting.  |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```js
const value = await configCatClient.getValueAsync(
  'keyOfMySetting', // Setting Key
  false, // Default value
  new configcat.User('#UNIQUE-USER-IDENTIFIER#') // Optional User Object
);
```

or

```js
configCatClient
  .getValueAsync(
    'keyOfMySetting', // Setting Key
    false, // Default value
    new configcat.User('#UNIQUE-USER-IDENTIFIER#') // Optional User Object
  )
  .then((value) => {
    console.log(value);
  });
```

## Anatomy of `getValueDetailsAsync()`

`getValueDetailsAsync()` is similar to `getValueAsync()` but instead of returning the evaluated value only, it provides more detailed information about the evaluation result.

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** The key of a specific setting or feature flag. Set on _ConfigCat Dashboard_ for each setting.  |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```js
const details = await configCatClient.getValueDetailsAsync(
  'keyOfMySetting', // Setting Key
  false, // Default value
  new configcat.User('#UNIQUE-USER-IDENTIFIER#') // Optional User Object
);
```

or

```js
configCatClient
  .getValueDetailsAsync(
    'keyOfMySetting', // Setting Key
    false, // Default value
    new configcat.User('#UNIQUE-USER-IDENTIFIER#') // Optional User Object
  )
  .then((details) => {
    console.log(details);
  });
```

The `details` result contains the following information:

| Field                                     | Type      | Description                                                                              |
| ----------------------------------------- | --------- | ---------------------------------------------------------------------------------------- |
| `key`                                     | `string`  | The key of the evaluated feature flag or setting.                                        |
| `value`                                   | `boolean` / `string` / `number` | The evaluated value of the feature flag or setting.                |
| `user`                                    | `User`    | The user object used for the evaluation.                                                 |
| `isDefaultValue`                          | `boolean` | True when the default value passed to `getValueDetailsAsync()` is returned due to an error. |
| `errorMessage`                            | `string`  | In case of an error, this field contains the error message.                              |
| `errorException`                          | `any`     | In case of an error, this field contains the related exception object (if any).          |
| `matchedEvaluationRule`                   | `RolloutRule` | If the evaluation was based on a targeting rule, this field contains that specific rule. |
| `matchedEvaluationPercentageRule`         | `RolloutPercentageItem` | If the evaluation was based on a percentage rule, this field contains that specific rule. |
| `fetchTime`                               | `Date` | The last download time (UTC) of the current config.                                         |

## User Object

The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature.

For simple targeting:

```js
let userObject = new configcat.User('#UNIQUE-USER-IDENTIFIER#');
```

```js
let userObject = new configcat.User('john@example.com');
```

| Parameters   | Description                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier` | **REQUIRED.** Unique identifier of a user in your application. Can be any `string` value, even an email address.                |
| `email`      | Optional parameter for easier targeting rule definitions.                                                                       |
| `country`    | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom`     | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |

For advanced targeting:

```js
let userObject = new configcat.User(
  /* identifier: */ '#UNIQUE-USER-IDENTIFIER#',
  /*      email: */ 'john@example.com',
  /*    country: */ 'United Kingdom',
  /*     custom: */ {
    SubscriptionType: 'Pro',
    UserRole: 'Admin',
  }
);
```

### Default user

It's possible to set a default user object that will be used on feature flag and setting evaluation. It can be useful when your application has a single user only or rarely switches users.

You can set the default user object either on SDK initialization:
```js
const configCatClient = configcat.getClient('#YOUR-SDK-KEY#', configcat.PollingMode.AutoPoll, {
  defaultUser: new configcat.User('john@example.com')
});
```

...or using the `setDefaultUser()` method of the `configCatClient` object:
```js
configCatClient.setDefaultUser(new configcat.User('john@example.com'));
```

Whenever the evaluation methods like `getValueAsync()`, `getValueDetailsAsync()`, etc. are called without an explicit user object parameter, the SDK will automatically use the default user as a user object.

```js
const user = new configcat.User('john@example.com');
configCatClient.setDefaultUser(user);

// The default user will be used in the evaluation process.
const value = await configCatClient.getValueAsync('keyOfMySetting', false); 
```

When a user object parameter is passed to the evaluation methods, it takes precedence over the default user.

```js
const user = new configcat.User('john@example.com');
configCatClient.setDefaultUser(user);

const otherUser = new configcat.User('brian@example.com');

// otherUser will be used in the evaluation process.
const value = await configCatClient.getValueAsync('keyOfMySetting', false, otherUser);
```

You can also remove the default user by doing the following:
```js
configCatClient.clearDefaultUser();
```

## Polling Modes

The _ConfigCat SDK_ supports 3 different polling mechanisms to acquire the setting values from _ConfigCat_. After latest setting values are downloaded, they are stored in the internal cache then all `getValueAsync()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.
[More about polling modes.](/advanced/caching/)

### Auto polling (default)

The _ConfigCat SDK_ downloads the latest values and stores them automatically every 60 seconds.

Use the `pollIntervalSeconds` option parameter to change the polling interval.

```js
const configCatClient = configcat.getClient('#YOUR-SDK-KEY#', configcat.PollingMode.AutoPoll, {
  pollIntervalSeconds: 95,
});
```

Available options (in addition to the [common ones](#creating-the-configcat-client)):

| Option Parameter         | Description | Default |
| ------------------------ | ----------- | ------- |
| `pollIntervalSeconds`    | Polling interval. Range: `[1, Number.MAX_SAFE_INTEGER]` | 60 |
| `maxInitWaitTimeSeconds` | Maximum waiting time between the client initialization and the first config acquisition in seconds. | 5 |

### Lazy loading

When calling `getValueAsync()` the _ConfigCat SDK_ downloads the latest setting values if they are not present or expired in the cache. In this case `getValueAsync()` will return the setting value after the cache is updated.

Use `cacheTimeToLiveSeconds` option parameter to set cache lifetime.

```js
const configCatClient = configcat.getClient('#YOUR-SDK-KEY#', configcat.PollingMode.LazyLoad, {
  cacheTimeToLiveSeconds: 600,
});
```

Available options (in addition to the [common ones](#creating-the-configcat-client)):

| Option Parameter         | Description | Default |
| ------------------------ | ----------- | ------- |
| `cacheTimeToLiveSeconds` | Cache TTL. Range: `[1, Number.MAX_SAFE_INTEGER]` | 60 |

### Manual polling

Manual polling gives you full control over when the `config.json` (with the setting values) is downloaded. _ConfigCat SDK_ will not update them automatically. Calling `forceRefreshAsync()` is your application's responsibility.

```js
const configCatClient = configcat.getClient('#YOUR-SDK-KEY#', configcat.PollingMode.ManualPoll);

await configCatClient.forceRefreshAsync();
let value = await configCatClient.getValueAsync('key', 'my default value');
console.log(value);
```

> `getValueAsync()` returns `defaultValue` if the cache is empty. Call `forceRefreshAsync()` to update the cache.

```js
const configCatClient = configcat.getClient('#YOUR-SDK-KEY#', configcat.PollingMode.ManualPoll);

let value = await configCatClient.getValueAsync('key', 'my default value');
console.log(value); // console: "my default value"

await configCatClient.forceRefreshAsync();
value = await configCatClient.getValueAsync('key', 'my default value');
console.log(value);
```

## Hooks

The SDK provides several hooks (events), by means of which you can get notified of its actions.
You can subscribe to the following events emitted by the client:

- `clientReady`: This event is emitted when the SDK reaches the ready state. If the SDK is set up to use lazy load or manual polling, it's considered ready right after instantiation.
If auto polling is used, the ready state is reached when the SDK has a valid config.json loaded into memory either from cache or from HTTP. If the config couldn't be loaded neither from cache nor from HTTP, the `clientReady` event fires when the auto polling's `MaxInitWaitTime` has passed.
- `configChanged`: This event is emitted first when the SDK loads a valid config.json into memory from cache, then each time afterwards when a config.json with changed content is downloaded via HTTP.
- `flagEvaluated`: This event is emitted each time when the SDK evaluates a feature flag or setting. The event provides the same evaluation details that you would get from [`getValueDetailsAsync()`](#anatomy-of-getvaluedetailsasync).
- `clientError`: This event is emitted when an error occurs within the ConfigCat SDK.

You can subscribe to these events either on initialization:
```js
const configCatClient = configcat.getClient('#YOUR-SDK-KEY#', configcat.PollingMode.ManualPoll, {
  setupHooks: hooks => hooks.on('flagEvaluated', () => { /* handle the event */ })
});
```

...or directly on the `ConfigCatClient` instance:
```js
configCatClient.on('flagEvaluated', () => { /* handle the event */ });
```

## Online / Offline mode

In cases where you want to prevent the SDK from making HTTP calls, you can switch it to offline mode:
```js
configCatClient.setOffline();
```

In offline mode, the SDK won't initiate HTTP requests and will work only from its cache.

To switch the SDK back to online mode, do the following:
```js
configCatClient.setOnline();
```

Using the `configCatClient.isOffline` property you can check whether the SDK is in offline mode or not.

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local only** (`OverrideBehaviour.LocalOnly`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour.LocalOverRemote`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour.RemoteOverLocal`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can set up the SDK to load your feature flag & setting overrides from a `{ [name: string]: any }` map.

```js
const configCatClient = configcat.getClient('#YOUR-SDK-KEY#', configcat.PollingMode.AutoPoll, {
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
const logger = configcat.createConsoleLogger(configcat.LogLevel.Info); // Setting log level to Info

const configCatClient = configcat.getClient('#YOUR-SDK-KEY#', configcat.PollingMode.AutoPoll, {
  logger: logger,
});
```

Available log levels:

| Level | Description                                             |
| ----- | ------------------------------------------------------- |
| Off   | Nothing gets logged.                                    |
| Error | Only error level events are logged.                     |
| Warn  | Default. Errors and Warnings are logged.                |
| Info  | Errors, Warnings and feature flag evaluation is logged. |
| Debug | All of the above plus debug info is logged.             |

Info level logging helps to inspect the feature flag evaluation process:

```bash
ConfigCat - INFO - Evaluate 'isPOCFeatureEnabled'
 User : {"identifier":"#SOME-USER-ID#","email":"configcat@example.com"}
 Evaluating rule: 'configcat@example.com' CONTAINS '@something.com' => no match
 Evaluating rule: 'configcat@example.com' CONTAINS '@example.com' => MATCH
 Returning value : true
```

## `getAllKeysAsync()`

You can query the keys from your configuration in the SDK with the `getAllKeysAsync()` method.

```js
const configCatClient = configcat.getClient('#YOUR-SDK-KEY#');

const keys = await configCatClient.getAllKeysAsync();
console.log(keys);
```

## `getAllValuesAsync()`

Evaluates and returns the values of all feature flags and settings. Passing a [User Object](#user-object) is optional.

```js
const configCatClient = configcat.getClient('#YOUR-SDK-KEY#');

let settingValues = await configCatClient.getAllValuesAsync();
settingValues.forEach((i) =>
  console.log(i.settingKey + ' -> ' + i.settingValue),
);

// invoke with user object
const userObject = new configcat.User('john@example.com');

settingValues = await configCatClient.getAllValuesAsync(userObject);
settingValues.forEach((i) =>
  console.log(i.settingKey + ' -> ' + i.settingValue),
);
```

## `getAllValueDetailsAsync()`

Evaluates and returns the values along with evaluation details of all feature flags and settings. Passing a [User Object](#user-object) is optional.

```js
const configCatClient = configcat.getClient('#YOUR-SDK-KEY#');

let settingValues = await configCatClient.getAllValueDetailsAsync();
settingValues.forEach((details) =>
  console.log(details),
);

// invoke with user object
const userObject = new configcat.User('john@example.com');

settingValues = await configCatClient.getAllValueDetailsAsync(userObject);
settingValues.forEach((details) =>
  console.log(details),
);
```

## Using custom cache implementation

Config data is stored in a cache for reducing network traffic and for improving performance of the client. If you would like to use your own cache solution (for example when your system uses external or distributed cache) you can implement the [`ICache` interface](https://github.com/configcat/common-js/blob/master/src/Cache.ts) and set the `cache` parameter in the options.

```js
class MyCustomCache {
  set(key, config) {
    // `key` [string] - a unique cache key
    // `config` [object (ProjectConfig)] - configcat's cache config item
    // insert your cache write logic here
  }
  get(key) {
    // `key` [string] - a unique cache key
    // insert your cache read logic here
  }
}
```

or

```js
function MyCustomCache() { }

MyCustomCache.prototype.set = function (key, config) {
  // `key` [string] - a unique cache key
  // `config` [object (ProjectConfig)] - configcat's cache config item
  // insert your cache write logic here
};
MyCustomCache.prototype.get = function (key) {
  // `key` [string] - a unique cache key
  // insert your cache read logic here
};
```

then

```js
// set the `MyCustomCache` implementation on creating the client instance

const configCatClient = configcat.getClient('#YOUR-SDK-KEY#', configcat.PollingMode.AutoPoll, {
  cache: new MyCustomCache(),
});
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
