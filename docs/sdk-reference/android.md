---
id: android
title: Android (Kotlin)
---

> The minimum supported sdk version is 23 (Marshmallow). Java 1.8 or later is required.

```
android {
    defaultConfig {
        //...
        minSdkVersion 23
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}
```

## Getting Started:
### 1. Add the ConfigCat SDK to your project
```
implementation 'com.configcat:configcat-android-client:1.+'
```
### 2. Import the ConfigCat SDK:
```java
import com.configcat.*;
```
### 3. Create the *ConfigCat* client with your *API Key*
```java
val client = ConfigCatClient("<PLACE-YOUR-API-KEY-HERE>")
```
### 4. Get your setting value
```java
val isMyAwesomeFeatureEnabled = client.getValue(Boolean.class.java, "<key-of-my-awesome-feature>", user, false);
if(isMyAwesomeFeatureEnabled) {
    doTheNewThing()
} else {
    doTheOldThing()
}
```
Or use the async APIs:
```java
client.getValueAsync(Boolean.class.java, "<key-of-my-awesome-feature>", user, false)
    .thenAccept(isMyAwesomeFeatureEnabled -> {
        if(isMyAwesomeFeatureEnabled) {
            doTheNewThing()
        } else {
            doTheOldThing()
        }
    });
```

### 5. Stop *ConfigCat* client
You can safely shut down the client instance and release all associated resources on application exit.
```java
client.close()
```

## Creating the *ConfigCat Client*
*ConfigCat Client* is responsible for:
- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`ConfigCatClient(<apiKey>)` returns a client with default options.
| Builder options       | Description                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------|
| `apiKey()`            | **REQUIRED.** API Key to access your feature flags and configurations. Get it from *ConfigCat Management Console*.    |
| `httpClient()`        | Optional, sets the underlying `OkHttpClient` used to fetch the configuration over HTTP. [See below](#httpclient).     |
| `maxWaitTimeForSyncCallsInSeconds()`      | Optional, sets a timeout value for the synchronous methods of the library (`getValue()`, `forceRefresh()`) which means when a sync call takes longer than the timeout, it'll return with the default value. |
| `cache()`             | Optional, sets a custom cache implementation for the client. [See below](#custom-cache).                              |
| `refreshPolicy()`     | Optional, sets a custom refresh policy implementation for the client. [See below](#custom-policy).                    |

> We strongly recommend you to use the ConfigCatClient as a Singleton object in your application

## Anatomy of `getValue()`
| Parameters      | Description                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| `classOfT`      | **REQUIRED.** The type of the setting.                                                                          |
| `key`           | **REQUIRED.** Setting-specific key. Set in *ConfigCat Management Console* for each setting.                     |
| `defaultValue`  | **REQUIRED.** This value will be returned in case of an error.                                                  |
| `user`          | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](../../advanced/targeting) |
```java
val value = client.getValue(
    Boolean.class.java, // Setting type
    "keyOfMySetting", // Setting Key
    false, // Default value
    User.newBuilder().build('435170f4-8a8b-4b67-a723-505ac7cdea92') // Optional User Object
)
```

### User Object 
``` java
val user = User.newBuilder().build("435170f4-8a8b-4b67-a723-505ac7cdea92")   
```
``` java
val user = User.newBuilder().build("john@example.com")   
```
| Builder options   | Description                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier()`    | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                         |
| `email()`         | Optional parameter for easier targeting rule definitions.                                                                       |
| `country()`       | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom()`        | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |
``` java
val user = User.newBuilder()
    .email("john@example.com")
    .country("United Kingdom")
    .custom(hashMapOf("SubscriptionType" to "Pro", "UserRole" to "Admin"))
    .build("435170f4-8a8b-4b67-a723-505ac7cdea92")
```

## Polling Modes
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all requests are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.

### Auto polling (default)
The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

Use the the `autoPollIntervalInSeconds` option parameter of the `AutoPollingPolicy` to change the polling interval.
```java
val client = ConfigCatClient.newBuilder()
    .refreshPolicy({ fetcher: ConfigFetcher, cache: ConfigCache ->
        AutoPollingPolicy.newBuilder()
            .autoPollIntervalInSeconds(120) // set the polling interval
            .build(fetcher, cache)})
    .build("<PLACE-YOUR-API-KEY-HERE>")
```
Adding a callback to `configurationChangeListener` option parameter will get you notified about changes.
```java
val client = ConfigCatClient.newBuilder()
    .refreshPolicy({ fetcher: ConfigFetcher, cache: ConfigCache ->
        AutoPollingPolicy.newBuilder()
            .configurationChangeListener({parser, newConfiguration  ->
                // here you can parse the new configuration like this:
                // parser.parseValue(Boolean::class.java, newConfiguration, <key-of-my-awesome-feature>)
            })
            .build(fetcher, cache)})
    .build("<PLACE-YOUR-API-KEY-HERE>")
```

### Lazy loading
When calling `getValue()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

Use the `cacheRefreshIntervalInSeconds` option parameter of the `LazyLoadingPolicy` to set cache lifetime.
```java
val client = ConfigCatClient.newBuilder()
    .refreshPolicy({ fetcher: ConfigFetcher, cache: ConfigCache ->
        LazyLoadingPolicy.newBuilder()
            .cacheRefreshIntervalInSeconds(120) // the cache will expire in 120 seconds
            .build(fetcher, cache)})
    .build("<PLACE-YOUR-API-KEY-HERE>")
```
Use the `asyncRefresh` option parameter of the `LazyLoadingPolicy` to define how do you want to handle the expiration of the cached configuration. If you choose asynchronous refresh then when a request is being made on the cache while it's expired, the previous value will be returned immediately until the fetching of the new configuration is completed.
```java
val client = ConfigCatClient.newBuilder()
    .refreshPolicy({ fetcher: ConfigFetcher, cache: ConfigCache ->
        LazyLoadingPolicy.newBuilder()
            .asyncRefresh(true) // the refresh will be executed asynchronously
            .build(fetcher, cache)})
    .build("<PLACE-YOUR-API-KEY-HERE>")
```
If you set the `.asyncRefresh()` to `false`, the refresh operation will be awaited until the fetching of the new configuration is completed.

### Manual polling
With this policy every new configuration request on the ConfigCatClient will trigger a new fetch over HTTP.
```java
val client = ConfigCatClient.newBuilder()
    .refreshPolicy({ fetcher: ConfigFetcher, cache: ConfigCache -> ManualPollingPolicy(fetcher,cache)})
```

### Custom Policy

You can also implement your custom refresh policy by extending the RefreshPolicy abstract class.

```java
class MyCustomPolicy(fetcher: ConfigFetcher, cache: ConfigCache)
    : RefreshPolicy(fetcher, cache) {

    override fun getConfigurationJsonAsync(): CompletableFuture<String> {
        // this method will be called when the configuration is requested from the ConfigCatClient.
        // you can access the config fetcher through the super.fetcher() and the internal cache via super.cache()
    }

    // optional, in case if you have any resources that should be closed
    override fun close() {
        super.close()
        // here you can close your resources
    }
}
```

> If you decide to override the `close()` method, you should also call the `super.close()` to tear the cache appropriately down.

Then you can simply inject your custom policy implementation into the ConfigCatClient:

```java
val client = ConfigCatClient.newBuilder()
    .refreshPolicy({ fetcher: ConfigFetcher, cache: ConfigCache -> MyCustomPolicy(fetcher, cache)}) // inject your custom policy
    .build("<PLACE-YOUR-API-KEY-HERE>")
```

## Custom cache

You have the option to inject your custom cache implementation into the client. All you have to do is to inherit from the ConfigCache abstract class:

```java
class MyCustomCache : ConfigCache() {
    override fun read() : String {
        // here you have to return with the cached value
        // you can access the latest cached value in case
        // of a failure like: super.inMemoryValue()
    }

    override fun write(value: String) {
        // here you have to store the new value in the cache
    }
}
```

Then use your custom cache implementation:

```java
val client = ConfigCatClient.newBuilder()
    .cache(MyCustomCache()) // inject your custom cache
    .build("<PLACE-YOUR-API-KEY-HERE>")
```

## HttpClient

The ConfigCat SDK internally uses an <a href="https://github.com/square/okhttp" target="_blank">OkHttpClient</a> instance to fetch the latest configuration over HTTP. You have the option to override the internal Http client with your customized one. For example if your application runs behind a proxy you can do the following:

```java
val proxy = Proxy(Proxy.Type.HTTP, InetSocketAddress("proxyHost", proxyPort))
val client = ConfigCatClient.newBuilder()
    .httpClient(OkHttpClient.Builder()
                .proxy(proxy)
                .build())
    .build("<PLACE-YOUR-API-KEY-HERE>")
```

> As the ConfigCat SDK maintains the whole lifetime of the internal http client, it's being closed simultaneously with the ConfigCatClient, refrain from closing the http client manually.

### Force refresh
Any time you want to refresh the cached configuration with the latest one, you can call the `forceRefresh()` method of the library, which will initiate a new fetch and will update the local cache.

## Sample App

<a href="https://github.com/configcat/java-sdk/tree/master/samples/android" target="_blank">Android App with auto polling and change listener</a>

There is more:

- <a href="https://github.com/ConfigCat/android-sdk" target="_blank">ConfigCat Android SDK's repository on Github</a>
- <a href="http://javadoc.io/doc/com.configcat/configcat-client" target="_blank">ConfigCat Android SDK's javadoc page</a>
- <a href="https://mvnrepository.com/artifact/com.configcat/configcat-android-client" target="_blank">ConfigCat Android SDK on MVNRepository</a>
- <a href="https://bintray.com/configcat/releases/configcat-android-client" target="_blank">ConfigCat Android SDK on jcenter</a>
