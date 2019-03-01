---
id: android
title: Android (Kotlin)
---

> The minimum supported sdk version is 26 (Oreo). Java 1.8 or later is required.

```
android {
    defaultConfig {
        //...
        minSdkVersion 26
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}
```

## Basic configuration:

1. Add the ConfigCat SDK to your project:
   ```
   compile 'com.configcat:configcat-client:2.+'
   ```
1. Import the ConfigCat SDK:
   ```java
   import com.configcat.*;
   ```
1. Create a ConfigCatClient using your API Key:
   ```java
   val client = ConfigCatClient("<PLACE-YOUR-API-KEY-HERE>")
   ```
1. (Optional) Prepare a User object for [Targeting](advanced/targeting.md) calculation
   ```java
   val user = User.newBuilder()
       .email("simple@but.awesome.com")
       .country("Awesomnia")
       .build("<PLACE-YOUR-USER-IDENTIFIER-HERE>")
   ```
1. Get your config value:
    ```java
    boolean isMyAwesomeFeatureEnabled = client.getValue(Boolean.class, "<key-of-my-awesome-feature>", user, false);
    if(isMyAwesomeFeatureEnabled) {
        //show your awesome feature to the world!
    }
    ```
    Or use the async APIs:
    ```java
    client.getValueAsync(Boolean.class, "<key-of-my-awesome-feature>", user, false)
        .thenAccept(isMyAwesomeFeatureEnabled -> {
            if(isMyAwesomeFeatureEnabled) {
                //show your awesome feature to the world!
            }
        });
    ```
   > We strongly recommend you to use the ConfigCatClient as a Singleton object in your application

## User object

Specific user or percentage-based targeting is calculated by the user object you should pass to the configuration requests.

### Identifying your user

The user object must be created with a **mandatory** identifier parameter which should uniquely identify each user. In most cases this could be the same or similar userID that exists in your application.

```java
val user = User.newBuilder()
        .build("<PLACE-YOUR-USER-IDENTIFIER-HERE>") // mandatory
```

### Using custom attributes

You can also set other custom attributes (e.g., Email address, Country) if you'd like to target your users based on them:

```java
Map<String,String> customAttributes = new HashMap<String,String>();
    customAttributes.put("SubscriptionType", "Free");
    customAttributes.put("Role", "Knight of Awesomnia");

val user = User.newBuilder()
    .email("simple@but.awesome.com")
    .country("Awesomnia")
    .custom(hashMapOf("SubscriptionType" to "Free", "Role" to "Knight of Awesomnia"))
    .build("<PLACE-YOUR-USER-IDENTIFIER-HERE>") // mandatory
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

## Refresh policies

The internal caching control and the communication between the client and ConfigCat are managed through a refresh policy. There are 3 predefined implementations built in the library.

### Auto polling policy (default)

This policy fetches the latest configuration and updates the cache repeatedly.

#### Poll interval

You have the option to configure the polling interval through the builder (it must be greater than 2 seconds, the default is 60):

```java
val client = ConfigCatClient.newBuilder()
    .refreshPolicy({ fetcher: ConfigFetcher, cache: ConfigCache ->
        AutoPollingPolicy.newBuilder()
            .autoPollIntervalInSeconds(120) // set the polling interval
            .build(fetcher, cache)})
    .build("<PLACE-YOUR-API-KEY-HERE>")
```

#### Change listeners

You can set change listeners that will be notified when a new configuration is fetched. The policy calls the listeners only, when the new configuration is differs from the cached one.

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

If you want to subscribe to the configuration changed event later in your applications lifetime, then you can do the following (this will only work when you have an auto polling refresh policy configured in the ConfigCatClient):

```java
client.getRefreshPolicy(AutoPollingPolicy.class)
    .addConfigurationChangeListener({ parser, newConfiguration ->
        // here you can parse the new configuration like this:
        // parser.parseValue(Boolean::class.java, newConfiguration, <key-of-my-awesome-feature>)
    })
```

### Expiring cache policy

This policy uses an expiring cache to maintain the internally stored configuration.

#### Cache refresh interval

You can define the refresh interval of the cache in seconds, after the initial cached value is set this value will be used to determine how much time must pass before initiating a new configuration fetch request through the `ConfigFetcher`.

```java
val client = ConfigCatClient.newBuilder()
    .refreshPolicy({ fetcher: ConfigFetcher, cache: ConfigCache ->
        ExpiringCachePolicy.newBuilder()
            .cacheRefreshIntervalInSeconds(120) // the cache will expire in 120 seconds
            .build(fetcher, cache)})
    .build("<PLACE-YOUR-API-KEY-HERE>")
```

#### Async / Sync refresh

You can define how do you want to handle the expiration of the cached configuration. If you choose asynchronous refresh then when a request is being made on the cache while it's expired, the previous value will be returned immediately until the fetching of the new configuration is completed.

```java
val client = ConfigCatClient.newBuilder()
    .refreshPolicy({ fetcher: ConfigFetcher, cache: ConfigCache ->
        ExpiringCachePolicy.newBuilder()
            .asyncRefresh(true) // the refresh will be executed asynchronously
            .build(fetcher, cache)})
    .build("<PLACE-YOUR-API-KEY-HERE>")
```

If you set the `.asyncRefresh()` to be `false`, the refresh operation will be awaited until the fetching of the new configuration is completed.

### Manual polling policy

With this policy every new configuration request on the ConfigCatClient will trigger a new fetch over HTTP.

```java
val client = ConfigCatClient.newBuilder()
    .refreshPolicy({ fetcher: ConfigFetcher, cache: ConfigCache -> ManualPollingPolicy(fetcher,cache)})
```

#### Custom Policy

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

#### Maximum wait time for synchronous calls

You have the option to set a timeout value for the synchronous methods of the library (`getValue()`, `forceRefresh()`) which means when a sync call takes longer than the timeout value, it'll return with the default.

```java
val client = ConfigCatClient.newBuilder()
    .maxWaitTimeForSyncCallsInSeconds(2) // set the max wait time
    .build("<PLACE-YOUR-API-KEY-HERE>")
```

#### Force refresh

Any time you want to refresh the cached configuration with the latest one, you can call the forceRefresh() method of the library, which will initiate a new fetch and will update the local cache.

## Sample App

<a href="https://github.com/configcat/java-sdk/tree/master/samples/android" target="_blank">Android App with auto polling and change listener</a>

There is more:

- <a href="https://github.com/ConfigCat/java-sdk" target="_blank">ConfigCat Android SDK's repository on Github</a>
- <a href="http://javadoc.io/doc/com.configcat/configcat-client" target="_blank">ConfigCat Android SDK's javadoc page</a>
- <a href="https://mvnrepository.com/artifact/com.configcat/configcat-client" target="_blank">ConfigCat Android SDK on MVNRepository</a>
- <a href="https://bintray.com/configcat/releases/configcat-client" target="_blank">ConfigCat Android SDK on jcenter</a>
