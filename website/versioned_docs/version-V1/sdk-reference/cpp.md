---
id: cpp
title: C++ SDK Reference
description: ConfigCat C++ SDK Reference. This is a step-by-step guide on how to use feature flags in your C++ application.
---

export const CPPSchema = require('@site/src/schema-markup/sdk-reference/cpp.json');

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(CPPSchema) }}
></script>

[![Star on GitHub](https://img.shields.io/github/stars/configcat/cpp-sdk.svg?style=social)](https://github.com/configcat/cpp-sdk/stargazers)
[![Build Status](https://img.shields.io/github/actions/workflow/status/configcat/cpp-sdk/cpp-ci.yml?logo=GitHub&label=windows%20%2F%20macos%20%2F%20linux&branch=main)](https://github.com/configcat/cpp-sdk/actions/workflows/cpp-ci.yml)
[![Coverage Status](https://codecov.io/gh/configcat/cpp-sdk/branch/main/graph/badge.svg?token=cvUgfof8k7)](https://codecov.io/gh/configcat/cpp-sdk)

<p>
  <a href="https://github.com/configcat/cpp-sdk" target="_blank">ConfigCat C++ SDK on GitHub</a>
</p>

:::info
This documentation applies to the **v3.x version** of the ConfigCat C++ SDK. For the documentation of the latest release, please refer to [this page](/V2/sdk-reference/cpp).
:::

## Getting Started:

### 1. Add the ConfigCat SDK to your project

With **[Vcpkg](https://github.com/microsoft/vcpkg)**

- On Windows:

  ```cmd
  git clone https://github.com/microsoft/vcpkg
  .\vcpkg\bootstrap-vcpkg.bat
  .\vcpkg\vcpkg install configcat
  ```

  In order to use vcpkg with Visual Studio,
  run the following command (may require administrator elevation):

  ```cmd
  .\vcpkg\vcpkg integrate install
  ```

  After this, you can create a New non-CMake Project (or open an existing one).
  All installed libraries are immediately ready to be `#include`d and used
  in your project without additional setup.

- On Linux/Mac:
  ```bash
  git clone https://github.com/microsoft/vcpkg
  ./vcpkg/bootstrap-vcpkg.sh
  ./vcpkg/vcpkg install configcat
  ```

### 2. Include _configcat.h_ header in your application code:

```cpp
#include <configcat/configcat.h>

using namespace configcat;
```

### 3. Create the _ConfigCat_ client with your _SDK Key_

```cpp
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#");
```

### 4. Get your setting value

```cpp
bool isMyAwesomeFeatureEnabled = client->getValue("isMyAwesomeFeatureEnabled", false);
if (isMyAwesomeFeatureEnabled) {
    doTheNewThing();
} else {
    doTheOldThing();
}
```

### 5. Close _ConfigCat_ client​

You can safely shut down all clients at once or individually and release all associated resources on application exit.

```cpp
ConfigCatClient::closeAll(); // closes all clients

ConfigCatClient::close(client); // closes a specific client
```

## Setting up the _ConfigCat Client_

_ConfigCat Client_ is responsible for:

- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`ConfigCatClient::get("#YOUR-SDK-KEY#")` returns a client with default options.

| Properties         | Description                                                                                                                                                                                                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `baseUrl`          | Optional, sets the CDN base url (forward proxy, dedicated subscription) from where the SDK will download the config JSON.                                                                                                                                                                          |
| `dataGovernance`   | Optional, defaults to `Global`. Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](/advanced/data-governance). Available options: `Global`, `EuOnly`. |
| `connectTimeoutMs` | Optional, defaults to `8000ms`. Sets the amount of milliseconds to wait for the server to make the initial connection (i.e. completing the TCP connection handshake). `0` means it never times out during transfer                                                                                 |
| `readTimeoutMs`    | Optional, defaults to `5000ms`. Sets the amount of milliseconds to wait for the server to respond before giving up. `0` means it never times out during transfer.                                                                                                                                  |
| `pollingMode`      | Optional, sets the polling mode for the client. [More about polling modes](#polling-modes).                                                                                                                                                                                                        |
| `configCache`      | Optional, sets a custom cache implementation for the client. [More about cache](#custom-cache).                                                                                                                                                                                                    |
| `logger`           | Optional, sets the internal logger and log level. [More about logging](#logging).                                                                                                                                                                                                                  |
| `flagOverrides`    | Optional, sets the local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides).                                                                                                                                                                                   |
| `defaultUser`      | Optional, sets the default user. [More about default user](#default-user).                                                                                                                                                                                                                         |
| `offline`          | Optional, defaults to `false`. Indicates whether the SDK should be initialized in offline mode. [More about offline mode](#online--offline-mode).                                                                                                                                                  |
| `hooks`            | Optional, used to subscribe events that the SDK sends in specific scenarios. [More about hooks](#hooks).                                                                                                                                                                                           |

```cpp
ConfigCatOptions options;
options.pollingMode = PollingMode::manualPoll();
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", &options);
```

:::caution
We strongly recommend you to use the `ConfigCatClient` as a Singleton object in your application.
The `ConfigCatClient` constructs singleton client instances for your SDK keys with its `ConfigCatClient::get(<sdkKey>)` static factory method.
These clients can be closed all at once with `ConfigCatClient::closeAll()` method or individually with the `ConfigCatClient::close(client)`.
:::

## Anatomy of `getValue()`

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** The key of a specific setting or feature flag. Set on _ConfigCat Dashboard_ for each setting.  |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](/advanced/targeting) |

```cpp
auto user = ConfigCatUser("#USER-IDENTIFIER#");
auto value = client->getValue(
    "keyOfMySetting", // key
    false, // defaultValue
    &user, // Optional User Object
);
```

## Anatomy of `getValueDetails()`

`getValueDetails()` is similar to `getValue()` but instead of returning the evaluated value only, it gives more detailed information about the evaluation result.

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** The key of a specific setting or feature flag. Set on _ConfigCat Dashboard_ for each setting.  |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](/advanced/targeting) |

```cpp
auto user = ConfigCatUser("#USER-IDENTIFIER#");
auto details = client->getValueDetails(
    "keyOfMySetting", // key
    false, // defaultValue
    &user, // Optional User Object
);
```

The `details` result contains the following information:

| Field                             | Type                                 | Description                                                                               |
| --------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------- |
| `value`                           | `variant<bool, string, int, double>` | The evaluated value of the feature flag or setting.                                       |
| `key`                             | `string`                             | The key of the evaluated feature flag or setting.                                         |
| `isDefaultValue`                  | `bool`                               | True when the default value passed to getValueDetails() is returned due to an error.      |
| `error`                           | `string`                             | In case of an error, this field contains the error message.                               |
| `user`                            | `ConfigCatUser*`                     | The User Object that was used for evaluation.                                             |
| `matchedEvaluationPercentageRule` | `optional<RolloutPercentageItem>`    | If the evaluation was based on a percentage rule, this field contains that specific rule. |
| `matchedEvaluationRule`           | `optional<RolloutRule>`              | If the evaluation was based on a Targeting Rule, this field contains that specific rule.  |
| `fetchTime`                       | `chrono::time_point`                 | The last download time of the current config.                                             |

## User Object

The [User Object](/advanced/user-object) is essential if you'd like to use ConfigCat's [Targeting](/advanced/targeting) feature.

```cpp
auto user = ConfigCatUser("#UNIQUE-USER-IDENTIFIER#");
```

```cpp
auto user = ConfigCatUser("john@example.com");
```

### Customized User Object creation

| Argument  | Description                                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `id`      | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                         |
| `email`   | Optional parameter for easier Targeting Rule definitions.                                                                       |
| `country` | Optional parameter for easier Targeting Rule definitions.                                                                       |
| `custom`  | Optional dictionary for custom attributes of a user for advanced Targeting Rule definitions. e.g. User role, Subscription type. |

```cpp
auto user = ConfigCatUser(
    "#UNIQUE-USER-IDENTIFIER#", // userID
    "john@example.com", // email
    "United Kingdom", // country
    {
        {"SubscriptionType": "Pro"},
        {"UserRole": "Admin"}
    } // custom
);
```

### Default user

There's an option to set a default User Object that will be used at feature flag and setting evaluation. It can be useful when your application has a single user only, or rarely switches users.

You can set the default User Object either on SDK initialization:

```cpp
ConfigCatOptions options;
options.defaultUser = make_shared<ConfigCatUser>("john@example.com");
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", &options);
```

or with the `setDefaultUser()` method of the ConfigCat client.

```cpp
client->setDefaultUser(make_shared<ConfigCatUser>("john@example.com"));
```

Whenever the `getValue()`, `getValueDetails()`, `getAllValues()`, or `getAllValueDetails()` methods are called without an explicit `user` parameter, the SDK will automatically use the default user as a User Object.

```cpp
auto user = make_shared<ConfigCatUser>("john@example.com");
client->setDefaultUser(user);

// The default user will be used at the evaluation process.
auto value = client->getValue("keyOfMySetting", false);
```

When the `user` parameter is specified on the requesting method, it takes precedence over the default user.

```cpp
auto user = make_shared<ConfigCatUser>("john@example.com");
client->setDefaultUser(user);

auto otherUser = make_shared<ConfigCatUser>("brian@example.com");

// otherUser will be used at the evaluation process.
auto value = client->getValue("keyOfMySetting", false, otherUser.get());
```

For deleting the default user, you can do the following:

```cpp
client->clearDefaultUser();
```

## Polling Modes

The _ConfigCat SDK_ supports 3 different polling mechanisms to acquire the setting values from _ConfigCat_. After latest setting values are downloaded, they are stored in the internal cache then all `getValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.  
[More about polling modes.](/advanced/caching/)

### Auto polling (default)

The _ConfigCat SDK_ downloads the latest values and stores them automatically every 60 seconds.

Use the `autoPollIntervalInSeconds` option parameter of the `PollingMode::autoPoll()` to change the polling interval.

```cpp
auto autoPollIntervalInSeconds = 100;
ConfigCatOptions options;
options.pollingMode = PollingMode::autoPoll(autoPollIntervalInSeconds);
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", &options);
```

Available options:

| Option Parameter            | Description                                                                                         | Default |
| --------------------------- | --------------------------------------------------------------------------------------------------- | ------- |
| `autoPollIntervalInSeconds` | Polling interval.                                                                                   | 60      |
| `maxInitWaitTimeInSeconds`  | Maximum waiting time between the client initialization and the first config acquisition in seconds. | 5       |

### Lazy Loading

When calling `getValue()` the _ConfigCat SDK_ downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

Use the `cacheRefreshIntervalInSeconds` option parameter of the `PollingMode::lazyLoad()` to set cache lifetime.

```cpp
auto cacheRefreshIntervalInSeconds = 100;
ConfigCatOptions options;
options.pollingMode = PollingMode::lazyLoad(cacheRefreshIntervalInSeconds);
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", &options);
```

Available options:

| Parameter                       | Description | Default |
| ------------------------------- | ----------- | ------- |
| `cacheRefreshIntervalInSeconds` | Cache TTL.  | 60      |

### Manual Polling

Manual polling gives you full control over when the `config JSON` (with the setting values) is downloaded. ConfigCat SDK will not update them automatically. Calling `forceRefresh()` is your application's responsibility.

```cpp
ConfigCatOptions options;
options.pollingMode = PollingMode::manualPoll();
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", &options);
client->forceRefresh();
```

> `getValue()` returns `defaultValue` if the cache is empty. Call `forceRefresh()` to update the cache.

## Hooks

With the following hooks you can subscribe to particular events fired by the SDK:

- `onClientReady()`: This event is sent when the SDK reaches the ready state. If the SDK is initialized with lazy load or manual polling, it's considered ready right after instantiation.
  If it's using auto polling, the ready state is reached when the SDK has a valid config JSON loaded into memory either from cache or from HTTP. If the config couldn't be loaded neither from cache nor from HTTP the `onClientReady` event fires when the auto polling's `maxInitWaitTimeInSeconds` is reached.

- `onConfigChanged(std::shared_ptr<Settings>)`: This event is sent when the SDK loads a valid config JSON into memory from cache, and each subsequent time when the loaded config JSON changes via HTTP.

- `onFlagEvaluated(const EvaluationDetails&)`: This event is sent each time when the SDK evaluates a feature flag or setting. The event sends the same evaluation details that you would get from [`getValueDetails()`](#anatomy-of-getvaluedetails).

- `onError(const string&)`: This event is sent when an error occurs within the ConfigCat SDK.

You can subscribe to these events either on SDK initialization:

```cpp
ConfigCatOptions options;
options.pollingMode = PollingMode::manualPoll();
options.hooks = make_shared<Hooks>(
    []() { /* onClientReady callback */ },
    [](shared_ptr<Settings> config) { /* onConfigChanged callback */ },
    [](const EvaluationDetails& details) { /* onFlagEvaluated callback */ },
    [](const string& error) { /* onError callback */ }
);
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", &options);
```

or with the  `getHooks()` method of the ConfigCat client:

```cpp
client->getHooks->addOnFlagEvaluated([](const EvaluationDetails& details) { /* onFlagEvaluated callback */ });
```

## Online / Offline mode

In cases when you'd want to prevent the SDK from making HTTP calls, you can put it in offline mode:

```cpp
client->setOffline();
```

In offline mode, the SDK won't initiate HTTP requests and will work only from its cache.

To put the SDK back in online mode, you can do the following:

```cpp
client->setOnline();
```

> With `client->isOffline()` you can check whether the SDK is in offline mode.

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local only** (`OverrideBehaviour::LocalOnly`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour::LocalOverRemote`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour::RemoteOverLocal`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can set up the SDK to load your feature flag & setting overrides from a file or a map.

### JSON File

The SDK can be set up to load your feature flag & setting overrides from a file.

#### File

```cpp
ConfigCatOptions options;
options.flagOverrides = make_shared<FileFlagOverrides>("path/to/the/local_flags.json", LocalOnly);
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", &options);
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
It allows the usage of all features that are available on the ConfigCat Dashboard.

You can download your current config JSON from ConfigCat's CDN and use it as a baseline.

The URL to your current config JSON is based on your [Data Governance](/advanced/data-governance) settings:

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
        // list of Targeting Rules
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

### Map

You can set up the SDK to load your feature flag & setting overrides from a map.

```cpp
const std::unordered_map<std::string, Value>& map = {
    { "enabledFeature", true },
    { "disabledFeature", false },
    { "intSetting", 5 },
    { "doubleSetting", 3.14 },
    { "stringSetting", "test" }
};

ConfigCatOptions options;
options.flagOverrides = make_shared<MapFlagOverrides>(map, LocalOnly);
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", &options);
```

## `getAllKeys()`

You can query the keys of each feature flag and setting with the `getAllKeys()` method.

```cpp
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#");
auto keys = client->getAllKeys();
```

## `getAllValues()`

Evaluates and returns the values of all feature flags and settings. Passing a User Object is optional.

```cpp
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#");
auto settingValues = client->getAllValues();

// invoke with User Object
auto user = ConfigCatUser("#UNIQUE-USER-IDENTIFIER#");
auto settingValuesTargeting = client->getAllValues(&user);
```

## `getAllValueDetails`

Evaluates and returns the detailed values of all feature flags and settings. Passing a [User Object](#user-object) is optional.

```cpp
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#");

// invoke with User Object
auto user = ConfigCatUser("#UNIQUE-USER-IDENTIFIER#");
auto allValueDetails = client->getAllValueDetails(&user)
```

## Custom Cache

The _ConfigCat SDK_ stores the downloaded config data in a local cache to minimize network traffic and enhance client performance.
If you prefer to use your own cache solution, such as an external or distributed cache in your system,
you can implement the [`ConfigCache`](https://github.com/configcat/cpp-sdk/blob/main/include/configcat/configcache.h#L8) interface
and set the `configCache` parameter in the options passed to `ConfigCatClient::get`.
This allows you to seamlessly integrate ConfigCat with your existing caching infrastructure.

You have the option to inject your custom cache implementation into the client. All you have to do is to inherit from the `ConfigCatCache` abstract class:

```cpp
class MyCustomCache : public ConfigCatCache {
public:
    const std::string& read(const std::string& key) override {
        // here you have to return with the cached value
    }

    void write(const std::string& key, const std::string& value) override {
        // here you have to store the new value in the cache
    }
};
```

Then use your custom cache implementation:

```cpp
ConfigCatOptions options;
options.configCache = make_shared<MyCustomCache>();
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", &options);
```

:::info
The C++ SDK supports *shared caching*. You can read more about this feature and the required minimum SDK versions [here](/docs/advanced/caching/#shared-cache).
:::

## Force refresh

Call the `forceRefresh()` method on the client to download the latest config JSON and update the cache.

## Using ConfigCat behind a proxy

Provide your own network credentials (username/password), and proxy server settings (proxy server/port) in the `ConfigCatOptions`.

```cpp
ConfigCatOptions options;
options.proxies = {{"https", "proxyhost:port"}}; // Protocol, Proxy
options.proxyAuthentications = {
    {"https", ProxyAuthentication{"user", "password"}} // Protocol, ProxyAuthentication
};
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", &options);
```

## Changing the default HTTP timeout

Set the maximum wait time for a ConfigCat HTTP response by changing the _connectTimeoutMs_ or _readTimeoutMs_ in the `ConfigCatOptions`.
The default _connectTimeoutMs_ is 8 seconds. The default _readTimeoutMs_ is 5 seconds.

```cpp
ConfigCatOptions options;
options.connectTimeoutMs = 10000; // Timeout in milliseconds for establishing a HTTP connection with the server
options.readTimeoutMs = 8000; // Timeout in milliseconds for reading the server's HTTP response
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", &options);
```

## Logging

The default logger used by the ConfigCat SDK is the <a href="https://pub.dev/packages/logger" target="_blank">logger</a> package, but you can override it with your implementation via the `logger` client option. The custom implementation must satisfy the <a href="https://github.com/configcat/dart-sdk/blob/main/lib/src/log/logger.dart" target="_blank">Logger</a> abstract class.

In the ConfigCat SDK, a default `ConsoleLogger` writes logs to the standard output, but you can override it with your implementation via the `logger` client option.
The custom implementation must satisfy the `ILogger` abstract class.

```cpp
#include <configcat/configcat.h>
#include <configcat/consolelogger.h>

auto logger = make_shared<ConsoleLogger>(LOG_LEVEL_WARNING);
ConfigCatOptions options;
options.logger = logger;
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", &options);

You can change the verbosity of the logs by setting the `LogLevel`.

```cpp
logger->setLogLevel(LOG_LEVEL_INFO);
```

Available log levels:

| Level               | Description                                                                             |
| ------------------- | --------------------------------------------------------------------------------------- |
| `LOG_LEVEL_ERROR`   | Only error level events are logged.                                                     |
| `LOG_LEVEL_WARNING` | Default. Errors and Warnings are logged.                                                |
| `LOG_LEVEL_INFO`    | Errors, Warnings and feature flag evaluation is logged.                                 |
| `LOG_LEVEL_DEBUG`   | All of the above plus debug info is logged. Debug logs can be different for other SDKs. |

Info level logging helps to inspect how a feature flag was evaluated:

```bash
[Info]: Evaluating getValue(isPOCFeatureEnabled)
User object: {
    "Email": "john@example.com",
    "Identifier": "435170f4-8a8b-4b67-a723-505ac7cdea92",
}
Evaluating rule: [Email:john@example.com] [CONTAINS] [@something.com] => no match
Evaluating rule: [Email:john@example.com] [CONTAINS] [@example.com] => match, returning: true
```

## Sensitive information handling

The frontend/mobile SDKs are running in your users' browsers/devices. The SDK is downloading a [config JSON](/requests/) file from ConfigCat's CDN servers. The URL path for this config JSON file contains your SDK key, so the SDK key and the content of your config JSON file (feature flag keys, feature flag values, Targeting Rules, % rules) can be visible to your users.
This SDK key is read-only, it only allows downloading your config JSON file, but nobody can make any changes with it in your ConfigCat account.

If you do not want to expose the SDK key or the content of the config JSON file, we recommend using the SDK in your backend components only. You can always create a backend endpoint using the ConfigCat SDK that can evaluate feature flags for a specific user, and call that backend endpoint from your frontend/mobile applications.

Also, we recommend using [confidential targeting comparators](/advanced/targeting/#confidential-text-comparators) in the Targeting Rules of those feature flags that are used in the frontend/mobile SDKs.

## Sample Applications

Check out our Sample Application how they use the ConfigCat SDK

- <a href="https://github.com/configcat/cpp-sdk/tree/main/samples/" target="_blank">ConfigCat C++ Console Sample App</a>

## Guides

See <a href="https://configcat.com/blog/2022/10/21/configcat-cpp-sdk-announcement/" target="_blank">this</a> guide on how to use ConfigCat's C++ SDK.

## Look Under the Hood

- <a href="https://github.com/configcat/cpp-sdk" target="_blank">ConfigCat C++ SDK's repository on GitHub</a>
