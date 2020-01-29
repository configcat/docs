---
id: ios
title: iOS (Swift)
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
| Arguments                          | Type                                             | Description                                                                                                                                                                                                 |
| ---------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiKey`                           | string                                           | **REQUIRED.** API Key to access your feature flags and configurations. Get it from *ConfigCat Dashboard*.                                                                                          |
| `baseUrl`                          | string                                           | *Obsolete* Optional, sets the CDN base url (forward proxy, dedicated subscription) from where the sdk will download the configurations.                                                                     |
| `configCache`                      | ConfigCache?                                     | Optional, sets a custom cache implementation for the client. [See below](#custom-cache).                                                                                                                    |
| `maxWaitTimeForSyncCallsInSeconds` | int                                              | Optional, sets a timeout value for the synchronous methods of the library (`getValue()`, `forceRefresh()`) which means when a sync call takes longer than the timeout, it'll return with the default value. |
| `sessionConfiguration`             | URLSessionConfiguration                          | Optional, sets a custom `URLSessionConfiguration` used by the HTTP calls.                                                                                                                                   |
| `refreshMode`                      | PollingMode?                                     | Optional, sets the polling mode for the client. [See below](#polling-modes).                                                                                                          |

> We strongly recommend you to use the ConfigCatClient as a Singleton object in your application

## Anatomy of `getValue()`
| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                  |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
```swift
let value = client.getValue(
    for: "keyOfMySetting", // Setting Key
    defaultValue: false, // Default value
    user: User(identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92") // Optional User Object
)
```

### User Object
The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature. 
```swift
let user = User(identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92")   
```
```swift
let user = User(identifier: "john@example.com")   
```
| Arguments    | Description                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier` | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                         |
| `email`      | Optional parameter for easier targeting rule definitions.                                                                       |
| `country`    | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom`     | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |
```swift
let user = User(identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92",
    email: "john@example.com", 
    country: "United Kingdom", 
    custom: ["SubscriptionType":"Pro", "UserRole":"Admin"])
```

## Logging
We are using the *Unified Logging System* in the *ConfigCat SDK* for logging. For more information about *Unified Logging* please visit
<a href="https://developer.apple.com/documentation/os/logging" target="_blank">Apple's developer page</a>
or check <a href="https://developer.apple.com/videos/play/wwdc2016/721" target="_blank">Session 721 - Unified Logging and Activity Tracing</a> from WWDC 2016.

## `getAllKeys()`
You can get all the setting keys from your configuration by calling the `getAllKeys()` method of the `ConfigCatClient`.

```swift
let client = ConfigCatClient(apiKey: "#YOUR-API-KEY#")
let keys = client.getAllKeys()
```

## Polling Modes
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all requests are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.

### Auto polling (default)
The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

Use the the `autoPollIntervalInSeconds` option parameter of the `PollingModes.manualPoll()` to change the polling interval.
```swift
let client = ConfigCatClient(
    apiKey: "<PLACE-YOUR-API-KEY-HERE>", 
    refreshMode: PollingModes.manualPoll(autoPollIntervalInSeconds: 120 /* polling interval in seconds */)
)
```
Adding a callback to `onConfigChanged` option parameter will get you notified about changes.
```swift
let client = ConfigCatClient(
    apiKey: "<PLACE-YOUR-API-KEY-HERE>", 
    refreshMode: PollingModes.manualPoll(
        autoPollIntervalInSeconds: 120, // polling interval in seconds
        onConfigChanged: { (config, parser) in
            let isMyAwesomeFeatureEnabled: String = try! parser.parseValue(for: "key-of-my-awesome-feature", json: configString)
            if(isMyAwesomeFeatureEnabled) {
                //show your awesome feature to the world!
            }
        }
    )
)
```

### Lazy loading
When calling `getValue()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

Use the `cacheRefreshIntervalInSeconds` option parameter of the `PollingModes.lazyLoad()` to set cache lifetime.
```swift
let client = ConfigCatClient(
    apiKey: "<PLACE-YOUR-API-KEY-HERE>", 
    refreshMode: PollingModes.lazyLoad(cacheRefreshIntervalInSeconds: 120 /* the cache will expire in 120 seconds */)
)
```
Use the `asyncRefresh` option parameter of the `PollingModes.lazyLoad()` to define how do you want to handle the expiration of the cached configuration. If you choose asynchronous refresh then when a request is being made on the cache while it's expired, the previous value will be returned immediately until the fetching of the new configuration is completed.
```swift
let client = ConfigCatClient(
    apiKey: "<PLACE-YOUR-API-KEY-HERE>", 
    refreshMode: PollingModes.lazyLoad(
        cacheRefreshIntervalInSeconds: 120, // the cache will expire in 120 seconds
        useAsyncRefresh: true // the refresh will be executed asynchronously
    )
)
```
If you set the `asyncRefresh` to `false`, the refresh operation will be awaited until the fetching of the new configuration is completed.

### Manual polling
With this policy every new configuration request on the ConfigCatClient will trigger a new fetch over HTTP.
```swift
let client = ConfigCatClient(
    apiKey: "<PLACE-YOUR-API-KEY-HERE>", 
    refreshMode: PollingModes.manualPoll()
)
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

## Using ConfigCat behind a proxy
Provide your own network credentials (username/password), and proxy server settings (proxy server/port) by adding a *ProxyDictionary* to the ConfigCat's `URLSessionConfiguration`.

```swift
let proxyHost = "127.0.0.1"
let proxyPort = 8080
let configuration = URLSessionConfiguration.default
let proxyUser = "user"
let proxyPassword = "password" 
configuration.connectionProxyDictionary = [
    kCFNetworkProxiesHTTPEnable: true,
    kCFNetworkProxiesHTTPProxy: proxyHost,
    kCFNetworkProxiesHTTPPort: proxyPort,
    kCFNetworkProxiesHTTPSEnable: true,
    kCFNetworkProxiesHTTPSProxy: proxyHost,
    kCFNetworkProxiesHTTPSPort: proxyPort,
    kCFProxyUsernameKey: proxyUser, // Optional
    kCFProxyPasswordKey: proxyPassword // Optional
]

let client: ConfigCatClient = ConfigCatClient(apiKey: apiKey, sessionConfiguration: configuration)
```

## Sample App
Check out our Sample Application how they use the ConfigCat SDK
* <a href="https://github.com/configcat/swift-sdk/tree/master/samples/ios" target="_blank">iOS with auto polling and change listener</a>
