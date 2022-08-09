---
id: kotlin
title: Kotlin Multiplatform SDK Reference
description: ConfigCat Kotlin Multiplatform SDK Reference. This is a step-by-step guide on how to use feature flags in your Kotlin Multiplatform apps.
---

[![Kotlin CI](https://github.com/configcat/kotlin-sdk/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/configcat/kotlin-sdk/actions/workflows/ci.yml)
[![Maven Central](https://img.shields.io/maven-central/v/com.configcat/configcat-kotlin-client?label=maven%20central)](https://search.maven.org/artifact/com.configcat/configcat-kotlin-client/)
![Snapshot](https://img.shields.io/nexus/s/com.configcat/configcat-kotlin-client?label=snapshot&server=https%3A%2F%2Foss.sonatype.org)
[![Quality Gate Status](https://img.shields.io/sonar/quality_gate/configcat_kotlin-sdk?logo=SonarCloud&server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/project/overview?id=configcat_kotlin-sdk)
[![SonarCloud Coverage](https://img.shields.io/sonar/coverage/configcat_kotlin-sdk?logo=SonarCloud&server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/project/overview?id=configcat_kotlin-sdk)
[![Kotlin](https://img.shields.io/badge/kotlin-1.7-blueviolet.svg?logo=kotlin)](http://kotlinlang.org)

<a href="https://github.com/ConfigCat/kotlin-sdk" target="_blank">ConfigCat Kotlin Multiplatform SDK on GitHub</a>
<a href="https://configcat.github.io/kotlin-sdk/" target="_blank">API Documentation</a>

## Getting Started
### 1. Install the ConfigCat SDK
```kotlin
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
### 2. Import *com.configcat.** in your application code
```kotlin
import com.configcat.*
```
### 3. Create a *ConfigCat* client instance
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
ConfigCatClient.close() // closes all clients

ConfigCatClient.close(client) // closes a specific client
```

## Configuring the *ConfigCat Client*

*ConfigCat Client* is responsible for:
- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`ConfigCatClient(<sdkKey>)` returns a client with default options.

| Properties                  | Description |
| --------------------------- | ----------- |
| `dataGovernance`            | Optional, defaults to `DataGovernance.GLOBAL`. Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `DataGovernance.GLOBAL`, `DataGovernance.EU_ONLY`. |
| `baseUrl`                   | Optional, sets the CDN base url (forward proxy, dedicated subscription) from where the sdk will download the configurations. |
| `requestTimeoutMs`          | Optional, defaults to `30s`. Sets the underlying HTTP client's request timeout. [More about the HTTP Client](#httpclient). |
| `configCache`               | Optional, sets a custom cache implementation for the client. [More about cache](#custom-cache). |
| `pollingMode`               | Optional, sets the polling mode for the client. [More about polling modes](#polling-modes). |
| `logger`                    | Optional, sets the internal logger. [More about logging](#logging). |
| `logLevel`                  | Optional, defaults to `LogLevel.WARNING`. Sets the internal log level. [More about logging](#logging). |
| `override`                  | Optional, configures local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides). |
| `httpEngine`                | Optional, configures the underlying `ktor` HTTP engine. [More about HTTP engines](#httpclient). |

```kotlin
val client = ConfigCatClient("#YOUR-SDK-KEY#") {
    pollingMode = autoPoll()
    logLevel = LogLevel.INFO
    requestTimeoutMs = 10_000
}
```

:::caution
We strongly recommend you to use the `ConfigCatClient` as a Singleton object in your application.
The `ConfigCatClient(<sdkKey>)` factory method gets or constructs singleton client instances for your SDK keys.
These clients can be closed all at once or individually with the `ConfigCatClient.close()` method.
:::

## Anatomy of `getValue()`
| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
```kotlin
val value = client.getValue(
    key = "keyOfMySetting", 
    defaultValue = false,
    user = ConfigCatUser("#USER-IDENTIFIER#"), // Optional User Object
)
```

## User Object
The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature. 
```kotlin
val user = ConfigCatUser(identifier = "435170f4-8a8b-4b67-a723-505ac7cdea92");   
```
```kotlin
val user = ConfigCatUser(identifier = "john@example.com");   
```

### Customized user object creation:
| Argument      | Description                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier`  | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                         |
| `email`       | Optional parameter for easier targeting rule definitions.                                                                       |
| `country`     | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom`      | Optional map for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |
```kotlin
val user = ConfigCatUser(
    identifier = "435170f4-8a8b-4b67-a723-505ac7cdea92",
    email = "john@example.com",
    country = "United Kingdom",
    custom = mapOf(
        "SubscriptionType" to "Pro", 
        "UserRole" to "Admin"
    )
);
```

## Polling Modes
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all `getValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.  
[More about polling modes.](/advanced/caching/)

### Auto polling (default)
The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

Use the the `pollingIntervalSeconds` option parameter of the `autoPoll()` to change the polling interval.
```kotlin
val client = ConfigCatClient("<PLACE-YOUR-SDK-KEY-HERE>") {
    pollingMode = autoPoll {
        pollingIntervalSeconds = 100
    }
}
```
Adding a callback to `onConfigChanged` option parameter will get you notified about changes.
```kotlin
val client = ConfigCatClient("<PLACE-YOUR-SDK-KEY-HERE>") {
    pollingMode = autoPoll {
        pollingIntervalSeconds = 100
        onConfigChanged = {
            // here you can subscribe to configuration changes 
        }
    }
}
```

Available options:

| Option Parameter           | Description                              | Default |
| -------------------------- | ---------------------------------------- | ------- |
| `pollingIntervalSeconds`   | Polling interval.                        | 60      |
| `maxInitWaitTimeSeconds`   | Maximum waiting time between the client initialization and the first config acquisition in seconds. | 5       |
| `onConfigChanged`          | Callback to get notified about changes.  | -       |

### Lazy Loading
When calling `getValue()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

Use the `cacheRefreshIntervalSeconds` option parameter of the `lazyLoad()` to set cache lifetime.
```kotlin
val client = ConfigCatClient("<PLACE-YOUR-SDK-KEY-HERE>") {
    pollingMode = lazyLoad {
        cacheRefreshIntervalSeconds = 100
    }
}
```

Available options:

| Parameter                       | Description                  | Default |
| ------------------------------- | ---------------------------- | ------- |
| `cacheRefreshIntervalSeconds`   | Cache TTL.                   | 60      |

### Manual Polling
Manual polling gives you full control over when the `config.json` (with the setting values) is downloaded. ConfigCat SDK will not update them automatically. Calling `refresh()` is your application's responsibility.
```dart
val client = ConfigCatClient("<PLACE-YOUR-SDK-KEY-HERE>") {
    pollingMode = manualPoll()
}

client.refresh();
```
> `getValue()` returns `defaultValue` if the cache is empty. Call `refresh()` to update the cache.

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local/Offline mode** (`OverrideBehavior.LOCAL_ONLY`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehavior.LOCAL_OVER_REMOTE`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehavior.REMOTE_OVER_LOCAL`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can set up the SDK to load your feature flag & setting overrides from a `Map<String, Any>`.
```dart
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
val keys = client.getAllKeys();
```

## `getAllValues()`
Evaluates and returns the values of all feature flags and settings. Passing a User Object is optional.

```kotlin
val client = ConfigCatClient("#YOUR-SDK-KEY#")
val settingValues = client.getAllValues();

// invoke with user object
val user = ConfigCatUser(identifier = "435170f4-8a8b-4b67-a723-505ac7cdea92")
val settingValuesTargeting = client.getAllValues(user);
```

## Custom Cache
You have the option to inject your custom cache implementation into the client. All you have to do is to implement the `ConfigCache` interface:
```kotlin
class MyCustomCache : ConfigCache {
    override suspend fun read(key: String): String {
        // here you have to return with the cached value
    }

    override suspend fun write(key: String, value: String) { 
        // here you have to store the new value in the cache
    }
}
```
Then use your custom cache implementation:
```kotlin
val client = ConfigCatClient("<PLACE-YOUR-SDK-KEY-HERE>") {
    configCache = MyCustomCache()
}
```

## HttpClient
The ConfigCat SDK internally uses <a href="https://ktor.io" target="_blank">Ktor</a> to download the latest configuration over HTTP. For each platform the SDK includes a specific <a href="https://ktor.io/docs/http-client-engines.html#limitations" target="_blank">HTTP engine</a>: 

- Android / JVM: `ktor-client-okhttp`
- macOS / iOS / tvOS / watchOS: `ktor-client-darwin`
- JavaScript / Node.js: `ktor-client-js`
- Windows / Linux: It is possible to use Ktor's <a href="https://ktor.io/docs/http-client-engines.html#curl" target="_blank">`Curl` engine</a>.

You can set/override the HTTP engine like the following:
```kotlin
// this example configures the SDK to use the Curl engine for HTTP communication.
import io.ktor.client.engine.curl.*

val client = ConfigCatClient("<PLACE-YOUR-SDK-KEY-HERE>") {
    httpEngine = Curl.create {
        // additional engine configuration
    }
}
```

### HTTP Timeout
You can set the maximum wait time for a ConfigCat HTTP response.
```kotlin
val client = ConfigCatClient("<PLACE-YOUR-SDK-KEY-HERE>") { 
    requestTimeoutMs = 10_000
}
```
> Default request timeout is 30 seconds.

### HTTP Proxy
If your application runs behind a proxy you can do the following:
```kotlin
// TODO
```

## Force refresh
Any time you want to refresh the cached configuration with the latest one, you can call the `refresh()` method of the library, which initiates a new download and updates the local cache.

## Logging
The default logger used by the SDK is simply using `println()` to log messages, but you can override it with your custom logger implementation via the `logger` client option. The custom implementation must satisfy the <a href="https://github.com/configcat/kotlin-sdk/blob/main/src/commonMain/kotlin/com/configcat/log/Logger.kt" target="_blank">Logger</a> interface.
```kotlin
val client = ConfigCatClient("<PLACE-YOUR-SDK-KEY-HERE>") {
    logger = MyCustomLogger()
}
```

You can change the verbosity of the logs by passing a `logLevel` parameter to the client options.
```kotlin
val client = ConfigCatClient("<PLACE-YOUR-SDK-KEY-HERE>") {
    logLevel = LogLevel.INFO
}
```

Available log levels:

| Level      | Description                                                                             |
| ---------- | --------------------------------------------------------------------------------------- |
| `OFF`      | Turn the logging off.                                                                  |
| `ERROR`    | Only error level events are logged.                                                     |
| `WARNING`  | Default. Errors and Warnings are logged.                                                |
| `INFO`     | Errors, Warnings and feature flag evaluation is logged.                                 |
| `DEBUG`    | All of the above plus debug info is logged. Debug logs can be different for other SDKs. |

Info level logging helps to inspect how a feature flag was evaluated:
```bash
2022-08-09 15:58:54 UTC [INFO]: ConfigCat - Evaluating getValue(isPOCFeatureEnabled)
User object: {Identifier: 435170f4-8a8b-4b67-a723-505ac7cdea92, Email: john@example.com}
Evaluating rule: [Email:john@example.com] [CONTAINS] [@something.com] => no match
Evaluating rule: [Email:john@example.com] [CONTAINS] [@example.com] => match, returning: true
```

## Sample Apps
Check out our Sample Applications how they use the ConfigCat SDK
- <a href="https://github.com/configcat/kotlin-sdk/tree/main/samples/kmm" target="_blank">Kotlin Multiplatform Mobile app</a>
- <a href="https://github.com/configcat/kotlin-sdk/tree/main/samples/kotlin" target="_blank">Kotlin app</a>
- <a href="https://github.com/configcat/kotlin-sdk/tree/main/samples/js" target="_blank">React app</a>
- <a href="https://github.com/configcat/kotlin-sdk/tree/main/samples/node-js" target="_blank">Node.js app</a>

## Look Under the Hood
- <a href="https://github.com/ConfigCat/kotlin-sdk" target="_blank">ConfigCat Kotlin Multiplatform SDK's repository on GitHub</a>
- <a href="https://configcat.github.io/kotlin-sdk/" target="_blank">ConfigCat Kotlin Multiplatform SDK's API documentation</a>
- <a href="https://search.maven.org/artifact/com.configcat/configcat-java-client" target="_blank">ConfigCat Java SDK on Maven Central</a>
