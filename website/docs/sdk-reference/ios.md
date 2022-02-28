---
id: ios
title: iOS (Swift) SDK Reference
---
[![Star on GitHub](https://img.shields.io/github/stars/configcat/swift-sdk.svg?style=social)](https://github.com/configcat/swift-sdk/stargazers)
[![Build Status](https://github.com/configcat/swift-sdk/actions/workflows/swift-ci.yml/badge.svg?branch=master)](https://github.com/configcat/swift-sdk/actions/workflows/swift-ci.yml)
[![Coverage Status](https://img.shields.io/codecov/c/github/ConfigCat/swift-sdk.svg)](https://codecov.io/gh/ConfigCat/swift-sdk)
[![CocoaPods](https://img.shields.io/cocoapods/v/ConfigCat.svg)](https://cocoapods.org/pods/ConfigCat)
[![Carthage compatible](https://img.shields.io/badge/Carthage-compatible-4BC51D.svg?style=flat)](https://github.com/Carthage/Carthage)
[![Supported Platforms](https://img.shields.io/cocoapods/p/ConfigCat.svg?style=flat)](https://configcat.com/docs/sdk-reference/ios)

<a href="https://github.com/ConfigCat/swift-sdk" target="_blank">ConfigCat Swift SDK on GitHub</a>

## Getting Started:
### 1. Add the ConfigCat SDK to your project

**CocoaPods**
```
target '<YOUR TARGET>' do
pod 'ConfigCat'
end
```
Then, run the following command to install your dependencies:
```
pod install
```

**Carthage**
```
github "configcat/swift-sdk"
```

Then, run the carthage update command and then follow the Carthage integration steps to link the framework with your project.

**Swift Package Manager**

Add the SDK to your `Package.swift`.

```
dependencies: [
    .package(
        url: "https://github.com/configcat/swift-sdk", 
        from: "7.0.0"
    )
]
```

### 2. Import the ConfigCat SDK:
```swift
import ConfigCat
 ```
### 3. Create the *ConfigCat* client with your *SDK Key*
```swift
let client = ConfigCatClient(sdkKey: "<PLACE-YOUR-SDK-KEY-HERE>")
```
### 4. Get your setting value
```swift
let isMyAwesomeFeatureEnabled = client.getValue(for: "key-of-my-awesome-feature", defaultValue: false)
if(isMyAwesomeFeatureEnabled) {
    doTheNewThing()
} else {
    doTheOldThing()
}
```

## Creating the *ConfigCat Client*
*ConfigCat Client* is responsible for:
- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`ConfigCatClient(sdkKey: <sdkKey>)` returns a client with default options.

| Arguments                          | Type                    | Description                                                                                                                                                                                                                                                                                         |
| ---------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sdkKey`                           | String                  | **REQUIRED.** SDK Key to access your feature flags and configurations. Get it from *ConfigCat Dashboard*. |
| `dataGovernance`                   | DataGovernance          | Optional, defaults to `global`. Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `global`, `euOnly`. |
| `configCache`                      | ConfigCache?            | Optional, sets a custom cache implementation for the client. [See below](#custom-cache). |
| `refreshMode`                      | PollingMode?            | Optional, sets the polling mode for the client. [See below](#polling-modes). |
| `sessionConfiguration`             | URLSessionConfiguration | Optional, sets a custom `URLSessionConfiguration` used by the HTTP calls. |
| `baseUrl`                          | String                  | *Obsolete* Optional, sets the CDN base url (forward proxy, dedicated subscription) from where the sdk will download the configurations. |
| `flagOverrides`                    | OverrideDataSource?     | Optional, configures local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides). |
| `logLevel`                         | LogLevel                | Optional, sets the internal log level. [See below](#logging). |

:::caution
We strongly recommend you to use the `ConfigCatClient` as a Singleton object in your application.
If you want to use multiple SDK Keys in the same application, create only one `ConfigCatClient` per SDK Key.
:::

## Anatomy of `getValue()`
| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
```swift
let value = client.getValue(
    for: "keyOfMySetting", // Setting Key
    defaultValue: false, // Default value
    user: ConfigCatUser(identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92") // Optional User Object
)
```

## Anatomy of `getValueAsync()`
| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
| `completion`   | **REQUIRED.** Callback function to call, when the result is ready.                                           |

```swift
client.getValueAsync(
    for: "keyOfMySetting", // Setting Key
    defaultValue: false, // Default value
    user: ConfigCatUser(identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92") // Optional User Object
) { isMyAwesomeFeatureEnabled in
    if isMyAwesomeFeatureEnabled {
        doTheNewThing()
    } else {
        doTheOldThing()
    }
}
```

### User Object
The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature. 
```swift
let user = ConfigCatUser(identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92")   
```
```swift
let user = ConfigCatUser(identifier: "john@example.com")   
```
| Arguments    | Description                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier` | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                         |
| `email`      | Optional parameter for easier targeting rule definitions.                                                                       |
| `country`    | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom`     | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |
```swift
let user = ConfigCatUser(identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92",
    email: "john@example.com", 
    country: "United Kingdom", 
    custom: ["SubscriptionType":"Pro", "UserRole":"Admin"])
```

## Logging
We are using the *Unified Logging System* in the *ConfigCat SDK* for logging. For more information about *Unified Logging* please visit
<a href="https://developer.apple.com/documentation/os/logging" target="_blank">Apple's developer page</a>
or check <a href="https://developer.apple.com/videos/play/wwdc2016/721" target="_blank">Session 721 - Unified Logging and Activity Tracing</a> from WWDC 2016.

### Log level
You can change the verbosity of the logs by passing a `logLevel` parameter to the ConfigCatClient's `init` function.
```swift
let client = ConfigCatClient(sdkKey: "<PLACE-YOUR-SDK-KEY-HERE>", logLevel: .info)
```

Available log levels:

| Level      | Description                                                                             |
| ---------- | --------------------------------------------------------------------------------------- |
| `.nolog`   | Turn the ConfigCat logging off.                                                         |
| `.error`   | Only error level events are logged.                                                     |
| `.warning` | Default. Errors and Warnings are logged.                                                         |
| `.info`    | Errors, Warnings and feature flag evaluation is logged.                                 |
| `.debug`   | All of the above plus debug info is logged. Debug logs can be different for other SDKs. |


Info level logging helps to inspect the feature flag evaluation process.  
Example log entries:
```bash
[main] Evaluating getValue(isPOCFeatureEnabled).
User object: {
  "Identifier" : "435170f4-8a8b-4b67-a723-505ac7cdea92",
  "Email" : "john@example.com"
}.
Evaluating rule: [Email:john@example.com] [CONTAINS] [@something.com] => no match
Evaluating rule: [Email:john@example.com] [CONTAINS] [@example.com] => match, returning: Optional(true)
```

## `getAllKeys()`
You can get all the setting keys from your configuration by calling the `getAllKeys()` method of the `ConfigCatClient`.

```swift
let client = ConfigCatClient(sdkKey: "<PLACE-YOUR-SDK-KEY-HERE>")
let keys = client.getAllKeys()
```

## `getAllValues()`

Evaluates and returns the values of all feature flags and settings. Passing a [User Object](#user-object) is optional.
| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```swift
let client = ConfigCatClient(sdkKey: "<PLACE-YOUR-SDK-KEY-HERE>")
let allValues = client.getAllValues(
    user: ConfigCatUser(identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92") // Optional User Object
)
```

## Polling Modes
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all `getValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.

### Auto polling (default)
The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

Use the the `autoPollIntervalInSeconds` option parameter of the `PollingModes.autoPoll()` to change the polling interval.
```swift
let client = ConfigCatClient(
    sdkKey: "<PLACE-YOUR-SDK-KEY-HERE>", 
    refreshMode: PollingModes.autoPoll(autoPollIntervalInSeconds: 120 /* polling interval in seconds */)
)
```
Adding a callback to `onConfigChanged` option parameter will get you notified about changes.
```swift
let client = ConfigCatClient(
    sdkKey: "<PLACE-YOUR-SDK-KEY-HERE>", 
    refreshMode: PollingModes.autoPoll(
        autoPollIntervalInSeconds: 120, // polling interval in seconds
        onConfigChanged: {
            // here you can subscribe to configuration changes 
        }
    )
)
```
Available options:

| Option Parameter                    | Description                                                                                          | Default |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| `autoPollIntervalInSeconds`         | Polling interval.                                                                                    | 60      |
| `onConfigChanged`                   | Callback to get notified about changes.                                                              | -       |
| `maxInitWaitTimeInSeconds`          | Maximum waiting time between the client initialization and the first config acquisition in secconds. | 5       |

### Lazy loading
When calling `getValue()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

Use the `cacheRefreshIntervalInSeconds` option parameter of the `PollingModes.lazyLoad()` to set cache lifetime.
```swift
let client = ConfigCatClient(
    sdkKey: "<PLACE-YOUR-SDK-KEY-HERE>", 
    refreshMode: PollingModes.lazyLoad(cacheRefreshIntervalInSeconds: 120 /* the cache will expire in 120 seconds */)
)
```
Use the `asyncRefresh` option parameter of the `PollingModes.lazyLoad()` to define how do you want to handle the expiration of the cached configuration. If you choose asynchronous refresh then when a `getValue()` call is made while the cache is expired, the previous value will be returned immediately until the fetching of the new configuration is completed.
```swift
let client = ConfigCatClient(
    sdkKey: "<PLACE-YOUR-SDK-KEY-HERE>", 
    refreshMode: PollingModes.lazyLoad(
        cacheRefreshIntervalInSeconds: 120, // the cache will expire in 120 seconds
        useAsyncRefresh: true // the refresh will be executed asynchronously
    )
)
```
If you set the `asyncRefresh` to `false`, the refresh operation will be awaited until the fetching of the new configuration is completed.

Available options:

| Option Parameter                | Description                  | Default |
| ------------------------------- | ---------------------------- | ------- |
| `cacheRefreshIntervalInSeconds` | Cache TTL.                   | 60      |
| `useAsyncRefresh`               | Asynchronously refresh.      | false   |

### Manual polling
Manual polling gives you full control over when the `config.json` (with the setting values) is downloaded. ConfigCat SDK will not update them automatically. Calling `forceRefresh()` is your application's responsibility.
```swift
let client = ConfigCatClient(
    sdkKey: "<PLACE-YOUR-SDK-KEY-HERE>", 
    refreshMode: PollingModes.manualPoll()
)

client.forceRefresh()
```
> `getValue()` returns `defaultValue` if the cache is empty. Call `forceRefresh()` to update the cache.

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local/Offline mode** (`OverrideBehaviour.localOnly`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour.localOverRemote`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour.remoteOverLocal`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can set up the SDK to load your feature flag & setting overrides from a `[String: Any]` dictionary.

```swift
let dictionary:[String: Any] = [
    "enabledFeature": true,
    "disabledFeature": false,
    "intSetting": 5,
    "doubleSetting": 3.14,
    "stringSetting": "test"
]

let client = ConfigCatClient(
    sdkKey: "<PLACE-YOUR-SDK-KEY-HERE>",
    flagOverrides: LocalDictionaryDataSource(source: dictionary, behaviour: .localOnly)
)
```

## Custom cache
You have the option to inject your custom cache implementation into the client. All you have to do is to inherit from the `ConfigCache` open class:
```swift
public class MyCustomCache : ConfigCache {
    public func read(key: String) throws -> String {
        // here you have to return with the cached value
        // you can access the latest cached value in case 
        // of a failure like: super.inMemoryValue
    }
    
    public func write(key: String, value: String) throws {
        // here you have to store the new value in the cache
    }
}
```
Then use your custom cache implementation:
```swift
let client = ConfigCatClient(sdkKey: "<PLACE-YOUR-SDK-KEY-HERE>", configCache: MyCustomCache())
```

#### Force refresh
Any time you want to refresh the cached configuration with the latest one, you can call the `forceRefresh()` method of the library, which will initiate a new fetch and will update the local cache.

## Using ConfigCat behind a proxy
Provide your own network credentials (username/password), and proxy server settings (proxy server/port) by adding a *ProxyDictionary* to the ConfigCat's `URLSessionConfiguration`.

```swift
let proxyHost = "127.0.0.1"
let proxyPort = 8080
let configuration = URLSessionConfiguration.default
let proxyUser = "user"
let proxyPassword = "password" 
configuration.connectionProxyDictionary = [
    kCFNetworkProxiesHTTPEnable: true,
    kCFNetworkProxiesHTTPProxy: proxyHost,
    kCFNetworkProxiesHTTPPort: proxyPort,
    kCFNetworkProxiesHTTPSEnable: true,
    kCFNetworkProxiesHTTPSProxy: proxyHost,
    kCFNetworkProxiesHTTPSPort: proxyPort,
    kCFProxyUsernameKey: proxyUser, // Optional
    kCFProxyPasswordKey: proxyPassword // Optional
]

let client: ConfigCatClient = ConfigCatClient(sdkKey: sdkKey, sessionConfiguration: configuration)
```

## Changing the default HTTP timeout 

Set the maximum wait time for a ConfigCat HTTP response by changing the *timeoutIntervalForRequest* of the ConfigCat's `URLSessionConfiguration`.
The default *timeoutIntervalForRequest* is 60 seconds.

```swift
let configuration = URLSessionConfiguration.default
configuration.timeoutIntervalForRequest = 10; // Timeout in seconds 

let client: ConfigCatClient = ConfigCatClient(sdkKey: sdkKey, sessionConfiguration: configuration)
```

## Sample App
Check out our Sample Application how they use the ConfigCat SDK
* <a href="https://github.com/configcat/swift-sdk/tree/master/samples/ios" target="_blank">iOS with auto polling and change listener</a>
