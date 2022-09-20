---
id: dart
title: Dart (Flutter) SDK Reference
description: ConfigCat Dart (Flutter) SDK Reference. This is a step-by-step guide on how to use feature flags in your Dart (Flutter) apps.
---

[![Star on GitHub](https://img.shields.io/github/stars/configcat/dart-sdk.svg?style=social)](https://github.com/configcat/dart-sdk/stargazers)
[![pub package](https://img.shields.io/pub/v/configcat_client.svg)](https://pub.dev/packages/configcat_client)
[![Dart CI](https://github.com/configcat/dart-sdk/actions/workflows/dart-ci.yml/badge.svg?branch=main)](https://github.com/configcat/dart-sdk/actions/workflows/dart-ci.yml)

<a href="https://github.com/ConfigCat/dart-sdk" target="_blank">ConfigCat Dart (Flutter) SDK on GitHub</a>

## Getting Started
### 1. Add the ConfigCat SDK to your project
With Dart:
```bash
dart pub add configcat_client
```
With Flutter:
```bash
flutter pub add configcat_client
```
Or put the following directly to your `pubspec.yml` and run `dart pub get` or `flutter pub get`.
```yaml
dependencies:
  configcat_client: ^1.1.0
```
### 2. Import the ConfigCat SDK
```dart
import 'package:configcat_client/configcat_client.dart';
```
### 3. Create the *ConfigCat* client with your *SDK Key*
```dart
final client = ConfigCatClient.get(sdkKey: '#YOUR-SDK-KEY#');
```
### 4. Get your setting value
```dart
final isMyAwesomeFeatureEnabled = await client.getValue(key: '<key-of-my-awesome-feature>', defaultValue: false);
if(isMyAwesomeFeatureEnabled) {
    doTheNewThing();
} else {
    doTheOldThing();
}
```

### 5. Close *ConfigCat* client​
You can safely shut down all clients at once or individually and release all associated resources on application exit.
```dart
ConfigCatClient.closeAll(); // closes all clients

client.close(); // closes the specific client
```

## Configuring the *ConfigCat Client*

*ConfigCat Client* is responsible for:
- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`ConfigCatClient.get(sdkKey: <sdkKey>)` returns a client with default options.

| Properties                  | Description |
| --------------------------- | ----------- |
| `dataGovernance`            | Optional, defaults to `global`. Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `global`, `euOnly`. |
| `baseUrl`                   | Optional, sets the CDN base url (forward proxy, dedicated subscription) from where the sdk will download the configurations. |
| `connectTimeout`            | Optional, sets the underlying <a href="https://github.com/flutterchina/dio" target="_blank">Dio</a> HTTP client's connect timeout. [More about the HTTP Client](#httpclient). |
| `receiveTimeout`            | Optional, sets the underlying <a href="https://github.com/flutterchina/dio" target="_blank">Dio</a> HTTP client's receive timeout. [More about the HTTP Client](#httpclient). |
| `sendTimeout`               | Optional, sets the underlying <a href="https://github.com/flutterchina/dio" target="_blank">Dio</a> HTTP client's send timeout. [More about the HTTP Client](#httpclient). |
| `cache`                     | Optional, sets a custom cache implementation for the client. [More about cache](#custom-cache). |
| `mode`                      | Optional, sets the polling mode for the client. [More about polling modes](#polling-modes). |
| `logger`                    | Optional, sets the internal logger and log level. [More about logging](#logging). |
| `override`                  | Optional, configures local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides). |
| `defaultUser`               | Optional, configures the default user. [More about default user](#default-user). |
| `hooks`                     | Optional, configures events that the SDK sends in specific scenarios. [More about hooks](#hooks). |

```dart
final client = ConfigCatClient.get(
    sdkKey: '#YOUR-SDK-KEY#',
    options: ConfigCatOptions(
        mode: PollingMode.manualPoll(),
        logger: ConfigCatLogger(level: LogLevel.info)
    )
);
```

:::caution
We strongly recommend you to use the `ConfigCatClient` as a Singleton object in your application.
The `ConfigCatClient` constructs singleton client instances for your SDK keys with its `ConfigCatClient.get(sdkKey: <sdkKey>)` static factory method.
These clients can be closed all at once with the `ConfigCatClient.closeAll()` method or individually with `client.close()`.
:::

## Anatomy of `getValue()`
| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
```dart
final value = await client.getValue(
    key: 'keyOfMySetting', 
    defaultValue: false,
    user: ConfigCatUser(identifier: '#USER-IDENTIFIER#'), // Optional User Object
);
```

## Anatomy of `getValueDetails()`

`getValueDetails()` is similar to `getValue()` but instead of returning only the evaluated value it gives more detailed information about the evaluation result.

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** The key of a specific setting or feature flag. Set on *ConfigCat Dashboard* for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
```dart
final details = await client.getValueDetails(
    key: 'keyOfMySetting', 
    defaultValue: false,
    user: ConfigCatUser(identifier: '#USER-IDENTIFIER#'), // Optional User Object
);

// Details holds the following information:
details.value;                              // The evaluated value of the feature flag or setting.
details.key;                                // The key of the evaluated feature flag or setting.
details.variationId;                        // The variation ID.
details.isDefaultValue;                     // True when the default value passed to getValueDetails() is returned due to an error.
details.error;                              // In case of an error this field will contain its message.
details.matchedEvaluationPercentageRule;    // When the evaluation was based on a percentage rule, this field will contain that specific rule.
details.matchedEvaluationRule;              // When the evaluation was based on an targeting rule, this field will contain that specific rule.
details.fetchTime;                          // The last download time of the current config.
```

## User Object
The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature. 
```dart
final user = ConfigCatUser(identifier: '435170f4-8a8b-4b67-a723-505ac7cdea92');   
```
```dart
final user = ConfigCatUser(identifier: 'john@example.com');   
```

### Customized user object creation:
| Argument      | Description                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier`  | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                         |
| `email`       | Optional parameter for easier targeting rule definitions.                                                                       |
| `country`     | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom`      | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |
```dart
final user = ConfigCatUser(
    identifier: '435170f4-8a8b-4b67-a723-505ac7cdea92',
    email: 'john@example.com',
    country: 'United Kingdom',
    custom: {
        'SubscriptionType': 'Pro', 
        'UserRole': 'Admin'
    }
);
```

### Default user

There's an option to set a default user object that will be used at feature flag and setting evaluation. It can be useful when your application has usually a single user only, or rarely switches users.

You can set the default user either on SDK initialization:

```dart
final client = ConfigCatClient.get(
    sdkKey: '#YOUR-SDK-KEY#',
    options: ConfigCatOptions(
        defaultUser: ConfigCatUser(identifier: 'john@example.com')
    )
);
```
or with the `setDefaultUser()` method of the ConfigCat client.
```dart
client.setDefaultUser(ConfigCatUser(identifier: 'john@example.com'));
```

If the default user is set, the SDK will use it's value every time when the `getValue()`, `getValueDetails()`, `getAllValues()`, or `getAllVariationIds()` methods are called without an other user object.

```dart
final user = ConfigCatUser(identifier: 'john@example.com');
client.setDefaultUser(user);

// The default user will be used at the evaluation process.
final value = await client.getValue(key: 'keyOfMySetting', defaultValue: false); 

```

When the user object parameter is specified on the requesting method, it takes precedence over the default user.

```dart
final user = ConfigCatUser(identifier: 'john@example.com');
client.setDefaultUser(user);

final otherUser = ConfigCatUser(identifier: 'brian@example.com');

// otherUser will be used at the evaluation process.
final value = await client.getValue(key: 'keyOfMySetting', defaultValue: false, user: otherUser); 

```

For deleting the default user, you can do the following:
```dart
client.clearDefaultUser();
```

## Polling Modes
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all `getValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.  
[More about polling modes.](/advanced/caching/)

### Auto polling (default)
The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

Use the the `autoPollInterval` option parameter of the `PollingMode.autoPoll()` to change the polling interval.
```dart
final client = ConfigCatClient.get(
    sdkKey: '<PLACE-YOUR-SDK-KEY-HERE>',
    options: ConfigCatOptions(
        mode: PollingMode.autoPoll(
            autoPollInterval: Duration(seconds: 100),
        ),
    )
);
```

Available options:

| Option Parameter        | Description                              | Default |
| ----------------------- | ---------------------------------------- | ------- |
| `autoPollInterval`      | Polling interval.                        | 60      |
| `maxInitWaitTime`       | Maximum waiting time between the client initialization and the first config acquisition in seconds. | 5       |

### Lazy Loading
When calling `getValue()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

Use the `cacheRefreshInterval` option parameter of the `PollingMode.lazyLoad()` to set cache lifetime.
```dart
final client = ConfigCatClient.get(
    sdkKey: '<PLACE-YOUR-SDK-KEY-HERE>',
    options: ConfigCatOptions(
        mode: PollingMode.lazyLoad(
            // the cache will expire in 100 seconds
            cacheRefreshInterval: Duration(seconds: 100), 
        ),
    )
);
```

Available options:

| Parameter                | Description                  | Default |
| ------------------------ | ---------------------------- | ------- |
| `cacheRefreshInterval`   | Cache TTL.                   | 60      |

### Manual Polling
Manual polling gives you full control over when the `config.json` (with the setting values) is downloaded. ConfigCat SDK will not update them automatically. Calling `forceRefresh()` is your application's responsibility.
```dart
final client = ConfigCatClient.get(
    sdkKey: '<PLACE-YOUR-SDK-KEY-HERE>',
    options: ConfigCatOptions(
        mode: PollingMode.manualPoll(),
    )
);

client.forceRefresh();
```
> `getValue()` returns `defaultValue` if the cache is empty. Call `forceRefresh()` to update the cache.

## Hooks

With the following hooks you can subscribe particular events sent by the SDK:

- `onClientReady()`: This event is sent when the SDK reaches the ready state. When the SDK is configured with lazy load or manual polling it's considered ready right after instantiation.
When it's using auto polling, the ready state is reached when the SDK has a valid configuration loaded into memory either from cache or from HTTP. When the config couldn't be loaded neither from cache nor from HTTP the `onClientReady` event fires when the auto polling's `maxInitWaitTime` is reached.
- `onConfigChanged(Map<string, Setting>)`: This event is sent when the SDK loads a valid configuration into memory from cache, and each subsequent time when the loaded configuration changes via HTTP.
- `onFlagEvaluated(EvaluationDetails)`: This event is sent each time when the SDK evaluates a feature flag or setting. The event sends the same evaluation details that you would get from [`getValueDetails()`](#anatomy-of-getvaluedetails).
- `error(String)`: This event is sent when an error occurs in the SDK's functioning.

You can subscribe to these events either on SDK initialization: 
```dart
final client = ConfigCatClient.get(
    sdkKey: '<PLACE-YOUR-SDK-KEY-HERE>',
    options: ConfigCatOptions(
        mode: PollingMode.manualPoll(),
        hooks: Hooks(
            onFlagEvaluated: (details) => /* handle the event */
        )
    )
);
```
or with the `hooks` property of the ConfigCat client:
```dart
client.hooks.addOnFlagEvaluated((details) => /* handle the event */);
```

## Online / Offline mode

In cases when you'd want to prevent the SDK from making HTTP calls, you can put it in offline mode:
```dart
client.setOffline();
```
In offline mode the SDK won't initiate HTTP requests and will work only from its cache.

To put the SDK back in online mode, you can do the following:
```dart
client.setOnline();
```

> With `client.isOffline()` you can check whether the SDK is in offline mode or not.

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local** (`OverrideBehaviour.localOnly`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour.localOverRemote`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour.remoteOverLocal`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can set up the SDK to load your feature flag & setting overrides from a `Map<String, Object>`.
```dart
final client = ConfigCatClient.get(
    sdkKey: 'localhost',
    options: ConfigCatOptions(
        override: FlagOverrides(
            dataSource: OverrideDataSource.map({
                'enabledFeature': true, 
                'disabledFeature': false,
                'intSetting': 5,
                'doubleSetting': 3.14,
                'stringSetting': 'test',
            }),
            behaviour: OverrideBehaviour.localOnly
        )
    )
);
```

## `getAllKeys()`
You can query the keys of each feature flag and setting with the `getAllKeys()` method.

```dart
final client = ConfigCatClient.get(sdkKey: '#YOUR-SDK-KEY#');
final keys = await client.getAllKeys();
```

## `getAllValues()`
Evaluates and returns the values of all feature flags and settings. Passing a User Object is optional.

```dart
final client = ConfigCatClient.get(sdkKey: '#YOUR-SDK-KEY#');
final settingValues = await client.getAllValues();

// invoke with user object
final user = ConfigCatUser(identifier: '435170f4-8a8b-4b67-a723-505ac7cdea92');   
final settingValuesTargeting = await client.getAllValues(user);
```

## Custom Cache
You have the option to inject your custom cache implementation into the client. All you have to do is to inherit from the `ConfigCatCache` abstract class:
```dart
class MyCustomCache extends ConfigCatCache {
    @override
    Future<String> read(String key) {
        // here you have to return with the cached value
    }

    @override
    Future<void> write(String key, String value) {
        // here you have to store the new value in the cache
    }
}
```
Then use your custom cache implementation:
```dart
final client = ConfigCatClient.get(
    sdkKey: '<PLACE-YOUR-SDK-KEY-HERE>',
    options: ConfigCatOptions(cache: MyCustomCache()));
```

## HttpClient
The ConfigCat SDK internally uses a <a href="https://github.com/flutterchina/dio" target="_blank">Dio HTTP client</a> instance to download the latest configuration over HTTP. You have the option to customize the internal HTTP client. 

### HTTP Timeout
You can set the maximum wait time for a ConfigCat HTTP response by using Dio's timeouts.
```dart
final client = ConfigCatClient.get(
    sdkKey: '<PLACE-YOUR-SDK-KEY-HERE>',
    options: ConfigCatOptions(
        connectTimeout: Duration(seconds: 10), // timeout for establishing a HTTP connection with the server
        sendTimeout: Duration(seconds: 10), // timeout for sending a HTTP request to the server
        receiveTimeout: Duration(seconds: 10), // timeout for reading the server's HTTP response
    )
);
```
Default timeout values:
- `connectTimeout`: 10 seconds
- `sendTimeout`: 20 seconds
- `receiveTimeout`: 20 seconds


### HTTP Proxy
If your application runs behind a proxy you can do the following:
```dart
import 'package:dio/adapter.dart';

(client.httpClient.httpClientAdapter as DefaultHttpClientAdapter)
    .onHttpClientCreate = (client) {
        client.findProxy = (uri) {
            return 'PROXY proxyHost:proxyPort';
        };
    };
```

## Force refresh
Any time you want to refresh the cached configuration with the latest one, you can call the `forceRefresh()` method of the library, which initiates a new download and updates the local cache.

## Logging
The default logger used by the SDK is the <a href="https://pub.dev/packages/logger" target="_blank">logger</a> package, but you can override it with your implementation via the `logger` client option. The custom implementation must satisfy the <a href="https://github.com/configcat/dart-sdk/blob/main/lib/src/log/logger.dart" target="_blank">Logger</a> abstract class.
```dart
final client = ConfigCatClient.get(
    sdkKey: '<PLACE-YOUR-SDK-KEY-HERE>',
    options: ConfigCatOptions(
        logger: ConfigCatLogger(internalLogger: MyCustomLogger()), 
    )
);
```

You can customize the internally used <a href="https://pub.dev/packages/logger" target="_blank">logger</a> instance.
```dart
import 'package:logger/logger.dart' as extlog;

final client = ConfigCatClient.get(
    sdkKey: '<PLACE-YOUR-SDK-KEY-HERE>',
    options: ConfigCatOptions(
        logger: ConfigCatLogger(
            internalLogger: DefaultLogger(internalLogger: extlog.Logger(/* customization of the logger package */))
        ), 
    )
);
```

You can change the verbosity of the logs by passing a `LogLevel` parameter to the `logger` option.
```dart
final client = ConfigCatClient.get(
    sdkKey: '<PLACE-YOUR-SDK-KEY-HERE>',
    options: ConfigCatOptions(
        logger: ConfigCatLogger(level: LogLevel.info), 
    )
);
```

Available log levels:

| Level      | Description                                                                             |
| ---------- | --------------------------------------------------------------------------------------- |
| `nothing`   | Turn the logging off.                                                                  |
| `error`    | Only error level events are logged.                                                     |
| `warning`  | Default. Errors and Warnings are logged.                                                |
| `info`     | Errors, Warnings and feature flag evaluation is logged.                                 |
| `debug`    | All of the above plus debug info is logged. Debug logs can be different for other SDKs. |

Info level logging helps to inspect how a feature flag was evaluated:
```bash
[I] TIME: 2022-01-20T18:22:02.313703 ConfigCat - Evaluating getValue(isPOCFeatureEnabled)
User object: {Identifier: 435170f4-8a8b-4b67-a723-505ac7cdea92, Email: john@example.com}
Evaluating rule: [Email:john@example.com] [CONTAINS] [@something.com] => no match
Evaluating rule: [Email:john@example.com] [CONTAINS] [@example.com] => match, returning: true
```

## Sample Apps
Check out our Sample Applications how they use the ConfigCat SDK
- <a href="https://github.com/configcat/dart-sdk/tree/main/example/lib" target="_blank">Console Application</a>
- <a href="https://github.com/configcat/dart-sdk/tree/main/example/flutter" target="_blank">Flutter Application</a>

## Look Under the Hood
- <a href="https://github.com/ConfigCat/dart-sdk" target="_blank">ConfigCat Dart (Flutter) SDK's repository on GitHub</a>
- <a href="https://pub.dev/packages/configcat_client" target="_blank">ConfigCat Dart (Flutter) SDK's pub.dev page</a>
