---
id: go
title: Go
---
[![Star on GitHub](https://img.shields.io/github/stars/configcat/go-sdk.svg?style=social)](https://github.com/configcat/go-sdk/stargazers)
[![Build Status](https://github.com/configcat/go-sdk/actions/workflows/go-ci.yml/badge.svg?branch=master)](https://github.com/configcat/go-sdk/actions/workflows/go-ci.yml)
[![Go Report Card](https://goreportcard.com/badge/github.com/configcat/go-sdk)](https://goreportcard.com/report/github.com/configcat/go-sdk)
[![codecov](https://codecov.io/gh/configcat/go-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/configcat/go-sdk)
[![GoDoc](https://godoc.org/github.com/configcat/go-sdk?status.svg)](https://pkg.go.dev/github.com/configcat/go-sdk/v7)

## Getting Started:
### 1. Get the SDK with `go`
```bash
go get github.com/configcat/go-sdk/v7
```
### 2. Import the ConfigCat package
```go
import "github.com/configcat/go-sdk/v7"
```
### 3. Create the *ConfigCat* client with your *SDK Key*
```go
client := configcat.NewClient("<PLACE-YOUR-SDK-KEY-HERE>")
```
### 4. Get your setting value
```go
isMyAwesomeFeatureEnabled := client.GetBoolValue("key-of-my-awesome-feature", false, nil)
if isMyAwesomeFeatureEnabled {
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
`configcat.NewCustomClient(config)` returns a client with custom configuration. The `config` parameter is a stucture which 
contains the custom configuration.

Available configuration options:

| Properties | Type | Description |
| ---------- | ---- | ----------- |
| `SDKKey`                  | `string`                  | SDK Key to access your feature flags and configurations. Get it from *ConfigCat Dashboard*. |
| `DataGovernance`          | `configcat.DataGovernance` | Defaults to `Global`. Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `Global`, `EuOnly`. |
| `BaseUrl`                 | `string`                   | *Obsolete* Sets the CDN base url (forward proxy, dedicated subscription) from where the sdk will download the configurations. |
| `Cache `                  | `ConfigCache`              | Sets a custom cache implementation for the client. [See below](#custom-cache).  |
| `NoWaitForRefresh`        | `bool`                     | Defaults to `false`. When it's `true` the typed get methods (`Get[TYPE]Value()`) will never wait for a configuration refresh to complete before returning. When it's `false` and `PollingMode` is `AutoPoll`, the first request may block, when `PollingMode` is `Lazy`, any request may block. |
| `HttpTimeout`             | `time.Duration`            | Sets the maximum wait time for a HTTP response. |
| `Transport`               | `http.RoundTripper`        | Sets the transport options for the underlying HTTP calls. |
| `Logger`                  | `configcat.Logger`         | Sets the `Logger` implementation used by the SDK for logging. |
| `PollingMode`             | `configcat.PollingMode`    | Defaults to `AutoPoll`. Sets the polling mode for the client. [See below](#polling-modes). |
| `PollInterval`                  | `time.Duration`            | Sets after how much time a configuration is considered stale. When `PollingMode` is `AutoPoll` this value is used as the polling rate. |
| `ChangeNotify`            | `func()`                   | An optional callback to invoke when a new configuration has fetched. |

Then you can pass it to the `NewCustomClient()` method:
```go
client := configcat.NewCustomClient(configcat.Config{SDKKey: "<PLACE-YOUR-SDK-KEY-HERE>", PollingMode: configcat.Manual })
```

:::caution
We strongly recommend you to use the *ConfigCat Client* as a Singleton object in your application.
If you want to use multiple SDK Keys in the same application, create only one *ConfigCat Client* per SDK Key.
:::

## Anatomy of `Get[TYPE]Value()`
Basically all of the value evaluator methods share the same signature, they only differ in their served value type. `GetBoolValue()` is for evaluating feature flags, `GetIntValue()` and `GetFloatValue()` are for numeric and `GetStringValue()` is for textual settings.

| Parameters     | Description                                                          |
| -------------- | -------------------------------------------------------------------- |
| `key`          | Setting-specific key. Set on *ConfigCat Dashboard* for each setting. |
| `defaultValue` | This value will be returned in case of an error.                     |
| `user`         | *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
```go
boolValue := client.GetBoolValue(
    "keyOfMyBoolSetting", // Setting Key
    false, // Default value
    &configcat.UserData{Identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92"} // User Object
)
```
```go
intValue := client.GetIntValue(
    "keyOfMyIntSetting", // Setting Key
    0, // Default value
    &configcat.UserData{Identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92"} // User Object
)
```

### User Object
The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature.
#### Simple user object creation:
```go
user = &configcat.UserData{Identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92"}
```
```go
user = &configcat.UserData{Identifier: "john@example.com"}
```

#### Customized user object creation:

| Arguments | Description |
| --------- | ----------- |
| `Identifier` | Unique identifier of a user in your application. Can be any value, even an email address.                                       |
| `Email`      | Optional parameter for easier targeting rule definitions.                                                                       |
| `Country`    | Optional parameter for easier targeting rule definitions.                                                                       |
| `Custom`     | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |
```go
custom := map[string]string{}
custom["SubscriptionType"] = "Pro"
custom["UserRole"] = "Admin"
user := &configcat.UserData{Identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92", 
            Email: "john@example.com", 
            Company: "United Kingdom", 
            Custom: custom}
```

#### Other options to create a user object:

The *ConfigCat SDK* uses reflection to determine what attributes are available on a user object. Your can either implement the `UserAttributes` interface - then its `GetAttribute(string) string` method will be used to retrieve the attributes - or use a struct type where each public field is treated as a possible comparison attribute.

If a field's type implements a `String() string` method, the field will be treated as a textual and the `String()` method will be called to determine the value.

If a field's type is `map[string]string`, the map value is used to look up any custom attribute not found directly in the struct. There should be at most one of these fields.

Otherwise, a field type must be a numeric type, a `string`, a `[]byte` or a `github.com/blang/semver.Version`.

## Polling Modes
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all value retrievals are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.

### Auto polling (default)
The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

Use the the `PollInterval` option parameter of the *ConfigCat Client* to change the polling interval.
```go
client := configcat.NewCustomClient(configcat.Config{SDKKey: "<PLACE-YOUR-SDK-KEY-HERE>", 
    PollingMode: configcat.AutoPoll,
    PollInterval: time.Second * 120 /* polling interval in seconds */})
```
You have the option to configure a `ChangeNotify` callback that will be notified when a new configuration is fetched. The policy calls the given method only, when the new configuration is differs from the cached one.
```go
client := configcat.NewCustomClient(configcat.Config{SDKKey: "<PLACE-YOUR-SDK-KEY-HERE>", 
    PollingMode: configcat.AutoPoll,
    PollInterval: time.Second * 120, /* polling interval in seconds */
    ChangeNotify: func() {
		// here you can subscribe to configuration changes
	}})
```

### Lazy loading
When calling `GetBoolValue()`, `GetIntValue()`, `GetFloatValue()` or `GetStringValue()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case, when the `NoWaitForRefresh` option is `false` the new setting value will be returned right after the cache update. When it's set to `true` the setting value retrievals will not wait for the downloads and they will return immediately with the previous setting value.

Use the `PollInterval` option parameter of the *ConfigCat Client* to set the cache TTL.
```go
client := configcat.NewCustomClient(configcat.Config{SDKKey: "<PLACE-YOUR-SDK-KEY-HERE>", 
    PollingMode: configcat.Lazy,
    PollInterval: time.Second * 120 /* cache TTL in seconds */})
```

### Manual polling
Manual polling gives you full control over when the `config.json` (with the setting values) is downloaded. ConfigCat SDK will not update them automatically. Calling `Refresh()` is your application's responsibility.
```go
client := configcat.NewCustomClient(configcat.Config{SDKKey: "<PLACE-YOUR-SDK-KEY-HERE>", 
    PollingMode: configcat.Manual})

client.Refresh()
```
> The setting value retrieval methods will return `defaultValue` if the cache is empty. Call `Refresh()` to update the cache.

## `GetAllKeys()`
You can get all the setting keys by calling the `GetAllKeys()` method of the *ConfigCat Client*.

## Snapshots
A `Snapshot` represents an immutable state of the given User's current setting values. Because of the immutability they are suitable for sharing between components that rely more on a consistent data state rather than maintaining their own states with individual get setting value calls.

Snapshot creation:
```go
snapshot := client.Snapshot(user)
```

You can define setting descriptors that could be also shared between those components and used for evaluation:
```go
boolSettingDescriptor := configcat.Bool("keyOfMyBoolSetting" /* Setting Key */, false /* Default value */)
```

Then you can use the descriptor to retrieve the setting's value from a snapshot:
```go
boolValue := boolSettingDescriptor.Get(snapshot)
```

Also, because of the immutability, snapshots allow safe iterative operations over their setting values avoiding the possibility of data change - caused by e.g. a new configuration download initiated by a get value call - within a loop.

For example, evaluating all setting values for every key could be done safely in the following way:
```go
keys := snapshot.GetAllKeys()
for _, key := range keys {
    valueForKey := snapshot.GetValue(key)
}
```

## Custom Cache
You have the option to inject your custom cache implementation into the client. All you have to do is to satisfy the `ConfigCache` interface:
```go
type CustomCache struct {
}

func (cache *CustomCache) Get(ctx context.Context, key string) ([]byte, error) {
    // here you have to return with the cached value
}

func (cache *CustomCache) Set(ctx context.Context, key string, value []byte) error {
    // here you have to store the new value in the cache
}
```
Then use your custom cache implementation:
```go
client := configcat.NewCustomClient(configcat.Config{SDKKey: "<PLACE-YOUR-SDK-KEY-HERE>", 
    Cache: CustomCache{}})
```

### Force refresh
Any time you want to refresh the cached configuration with the latest one, you can call the `Refresh()` method of the library, which will initiate a new fetch and will update the local cache.

You can also use the `RefreshIfOlder()` variant when you want to add expiration time windows for local cache updates.

## HTTP Proxy
You can use the `Transport` config option to set up http transport related (like proxy) settings for the http client used by the SDK:
```go
proxyURL, _ := url.Parse("<PROXY-URL>")
client := configcat.NewCustomClient(configcat.Config{SDKKey: "<PLACE-YOUR-SDK-KEY-HERE>", 
    Transport: &http.Transport{
	        Proxy: http.ProxyURL(proxyURL),
        }
    })
```

## Logging
The default logger used by the SDK is [logrus](https://github.com/sirupsen/logrus), but you have the option to override it with your logger via the `Logger` config option, it only has to satisfy the [Logger](https://github.com/configcat/go-sdk/blob/master/logger.go) interface:
```go
import {
	"github.com/configcat/go-sdk"
	"github.com/sirupsen/logrus"
}

client := configcat.NewCustomClient(configcat.Config{SDKKey: "<PLACE-YOUR-SDK-KEY-HERE>", 
    Logger: logrus.New()})
```

### Setting log levels

```go
import {
	"github.com/configcat/go-sdk"
	"github.com/sirupsen/logrus"
}

logger := logrus.New()
logger.SetLevel(logrus.InfoLevel)

client := configcat.NewCustomClient(configcat.Config{SDKKey: "<PLACE-YOUR-SDK-KEY-HERE>", 
    Logger: logger})
```

Available log levels:

| Level      | Description                                             |
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
