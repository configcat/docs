---
id: android
title: Android (Kotlin) SDK Reference
description: ConfigCat Android (Kotlin) SDK Reference. This is a step-by-step guide on how to use feature flags in your Android (Kotlin) application.
---
[![Star on GitHub](https://img.shields.io/github/stars/configcat/android-sdk.svg?style=social)](https://github.com/configcat/android-sdk/stargazers)
[![Android CI](https://github.com/configcat/android-sdk/actions/workflows/android-ci.yml/badge.svg?branch=master)](https://github.com/configcat/android-sdk/actions/workflows/android-ci.yml)
[![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.configcat/configcat-android-client/badge.svg)](https://maven-badges.herokuapp.com/maven-central/com.configcat/configcat-android-client)
[![Coverage Status](https://img.shields.io/codecov/c/github/ConfigCat/android-sdk.svg)](https://codecov.io/gh/ConfigCat/android-sdk)
[![Javadocs](https://javadoc.io/badge/com.configcat/configcat-android-client.svg)](https://javadoc.io/doc/com.configcat/configcat-android-client)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=configcat_android-sdk&metric=alert_status)](https://sonarcloud.io/dashboard?id=configcat_android-sdk)


<a href="https://github.com/ConfigCat/android-sdk" target="_blank">ConfigCat Android SDK on GitHub</a>  

### Compatibility
The minimum supported Android SDK version is 21 (Lollipop).
### R8 (ProGuard)
When you use R8 or ProGuard, the aar artifact automatically applies the [included rules](https://github.com/configcat/android-sdk/blob/master/configcat-proguard-rules.pro) for the SDK.

## Getting Started:
### 1. Add the ConfigCat SDK to your project
```
implementation 'com.configcat:configcat-android-client:7.+'
```
### 2. Import the ConfigCat SDK:
```kotlin
import com.configcat.*
```
### 3. Create the *ConfigCat* client with your *SDK Key*
```kotlin
val client = ConfigCatClient("#YOUR-SDK-KEY#")
```
### 4. Get your setting value
```kotlin
client.getValueAsync(Boolean::class.java, "isMyAwesomeFeatureEnabled", false)
    .thenAccept { isMyAwesomeFeatureEnabled ->
        if (isMyAwesomeFeatureEnabled) {
            doTheNewThing()
        } else {
            doTheOldThing()
        }
    }
```

### 5. Stop *ConfigCat* client
You can safely shut down the client instance and release all associated resources on application exit.
```kotlin
client.close()
```

## Creating the *ConfigCat Client*
*ConfigCat Client* is responsible for:
- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`ConfigCatClient("#YOUR-SDK-KEY#")` returns a client with default options.

### Builder
```kotlin
val client = ConfigCatClient.newBuilder()
    .mode(PollingModes.autoPoll(60))
    .build(<sdkkey>)
```


| Builder options                         | Description |
| --------------------------------------- | ----------- |
| `build(<sdkkey>)`                       | **REQUIRED.** Waits for the SDK Key to access your feature flags and settings. Get it from *ConfigCat Dashboard*. |
| `dataGovernance(DataGovernance)`        | Optional, defaults to `Global`. Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `Global`, `EuOnly`. |
| `baseUrl(string)`                       | *Obsolete* Optional, sets the CDN base url (forward proxy, dedicated subscription) from where the sdk will download the configurations. |
| `httpClient(OkHttpClient)`              | Optional, sets the underlying `OkHttpClient` used to download the feature flags and settings over HTTP. [More about the HTTP Client](#httpclient). |
| `cache(ConfigCache)`                    | Optional, sets a custom cache implementation for the client. [More about cache](#custom-cache). |
| `mode(PollingMode)`                     | Optional, sets the polling mode for the client. [More about polling modes](#polling-modes). |
| `logLevel(LogLevel)`                    | Optional, defaults to `WARNING`. Sets the internal log level. [More about logging](#logging). |
| `flagOverrides(OverrideDataSourceBuilder, OverrideBehaviour)` | Optional, configures local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides). |

:::caution
We strongly recommend you to use the `ConfigCatClient` as a Singleton object in your application.
If you want to use multiple SDK Keys in the same application, create only one `ConfigCatClient` per SDK Key.
:::

## Anatomy of `getValue()`
| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `classOfT`     | **REQUIRED.** The type of the setting.                                                                       |
| `key`          | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                           |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
```kotlin
val value = client.getValue(
    Boolean::class.java, // Setting type
    "keyOfMySetting", // Setting Key
    User.newBuilder().build("435170f4-8a8b-4b67-a723-505ac7cdea92"), // Optional User Object
    false // Default value
)
```

## Anatomy of `getValueAsync()`
| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `classOfT`     | **REQUIRED.** The type of the setting.                                                                       |
| `key`          | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                           |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
```kotlin
client.getValueAsync(
    Boolean::class.java, // Setting type
    "keyOfMySetting", // Setting Key
    User.newBuilder().build("435170f4-8a8b-4b67-a723-505ac7cdea92"), // Optional User Object
    false // Default value
).thenAccept({ isMyAwesomeFeatureEnabled ->
    if(isMyAwesomeFeatureEnabled) {
        doTheNewThing()
    } else {
        doTheOldThing()
    }
})
```

## User Object
The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature. 
```kotlin
val user = User.newBuilder().build("435170f4-8a8b-4b67-a723-505ac7cdea92")   
```
```kotlin
val user = User.newBuilder().build("john@example.com")   
```
| Builder options | Description                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier()`  | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                         |
| `email()`       | Optional parameter for easier targeting rule definitions.                                                                       |
| `country()`     | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom()`      | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |
```kotlin
val user = User.newBuilder()
    .email("john@example.com")
    .country("United Kingdom")
    .custom(hashMapOf("SubscriptionType" to "Pro", "UserRole" to "Admin"))
    .build("435170f4-8a8b-4b67-a723-505ac7cdea92")
```

## Polling Modes
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all `getValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.  
[More about polling modes.](/advanced/caching/)

### Auto polling (default)
The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

Use the the `autoPollIntervalInSeconds` option parameter of the `PollingModes.autoPoll()` to change the polling interval.
```kotlin
val client = ConfigCatClient.newBuilder()
    .mode(PollingModes.autoPoll(120 /* polling interval in seconds */))
    .build("#YOUR-SDK-KEY#")
```
Adding a callback to `configurationChangeListener` option parameter will get you notified about changes.
```kotlin
val client = ConfigCatClient.newBuilder()
    .mode(PollingModes.autoPoll(
        120 /* polling interval in seconds */,
        {
            // here you can subscribe to configuration changes
        })
    )
    .build("#YOUR-SDK-KEY#")
```

### Lazy loading
When calling `getValue()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

Use the `cacheRefreshIntervalInSeconds` parameter of the `PollingModes.lazyLoad()` to set cache lifetime.
```java
val client = ConfigCatClient.newBuilder()
    .mode(PollingModes.lazyLoad(120 /* the cache will expire in 120 seconds */))
    .build("#YOUR-SDK-KEY#")
```
Use the `asyncRefresh` option parameter of the `PollingModes.lazyLoad()` to define how do you want to handle the expiration of the cached configuration. If you choose asynchronous refresh then when a `getValue()` call is made while the cache is expired, the previous value will be returned immediately until the fetching of the new configuration is completed.
```kotlin
val client = ConfigCatClient.newBuilder()
    .mode(PollingModes.lazyLoad(
        120, // the cache will expire in 120 seconds
        true // the refresh will be executed asynchronously
        )
    )
    .build("#YOUR-SDK-KEY#")
```
If you set the `asyncRefresh` to `false`, the refresh operation will be awaited until the fetching of the new configuration is completed.

### Manual polling
Manual polling gives you full control over when the `config.json` (with the setting values) is downloaded. ConfigCat SDK will not update them automatically. Calling `forceRefresh()` is your application's responsibility.
```kotlin
val client = ConfigCatClient.newBuilder()
    .mode(PollingModes.manualPoll())
    .build("#YOUR-SDK-KEY#")

client.forceRefresh()
```
> `getValue()` returns `defaultValue` if the cache is empty. Call `forceRefresh()` to update the cache.

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local/Offline mode** (`OverrideBehaviour.LOCAL_ONLY`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour.LOCAL_OVER_REMOTE`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour.REMOTE_OVER_LOCAL`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can load your feature flag & setting overrides from a `Map<String, Object>` structure.

```kotlin
val map = hashMapOf(
    "enabledFeature" to true, 
    "disabledFeature" to false,
    "intSetting" to 5,
    "doubleSetting" to 3.14,
    "stringSetting" to "test",
)

val client = ConfigCatClient.newBuilder()
    .flagOverrides(OverrideDataSourceBuilder.map(map), OverrideBehaviour.LOCAL_ONLY)
    .build("localhost")
```

## `getAllKeys()`, `getAllKeysAsync()`
You can get all the setting keys from your configuration by calling the `getAllKeys()` or `getAllKeysAsync()` method of the `ConfigCatClient`.

```kotlin
val client = ConfigCatClient("#YOUR-SDK-KEY#")
val keys = client.getAllKeys()
```

```kotlin
val client = ConfigCatClient("#YOUR-SDK-KEY#")
client.getAllKeysAsync().thenAccept({ keys -> 
})
```

## `getAllValues()`, `getAllValuesAsync()`
Evaluates and returns the values of all feature flags and settings. Passing a User Object is optional.

```kotlin
val client = ConfigCatClient("#YOUR-SDK-KEY#")
val settingValues = client.getAllValues()

// invoke with user object
val user = User.newBuilder().build("435170f4-8a8b-4b67-a723-505ac7cdea92")
val settingValues = client.getAllValues(user)
```

```kotlin
val client = new ConfigCatClient("#YOUR-SDK-KEY#")
client.getAllValuesAsync().thenAccept({ settingValues -> 
})

// invoke with user object
val user = User.newBuilder().build("435170f4-8a8b-4b67-a723-505ac7cdea92")
client.getAllValuesAsync(user).thenAccept({ settingValuesTargeting ->
})
```

## Custom cache

You have the option to inject your custom cache implementation into the client. All you have to do is to inherit from the ConfigCache abstract class:

```kotlin
class MyCustomCache : ConfigCache() {
    override fun read(key: String) : String {
        // here you have to return with the cached value
    }

    override fun write(key: String, value: String) {
        // here you have to store the new value in the cache
    }
}
```

Then use your custom cache implementation:

```kotlin
val client = ConfigCatClient.newBuilder()
    .cache(MyCustomCache()) // inject your custom cache
    .build("#YOUR-SDK-KEY#")
```

## HttpClient

The ConfigCat SDK internally uses an <a href="https://github.com/square/okhttp" target="_blank">OkHttpClient</a> instance to fetch the latest configuration over HTTP. You have the option to override the internal Http client with your customized one. 

### HTTP Proxy
If your application runs behind a proxy you can do the following:
```kotlin
val proxy = Proxy(Proxy.Type.HTTP, InetSocketAddress("proxyHost", proxyPort))
val client = ConfigCatClient.newBuilder()
    .httpClient(OkHttpClient.Builder()
                .proxy(proxy)
                .build())
    .build("#YOUR-SDK-KEY#")
```

### HTTP Timeout
You can set the maximum wait time for a ConfigCat HTTP response by using OkHttpClient's timeouts.
```kotlin
val client = ConfigCatClient.newBuilder()
    .httpClient(OkHttpClient.Builder()
                .readTimeout(2, TimeUnit.SECONDS) // set the read timeout to 2 seconds
                .build())
    .build("#YOUR-SDK-KEY#")
```
OkHttpClient's default timeout is 10 seconds.

> As the ConfigCatClient SDK maintains the whole lifetime of the internal http client, it's being closed simultaneously with the ConfigCatClient, refrain from closing the http client manually.

### Force refresh
Any time you want to refresh the cached configuration with the latest one, you can call the `forceRefresh()` method of the library, which initiates a new download and updates the local cache.

## Logging
As the SDK uses the facade of [slf4j](https://www.slf4j.org) for logging, so you can use any of the slf4j implementation packages.
```
dependencies {
    implementation 'org.slf4j:slf4j-android:1.+'
}
```
You can change the verbosity of the logs by passing a `LogLevel` parameter to the ConfigCatClientBuilder's `logLevel` function.
```kotlin
val client = ConfigCatClient.newBuilder()
    .logLevel(LogLevel.INFO)
    .build("#YOUR-SDK-KEY#")
```

Available log levels:

| Level      | Description                                                                             |
| ---------- | --------------------------------------------------------------------------------------- |
| `NO_LOG`   | Turn the logging off.                                                                   |
| `ERROR`    | Only error level events are logged.                                                     |
| `WARNING`  | Default. Errors and Warnings are logged.                                                |
| `INFO`     | Errors, Warnings and feature flag evaluation is logged.                                 |
| `DEBUG`    | All of the above plus debug info is logged. Debug logs can be different for other SDKs. |

Info level logging helps to inspect how a feature flag was evaluated:
```bash
INFO com.configcat.ConfigCatClient - Evaluating getValue(isPOCFeatureEnabled).
User object: User{Identifier=435170f4-8a8b-4b67-a723-505ac7cdea92, Email=john@example.com}
Evaluating rule: [Email:john@example.com] [CONTAINS] [@something.com] => no match
Evaluating rule: [Email:john@example.com] [CONTAINS] [@example.com] => match, returning "true"
```

## Sensitive information handling

The frontend/mobile SDKs are running in your users' browsers/devices. The SDK is downloading a [config.json](https://configcat.com/docs/requests/) file from ConfigCat's CDN servers. The URL path for this config.json file contains your SDK key, so the SDK key and the content of your config.json file (feature flag keys, feature flag values, targeting rules, % rules) can be visible to your users. 
This SDK key is read-only, it only allows downloading your config.json file, but nobody can make any changes with it in your ConfigCat account.

If you do not want to expose the SDK key or the content of the config.json file, we recommend using the SDK in your backend components only. You can always create a backend endpoint using the ConfigCat SDK that can evaluate feature flags for a specific user, and call that backend endpoint from your frontend/mobile applications.

Also, we recommend using [confidential targeting comparators](/advanced/targeting/#confidential-text-comparators) in the targeting rules of those feature flags that are used in the frontend/mobile SDKs.

## Sample App

<a href="https://github.com/configcat/android-sdk/tree/master/samples/android" target="_blank">Android App with auto polling and change listener</a>  

## Look under the hood

- <a href="https://github.com/ConfigCat/android-sdk" target="_blank">ConfigCat Android SDK's repository on GitHub</a>
- <a href="https://javadoc.io/doc/com.configcat/configcat-android-client" target="_blank">ConfigCat Android SDK's javadoc page</a>
- <a href="https://search.maven.org/artifact/com.configcat/configcat-android-client" target="_blank">ConfigCat Android SDK on Maven Central</a>
