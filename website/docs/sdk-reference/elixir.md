---
id: elixir
title: Elixir SDK Reference
description: ConfigCat Elixir SDK Reference
---
[![Star on GitHub](https://img.shields.io/github/stars/configcat/elixir-sdk.svg?style=social)](https://github.com/configcat/elixir-sdk/stargazers)
[![Elixir CI](https://github.com/configcat/elixir-sdk/actions/workflows/elixir-ci.yml/badge.svg?branch=main)](https://github.com/configcat/elixir-sdk/actions/workflows/elixir-ci.yml)
[![Coverage Status](https://codecov.io/github/configcat/elixir-sdk/badge.svg?branch=main)](https://codecov.io/github/configcat/elixir-sdk?branch=main)
[![Hex.pm](https://img.shields.io/hexpm/v/configcat.svg?style=circle)](https://hex.pm/packages/configcat)
[![HexDocs.pm](https://img.shields.io/badge/hex-docs-lightgreen.svg)](https://hexdocs.pm/configcat/)
[![Hex.pm](https://img.shields.io/hexpm/dt/configcat.svg?style=circle)](https://hex.pm/packages/configcat)
[![Hex.pm](https://img.shields.io/hexpm/l/configcat.svg)](https://hex.pm/packages/configcat)
[![Last Updated](https://img.shields.io/github/last-commit/configcat/elixir-sdk.svg)](https://github.com/configcat/elixir-sdk/commits/main)

<a href="https://github.com/configcat/elixir-sdk" target="_blank">ConfigCat Elixir SDK on GitHub</a>

## Getting started

### 1. Add `configcat` to your list of dependencies in `mix.exs`

```elixir
def deps do
  [
    {:configcat, "~> 1.0.0"}
  ]
end
```

### 2. Add `ConfigCat` to your application Supervisor tree

```elixir
def start(_type, _args) do
  children = [
    {ConfigCat, [sdk_key: "YOUR SDK KEY"]},
    MyApp
  ]

  opts = [strategy: :one_for_one, name: MyApp.Supervisor]
  Supervisor.start_link(children, opts)
end
```

### 3. Get your setting value

```elixir
isMyAwesomeFeatureEnabled = ConfigCat.get_value("isMyAwesomeFeatureEnabled", false)
if isMyAwesomeFeatureEnabled do
    do_the_new_thing()
else
    do_the_old_thing()
end
```

## Configuring the *ConfigCat Client*

*ConfigCat Client* is responsible for:

- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`{ConfigCat, options}` returns a client with default options.

| Properties | Description                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| `sdk_key`  | **REQUIRED.** SDK Key to access your feature flags and configurations. Get it from *ConfigCat Dashboard*. |
| `data_governance`  | Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. Defaults to `:global`. [More about Data Governance](advanced/data-governance.md). Available options: `:global`, `:eu_only`. |
| `cache_policy` | `CachePolicy.auto/1`, `CachePolicy.lazy/1` and `CachePolicy.manual/0`. Defaults to: `CachePolicy.auto/0` See [See below](#polling-modes) for details. |
| `cache` | Caching module you want `configcat` to use. Defaults to: `ConfigCat.InMemoryCache`. |
| `http_proxy` | Specify this option if you need to use a proxy server to access your ConfigCat settings. You can provide a simple URL, like `https://my_proxy.example.com` or include authentication information, like `https://user:password@my_proxy.example.com/`. |
| `name` | A unique identifier for this instance of `ConfigCat`. Defaults to `ConfigCat`.  Must be provided if you need to run more than one instance of `ConfigCat` in the same application. If you provide a `name`, you must then pass that name to all of the API functions using the `client` option. |

## Anatomy of `get_value()`

| Parameters      | Description                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`           | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                           |
| `default_value` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`          | Optional, *ConfigCat.User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
| `client`        | If you are running multiple instances of `ConfigCat`, provide the `client: :unique_name` option, specifying the name you configured for the instance you want to access. |

```elixir
value = ConfigCat.get_value(
    "keyOfMySetting", # Setting Key
    false, # Default value
    ConfigCat.User.new("435170f4-8a8b-4b67-a723-505ac7cdea92") # Optional User Object
);
```

### User Object

The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature.

```elixir
user_object = ConfigCat.User.new("435170f4-8a8b-4b67-a723-505ac7cdea92")
user_object = ConfigCat.User.new("john@example.com")
```

| Parameters   | Description                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier` | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                         |
| `email`      | Optional parameter for easier targeting rule definitions.                                                                       |
| `country`    | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom`     | Optional `Map` for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |

```elixir
user_object = ConfigCat.User.new("435170f4-8a8b-4b67-a723-505ac7cdea92", email: "john@example", country: "United Kingdom",
                custom: %{SubscriptionType: "Pro", UserRole: "Admin"})
```

## Polling Modes

The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all `get_value()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.

### Auto polling (default)

The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

Use the `poll_interval_seconds` option parameter to change the polling interval.

```elixir
{ConfigCat, [
    sdk_key: "YOUR SDK KEY",
    cache_policy: ConfigCat.CachePolicy.auto(poll_interval_seconds: 60)
]},
```

Adding a callback to `on_changed` option parameter will get you notified about changes.

```elixir
{ConfigCat, [
    sdk_key: "YOUR SDK KEY",
    cache_policy: ConfigCat.CachePolicy.auto(on_changed: callback)
]}
```

Available options:

| Option Parameter                    | Description                                                                                          | Default |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| `poll_interval_seconds`             | Polling interval.                                                                                    | 60      |
| `on_changed` | A 0-arity function to be called about configuration changes. Needs to run on a separate proccess. Any exceptions raised by `on_changed` are caught and logged. | -       |

### Lazy loading

When calling `get_value()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `get_value()` will return the setting value after the cache is updated.

Use `cache_expiry_seconds` option parameter to set cache lifetime.

```elixir
{ConfigCat, [
    sdk_key: "YOUR SDK KEY",
    cache_policy: ConfigCat.CachePolicy.lazy(cache_expiry_seconds: 300)
]}
```

Available options:

| Option Parameter             | Description                                                                                   | Default |
| ---------------------------- | --------------------------------------------------------------------------------------------- | ------- |
| `cache_expiry_seconds` | Cache TTL.                                                                                    | 60      |

### Manual polling

Manual polling gives you full control over when the `config.json` (with the setting values) is downloaded. *ConfigCat SDK* will not update them automatically. Calling `force_refresh()` is your application's responsibility.

```elixir
ConfigCat.force_refresh();
```

> `get_value()` returns `default_value` if the cache is empty. Call `force_refresh()` to update the cache.

```elixir
value = ConfigCat.get_value("key", "my default value") # Returns "my default value"
ConfigCat.force_refresh();
value = ConfigCat.get_value("key", "my default value") # Returns "value from server"
```

### Custom cache behaviour with `cache:` option parameter

To be able to customize the caching layer you need to implement the following behaviour:

```elixir
defmodule ConfigCat.ConfigCache do
  alias ConfigCat.Config

  @type key :: String.t()
  @type result :: {:ok, Config.t()} | {:error, :not_found}

  @callback get(key) :: {:ok, Config.t()} | {:error, :not_found}
  @callback set(key, Config.t()) :: :ok
end
```

- You must implement (either explicitly or implicitly) the ConfigCache behaviour
- It is the responsibility of the calling application to supervise the cache if it needs to be supervised.

### Multiple `ConfigCat` instances

If you need to run more than one instance of `ConfigCat`, you can add multiple
`ConfigCat` children. You will need to give `ConfigCat` a unique `name` option
for each, as well as using `Supervisor.child_spec/2` to provide a unique `id`
for each instance.

```elixir
# lib/my_app/application.ex
def start(_type, _args) do
  children = [
    # ... other children ...
    Supervisor.child_spec({ConfigCat, [sdk_key: "sdk_key_1", name: :first]}),
    Supervisor.child_spec({ConfigCat, [sdk_key: "sdk_key_2", name: :second]}),
  ]
  opts = [strategy: :one_for_one, name: MyApp.Supervisor]
  Supervisor.start_link(children, opts)
end
```

Then you can call `.get_value/4` like this:

```elixir
ConfigCat.get_value("setting", "default", client: :first)
ConfigCat.get_value("setting", "default", client: :second)
```

## Logging

In the *ConfigCat SDK*, we use the default Elixir's [Logger](https://hexdocs.pm/logger/Logger.html) so you can customise as you like.

```bash
[info]  Fetching configuration from ConfigCat
[info]  ConfigCat configuration json fetch response code: 200 Cached: "xxxxx-xxx"
[debug] Evaluating get_value('show_contact_phone_number').
```

## `get_all_keys()`

You can query the keys from your configuration in the SDK with the `get_all_keys()` method.

```elixir
keys = ConfigCat.get_all_keys()
```

## Using ConfigCat behind a proxy

Provide your own network credentials (username/password), and proxy server settings (proxy server/port) by passing the proxy details to the creator method.

```elixir
{ConfigCat, [
    sdk_key: "YOUR SDK KEY",
    http_proxy: "https://user@pass:yourproxy.com"
]}
```

## Sample Applications

- <a href="https://github.com/configcat/elixir-sdk/tree/main/samples" target="_blank">Sample App</a>

## Look under the hood

- <a href="https://github.com/configcat/elixir-sdk" target="_blank">ConfigCat's Elixir SDK on GitHub</a>
- <a href="https://hexdocs.pm/configcat" target="_blank">ConfigCat's HexDocs</a>
- <a href="https://hex.pm/packages/configcat" target="_blank">ConfigCat's Elixir SDK on Hex.pm</a>
