---
id: csharp
title: .NET (C#)
---
## Getting started:
### 1. Install *ConfigCat SDK* <a href="https://www.nuget.org/packages/ConfigCat.Client" target="_blank">Nuget</a> package
```PowerShell
Install-Package ConfigCat.Client
```

### 2. Import package
```csharp
using ConfigCat.Client
```

### 3. Create the *ConfigCat* client with your *API Key*
```csharp
var client = new ConfigCatClient("#YOUR-API-KEY#");
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
| Properties      | Description                                                                                                        | Default                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| `ApiKey`        | **REQUIRED.** API Key to access your feature flags and configurations. Get it from *ConfigCat Management Console*. |
| `LoggerFactory` | Factory to create an ILogger instance for tracing.                                                                 | NullTrace (no default tracing method) |

`AutoPollConfiguration`, `LazyLoadConfiguration`, `ManualPollConfiguration`  
Creating the client is different for each polling mode.
[See below](#polling-modes) for details.

> We strongly recommend you to use the ConfigCatClient as a singleton object in your application


## Anatomy of `GetValue()`, `GetValueAsync()`
| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set in *ConfigCat Management Console* for each setting.                  |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](../../advanced/targeting) |
```csharp
User userObject = new User("435170f4-8a8b-4b67-a723-505ac7cdea92");
configCatClient.GetValue("keyOfMySetting", false, userObject);
```

### User Object 
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
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all requests are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.

### Auto polling (default)
The *ConfigCat SDK* downloads and stores the latest values automatically every 60 seconds.

Use the `PollIntervalSeconds` option parameter to change the polling interval.
```csharp
var clientConfiguration = new ConfigCat.Client.Configuration.AutoPollConfiguration
{
    ApiKey = "#YOUR-API-KEY#",
    PollIntervalSeconds = 95
};
IConfigCatClient client = new ConfigCatClient(clientConfiguration);
```

Subscribing to the `OnConfigurationChanged` event will get you notified about changes.
```csharp
var clientConfiguration = new ConfigCat.Client.Configuration.AutoPollConfiguration
    {
        ApiKey = "#YOUR-API-KEY#"
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
| `MaxInitWaitTimeSeconds ` | Maximum waiting time between the client initialization and the first config acquisition in secconds. | 5       |

### Lazy loading
When calling `GetValue()` or `GetValueAsync()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `GetValue())` or `GetValueAsync()` will return the setting value after the cache is updated.

Use `CacheTimeToLiveSeconds` parameter to manage configuration lifetime.
```csharp
var clientConfiguration = new ConfigCat.Client.Configuration.LazyLoadConfiguration
{
    ApiKey = "#YOUR-API-KEY#",
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
var clientConfiguration = new ConfigCat.Client.Configuration.ManualPollConfiguration
{
    ApiKey = "#YOUR-API-KEY#"
};
IConfigCatClient client = new ConfigCatClient(clientConfiguration);

client.ForceRefresh();
```
> `GetValue()` returns `defaultValue` if the cache is empty. Call `ForceRefresh()` to update the cache.
```csharp
var clientConfiguration = new ConfigCat.Client.Configuration.ManualPollConfiguration
{
    ApiKey = "#YOUR-API-KEY#"
};
IConfigCatClient client = new ConfigCatClient(clientConfiguration);

Console.WriteLine(client.GetValue("key", "my default value")); // console: "my default value"
client.ForceRefresh();
Console.WriteLine(client.GetValue("key", "my default value")); // console: "value from server"
```

### Configuration with clientbuilder
You can use `ConfigCatClientBuilder` to create the *ConfigCat* client instance:
```csharp
IConfigCatClient client = ConfigCatClientBuilder
    .Initialize("#YOUR-API-KEY#")
    .WithLazyLoad()
    .WithCacheTimeToLiveSeconds(120)
    .Build();
```

## Sample Applications
Check out our Sample Applications how they use the ConfigCat SDK:
* <a href="https://github.com/ConfigCat/.net-sdk/tree/master/samples/ConsoleApp" target="_blank">Sample Console App</a>
* <a href="https://github.com/ConfigCat/.net-sdk/tree/master/samples/ASP.NETCore" target="_blank">Sample Web App</a>

## Go deeper
* <a href="https://github.com/ConfigCat/.net-sdk" target="_blank">ConfigCat .Net SDK on GitHub</a>
* <a href="https://www.nuget.org/packages/ConfigCat.Client" target="_blank">ConfigCat .Net SDK on nuget.org</a>
