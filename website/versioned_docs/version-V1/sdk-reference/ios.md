---
id: ios
title: iOS (Swift) SDK Reference
description: ConfigCat iOS (Swift) SDK Reference. This is a step-by-step guide on how to use feature flags in your iOS mobile application.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
export const IosSchema = require('@site/src/schema-markup/sdk-reference/ios.json');

<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(IosSchema) }}></script>

[![Star on GitHub](https://img.shields.io/github/stars/configcat/swift-sdk.svg?style=social)](https://github.com/configcat/swift-sdk/stargazers)
[![Build Status](https://github.com/configcat/swift-sdk/actions/workflows/swift-ci.yml/badge.svg?branch=master)](https://github.com/configcat/swift-sdk/actions/workflows/swift-ci.yml)
[![Coverage Status](https://img.shields.io/codecov/c/github/ConfigCat/swift-sdk.svg)](https://codecov.io/gh/ConfigCat/swift-sdk)
[![CocoaPods](https://img.shields.io/cocoapods/v/ConfigCat.svg)](https://cocoapods.org/pods/ConfigCat)
[![Carthage compatible](https://img.shields.io/badge/Carthage-compatible-4BC51D.svg?style=flat)](https://github.com/Carthage/Carthage)
[![Supported Platforms](https://img.shields.io/cocoapods/p/ConfigCat.svg?style=flat)](/sdk-reference/ios/)

<a href="https://github.com/ConfigCat/swift-sdk" target="_blank">ConfigCat Swift SDK on GitHub</a>

## Getting Started:

### 1. Add the ConfigCat SDK to your project

<Tabs groupId="ios-install">
<TabItem value="CocoaPods" label="CocoaPods">

```ruby title="Podfile"
target '<YOUR TARGET>' do
pod 'ConfigCat'
end
```

Then, run the following command to install your dependencies:

```
pod install
```

</TabItem>
<TabItem value="Carthage" label="Carthage">

```swift title="Cartfile"
github "configcat/swift-sdk"
```

Then, run the carthage update command and then follow the Carthage integration steps to link the framework with your project.

</TabItem>
<TabItem value="Swift Package Manager" label="Swift Package Manager">

Add the SDK to your `Package.swift`.

```swift title="Package.swift"
dependencies: [
    .package(
        url: "https://github.com/configcat/swift-sdk",
        from: "10.0.0"
    )
]
```

</TabItem>
</Tabs>

### 2. Import the ConfigCat SDK:

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
import ConfigCat
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
@import ConfigCat;
```

</TabItem>
</Tabs>

### 3. Create the _ConfigCat_ client with your _SDK Key_

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#")
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatClient* client = [ConfigCatClient getWithSdkKey:@"#YOUR-SDK-KEY#"
                                                 options:NULL];
```

</TabItem>
</Tabs>

### 4. Get your setting value

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

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

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
[client getBoolValueFor:@"isMyAwesomeFeatureEnabled"
           defaultValue:false
                   user:NULL
             completion:^(BOOL isMyAwesomeFeatureEnabled) {
    if (isMyAwesomeFeatureEnabled) {
        // do the new thing
    } else {
        // do the old thing
    }
}];
```

</TabItem>
</Tabs>

### 5. Close ConfigCat client​

You can safely shut down all clients at once or individually and release all associated resources on application exit.

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
ConfigCatClient.closeAll() // closes all clients

client.close() // closes the specific client
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
[ConfigCatClient closeAll]; // closes all clients

[client close]; // closes the specific client
```

</TabItem>
</Tabs>

## Creating the _ConfigCat Client_

_ConfigCat Client_ is responsible for:

- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`ConfigCatClient.get(sdkKey: <sdkKey>)` returns a client with default options.

### Customizing the _ConfigCat Client_

To customize the SDK's behavior, you can pass an additional `(ConfigCatOptions) -> ()` parameter to the `get()` static
factory method where the `ConfigCatOptions` class is used to set up the _ConfigCat Client_.

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#") { options in
    options.pollingMode = PollingModes.manualPoll()
    options.logLevel = .info
}
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatClient* client = [ConfigCatClient getWithSdkKey:@"#YOUR-SDK-KEY#"
                                            configurator:^(ConfigCatOptions* options) {
    options.pollingMode = [PollingModes manualPoll];
    options.logLevel = LogLevelInfo;
}];
```

</TabItem>
</Tabs>

These are the available options on the `ConfigCatOptions` class:

| Arguments              | Type                      | Description                                                                                                                                                                                                                                                                                        |
| ---------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dataGovernance`       | `DataGovernance`          | Optional, defaults to `global`. Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](/advanced/data-governance). Available options: `global`, `euOnly`. |
| `configCache`          | `ConfigCache?`            | Optional, sets a custom cache implementation for the client. [More about cache](#custom-cache).                                                                                                                                                                                                    |
| `pollingMode`          | `PollingMode`             | Optional, sets the polling mode for the client. [More about polling modes](#polling-modes).                                                                                                                                                                                                        |
| `sessionConfiguration` | `URLSessionConfiguration` | Optional, sets a custom `URLSessionConfiguration` used by the HTTP calls.                                                                                                                                                                                                                          |
| `baseUrl`              | `String`                  | Optional, sets the CDN base url (forward proxy, dedicated subscription) from where the sdk will download the config JSON.                                                                                                                                                                          |
| `flagOverrides`        | `OverrideDataSource?`     | Optional, sets the local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides).                                                                                                                                                                                   |
| `logLevel`             | `LogLevel`                | Optional, sets the internal log level. [More about logging.](#logging).                                                                                                                                                                                                                            |
| `defaultUser`          | `ConfigCatUser?`          | Optional, sets the default user. [More about default user](#default-user).                                                                                                                                                                                                                         |
| `offline`              | `Bool`                    | Optional, defaults to `false`. Indicates whether the SDK should be initialized in offline mode. [More about offline mode](#online--offline-mode).                                                                                                                                                  |
| `hooks`                | `Hooks`                   | Optional, used to subscribe events that the SDK sends in specific scenarios. [More about hooks](#hooks).                                                                                                                                                                                           |

:::caution
We strongly recommend you to use the `ConfigCatClient` as a Singleton object in your application.
The `ConfigCatClient.get(sdkKey: <sdkKey>)` static factory method constructs singleton client instances for your SDK keys.
These clients can be closed all at once with the `ConfigCatClient.closeAll()` method or individually with `client.close()`.
:::

## Anatomy of `getValue()`

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on _ConfigCat Dashboard_ for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](/advanced/targeting) |
| `completion`   | **REQUIRED.** Callback function to call, when the result is ready.                                           |

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
client.getValue(
    for: "keyOfMySetting", // Setting Key
    defaultValue: false, // Default value
    user: ConfigCatUser(identifier: "#UNIQUE-USER-IDENTIFIER#") // Optional User Object
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
    user: ConfigCatUser(identifier: "#UNIQUE-USER-IDENTIFIER#") // Optional User Object

if isMyAwesomeFeatureEnabled {
    doTheNewThing()
} else {
    doTheOldThing()
}
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatUser* user = [[ConfigCatUser alloc]initWithIdentifier:@"#UNIQUE-USER-IDENTIFIER#"
                                                         email:NULL country:NULL custom:NULL];

[client getBoolValueFor:@"keyOfMySetting" // Setting Key
           defaultValue:false // Default value
                   user:user // Optional User Object
             completion:^(BOOL isMyAwesomeFeatureEnabled) {
    if (isMyAwesomeFeatureEnabled) {
        // do the new thing
    } else {
        // do the old thing
    }
}];
```

</TabItem>
</Tabs>

## Anatomy of `getValueDetails()`

`getValueDetails()` is similar to `getValue()` but instead of returning the evaluated value only, it gives more detailed information about the evaluation result.

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on _ConfigCat Dashboard_ for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](/advanced/targeting) |

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
client.getValueDetails(
    for: "keyOfMySetting", // Setting Key
    defaultValue: false, // Default value
    user: ConfigCatUser(identifier: "#UNIQUE-USER-IDENTIFIER#") // Optional User Object
) { details in
    // Use the details result
}

// Or with async/await
let details = await client.getValueDetails(
    for: "keyOfMySetting", // Setting Key
    defaultValue: false, // Default value
    user: ConfigCatUser(identifier: "#UNIQUE-USER-IDENTIFIER#") // Optional User Object
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatUser* user = [[ConfigCatUser alloc]initWithIdentifier:@"#UNIQUE-USER-IDENTIFIER#"
                                                         email:NULL country:NULL custom:NULL];

[client getBoolValueDetailsFor:@"keyOfMySetting" // Setting Key
                  defaultValue:false // Default value
                          user:user // Optional User Object
                    completion:^(BoolEvaluationDetails* details) {
    // Use the details result
}];
```

</TabItem>
</Tabs>

The details result contains the following information:

| Field                             | Type                                 | Description                                                                               |
| --------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------- |
| `value`                           | `Bool` / `String` / `Int` / `Double` | The evaluated value of the feature flag or setting.                                       |
| `key`                             | `String`                             | The key of the evaluated feature flag or setting.                                         |
| `isDefaultValue`                  | `Bool`                               | True when the default value passed to getValueDetails() is returned due to an error.      |
| `error`                           | `String?`                            | In case of an error, this field contains the error message.                               |
| `user`                            | `ConfigCatUser?`                     | The User Object that was used for evaluation.                                             |
| `matchedEvaluationPercentageRule` | `PercentageRule?`                    | If the evaluation was based on a percentage rule, this field contains that specific rule. |
| `matchedEvaluationRule`           | `RolloutRule?`                       | If the evaluation was based on a Targeting Rule, this field contains that specific rule.  |
| `fetchTime`                       | `Date`                               | The last download time of the current config.                                             |

## Snapshots and synchronous feature flag evaluation

The _ConfigCat_ client provides only asynchronous methods for evaluating feature flags and settings
because these operations may involve network communication (downloading config data from the ConfigCat CDN servers),
which is necessarily an asynchronous operation.

However, there may be use cases where synchronous evaluation is preferable, thus, since `v10.0.0`, the Swift SDK provides a way
to synchronously evaluate feature flags and settings via **Snapshots**.

Using the `snapshot()` method, you can capture the current state of the _ConfigCat_ client (including the latest downloaded config data)
and you can use the resulting snapshot object to synchronously evaluate feature flags and settings based on the captured state:

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let snapshot = configCatClient.snapshot()

let isMyFeatureEnabled = snapshot.getValue(for: "isMyFeatureEnabled", defaultValue: false)
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatSnapshot* snapshot = [client snapshot];
        
BOOL isMyFeatureEnabled = [snapshot getBoolValueFor:@"isMyFeatureEnabled" 
                                       defaultValue:false
                                               user:NULL];
```

</TabItem>
</Tabs>

Snapshots are created from the actual state of the SDK; therefore it's crucial to know whether the SDK has valid feature flag data to work on. To determine whether it's safe to create snapshots, the SDK provides an `onClientReady` [hook](#hooks). It accepts a state enum parameter to give details about the SDK's initialization state.

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
client.hooks.addOnReady { state in
    // the state parameter tells what is the SDK's initialization state
}
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
[client.hooks addOnReadyWithHandler:^(enum ClientReadyState state) {
    // the state parameter tells what is the SDK's initialization state
}];
```

</TabItem>
</Tabs>

The possible `state` values:

- `noFlagData`: The SDK has no feature flag data to work on (it didn't get anything from the cache or from the network)
- `hasLocalOverrideFlagDataOnly`: The SDK was initialized with `localOnly` [flag overrides](#flag-overrides).
- `hasCachedFlagDataOnly`: The SDK has feature flag data only from the cache. This can happen when the SDK is configured with `manualPoll()` and there wasn't a `client.forceRefresh()` call yet. Another example could be an SDK configured with `autoPoll()`, but it can't reach the ConfigCat CDN so it falls back to the cache.
- `hasUpToDateFlagData`: The SDK is initialized with up-to-date feature flag data.

The SDK's state is also accessible via the `waitForReady()` awaitable method, which asynchronously waits for the `onClientReady` hook to fire and returns with the SDK's initialization state.

```swift
let state = await client.waitForReady()
```

## User Object

The [User Object](/advanced/user-object) is essential if you'd like to use ConfigCat's [Targeting](/advanced/targeting) feature.

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let user = ConfigCatUser(identifier: "#UNIQUE-USER-IDENTIFIER#")
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatUser* user = [[ConfigCatUser alloc]initWithIdentifier:@"#UNIQUE-USER-IDENTIFIER#"
                                                         email:NULL
                                                       country:NULL
                                                        custom:NULL];
```

</TabItem>
</Tabs>

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let user = ConfigCatUser(identifier: "john@example.com")
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatUser* user = [[ConfigCatUser alloc]initWithIdentifier:@"john@example.com"
                                                         email:NULL
                                                       country:NULL
                                                        custom:NULL];
```

</TabItem>
</Tabs>

| Arguments    | Description                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier` | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                         |
| `email`      | Optional parameter for easier Targeting Rule definitions.                                                                       |
| `country`    | Optional parameter for easier Targeting Rule definitions.                                                                       |
| `custom`     | Optional dictionary for custom attributes of a user for advanced Targeting Rule definitions. e.g. User role, Subscription type. |

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let user = ConfigCatUser(identifier: "#UNIQUE-USER-IDENTIFIER#",
    email: "john@example.com",
    country: "United Kingdom",
    custom: ["SubscriptionType":"Pro", "UserRole":"Admin"])
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatUser* user = [[ConfigCatUser alloc]initWithIdentifier:@"#UNIQUE-USER-IDENTIFIER#"
                                                         email:@"john@example.com"
                                                       country:@"United Kingdom"
                                                        custom:@{@"SubscriptionType": @"Pro", @"UserRole": @"Admin"}];
```

</TabItem>
</Tabs>

### Default user

There's an option to set a default User Object that will be used at feature flag and setting evaluation. It can be useful when your application has a single user only, or rarely switches users.

You can set the default User Object either on SDK initialization:

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#") { options in
    options.defaultUser = ConfigCatUser(identifier: "john@example.com")
}
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatClient* client = [ConfigCatClient getWithSdkKey:@"#YOUR-SDK-KEY#"
                                            configurator:^(ConfigCatOptions* options) {

    options.defaultUser = [[ConfigCatUser alloc]initWithIdentifier:@"john@example.com"
                                                             email:NULL
                                                           country:NULL
                                                            custom:NULL];
}];
```

</TabItem>
</Tabs>

or with the `setDefaultUser()` method of the ConfigCat client.

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
client.setDefaultUser(user: ConfigCatUser(identifier: "john@example.com"))
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
[client setDefaultUserWithUser:[[ConfigCatUser alloc]initWithIdentifier:@"john@example.com"
                                                                  email:NULL
                                                                country:NULL
                                                                 custom:NULL]];
```

</TabItem>
</Tabs>

Whenever the `getValue()`, `getValueDetails()`, `getAllValues()`, or `getAllVariationIds()` methods are called without an explicit `user` parameter, the SDK will automatically use the default user as a User Object.

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let user = ConfigCatUser(identifier: "john@example.com")
client.setDefaultUser(user)

// The default user will be used at the evaluation process.
let value = await client.getValue(for: "keyOfMySetting", defaultValue: false)
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatUser* user = [[ConfigCatUser alloc]initWithIdentifier:@"john@example.com"
                                                         email:NULL
                                                       country:NULL
                                                        custom:NULL];

[client setDefaultUserWithUser:user];

// The default user will be used at the evaluation process.
[client getBoolValueFor:@"keyOfMySetting"
           defaultValue:false 
                   user:NULL 
             completion:^(BOOL value) {
    // You can use the evaluation's result here.
}];
```

</TabItem>
</Tabs>

When the `user` parameter is specified on the requesting method, it takes precedence over the default user.

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
et user = ConfigCatUser(identifier: "john@example.com")
client.setDefaultUser(user)

let otherUser = ConfigCatUser(identifier: "brian@example.com")

// otherUser will be used at the evaluation process.
let value = await client.getValue(for: 'keyOfMySetting', defaultValue: false, user: otherUser)
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatUser* user = [[ConfigCatUser alloc]initWithIdentifier:@"john@example.com"
                                                         email:NULL
                                                       country:NULL
                                                        custom:NULL];

[client setDefaultUserWithUser:user];

ConfigCatUser* otherUser = [[ConfigCatUser alloc]initWithIdentifier:@"brian@example.com"
                                                              email:NULL
                                                            country:NULL
                                                             custom:NULL];

// otherUser will be used at the evaluation process.
[client getBoolValueFor:@"keyOfMySetting"
           defaultValue:false 
                   user:otherUser 
             completion:^(BOOL value) {
    // You can use the evaluation's result here.
}];
```

</TabItem>
</Tabs>

For deleting the default user, you can do the following:

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
client.clearDefaultUser()
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
[client clearDefaultUser];
```

</TabItem>
</Tabs>

## `getAllKeys()`

You can get all the setting keys from your config JSON by calling the `getAllKeys()` method of the `ConfigCatClient`.

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#")

// Completion callback
client.getAllKeys() { keys in
    // use keys
}

// Async/await
let keys = await client.getAllKeys()
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatClient* client = [ConfigCatClient getWithSdkKey:@"#YOUR-SDK-KEY#" options:NULL];

[client getAllKeysWithCompletion:^(NSArray<NSString*>* keys) {
    // use keys
}];
```

</TabItem>
</Tabs>

## `getAllValues()`

Evaluates and returns the values of all feature flags and settings. Passing a [User Object](#user-object) is optional.

| Parameters | Description                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| `user`     | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](/advanced/targeting) |

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#")
let user = ConfigCatUser(identifier: "#UNIQUE-USER-IDENTIFIER#")

// Completion callback
client.getAllValues(
    user:  user// Optional User Object
) { allValues in
    // use allValues
}

// Async/await
let allValues = await client.getAllValues(
    user: user // Optional User Object
)
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatClient* client = [ConfigCatClient getWithSdkKey:@"#YOUR-SDK-KEY#" options:NULL];

ConfigCatUser* user = [[ConfigCatUser alloc]initWithIdentifier:@"#UNIQUE-USER-IDENTIFIER#"
                                                         email:NULL
                                                       country:NULL
                                                        custom:NULL];

[client getAllValuesWithUser:user completion:^(NSDictionary<NSString*,id>* values) {
    // use values
}];
```

</TabItem>
</Tabs>

## Polling Modes

The _ConfigCat SDK_ supports 3 different polling mechanisms to acquire the setting values from _ConfigCat_. After latest setting values are downloaded, they are stored in the internal cache then all `getValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.  
[More about polling modes.](/advanced/caching/)

### Auto polling (default)

The _ConfigCat SDK_ downloads the latest values and stores them automatically every 60 seconds.

Use the the `autoPollIntervalInSeconds` option parameter of the `PollingModes.autoPoll()` to change the polling interval.

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#") { options in
    options.pollingMode = PollingModes.autoPoll(autoPollIntervalInSeconds: 120 /* polling interval in seconds */)
}
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatClient* client = [ConfigCatClient getWithSdkKey:@"#YOUR-SDK-KEY#"
                                            configurator:^(ConfigCatOptions* options) {

    options.pollingMode = [PollingModes autoPollWithAutoPollIntervalInSeconds:120 maxInitWaitTimeInSeconds:5];
}];
```

</TabItem>
</Tabs>

Available options:

| Option Parameter            | Description                                                                                          | Default |
| --------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| `autoPollIntervalInSeconds` | Polling interval.                                                                                    | 60      |
| `maxInitWaitTimeInSeconds`  | Maximum waiting time between the client initialization and the first config acquisition in secconds. | 5       |

### Lazy loading

When calling `getValue()` the _ConfigCat SDK_ downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

Use the `cacheRefreshIntervalInSeconds` option parameter of the `PollingModes.lazyLoad()` to set cache lifetime.

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#") { options in
    options.pollingMode = PollingModes.lazyLoad(cacheRefreshIntervalInSeconds: 120 /* the cache will expire in 120 seconds */)
}
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatClient* client = [ConfigCatClient getWithSdkKey:@"#YOUR-SDK-KEY#"
                                            configurator:^(ConfigCatOptions* options) {

    options.pollingMode = [PollingModes lazyLoadWithCacheRefreshIntervalInSeconds:120];
}];
```

</TabItem>
</Tabs>

Available options:

| Option Parameter                | Description | Default |
| ------------------------------- | ----------- | ------- |
| `cacheRefreshIntervalInSeconds` | Cache TTL.  | 60      |

### Manual polling

Manual polling gives you full control over when the `config JSON` (with the setting values) is downloaded. ConfigCat SDK will not update them automatically. Calling `refresh()` is your application's responsibility.

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#") { options in
    options.pollingMode = PollingModes.manualPoll()
}

// Completion callback
client.forceRefresh() { _ in
    // The client uses the latest config JSON
}

// Async/await
await client.forceRefresh()
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatClient* client = [ConfigCatClient getWithSdkKey:@"#YOUR-SDK-KEY#"
                                            configurator:^(ConfigCatOptions* options) {

    options.pollingMode = [PollingModes manualPoll];
}];

[client forceRefreshWithCompletion:^(RefreshResult* result) {
    // The client uses the latest config JSON
}];
```

</TabItem>
</Tabs>

> `getValue()` returns `defaultValue` if the cache is empty. Call `refresh()` to update the cache.

## Hooks

With the following hooks you can subscribe to particular events fired by the SDK:

- `onClientReady()`: This event is sent when the SDK reaches the ready state. If the SDK is initialized with lazy load or manual polling it's considered ready right after instantiation.
  If it's using auto polling, the ready state is reached when the SDK has a valid config JSON loaded into memory either from cache or from HTTP. If the config couldn't be loaded neither from cache nor from HTTP the `onClientReady` event fires when the auto polling's `maxInitWaitTimeInSeconds` is reached.

- `onConfigChanged([String: Setting])`: This event is sent when the SDK loads a valid config JSON into memory from cache, and each subsequent time when the loaded config JSON changes via HTTP.

- `onFlagEvaluated(EvaluationDetails)`: This event is sent each time when the SDK evaluates a feature flag or setting. The event sends the same evaluation details that you would get from [`getValueDetails()`](#anatomy-of-getvaluedetails).

- `onError(String)`: This event is sent when an error occurs within the ConfigCat SDK.

You can subscribe to these events either on SDK initialization:

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#") { options in
    options.hooks.addOnFlagEvaluated { details in
        /* handle the event */
    }
}
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatClient* client = [ConfigCatClient getWithSdkKey:@"#YOUR-SDK-KEY#"
                                            configurator:^(ConfigCatOptions* options) {

    [options.hooks addOnFlagEvaluatedWithHandler:^(EvaluationDetails* details) {
        /* handle the event */
    }];
}];
```

</TabItem>
</Tabs>

or with the `hooks` property of the ConfigCat client:

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
client.hooks.addOnFlagEvaluated { details in
    /* handle the event */
}
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
[client.hooks addOnFlagEvaluatedWithHandler:^(EvaluationDetails* details) {
    /* handle the event */
}];
```

</TabItem>
</Tabs>

## Online / Offline mode

In cases when you'd want to prevent the SDK from making HTTP calls, you can put it in offline mode:

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
client.setOffline()
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
[client setOffline];
```

</TabItem>
</Tabs>

In offline mode, the SDK won't initiate HTTP requests and will work only from its cache.

To put the SDK back in online mode, you can do the following:

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
client.setOnline()
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
[client setOnline];
```

</TabItem>
</Tabs>

> With `client.isOffline` you can check whether the SDK is in offline mode.

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local only** (`OverrideBehaviour.localOnly`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour.localOverRemote`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour.remoteOverLocal`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can set up the SDK to load your feature flag & setting overrides from a `[String: Any]` dictionary.

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let dictionary:[String: Any] = [
    "enabledFeature": true,
    "disabledFeature": false,
    "intSetting": 5,
    "doubleSetting": 3.14,
    "stringSetting": "test"
]

let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#") { options in
    options.flagOverrides = LocalDictionaryDataSource(source: dictionary, behaviour: .localOnly)
}
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
NSDictionary<NSString*,id>* dictionary = @{
    @"enabledFeature": @true,
    @"disabledFeature": @false,
    @"intSetting": @5,
    @"doubleSetting": @3.14,
    @"stringSetting": @"test"
};

ConfigCatClient* client = [ConfigCatClient getWithSdkKey:@"#YOUR-SDK-KEY#"
                                            configurator:^(ConfigCatOptions* options) {

    options.flagOverrides = [[LocalDictionaryDataSource alloc]initWithSource:dictionary
                                                                   behaviour:OverrideBehaviourLocalOnly];
}];
```

</TabItem>
</Tabs>

## Cache

The SDK uses `UserDefaults` as the default cache to store the downloaded `config JSON`.

If you want to turn off the default behavior, you can set the SDK's cache to `nil` or to your own cache implementation.

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#") { options in
    options.configCache = nil
}
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatClient* client = [ConfigCatClient getWithSdkKey:@"#YOUR-SDK-KEY#"
                                            configurator:^(ConfigCatOptions* options) {

    options.configCache = NULL;
}];
```

</TabItem>
</Tabs>

### Custom cache

You have the option to inject your custom cache implementation into the client. All you have to do is to inherit from the `ConfigCache` open class:

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
public class MyCustomCache : ConfigCache {
    public func read(key: String) throws -> String {
        // here you have to return with the cached value
    }

    public func write(key: String, value: String) throws {
        // here you have to store the new value in the cache
    }
}
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec title="MyCustomCache.h"
@import Foundation;
@import ConfigCat;

@interface MyCustomCache : NSObject <ConfigCache>

@end
```

```objectivec title="MyCustomCache.m"
#import "MyCustomCache.h"

@implementation MyCustomCache

- (NSString *)readFor:(NSString *)key error:(NSError * __autoreleasing *)error {
    // here you have to return with the cached value
}

- (BOOL)writeFor:(NSString *)key value:(NSString *)value error:(NSError * __autoreleasing *)error {
    // here you have to store the new value in the cache
}

@end
```

</TabItem>
</Tabs>

Then use your custom cache implementation:

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#") { options in
    options.configCache = MyCustomCache()
}
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatClient* client = [ConfigCatClient getWithSdkKey:@"#YOUR-SDK-KEY#"
                                            configurator:^(ConfigCatOptions* options) {

    options.configCache = [MyCustomCache alloc];
}];
```

</TabItem>
</Tabs>

:::info
The Swift SDK supports *shared caching*. You can read more about this feature and the required minimum SDK versions [here](/docs/advanced/caching/#shared-cache).
:::

## Force refresh

Call the `forceRefresh()` method on the client to download the latest config JSON and update the cache.

## Using ConfigCat behind a proxy

Provide your own network credentials (username/password), and proxy server settings (proxy server/port) by adding a _ProxyDictionary_ to the ConfigCat's `URLSessionConfiguration`.

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let proxyHost = "127.0.0.1"
let proxyPort = 8080
let proxyUser = "user"
let proxyPassword = "password"

let sessionConfiguration = URLSessionConfiguration.default
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

let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#") { options in
    options.sessionConfiguration = sessionConfiguration
}
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
NSString* proxyHost = @"127.0.0.1";
NSNumber* proxyPort = @8080;
NSString* proxyUser = @"user";
NSString* proxyPassword = @"password";

NSURLSessionConfiguration* sessionConfiguration = [NSURLSessionConfiguration defaultSessionConfiguration];
sessionConfiguration.connectionProxyDictionary = @{
    (NSString *)kCFNetworkProxiesHTTPEnable: @true,
    (NSString *)kCFNetworkProxiesHTTPProxy: proxyHost,
    (NSString *)kCFNetworkProxiesHTTPPort: proxyPort,
    (NSString *)kCFNetworkProxiesHTTPSEnable: @true,
    (NSString *)kCFNetworkProxiesHTTPSProxy: proxyHost,
    (NSString *)kCFNetworkProxiesHTTPSPort: proxyPort,
    (NSString *)kCFProxyUsernameKey: proxyUser, // Optional
    (NSString *)kCFProxyPasswordKey: proxyPassword // Optional
};

ConfigCatClient* client = [ConfigCatClient getWithSdkKey:@"#YOUR-SDK-KEY#"
                                            configurator:^(ConfigCatOptions* options) {

    options.sessionConfiguration = sessionConfiguration;
}];
```

</TabItem>
</Tabs>

## Changing the default HTTP timeout

Set the maximum wait time for a ConfigCat HTTP response by changing the _timeoutIntervalForRequest_ of the ConfigCat's `URLSessionConfiguration`.
The default _timeoutIntervalForRequest_ is 60 seconds.

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let sessionConfiguration = URLSessionConfiguration.default
sessionConfiguration.timeoutIntervalForRequest = 10 // Timeout in seconds

let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#") { options in
    options.sessionConfiguration = sessionConfiguration
}
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
NSURLSessionConfiguration* sessionConfiguration = [NSURLSessionConfiguration defaultSessionConfiguration];
sessionConfiguration.timeoutIntervalForRequest = 10; // Timeout in seconds

ConfigCatClient* client = [ConfigCatClient getWithSdkKey:@"#YOUR-SDK-KEY#"
                                            configurator:^(ConfigCatOptions* options) {

    options.sessionConfiguration = sessionConfiguration;
}];
```

</TabItem>
</Tabs>

## Logging

We are using the _Unified Logging System_ in the _ConfigCat SDK_ for logging. For more information about _Unified Logging_ please visit
<a href="https://developer.apple.com/documentation/os/logging" target="_blank">Apple's developer page</a> or check <a href="https://developer.apple.com/videos/play/wwdc2016/721" target="_blank">Session 721 - Unified Logging and Activity Tracing</a> from WWDC 2016.

### Log level

You can change the verbosity of the logs by setting the `logLevel` option.

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

```swift
let client = ConfigCatClient.get(sdkKey: "#YOUR-SDK-KEY#") { options in
    options.logLevel = .info
}
```

</TabItem>
<TabItem value="objectivec" label="Objective-C">

```objectivec
ConfigCatClient* client = [ConfigCatClient getWithSdkKey:@"#YOUR-SDK-KEY#"
                                            configurator:^(ConfigCatOptions* options) {

    options.logLevel = LogLevelInfo;
}];
```

</TabItem>
</Tabs>

Available log levels:

<Tabs groupId="ios-languages">
<TabItem value="swift" label="Swift">

| Level      | Description                                                                             |
| ---------- | --------------------------------------------------------------------------------------- |
| `.nolog`   | Turn the ConfigCat logging off.                                                         |
| `.error`   | Only error level events are logged.                                                     |
| `.warning` | Default. Errors and Warnings are logged.                                                |
| `.info`    | Errors, Warnings and feature flag evaluation is logged.                                 |
| `.debug`   | All of the above plus debug info is logged. Debug logs can be different for other SDKs. |

</TabItem>
<TabItem value="objectivec" label="Objective-C">

| Level             | Description                                                                             |
| ----------------- | --------------------------------------------------------------------------------------- |
| `LogLevelNolog`   | Turn the ConfigCat logging off.                                                         |
| `LogLevelError`   | Only error level events are logged.                                                     |
| `LogLevelWarning` | Default. Errors and Warnings are logged.                                                |
| `LogLevelInfo`    | Errors, Warnings and feature flag evaluation is logged.                                 |
| `LogLevelDebug`   | All of the above plus debug info is logged. Debug logs can be different for other SDKs. |

</TabItem>
</Tabs>

Info level logging helps to inspect the feature flag evaluation process.  
Example log entries:

```bash
[main] Evaluating getValue(isPOCFeatureEnabled).
User object: {
  "Identifier" : "#UNIQUE-USER-IDENTIFIER#",
  "Email" : "john@example.com"
}.
Evaluating rule: [Email:john@example.com] [CONTAINS] [@something.com] => no match
Evaluating rule: [Email:john@example.com] [CONTAINS] [@example.com] => match, returning: Optional(true)
```

## Sensitive information handling

The frontend/mobile SDKs are running in your users' browsers/devices. The SDK is downloading a [config JSON](/requests/) file from ConfigCat's CDN servers. The URL path for this config JSON file contains your SDK key, so the SDK key and the content of your config JSON file (feature flag keys, feature flag values, Targeting Rules, % rules) can be visible to your users.
This SDK key is read-only, it only allows downloading your config JSON file, but nobody can make any changes with it in your ConfigCat account.

If you do not want to expose the SDK key or the content of the config JSON file, we recommend using the SDK in your backend components only. You can always create a backend endpoint using the ConfigCat SDK that can evaluate feature flags for a specific user, and call that backend endpoint from your frontend/mobile applications.

Also, we recommend using [confidential targeting comparators](/advanced/targeting/#confidential-text-comparators) in the Targeting Rules of those feature flags that are used in the frontend/mobile SDKs.

## Sample App

Check out our Sample Application how they use the ConfigCat SDK

- <a href="https://github.com/configcat/swift-sdk/tree/master/samples/ios" target="_blank">iOS with auto polling and change listener</a>