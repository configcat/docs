---
id: go
title: Go
---
## Getting Started:
### 1. Get the SDK with `go`
```bash
go get gopkg.in/configcat/go-sdk.v2
```
### 2. Import the ConfigCat package
```go
import gopkg.in/configcat/go-sdk.v2
```
### 3. Create the *ConfigCat* client with your *API Key*
```go
client := configcat.NewClient("<PLACE-YOUR-API-KEY-HERE>")
```
### 4. Get your setting value
```go
isMyAwesomeFeatureEnabled, ok := client.GetValueForUser("key-of-my-awesome-feature", false, user).(bool)
if ok && isMyAwesomeFeatureEnabled {
    doTheNewThing()
} else {
    doTheOldThing()
}
```
Or use the async APIs:
```go
client.GetValueAsyncForUser("key-of-my-awesome-feature", false, func(result interface{}) {
    isMyAwesomeFeatureEnabled, ok := result.(bool)
    if ok && isMyAwesomeFeatureEnabled {
        doTheNewThing()
    } else {
        doTheOldThing()
    }
})
```

### 5. Stop *ConfigCat* client
You can safely shut down the client instance and release all associated resources on application exit.
```go
client.Close()
```

## Creating the *ConfigCat Client*
*ConfigCat Client* is responsible for:
- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`configcat.NewClient(<apiKey>)` returns a client with default options.
| Arguments | Description                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------------- |
| `apiKey`  | API Key to access your feature flags and configurations. Get it from *ConfigCat Management Console*. |

### Custom configuration options
`configcat.NewCustomClient(<apiKey>, config)` returns a client with custom configuration.
| Arguments | Description                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------------- |
| `apiKey`  | API Key to access your feature flags and configurations. Get it from *ConfigCat Management Console*. |
| `config`  | An object which contains the custom configuration.                                                   |
You can get and customize the default configuration options:
```go
config := configcat.DefaultClientConfig()
```
| Properties                | Type                                             | Description                                                                                                                                                                                                       |
| ------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BaseUrl`                 | string                                           | *Obsolete* Sets the CDN base url (forward proxy, dedicated subscription) from where the sdk will download the configurations.                                                                                     |
| `Cache `                  | ConfigCache                                      | Sets a custom cache implementation for the client. [See below](#custom-cache).                                                                                                                                    |
| `MaxWaitTimeForSyncCalls` | time.Duration                                    | Sets a timeout value for the synchronous methods of the library (`GetValue()`, `GetValueForUser()`, `Refresh()`) which means when a sync call takes longer than the timeout, it'll return with the default value. |
| `HttpTimeout`             | time.Duration                                    | Sets maximum wait time for a HTTP response.                                                                                                                                                                       |
| `Transport`               | http.RoundTripper                                | Sets the transport options for the underlying HTTP calls.                                                                                                                                                                       |
| `Logger`                  | configcat.Logger                                | Sets the `Logger` implementation used by the SDK for logging.                                                                                                                                                                       |
| `PolicyFactory`           | func(ConfigProvider, *ConfigStore) RefreshPolicy | Sets a custom refresh policy implementation for the client. [See below](#custom-policy).                                                                                                                          |

Then you can pass it to the `NewCustomClient()` method:
```go
client := configcat.NewCustomClient("<PLACE-YOUR-API-KEY-HERE>", config)
```


> We strongly recommend you to use the ConfigCatClient as a Singleton object in your application

## Anatomy of `GetValue()`
| Parameters     | Description                                                                   |
| -------------- | ----------------------------------------------------------------------------- |
| `key`          | Setting-specific key. Set in *ConfigCat Management Console* for each setting. |
| `defaultValue` | This value will be returned in case of an error.                              |
```go
value := client.GetValue(
    "keyOfMySetting", // Setting Key
    false // Default value
)
```

## Anatomy of `GetValueForUser()`
| Parameters     | Description                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------- |
| `key`          | Setting-specific key. Set in *ConfigCat Management Console* for each setting.                      |
| `defaultValue` | This value will be returned in case of an error.                                                   |
| `user`         | *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
```go
value := client.GetValueForUser(
    "keyOfMySetting", // Setting Key
    false // Default value
    configcat.NewUser("435170f4-8a8b-4b67-a723-505ac7cdea92") // User Object
)
```

### User Object
The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting]((advanced/targeting.md)) feature.
#### Simple user object creation:
```go
user = configcat.NewUser("435170f4-8a8b-4b67-a723-505ac7cdea92")   
```
```go
user = configcat.NewUser("john@example.com")   
```

#### Customized user object creation:
| Arguments    | Description                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier` | Unique identifier of a user in your application. Can be any value, even an email address.                                       |
| `email`      | Optional parameter for easier targeting rule definitions.                                                                       |
| `country`    | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom`     | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |
```go
custom := map[string]string{}
custom["SubscriptionType"] = "Pro"
custom["UserRole"] = "Admin"
user := configcat.NewUserWithAdditionalAttributes("435170f4-8a8b-4b67-a723-505ac7cdea92",
    "john@example.com", "United Kingdom", custom)
```

## `GetAllKeys()`
You can get all the setting keys from your configuration by calling the `GetAllKeys()` method of the `ConfigCatClient`.

```go
client := configcat.NewClient("#YOUR-API-KEY#")
keys, err := client.GetAllKeys()
```

## Polling Modes
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all requests are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.

### Auto polling (default)
The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

Use the `NewAutoPollingPolicy` method to create the policy.
```go
config := configcat.DefaultClientConfig()
config.PolicyFactory = func(configProvider configcat.ConfigProvider, store *configcat.ConfigStore) configcat.RefreshPolicy {
    return configcat.NewAutoPollingPolicy(configProvider, store, 
    // The auto poll interval
    time.Second * 120)
}
       
client := configcat.NewCustomClient("<PLACE-YOUR-API-KEY-HERE>", config)
```
You have the option to configure the polling interval and an `configChanged` callback that will be notified when a new configuration is fetched. The policy calls the given method only, when the new configuration is differs from the cached one.
```go
config := configcat.DefaultClientConfig()
config.PolicyFactory = func(configProvider configcat.ConfigProvider, store *configcat.ConfigStore) configcat.RefreshPolicy {
	return configcat.NewAutoPollingPolicyWithChangeListener(configProvider, store,
		// The auto poll interval
		time.Second * 120,
		// The callback called when the configuration changes
		func(config string, parser *configcat.ConfigParser) {
			result, err := parser.Parse(config, "key-of-my-awesome-feature")
			if err != nil {
				isMyAwesomeFeatureEnabled, ok := result.(bool)
				if ok && isMyAwesomeFeatureEnabled {
					//show your awesome feature to the world!
				}
			}
		})
}
       
client := configcat.NewCustomClient("<PLACE-YOUR-API-KEY-HERE>", config)
```

### Lazy loading
When calling `getValue()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

Use the `NewLazyLoadingPolicy` method to create the policy.
```go
config := configcat.DefaultClientConfig()
config.PolicyFactory = func(configProvider configcat.ConfigProvider, store *configcat.ConfigStore) configcat.RefreshPolicy {
    return configcat.NewExpiringCachePolicy(configProvider, store, 
    // The cache expiration interval
    time.Second * 120,
    // True for async, false for sync refresh
    true)
}
       
client := configcat.NewCustomClient("<PLACE-YOUR-API-KEY-HERE>", config)
```
> Use the `asyncRefresh` option parameter of the `NewLazyLoadingPolicy` to define how do you want to handle the expiration of the cached configuration. If you choose asynchronous refresh then when a request is being made on the cache while it's expired, the previous value will be returned immediately until the fetching of the new configuration is completed.

>If you set the `.asyncRefresh()` to `false`, the refresh operation will be awaited until the fetching of the new configuration is completed.

### Manual polling
With this policy every new configuration request on the ConfigCatClient will trigger a new fetch over HTTP.
```go
config := configcat.DefaultClientConfig()
config.PolicyFactory = func(configProvider configcat.ConfigProvider, store *configcat.ConfigStore) configcat.RefreshPolicy {
    return configcat.NewManualPollingPolicy(configProvider, store)
}
       
client := configcat.NewCustomClient("<PLACE-YOUR-API-KEY-HERE>", config)
```

### Custom Policy
You can also implement your custom refresh policy by satisfying the `RefreshPolicy` interface.
```go
type CustomPolicy struct {
    configcat.ConfigRefresher
}

func NewCustomPolicy(fetcher configcat.ConfigProvider, store *configcat.ConfigStore) *NewCustomPolicy {
    return &NewCustomPolicy{ ConfigRefresher: ConfigRefresher{ Fetcher:fetcher, Store:store }}
}

func (policy *NewCustomPolicy) GetConfigurationAsync() *configcat.AsyncResult {
    // this method will be called when the configuration is requested from the ConfigCat client.
    // you can access the config fetcher through the policy.Fetcher and the internal store via policy.Store
}
```
> The `AsyncResult` and the `Async` are internal types used to signal back to the caller about the completion of a given task like [Futures](https://en.wikipedia.org/wiki/Futures_and_promises).

Then you can simply inject your custom policy implementation into the ConfigCat client:
```go
config := configcat.DefaultClientConfig()
config.PolicyFactory = func(configProvider configcat.ConfigProvider, store *configcat.ConfigStore) configcat.RefreshPolicy {
    return NewCustomPolicy(configProvider, store)
}

client := configcat.NewCustomClient("<PLACE-YOUR-API-KEY-HERE>", config)
```

## Custom Cache
You have the option to inject your custom cache implementation into the client. All you have to do is to satisfy the `ConfigCache` interface:
```go
type CustomCache struct {
}

func (cache *CustomCache) Get() (string, error) {
    // here you have to return with the cached value
}

func (cache *CustomCache) Set(value string) error {
    // here you have to store the new value in the cache
}
```
Then use your custom cache implementation:
```go      
config := configcat.DefaultClientConfig()
config.Cache = CustomCache{}

client := configcat.NewCustomClient("<PLACE-YOUR-API-KEY-HERE>", config)
```

### Force refresh
Any time you want to refresh the cached configuration with the latest one, you can call the `Refresh()` or `RefreshAsync()` method of the library,
which will initiate a new fetch and will update the local cache.

## HTTP Proxy
You can use the `Transport` config option to set up http transport related (like proxy) settings for the http client used by the SDK:
```go
config := configcat.DefaultClientConfig()
config.Transport = &http.Transport{
	Proxy: http.ProxyURL(url.Parse("<PROXY-URL>")),
}
client := configcat.NewCustomClient("<PLACE-YOUR-API-KEY-HERE>", config)
```

## Logging
The default logger used by the SDK is [logrus](https://github.com/sirupsen/logrus), but you have the option to override it with your logger via the `Logger` config option, it only has to satisfy the [Logger](https://github.com/configcat/go-sdk/blob/master/logger.go) interface:
```go
config := configcat.DefaultClientConfig()
config.Logger = logrus.New()

client := configcat.NewCustomClient("<PLACE-YOUR-API-KEY-HERE>", config)
```

## Sample Applications
- [Sample Console App](https://github.com/configcat/go-sdk/tree/master/samples/console)

## Look under the hood
- [ConfigCat Go SDK's repository on GitHub](https://github.com/configcat/go-sdk)