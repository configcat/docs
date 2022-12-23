---
id: cpp
title: C++ SDK Reference
description: ConfigCat C++ SDK Reference. This is a step-by-step guide on how to use feature flags in your C++ application.
---

[![Star on GitHub](https://img.shields.io/github/stars/configcat/cpp-sdk.svg?style=social)](https://github.com/configcat/cpp-sdk/stargazers)
[![Build Status](https://img.shields.io/github/actions/workflow/status/configcat/cpp-sdk/cpp-ci.yml?logo=GitHub&label=windows%20%2F%20macos%20%2F%20linux&branch=main)](https://github.com/configcat/cpp-sdk/actions/workflows/cpp-ci.yml)
[![Coverage Status](https://codecov.io/gh/configcat/cpp-sdk/branch/main/graph/badge.svg?token=cvUgfof8k7)](https://codecov.io/gh/configcat/cpp-sdk)

<a href="https://github.com/ConfigCat/cpp-sdk" target="_blank">ConfigCat C++ SDK on GitHub</a>

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

`ConfigCatClient::get(<sdkKey>)` returns a client with default options.

| Properties         | Description                                                                                                                                                                                                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `baseUrl`          | Optional, sets the CDN base url (forward proxy, dedicated subscription) from where the sdk will download the configurations.                                                                                                                                                                       |
| `dataGovernance`   | Optional, defaults to `Global`. Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `Global`, `EuOnly`. |
| `connectTimeoutMs` | Optional, defaults to `8000ms`. Sets the amount of milliseconds to wait for the server to make the initial connection (i.e. completing the TCP connection handshake). `0` means it never times out during transfer                                                                                 |
| `readTimeoutMs`    | Optional, defaults to `5000ms`. Sets the amount of milliseconds to wait for the server to respond before giving up. `0` means it never times out during transfer.                                                                                                                                  |
| `mode`             | Optional, sets the polling mode for the client. [More about polling modes](#polling-modes).                                                                                                                                                                                                        |
| `cache`            | Optional, sets a custom cache implementation for the client. [More about cache](#custom-cache).                                                                                                                                                                                                    |
| `override`         | Optional, sets the local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides).                                                                                                                                                                                   |

```cpp
ConfigCatOptions options;
options.mode = PollingMode::manualPoll();
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", options);
```

:::caution
We strongly recommend you to use the `ConfigCatClient` as a Singleton object in your application.
The `ConfigCatClient` constructs singleton client instances for your SDK keys with its `ConfigCatClient::get(<sdkKey>)` static factory method.
These clients can be closed all at once with `ConfigCatClient::closeAll()` method or individually with the `ConfigCatClient::close(client)`.
:::

## Anatomy of `getValue()`

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on _ConfigCat Dashboard_ for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```cpp
auto user = ConfigCatUser("#USER-IDENTIFIER#");
auto value = client->getValue(
    "keyOfMySetting", // key
    false, // defaultValue
    &user, // Optional User Object
);
```

## User Object

The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature.

```cpp
auto user = ConfigCatUser("#UNIQUE-USER-IDENTIFIER#");
```

```cpp
auto user = ConfigCatUser("john@example.com");
```

### Customized user object creation

| Argument  | Description                                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `id`      | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                         |
| `email`   | Optional parameter for easier targeting rule definitions.                                                                       |
| `country` | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom`  | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |

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

## Polling Modes

The _ConfigCat SDK_ supports 3 different polling mechanisms to acquire the setting values from _ConfigCat_. After latest setting values are downloaded, they are stored in the internal cache then all `getValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.  
[More about polling modes.](/advanced/caching/)

### Auto polling (default)

The _ConfigCat SDK_ downloads the latest values and stores them automatically every 60 seconds.

Use the `autoPollIntervalInSeconds` option parameter of the `PollingMode::autoPoll()` to change the polling interval.

```cpp
auto autoPollIntervalInSeconds = 100;
ConfigCatOptions options;
options.mode = PollingMode::autoPoll(autoPollIntervalInSeconds);
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", options);
```

Adding a callback to `onConfigChanged` option parameter will get you notified about changes.

```cpp
auto autoPollIntervalInSeconds = 100;
auto maxInitWaitTimeInSeconds = 5;
auto onConfigChanged = [] {
    // here you can subscribe to configuration changes
};
ConfigCatOptions options;
options.mode = PollingMode::autoPoll(autoPollIntervalInSeconds, maxInitWaitTimeInSeconds, onConfigChanged);
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", options);
```

Available options:

| Option Parameter            | Description                                                                                         | Default |
| --------------------------- | --------------------------------------------------------------------------------------------------- | ------- |
| `autoPollIntervalInSeconds` | Polling interval.                                                                                   | 60      |
| `maxInitWaitTimeInSeconds`  | Maximum waiting time between the client initialization and the first config acquisition in seconds. | 5       |
| `onConfigChanged`           | Callback to get notified about changes.                                                             | -       |

### Lazy Loading

When calling `getValue()` the _ConfigCat SDK_ downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

Use the `cacheRefreshIntervalInSeconds` option parameter of the `PollingMode::lazyLoad()` to set cache lifetime.

```cpp
auto cacheRefreshIntervalInSeconds = 100;
ConfigCatOptions options;
options.mode = PollingMode::lazyLoad(cacheRefreshIntervalInSeconds);
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", options);
```

Available options:

| Parameter                       | Description | Default |
| ------------------------------- | ----------- | ------- |
| `cacheRefreshIntervalInSeconds` | Cache TTL.  | 60      |

### Manual Polling

Manual polling gives you full control over when the `config.json` (with the setting values) is downloaded. ConfigCat SDK will not update them automatically. Calling `forceRefresh()` is your application's responsibility.

```cpp
ConfigCatOptions options;
options.mode = PollingMode::manualPoll();
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", options);
client->forceRefresh();
```

> `getValue()` returns `defaultValue` if the cache is empty. Call `forceRefresh()` to update the cache.

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local/Offline mode** (`OverrideBehaviour::LocalOnly`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour::LocalOverRemote`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour::RemoteOverLocal`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can set up the SDK to load your feature flag & setting overrides from a file or a map.

### JSON File

The SDK can be set up to load your feature flag & setting overrides from a file.

#### File

```cpp
ConfigCatOptions options;
options.override = make_shared<FlagOverrides>(make_shared<FileOverrideDataSource>("path/to/the/local_flags.json"), LocalOnly);
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", options);
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
options.override = make_shared<FlagOverrides>(make_shared<MapOverrideDataSource>(map), LocalOnly);
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", options);
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

// invoke with user object
auto user = ConfigCatUser("#UNIQUE-USER-IDENTIFIER#");
auto settingValuesTargeting = client->getAllValues(&user);
```

## Custom Cache

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
options.cache = make_shared<MyCustomCache>();
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", options);
```

## Force refresh

Any time you want to refresh the cached configuration with the latest one, you can call the `forceRefresh()` method of the library, which initiates a new download and updates the local cache.

## Using ConfigCat behind a proxy

Provide your own network credentials (username/password), and proxy server settings (proxy server/port) in the `ConfigCatOptions`.

```cpp
ConfigCatOptions options;
options.proxies = {{"http", "http://www.fake_auth_proxy.com"}}; // Protocol, Proxy url
options.proxyAuthentications = {
    {"http", ProxyAuthentication{"user", "password"}} // Protocol, ProxyAuthentication
};
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", options);
```

## Changing the default HTTP timeout

Set the maximum wait time for a ConfigCat HTTP response by changing the _connectTimeoutMs_ or _readTimeoutMs_ in the `ConfigCatOptions`.
The default _connectTimeoutMs_ is 8 seconds. The default _readTimeoutMs_ is 5 seconds.

```cpp
ConfigCatOptions options;
options.connectTimeoutMs = 10000; // Timeout in milliseconds for establishing a HTTP connection with the server
options.readTimeoutMs = 8000; // Timeout in milliseconds for reading the server's HTTP response
auto client = ConfigCatClient::get("#YOUR-SDK-KEY#", options);
```

---

## Logging

In the ConfigCat SDK there is a `ConsoleLogger` writes logs to the standard output.
You can define a logger with the `setLogger` function.
You can override it with your implementation. The custom implementation must satisfy the `ILogger` abstract class.

```cpp
#include <configcat/configcat.h>
#include <configcat/consolelogger.h>

configcat::ConsoleLogger logger;
configcat::setLogger(&logger);
```

You can change the verbosity of the logs by setting the `LogLevel`.

```cpp
configcat::setLogLevel(LOG_LEVEL_INFO);
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

The frontend/mobile SDKs are running in your users' browsers/devices. The SDK is downloading a [config.json](/requests/) file from ConfigCat's CDN servers. The URL path for this config.json file contains your SDK key, so the SDK key and the content of your config.json file (feature flag keys, feature flag values, targeting rules, % rules) can be visible to your users.
This SDK key is read-only, it only allows downloading your config.json file, but nobody can make any changes with it in your ConfigCat account.

If you do not want to expose the SDK key or the content of the config.json file, we recommend using the SDK in your backend components only. You can always create a backend endpoint using the ConfigCat SDK that can evaluate feature flags for a specific user, and call that backend endpoint from your frontend/mobile applications.

Also, we recommend using [confidential targeting comparators](/advanced/targeting/#confidential-text-comparators) in the targeting rules of those feature flags that are used in the frontend/mobile SDKs.

## Sample Applications

Check out our Sample Application how they use the ConfigCat SDK

- <a href="https://github.com/configcat/cpp-sdk/tree/main/samples/" target="_blank">ConfigCat C++ Console Sample App</a>

## Guides

See <a href="https://configcat.com/blog/2022/10/21/configcat-cpp-sdk-announcement/" target="_blank">this</a> guide on how to use ConfigCat's C++ SDK.

## Look Under the Hood

- <a href="https://github.com/ConfigCat/cpp-sdk" target="_blank">ConfigCat C++ SDK's repository on GitHub</a>
