---
id: csharp
title: .NET, .NET Core
---
## Getting started:
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

| Properties          | Description                                                                                               | Default                            |
| ------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `SdkKey`            | **REQUIRED.** SDK Key to access your feature flags and configurations. Get it from *ConfigCat Dashboard*. |                                    |
| `ConfigCache`       | IConfigCache instance for cache the config.                                                               | InMemoryConfigCache                |
| `Logger`            | ILogger instance for tracing.                                                                             | ConsoleLogger (with WARNING level) |
| `HttpClientHandler` | HttpClientHandler to provide network credentials and proxy settings                                       | built-in HttpClientHandler         |
| `DataGovernance`    | Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `Global`, `EuOnly` | Global                             |



`AutoPollConfiguration`, `LazyLoadConfiguration`, `ManualPollConfiguration`  
Creating the client is different for each polling mode.
[See below](#polling-modes) for details.

:::caution
We strongly recommend you to use the ConfigCatClient as a singleton object in your application
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

Use the `PollIntervalSeconds` option parameter to change the polling interval.
```csharp
var clientConfiguration = new AutoPollConfiguration
{
    SdkKey = "#YOUR-SDK-KEY#",
    PollIntervalSeconds = 95
};
IConfigCatClient client = new ConfigCatClient(clientConfiguration);
```

Subscribing to the `OnConfigurationChanged` event will get you notified about changes.
```csharp
var clientConfiguration = new AutoPollConfiguration
    {
        SdkKey = "#YOUR-SDK-KEY#"
    };
clientConfiguration.OnConfigurationChanged += (sender, args) => 
    {
        Console.WriteLine("Your config has been changed!");
    };
IConfigCatClient client = new ConfigCatClient(clientConfiguration);
```

Available options:

| Option Parameter          | Description                                                                                          | Default |
| ------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| `PollIntervalSeconds`     | Polling interval.                                                                                    | 60      |
| `MaxInitWaitTimeSeconds ` | Maximum waiting time between the client initialization and the first config acquisition in seconds.  | 5       |

### Lazy loading
When calling `GetValue()` or `GetValueAsync()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `GetValue())` or `GetValueAsync()` will return the setting value after the cache is updated.

Use `CacheTimeToLiveSeconds` parameter to manage configuration lifetime.
```csharp
var clientConfiguration = new LazyLoadConfiguration
{
    SdkKey = "#YOUR-SDK-KEY#",
    CacheTimeToLiveSeconds = 600
};
IConfigCatClient client = new ConfigCatClient(clientConfiguration);
```

Available options:

| Option Parameter         | Description | Default |
| ------------------------ | ----------- | ------- |
| `CacheTimeToLiveSeconds` | Cache TTL.  | 60      |

### Manual polling
Manual polling gives you full control over when the setting values are downloaded. *ConfigCat SDK* will not update them automatically. Calling `ForceRefresh()` is your application's responsibility.

```csharp
var clientConfiguration = new ManualPollConfiguration
{
    SdkKey = "#YOUR-SDK-KEY#"
};
IConfigCatClient client = new ConfigCatClient(clientConfiguration);

client.ForceRefresh();
```
> `GetValue()` returns `defaultValue` if the cache is empty. Call `ForceRefresh()` to update the cache.
```csharp
var clientConfiguration = new ManualPollConfiguration
{
    SdkKey = "#YOUR-SDK-KEY#"
};
IConfigCatClient client = new ConfigCatClient(clientConfiguration);

Console.WriteLine(client.GetValue("key", "my default value")); // console: "my default value"
client.ForceRefresh();
Console.WriteLine(client.GetValue("key", "my default value")); // console: "value from server"
```

## Logging
### Setting log levels
```csharp
var client = new ConfigCatClient("#YOUR-SDK-KEY#");

client.LogLevel = LogLevel.Info;
```

Available log levels:
| Level   | Description                                             |
| ------- | ------------------------------------------------------- |
| Off     | Nothing is logged.                                      |
| Error   | Only error level events are logged.                     |
| Warning | Errors and Warnings are logged.                         |
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

## Configuration with ConfigCatClientBuilder
You can use `ConfigCatClientBuilder` to create the *ConfigCat* client instance:
```csharp
IConfigCatClient client = ConfigCatClientBuilder
    .Initialize("#YOUR-SDK-KEY#")
    .WithLazyLoad()
    .WithCacheTimeToLiveSeconds(120)
    .Create();
```

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

var client = new ConfigCatClient(new AutoPollConfiguration
{
    HttpClientHandler = myHttpClientHandler,
    SdkKey = "#YOUR-SDK-KEY#",
});
```

## Sample Applications
Check out our Sample Applications how they use the ConfigCat SDK:
* <a href="https://github.com/ConfigCat/.net-sdk/tree/master/samples/ConsoleApp" target="_blank">Sample Console App</a>
* <a href="https://github.com/ConfigCat/.net-sdk/tree/master/samples/ASP.NETCore" target="_blank">Sample Web App</a>

## Look under the hood
* <a href="https://github.com/ConfigCat/.net-sdk" target="_blank">ConfigCat .Net SDK on GitHub</a>
* <a href="https://www.nuget.org/packages/ConfigCat.Client" target="_blank">ConfigCat .Net SDK on nuget.org</a>
