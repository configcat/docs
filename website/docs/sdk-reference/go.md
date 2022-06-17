---
id: go
title: Go SDK Reference
description: ConfigCat Go SDK Reference. This is a step-by-step guide on how to use feature flags in your Go applications.
---
[![Star on GitHub](https://img.shields.io/github/stars/configcat/go-sdk.svg?style=social)](https://github.com/configcat/go-sdk/stargazers)
[![Build Status](https://github.com/configcat/go-sdk/actions/workflows/go-ci.yml/badge.svg?branch=master)](https://github.com/configcat/go-sdk/actions/workflows/go-ci.yml)
[![Go Report Card](https://goreportcard.com/badge/github.com/configcat/go-sdk)](https://goreportcard.com/report/github.com/configcat/go-sdk)
[![codecov](https://codecov.io/gh/configcat/go-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/configcat/go-sdk)
[![GoDoc](https://godoc.org/github.com/configcat/go-sdk?status.svg)](https://pkg.go.dev/github.com/configcat/go-sdk/v7)

<a href="https://github.com/configcat/go-sdk" target="_blank">ConfigCat Go SDK on GitHub</a>


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
| `HttpTimeout`             | `time.Duration`            | Sets the maximum wait time for a HTTP response. [More about the HTTP timeout](#http-timeout) |
| `Transport`               | `http.RoundTripper`        | Sets the transport options for the underlying HTTP calls. |
| `Logger`                  | `configcat.Logger`         | Sets the `Logger` implementation used by the SDK for logging. [More about logging](#logging) |
| `PollingMode`             | `configcat.PollingMode`    | Defaults to `AutoPoll`. Sets the polling mode for the client. [More about polling modes](#polling-modes). |
| `PollInterval`            | `time.Duration`            | Sets after how much time a configuration is considered stale. When `PollingMode` is `AutoPoll` this value is used as the polling rate. |
| `ChangeNotify`            | `func()`                   | An optional callback to invoke when a new configuration has fetched. |
| `FlagOverrides`           | `*configcat.FlagOverrides` | Optional, configures local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides). |

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

## User Object
The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature.
### Simple user object creation:
```go
user = &configcat.UserData{Identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92"}
```
```go
user = &configcat.UserData{Identifier: "john@example.com"}
```

### Customized user object creation:

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

### Other options to create a user object:

The *ConfigCat SDK* uses reflection to determine what attributes are available on a user object. Your can either implement the `UserAttributes` interface - then its `GetAttribute(string) string` method will be used to retrieve the attributes - or use a struct type where each public field is treated as a possible comparison attribute.

If a field's type implements a `String() string` method, the field will be treated as a textual and the `String()` method will be called to determine the value.

If a field's type is `map[string]string`, the map value is used to look up any custom attribute not found directly in the struct. There should be at most one of these fields.

Otherwise, a field type must be a numeric type, a `string`, a `[]byte` or a `github.com/blang/semver.Version`.

## Polling Modes
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all value retrievals are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.  
[More about polling modes.](/advanced/caching/)

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

```go
client := configcat.NewClient("#YOUR-SDK-KEY#")
keys := client.GetAllKeys()
```

## `GetAllValues()`
Evaluates and returns the values of all feature flags and settings. Passing a User Object is optional.

```go
client := configcat.NewClient("#YOUR-SDK-KEY#")
settingValues := client.GetAllValues(nil)

// invoke with user object
user := &configcat.UserData{Identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92"}
settingValuesTargeting := client.GetAllValues(user)
```

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local/Offline mode** (`LocalOnly`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`LocalOverRemote`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`RemoteOverLocal`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can load your feature flag & setting overrides from a file or from a simple `map[string]interface{}` structure.

### JSON File

The SDK can be configured to load your feature flag & setting overrides from a file.

```go
client := configcat.NewCustomClient(configcat.Config{
    SDKKey: "localhost",
    FlagOverrides: &configcat.FlagOverrides{
        FilePath: "path/to/local_flags.json",
        Behavior: configcat.LocalOnly,
    },
})
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
This is the same format that the SDK downloads from the ConfigCat CDN. 
It allows the usage of all features you can do on the ConfigCat Dashboard.

You can download your current config.json from ConfigCat's CDN and use it as a baseline.

The URL to your current config.json is based on your [Data Governance](advanced/data-governance.md) settings: 

- GLOBAL: `https://cdn-global.configcat.com/configuration-files/{YOUR-SDK-KEY}/config_v5.json`
- EU: `https://cdn-eu.configcat.com/configuration-files/{YOUR-SDK-KEY}/config_v5.json`

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

### Map
You can set up the SDK to load your feature flag & setting overrides from a `map[string]interface{}`.
```go
client := configcat.NewCustomClient(configcat.Config{
    SDKKey: "localhost",
    FlagOverrides: &configcat.FlagOverrides{
        Values: map[string]interface{}{
			"enabledFeature":  true,
			"disabledFeature": false,
			"intSetting":      5,
			"doubleSetting":   3.14,
			"stringSetting":   "test",
		},
        Behavior: configcat.LocalOnly,
    },
})
```

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

## Force refresh
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

## HTTP Timeout
You can set the maximum wait time for a ConfigCat HTTP response.
```go
client := configcat.NewCustomClient(configcat.Config{SDKKey: "<PLACE-YOUR-SDK-KEY-HERE>", 
    HTTPTimeout: time.Second * 10
})
```

## Logging
The default logger used by the SDK is [logrus](https://github.com/sirupsen/logrus), but you have the option to override it with your logger via the `Logger` config option, it only has to satisfy the [Logger](https://github.com/configcat/go-sdk/blob/master/logger.go) interface:

### Setting log levels

#### Using `logrus`
```go
import {
	"github.com/configcat/go-sdk/v7"
	"github.com/sirupsen/logrus"
}

logger := logrus.New()
logger.SetLevel(logrus.InfoLevel)

client := configcat.NewCustomClient(configcat.Config{SDKKey: "<PLACE-YOUR-SDK-KEY-HERE>", 
    Logger: logger})
```

#### Using the default logger
```go
import {
	"github.com/configcat/go-sdk/v7"
	"github.com/sirupsen/logrus"
}

client := configcat.NewCustomClient(configcat.Config{SDKKey: "<PLACE-YOUR-SDK-KEY-HERE>", 
    Logger: configcat.DefaultLogger(configcat.LogLevelInfo)})
```

Available log levels:

| Level      | Description                                             |
| ---------- | ------------------------------------------------------- |
| ErrorLevel | Only error level events are logged.                     |
| WarnLevel  | Default, Errors and Warnings are logged.                |
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
