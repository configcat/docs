---
id: laravel
title: ConfigCat package for Laravel
description: ConfigCat package for Laravel. Implement feature flags within your PHP Laravel application using ConfigCat.
---

export const LaravelSchema = require('@site/src/schema-markup/sdk-reference/community/laravel.json');

<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LaravelSchema) }}></script>

[![Star on GitHub](https://img.shields.io/github/stars/pod-point/laravel-configcat.svg?style=social)](https://github.com/pod-point/laravel-configcat/stargazers)
[![Latest Version on Packagist](https://img.shields.io/packagist/v/pod-point/laravel-configcat.svg?style=flat-square)](https://packagist.org/packages/pod-point/laravel-configcat)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/pod-point/laravel-configcat/run-tests.yml?branch=main&label=tests)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](https://github.com/Pod-Point/laravel-configcat/blob/main/LICENSE)
[![Total Downloads](https://img.shields.io/packagist/dt/pod-point/laravel-configcat.svg?style=flat-square)](https://packagist.org/packages/pod-point/laravel-configcat)

:::caution
As this is a community maintained package, ConfigCat can't guarantee it's stability, safety and can't provide official customer support.
:::

<a href="https://github.com/Pod-Point/laravel-configcat" target="_blank">ConfigCat package for Laravel on GitHub</a>

## Installation

You can install the package via composer:

```bash
composer require pod-point/laravel-configcat
```

### Publishing the config file

Next, you should publish the Laravel package configuration file using the `vendor:publish` Artisan command. It will be placed in your application's config directory:

```bash
php artisan vendor:publish --provider="PodPoint\ConfigCat\ConfigCatServiceProvider"
```

Don't forget to specify your [ConfigCat SDK `key`](https://app.configcat.com/sdkkey) within the freshly published Laravel configuration file under `config/configcat.php`.

The Laravel configuration for this package comes with sensible defaults. See [`config/configcat.php`](https://github.com/Pod-Point/laravel-configcat/blob/main/config/configcat.php) for more details.

## Usage

### Facade & global helper

The `ConfigCat` facade as well as the global helper can be used to retrieve the actual value of the feature flag, text or number setting:

```php
use PodPoint\ConfigCat\Facades\ConfigCat;

$flag = ConfigCat::get('new_registration_flow');

$flag = configcat('new_registration_flow');
```

> **Note:** You can define the actual value of a feature flag to be `bool(true)` or `bool(false)` on ConfigCat but not only, it can also be [a number or a text setting](/main-concepts/#about-setting-types).

If the feature flag is undefined or something went wrong, `bool(false)` will be returned by default, however you can change this by specifying a default value **only when using the Facade or the global helper** to retrieve the feature flag value using:

```php
use PodPoint\ConfigCat\Facades\ConfigCat;

$flag = ConfigCat::get('new_registration_flow', true);

$flag = configcat('new_registration_flow', true);
```

You can also globally sepcify a default value from the [`config/configcat.php`](https://github.com/Pod-Point/laravel-configcat/blob/main/config/configcat.php) file.

:warning: **Only** `boolean`, `string`, `integer` or `float` default value types are supported as these are the only [setting types](/main-concepts/#about-setting-types) available from ConfigCat.

### Validation rule

Given the following validation rules:

```php
Validator::make([
    'email' => 'taylor@laravel.com',
    'username' => 'taylor',
], [
    'email' => 'required_if_configcat:new_registration_flow,true',
    'username' => 'required_if_configcat:new_registration_flow,false',
]);
```

- When the feature flag is **on**
  - The `email` will be a required field
  - The `username` will be an optional field
- When the feature flag is **off**, undefined, a text or number setting
  - The `email` will be an optional field
  - The `username` will be a required field

### HTTP middleware

The following route will only be accessible if the [feature flag](/main-concepts/#about-setting-types) is truthy, otherwise a `404` will be thrown.

```php
Router::get('/registration')->middleware('configcat.on:new_registration_flow');
```

The opposite is possible, also throwing a `404` if the feature flag is falsy:

```php
Router::get('/sign-up')->middleware('configcat.off:new_registration_flow');
```

**Note:** undefined, text or number settings will be considered as feature flags turned `off`.

### Blade directive

The following view content will only be rendered if the feature flag is truthy:

```blade
@configcat('new_registration_flow')
    New registration form
@endconfigcat
```

```blade
@unlessconfigcat('new_registration_flow')
    Old registration form
@endconfigcat
```

```blade
@configcat('new_registration_flow_1')
    Sign up
@elseconfigcat('new_registration_flow_2')
    Get started
@else
    Register
@endconfigcat
```

**Note:** undefined, text or number settings will be considered as feature flags turned `off`.

## Advanced usage

### User targeting

The [User Object](/sdk-reference/php/#user-object) is essential if you'd like to use ConfigCat's [Targeting](/advanced/targeting) feature.

ConfigCat needs to understand the representation of your users from your application. To do so, you will need to transform your user into a `ConfigCat\User` object. This can be done directly from the [`config/configcat.php`](https://github.com/Pod-Point/laravel-configcat/blob/main/config/configcat.php) file. Here is an example:

```php
'user' => \PodPoint\ConfigCat\Support\DefaultUserTransformer::class,
```

Which will be using a sensible default transformer:

```php
class DefaultUserTransformer
{
    public function __invoke(\Illuminate\Foundation\Auth\User $user)
    {
        return new \ConfigCat\User($user->getKey(), $user->email);
    }
}
```

Feel free to create your own transformer class and use it instead, just **remember** that it needs to be **callable** with the `__invoke()` function.

> **Note:** for security reasons, all of the logic computation for the user targeting is executed on your application side of things using ConfigCat's SDK. No user details will be leaving your application in order find out wether or not a user should have a feature flag enabled or not.

Once you have defined your mapping, you will be able to explicitly use the representation of your user when checking a feature flag:

```php
use App\Models\User;
use PodPoint\ConfigCat\Facades\ConfigCat;

$user = User::where('email', 'taylor@laravel.com')->firstOrFail();
ConfigCat::get('new_registration_flow', $default, $user);
```

This is also applicable for the global helper and the Blade directive:

```php
configcat('new_registration_flow', $default, $user);
```

```blade
@configcat('new_registration_flow', $user)
    New registration form
@endconfigcat
```

> **Note:** if you have defined your user mapping but are not explicitly using a specific user when checking for a flag, we will automatically try to use the logged in user, if any, for convenience.

### Caching & logging

This package supports native Laravel caching and logging capabilities in order to cache the feature flag values from ConfigCat's CDN as well as log any information when resolving feature flags. We've setup some sensible defaults but various levels of caching and logging can be configured.

See [`config/configcat.php`](https://github.com/Pod-Point/laravel-configcat/blob/main/config/configcat.php) for more info.

### Test support: mock, fake & overrides

#### In-memory testing

When writing unit or functional tests, you may need to be able to mock or fake this package completely so you can test various behaviors within your application. This is all possible through the powerful Facade.

**Mocking:**

```php
use PodPoint\ConfigCat\Facades\ConfigCat;

ConfigCat::shouldReceive('get')
    ->once()
    ->with('new_registration_flow')
    ->andReturn(true);
```

See [https://laravel.com/docs/mocking#mocking-facades](https://laravel.com/docs/mocking#mocking-facades) for more info.

**Fake:**

Faking it will prevent the package to genuinely try to hit ConfigCat's CDN:

```php
use PodPoint\ConfigCat\Facades\ConfigCat;

// you can fake it
ConfigCat::fake();
// optionally setup some predefined feature flags for your test
ConfigCat::fake(['new_registration_flow' => true]);
```

#### End-to-end testing

When running tests within a browser which doesn't share the same instance of the application, using mocks or fakes is not applicable. This is why we provide some overrides through ConfigCat SDK which will make the client under the hood localhost only and will use a locally generated `json` file in order to read the feature flags for the system under test.

First of all, you will need to make sure to enable `overrides` from [`config/configcat.php`](https://github.com/Pod-Point/laravel-configcat/blob/main/config/configcat.php). You could also optionally tweak the file path for the `json` file if you wish to. The file will be automatically created for you when using overrides.

Similarly to `ConfigCat::fake()` you can come up with some predefined feature flags which will be saved into a `json` file:

```php
use PodPoint\ConfigCat\Facades\ConfigCat;

ConfigCat::override(['new_registration_flow' => true]);
```

## Testing

Run the tests with:

```bash
composer test
```

## Changelog

Please see our [Releases](https://github.com/pod-point/laravel-configcat/releases) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](https://github.com/Pod-Point/laravel-configcat/blob/main/CONTRIBUTING) for details.

## Credits

- [configcat/php-sdk](https://github.com/configcat/php-sdk)
- [ylsideas/feature-flags](https://github.com/ylsideas/feature-flags) for inspiration
- [Pod Point](https://github.com/pod-point)
- [All Contributors](https://github.com/pod-point/laravel-configcat/graphs/contributors)

## License

The MIT License (MIT). Please see [License File](https://github.com/Pod-Point/laravel-configcat/blob/main/LICENSE) for more information.
