---
id: php
title: PHP
---
## Getting started
### 1. Install the package with [Composer](https://getcomposer.org/)
```bash
composer require configcat/configcat-client
```

### 2. Create the *ConfigCat* client with your *API Key*
```php
$client = new \ConfigCat\ConfigCatClient("#YOUR-API-KEY#");
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
| `apiKey`  | `string` | **REQUIRED.** API Key to access your feature flags and configurations. Get it from *ConfigCat Management Console*. |
| `options` | `array`  | **Optional.** Additional configuration options, see below for the detailed list.                                   |

Available configuration options:
| Name                     | Type                          | Description                                                                                                                                                                                                                |
| ------------------------ | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logger`                 | `Psr\Log\LoggerInterface`     | Configures a logger for errors and warnings produced by the SDK, defaults to `Psr\Log\NullLogger`.                                                                                                                         |
| `cache`                  | `ConfigCat\Cache\ConfigCache` | Sets a `ConfigCat\Cache\ConfigCache` implementation for caching the actual configurations. You can check the currently available implementations [here](https://github.com/configcat/php-sdk/tree/master/src/Cache).       |
| `cache-refresh-interval` | `int`                         | Sets the refresh interval of the cache in seconds, after the initial cached value is set this value will be used to determine how much time must pass before initiating a new configuration fetch request. Defaults to 60. |
| `timeout`                | `int`                         | Sets the default http request timeout in seconds. Defaults to 30.                                                                                                                                                          |
| `connect-timeout`        | `int`                         | Sets the http connect timeout in seconds. Defaults to 10.                                                                                                                                                                  |
Example:
```php
$client = new \ConfigCat\ConfigCatClient("#YOUR-API-KEY#", [
    'cache' => new \ConfigCat\Cache\LaravelCache(Cache::store()),
    'cache-refresh-interval' => 5
 ]);
```


## Anatomy of `getValue()`
| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set in *ConfigCat Management Console* for each setting.                  |
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
You can query the keys from your config file in the SDK with the `getAllKeys()` method.

```php
$client = new \ConfigCat\ConfigCatClient("#YOUR-API-KEY#");
$keys = $client->getAllKeys();
```

## Sample Applications
- [Sample Laravel App](https://github.com/configcat/php-sdk/tree/master/samples/laravel)

## Look under the hood
- [ConfigCat PHP SDK's repository on GitHub](https://github.com/configcat/php-sdk)
- [ConfigCat PHP SDK on packagist.org](https://packagist.org/packages/configcat/configcat-client)
