---
id: csharp
title: .NET (C#)
---
## Getting started:
### 1. Install *ConfigCat SDK* <a href="https://www.nuget.org/packages/ConfigCat.Client" target="_blank">Nuget</a> package
```powershell
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
| `ApiKey`        | **REQUIRED.** API Key to access your feature flags and configurations. Get it from *ConfigCat Management Console*. |                                       |
| `LoggerFactory` | Factory to create an ILogger instance for tracing.                                                                 | NullTrace (no default tracing method) |

`AutoPollConfiguration`, `LazyLoadConfiguration`, `ManualPollConfiguration`  
Creating the client is different for each polling mode.
[See below](#polling-modes) for details.

> We strongly recommend you to use the ConfigCatClient as a singleton object in your application


## Anatomy of `GetValue()`, `GetValueAsync()`

| Parameters     | Description                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| `key`          | **REQUIRED.** Setting-specific key. Set in *ConfigCat Management Console* for each setting.                     |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                                  |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
```csharp
User userObject = new User("435170f4-8a8b-4b67-a723-505ac7cdea92");
client.GetValue("keyOfMySetting", false, userObject);
```

### User Object
The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting]((advanced/targeting.md)) feature. 
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
var clientConfiguration = new AutoPollConfiguration
{
    ApiKey = "#YOUR-API-KEY#",
    PollIntervalSeconds = 95
};
IConfigCatClient client = new ConfigCatClient(clientConfiguration);
```

Subscribing to the `OnConfigurationChanged` event will get you notified about changes.
```csharp
var clientConfiguration = new AutoPollConfiguration
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
var clientConfiguration = new LazyLoadConfiguration
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
var clientConfiguration = new ManualPollConfiguration
{
    ApiKey = "#YOUR-API-KEY#"
};
IConfigCatClient client = new ConfigCatClient(clientConfiguration);

client.ForceRefresh();
```
> `GetValue()` returns `defaultValue` if the cache is empty. Call `ForceRefresh()` to update the cache.
```csharp
var clientConfiguration = new ManualPollConfiguration
{
    ApiKey = "#YOUR-API-KEY#"
};
IConfigCatClient client = new ConfigCatClient(clientConfiguration);

Console.WriteLine(client.GetValue("key", "my default value")); // console: "my default value"
client.ForceRefresh();
Console.WriteLine(client.GetValue("key", "my default value")); // console: "value from server"
```

### Logging
You can set `LoggerFactory` property on any configuration object. This value is a factory object to create a `ILogger` instance.

The following example shows how to configure the ConsoleLoggerFactory to log messages to the `System.Console`. 
```csharp
 var clientConfiguration = new LazyLoadConfiguration
{
    ApiKey = "#YOUR-API-KEY#",               
    LoggerFactory = new ConsoleLoggerFactory()
};

IConfigCatClient client = new ConfigCatClient(clientConfiguration);
```

You can create your logger implementation easily. Implement `ConfigCat.Client.ILogger` and `ConfigCat.Client.ILoggerFactory` interface and setup in the configuration.

This example shows how to create a basic file logger implementation for ConfigCat client
```csharp
using System;
using System.IO;
using ConfigCat.Client;

namespace SampleApplication
{
    class Program
    {
        class MyFileLogger : LoggerBase
        {
            private readonly string filePath;
            private static object lck = new object();

            public MyFileLogger(string filePath, string loggerName, LogLevel logLevel) : base(loggerName, logLevel)
            {
                this.filePath = filePath;
            }

            protected override void LogMessage(string message)
            {
                lock (lck) // ensure thread safe
                {
                    System.IO.File.AppendAllText(this.filePath, message + Environment.NewLine); 
                }
            }
        }

        class MyFileLoggerFactory : ILoggerFactory
        {
            private readonly string filePath;
            private readonly LogLevel logLevel;

            public MyFileLoggerFactory(string filePath, LogLevel logLevel)
            {
                this.filePath = filePath;
                this.logLevel = logLevel;
            }

            public ILogger GetLogger(string loggerName)
            {
                return new MyFileLogger(this.filePath, loggerName, this.logLevel);
            }
        }

        static void Main(string[] args)
        {            
            string filePath = Path.Combine(Environment.CurrentDirectory, "configcat.log");
            LogLevel logLevel = LogLevel.Warn; // I would like to log only WARNING and higher entires.

            var clientConfiguration = new AutoPollConfiguration
            {
                ApiKey = "#YOUR-API-KEY#",
                LoggerFactory = new MyFileLoggerFactory(filePath, logLevel),
                PollIntervalSeconds = 5
            };

            IConfigCatClient client = new ConfigCatClient(clientConfiguration);

            var feature = client.GetValue("keyNotExists", "N/A");

            Console.ReadKey();
        }
    }
}
```

### Configuration with clientbuilder
You can use `ConfigCatClientBuilder` to create the *ConfigCat* client instance:
```csharp
IConfigCatClient client = ConfigCatClientBuilder
    .Initialize("#YOUR-API-KEY#")
    .WithLazyLoad()
    .WithCacheTimeToLiveSeconds(120)
    .Create();
```

## `GetAllKeys()`
You can get all the setting keys from your configuration by calling the `GetAllKeys()` method of the `ConfigCatClient`.

```csharp
IConfigCatClient client = new ConfigCatClient("#YOUR-API-KEY#");
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
    ApiKey = "#YOUR-API-KEY#",
});
```

## Sample Applications
Check out our Sample Applications how they use the ConfigCat SDK:
* <a href="https://github.com/ConfigCat/.net-sdk/tree/master/samples/ConsoleApp" target="_blank">Sample Console App</a>
* <a href="https://github.com/ConfigCat/.net-sdk/tree/master/samples/ASP.NETCore" target="_blank">Sample Web App</a>

## Look under the hood
* <a href="https://github.com/ConfigCat/.net-sdk" target="_blank">ConfigCat .Net SDK on GitHub</a>
* <a href="https://www.nuget.org/packages/ConfigCat.Client" target="_blank">ConfigCat .Net SDK on nuget.org</a>
