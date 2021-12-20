---
id: java
title: Java
---
[![Star on GitHub](https://img.shields.io/github/stars/configcat/java-sdk.svg?style=social)](https://github.com/configcat/java-sdk/stargazers)
[![Build Status](https://travis-ci.com/configcat/java-sdk.svg?branch=master)](https://travis-ci.com/configcat/java-sdk)
[![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.configcat/configcat-java-client/badge.svg)](https://maven-badges.herokuapp.com/maven-central/com.configcat/configcat-java-client)
[![Coverage Status](https://img.shields.io/codecov/c/github/ConfigCat/java-sdk.svg)](https://codecov.io/gh/ConfigCat/java-sdk)
[![Javadocs](http://javadoc.io/badge/com.configcat/configcat-java-client.svg)](http://javadoc.io/doc/com.configcat/configcat-java-client)

## Getting Started:
### 1. Add the ConfigCat SDK to your project

Maven:
```
<dependency>
  <groupId>com.configcat</groupId>
  <artifactId>configcat-java-client</artifactId>
  <version>[7.0.0,)</version>
</dependency>
```
Gradle:
```bash
compile group: 'com.configcat', name: 'configcat-java-client', version: '7.+'
```
### 2. Import the ConfigCat SDK:
```java
import com.configcat.*;
```
### 3. Create the *ConfigCat* client with your *SDK Key*
```java
ConfigCatClient client = new ConfigCatClient("<PLACE-YOUR-SDK-KEY-HERE>");
```
### 4. Get your setting value
```java
boolean isMyAwesomeFeatureEnabled = client.getValue(Boolean.class, "<key-of-my-awesome-feature>", false);
if(isMyAwesomeFeatureEnabled) {
    doTheNewThing();
} else {
    doTheOldThing();
}
```

### 5. Stop *ConfigCat* client
You can safely shut down the client instance and release all associated resources on application exit.
```java
client.close()
```

## Java compatibility
The ConfigCat Java SDK is compatible with Java 8 and higher.

## Creating the *ConfigCat Client*
*ConfigCat Client* is responsible for:
- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`new ConfigCatClient(<sdkKey>)` returns a client with default options.
### Builder
```java
ConfigCatClient client = ConfigCatClient.newBuilder()
    .mode(PollingModes.autoPoll(60))
    .build(<sdkkey>);
```

| Builder options                         | Description                                                                                                                                                                                                                                                                                         |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build(<sdkkey>)`                       | **REQUIRED.** Waits for the SDK Key to access your feature flags and configurations. Get it from *ConfigCat Dashboard*.                                                                                                                                                                             |
| `dataGovernance(DataGovernance)`        | Optional, defaults to `Global`. Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `Global`, `EuOnly`. |
| `baseUrl(string)`                       | *Obsolete* Optional, sets the CDN base url (forward proxy, dedicated subscription) from where the sdk will download the configurations.                                                                                                                                                             |
| `httpClient(OkHttpClient)`              | Optional, sets the underlying `OkHttpClient` used to fetch the configuration over HTTP. [See below](#httpclient).                                                                                                                                                                                   |
| `cache(ConfigCache)`                    | Optional, sets a custom cache implementation for the client. [See below](#custom-cache).                                                                                                                                                                                                            |
| `mode(PollingMode)`         | Optional, sets the polling mode for the client. [See below](#polling-modes).                                                                                                                                                                                                                      |
| `logLevel(LogLevel)`         | Optional, defaults to `WARNING`. Sets the internal log level. [See below](#logging).                                                                                                                                                                                                                      |

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
```java
boolean value = client.getValue(
    Boolean.class, // Setting type
    "keyOfMySetting", // Setting Key
    User.newBuilder().build("435170f4-8a8b-4b67-a723-505ac7cdea92"), // Optional User Object
    false // Default value
);
```

## Anatomy of `getValueAsync()`
| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `classOfT`     | **REQUIRED.** The type of the setting.                                                                       |
| `key`          | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                           |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
```java
client.getValueAsync(
    Boolean.class, // Setting type
    "keyOfMySetting", // Setting Key
    User.newBuilder().build("435170f4-8a8b-4b67-a723-505ac7cdea92"), // Optional User Object
    false // Default value
).thenAccept(isMyAwesomeFeatureEnabled -> {
    if(isMyAwesomeFeatureEnabled) {
        doTheNewThing();
    } else {
        doTheOldThing();
    }
});
```

### User Object
The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature. 
``` java
User user = User.newBuilder().build("435170f4-8a8b-4b67-a723-505ac7cdea92");   
```
``` java
User user = User.newBuilder().build("john@example.com");   
```
| Builder options | Description                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier()`  | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                         |
| `email()`       | Optional parameter for easier targeting rule definitions.                                                                       |
| `country()`     | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom()`      | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |
``` java
java.util.Map<String,String> customAttributes = new java.util.HashMap<String,String>();
    customAttributes.put("SubscriptionType", "Pro");
    customAttributes.put("UserRole", "Admin");

User user = User.newBuilder()
    .email("john@example.com")
    .country("United Kingdom")
    .custom(customAttributes)
    .build("435170f4-8a8b-4b67-a723-505ac7cdea92");
```

## `getAllKeys()`
You can get all the setting keys from your configuration by calling the `getAllKeys()` method of the `ConfigCatClient`.

```java
ConfigCatClient client = new ConfigCatClient("#YOUR-SDK-KEY#");
java.util.Collection<String> keys = client.getAllKeys();
```

## Polling Modes
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all `getValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.

### Auto polling (default)
The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

Use the the `autoPollIntervalInSeconds` option parameter of the `PollingModes.autoPoll()` to change the polling interval.
```java
ConfigCatClient client = ConfigCatClient.newBuilder()
    .mode(PollingModes.autoPoll(60 /* polling interval in seconds */))
    .build("<PLACE-YOUR-SDK-KEY-HERE>");
```
Adding a callback to `configurationChangeListener` option parameter will get you notified about changes.
```java
ConfigCatClient client = ConfigCatClient.newBuilder()
    .mode(PollingModes.autoPoll(
        60 /* polling interval in seconds */,
        () -> {
            // here you can subscribe to configuration changes 
        })
    )
    .build("<PLACE-YOUR-SDK-KEY-HERE>");
```

Available options:

| Option Parameter                    | Description                              | Default |
| ----------------------------------- | ---------------------------------------- | ------- |
| `autoPollIntervalInSeconds`         | Polling interval.                        | 60      |
| `maxInitWaitTimeSeconds`            | Maximum waiting time between the client initialization and the first config acquisition in seconds. | 5       |
| `configurationChangeListener`       | Callback to get notified about changes.  | -       |

### Lazy Loading
When calling `getValue()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

Use the `cacheRefreshIntervalInSeconds` option parameter of the `PollingModes.lazyLoad()` to set cache lifetime.
```java
ConfigCatClient client = ConfigCatClient.newBuilder()
    .mode(PollingModes.lazyLoad(60 /* the cache will expire in 120 seconds */))
    .build("<PLACE-YOUR-SDK-KEY-HERE>");
```
Use the `asyncRefresh` option parameter of the `PollingModes.lazyLoad()` to define how do you want to handle the expiration of the cached configuration. If you choose asynchronous refresh then when a `getValue()` calls is made while the cache is expired, the previous value will be returned immediately until the fetching of the new configuration is completed.
```java
ConfigCatClient client = ConfigCatClient.newBuilder()
    .mode(PollingModes.lazyLoad(
        120, // the cache will expire in 120 seconds
        true // the refresh will be executed asynchronously
        )
    )
    .build("<PLACE-YOUR-SDK-KEY-HERE>");
```
If you set the `asyncRefresh` to `false`, the refresh operation will be awaited until the fetching of the new configuration is completed.

Available options:

| Option Parameter                | Description                  | Default |
| ------------------------------- | ---------------------------- | ------- |
| `cacheRefreshIntervalInSeconds` | Cache TTL.                   | 60      |
| `useAsyncRefresh`               | Asynchronous refresh.      | false   |

### Manual Polling
Manual polling gives you full control over when the `config.json` (with the setting values) is downloaded. ConfigCat SDK will not update them automatically. Calling `forceRefresh()` is your application's responsibility.
```java
ConfigCatClient client = ConfigCatClient.newBuilder()
    .mode(PollingModes.manualPoll())
    .build("#YOUR-SDK-KEY#");

client.forceRefresh();
```
> `getValue()` returns `defaultValue` if the cache is empty. Call `forceRefresh()` to update the cache.

## Flag Overrides

With flag overrides you can overwrite the feature flag & setting configuration fetched from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the fetched configuration. The following 3 behaviours are supported:

- **Local only** (`OverrideBehaviour.LOCAL_ONLY`): With this mode, the SDK won't fetch feature flags & settings from the ConfigCat CDN and will use only the local overrides to evaluate feature flags. This mode is designed to support disonnected environments. You can use it in your development environment, automated tests, or isolated production machines.

- **Local over remote** (`OverrideBehaviour.LOCAL_OVER_REMOTE`): With this mode, the SDK will fetch feature flags & settings from the ConfigCat CDN and will override those that have a matching key.

- **Remote over local** (`OverrideBehaviour.REMOTE_OVER_LOCAL`): With this mode, the SDK will fetch feature flags & settings from the ConfigCat CDN and will use the overrides for those flags only that doesn't exist in the fetched configuration.

You can load your feature flag & setting overrides from a file or from a simple `Map<String, Object>` structure.

### JSON File

The SDK can be configured to load your feature flag & setting overrides from a file or classpath resource. 
You can also specify whether the file should be reloaded when it gets modified.
#### File
```java
ConfigCatClient client = ConfigCatClient.newBuilder()
    flagOverrides(OverrideDataSourceBuilder.localFile(
            "path/to/the/local_flags.json", // path to the file
            true // reload the file when it gets modified
        ), 
        OverrideBehaviour.LOCAL_ONLY // local/offline mode
    )
    .build("localhost");
```
#### Classpath Resource
```java
ConfigCatClient client = ConfigCatClient.newBuilder()
    flagOverrides(OverrideDataSourceBuilder.classPathResource(
            "local_flags.json", // name of the resource
            true // reload the resource when it gets modified
        ), 
        OverrideBehaviour.LOCAL_ONLY // local/offline mode
    )
    .build("localhost");
```
#### JSON File Structure
The SDK supports 2 types of JSON structures to describe feature flags & settings.

##### 1. Simple (key-value) structure
```json
{
  "flags": {
    "enabledFeature": true,
    "disabledFeature": false,
    "intSetting": 5,
    "doubleSetting": 3.14,
    "stringSetting": "test"
  }
}
```

##### 2. Complex (full-featured) structure
This is the same format that the SDK fetches from the ConfigCat CDN. 
It allows the usage of all features you can do on the ConfigCat Dashboard.
```json
{
    "f": { // list of feature flags & settings
        "isFeatureEnabled": { // key of a particular flag
            "v": false, // default value, served when no rules are defined
            "i": "430bded3", // variation id (for analytical purposes)
            "t": 0, // feature flag's type, possible values: 
                    // 0 -> BOOLEAN 
                    // 1 -> STRING
                    // 2 -> INT
                    // 3 -> DOUBLE
            "p": [ // list of percentage rules
                { 
                    "o": 0, // rule's order
                    "v": true, // value served when the rule is selected during evaluation
                    "p": 10, // % value
                    "i": "bcfb84a7" // variation id (for analytical purposes)
                },
                {
                    "o": 1, // rule's order
                    "v": false, // value served when the rule is selected during evaluation
                    "p": 90, // % value
                    "i": "bddac6ae" // variation id (for analytical purposes)
                }
            ],
            "r": [ // list of targeting rules
                {
                    "o": 0, // rule's order
                    "a": "Identifier", // comparison attribute
                    "t": 2, // comparator, possible values:
                        // 0  -> 'IS ONE OF',
                        // 1  -> 'IS NOT ONE OF',
                        // 2  -> 'CONTAINS',
                        // 3  -> 'DOES NOT CONTAIN',
                        // 4  -> 'IS ONE OF (SemVer)',
                        // 5  -> 'IS NOT ONE OF (SemVer)',
                        // 6  -> '< (SemVer)',
                        // 7  -> '<= (SemVer)',
                        // 8  -> '> (SemVer)',
                        // 9  -> '>= (SemVer)',
                        // 10 -> '= (Number)',
                        // 11 -> '<> (Number)',
                        // 12 -> '< (Number)',
                        // 13 -> '<= (Number)',
                        // 14 -> '> (Number)',
                        // 15 -> '>= (Number)',
                        // 16 -> 'IS ONE OF (Sensitive)',
                        // 17 -> 'IS NOT ONE OF (Sensitive)'
                    "c": "@example.com", // comparison value
                    "v": true, // value served when the rule is selected during evaluation
                    "i": "bcfb84a7" // variation id (for analytical purposes)
                }
            ]
        },
    }
}
```
> For a baseline, you can download your configuration from ConfigCat's CDN and use it as-is in a file.

### Map
You can configure the SDK to load your feature flag & setting overrides from a `Map<String, Object>`.
```java
Map<String, Object> map = new HashMap<>();
map.put("enabledFeature", true);
map.put("disabledFeature", false);
map.put("intSetting", 5);
map.put("doubleSetting", 3.14);
map.put("stringSetting", "test");

ConfigCatClient client = ConfigCatClient.newBuilder()
        .flagOverrides(OverrideDataSourceBuilder.map(map), OverrideBehaviour.LOCAL_ONLY)
        .build("localhost");
```

## Custom Cache
You have the option to inject your custom cache implementation into the client. All you have to do is to inherit from the `ConfigCache` abstract class:
```java
public class MyCustomCache extends ConfigCache {
    
    @Override
    public String read(String key) {
        // here you have to return with the cached value
        // you can access the latest cached value in case 
        // of a failure like: super.inMemoryValue();
    }

    @Override
    public void write(String key, String value) {
        // here you have to store the new value in the cache
    }
}
```
Then use your custom cache implementation:
```java
ConfigCatClient client = ConfigCatClient.newBuilder()
    .cache(new MyCustomCache()) // inject your custom cache
    .build("<PLACE-YOUR-SDK-KEY-HERE>");
```

## HttpClient
The ConfigCat SDK internally uses an <a href="https://github.com/square/okhttp" target="_blank">OkHttpClient</a> instance to fetch the latest configuration over HTTP. You have the option to override the internal Http client with your customized one. 

### HTTP Proxy
If your application runs behind a proxy you can do the following:
```java
import java.net.InetSocketAddress;
import java.net.Proxy;

Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("proxyHost", proxyPort));

ConfigCatClient client = ConfigCatClient.newBuilder()
    .httpClient(new OkHttpClient.Builder()
                .proxy(proxy)
                .build())
    .build("<PLACE-YOUR-SDK-KEY-HERE>");
```

### HTTP Timeout
You can set the maximum wait time for a ConfigCat HTTP response by using OkHttpClient's timeouts.
```java
ConfigCatClient client = ConfigCatClient.newBuilder()
    .httpClient(new OkHttpClient.Builder()
                .readTimeout(2, TimeUnit.SECONDS) // set the read timeout to 2 seconds
                .build())
    .build("<PLACE-YOUR-SDK-KEY-HERE>");
```
OkHttpClient's default timeout is 10 seconds.

> As the ConfigCatClient SDK maintains the whole lifetime of the internal http client, it's being closed simultaneously with the ConfigCatClient, refrain from closing the http client manually.

## Force refresh
Any time you want to refresh the cached configuration with the latest one, you can call the `forceRefresh()` method of the library, which will initiate a new fetch and will update the local cache.

## Logging
As the SDK uses the facade of [slf4j](https://www.slf4j.org) for logging, so you can use any of the slf4j implementation packages. 
```
dependencies {
    compile group: 'org.slf4j', name: 'slf4j-simple', version: '1.+'
}
```

You can change the verbosity of the logs by passing a `LogLevel` parameter to the ConfigCatClientBuilder's `logLevel` function.
```java
ConfigCatClient client = ConfigCatClient.newBuilder()
    .logLevel(LogLevel.INFO)
    .build("<PLACE-YOUR-SDK-KEY-HERE>");
```

Available log levels:

| Level      | Description                                                                             |
| ---------- | --------------------------------------------------------------------------------------- |
| `NO_LOG`   | Turn the logging off.                                                         |
| `ERROR`    | Only error level events are logged.                                                     |
| `WARNING`  | Errors and Warnings are logged.                                                         |
| `INFO`     | Errors, Warnings and feature flag evaluation is logged.                                 |
| `DEBUG`    | All of the above plus debug info is logged. Debug logs can be different for other SDKs. |

> The default level is `WARNING`. With `NO_LOG` you can turn the logging completely off.

Info level logging helps to inspect the feature flag evaluation process:
```bash
INFO com.configcat.ConfigCatClient - Evaluating getValue(isPOCFeatureEnabled).
User object: User{Identifier=435170f4-8a8b-4b67-a723-505ac7cdea92, Email=john@example.com}
Evaluating rule: [Email:john@example.com] [CONTAINS] [@something.com] => no match
Evaluating rule: [Email:john@example.com] [CONTAINS] [@example.com] => match, returning "true"
```

## Sample Apps
Check out our Sample Applications how they use the ConfigCat SDK
- <a href="https://github.com/ConfigCat/java-sdk/tree/master/samples/console" target="_blank">Simple Console Application</a>
- <a href="https://github.com/ConfigCat/java-sdk/tree/master/samples/web" target="_blank">Spring Boot Web Application</a>

## Look Under the Hood
- <a href="https://github.com/ConfigCat/java-sdk" target="_blank">ConfigCat Java SDK's repository on Github</a>
- <a href="http://javadoc.io/doc/com.configcat/configcat-java-client" target="_blank">ConfigCat Java SDK's javadoc page</a>
- <a href="https://mvnrepository.com/artifact/com.configcat/configcat-java-client" target="_blank">ConfigCat Java SDK on MVN Repository</a>
- <a href="https://bintray.com/configcat/releases/configcat-java-client" target="_blank">ConfigCat Java SDK on jcenter</a>
