---
id: php
title: PHP SDK Reference
description: ConfigCat PHP SDK Reference. This is a step-by-step guide on how to use feature flags in your PHP application.
---
[![Star on GitHub](https://img.shields.io/github/stars/configcat/php-sdk.svg?style=social)](https://github.com/configcat/php-sdk/stargazers)
[![Build Status](https://github.com/configcat/php-sdk/actions/workflows/php-ci.yml/badge.svg?branch=master)](https://github.com/configcat/php-sdk/actions/workflows/php-ci.yml)
[![Coverage Status](https://img.shields.io/codecov/c/github/ConfigCat/php-sdk.svg)](https://codecov.io/gh/ConfigCat/php-sdk)
[![Latest Stable Version](https://poser.pugx.org/configcat/configcat-client/version)](https://packagist.org/packages/configcat/configcat-client)
[![Total Downloads](https://poser.pugx.org/configcat/configcat-client/downloads)](https://packagist.org/packages/configcat/configcat-client)
[![Latest Unstable Version](https://poser.pugx.org/configcat/configcat-client/v/unstable)](https://packagist.org/packages/configcat/configcat-client)

<a href="https://github.com/configcat/php-sdk" target="_blank">ConfigCat PHP SDK on GitHub</a>

## Getting started
### 1. Install the package with [Composer](https://getcomposer.org/)
```bash
composer require configcat/configcat-client
```

### 2. Create the *ConfigCat* client with your *SDK Key*
```php
$client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#");
```

### 3. Get your setting value
```php
$isMyAwesomeFeatureEnabled = $client->getValue("isMyAwesomeFeatureEnabled", false);
if(is_bool($isMyAwesomeFeatureEnabled) && $isMyAwesomeFeatureEnabled) {
    doTheNewThing();
} else {
    doTheOldThing();
}
```

## Creating the *ConfigCat Client*
*ConfigCat Client* is responsible for:
- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

Constructor parameters:

| Name      | Type     | Description                                                                                               |
| --------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `sdkKey`  | `string` | **REQUIRED.** SDK Key to access your feature flag and setting. Get it from *ConfigCat Dashboard*. |
| `options` | `array`  | **Optional.** Additional SDK options, see below for the detailed list.                          |

Available options:

| Name                     | Type                           | Description                         |
| ------------------------ | ------------------------------ | ----------------------------------- |
| `data-governance`        | `int`                          | Optional, defaults to `DataGovernance::GLOBAL_`. Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `GLOBAL_`, `EU_ONLY`. |
| `logger`                 | [\Psr\Log\LoggerInterface](https://github.com/php-fig/log/blob/master/src/LoggerInterface.php)     | Optional, configures a logger for errors and warnings produced by the SDK, defaults to [Monolog](https://github.com/Seldaek/monolog). [More about logging](#logging). |
| `log-level`              | `int`                          | Optional, defaults to `LogLevel::WARNING`. Sets the internal log level. [More about log levels](#logging). |
| `cache`                  | [\ConfigCat\Cache\ConfigCache](https://github.com/configcat/php-sdk/blob/master/src/Cache/ConfigCache.php) | Optional, sets a `\ConfigCat\Cache\ConfigCache` implementation for caching the latest feature flag and setting values. [More about cache](#cache). You can check the currently available implementations [here](https://github.com/configcat/php-sdk/tree/master/src/Cache). |
| `cache-refresh-interval` | `int`                          | Optional, sets the refresh interval of the cache in seconds, after the initial cached value is set this value will be used to determine how much time must pass before initiating a [config.json download](/requests). Defaults to 60. |
| `request-options`        | `array`                        | Optional, sets the request options (e.g. [HTTP Timeout](#http-timeout), [HTTP Proxy](#http-proxy)) for the underlying `Guzzle` HTTP client used for [downloading the config.json](/requests) files. See Guzzle's [official documentation](https://docs.guzzlephp.org/en/stable/request-options.html) for the available request options. |
| `flag-overrides`         | [\ConfigCat\Override\FlagOverrides](https://github.com/configcat/php-sdk/blob/master/src/Override/FlagOverrides.php) | Optional, configures local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides). |
| `exceptions-to-ignore`   | `array`                        | Optional, sets an array of exception classes that should be ignored from logs. |
| `base-url`               | `string`                       | Optional, sets the CDN base url (forward proxy, dedicated subscription) from where the SDK will download the feature flags and settings. |

:::info
Each option name is available through constants of the [\ConfigCat\ClientOptions](https://github.com/configcat/php-sdk/blob/master/src/ClientOptions.php) class.
:::

Example:
```php
$client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#", [
    \ConfigCat\ClientOptions::CACHE => new \ConfigCat\Cache\LaravelCache(Cache::store()),
    \ConfigCat\ClientOptions::CACHE_REFRESH_INTERVAL => 5
 ]);
```


## Anatomy of `getValue()`

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
```php
$value = $client->getValue(
    "keyOfMySetting", # Setting Key
    false, # Default value
    new \ConfigCat\User('435170f4-8a8b-4b67-a723-505ac7cdea92') # Optional User Object
);
```

## User Object
The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature. 
```php
$user = new \ConfigCat\User("435170f4-8a8b-4b67-a723-505ac7cdea92");
```
```php
$user = new \ConfigCat\User("john@example.com");
```

| Parameters   | Description                                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `identifier` | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                    |
| `email`      | Optional parameter for easier targeting rule definitions.                                                                  |
| `country`    | Optional parameter for easier targeting rule definitions.                                                                  |
| `custom`     | Optional array for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |
```php
$user = new \ConfigCat\User(
    '435170f4-8a8b-4b67-a723-505ac7cdea92', 
    'john@example', 
    'United Kingdom', 
    [
        'SubscriptionType' => 'Pro', 
        'UserRole' => 'Admin'
    ]);
```

## `getAllKeys()`
You can query the keys of each feature flag and setting with the `getAllKeys()` method.

```php
$client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#");
$keys = $client->getAllKeys();
```

## `getAllValues()`
Evaluates and returns the values of all feature flags and settings. Passing a User Object is optional.

```php
$client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#");
$settingValues = $client->getAllValues();

// invoke with user object
$user = new \ConfigCat\User("john@example.com");
$settingValuesTargeting = $client->getAllValues($user);
```

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local/Offline mode** (`OverrideBehaviour::LOCAL_ONLY`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour::LOCAL_OVER_REMOTE`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour::REMOTE_OVER_LOCAL`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can load your feature flag & setting overrides from a file or from a simple associative array.

### JSON File

The SDK can be set up to load your feature flag & setting overrides from a file. 
You can also specify whether the file should be reloaded when it gets modified.
```php
$client = new \ConfigCat\ConfigCatClient("localhost", [
  \ConfigCat\ClientOptions::FLAG_OVERRIDES => \ConfigCat\Override\FlagOverrides(
    \ConfigCat\Override\OverrideDataSource::localFile("path/to/the/local_flags.json"), // path to the file
    \ConfigCat\Override\OverrideBehaviour::LOCAL_ONLY // local/offline mode
  ),
]);
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

### Associative Array
You can set up the SDK to load your feature flag & setting overrides from an associative array.
```php
$client = new \ConfigCat\ConfigCatClient("localhost", [
  \ConfigCat\ClientOptions::FLAG_OVERRIDES => \ConfigCat\Override\FlagOverrides(
    \ConfigCat\Override\OverrideDataSource::localArray([
      'enabledFeature' => true,
      'disabledFeature' => false,
      'intSetting' => 5,
      'doubleSetting' => 3.14,
      'stringSetting' => "test",
    ]), \ConfigCat\Override\OverrideBehaviour::LOCAL_ONLY),
]);
```

## Cache
You can use the following caching options:
* Laravel:
  ```php
  $client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#", [
    \ConfigCat\ClientOptions::CACHE => new \ConfigCat\Cache\LaravelCache(\Illuminate\Support\Facades\Cache::store()),
  ]);
  ```
* PSR-6 cache (e.g. the [redis adapter](https://github.com/php-cache/redis-adapter) for PSR-6):
  ```php
  $client = new \RedisArray(['127.0.0.1:6379', '127.0.0.2:6379']);
  $pool = new RedisCachePool($client);

  $client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#", [
    \ConfigCat\ClientOptions::CACHE => new \ConfigCat\Cache\Psr6Cache($pool),
  ]);
  ```
  or with the [file system adapter](https://github.com/php-cache/filesystem-adapter):
  ```php
  $filesystemAdapter = new \League\Flysystem\Adapter\Local(__DIR__.'/');
  $filesystem = new \League\Flysystem\Filesystem($filesystemAdapter);
  $pool = new \Cache\Adapter\Filesystem\FilesystemCachePool($filesystem);

  $client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#", [
    \ConfigCat\ClientOptions::CACHE => new \ConfigCat\Cache\Psr6Cache($pool),
  ]);
  ```
* PSR-16 cache (e.g. the [redis adapter](https://github.com/php-cache/redis-adapter) for PSR-6 and the [PSR-6 to PSR-16 cache bridge](https://github.com/php-cache/simple-cache-bridge)):
  ```php
  $client = new \RedisArray(['127.0.0.1:6379', '127.0.0.2:6379']);
  $pool = new RedisCachePool($client);
  $simpleCache = new SimpleCacheBridge($pool);

  $client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#", [
    \ConfigCat\ClientOptions::CACHE => new \ConfigCat\Cache\Psr16Cache($simpleCache),
  ]);
  ```
  or with the [file system adapter](https://github.com/php-cache/filesystem-adapter):
  ```php
  $filesystemAdapter = new \League\Flysystem\Adapter\Local(__DIR__.'/');
  $filesystem = new \League\Flysystem\Filesystem($filesystemAdapter);
  $pool = new \Cache\Adapter\Filesystem\FilesystemCachePool($filesystem);
  $simpleCache = new SimpleCacheBridge($pool);

  $client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#", [
    \ConfigCat\ClientOptions::CACHE => new \ConfigCat\Cache\Psr16Cache($simpleCache),
  ]);
  ```
* Custom cache implementation
  ```php
  class CustomCache extends \ConfigCat\Cache\ConfigCache
  { 
      protected function get($key)
      {
          // load from cache
      } 
    
      protected function set($key, $value)
      {
          // save into cache
      }
  }
  ```

## Logging
The SDK uses the PSR-3 `LoggerInterface` for logging, so you can use any implementor package like [Monolog](https://github.com/Seldaek/monolog).
```php
$client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#", [
    \ConfigCat\ClientOptions::LOGGER => new \Monolog\Logger("name"),
]);
```
You can change the verbosity of the logs by setting the `log-level` option.
```php
$client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#", [
    \ConfigCat\ClientOptions::LOG_LEVEL => \ConfigCat\Log\LogLevel::INFO
]);
```

The following levels are used by the ConfigCat SDK:

| Level      | Description                                                                             |
| ---------- | --------------------------------------------------------------------------------------- |
| `NO_LOG`   | Turn the logging off.                                                                   |
| `ERROR`    | Only error level events are logged.                                                     |
| `WARNING`  | Default. Errors and Warnings are logged.                                                |
| `INFO`     | Errors, Warnings and feature flag evaluation is logged.                                 |
| `DEBUG`    | All of the above plus debug info is logged. Debug logs can be different for other SDKs. |

Info level logging helps to inspect how a feature flag was evaluated:
```bash
[2022-01-06T18:34:16.846039+00:00] ConfigCat.INFO: Evaluating getValue(isPOCFeatureEnabled).
User object: {"Identifier":"435170f4-8a8b-4b67-a723-505ac7cdea92","Email":"john@example.com"}
Evaluating rule: [Email:john@example.com] [CONTAINS] [@something.com] => no match.
Evaluating rule: [Email:john@example.com] [CONTAINS] [@example.com] => match, returning: true.
```

## HTTP Client
The SDK uses [Guzzle](https://docs.guzzlephp.org/en/stable/index.html) for the underlying HTTP calls and its request options are available to customize through SDK options.
### HTTP Proxy
If your application runs behind a proxy you can do the following:
```php
$client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#", [
    \ConfigCat\ClientOptions::REQUEST_OPTIONS => [
        \GuzzleHttp\RequestOptions::PROXY => [
            'http'  => 'tcp://localhost:8125',
            'https' => 'tcp://localhost:9124',
        ]
    ],
]);
```
### HTTP Timeout
You can set the maximum wait time for a ConfigCat HTTP response by using Guzzle's timeouts.
```php
$client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#", [
    \ConfigCat\ClientOptions::REQUEST_OPTIONS => [
        \GuzzleHttp\RequestOptions::CONNECT_TIMEOUT => 5,
        \GuzzleHttp\RequestOptions::TIMEOUT => 10
    ],
]);
```

## Sample Applications
- [Sample Laravel App](https://github.com/configcat/php-sdk/tree/master/samples/laravel)

## Look under the hood
- [ConfigCat PHP SDK's repository on GitHub](https://github.com/configcat/php-sdk)
- [ConfigCat PHP SDK on packagist.org](https://packagist.org/packages/configcat/configcat-client)
