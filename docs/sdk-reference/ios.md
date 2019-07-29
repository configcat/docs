---
id: ios
title: iOS
---
## Getting Started:
### 1. Add the ConfigCat SDK to your project
*CocoaPods*
```
target '<YOUR TARGET>' do
pod 'ConfigCat'
end
```
Then, run the following command to install your dependencies:
```
pod install
```
*Carthage*
```
github "configcat/swift-sdk"
```
Then, run the carthage update command and then follow the Carthage integration steps to link the framework with your project.
### 2. Import the ConfigCat SDK:
```swift
import ConfigCat
 ```
### 3. Create the *ConfigCat* client with your *API Key*
```swift
let client = ConfigCatClient(apiKey: "<PLACE-YOUR-API-KEY-HERE>")
```
### 4. Get your setting value
```swift
let isMyAwesomeFeatureEnabled = client.getValue(for: "key-of-my-awesome-feature", defaultValue: false, user: user)
if(isMyAwesomeFeatureEnabled) {
    doTheNewThing()
} else {
    doTheOldThing()
}
```
Or use the async APIs:
```swift
client.getValueAsync(for: "key-of-my-awesome-feature", defaultValue: false, completion: { isMyAwesomeFeatureEnabled in
    if(isMyAwesomeFeatureEnabled) {
        doTheNewThing()
    } else {
        doTheOldThing()
    }
})
```

## Creating the *ConfigCat Client*
*ConfigCat Client* is responsible for:
- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`ConfigCatClient(apiKey: <apiKey>)` returns a client with default options.
| Arguments              | Type                 | Description                                                                                                           |
| ---------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------|
| `apiKey`               | string               | **REQUIRED.** API Key to access your feature flags and configurations. Get it from *ConfigCat Management Console*.    |
| `baseUrl`              | string               | Optional, sets the CDN base url (forward proxy, dedicated subscription) from where the sdk will download the configurations.    |
| `configCache`          | ConfigCache?         | Optional, sets a custom cache implementation for the client. [See below](#custom-cache).       |
| `maxWaitTimeForSyncCallsInSeconds` | int | Optional, sets a timeout value for the synchronous methods of the library (`getValue()`, `forceRefresh()`) which means when a sync call takes longer than the timeout, it'll return with the default value. |
| `sessionConfiguration` | URLSessionConfiguration | Optional, sets a custom `URLSessionConfiguration` used by the HTTP calls.                                             |
| `policyFactory`        | ((ConfigCache, ConfigFetcher) -> RefreshPolicy)? | Optional, sets a custom refresh policy implementation for the client. [See below](#custom-policy).                    | 

> We strongly recommend you to use the ConfigCatClient as a Singleton object in your application

## Anatomy of `getValue()`
| Parameters      | Description                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| `key`           | **REQUIRED.** Setting-specific key. Set in *ConfigCat Management Console* for each setting.                     |
| `defaultValue`  | **REQUIRED.** This value will be returned in case of an error.                                                  |
| `user`          | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](../../advanced/targeting) |
```swift
let value = client.getValue(
    for: "keyOfMySetting", // Setting Key
    defaultValue: false, // Default value
    user: User(identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92") // Optional User Object
)
```

## `getAllKeys()`
You can get all the setting keys from your configuration by calling the `getAllKeys()` method of the `ConfigCatClient`.

```go
let client = ConfigCatClient(apiKey: "#YOUR-API-KEY#")
let keys = client.getAllKeys()
```

### User Object 
```swift
let user = User(identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92")   
```
```swift
let user = User(identifier: "john@example.com")   
```
| Arguments       |   Description                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier`    | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                         |
| `email`         | Optional parameter for easier targeting rule definitions.                                                                       |
| `country`       | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom`        | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |
```swift
let user = User(identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92",
    email: "john@example.com", 
    country: "United Kingdom", 
    custom: ["SubscriptionType":"Pro", "UserRole":"Admin"]])
```

## Polling Modes
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all requests are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.

### Auto polling (default)
The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

Use the the `autoPollIntervalInSeconds` option parameter of the `AutoPollingPolicy` to change the polling interval.
```swift
let factory = { (cache: ConfigCache, fetcher: ConfigFetcher) -> RefreshPolicy in
    AutoPollingPolicy(cache: cache,
        fetcher: fetcher,
        autoPollIntervalInSeconds: 30)
}

let client = ConfigCatClient(apiKey: "<PLACE-YOUR-API-KEY-HERE>", policyFactory: factory)
```
Adding a callback to `configurationChangeListener` option parameter will get you notified about changes.
```swift
let factory = { (cache: ConfigCache, fetcher: ConfigFetcher) -> RefreshPolicy in
    AutoPollingPolicy(cache: cache,
        fetcher: fetcher,
        onConfigChanged: { (config, parser) in
            let isMyAwesomeFeatureEnabled: String = try! parser.parseValue(for: "key-of-my-awesome-feature", json: configString)
            if(isMyAwesomeFeatureEnabled) {
                //show your awesome feature to the world!
            }
        })
}

let client = ConfigCatClient(apiKey: "<PLACE-YOUR-API-KEY-HERE>", policyFactory: factory)
```

### Lazy loading
When calling `getValue()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

Use the `cacheRefreshIntervalInSeconds` option parameter of the `LazyLoadingPolicy` to set cache lifetime.
```swift
let factory = { (cache: ConfigCache, fetcher: ConfigFetcher) -> RefreshPolicy in
    LazyLoadingPolicy(cache: cache,
                      fetcher: fetcher,
                      cacheRefreshIntervalInSeconds: 30)
}

let client = ConfigCatClient(apiKey: "<PLACE-YOUR-API-KEY-HERE>", policyFactory: factory)
```
Use the `asyncRefresh` option parameter of the `LazyLoadingPolicy` to define how do you want to handle the expiration of the cached configuration. If you choose asynchronous refresh then when a request is being made on the cache while it's expired, the previous value will be returned immediately until the fetching of the new configuration is completed.
```swift
let factory = { (cache: ConfigCache, fetcher: ConfigFetcher) -> RefreshPolicy in
    LazyLoadingPolicy(cache: cache,
                      fetcher: fetcher,
                      useAsyncRefresh = true)
}

let client = ConfigCatClient(apiKey: "<PLACE-YOUR-API-KEY-HERE>", policyFactory: factory)
```
If you set the `.asyncRefresh()` to `false`, the refresh operation will be awaited until the fetching of the new configuration is completed.

### Manual polling
With this policy every new configuration request on the ConfigCatClient will trigger a new fetch over HTTP.
```swift
let factory = { (cache: ConfigCache, fetcher: ConfigFetcher) -> RefreshPolicy in
    ManualPollingPolicy(cache, fetcher))
}
        
let client = ConfigCatClient(apiKey: "<PLACE-YOUR-API-KEY-HERE>", policyFactory: factory)
```

### Custom Policy
You can also implement your custom refresh policy by extending the `RefreshPolicy` open class.
```swift
public class MyCustomPolicy : RefreshPolicy {
    public required init(cache: ConfigCache, fetcher: ConfigFetcher) {
        super.init(cache: cache, fetcher: fetcher)
    }
    
    public override func getConfiguration() -> AsyncResult<String> {
        // this method will be called when the configuration is requested from the ConfigCat client.
        // you can access the config fetcher through the super.fetcher and the internal cache via super.cache
    }
}
```
> The AsyncResult is an internal type used to signal back to the caller about the completion of a given task like Futures.

Then you can simply inject your custom policy implementation into the ConfigCat client:
```swift
let factory = { (cache: ConfigCache, fetcher: ConfigFetcher) -> RefreshPolicy in
    MyCustomPolicy(cache, fetcher))
}
        
let client = ConfigCatClient(apiKey: "<PLACE-YOUR-API-KEY-HERE>", policyFactory: factory)
```

## Custom cache
You have the option to inject your custom cache implementation into the client. All you have to do is to inherit from the `ConfigCache` open class:
```swift
public class MyCustomCache : ConfigCache {
    open override func read() throws -> String {
        // here you have to return with the cached value
        // you can access the latest cached value in case 
        // of a failure like: super.inMemoryValue
    }
    
    open override func write(value: String) throws {
        // here you have to store the new value in the cache
    }
}
```
Then use your custom cache implementation:
```swift
let client = ConfigCatClient(apiKey: "<PLACE-YOUR-API-KEY-HERE>", configCache: MyCustomCache())
```

#### Force refresh
Any time you want to refresh the cached configuration with the latest one, you can call the `forceRefresh()` method of the library, which will initiate a new fetch and will update the local cache.

## Sample App
Check out our Sample Application how they use the ConfigCat SDK
* <a href="https://github.com/configcat/swift-sdk/tree/master/samples/ios" target="_blank">iOS with auto polling and change listener</a>