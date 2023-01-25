---
id: kotlin
title: Kotlin Multiplatform SDK Reference
description: ConfigCat Kotlin Multiplatform SDK Reference. This is a step-by-step guide on how to use feature flags in your Kotlin Multiplatform apps.
---

[![Star on GitHub](https://img.shields.io/github/stars/configcat/kotlin-sdk.svg?style=social)](https://github.com/configcat/kotlin-sdk/stargazers)
[![Kotlin CI](https://github.com/configcat/kotlin-sdk/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/configcat/kotlin-sdk/actions/workflows/ci.yml)
[![Maven Central](https://img.shields.io/maven-central/v/com.configcat/configcat-kotlin-client?label=maven%20central)](https://search.maven.org/artifact/com.configcat/configcat-kotlin-client/)
![Snapshot](https://img.shields.io/nexus/s/com.configcat/configcat-kotlin-client?label=snapshot&server=https%3A%2F%2Foss.sonatype.org)
[![Quality Gate Status](https://img.shields.io/sonar/quality_gate/configcat_kotlin-sdk?logo=SonarCloud&server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/project/overview?id=configcat_kotlin-sdk)
[![SonarCloud Coverage](https://img.shields.io/sonar/coverage/configcat_kotlin-sdk?logo=SonarCloud&server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/project/overview?id=configcat_kotlin-sdk)

- <a href="https://github.com/configcat/kotlin-sdk" target="_blank">ConfigCat Kotlin Multiplatform SDK on GitHub</a>
- <a href="https://configcat.github.io/kotlin-sdk/" target="_blank">API Documentation</a>

## Getting started

### 1. Install the ConfigCat SDK

```kotlin title="build.bradle.kts"
val configcat_version: String by project

kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("com.configcat:configcat-kotlin-client:$configcat_version")
            }
        }
    }
}
```

### 2. Import the ConfigCat SDK

```kotlin
import com.configcat.*
```

### 3. Create the ConfigCat client with your SDK Key

```kotlin
import com.configcat.*

suspend fun main() {
    val client = ConfigCatClient("#YOUR-SDK-KEY#")
}
```

### 4. Get your setting value

```kotlin
import com.configcat.*

suspend fun main() {
    val client = ConfigCatClient("#YOUR-SDK-KEY#")
    val isMyAwesomeFeatureEnabled = client.getValue("isMyAwesomeFeatureEnabled", false)
    if (isMyAwesomeFeatureEnabled) {
        doTheNewThing()
    } else {
        doTheOldThing()
    }
}
```

### 5. Close the client on application exit

You can safely shut down all clients at once or individually and release all associated resources on application exit.

```kotlin
ConfigCatClient.closeAll() // closes all clients

client.close() // closes a specific client
```

## Setting up the _ConfigCat Client_

_ConfigCat Client_ is responsible for:

- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`ConfigCatClient(<sdkKey>)` returns a client with default options.

### Customizing the _ConfigCat Client_

To customize the SDK's behavior, you can pass an additional `ConfigCatOptions.() -> Unit` parameter 
to the `ConfigCatClient()` method where the `ConfigCatOptions` class is used to set up the _ConfigCat Client_.

```kotlin
import com.configcat.*
import kotlin.time.Duration.Companion.seconds

val client = ConfigCatClient("#YOUR-SDK-KEY#") {
    pollingMode = autoPoll()
    logLevel = LogLevel.INFO
    requestTimeout = 10.seconds
}
```

These are the available options on the `ConfigCatOptions` class:

| Properties       | Type                          | Description                                                                                                                                                                                                                                                                                                                                      |
| ---------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `dataGovernance` | `DataGovernance`              | Optional, defaults to `DataGovernance.GLOBAL`. Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `DataGovernance.GLOBAL`, `DataGovernance.EU_ONLY`. |
| `baseUrl`        | `String`                      | Optional, sets the CDN base url (forward proxy, dedicated subscription) from where the SDK will download the config.json.                                                                                                                                                                                                                        |
| `requestTimeout` | `Duration`                    | Optional, defaults to `30s`. Sets the underlying HTTP client's request timeout. [More about HTTP Timeout](#http-timeout).                                                                                                                                                                                                                        |
| `configCache`    | `ConfigCache`                 | Optional, sets a custom cache implementation for the client. [More about cache](#custom-cache).                                                                                                                                                                                                                                                  |
| `pollingMode`    | `PollingMode`                 | Optional, sets the polling mode for the client. [More about polling modes](#polling-modes).                                                                                                                                                                                                                                                      |
| `logger`         | `Logger`                      | Optional, sets the internal logger. [More about logging](#logging).                                                                                                                                                                                                                                                                              |
| `logLevel`       | `LogLevel`                    | Optional, defaults to `LogLevel.WARNING`. Sets the internal log level. [More about logging](#logging).                                                                                                                                                                                                                                           |
| `flagOverrides`  | `(FlagOverrides.() -> Unit)?` | Optional, sets the local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides).                                                                                                                                                                                                                                 |
| `httpEngine`     | `HttpClientEngine?`           | Optional, sets the underlying `Ktor` HTTP engine. [More about HTTP engines](#http-engine).                                                                                                                                                                                                                                                       |
| `httpProxy`      | `ProxyConfig?`                | Optional, sets up the HTTP proxy for the underlying `Ktor` HTTP engine. [More about HTTP proxy](#http-proxy).                                                                                                                                                                                                                                    |
| `defaultUser`    | `ConfigCatUser?`              | Optional, sets the default user. [More about default user.](#default-user).                                                                                                                                                                                                                                                                      |
| `offline`        | `Bool`                        | Optional, defaults to `false`. Indicates whether the SDK should be initialized in offline mode. [More about offline mode.](#online--offline-mode).                                                                                                                                                                                        |
| `hooks`          | `Hooks`                       | Optional, used to subscribe events that the SDK sends in specific scenarios. [More about hooks](#hooks).                                                                                                                                                                                                                                         |


:::caution
We strongly recommend you to use the `ConfigCatClient` as a Singleton object in your application.
The `ConfigCatClient(sdkKey: <sdkKey>)` method constructs singleton client instances for your SDK keys.
These clients can be closed all at once with the `ConfigCatClient.closeAll()` method or individually with `client.close()`.
:::

## Anatomy of `getValue()`

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on _ConfigCat Dashboard_ for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```kotlin
val value = client.getValue(
    key = "keyOfMySetting",
    defaultValue = false,
    user = ConfigCatUser(identifier = "#USER-IDENTIFIER#"), // Optional User Object
)
```

## Anatomy of `getValueDetails()`

`getValueDetails()` is similar to `getValue()` but instead of returning the evaluated value only, it gives more detailed information about the evaluation result.

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on _ConfigCat Dashboard_ for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```kotlin
val details = client.getValueDetails(
    key = "keyOfMySetting",
    defaultValue = false,
    user = ConfigCatUser(identifier = "#USER-IDENTIFIER#"), // Optional User Object
)
```

The details result contains the following information:

| Field                             | Type                                    | Description                                                                               |
| --------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------- |
| `value`                           | `Boolean` / `String` / `Int` / `Double` | The evaluated value of the feature flag or setting.                                       |
| `key`                             | `String`                                | The key of the evaluated feature flag or setting.                                         |
| `isDefaultValue`                  | `Boolean`                               | True when the default value passed to getValueDetails() is returned due to an error.      |
| `error`                           | `String?`                               | In case of an error, this field contains the error message.                               |
| `user`                            | `ConfigCatUser?`                        | The user object that was used for evaluation.                                             |
| `matchedEvaluationPercentageRule` | `PercentageRule?`                       | If the evaluation was based on a percentage rule, this field contains that specific rule. |
| `matchedEvaluationRule`           | `RolloutRule?`                          | If the evaluation was based on a targeting rule, this field contains that specific rule.  |
| `fetchTimeUnixMilliseconds`       | `Long`                                  | The last download time of the current config in unix milliseconds format.                 |

## User Object

The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature.

```kotlin
val user = ConfigCatUser(identifier = "#UNIQUE-USER-IDENTIFIER#")
```

```kotlin
val user = ConfigCatUser(identifier = "john@example.com")
```

### Customized user object creation

| Argument     | Description                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `identifier` | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                  |
| `email`      | Optional parameter for easier targeting rule definitions.                                                                |
| `country`    | Optional parameter for easier targeting rule definitions.                                                                |
| `custom`     | Optional map for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |

```kotlin
val user = ConfigCatUser(
    identifier = "#UNIQUE-USER-IDENTIFIER#",
    email = "john@example.com",
    country = "United Kingdom",
    custom = mapOf(
        "SubscriptionType" to "Pro",
        "UserRole" to "Admin"
    )
)
```

### Default user

There's an option to set a default user object that will be used at feature flag and setting evaluation. It can be useful when your application has a single user only, or rarely switches users.

You can set the default user object either on SDK initialization:

```kotlin
val client = ConfigCatClient("#YOUR-SDK-KEY#") {
    defaultUser = ConfigCatUser(identifier = "john@example.com")
}
```

or with the `setDefaultUser()` method of the ConfigCat client.

```kotlin
client.setDefaultUser(ConfigCatUser(identifier = "john@example.com"))
```

Whenever the `getValue()`, `getValueDetails()`, `getAllValues()`, or `getAllVariationIds()` methods are called without an explicit user object parameter, the SDK will automatically use the default user as a user object.

```kotlin
val user = ConfigCatUser(identifier = "john@example.com")
client.setDefaultUser(user)

// The default user will be used at the evaluation process.
val value = client.getValue("keyOfMySetting", false)
```

When the user object parameter is specified on the requesting method, it takes precedence over the default user.

```kotlin
val user = ConfigCatUser(identifier = "john@example.com")
client.setDefaultUser(user)

val otherUser = ConfigCatUser(identifier = "brian@example.com")

// otherUser will be used at the evaluation process.
val value = await client.getValue("keyOfMySetting", false, otherUser)
```

For deleting the default user, you can do the following:

```kotlin
client.clearDefaultUser()
```

## Polling Modes

The _ConfigCat SDK_ supports 3 different polling mechanisms to acquire the setting values from _ConfigCat_. After latest setting values are downloaded, they are stored in the internal cache then all `getValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.  
[More about polling modes.](/advanced/caching/)

### Auto polling (default)

The _ConfigCat SDK_ downloads the latest values and stores them automatically every 60 seconds.

Use the the `pollingInterval` option parameter of the `autoPoll()` to change the polling interval.

```kotlin
import com.configcat.*
import kotlin.time.Duration.Companion.seconds

val client = ConfigCatClient("#YOUR-SDK-KEY#") {
    pollingMode = autoPoll {
        pollingInterval = 100.seconds
    }
}
```

Available options:

| Option Parameter  | Description                                                                                         | Default      |
| ----------------- | --------------------------------------------------------------------------------------------------- | ------------ |
| `pollingInterval` | Polling interval.                                                                                   | `60.seconds` |
| `maxInitWaitTime` | Maximum waiting time between the client initialization and the first config acquisition in seconds. | `5.seconds`  |

### Lazy loading

When calling `getValue()` the _ConfigCat SDK_ downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

Use the `cacheRefreshInterval` option parameter of the `lazyLoad()` to set cache lifetime.

```kotlin
import com.configcat.*
import kotlin.time.Duration.Companion.seconds

val client = ConfigCatClient("#YOUR-SDK-KEY#") {
    pollingMode = lazyLoad {
        cacheRefreshInterval = 100.seconds
    }
}
```

Available options:

| Parameter              | Description | Default      |
| ---------------------- | ----------- | ------------ |
| `cacheRefreshInterval` | Cache TTL.  | `60.seconds` |

### Manual polling

Manual polling gives you full control over when the `config.json` (with the setting values) is downloaded. ConfigCat SDK will not update them automatically. Calling `forceRefresh()` is your application's responsibility.

```kotlin
val client = ConfigCatClient("#YOUR-SDK-KEY#") {
    pollingMode = manualPoll()
}

client.forceRefresh()
```

> `getValue()` returns `defaultValue` if the cache is empty. Call `forceRefresh()` to update the cache.

## Hooks

With the following hooks you can subscribe to particular events fired by the SDK:

- `onClientReady()`: This event is sent when the SDK reaches the ready state. If the SDK is initialized with lazy load or manual polling it's considered ready right after instantiation.
  If it's using auto polling, the ready state is reached when the SDK has a valid config.json loaded into memory either from cache or from HTTP. If the config couldn't be loaded neither from cache nor from HTTP the `onClientReady` event fires when the auto polling's `maxInitWaitTime` is reached.

- `onConfigChanged(Map<String, Setting>)`: This event is sent when the SDK loads a valid config.json into memory from cache, and each subsequent time when the loaded config.json changes via HTTP.

- `onFlagEvaluated(EvaluationDetails)`: This event is sent each time when the SDK evaluates a feature flag or setting. The event sends the same evaluation details that you would get from [`getValueDetails()`](#anatomy-of-getvaluedetails).

- `onError(String)`: This event is sent when an error occurs within the ConfigCat SDK.

You can subscribe to these events either on SDK initialization:

```kotlin
val client = ConfigCatClient("#YOUR-SDK-KEY#") {
    hooks.addOnFlagEvaluated { details ->
        /* handle the event */
    }
}
```

or with the `hooks` property of the ConfigCat client:

```kotlin
client.hooks.addOnFlagEvaluated { details ->
    /* handle the event */
}
```

## Online / Offline mode

In cases when you'd want to prevent the SDK from making HTTP calls, you can put it in offline mode:

```kotlin
client.setOffline()
```

In offline mode, the SDK won't initiate HTTP requests and will work only from its cache.

To put the SDK back in online mode, you can do the following:

```kotlin
client.setOnline()
```

> With `client.isOffline` you can check whether the SDK is in offline mode.

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local only** (`OverrideBehavior.LOCAL_ONLY`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehavior.LOCAL_OVER_REMOTE`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehavior.REMOTE_OVER_LOCAL`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can set up the SDK to load your feature flag & setting overrides from a `Map<String, Any>`.

```kotlin
val client = ConfigCatClient("localhost") {
    flagOverrides = {
        behavior = OverrideBehavior.LOCAL_ONLY
        dataSource = OverrideDataSource.map(
            mapOf(
                "enabledFeature" to true,
                "disabledFeature" to false,
                "intSetting" to 5,
                "doubleSetting" to 3.14,
                "stringSetting" to "test"
            )
        )
    }
}
```

## `getAllKeys()`

You can query the keys of each feature flag and setting with the `getAllKeys()` method.

```kotlin
val client = ConfigCatClient("#YOUR-SDK-KEY#")
val keys = client.getAllKeys()
```

## `getAllValues()`

Evaluates and returns the values of all feature flags and settings. Passing a User Object is optional.

```kotlin
val client = ConfigCatClient("#YOUR-SDK-KEY#")
val settingValues = client.getAllValues()

// invoke with user object
val user = ConfigCatUser(identifier = "#UNIQUE-USER-IDENTIFIER#")
val settingValuesTargeting = client.getAllValues(user)
```

## Cache

The SDK uses platform specific caching to store the downloaded `config.json`.  
These are the storage locations by platform:

- **Android**: `SharedPreferences`. It has a dependency on `android.content.Context`, so it won't be enabled by default, but it can be explicitly set by providing an appropriate `Context`. ([Here](https://github.com/configcat/kotlin-sdk/blob/main/samples/android/app/src/main/java/com/example/configcat_android/MainActivity.kt#L23) is an example) 
- **iOS / macOS / tvOS / watchOS**: `NSUserDefaults`.
- **JS (browser only)**: Browser `localStorage`.
- On other platforms the SDK uses a memory-only cache.

If you want to turn off the default behavior, you can set the SDK's cache to `null` or to your own cache implementation.

```kotlin
val client = ConfigCatClient("#YOUR-SDK-KEY#") {
    configCache = null
}
```

### Custom Cache
You have the option to inject your custom cache implementation into the client. All you have to do is to implement the `ConfigCache` interface:

```kotlin
class MyCustomCache : ConfigCache {
    override suspend fun read(key: String): String? {
        // here you have to return with the cached value
    }

    override suspend fun write(key: String, value: String) {
        // here you have to store the new value in the cache
    }
}
```

Then use your custom cache implementation:

```kotlin
val client = ConfigCatClient("#YOUR-SDK-KEY#") {
    configCache = MyCustomCache()
}
```

## HTTP Engine

The ConfigCat SDK internally uses <a href="https://ktor.io" target="_blank">Ktor</a> to download the latest config.json over HTTP. For each platform the SDK includes a specific <a href="https://ktor.io/docs/http-client-engines.html#limitations" target="_blank">HTTP engine</a>:

- **Android / JVM**: `ktor-client-okhttp`
- **macOS / iOS / tvOS / watchOS**: `ktor-client-darwin`
- **JavaScript / Node.js**: `ktor-client-js`
- **Windows / Linux**: It is possible to use Ktor's <a href="https://ktor.io/docs/http-client-engines.html#curl" target="_blank">Curl engine</a>.

You can set/override the HTTP engine like the following:

```kotlin
// this example sets up the SDK to use the Curl engine for HTTP communication.
import com.configcat.*
import io.ktor.client.engine.curl.*

val client = ConfigCatClient("#YOUR-SDK-KEY#") {
    httpEngine = Curl.create {
        // additional engine setup
    }
}
```

### HTTP Timeout

You can set the maximum wait time for a ConfigCat HTTP response.

```kotlin
import com.configcat.*
import kotlin.time.Duration.Companion.seconds

val client = ConfigCatClient("#YOUR-SDK-KEY#") {
    requestTimeout = 10.seconds
}
```

> The default request timeout is 30 seconds.

### HTTP Proxy

If your application runs behind a proxy you can do the following:

```kotlin
val client = ConfigCatClient("#YOUR-SDK-KEY#") {
    httpProxy = ProxyBuilder.http("http://proxy-server:1234/")
}
```

> You can check the availability of the proxy configuration in specific HTTP engines <a href="https://ktor.io/docs/proxy.html" target="_blank">here</a>.

## Force refresh

Any time you want to refresh the cached config.json with the latest one, you can call the `forceRefresh()` method of the library, which initiates a new download and updates the local cache.

## Logging

The default logger used by the SDK is simply using `println()` to log messages, but you can override it with your custom logger implementation via the `logger` client option. The custom implementation must satisfy the <a href="https://github.com/configcat/kotlin-sdk/blob/main/src/commonMain/kotlin/com/configcat/log/Logger.kt" target="_blank">Logger</a> interface.

```kotlin
val client = ConfigCatClient("#YOUR-SDK-KEY#") {
    logger = MyCustomLogger()
}
```

You can change the verbosity of the logs by passing a `logLevel` parameter to the client options.

```kotlin
val client = ConfigCatClient("#YOUR-SDK-KEY#") {
    logLevel = LogLevel.INFO
}
```

Available log levels:

| Level     | Description                                                                             |
| --------- | --------------------------------------------------------------------------------------- |
| `OFF`     | Turn the logging off.                                                                   |
| `ERROR`   | Only error level events are logged.                                                     |
| `WARNING` | Default. Errors and Warnings are logged.                                                |
| `INFO`    | Errors, Warnings and feature flag evaluation is logged.                                 |
| `DEBUG`   | All of the above plus debug info is logged. Debug logs can be different for other SDKs. |

Info level logging helps to inspect how a feature flag was evaluated:

```bash
2022-08-09 15:58:54 UTC [INFO]: ConfigCat - Evaluating 'isPOCFeatureEnabled'
User object: {Identifier: 435170f4-8a8b-4b67-a723-505ac7cdea92, Email: john@example.com}
Evaluating rule: [Email:john@example.com] [CONTAINS] [@something.com] => no match
Evaluating rule: [Email:john@example.com] [CONTAINS] [@example.com] => match, returning: true
```

## Sensitive information handling

The frontend/mobile SDKs are running in your users' browsers/devices. The SDK is downloading a [config.json](/requests/) file from ConfigCat's CDN servers. The URL path for this config.json file contains your SDK key, so the SDK key and the content of your config.json file (feature flag keys, feature flag values, targeting rules, % rules) can be visible to your users.
This SDK key is read-only, it only allows downloading your config.json file, but nobody can make any changes with it in your ConfigCat account.

If you do not want to expose the SDK key or the content of the config.json file, we recommend using the SDK in your backend components only. You can always create a backend endpoint using the ConfigCat SDK that can evaluate feature flags for a specific user, and call that backend endpoint from your frontend/mobile applications.

Also, we recommend using [confidential targeting comparators](/advanced/targeting/#confidential-text-comparators) in the targeting rules of those feature flags that are used in the frontend/mobile SDKs.

## Sample Apps

Check out our Sample Applications how they use the ConfigCat SDK

- <a href="https://github.com/configcat/kotlin-sdk/tree/main/samples/kmm" target="_blank">Kotlin Multiplatform Mobile app</a>
- <a href="https://github.com/configcat/kotlin-sdk/tree/main/samples/android" target="_blank">Android app</a>
- <a href="https://github.com/configcat/kotlin-sdk/tree/main/samples/kotlin" target="_blank">Kotlin app</a>
- <a href="https://github.com/configcat/kotlin-sdk/tree/main/samples/js" target="_blank">React app</a>
- <a href="https://github.com/configcat/kotlin-sdk/tree/main/samples/node-js" target="_blank">Node.js app</a>

## Look Under the Hood

- <a href="https://github.com/configcat/kotlin-sdk" target="_blank">ConfigCat Kotlin Multiplatform SDK's repository on GitHub</a>
- <a href="https://configcat.github.io/kotlin-sdk/" target="_blank">ConfigCat Kotlin Multiplatform SDK's API documentation</a>
- <a href="https://search.maven.org/artifact/com.configcat/configcat-kotlin-client" target="_blank">ConfigCat Kotlin Multiplatform SDK on Maven Central</a>
