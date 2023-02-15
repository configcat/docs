---
id: dotnet
title: .NET, .NET Core SDK Reference
description: ConfigCat .NET, .NET Core SDK Reference. This is a step-by-step guide on how to use feature flags in your .NET, .NET Core application.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
export const NetSchema = require('@site/src/schema-markup/sdk-reference/net.json');

<script type='application/ld+json' dangerouslySetInnerHTML={ { __html: JSON.stringify(NetSchema) }}></script>

[![Star on GitHub](https://img.shields.io/github/stars/configcat/.net-sdk.svg?style=social)](https://github.com/configcat/.net-sdk/stargazers)
[![Build status](https://ci.appveyor.com/api/projects/status/3kygp783vc2uv9xr?svg=true)](https://ci.appveyor.com/project/ConfigCat/net-sdk) [![NuGet Version](https://buildstats.info/nuget/ConfigCat.Client)](https://www.nuget.org/packages/ConfigCat.Client/)
[![Sonar Coverage](https://img.shields.io/sonar/coverage/net-sdk?logo=SonarCloud&server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/project/overview?id=net-sdk)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=net-sdk&metric=alert_status)](https://sonarcloud.io/dashboard?id=net-sdk)

<a href="https://github.com/ConfigCat/.net-sdk" target="_blank">ConfigCat .Net SDK on GitHub</a>

## Getting started

### 1. Install _ConfigCat SDK_ [Nuget](https://www.nuget.org/packages/ConfigCat.Client) package

<Tabs groupId="dotnet-install">
<TabItem value="Powershell / NuGet Package Manager Console" label="Powershell / NuGet Package Manager Console">

```powershell
Install-Package ConfigCat.Client
```

</TabItem>
<TabItem value=".NET CLI" label=".NET CLI">

```
dotnet add package ConfigCat.Client
```

</TabItem>
</Tabs>

### 2. Import package

```csharp
using ConfigCat.Client;
```

### 3. Create the _ConfigCat_ client with your _SDK Key_

```csharp
var client = ConfigCatClient.Get("#YOUR-SDK-KEY#");
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

### 5. Dispose _ConfigCat_ client

You can safely dispose all clients at once or individually and release all associated resources on application exit.

```csharp
ConfigCatClient.DisposeAll(); // disposes all clients
// -or-
client.Dispose(); // disposes a specific client
```

## Creating the _ConfigCat Client_

_ConfigCat Client_ is responsible for:

- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`ConfigCatClient.Get(sdkKey: "<sdkKey>")` returns a client with default options.

### Customizing the _ConfigCat Client_

To customize the SDK's behavior, you can pass an additional `Action<ConfigCatClientOptions>` parameter to the `Get()` static 
factory method where the `ConfigCatClientOptions` class is used to set up the _ConfigCat Client_.

```csharp
IConfigCatClient client = ConfigCatClient.Get("#YOUR-SDK-KEY#", options =>
{
    options.PollingMode = PollingModes.ManualPoll;
    options.Logger = new ConsoleLogger(LogLevel.Info);
});
```

These are the available options on the `ConfigCatClientOptions` class:

| Properties          | Description                                                                                                                                                                                                                                                                                       | Default                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `PollingMode`       | Optional, sets the polling mode for the client. [More about polling modes](#polling-modes).                                                                                                                                                                                                       | `PollingModes.AutoPoll()`                                                                                                              |
| `ConfigCache`       | Optional, [`IConfigCache`](https://github.com/configcat/.net-sdk/blob/master/src/ConfigCatClient/Cache/IConfigCache.cs) instance for cache the config.                                                                                                                                            | [`InMemoryConfigCache`](https://github.com/configcat/.net-sdk/blob/master/src/ConfigCatClient/Cache/InMemoryConfigCache.cs)            |
| `Logger`            | Optional, [`ILogger`](https://github.com/configcat/.net-sdk/blob/master/src/ConfigCatClient/Logging/ILogger.cs) instance for tracing.                                                                                                                                                             | [`ConsoleLogger`](https://github.com/configcat/.net-sdk/blob/master/src/ConfigCatClient/Logging/ConsoleLogger.cs) (with WARNING level) |
| `BaseUrl`           | Optional, sets the CDN base url (forward proxy, dedicated subscription) from where the SDK will download the config.json.                                                                                                                                                                         |                                                                                                                                        |
| `HttpClientHandler` | Optional, `HttpClientHandler` to provide network credentials and proxy settings. [More about the proxy settings](##using-configcat-behind-a-proxy).                                                                                                                                               | built-in HttpClientHandler                                                                                                             |
| `HttpTimeout`       | Optional, sets the underlying HTTP client's timeout. [More about the HTTP timeout](#http-timeout).                                                                                                                                                                                                | `TimeSpan.FromSeconds(30)`                                                                                                             |
| `FlagOverrides`     | Optional, sets the local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides).                                                                                                                                                                                  |                                                                                                                                        |
| `DataGovernance`    | Optional, defaults to `Global`. Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `Global`, `EuOnly` | `Global`                                                                                                                               |
| `DefaultUser`       | Optional, sets the default user. [More about default user](#default-user).                                                                                                                                                                                                                        | `null` (none)                                                                                                                          |
| `Offline`           | Optional, determines whether the client should be initialized in offline mode. [More about offline mode](#online--offline-mode).                                                                                                                                                           | `false`                                                                                                                                |

Via the events provided by `ConfigCatClientOptions` you can also subscribe to the hooks (events) at the time of initialization. [More about hooks](#hooks).

For example:

```csharp
IConfigCatClient client = ConfigCatClient.Get("#YOUR-SDK-KEY#", options =>
{
    options.ClientReady += (s, e) => Debug.WriteLine("Client is ready!");
});
```

:::caution
We strongly recommend you to use the `ConfigCatClient` as a Singleton object in your application.
You can acquire singleton client instances for your SDK keys using the `ConfigCatClient.Get(sdkKey: <sdkKey>)` static factory method.
(However, please keep in mind that subsequent calls to `ConfigCatClient.Get()` with the _same SDK Key_ return a _shared_ client instance, which was set up by the first call.)
You can close all open clients at once using the `ConfigCatClient.DisposeAll()` method or do it individually using the `client.Dispose()` method.
:::

## Anatomy of `GetValue()`, `GetValueAsync()`

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** The key of a specific setting or feature flag. Set on _ConfigCat Dashboard_ for each setting.  |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```csharp
User userObject = new User("#UNIQUE-USER-IDENTIFIER#");  // Optional User Object
var value = client.GetValue("keyOfMySetting", false, userObject);
```

```csharp
User userObject = new User("#UNIQUE-USER-IDENTIFIER#"); // Optional User Object
var value = await client.GetValueAsync("keyOfMySetting", false, userObject);
```

## Anatomy of `GetValueDetails()`, `GetValueDetailsAsync()`

`GetValueDetails()`/`GetValueDetailsAsync()` are similar to `GetValue()`/`GetValueAsync()` but instead of returning the evaluated value only, they provide more detailed information about the evaluation result.

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** The key of a specific setting or feature flag. Set on _ConfigCat Dashboard_ for each setting.  |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```csharp
User userObject = new User("#UNIQUE-USER-IDENTIFIER#"); // Optional User Object
var details = client.GetValueDetails("keyOfMySetting", false, userObject);
```

```csharp
User userObject = new User("#UNIQUE-USER-IDENTIFIER#"); // Optional User Object
var details = await client.GetValueDetailsAsync("keyOfMySetting", false, userObject);
```

The `details` result contains the following information:

| Field                             | Type                                 | Description                                                                                                     |
| --------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `Key`                             | `string`                             | The key of the evaluated feature flag or setting.                                                               |
| `Value`                           | `bool` / `string` / `int` / `double` | The evaluated value of the feature flag or setting.                                                             |
| `User`                            | `User`                               | The user object used for the evaluation.                                                                        |
| `IsDefaultValue`                  | `bool`                               | True when the default value passed to `GetValueDetails()`/`GetValueDetailsAsync()` is returned due to an error. |
| `ErrorMessage`                    | `string`                             | In case of an error, this field contains the error message.                                                     |
| `ErrorException`                  | `Exception`                          | In case of an error, this field contains the related exception object (if any).                                 |
| `MatchedEvaluationRule`           | `RolloutRule`                        | If the evaluation was based on a targeting rule, this field contains that specific rule.                        |
| `MatchedEvaluationPercentageRule` | `RolloutPercentageItem`              | If the evaluation was based on a percentage rule, this field contains that specific rule.                       |
| `FetchTime`                       | `DateTime`                           | The last download time (UTC) of the current config.                                                             |

## User Object

The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature.

```csharp
User userObject = new User("#UNIQUE-USER-IDENTIFIER#"); // Optional User Object
```

```csharp
User userObject = new User("john@example.com");
```

| Parameters | Description                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `Id`       | **REQUIRED.** Unique identifier of a user in your application. Can be any `string` value, even an email address.                |
| `Email`    | Optional parameter for easier targeting rule definitions.                                                                       |
| `Country`  | Optional parameter for easier targeting rule definitions.                                                                       |
| `Custom`   | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |

```csharp
User userObject = new User("#UNIQUE-USER-IDENTIFIER#")
{
    Email = "john@example.com",
    Country = "United Kingdom",
    Custom = new Dictionary<string, string> {
        {"SubscriptionType", "Pro"},
        {"UserRole", "Admin"}}
};
```

### Default user

It's possible to set a default user object that will be used on feature flag and setting evaluation. It can be useful when your application has a single user only or rarely switches users.

You can set the default user object either on SDK initialization:

```csharp
IConfigCatClient client = ConfigCatClient.Get("#YOUR-SDK-KEY#", options =>
    options.DefaultUser = new User(identifier: "john@example.com"));
```

...or using the `SetDefaultUser()` method of the `ConfigCatClient` object:

```csharp
client.SetDefaultUser(new User(identifier: "john@example.com"));
```

Whenever the evaluation methods like `GetValue()`, `GetValueAsync()`, etc. are called without an explicit user object parameter, the SDK will automatically use the default user as a user object.

```csharp
var user = new User(identifier: "john@example.com");
client.SetDefaultUser(user);

// The default user will be used in the evaluation process.
var value = await client.GetValueAsync(key: "keyOfMySetting", defaultValue: false);
```

When a user object parameter is passed to the evaluation methods, it takes precedence over the default user.

```csharp
var user = new User(identifier: "john@example.com");
client.SetDefaultUser(user);

var otherUser = new User(identifier: "brian@example.com");

// otherUser will be used in the evaluation process.
var value = await client.GetValueAsync(key: "keyOfMySetting", defaultValue: false, user: otherUser);
```

You can also remove the default user by doing the following:

```csharp
client.ClearDefaultUser();
```

## Polling Modes

The _ConfigCat SDK_ supports 3 different polling mechanisms to acquire the setting values from _ConfigCat_. After latest setting values are downloaded, they are stored in the internal cache then all `GetValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.  
[More about polling modes.](/advanced/caching/)

### Auto polling (default)

The _ConfigCat SDK_ downloads and stores the latest values automatically every 60 seconds.

Use the `pollInterval` option parameter to change the polling interval.

```csharp
IConfigCatClient client = ConfigCatClient.Get("#YOUR-SDK-KEY#", options =>
{
    options.PollingMode = PollingModes.AutoPoll(pollInterval: TimeSpan.FromSeconds(95));
});
```

Available options:

| Option Parameter  | Description                                                                                         | Default |
| ----------------- | --------------------------------------------------------------------------------------------------- | ------- |
| `pollInterval`    | Polling interval.                                                                                   | 60s     |
| `maxInitWaitTime` | Maximum waiting time between the client initialization and the first config acquisition in seconds. | 5s      |

### Lazy loading

When calling `GetValue()` or `GetValueAsync()` the _ConfigCat SDK_ downloads the latest setting values if they are not present or expired in the cache. In this case the `GetValue())` or `GetValueAsync()` will return the setting value after the cache is updated.

Use `cacheTimeToLive` parameter to manage configuration lifetime.

```csharp
IConfigCatClient client = ConfigCatClient.Get("#YOUR-SDK-KEY#", options =>
{
    options.PollingMode = PollingModes.LazyLoad(cacheTimeToLive: TimeSpan.FromSeconds(600));
});
```

Available options:

| Option Parameter  | Description | Default |
| ----------------- | ----------- | ------- |
| `cacheTimeToLive` | Cache TTL.  | 60s     |

### Manual polling

Manual polling gives you full control over when the `config.json` (with the setting values) is downloaded. _ConfigCat SDK_ will not update them automatically. Calling `ForceRefresh()` is your application's responsibility.

```csharp
IConfigCatClient client = ConfigCatClient.Get("#YOUR-SDK-KEY#", options =>
{
    options.PollingMode = PollingModes.ManualPoll;
});

client.ForceRefresh();
```

> `GetValue()` returns `defaultValue` if the cache is empty. Call `ForceRefresh()` to update the cache.

```csharp
IConfigCatClient client = ConfigCatClient.Get("#YOUR-SDK-KEY#", options =>
{
    options.PollingMode = PollingModes.ManualPoll;
});

Console.WriteLine(client.GetValue("key", "my default value")); // console: "my default value"
client.ForceRefresh();
Console.WriteLine(client.GetValue("key", "my default value")); // console: "value from server"
```

## Hooks

The SDK provides several hooks (events), by means of which you can get notified of its actions.
Via the following events you can subscribe to particular events raised by the client:

- `event EventHandler ClientReady`: This event is raised when the SDK reaches the ready state. If the SDK is set up to use lazy load or manual polling, it's considered ready right after instantiation.
  If auto polling is used, the ready state is reached when the SDK has a valid config.json loaded into memory either from cache or from HTTP. If the config couldn't be loaded neither from cache nor from HTTP, the `ClientReady` event fires when the auto polling's `MaxInitWaitTime` has passed.
- `event EventHandler<ConfigChangedEventArgs> ConfigChanged`: This event is raised first when the SDK loads a valid config.json into memory from cache, then each time afterwards when a config.json with changed content is downloaded via HTTP.
- `event EventHandler<FlagEvaluatedEventArgs> FlagEvaluated`: This event is raised each time when the SDK evaluates a feature flag or setting. The event provides the same evaluation details that you would get from [`GetValueDetails()`/`GetValueDetailsAsync()`](#anatomy-of-getvaluedetails).
- `event EventHandler<ConfigCatClientErrorEventArgs> Error`: This event is raised when an error occurs within the ConfigCat SDK.

You can subscribe to these events either on initialization:

```csharp
IConfigCatClient client = ConfigCatClient.Get("#YOUR-SDK-KEY#", options =>
{
    options.PollingMode = PollingModes.ManualPoll;
    options.FlagEvaluated += (s, e) => { /* handle the event */ };
});
```

...or directly on the `ConfigCatClient` instance:

```csharp
client.FlagEvaluated += (s, e) => { /* handle the event */ };
```

## Online / Offline mode

In cases where you want to prevent the SDK from making HTTP calls, you can switch it to offline mode:

```csharp
client.SetOffline();
```

In offline mode, the SDK won't initiate HTTP requests and will work only from its cache.

To switch the SDK back to online mode, do the following:

```csharp
client.SetOnline();
```

Using the `client.IsOffline` property you can check whether the SDK is in offline mode.

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local only** (`OverrideBehaviour.LocalOnly`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour.LocalOverRemote`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour.RemoteOverLocal`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can load your feature flag & setting overrides from a file or from a simple `Dictionary<string, object>` structure.

### JSON File

The SDK can load your feature flag & setting overrides from a file.
You can also specify whether the file should be reloaded when it gets modified.

#### File

```csharp
IConfigCatClient client = ConfigCatClient.Get("localhost", options =>
{
    options.FlagOverrides = FlagOverrides.LocalFile(
        "path/to/local_flags.json", // path to the file
        true, // reload the file when it gets modified
        OverrideBehaviour.LocalOnly
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
  "f": {
    // list of feature flags & settings
    "isFeatureEnabled": {
      // key of a particular flag
      "v": false, // default value, served when no rules are defined
      "i": "430bded3", // variation id (for analytical purposes)
      "t": 0, // feature flag's type, possible values:
      // 0 -> BOOLEAN
      // 1 -> STRING
      // 2 -> INT
      // 3 -> DOUBLE
      "p": [
        // list of percentage rules
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
      "r": [
        // list of targeting rules
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
          // 16 -> 'IS ONE OF (Hashed)',
          // 17 -> 'IS NOT ONE OF (Hashed)'
          "c": "@example.com", // comparison value
          "v": true, // value served when the rule is selected during evaluation
          "i": "bcfb84a7" // variation id (for analytical purposes)
        }
      ]
    }
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

IConfigCatClient client = ConfigCatClient.Get("localhost", options =>
{
    options.FlagOverrides = FlagOverrides.LocalDictionary(dictionary, OverrideBehaviour.LocalOnly);
});
```

## Logging

### Setting log level

```csharp
IConfigCatClient client = ConfigCatClient.Get("#YOUR-SDK-KEY#");

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

Another sample which shows how to implement an adapter to [the built-in logging framework](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/logging) of .NET Core/.NET 5+: <a href="https://github.com/configcat/.net-sdk/blob/master/samples/ASP.NETCore/WebApplication/Adapters/ConfigCatToMSLoggerAdapter.cs" target="_blank">See Sample Code</a>

## `GetAllKeys()`, `GetAllKeysAsync()`

You can get all the setting keys from your configuration by calling the `GetAllKeys()` or `GetAllKeysAsync()` method of the `ConfigCatClient`.

```csharp
IConfigCatClient client = ConfigCatClient.Get("#YOUR-SDK-KEY#");
IEnumerable<string> keys = client.GetAllKeys();
```

```csharp
IConfigCatClient client = ConfigCatClient.Get("#YOUR-SDK-KEY#");
IEnumerable<string> keys = await client.GetAllKeysAsync();
```

## `GetAllValues()`, `GetAllValuesAsync()`

Evaluates and returns the values of all feature flags and settings. Passing a [User Object](#user-object) is optional.

```csharp
IConfigCatClient client = ConfigCatClient.Get("#YOUR-SDK-KEY#");
IDictionary<string, object> settingValues = client.GetAllValues();

// invoke with user object
User userObject = new User("#UNIQUE-USER-IDENTIFIER#");
IDictionary<string, object> settingValuesTargeting = client.GetAllValues(userObject);
```

```csharp
IConfigCatClient client = ConfigCatClient.Get("#YOUR-SDK-KEY#");
IDictionary<string, object> settingValues = await client.GetAllValuesAsync();

// invoke with user object
User userObject = new User("#UNIQUE-USER-IDENTIFIER#");
IDictionary<string, object> settingValuesTargeting = await client.GetAllValuesAsync(userObject);
```

## `GetAllValueDetails()`, `GetAllValueDetailsAsync()`

Evaluates and returns the values along with evaluation details of all feature flags and settings. Passing a [User Object](#user-object) is optional.

```csharp
IConfigCatClient client = ConfigCatClient.Get("#YOUR-SDK-KEY#");
IReadOnlyList<EvaluationDetails> settingValues = client.GetAllValueDetails();

// invoke with user object
User userObject = new User("435170f4-8a8b-4b67-a723-505ac7cdea92");
IReadOnlyList<EvaluationDetails> settingValuesTargeting = client.GetAllValueDetails(userObject);
```

```csharp
IConfigCatClient client = ConfigCatClient.Get("#YOUR-SDK-KEY#");
IReadOnlyList<EvaluationDetails> settingValues = await client.GetAllValueDetailsAsync();

// invoke with user object
User userObject = new User("435170f4-8a8b-4b67-a723-505ac7cdea92");
IReadOnlyList<EvaluationDetails> settingValuesTargeting = await client.GetAllValueDetailsAsync(userObject);
```

## Using ConfigCat behind a proxy

Provide your own network credentials (username/password) and proxy server settings (proxy server/port) by injecting a HttpClientHandler instance into the ConfigCatClient's initialization call.

```csharp
var myProxySettings = new WebProxy(proxyHost, proxyPort)
{
    UseDefaultCredentials = false,
    Credentials = new NetworkCredential(proxyUserName, proxyPassword)
};

var myHttpClientHandler = new HttpClientHandler { Proxy = myProxySettings };

IConfigCatClient client = ConfigCatClient.Get("#YOUR-SDK-KEY#", options =>
{
    options.HttpClientHandler = myHttpClientHandler;
});
```

## HTTP Timeout

You can set the maximum wait time for a ConfigCat HTTP response.

```csharp
IConfigCatClient client = ConfigCatClient.Get("#YOUR-SDK-KEY#", options =>
{
    options.HttpTimeout = TimeSpan.FromSeconds(10);
});
```

The default timeout is 30 seconds.

## Troubleshooting

When the ConfigCat SDK does not work as expected in your application, please check for the following potential problems:

- **Symptom:** Instead of the actual value, the default one is constantly returned by `GetValue()`/`GetValueAsync()` and
  the log contains the following message (provided that the client is set up to log error level events as described [here](#logging)):
  "Secure connection could not be established. Please make sure that your application is enabled to use TLS 1.2+."

  **Problem:** ConfigCat CDN servers require TLS 1.2 or newer security protocol for communication.
  As for allowed security protocols, please keep in mind that newer .NET runtimes rely on operating system settings,
  older versions, however, may need additional setup to make secure communication with the CDN servers work.

  | Runtime Version                              | Default Protocols      |
  | -------------------------------------------- | ---------------------- |
  | .NET Framework 4.5 and earlier               | SSL 3.0, TLS 1.0       |
  | .NET Framework 4.6                           | TLS 1.0, 1.1, 1.2, 1.3 |
  | .NET Framework 4.7+, .NET Core 1.0+, .NET 5+ | System (OS) Defaults   |

  As shown in the table above, if your application runs on .NET Framework 4.5, by default it will fail to establish a connection to the CDN servers.
  Read [this](https://stackoverflow.com/a/58195987/8656352) for more details.

  **Solution**: The best solution to the problem is to upgrade your application to target a newer runtime but in case that is not possible, you can use the following workaround:

  ```csharp
  ServicePointManager.SecurityProtocol |= SecurityProtocolType.Tls12;
  ```

  (Place this code at the startup of your application, **before** any instances of `ConfigCatClient` is created.)

## Sample Applications

Check out our Sample Applications how they use the ConfigCat SDK:

- <a href="https://github.com/ConfigCat/.net-sdk/tree/master/samples/ConsoleApp" target="_blank">Sample Console App</a>
- <a href="https://github.com/ConfigCat/.net-sdk/tree/master/samples/ASP.NETCore" target="_blank">Sample Web App</a>

## Guides

See the following guides on how to use ConfigCat's .NET SDK:

- <a href="https://configcat.com/blog/2022/11/25/feature-flags-in-net6/" target="_blank">.NET6</a>
- <a href="https://configcat.com/blog/2021/10/10/aspnetcore-options-pattern/" target="_blank">.NET Core</a>

## Look under the hood

- <a href="https://github.com/ConfigCat/.net-sdk" target="_blank">ConfigCat .Net SDK on GitHub</a>
- <a href="https://www.nuget.org/packages/ConfigCat.Client" target="_blank">ConfigCat .Net SDK on nuget.org</a>
