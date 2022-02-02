---
id: dart
title: Dart (Flutter) SDK Reference
---

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
  configcat_client: ^1.0.0
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
ConfigCatClient.close(); // closes all clients

ConfigCatClient.close(client: client); // closes a specific client
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
These clients can be closed all at once or individually with the `ConfigCatClient.close()` method.
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

### User Object
The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature. 
```dart
final user = ConfigCatUser(identifier: '435170f4-8a8b-4b67-a723-505ac7cdea92');   
```
```dart
final user = ConfigCatUser(identifier: 'john@example.com');   
```

#### Customized user object creation:
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

## `getAllKeys()`
You can query the keys of each feature flag and setting with the `getAllKeys()` method.

```dart
final client = ConfigCatClient.get(sdkKey: '#YOUR-SDK-KEY#');
final keys = await client.getAllKeys();
```

## Polling Modes
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all `getValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.

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
Adding a callback to `configurationChangeListener` option parameter will get you notified about changes.
```dart
final client = ConfigCatClient.get(
    sdkKey: '<PLACE-YOUR-SDK-KEY-HERE>',
    options: ConfigCatOptions(
        mode: PollingMode.autoPoll(
            autoPollInterval: Duration(seconds: 100),
            onConfigChanged: () {
                // here you can subscribe to configuration changes 
            }
        ),
    )
);
```

Available options:

| Option Parameter        | Description                              | Default |
| ----------------------- | ---------------------------------------- | ------- |
| `autoPollInterval`      | Polling interval.                        | 60      |
| `maxInitWaitTime`       | Maximum waiting time between the client initialization and the first config acquisition in seconds. | 5       |
| `onConfigChanged`       | Callback to get notified about changes.  | -       |

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

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local/Offline mode** (`OverrideBehaviour.localOnly`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

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
