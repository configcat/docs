---
id: java
title: Java
---
## Getting Started:
### 1. Add the ConfigCat SDK to your project

Maven:
```
<dependency>
    <groupId>com.configcat</groupId>
    <artifactId>configcat-java-client</artifactId>
    <version>[3.0.0,)</version>
</dependency>
```
Gradle:
```bash
compile group: 'com.configcat', name: 'configcat-java-client', version: '3.+'
```
### 2. Import the ConfigCat SDK:
```java
import com.configcat.*;
```
### 3. Create the *ConfigCat* client with your *API Key*
```java
ConfigCatClient client = new ConfigCatClient("<PLACE-YOUR-API-KEY-HERE>");
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
Or use the async APIs:
```java
client.getValueAsync(Boolean.class, "<key-of-my-awesome-feature>", false)
    .thenAccept(isMyAwesomeFeatureEnabled -> {
        if(isMyAwesomeFeatureEnabled) {
            doTheNewThing();
        } else {
            doTheOldThing();
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

`new ConfigCatClient(<apiKey>)` returns a client with default options.
### Builder
```java
ConfigCatClient.newBuilder()
    .maxWaitTimeForSyncCallsInSeconds(5)
    .build(<apikey>);
```

| Builder options                                                        | Description                                                                                                                                                                                                 |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build(<apikey>)`                                                      | **REQUIRED.** Waits for the API Key to access your feature flags and configurations. Get it from *ConfigCat Dashboard*.                                                                            |
| `baseUrl(string)`                                                      | *Obsolete* Optional, sets the CDN base url (forward proxy, dedicated subscription) from where the sdk will download the configurations.                                                                     |
| `httpClient(OkHttpClient)`                                             | Optional, sets the underlying `OkHttpClient` used to fetch the configuration over HTTP. [See below](#httpclient).                                                                                           |
| `maxWaitTimeForSyncCallsInSeconds(int)`                                | Optional, sets a timeout value for the synchronous methods of the library (`getValue()`, `forceRefresh()`) which means when a sync call takes longer than the timeout, it'll return with the default value. |
| `cache(ConfigCache)`                                                   | Optional, sets a custom cache implementation for the client. [See below](#custom-cache).                                                                                                                    |
| `mode(PollingMode pollingMode)`                                        | Optional, sets the polling mode for the client. [See below](#polling-modes).                                                                                                          |

> We strongly recommend you to use the ConfigCatClient as a Singleton object in your application

## Anatomy of `getValue()`
| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `classOfT`     | **REQUIRED.** The type of the setting.                                                                       |
| `key`          | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                  |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
```java
Boolean value = client.getValue(
    Boolean.class, // Setting type
    "keyOfMySetting", // Setting Key
    User.newBuilder().build("435170f4-8a8b-4b67-a723-505ac7cdea92"), // Optional User Object
    false // Default value
);
```

### User Object
The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting]((advanced/targeting.md)) feature. 
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
Map<String,String> customAttributes = new HashMap<String,String>();
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
ConfigCatClient client = ConfigCatClient("#YOUR-API-KEY#");
Collection<String> keys = client.getAllKeys();
```

## Polling Modes
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all requests are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.

### Auto polling (default)
The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

Use the the `autoPollIntervalInSeconds` option parameter of the `PollingModes.AutoPoll()` to change the polling interval.
```java
ConfigCatClient client = ConfigCatClient.newBuilder()
    .mode(PollingModes.AutoPoll(120 /* polling interval in seconds */))
    .build("<PLACE-YOUR-API-KEY-HERE>")
```
Adding a callback to `configurationChangeListener` option parameter will get you notified about changes.
```java
ConfigCatClient client = ConfigCatClient.newBuilder()
    .mode(PollingModes.AutoPoll(
        120 /* polling interval in seconds */,
        (parser, newConfiguration) -> {
                // here you can parse the new configuration like this: 
                // parser.parseValue(Boolean.class, newConfiguration, <key-of-my-awesome-feature>)
        })
    )
    .build("<PLACE-YOUR-API-KEY-HERE>");
```

### Lazy loading
When calling `getValue()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

Use the `cacheRefreshIntervalInSeconds` option parameter of the `PollingModes.LazyLoad()` to set cache lifetime.
```java
ConfigCatClient client = ConfigCatClient.newBuilder()
    .mode(PollingModes.LazyLoad(120 /* the cache will expire in 120 seconds */))
    .build("<PLACE-YOUR-API-KEY-HERE>");
```
Use the `asyncRefresh` option parameter of the `PollingModes.LazyLoad()` to define how do you want to handle the expiration of the cached configuration. If you choose asynchronous refresh then when a request is being made on the cache while it's expired, the previous value will be returned immediately until the fetching of the new configuration is completed.
```java
ConfigCatClient client = ConfigCatClient.newBuilder()
    .mode(PollingModes.LazyLoad(
        120, // the cache will expire in 120 seconds
        true // the refresh will be executed asynchronously
        )
    )
    .build("<PLACE-YOUR-API-KEY-HERE>");
```
If you set the `asyncRefresh` to `false`, the refresh operation will be awaited until the fetching of the new configuration is completed.

### Manual polling
With this policy every new configuration request on the ConfigCatClient will trigger a new fetch over HTTP.
```java
ConfigCatClient client = ConfigCatClient.newBuilder()
    .mode(PollingModes.ManualPoll())
    .build("<PLACE-YOUR-API-KEY-HERE>");
```
## Custom cache
You have the option to inject your custom cache implementation into the client. All you have to do is to inherit from the `ConfigCache` abstract class:
```java
public class MyCustomCache extends ConfigCache {
    
    @Override
    public String read() {
        // here you have to return with the cached value
        // you can access the latest cached value in case 
        // of a failure like: super.inMemoryValue();
    }

    @Override
    public void write(String value) {
        // here you have to store the new value in the cache
    }
}
```
Then use your custom cache implementation:
```java
ConfigCatClient client = ConfigCatClient.newBuilder()
    .cache(new MyCustomCache()) // inject your custom cache
    .build("<PLACE-YOUR-API-KEY-HERE>");
```

## HttpClient
The ConfigCat SDK internally uses an <a href="https://github.com/square/okhttp" target="_blank">OkHttpClient</a> instance to fetch the latest configuration over HTTP. You have the option to override the internal Http client with your customized one. For example if your application runs behind a proxy you can do the following:
```java
Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("proxyHost", proxyPort));

ConfigCatClient client = ConfigCatClient.newBuilder()
    .httpClient(new OkHttpClient.Builder()
                .proxy(proxy)
                .build())
    .build("<PLACE-YOUR-API-KEY-HERE>");
```
> As the ConfigCatClient SDK maintains the whole lifetime of the internal http client, it's being closed simultaneously with the ConfigCatClient, refrain from closing the http client manually.

### Force refresh
Any time you want to refresh the cached configuration with the latest one, you can call the `forceRefresh()` method of the library, which will initiate a new fetch and will update the local cache.

## Logging
As the SDK uses the facade of [slf4j](https://www.slf4j.org) for logging you can use any of the slf4j implementation package. 
```
dependencies {
    compile group: 'org.slf4j', name: 'slf4j-simple', version: '1.+'
}
```

## Sample Apps
Check out our Sample Applications how they use the ConfigCat SDK
* <a href="https://github.com/ConfigCat/java-sdk/tree/master/samples/console" target="_blank">Simple Console Application</a>
* <a href="https://github.com/ConfigCat/java-sdk/tree/master/samples/web" target="_blank">Web Application</a> with Dependency Injection that uses [ConfigCat Webhooks](advanced/notifications-webhooks.md) to get notified about configuration updates

Look under the hood
* <a href="https://github.com/ConfigCat/java-sdk" target="_blank">ConfigCat Java SDK's repository on Github</a>
* <a href="http://javadoc.io/doc/com.configcat/configcat-java-client" target="_blank">ConfigCat Java SDK's javadoc page</a>
* <a href="https://mvnrepository.com/artifact/com.configcat/configcat-java-client" target="_blank">ConfigCat Java SDK on MVN Repository</a>
* <a href="https://bintray.com/configcat/releases/configcat-java-client" target="_blank">ConfigCat Java SDK on jcenter</a>
