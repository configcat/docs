---
id: android
title: Android (Java) SDK Reference
description: ConfigCat Android SDK Reference. This is a step-by-step guide on how to use feature flags in your Android Java application.
---

[![Star on GitHub](https://img.shields.io/github/stars/configcat/android-sdk.svg?style=social)](https://github.com/configcat/android-sdk/stargazers)
[![Android CI](https://github.com/configcat/android-sdk/actions/workflows/android-ci.yml/badge.svg?branch=master)](https://github.com/configcat/android-sdk/actions/workflows/android-ci.yml)
[![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.configcat/configcat-android-client/badge.svg)](https://maven-badges.herokuapp.com/maven-central/com.configcat/configcat-android-client)
[![Javadocs](http://javadoc.io/badge/com.configcat/configcat-android-client.svg)](http://javadoc.io/doc/com.configcat/configcat-android-client)
[![Coverage Status](https://img.shields.io/sonar/coverage/configcat_android-sdk?logo=SonarCloud&server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/project/overview?id=configcat_android-sdk)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=configcat_android-sdk&metric=alert_status)](https://sonarcloud.io/dashboard?id=configcat_android-sdk)

:::info
This SDK is mainly for Java-based Android applications. For a more modern Android development experience, check our [Kotlin Multiplatform SDK](/sdk-reference/kotlin).
:::

<a href="https://github.com/ConfigCat/android-sdk" target="_blank">ConfigCat Android (Java) SDK on GitHub</a>

### Compatibility

The minimum supported Android SDK version is 21 (Lollipop).

### R8 (ProGuard)

When you use R8 or ProGuard, the aar artifact automatically applies the [included rules](https://github.com/configcat/android-sdk/blob/master/configcat-proguard-rules.pro) for the SDK.

## Getting Started:

### 1. Add the ConfigCat SDK to your project

```groovy title="build.gradle"
dependencies {
    implementation 'com.configcat:configcat-android-client:8.+'
}
```

### 2. Import the ConfigCat SDK:

```java
import com.configcat.*;
```

### 3. Create the _ConfigCat_ client with your _SDK Key_

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#");
```

### 4. Get your setting value

```java
boolean isMyAwesomeFeatureEnabled = client.getValue(Boolean.class, "<key-of-my-awesome-feature>", false);
if(isMyAwesomeFeatureEnabled) {
    doTheNewThing();
} else {
    doTheOldThing();
}

// Or asynchronously
client.getValueAsync(Boolean.class, "<key-of-my-awesome-feature>", false)
    .thenAccept(isMyAwesomeFeatureEnabled -> {
        if(isMyAwesomeFeatureEnabled) {
            doTheNewThing();
        } else {
            doTheOldThing();
        }
    });
```

### 5. Stop _ConfigCat_ client

You can safely shut down all clients at once or individually and release all associated resources on application exit.

```java
ConfigCatClient.closeAll(); // closes all clients

client.close(); // closes a specific client
```

## Creating the _ConfigCat Client_

_ConfigCat Client_ is responsible for:

- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`ConfigCatClient.get("#YOUR-SDK-KEY#")` returns a client with default options.

### Customizing the _ConfigCat Client_

To customize the SDK's behavior, you can pass an additional `Consumer<Options>` parameter to the `get()` static 
factory method where the `Options` class is used to set up the _ConfigCat Client_.

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.pollingMode(PollingModes.autoPoll());
    options.logLevel(LogLevel.INFO);
});
```

These are the available options on the `Options` class:

| Options                                                | Description                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dataGovernance(DataGovernance)`                              | Optional, defaults to `Global`. Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `Global`, `EuOnly`. |
| `baseUrl(string)`                                             | _Obsolete_ Optional, sets the CDN base url (forward proxy, dedicated subscription) from where the sdk will download the config.json.                                                                                                                                                               |
| `httpClient(OkHttpClient)`                                    | Optional, sets the underlying `OkHttpClient` used to download the feature flags and settings over HTTP. [More about the HTTP Client](#httpclient).                                                                                                                                                 |
| `cache(ConfigCache)`                                          | Optional, sets a custom cache implementation for the client. [More about cache](#custom-cache).                                                                                                                                                                                                    |
| `pollingMode(PollingMode)`                                    | Optional, sets the polling mode for the client. [More about polling modes](#polling-modes).                                                                                                                                                                                                        |
| `logLevel(LogLevel)`                                          | Optional, defaults to `WARNING`. Sets the internal log level. [More about logging](#logging).                                                                                                                                                                                                      |
| `flagOverrides(OverrideDataSourceBuilder, OverrideBehaviour)` | Optional, sets the local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides).                                                                                                                                                                                   |
| `defaultUser(User)`                                           | Optional, sets the default user. [More about default user.](#default-user).                                                                                                                                                                                                                        |
| `offline(boolean)`                                            | Optional, defaults to `false`. Indicates whether the SDK should be initialized in offline mode. [More about offline mode.](#online--offline-mode).                                                                                                                                          |
| `hooks()`                                                     | Optional, used to subscribe events that the SDK sends in specific scenarios. [More about hooks](#hooks).                                                                                                                                                                                           |

:::caution
We strongly recommend you to use the `ConfigCatClient` as a Singleton object in your application.
The `ConfigCatClient.get("#YOUR-SDK-KEY#")` static factory method constructs singleton client instances for your SDK keys.
These clients can be closed all at once with the `ConfigCatClient.closeAll()` method or individually with `client.close()`.
:::

## Anatomy of `getValue()`

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `classOfT`     | **REQUIRED.** The type of the setting.                                                                       |
| `key`          | **REQUIRED.** Setting-specific key. Set on _ConfigCat Dashboard_ for each setting.                           |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |

```java
boolean value = client.getValue(
    Boolean.class, // Setting type
    "keyOfMySetting", // Setting Key
    User.newBuilder().build("#UNIQUE-USER-IDENTIFIER#"), // Optional User Object
    false // Default value
);
```

## Anatomy of `getValueAsync()`

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `classOfT`     | **REQUIRED.** The type of the setting.                                                                       |
| `key`          | **REQUIRED.** Setting-specific key. Set on _ConfigCat Dashboard_ for each setting.                           |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |

```java
client.getValueAsync(
    Boolean.class, // Setting type
    "keyOfMySetting", // Setting Key
    User.newBuilder().build("#UNIQUE-USER-IDENTIFIER#"), // Optional User Object
    false // Default value
).thenAccept(isMyAwesomeFeatureEnabled -> {
    if(isMyAwesomeFeatureEnabled) {
        doTheNewThing();
    } else {
        doTheOldThing();
    }
});
```

## Anatomy of `getValueDetails()`

`getValueDetails()` is similar to `getValue()` but instead of returning the evaluated value only, it gives more detailed information about the evaluation result.

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `classOfT`     | **REQUIRED.** The type of the setting.                                                                       |
| `key`          | **REQUIRED.** Setting-specific key. Set on _ConfigCat Dashboard_ for each setting.                           |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |

```java
EvaluationDetails<Boolean> details = client.getValueDetails(
    Boolean.class, // Setting type
    "keyOfMySetting", // Setting Key
    User.newBuilder().build("#UNIQUE-USER-IDENTIFIER#"), // Optional User Object
    false // Default value
);

// Or asynchronously
client.getValueDetailsAsync(
    Boolean.class, // Setting type
    "keyOfMySetting", // Setting Key
    User.newBuilder().build("#UNIQUE-USER-IDENTIFIER#"), // Optional User Object
    false // Default value
).thenAccept(details -> {
    // Use the details result
});
```

The details result contains the following information:

| Property                               | Type                                    | Description                                                                               |
| -------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------- |
| `getValue()`                           | `boolean` / `String` / `int` / `double` | The evaluated value of the feature flag or setting.                                       |
| `getKey()`                             | `String`                                | The key of the evaluated feature flag or setting.                                         |
| `isDefaultValue()`                     | `boolean`                               | True when the default value passed to getValueDetails() is returned due to an error.      |
| `getError()`                           | `String`                                | In case of an error, this field contains the error message.                               |
| `getUser()`                            | `User`                                  | The user object that was used for evaluation.                                             |
| `getMatchedEvaluationPercentageRule()` | `PercentageRule`                        | If the evaluation was based on a percentage rule, this field contains that specific rule. |
| `getMatchedEvaluationRule()`           | `RolloutRule`                           | If the evaluation was based on a targeting rule, this field contains that specific rule.  |
| `getFetchTimeUnixMilliseconds()`       | `long`                                  | The last download time of the current config in unix milliseconds format.                 |

## User Object

The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature.

```java
User user = User.newBuilder().build("#UNIQUE-USER-IDENTIFIER#"); // Optional User Object
```

```java
User user = User.newBuilder().build("john@example.com");
```

### Customized user object creation

| Builder options | Description                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier()`  | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                         |
| `email()`       | Optional parameter for easier targeting rule definitions.                                                                       |
| `country()`     | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom()`      | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |

```java
java.util.Map<String,String> customAttributes = new java.util.HashMap<String,String>();
    customAttributes.put("SubscriptionType", "Pro");
    customAttributes.put("UserRole", "Admin");

User user = User.newBuilder()
    .email("john@example.com")
    .country("United Kingdom")
    .custom(customAttributes)
    .build("#UNIQUE-USER-IDENTIFIER#"); // UserID
```

### Default user

There's an option to set a default user object that will be used at feature flag and setting evaluation. It can be useful when your application has a single user only, or rarely switches users.

You can set the default user object either on SDK initialization:

```java

ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.defaultUser(User.newBuilder().build("john@example.com"));
});
```

or with the `setDefaultUser()` method of the ConfigCat client.

```java
client.setDefaultUser(User.newBuilder().build("john@example.com"));
```

Whenever the `getValue[Async]()`, `getValueDetails[Async]()`, `getAllValues[Async]()`, or `getAllVariationIds[Async]()` methods are called without an explicit user object parameter, the SDK will automatically use the default user as a user object.

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.defaultUser(User.newBuilder().build("john@example.com"));
});

// The default user will be used at the evaluation process.
boolean value = client.getValue(Boolean.class, "keyOfMySetting", false);
```

When the user object parameter is specified on the requesting method, it takes precedence over the default user.

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.defaultUser(User.newBuilder().build("john@example.com"));
});

User otherUser = User.newBuilder().build("brian@example.com");

// otherUser will be used at the evaluation process.
boolean value = client.getValue(Boolean.class, "keyOfMySetting", otherUser, false);
```

For deleting the default user, you can do the following:

```java
client.clearDefaultUser();
```

## Polling Modes

The _ConfigCat SDK_ supports 3 different polling mechanisms to acquire the setting values from _ConfigCat_. After latest setting values are downloaded, they are stored in the internal cache then all `getValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.  
[More about polling modes.](/advanced/caching/)

### Auto polling (default)

The _ConfigCat SDK_ downloads the latest values and stores them automatically every 60 seconds.

Use the the `autoPollIntervalInSeconds` option parameter of the `PollingModes.autoPoll()` to change the polling interval.

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.pollingMode(PollingModes.autoPoll(60 /* polling interval in seconds */));
});
```

Available options:

| Option Parameter            | Description                                                                                         | Default |
| --------------------------- | --------------------------------------------------------------------------------------------------- | ------- |
| `autoPollIntervalInSeconds` | Polling interval.                                                                                   | 60      |
| `maxInitWaitTimeSeconds`    | Maximum waiting time between the client initialization and the first config acquisition in seconds. | 5       |

### Lazy loading

When calling `getValue()` the _ConfigCat SDK_ downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

Use the `cacheRefreshIntervalInSeconds` parameter of the `PollingModes.lazyLoad()` to set cache lifetime.

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.pollingMode(PollingModes.lazyLoad(60 /* the cache will expire in 120 seconds */));
});
```

Available options:

| Option Parameter                | Description | Default |
| ------------------------------- | ----------- | ------- |
| `cacheRefreshIntervalInSeconds` | Cache TTL.  | 60      |

### Manual polling

Manual polling gives you full control over when the `config.json` (with the setting values) is downloaded. ConfigCat SDK will not update them automatically. Calling `forceRefresh()` is your application's responsibility.

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.pollingMode(PollingModes.manualPoll());
});

client.forceRefresh();
```

> `getValue()` returns `defaultValue` if the cache is empty. Call `forceRefresh()` to update the cache.

## Hooks

With the following hooks you can subscribe to particular events fired by the SDK:

- `onClientReady()`: This event is sent when the SDK reaches the ready state. If the SDK is configured with lazy load or manual polling it's considered ready right after instantiation.
  If it's using auto polling, the ready state is reached when the SDK has a valid config.json loaded into memory either from cache or from HTTP. If the config couldn't be loaded neither from cache nor from HTTP the `onClientReady` event fires when the auto polling's `maxInitWaitTimeSeconds` is reached.

- `onConfigChanged(Map<String, Setting>)`: This event is sent when the SDK loads a valid config.json into memory from cache, and each subsequent time when the loaded config.json changes via HTTP.

- `onFlagEvaluated(EvaluationDetails)`: This event is sent each time when the SDK evaluates a feature flag or setting. The event sends the same evaluation details that you would get from [`getValueDetails()`](#anatomy-of-getvaluedetails).

- `onError(String)`: This event is sent when an error occurs within the ConfigCat SDK.

You can subscribe to these events either on SDK initialization:

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.hooks().addOnFlagEvaluated(details -> {
        /* handle the event */
    });
});
```

or with the `getHooks()` property of the ConfigCat client:

```java
client.getHooks().addOnFlagEvaluated(details -> {
    /* handle the event */
});
```

## Online / Offline mode

In cases when you'd want to prevent the SDK from making HTTP calls, you can put it in offline mode:

```java
client.setOffline();
```

In offline mode, the SDK won't initiate HTTP requests and will work only from its cache.

To put the SDK back in online mode, you can do the following:

```java
client.setOnline();
```

> With `client.isOffline()` you can check whether the SDK is in offline mode.

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local only** (`OverrideBehaviour.LOCAL_ONLY`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour.LOCAL_OVER_REMOTE`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour.REMOTE_OVER_LOCAL`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can load your feature flag & setting overrides from a `Map<String, Object>` structure.

```java
Map<String, Object> map = new HashMap<>();
map.put("enabledFeature", true);
map.put("disabledFeature", false);
map.put("intSetting", 5);
map.put("doubleSetting", 3.14);
map.put("stringSetting", "test");

ConfigCatClient client = ConfigCatClient.get("localhost", options -> {
    options.flagOverrides(OverrideDataSourceBuilder.map(map), OverrideBehaviour.LOCAL_ONLY);
});
```

## `getAllKeys()`, `getAllKeysAsync()`

You can get all the setting keys from your config.json by calling the `getAllKeys()` or `getAllKeysAsync()` method of the `ConfigCatClient`.

```java
ConfigCatClient client = new ConfigCatClient("#YOUR-SDK-KEY#");
java.util.Collection<String> keys = client.getAllKeys();
```

```java
ConfigCatClient client = new ConfigCatClient("#YOUR-SDK-KEY#");
client.getAllKeysAsync().thenAccept(keys -> {
    // use the keys
});
```

## `getAllValues()`, `getAllValuesAsync()`

Evaluates and returns the values of all feature flags and settings. Passing a User Object is optional.

```java
ConfigCatClient client = new ConfigCatClient("#YOUR-SDK-KEY#");
Map<String, Object> settingValues = client.getAllValues();

// invoke with user object
User user = User.newBuilder().build("#UNIQUE-USER-IDENTIFIER#")
Map<String, Object> settingValuesTargeting = client.getAllValues(user);
```

```java
ConfigCatClient client = new ConfigCatClient("#YOUR-SDK-KEY#");
client.getAllValuesAsync().thenAccept(settingValues -> { });

// invoke with user object
User user = User.newBuilder().build("#UNIQUE-USER-IDENTIFIER#")
client.getAllValuesAsync(user).thenAccept(settingValuesTargeting -> { });
```

## `getAllValueDetails()`, `getAllValueDetailsAsync()`

Evaluates and returns the detailed values of all feature flags and settings. Passing a User Object is optional.

```java
User user = User.newBuilder().build("#UNIQUE-USER-IDENTIFIER#");
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#");
List<EvaluationDetails<?>> allValueDetails = client.getAllValueDetails(user);
```

```java
User user = User.newBuilder().build("#UNIQUE-USER-IDENTIFIER#");
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#");
        client.getAllValueDetailsAsync(user).thenAccept(allValueDetails -> { });
```

## Cache

The SDK by default uses a memory-only cache.
If you want to change the default behavior, you can either use the built-in `SharedPreferencesCache` or your custom cache implementation.

The `SharedPreferencesCache` implementation uses the Android `SharedPreferences` to store the downloaded `config.json`.
`SharedPreferencesCache` has a dependency on `android.content.Context`, so it won't be enabled by default. The cache can be explicitly set by providing an appropriate `Context`.

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
        options.cache(new SharedPreferencesCache(getApplicationContext())); // Use ConfigCat's shared preferences cache. 
});
```

### Custom cache

You have the option to inject your custom cache implementation into the client. All you have to do is to inherit from the ConfigCache abstract class:

```java
public class MyCustomCache extends ConfigCache {

    @Override
    public String read(String key) {
        // here you have to return with the cached value
    }

    @Override
    public void write(String key, String value) {
        // here you have to store the new value in the cache
    }
}
```

Then use your custom cache implementation:

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.cache(new MyCustomCache()); // inject your custom cache
});
```

## HttpClient

The ConfigCat SDK internally uses an <a href="https://github.com/square/okhttp" target="_blank">OkHttpClient</a> instance to fetch the latest config.json over HTTP. You have the option to override the internal Http client with your customized one.

### HTTP Proxy

If your application runs behind a proxy you can do the following:

```java
Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("proxyHost", proxyPort));

ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.httpClient(new OkHttpClient.Builder()
                .proxy(proxy)
                .build());
});
```

### HTTP Timeout

You can set the maximum wait time for a ConfigCat HTTP response by using OkHttpClient's timeouts.

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    .httpClient(new OkHttpClient.Builder()
                .readTimeout(2, TimeUnit.SECONDS) // set the read timeout to 2 seconds
                .build());
});
```

OkHttpClient's default timeout is 10 seconds.

> As the ConfigCatClient SDK maintains the whole lifetime of the internal http client, it's being closed simultaneously with the ConfigCatClient, refrain from closing the http client manually.

### Force refresh

Call the `forceRefresh()` method on the client to download the latest config.json and update the cache.

## Logging

As the SDK uses the facade of [slf4j](https://www.slf4j.org) for logging, so you can use any of the slf4j implementation packages.

```
dependencies {
    implementation 'org.slf4j:slf4j-android:1.+'
}
```

You can change the verbosity of the logs by passing a `LogLevel` parameter to the ConfigCatClientBuilder's `logLevel` function.

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.logLevel(LogLevel.INFO);
});
```

Available log levels:

| Level     | Description                                                                             |
| --------- | --------------------------------------------------------------------------------------- |
| `NO_LOG`  | Turn the logging off.                                                                   |
| `ERROR`   | Only error level events are logged.                                                     |
| `WARNING` | Default. Errors and Warnings are logged.                                                |
| `INFO`    | Errors, Warnings and feature flag evaluation is logged.                                 |
| `DEBUG`   | All of the above plus debug info is logged. Debug logs can be different for other SDKs. |

Info level logging helps to inspect how a feature flag was evaluated:

```bash
INFO com.configcat.ConfigCatClient - Evaluating getValue(isPOCFeatureEnabled).
User object: User{Identifier=435170f4-8a8b-4b67-a723-505ac7cdea92, Email=john@example.com}
Evaluating rule: [Email:john@example.com] [CONTAINS] [@something.com] => no match
Evaluating rule: [Email:john@example.com] [CONTAINS] [@example.com] => match, returning "true"
```

## Sensitive information handling

The frontend/mobile SDKs are running in your users' browsers/devices. The SDK is downloading a [config.json](/requests/) file from ConfigCat's CDN servers. The URL path for this config.json file contains your SDK key, so the SDK key and the content of your config.json file (feature flag keys, feature flag values, targeting rules, % rules) can be visible to your users.
This SDK key is read-only, it only allows downloading your config.json file, but nobody can make any changes with it in your ConfigCat account.

If you do not want to expose the SDK key or the content of the config.json file, we recommend using the SDK in your backend components only. You can always create a backend endpoint using the ConfigCat SDK that can evaluate feature flags for a specific user, and call that backend endpoint from your frontend/mobile applications.

Also, we recommend using [confidential targeting comparators](/advanced/targeting/#confidential-text-comparators) in the targeting rules of those feature flags that are used in the frontend/mobile SDKs.

## Sample App

<a href="https://github.com/configcat/android-sdk/tree/master/samples/android" target="_blank">Android App with auto polling and change listener</a>

## Guides

See <a href="https://configcat.com/blog/2022/01/24/feature-flags-in-android/" target="_blank">this</a> guide on how to use ConfigCat's Android SDK.

## Look under the hood

- <a href="https://github.com/ConfigCat/android-sdk" target="_blank">ConfigCat Android SDK's repository on GitHub</a>
- <a href="https://javadoc.io/doc/com.configcat/configcat-android-client" target="_blank">ConfigCat Android SDK's javadoc page</a>
- <a href="https://search.maven.org/artifact/com.configcat/configcat-android-client" target="_blank">ConfigCat Android SDK on Maven Central</a>
