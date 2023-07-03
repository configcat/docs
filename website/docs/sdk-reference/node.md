---
id: node
title: Node.js SDK Reference
description: ConfigCat Node.js SDK Reference. This is a step-by-step guide on how to use feature flags in your Node.js applications.
---

export const NodeSchema = require('@site/src/schema-markup/sdk-reference/node.json');

<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(NodeSchema) }}></script>

[![Star on GitHub](https://img.shields.io/github/stars/configcat/node-sdk.svg?style=social)](https://github.com/configcat/node-sdk/stargazers)
[![Node CI](https://github.com/configcat/node-sdk/actions/workflows/node-ci.yml/badge.svg?branch=master)](https://github.com/configcat/node-sdk/actions/workflows/node-ci.yml)
[![codecov](https://codecov.io/gh/configcat/node-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/configcat/node-sdk)
[![Known Vulnerabilities](https://snyk.io/test/github/configcat/node-sdk/badge.svg?targetFile=package.json)](https://snyk.io/test/github/configcat/node-sdk?targetFile=package.json)
![License](https://img.shields.io/github/license/configcat/node-sdk.svg)
[![Node.JS](https://img.shields.io/node/v/configcat-node)](https://img.shields.io/node/v/configcat-node)

:::info
For JavaScript SSR (Server-Side Rendered) applications we recommend using [ConfigCat JS-SSR SDK](js-ssr.md).
:::

<a href="https://github.com/configcat/node-sdk" target="_blank">ConfigCat Node.js SDK on GitHub</a>

## Getting started

### 1. Install _ConfigCat SDK_

_via NPM_

```bash
npm i configcat-node
```

### 2. Import package

```js
const configcat = require('configcat-node');
```

### 3. Create the _ConfigCat_ client with your _SDK Key_

```js
const configCatClient = configcat.getClient('#YOUR-SDK-KEY#');
```

### 4. Get your setting value

The async/await way:

```js
const value = await configCatClient.getValueAsync('isMyAwesomeFeatureEnabled', false);

if (value) {
  do_the_new_thing();
} else {
  do_the_old_thing();
}
```

(Please note that [top-level await in modules](https://exploringjs.com/impatient-js/ch_modules.html#top-level-await) is available only if your project is [set up to use the ECMAScript module system](https://nodejs.org/api/esm.html). Otherwise you will need to use Promises or wrap your code in an async function as shown [here](https://github.com/configcat/node-sdk/blob/master/samples/console/index.js).)

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

### 5. Dispose the _ConfigCat_ client

You can safely dispose all clients at once or individually and release all associated resources on application exit.

```js
configcat.disposeAllClients(); // disposes all clients
// -or-
configCatClient.dispose(); // disposes a specific client
```

## Creating the _ConfigCat Client_

_ConfigCat Client_ is responsible for:

- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`configcat.getClient('<sdkKey>')` returns a client with default options.

The `getClient` function has optional parameters, which can be used to adjust the behavior of the client.

| Parameters    | Description                                                                                                                             | Default                |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `sdkKey`      | **REQUIRED.** SDK Key to access your feature flags and configurations. Get it from _ConfigCat Dashboard_.                               | -                      |
| `pollingMode` | Optional. The polling mode to use to acquire the setting values from the ConfigCat servers. [More about polling modes](#polling-modes). | `PollingMode.AutoPoll` |
| `options`     | Optional. The options object. See the table below.                                                                                      | -                      |

The available options depends on the chosen polling mode. However, there are some common options which can be set in the case of every polling mode:

| Option Parameter   | Description                                                                                                                                                                                                                                                                                      | Default                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| `logger`           | Custom [`IConfigCatLogger`](https://github.com/configcat/common-js/blob/master/src/ConfigCatLogger.ts) implementation for tracing.                                                                                                                                       | [`ConfigCatConsoleLogger`](https://github.com/configcat/common-js/blob/master/src/ConfigCatLogger.ts) (with WARN level) |
| `requestTimeoutMs` | The amount of milliseconds the SDK waits for a response from the ConfigCat servers before returning values from the cache.                                                                                                                                                                       | 30000                   |
| `baseUrl`          | Sets the CDN base url (forward proxy, dedicated subscription) from where the SDK will download the config JSON.                                                                                                                                                                                  |                         |
| `proxy`            | Proxy settings. [More about the proxy settings](#using-configcat-behind-a-proxy).                                                                                                                                                                                                                |                         |
| `dataGovernance`   | Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `DataGovernance.Global`, `DataGovernance.EuOnly`. | `DataGovernance.Global` |
| `cache`            | Custom [`IConfigCatCache`](https://github.com/configcat/common-js/blob/master/src/ConfigCatCache.ts) implementation for caching the downloaded config.                                                                                                                     | [`InMemoryConfigCache`](https://github.com/configcat/common-js/blob/master/src/ConfigCatCache.ts) |
| `flagOverrides`    | Local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides).                                                                                                                                                                                                    | -                       |
| `defaultUser`      | Sets the default user. [More about default user](#default-user).                                                                                                                                                                                                                                 | `undefined` (none)      |
| `offline`          | Determines whether the client should be initialized to offline mode. [More about offline mode](#online--offline-mode).                                                                                                                                                                           | `false`                 |

Options also include a property named `setupHook`, which you can use to subscribe to the hooks (events) at the time of initialization. [More about hooks](#hooks).

For example:

```js
const configCatClient = configcat.getClient(
  '#YOUR-SDK-KEY#',
  configcat.PollingMode.AutoPoll,
  {
    setupHooks: (hooks) =>
      hooks.on('clientReady', () => console.log('Client is ready!')),
  },
);
```

:::info
You can acquire singleton client instances for your SDK keys using the `configcat.getClient(sdkKey: "<sdkKey>")` factory function.
(However, please keep in mind that subsequent calls to `getClient()` with the _same SDK Key_ return a _shared_ client instance, which was set up by the first call.)

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
  'keyOfMyFeatureFlag', // Setting Key
  false, // Default value
  new configcat.User('#UNIQUE-USER-IDENTIFIER#'), // Optional User Object
);
```

or

```js
configCatClient
  .getValueAsync(
    'keyOfMyFeatureFlag', // Setting Key
    false, // Default value
    new configcat.User('#UNIQUE-USER-IDENTIFIER#'), // Optional User Object
  )
  .then((value) => {
    console.log(value);
  });
```

:::caution
It is important to provide an argument for the `defaultValue` parameter that matches the type of the feature flag or setting you are evaluating.
Please refer to the following table for the corresponding types.
:::

<div id="setting-type-mapping"></div>

| Setting Kind   | `typeof defaultValue` |
| -------------- | ----------------------|
| On/Off Toggle  | `boolean`             |
| Text           | `string`              |
| Whole Number   | `number`              |
| Decimal Number | `number`              |

In addition to the types mentioned above, you also have the option to provide `null` or `undefined` for the `defaultValue` parameter regardless of the setting kind.
However, if you do so, the return type of the `getValue` method will be
* `boolean | string | number | null` when `defaultValue` is `null` or
* `boolean | string | number | undefined` when `defaultValue` is `undefined`.

This is because in these cases the exact return type cannot be determined at compile-time as the TypeScript compiler has no information about the setting type.

It's important to note that providing any other type for the `defaultValue` parameter will result in a `TypeError`.

If you specify an allowed type but it mismatches the setting kind, an error message will be logged and `defaultValue` will be returned.

## Anatomy of `getValueDetailsAsync()`

`getValueDetailsAsync()` is similar to `getValueAsync()` but instead of returning the evaluated value only, it provides more detailed information about the evaluation result.

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** The key of a specific setting or feature flag. Set on _ConfigCat Dashboard_ for each setting.  |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```js
const details = await configCatClient.getValueDetailsAsync(
  'keyOfMyFeatureFlag', // Setting Key
  false, // Default value
  new configcat.User('#UNIQUE-USER-IDENTIFIER#'), // Optional User Object
);
```

or

```js
configCatClient
  .getValueDetailsAsync(
    'keyOfMyFeatureFlag', // Setting Key
    false, // Default value
    new configcat.User('#UNIQUE-USER-IDENTIFIER#'), // Optional User Object
  )
  .then((details) => {
    console.log(details);
  });
```

:::caution
It is important to provide an argument for the `defaultValue` parameter that matches the type of the feature flag or setting you are evaluating.
Please refer to [this table](#setting-type-mapping) for the corresponding types.
:::

The `details` result contains the following information:

| Field                             | Type                            | Description                                                                                 |
| --------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------- |
| `key`                             | `string`                        | The key of the evaluated feature flag or setting.                                           |
| `value`                           | `boolean` / `string` / `number` | The evaluated value of the feature flag or setting.                                         |
| `user`                            | `User`                          | The user object used for the evaluation.                                                    |
| `isDefaultValue`                  | `boolean`                       | True when the default value passed to `getValueDetailsAsync()` is returned due to an error. |
| `errorMessage`                    | `string`                        | In case of an error, this field contains the error message.                                 |
| `errorException`                  | `any`                           | In case of an error, this field contains the related exception object (if any).             |
| `matchedEvaluationRule`           | `RolloutRule`                   | If the evaluation was based on a targeting rule, this field contains that specific rule.    |
| `matchedEvaluationPercentageRule` | `RolloutPercentageItem`         | If the evaluation was based on a percentage rule, this field contains that specific rule.   |
| `fetchTime`                       | `Date`                          | The last download time (UTC) of the current config.                                         |

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
  },
);
```

### Default user

It's possible to set a default user object that will be used on feature flag and setting evaluation. It can be useful when your application has a single user only or rarely switches users.

You can set the default user object either on SDK initialization:

```js
const configCatClient = configcat.getClient(
  '#YOUR-SDK-KEY#',
  configcat.PollingMode.AutoPoll,
  {
    defaultUser: new configcat.User('john@example.com'),
  },
);
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
const value = await configCatClient.getValueAsync('keyOfMyFeatureFlag', false);
```

When a user object parameter is passed to the evaluation methods, it takes precedence over the default user.

```js
const user = new configcat.User('john@example.com');
configCatClient.setDefaultUser(user);

const otherUser = new configcat.User('brian@example.com');

// otherUser will be used in the evaluation process.
const value = await configCatClient.getValueAsync('keyOfMyFeatureFlag', false, otherUser);
```

You can also remove the default user by doing the following:

```js
configCatClient.clearDefaultUser();
```

## Polling Modes

The _ConfigCat SDK_ supports 3 different polling mechanisms to acquire the setting values from _ConfigCat_. After latest setting values are downloaded, they are stored in the local cache then all `getValueAsync()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.
[More about polling modes.](/advanced/caching/)

### Auto polling (default)

The _ConfigCat SDK_ downloads the latest values and stores them automatically every 60 seconds.

Use the `pollIntervalSeconds` option parameter to change the polling interval.

```js
const configCatClient = configcat.getClient(
  '#YOUR-SDK-KEY#',
  configcat.PollingMode.AutoPoll,
  {
    pollIntervalSeconds: 95,
  },
);
```

Available options (in addition to the [common ones](#creating-the-configcat-client)):

| Option Parameter         | Description                                                                                         | Default |
| ------------------------ | --------------------------------------------------------------------------------------------------- | ------- |
| `pollIntervalSeconds`    | Polling interval in seconds.                                                                        | 60s     |
| `maxInitWaitTimeSeconds` | Maximum waiting time between the client initialization and the first config acquisition in seconds. | 5s      |

### Lazy loading

When calling `getValueAsync()` the _ConfigCat SDK_ downloads the latest setting values if they are not present or expired in the cache. In this case `getValueAsync()` will return the setting value after the cache is updated.

Use `cacheTimeToLiveSeconds` option parameter to set cache lifetime.

```js
const configCatClient = configcat.getClient(
  '#YOUR-SDK-KEY#',
  configcat.PollingMode.LazyLoad,
  {
    cacheTimeToLiveSeconds: 600,
  },
);
```

Available options (in addition to the [common ones](#creating-the-configcat-client)):

| Option Parameter         | Description           | Default |
| ------------------------ | ----------------------| ------- |
| `cacheTimeToLiveSeconds` | Cache TTL in seconds. | 60s     |

### Manual polling

Manual polling gives you full control over when the config JSON (with the setting values) is downloaded. _ConfigCat SDK_ will not update them automatically. Calling `forceRefreshAsync()` is your application's responsibility.

```js
const configCatClient = configcat.getClient(
  '#YOUR-SDK-KEY#',
  configcat.PollingMode.ManualPoll,
);

await configCatClient.forceRefreshAsync();
let value = await configCatClient.getValueAsync('keyOfMyTextSetting', 'my default value');
console.log(value);
```

> `getValueAsync()` returns `defaultValue` if the cache is empty. Call `forceRefreshAsync()` to update the cache.

```js
const configCatClient = configcat.getClient(
  '#YOUR-SDK-KEY#',
  configcat.PollingMode.ManualPoll,
);

let value = await configCatClient.getValueAsync('keyOfMyTextSetting', 'my default value');
console.log(value); // console: "my default value"

await configCatClient.forceRefreshAsync();
value = await configCatClient.getValueAsync('keyOfMyTextSetting', 'my default value');
console.log(value);
```

## Hooks

The SDK provides several hooks (events), by means of which you can get notified of its actions.
You can subscribe to the following events emitted by the client:

- `clientReady`: This event is emitted when the SDK reaches the ready state. If the SDK is set up to use lazy load or manual polling, it's considered ready right after instantiation.
  If auto polling is used, the ready state is reached when the SDK has a valid config JSON loaded into memory either from cache or from HTTP. If the config couldn't be loaded neither from cache nor from HTTP, the `clientReady` event fires when the auto polling's `MaxInitWaitTime` has passed.
- `configChanged`: This event is emitted first when the SDK loads a valid config JSON into memory from cache, then each time afterwards when a config JSON with changed content is downloaded via HTTP.
- `flagEvaluated`: This event is emitted each time when the SDK evaluates a feature flag or setting. The event provides the same evaluation details that you would get from [`getValueDetailsAsync()`](#anatomy-of-getvaluedetailsasync).
- `clientError`: This event is emitted when an error occurs within the _ConfigCat SDK_.

You can subscribe to these events either on initialization:

```js
const configCatClient = configcat.getClient(
  '#YOUR-SDK-KEY#',
  configcat.PollingMode.ManualPoll,
  {
    setupHooks: (hooks) =>
      hooks.on('flagEvaluated', () => {
        /* handle the event */
      }),
  },
);
```

...or directly on the `ConfigCatClient` instance:

```js
configCatClient.on('flagEvaluated', () => {
  /* handle the event */
});
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

Using the `configCatClient.isOffline` property you can check whether the SDK is in offline mode.

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local only** (`OverrideBehaviour.LocalOnly`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour.LocalOverRemote`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour.RemoteOverLocal`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can set up the SDK to load your feature flag & setting overrides from a `{ [name: string]: any }` map.

```js
const configCatClient = configcat.getClient(
  '#YOUR-SDK-KEY#',
  configcat.PollingMode.AutoPoll,
  {
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
  },
);
```

## Logging

### Setting log levels

```js
const logger = configcat.createConsoleLogger(configcat.LogLevel.Info); // Setting log level to Info

const configCatClient = configcat.getClient(
  '#YOUR-SDK-KEY#',
  configcat.PollingMode.AutoPoll,
  {
    logger: logger,
  },
);
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
ConfigCat - INFO - [5000] Evaluate 'isPOCFeatureEnabled'
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
settingValues.forEach((details) => console.log(details));

// invoke with user object
const userObject = new configcat.User('john@example.com');

settingValues = await configCatClient.getAllValueDetailsAsync(userObject);
settingValues.forEach((details) => console.log(details));
```

## Using ConfigCat behind a proxy

Provide your own proxy server settings (proxy server/port) by adding a `proxy` option parameter when creating the ConfigCat client.

```js
const options = { pollIntervalSeconds: 2, proxy: 'http://192.168.1.1:8080' };

const configCatClient = configcat.getClient(
  '#YOUR-SDK-KEY#',
  configcat.PollingMode.AutoPoll,
  options,
);
```

## Using custom cache implementation

The _ConfigCat SDK_ stores the downloaded config data in a local cache to minimize network traffic and enhance client performance.
If you prefer to use your own cache solution, such as an external or distributed cache in your system,
you can implement the [`IConfigCatCache`](https://github.com/configcat/common-js/blob/master/src/ConfigCatCache.ts) interface
and set the `cache` property in the options passed to `getClient`.
This allows you to seamlessly integrate ConfigCat with your existing caching infrastructure.

```ts
class MyCustomCache implements IConfigCatCache {
  set(key: string, value: string): Promise<void> | void {
    // insert your cache write logic here
  }

  get(key: string): Promise<string | null | undefined> | string | null | undefined {
    // insert your cache read logic here
  }
}
```

or

```js
function MyCustomCache() { }

MyCustomCache.prototype.set = function (key, value) {
  // insert your cache write logic here
};
MyCustomCache.prototype.get = function (key) {
  // insert your cache read logic here
};
```

then

```js
// set the `MyCustomCache` implementation on creating the client instance

const configCatClient = configcat.getClient(
  '#YOUR-SDK-KEY#',
  configcat.PollingMode.AutoPoll,
  {
    cache: new MyCustomCache(),
  },
);
```

> In some cases (eg: fs) you may have to use [promisify](https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original) to create promises from callback-style functions.

[See implementation of Redis cache.](https://github.com/configcat/node-sdk/tree/master/samples/customcache)

:::info
The Node.js SDK supports *shared caching*. You can read more about this feature and the required minimum SDK versions [here](/docs/advanced/caching/#shared-cache).
:::

## Sample Application

- [Sample Console App](https://github.com/configcat/node-sdk/blob/master/samples/console)
- [Sample Console App with ECMAScript module system](https://github.com/configcat/node-sdk/blob/master/samples/console-esm)
- [Sample Console App with custom cache](https://github.com/configcat/node-sdk/tree/master/samples/customcache)

## Guides

See the guides on how to use ConfigCat's Node SDK with the following libraries and frameworks:

- <a href="https://configcat.com/blog/2022/08/19/how-to-use-feature-flags-in-nestjs/" target="_blank">NestJS</a>
- <a href="https://configcat.com/blog/2022/09/02/how-to-use-feature-flag-in-expressjs/" target="_blank">Express</a>

## Look under the hood

- [ConfigCat Node.js SDK on GitHub](https://github.com/configcat/node-sdk)
- [ConfigCat's Node.js SDK in NPM](https://www.npmjs.com/package/configcat-node)
