---
id: ios
title: iOS (Swift) SDK Reference
description: ConfigCat iOS (Swift) SDK Reference. This is a step-by-step guide on how to use feature flags in your iOS mobile application.
---
[![Star on GitHub](https://img.shields.io/github/stars/configcat/swift-sdk.svg?style=social)](https://github.com/configcat/swift-sdk/stargazers)
[![Build Status](https://github.com/configcat/swift-sdk/actions/workflows/swift-ci.yml/badge.svg?branch=master)](https://github.com/configcat/swift-sdk/actions/workflows/swift-ci.yml)
[![Coverage Status](https://img.shields.io/codecov/c/github/ConfigCat/swift-sdk.svg)](https://codecov.io/gh/ConfigCat/swift-sdk)
[![CocoaPods](https://img.shields.io/cocoapods/v/ConfigCat.svg)](https://cocoapods.org/pods/ConfigCat)
[![Carthage compatible](https://img.shields.io/badge/Carthage-compatible-4BC51D.svg?style=flat)](https://github.com/Carthage/Carthage)
[![Supported Platforms](https://img.shields.io/cocoapods/p/ConfigCat.svg?style=flat)](https://configcat.com/docs/sdk-reference/ios/)

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
        from: "9.1.0"
    )
]
```

### 2. Import the ConfigCat SDK:
```swift
import ConfigCat
 ```
### 3. Create the *ConfigCat* client with your *SDK Key*
```swift
let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#")
```
### 4. Get your setting value
```swift
client.getValue(for: "isMyAwesomeFeatureEnabled", defaultValue: false) { isMyAwesomeFeatureEnabled in
    if isMyAwesomeFeatureEnabled {
        doTheNewThing()
    } else {
        doTheOldThing()
    }
}

// Or with async/await
let isMyAwesomeFeatureEnabled = await client.getValue(for: "isMyAwesomeFeatureEnabled", defaultValue: false)
if isMyAwesomeFeatureEnabled {
    doTheNewThing()
} else {
    doTheOldThing()
}
```

### 5. Close ConfigCat client​
You can safely shut down all clients at once or individually and release all associated resources on application exit.

```swift
ConfigCatClient.closeAll() // closes all clients

client.close() // closes the specific client
```

## Creating the *ConfigCat Client*
*ConfigCat Client* is responsible for:
- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`ConfigCatClient.get(sdkKey: <sdkKey>)` returns a client with default options.

| Arguments                          | Type                      | Description                    |
| ---------------------------------- | ------------------------- | ------------------------------ |
| `dataGovernance`                   | `DataGovernance`          | Optional, defaults to `global`. Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `global`, `euOnly`. |
| `configCache`                      | `ConfigCache?`            | Optional, sets a custom cache implementation for the client. [More about cache](#custom-cache). |
| `refreshMode`                      | `PollingMode?`            | Optional, sets the polling mode for the client. [More about polling modes](#polling-modes). |
| `sessionConfiguration`             | `URLSessionConfiguration` | Optional, sets a custom `URLSessionConfiguration` used by the HTTP calls. |
| `baseUrl`                          | `String`                  | Optional, sets the CDN base url (forward proxy, dedicated subscription) from where the sdk will download the config.json. |
| `flagOverrides`                    | `OverrideDataSource?`     | Optional, configures local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides). |
| `logLevel`                         | `LogLevel`                | Optional, sets the internal log level. [More about logging.](#logging). |
| `defaultUser`                      | `ConfigCatUser?`          | Optional, sets the default user. [More about default user.](#default-user). |
| `hooks`                            | `Hooks`                   | Optional, used to subscribe events that the SDK sends in specific scenarios. [More about hooks](#hooks). |

```swift
let options = ClientOptions.default
options.refreshMode = PollingModes.manualPoll()
options.logLevel = .info
let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#", options: options)
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
| `completion`   | **REQUIRED.** Callback function to call, when the result is ready.                                           |
```swift
client.getValue(
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

// Or with async/await
let isMyAwesomeFeatureEnabled = await client.getValue(
    for: "keyOfMySetting", // Setting Key
    defaultValue: false, // Default value
    user: ConfigCatUser(identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92") // Optional User Object

if isMyAwesomeFeatureEnabled {
    doTheNewThing()
} else {
    doTheOldThing()
}
```

## Anatomy of `getValueDetails()`
| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```swift
client.getValueDetails(
    for: "keyOfMySetting", // Setting Key
    defaultValue: false, // Default value
    user: ConfigCatUser(identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92") // Optional User Object
) { details in
    // Use the details result
}

// Or with async/await
let details = await client.getValueDetails(
    for: "keyOfMySetting", // Setting Key
    defaultValue: false, // Default value
    user: ConfigCatUser(identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92") // Optional User Object
```
The details result contains the following information:

| Field                                     | Type      | Description                                                                              |
| ----------------------------------------- | --------- | ---------------------------------------------------------------------------------------- |
| `value`                                   | `Bool` / `String` / `Int` / `Double` | The evaluated value of the feature flag or setting.           |
| `key`                                     | `String`  | The key of the evaluated feature flag or setting.                                        |
| `isDefaultValue`                          | `Bool`    | True when the default value passed to getValueDetails() is returned due to an error.     |
| `error`                                   | `String?` | In case of an error, this field contains the error message.                              |
| `user`                                    | `ConfigCatUser?`  | The user object that was used for evaluation.                                    |
| `matchedEvaluationPercentageRule`         | `PercentageRule?` | If the evaluation was based on a percentage rule, this field contains that specific rule. |
| `matchedEvaluationRule`                   | `RolloutRule?` | If the evaluation was based on a targeting rule, this field contains that specific rule. |
| `fetchTime`                               | `Date`    | The last download time of the current config.                                            |


## User Object
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

### Default user
There's an option to set a default user object that will be used at feature flag and setting evaluation. It can be useful when your application has a single user only, or rarely switches users.

You can set the default user object either on SDK initialization:
```swift
let options = ClientOptions.default
options.defaultUser = ConfigCatUser(identifier: "john@example.com")

let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#", options: options)
```

or with the `setDefaultUser()` method of the ConfigCat client.
```swift
client.setDefaultUser(user: ConfigCatUser(identifier: "john@example.com"))
```

Whenever the `getValue()`, `getValueDetails()`, `getAllValues()`, or `getAllVariationIds()` methods are called without an explicit user object parameter, the SDK will automatically use the default user as a user object.

```swift
let user = ConfigCatUser(identifier: "john@example.com")
client.setDefaultUser(user)

// The default user will be used at the evaluation process.
let value = await client.getValue(for: 'keyOfMySetting', defaultValue: false)
```

When the user object parameter is specified on the requesting method, it takes precedence over the default user.

```swift
let user = ConfigCatUser(identifier: "john@example.com")
client.setDefaultUser(user)

let otherUser = ConfigCatUser(identifier: "brian@example.com")

// otherUser will be used at the evaluation process.
let value = await client.getValue(for: 'keyOfMySetting', defaultValue: false, user: otherUser)
```

For deleting the default user, you can do the following:
```swift
client.clearDefaultUser()
```


## `getAllKeys()`
You can get all the setting keys from your config.json by calling the `getAllKeys()` method of the `ConfigCatClient`.

```swift
let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#")

// Completion callback
client.getAllKeys() { keys in 
    // use keys
}

// Async/await
let keys = await client.getAllKeys()
```

## `getAllValues()`

Evaluates and returns the values of all feature flags and settings. Passing a [User Object](#user-object) is optional.

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```swift
let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#")

// Completion callback
client.getAllValues(
    user: ConfigCatUser(identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92") // Optional User Object
) { allValues in
    // use allValues
}

// Async/await
let allValues = await client.getAllValues(
    user: ConfigCatUser(identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92") // Optional User Object
)
```

## Polling Modes
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all `getValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.  
[More about polling modes.](/advanced/caching/)

### Auto polling (default)
The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

Use the the `autoPollIntervalInSeconds` option parameter of the `PollingModes.autoPoll()` to change the polling interval.
```swift
let options = ClientOptions.default
options.refreshMode = PollingModes.autoPoll(autoPollIntervalInSeconds: 120 /* polling interval in seconds */)

let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#", options: options)
```

Available options:

| Option Parameter                    | Description                                                                                          | Default |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| `autoPollIntervalInSeconds`         | Polling interval.                                                                                    | 60      |
| `maxInitWaitTimeInSeconds`          | Maximum waiting time between the client initialization and the first config acquisition in secconds. | 5       |
| `onConfigChanged`                   | **DEPRECATED** Callback to get notified about changes.                                               | -       |

### Lazy loading
When calling `getValue()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

Use the `cacheRefreshIntervalInSeconds` option parameter of the `PollingModes.lazyLoad()` to set cache lifetime.
```swift
let options = ClientOptions.default
options.refreshMode = PollingModes.lazyLoad(cacheRefreshIntervalInSeconds: 120 /* the cache will expire in 120 seconds */)

let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#", options: options)
```

Available options:

| Option Parameter                | Description                  | Default |
| ------------------------------- | ---------------------------- | ------- |
| `cacheRefreshIntervalInSeconds` | Cache TTL.                   | 60      |

### Manual polling
Manual polling gives you full control over when the `config.json` (with the setting values) is downloaded. ConfigCat SDK will not update them automatically. Calling `refresh()` is your application's responsibility.
```swift
let options = ClientOptions.default
options.refreshMode = PollingModes.manualPoll()

let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#", options: options)

// Completion callback
client.forceRefresh() { _ in
    // The client uses the latest config.json
}

// Async/await
await client.forceRefresh()
```
> `getValue()` returns `defaultValue` if the cache is empty. Call `refresh()` to update the cache.

## Hooks

With the following hooks you can subscribe to particular events fired by the SDK:

- `onClientReady()`: This event is sent when the SDK reaches the ready state. If the SDK is configured with lazy load or manual polling it's considered ready right after instantiation.
If it's using auto polling, the ready state is reached when the SDK has a valid config.json loaded into memory either from cache or from HTTP. If the config couldn't be loaded neither from cache nor from HTTP the `onClientReady` event fires when the auto polling's `maxInitWaitTimeInSeconds` is reached.
- `onConfigChanged([String: Setting])`: This event is sent when the SDK loads a valid config.json into memory from cache, and each subsequent time when the loaded config.json changes via HTTP.
- `onFlagEvaluated(EvaluationDetails)`: This event is sent each time when the SDK evaluates a feature flag or setting. The event sends the same evaluation details that you would get from [`getValueDetails()`](#anatomy-of-getvaluedetails).
- `error(String)`: This event is sent when an error occurs within the ConfigCat SDK.

You can subscribe to these events either on SDK initialization: 
```swift
let options = ClientOptions.default
options.hooks.addOnFlagEvaluated { details in
    /* handle the event */
}

let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#", options: options)
```
or with the `hooks` property of the ConfigCat client:
```swift
client.hooks.addOnFlagEvaluated { details in
    /* handle the event */
}
```

## Online / Offline mode

In cases when you'd want to prevent the SDK from making HTTP calls, you can put it in offline mode:
```swift
client.setOffline();
```
In offline mode, the SDK won't initiate HTTP requests and will work only from its cache.

To put the SDK back in online mode, you can do the following:
```swift
client.setOnline();
```

> With `client.isOffline` you can check whether the SDK is in offline mode or not.

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local** (`OverrideBehaviour.localOnly`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

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

let options = ClientOptions.default
options.flagOverrides = LocalDictionaryDataSource(source: dictionary, behaviour: .localOnly)

let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#", options: options)
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
let options = ClientOptions.default
options.configCache = MyCustomCache()

let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#", options: options)
```

## Force refresh
Any time you want to refresh the cached config.json with the latest one, you can call the `forceRefresh()` method of the library, which will initiate a new fetch and will update the local cache.

## Using ConfigCat behind a proxy
Provide your own network credentials (username/password), and proxy server settings (proxy server/port) by adding a *ProxyDictionary* to the ConfigCat's `URLSessionConfiguration`.

```swift
let proxyHost = "127.0.0.1"
let proxyPort = 8080
let sessionConfiguration = sessionConfiguration.default
let proxyUser = "user"
let proxyPassword = "password" 
sessionConfiguration.connectionProxyDictionary = [
    kCFNetworkProxiesHTTPEnable: true,
    kCFNetworkProxiesHTTPProxy: proxyHost,
    kCFNetworkProxiesHTTPPort: proxyPort,
    kCFNetworkProxiesHTTPSEnable: true,
    kCFNetworkProxiesHTTPSProxy: proxyHost,
    kCFNetworkProxiesHTTPSPort: proxyPort,
    kCFProxyUsernameKey: proxyUser, // Optional
    kCFProxyPasswordKey: proxyPassword // Optional
]

let options = ClientOptions.default
options.sessionConfiguration = sessionConfiguration

let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#", options: options)
```

## Changing the default HTTP timeout 

Set the maximum wait time for a ConfigCat HTTP response by changing the *timeoutIntervalForRequest* of the ConfigCat's `URLSessionConfiguration`.
The default *timeoutIntervalForRequest* is 60 seconds.

```swift
let sessionConfiguration = URLSessionConfiguration.default
sessionConfiguration.timeoutIntervalForRequest = 10; // Timeout in seconds 

let options = ClientOptions.default
options.sessionConfiguration = sessionConfiguration

let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#", options: options)
```

## Logging
We are using the *Unified Logging System* in the *ConfigCat SDK* for logging. For more information about *Unified Logging* please visit
<a href="https://developer.apple.com/documentation/os/logging" target="_blank">Apple's developer page</a>
or check <a href="https://developer.apple.com/videos/play/wwdc2016/721" target="_blank">Session 721 - Unified Logging and Activity Tracing</a> from WWDC 2016.

### Log level
You can change the verbosity of the logs by passing a `logLevel` parameter to the ConfigCatClient's `init` function.
```swift
let options = ClientOptions.default
options.logLevel = .info
let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#", options: options)
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

## Sensitive information handling

The frontend/mobile SDKs are running in your users' browsers/devices. The SDK is downloading a [config.json](/requests/) file from ConfigCat's CDN servers. The URL path for this config.json file contains your SDK key, so the SDK key and the content of your config.json file (feature flag keys, feature flag values, targeting rules, % rules) can be visible to your users. 
This SDK key is read-only, it only allows downloading your config.json file, but nobody can make any changes with it in your ConfigCat account.

If you do not want to expose the SDK key or the content of the config.json file, we recommend using the SDK in your backend components only. You can always create a backend endpoint using the ConfigCat SDK that can evaluate feature flags for a specific user, and call that backend endpoint from your frontend/mobile applications.

Also, we recommend using [confidential targeting comparators](/advanced/targeting/#confidential-text-comparators) in the targeting rules of those feature flags that are used in the frontend/mobile SDKs.

## Sample App
Check out our Sample Application how they use the ConfigCat SDK
* <a href="https://github.com/configcat/swift-sdk/tree/master/samples/ios" target="_blank">iOS with auto polling and change listener</a>
