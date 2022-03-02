---
id: csharp
title: .NET, .NET Core SDK Reference
---

export const NetSchema = require('@site/src/schema-markup/sdk-reference/net.json');
export const CsharpSchema = require('@site/src/schema-markup/sdk-reference/csharp.json');
export const NetCoreSchema = require('@site/src/schema-markup/sdk-reference/netcore.json');

<script type='application/ld+json' dangerouslySetInnerHTML={ { __html: JSON.stringify(NetSchema) }}></script>
<script type='application/ld+json' dangerouslySetInnerHTML={ { __html: JSON.stringify(CsharpSchema) }}></script>
<script type='application/ld+json' dangerouslySetInnerHTML={ { __html: JSON.stringify(NetCoreSchema) }}></script>


[![Star on GitHub](https://img.shields.io/github/stars/configcat/.net-sdk.svg?style=social)](https://github.com/configcat/.net-sdk/stargazers)
[![Build status](https://ci.appveyor.com/api/projects/status/3kygp783vc2uv9xr?svg=true)](https://ci.appveyor.com/project/ConfigCat/net-sdk) [![NuGet Version](https://buildstats.info/nuget/ConfigCat.Client)](https://www.nuget.org/packages/ConfigCat.Client/)
[![codecov](https://codecov.io/gh/configcat/.net-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/configcat/.net-sdk)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=net-sdk&metric=alert_status)](https://sonarcloud.io/dashboard?id=net-sdk)

<a href="https://github.com/ConfigCat/.net-sdk" target="_blank">ConfigCat .Net SDK on GitHub</a>

## Getting started
### 1. Install *ConfigCat SDK* [Nuget](https://www.nuget.org/packages/ConfigCat.Client) package
```powershell
Install-Package ConfigCat.Client
```

### 2. Import package
```csharp
using ConfigCat.Client
```

### 3. Create the *ConfigCat* client with your *SDK Key*
```csharp
var client = new ConfigCatClient("#YOUR-SDK-KEY#");
```

### 4. Get your setting value
```csharp
var isMyAwesomeFeatureEnabled = client.GetValue("isMyAwesomeFeatureEnabled", false);
if(isMyAwesomeFeatureEnabled)
{
    doTheNewThing();
}
else
{
    doTheOldThing();
}
```

### 5. Dispose *ConfigCat* client
You can safely `dispose()` the client instance and release all associated resources on application exit.
```csharp
client.Dispose();
```

## Creating the *ConfigCat Client*
*ConfigCat Client* is responsible for:
- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`new ConfigCatClient()` creates a client with default options.

| Properties          | Description | Default |
| ------------------- | ----------- | ------- |
| `SdkKey`            | **REQUIRED.** SDK Key to access your feature flags and configurations. Get it from *ConfigCat Dashboard*. | |
| `PollingMode`       | Optional, sets the polling mode for the client. [More about polling modes](#polling-modes). | `PollingModes.AutoPoll()` |
| `ConfigCache`       | Optional, [`IConfigCache`](https://github.com/configcat/.net-sdk/blob/master/src/ConfigCatClient/Cache/IConfigCache.cs) instance for cache the config. | [`InMemoryConfigCache`](https://github.com/configcat/.net-sdk/blob/master/src/ConfigCatClient/Cache/InMemoryConfigCache.cs) |
| `Logger`            | Optional, [`ILogger`](https://github.com/configcat/.net-sdk/blob/master/src/ConfigCatClient/Logging/ILogger.cs) instance for tracing. | [`ConsoleLogger`](https://github.com/configcat/.net-sdk/blob/master/src/ConfigCatClient/Logging/ConsoleLogger.cs) (with WARNING level) |
| `HttpClientHandler` | Optional, `HttpClientHandler` to provide network credentials and proxy settings. [More about the proxy settings](##using-configcat-behind-a-proxy). | built-in HttpClientHandler |
| `HttpTimeout`       | Optional, sets the underlying HTTP client's timeout. [More about the HTTP timeout](#http-timeout). | `TimeSpan.FromSeconds(30)` |
| `FlagOverrides`     | Optional, configures local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides). | |
| `DataGovernance`    | Optional, defaults to `Global`. Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `Global`, `EuOnly` | `Global` |

:::caution
We strongly recommend you to use the `ConfigCatClient` as a Singleton object in your application.
If you want to use multiple SDK Keys in the same application, create only one `ConfigCatClient` per SDK Key.
:::

## Anatomy of `GetValue()`, `GetValueAsync()`

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
```csharp
User userObject = new User("435170f4-8a8b-4b67-a723-505ac7cdea92");
client.GetValue("keyOfMySetting", false, userObject);
```

### User Object
The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature. 
``` csharp
User userObject = new User("435170f4-8a8b-4b67-a723-505ac7cdea92");
```
``` csharp
User userObject = new User("john@example.com");
```
| Parameters | Description                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `Id`       | **REQUIRED.** Unique identifier of a user in your application. Can be any `string` value, even an email address.                |
| `Email`    | Optional parameter for easier targeting rule definitions.                                                                       |
| `Country`  | Optional parameter for easier targeting rule definitions.                                                                       |
| `Custom`   | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |
``` csharp
User userObject = new User("435170f4-8a8b-4b67-a723-505ac7cdea92") {
    Email = "john@example.com",
    Country = "United Kingdom",
    Custom = new Dictionary<string, string> {
        {"SubscriptionType", "Pro"}, 
        {"UserRole", "Admin"}}
};
```

## Polling Modes
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all `GetValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.

### Auto polling (default)
The *ConfigCat SDK* downloads and stores the latest values automatically every 60 seconds.

Use the `pollInterval` option parameter to change the polling interval.
```csharp
IConfigCatClient client = new ConfigCatClient(options => 
{
    options.SdkKey = "#YOUR-SDK-KEY#";
    options.PollingMode = PollingModes.AutoPoll(pollInterval: TimeSpan.FromSeconds(95));
});
```

Subscribing to the `OnConfigurationChanged` event will get you notified about changes.
```csharp
IConfigCatClient client = new ConfigCatClient(options => 
{
    options.SdkKey = "#YOUR-SDK-KEY#";
    var autoPoll = PollingModes.AutoPoll();
    autoPoll.OnConfigurationChanged += (sender, args) => 
    {
        Console.WriteLine("Your config has been changed!");
    };
    options.PollingMode = autoPoll;
});
```

Available options:

| Option Parameter          | Description                                                                                          | Default |
| ------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| `pollInterval`            | Polling interval.                                                                                    | 60s     |
| `maxInitWaitTime`         | Maximum waiting time between the client initialization and the first config acquisition in seconds.  | 5s      |

### Lazy loading
When calling `GetValue()` or `GetValueAsync()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `GetValue())` or `GetValueAsync()` will return the setting value after the cache is updated.

Use `cacheTimeToLive` parameter to manage configuration lifetime.
```csharp
IConfigCatClient client = new ConfigCatClient(options => 
{
    options.SdkKey = "#YOUR-SDK-KEY#";
    options.PollingMode = PollingModes.LazyLoad(cacheTimeToLive: TimeSpan.FromSeconds(600));
});
```

Available options:

| Option Parameter         | Description | Default |
| ------------------------ | ----------- | ------- |
| `cacheTimeToLive`        | Cache TTL.  | 60s     |

### Manual polling
Manual polling gives you full control over when the `config.json` (with the setting values) is downloaded. *ConfigCat SDK* will not update them automatically. Calling `ForceRefresh()` is your application's responsibility.

```csharp
IConfigCatClient client = new ConfigCatClient(options => 
{
    options.SdkKey = "#YOUR-SDK-KEY#";
    options.PollingMode = PollingModes.ManualPoll;
});

client.ForceRefresh();
```

> `GetValue()` returns `defaultValue` if the cache is empty. Call `ForceRefresh()` to update the cache.

```csharp
IConfigCatClient client = new ConfigCatClient(options => 
{
    options.SdkKey = "#YOUR-SDK-KEY#";
    options.PollingMode = PollingModes.ManualPoll;
});

Console.WriteLine(client.GetValue("key", "my default value")); // console: "my default value"
client.ForceRefresh();
Console.WriteLine(client.GetValue("key", "my default value")); // console: "value from server"
```

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local/Offline mode** (`OverrideBehaviour.LocalOnly`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour.LocalOverRemote`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour.RemoteOverLocal`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can load your feature flag & setting overrides from a file or from a simple `Dictionary<string, object>` structure.

### JSON File

The SDK can be configured to load your feature flag & setting overrides from a file. 
You can also specify whether the file should be reloaded when it gets modified.
#### File
```csharp
IConfigCatClient client = new ConfigCatClient(options =>
{
    options.SdkKey = "localhost";
    options.FlagOverrides = FlagOverrides.LocalFile(
        "path/to/local_flags.json", // path to the file
        true, // reload the file when it gets modified
        OverrideBehaviour.LocalOnly // local/offline mode
    );
});
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

### Dictionary
You can set up the SDK to load your feature flag & setting overrides from a `Dictionary<string, object>`.
```csharp
var dictionary = new Dictionary<string, object>
{
    {"enabledFeature", true},
    {"disabledFeature", false},
    {"intSetting", 5},
    {"doubleSetting", 3.14},
    {"stringSetting", "test"},
};

IConfigCatClient client = new ConfigCatClient(options =>
{
    options.SdkKey = "localhost";
    options.FlagOverrides = FlagOverrides.LocalDictionary(dictionary, OverrideBehaviour.LocalOnly);
});
```

## Logging
### Setting log level
```csharp
IConfigCatClient client = new ConfigCatClient("#YOUR-SDK-KEY#");

client.LogLevel = LogLevel.Info;
```

Available log levels:

| Level   | Description                                             |
| ------- | ------------------------------------------------------- |
| Off     | Nothing is logged.                                      |
| Error   | Only error level events are logged.                     |
| Warning | Default. Errors and Warnings are logged.                |
| Info    | Errors, Warnings and feature flag evaluation is logged. |
| Debug   | All of the above plus debug info is logged.             |

Info level logging helps to inspect the feature flag evaluation process:
```bash
ConfigCat - Info -  Evaluate 'isPOCFeatureEnabled'
 User object: {"Identifier":"<SOME USERID>","Email":"configcat@example.com","Country":"US","Custom":{"SubscriptionType":"Pro","Role":"Admin","version":"1.0.0"}}
 evaluate rule: 'configcat@example.com' CONTAINS '@something.com' => no match
 evaluate rule: 'configcat@example.com' CONTAINS '@example.com' => match
 Returning: True
```

Sample code on how to create a basic file logger implementation for ConfigCat client: <a href="https://github.com/configcat/.net-sdk/blob/master/samples/FileLoggerSample.cs" target="_blank">See Sample Code</a>

## .GetAllKeys()
You can get all the setting keys from your configuration by calling the `GetAllKeys()` method of the `ConfigCatClient`.

```csharp
IConfigCatClient client = new ConfigCatClient("#YOUR-SDK-KEY#");
IEnumerable<string> keys = client.GetAllKeys();
```

## Using ConfigCat behind a proxy
Provide your own network credentials (username/password), and proxy server settings (proxy server/port) by injecting a HttpClientHandler instance into the ConfigCatClient's configuration.

```csharp
var myProxySettings = new WebProxy(proxyHost, proxyPort)
{
    UseDefaultCredentials = false,
    Credentials = new NetworkCredential(proxyUserName, proxyPassword)
};

var myHttpClientHandler = new HttpClientHandler { Proxy = myProxySettings };

IConfigCatClient client = new ConfigCatClient(options =>
{
    options.SdkKey = "#YOUR-SDK-KEY#";
    options.HttpClientHandler = myHttpClientHandler;
});
```

## HTTP Timeout
You can set the maximum wait time for a ConfigCat HTTP response.
```csharp
IConfigCatClient client = new ConfigCatClient(options =>
{
    options.SdkKey = "#YOUR-SDK-KEY#";
    options.HttpTimeout = TimeSpan.FromSeconds(10);
});
```
The default timeout is 30 seconds.

## Sample Applications
Check out our Sample Applications how they use the ConfigCat SDK:
* <a href="https://github.com/ConfigCat/.net-sdk/tree/master/samples/ConsoleApp" target="_blank">Sample Console App</a>
* <a href="https://github.com/ConfigCat/.net-sdk/tree/master/samples/ASP.NETCore" target="_blank">Sample Web App</a>

## Look under the hood
* <a href="https://github.com/ConfigCat/.net-sdk" target="_blank">ConfigCat .Net SDK on GitHub</a>
* <a href="https://www.nuget.org/packages/ConfigCat.Client" target="_blank">ConfigCat .Net SDK on nuget.org</a>
