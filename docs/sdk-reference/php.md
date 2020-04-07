---
id: php
title: PHP
---
## Getting started
### 1. Install the package with [Composer](https://getcomposer.org/)
```bash
composer require configcat/configcat-client
```

### 2. Create the *ConfigCat* client with your *SDK Key*
```php
$client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#");
```

### 3. Get your setting value:
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
| Name      | Type     | Description                                                                                                        |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `sdkKey`  | `string` | **REQUIRED.** SDK Key to access your feature flags and configurations. Get it from *ConfigCat Dashboard*. |
| `options` | `array`  | **Optional.** Additional configuration options, see below for the detailed list.                                   |

Available configuration options:
| Name                     | Type                          | Description                                                                                                                                                                                                                |
| ------------------------ | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logger`                 | `Psr\Log\LoggerInterface`     | Configures a logger for errors and warnings produced by the SDK, defaults to `Psr\Log\NullLogger`.                                                                                                                         |
| `cache`                  | `ConfigCat\Cache\ConfigCache` | Sets a `ConfigCat\Cache\ConfigCache` implementation for caching the actual configurations. You can check the currently available implementations [here](https://github.com/configcat/php-sdk/tree/master/src/Cache).       |
| `cache-refresh-interval` | `int`                         | Sets the refresh interval of the cache in seconds, after the initial cached value is set this value will be used to determine how much time must pass before initiating a new configuration fetch request. Defaults to 60. |
| `request-options`        | `array`                       | Sets the options for the request initiated by the`Guzzle` HTTP client.                                                                                                                                                          |
Example:
```php
$client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#", [
    'cache' => new \ConfigCat\Cache\LaravelCache(Cache::store()),
    'cache-refresh-interval' => 5
 ]);
```


## Anatomy of `getValue()`
| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                  |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
```php
$value = $client->getValue(
    "keyOfMySetting", # Setting Key
    false, # Default value
    new \ConfigCat\User('435170f4-8a8b-4b67-a723-505ac7cdea92') # Optional User Object
);
```

### User Object
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
You can query the keys from your configuration in the SDK with the `getAllKeys()` method.

```php
$client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#");
$keys = $client->getAllKeys();
```

## Cache
You can use the following caching options:
* Laravel:
  ```php
  $client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#", [
    'cache' => new \ConfigCat\Cache\LaravelCache(\Illuminate\Support\Facades\Cache::store()),
  ]);
  ```
* PSR-6 cache (the example uses the [redis adapter](https://github.com/php-cache/redis-adapter) for PSR-6):
  ```php
  $client = new \RedisArray(['127.0.0.1:6379', '127.0.0.2:6379']);
  $pool = new RedisCachePool($client);

  $client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#", [
    'cache' => new \ConfigCat\Cache\Psr6Cache($pool),
  ]);
  ```
* PSR-16 cache (the example uses the [redis adapter](https://github.com/php-cache/redis-adapter) for PSR-6 and the [PSR-6 to PSR-16 cache bridge](https://github.com/php-cache/simple-cache-bridge)):
  ```php
  $client = new \RedisArray(['127.0.0.1:6379', '127.0.0.2:6379']);
  $pool = new RedisCachePool($client);
  $simpleCache = new SimpleCacheBridge($pool);

  $client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#", [
    'cache' => new \ConfigCat\Cache\Psr16Cache($simpleCache),
  ]);
  ```
* Custom cache implementation
  ```php
  class CustomCache extends ConfigCache
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
    'logger' => new \Monolog\Logger("name"),
]);
```

## HTTP Client (Proxy)
The SDK uses [Guzzle](http://docs.guzzlephp.org/en/stable/index.html) for the underlying HTTP calls and its request options are available to customize through the SDK options like:
```php

$client = new \ConfigCat\ConfigCatClient("#YOUR-SDK-KEY#", [
    'request-options' => [
        'proxy' => [
            'http'  => 'tcp://localhost:8125',
            'https' => 'tcp://localhost:9124',
        ]
    ],
]);
```

## Sample Applications
- [Sample Laravel App](https://github.com/configcat/php-sdk/tree/master/samples/laravel)

## Look under the hood
- [ConfigCat PHP SDK's repository on GitHub](https://github.com/configcat/php-sdk)
- [ConfigCat PHP SDK on packagist.org](https://packagist.org/packages/configcat/configcat-client)
