---
id: go
title: Go
---
## Getting Started:
### 1. Get the SDK with `go`
```bash
go get github.com/configcat/go-sdk/v4
```
### 2. Import the ConfigCat package
```go
import "github.com/configcat/go-sdk/v4"
```
### 3. Create the *ConfigCat* client with your *SDK Key*
```go
client := configcat.NewClient("<PLACE-YOUR-SDK-KEY-HERE>")
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

`configcat.NewClient(<sdkKey>)` returns a client with default options.
| Arguments | Description                                                                                 |
| --------- | ------------------------------------------------------------------------------------------- |
| `sdkKey`  | SDK Key to access your feature flags and configurations. Get it from *ConfigCat Dashboard*. |

### Custom configuration options
`configcat.NewCustomClient(<sdkKey>, config)` returns a client with custom configuration.
| Arguments | Description                                                                                 |
| --------- | ------------------------------------------------------------------------------------------- |
| `sdkKey`  | SDK Key to access your feature flags and configurations. Get it from *ConfigCat Dashboard*. |
| `config`  | An object which contains the custom configuration.                                          |

Available configuration options:
| Properties                | Type                                             | Description                                                                                                                                                                                                       |
| ------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BaseUrl`                 | string                                           | *Obsolete* Sets the CDN base url (forward proxy, dedicated subscription) from where the sdk will download the configurations.                                                                                     |
| `Cache `                  | ConfigCache                                      | Sets a custom cache implementation for the client. [See below](#custom-cache).                                                                                                                                    |
| `MaxWaitTimeForSyncCalls` | time.Duration                                    | Sets a timeout value for the synchronous methods of the library (`GetValue()`, `GetValueForUser()`, `Refresh()`) which means when a sync call takes longer than the timeout, it'll return with the default value. |
| `HttpTimeout`             | time.Duration                                    | Sets maximum wait time for a HTTP response.                                                                                                                                                                       |
| `Transport`               | http.RoundTripper                                | Sets the transport options for the underlying HTTP calls.                                                                                                                                                         |
| `Logger`                  | configcat.Logger                                 | Sets the `Logger` implementation used by the SDK for logging.                                                                                                                                                     |
| `Mode`                    | configcat.RefreshMode                            | Sets the polling mode for the client. [See below](#polling-modes).                                                                                                                          |

Then you can pass it to the `NewCustomClient()` method:
```go
client := configcat.NewCustomClient("<PLACE-YOUR-SDK-KEY-HERE>", ClientConfig{ Mode: ManualPoll() })
```


> We strongly recommend you to use the ConfigCatClient as a Singleton object in your application

## Anatomy of `GetValue()`
| Parameters     | Description                                                          |
| -------------- | -------------------------------------------------------------------- |
| `key`          | Setting-specific key. Set on *ConfigCat Dashboard* for each setting. |
| `defaultValue` | This value will be returned in case of an error.                     |
```go
value := client.GetValue(
    "keyOfMySetting", // Setting Key
    false // Default value
)
```

## Anatomy of `GetValueAsync()`
| Parameters     | Description                                                          |
| -------------- | -------------------------------------------------------------------- |
| `key`          | Setting-specific key. Set on *ConfigCat Dashboard* for each setting. |
| `defaultValue` | This value will be returned in case of an error.                     |
| `completion`   | Callback function to call, when the result is ready.                 |
```go
client.GetValueAsync(
    "keyOfMySetting", // Setting Key
    false, // Default value
    func(result interface{}) { // callback
	    fmt.Print(result)
	}
)
```

## Anatomy of `GetValueForUser()`
| Parameters     | Description                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------- |
| `key`          | Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                               |
| `defaultValue` | This value will be returned in case of an error.                                                   |
| `user`         | *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
```go
value := client.GetValueForUser(
    "keyOfMySetting", // Setting Key
    false // Default value
    configcat.NewUser("435170f4-8a8b-4b67-a723-505ac7cdea92") // User Object
)
```

## Anatomy of `GetValueForUserAsync()`
| Parameters     | Description                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------- |
| `key`          | Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                               |
| `defaultValue` | This value will be returned in case of an error.                                                   |
| `user`         | *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
| `completion`   | Callback function to call, when the result is ready.                                               |
```go
client.GetValueForUserAsync(
    "keyOfMySetting", // Setting Key
    false // Default value
    configcat.NewUser("435170f4-8a8b-4b67-a723-505ac7cdea92"), // User Object
    func(result interface{}) { // callback
		fmt.Print(result)
	}
)
```

### User Object
The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature.
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
client := configcat.NewClient("#YOUR-SDK-KEY#")
keys, err := client.GetAllKeys()
```

## Polling Modes
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all requests are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.

### Auto polling (default)
The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

Use the the `autoPollIntervalInSeconds` option parameter of the `configcat.AutoPoll()` to change the polling interval.
```go  
client := configcat.NewCustomClient(
    "<PLACE-YOUR-SDK-KEY-HERE>", 
    configcat.ClientConfig{ Mode: configcat.AutoPoll(time.Second * 120 /* polling interval in seconds */) }
)
```
You have the option to configure the polling interval and an `configChanged` callback that will be notified when a new configuration is fetched. The policy calls the given method only, when the new configuration is differs from the cached one.
```go

client := configcat.NewCustomClient(
    "<PLACE-YOUR-SDK-KEY-HERE>", 
    configcat.ClientConfig{ Mode: configcat.AutoPoll(
        // The auto poll interval
        time.Second * 120,
        // The callback called when the configuration changes
        func() {
			// here you can subscribe to configuration changes
		})
    )}
)
```

### Lazy loading
When calling `getValue()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

Use the `cacheRefreshIntervalInSeconds` parameter of the `configcat.LazyLoad()` to set cache lifetime.
```go
client := configcat.NewCustomClient(
    "<PLACE-YOUR-SDK-KEY-HERE>", 
    configcat.ClientConfig{ Mode: configcat.LazyLoad(
        time.Second * 120, // polling interval in seconds
        true // the refresh will be executed asynchronously
    )}
)
```
> Use the `asyncRefresh` option parameter of the `configcat.LazyLoad()` to define how do you want to handle the expiration of the cached configuration. If you choose asynchronous refresh then when a request is being made on the cache while it's expired, the previous value will be returned immediately until the fetching of the new configuration is completed.

>If you set the `asyncRefresh` to `false`, the refresh operation will be awaited until the fetching of the new configuration is completed.

### Manual polling
Manual polling gives you full control over when the setting values are downloaded. ConfigCat SDK will not update them automatically. Calling `Refresh()` is your application's responsibility.
```go
client := configcat.NewCustomClient(
    "<PLACE-YOUR-SDK-KEY-HERE>", 
    configcat.ClientConfig{ Mode: configcat.ManualPoll() }
)

client.ForceRefresh()
```
> `GetValue()` returns `defaultValue` if the cache is empty. Call `Refresh()` to update the cache.

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
client := configcat.NewCustomClient(
    "<PLACE-YOUR-SDK-KEY-HERE>", 
    configcat.ClientConfig{ Cache: CustomCache{} }
)
```

### Force refresh
Any time you want to refresh the cached configuration with the latest one, you can call the `Refresh()` or `RefreshAsync()` method of the library,
which will initiate a new fetch and will update the local cache.

## HTTP Proxy
You can use the `Transport` config option to set up http transport related (like proxy) settings for the http client used by the SDK:
```go
client := configcat.NewCustomClient(
    "<PLACE-YOUR-SDK-KEY-HERE>", 
    configcat.ClientConfig{ 
        Transport: &http.Transport{
	        Proxy: http.ProxyURL(url.Parse("<PROXY-URL>")),
        }    
    }
)
```

## Logging
The default logger used by the SDK is [logrus](https://github.com/sirupsen/logrus), but you have the option to override it with your logger via the `Logger` config option, it only has to satisfy the [Logger](https://github.com/configcat/go-sdk/blob/master/logger.go) interface:
```go
import {
	"github.com/configcat/go-sdk"
	"github.com/sirupsen/logrus"
}

client := configcat.NewCustomClient(
    "<PLACE-YOUR-SDK-KEY-HERE>", 
    configcat.ClientConfig{ Logger: logrus.New() }
)
```

### Setting log levels

```go
import {
	"github.com/configcat/go-sdk"
	"github.com/sirupsen/logrus"
}

logger := logrus.New()
logger.SetLevel(logrus.InfoLevel)

client := configcat.NewCustomClient(
    "<PLACE-YOUR-SDK-KEY-HERE>", 
    configcat.ClientConfig{ Logger: logger }
)
```

Available log levels:
| Level       | Description                                             |
| ---------- | ------------------------------------------------------- |
| ErrorLevel | Only error level events are logged.                     |
| WarnLevel  | Errors and Warnings are logged.                         |
| InfoLevel  | Errors, Warnings and feature flag evaluation is logged. |
| DebugLevel | All of the above plus debug info is logged.             |

Info level logging helps to inspect the feature flag evaluation process:
```bash
ConfigCat - INFO - Evaluate 'isPOCFeatureEnabled'
INFO[0000] Evaluating rule: [Email:] [CONTAINS] [@something.com] => no match 
INFO[0000] Evaluating rule: [Email:] [CONTAINS] [@example.com] => no match 
INFO[0000] Returning false.   
```

## Sample Applications
- [Sample Console App](https://github.com/configcat/go-sdk/tree/master/samples/console)

## Look under the hood
- [ConfigCat Go SDK's repository on GitHub](https://github.com/configcat/go-sdk)
