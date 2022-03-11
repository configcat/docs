---
id: python
title: Python SDK Reference
description: ConfigCat Python SDK Reference
---
[![Star on GitHub](https://img.shields.io/github/stars/configcat/python-sdk.svg?style=social)](https://github.com/configcat/python-sdk/stargazers)
[![Python CI](https://github.com/configcat/python-sdk/actions/workflows/python-ci.yml/badge.svg?branch=master)](https://github.com/configcat/python-sdk/actions/workflows/python-ci.yml) 
[![codecov](https://codecov.io/gh/ConfigCat/python-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/ConfigCat/python-sdk)
[![PyPI](https://img.shields.io/pypi/v/configcat-client.svg)](https://pypi.python.org/pypi/configcat-client)
[![PyPI](https://img.shields.io/pypi/pyversions/configcat-client.svg)](https://pypi.python.org/pypi/configcat-client)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=configcat_python-sdk&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=configcat_python-sdk)

<a href="https://github.com/configcat/python-sdk" target="_blank">ConfigCat Python SDK on GitHub</a>

## Getting started
### 1. Install *ConfigCat SDK*
```
pip install configcat-client
```

### 2. Import the package
```python
import configcatclient
```

### 3. Create the *ConfigCat* client with your *SDK Key*
```python
configcat_client = configcatclient.create_client('#YOUR-SDK-KEY#')
```

### 4. Get your setting value
```python
isMyAwesomeFeatureEnabled = configcat_client.get_value('isMyAwesomeFeatureEnabled', False)
if isMyAwesomeFeatureEnabled:
    do_the_new_thing()
else:
    do_the_old_thing()
```

### 5. Stop *ConfigCat* client
You can safely shut down the client instance and release all associated resources on application exit.
```python
configcat_client.stop()
```

## Creating the *ConfigCat Client*
*ConfigCat Client* is responsible for:
- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`create_client()` returns a client with default options.

| Properties | Description                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `sdk-key`  | **REQUIRED.** SDK Key to access your feature flags and configurations. Get it from *ConfigCat Dashboard*. |
| `data_governance`  | Optional, defaults to `DataGovernance.Global`. Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `Global`, `EuOnly`. |

`create_client_with_auto_poll()`, `create_client_with_lazy_load()`, `create_client_with_manual_poll()`  
Creating the client is different for each polling mode.
[See below](#polling-modes) for details.

:::caution
We strongly recommend you to use the *ConfigCat Client* as a Singleton object in your application.
If you want to use multiple SDK Keys in the same application, create only one *ConfigCat Client* per SDK Key.
:::

## Anatomy of `get_value()`

| Parameters      | Description                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| `key`           | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                     |
| `default_value` | **REQUIRED.** This value will be returned in case of an error.                                                  |
| `user`          | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
```python
value = configcat_client.get_value(
    'keyOfMySetting', # Setting Key
    False, # Default value
    User('435170f4-8a8b-4b67-a723-505ac7cdea92') # Optional User Object
)
```

### User Object
The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature. 
``` python
user_object = User('435170f4-8a8b-4b67-a723-505ac7cdea92')
```
``` python
user_object = User('john@example.com')   
```
| Parameters   | Description                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier` | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                         |
| `email`      | Optional parameter for easier targeting rule definitions.                                                                       |
| `country`    | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom`     | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |
``` javascript
user_object = User('435170f4-8a8b-4b67-a723-505ac7cdea92', 'john@example', 'United Kingdom',
                {'SubscriptionType': 'Pro', 'UserRole': 'Admin'})
```

## Polling Modes
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all `get_value()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.

### Auto polling (default)
The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

Use the `poll_interval_seconds` option parameter to change the polling interval.
```python
configcatclient.create_client_with_auto_poll(
    '#YOUR-SDK-KEY#', poll_interval_seconds=95)
```
Adding a callback to `on_configuration_changed_callback` option parameter will get you notified about changes.
```python
def configuration_changed_callback(self):
# Configuration changed.
    pass

configcatclient.create_client_with_auto_poll('#YOUR-SDK-KEY#', on_configuration_changed_callback=configuration_changed_callback)
```
Available options:

| Option Parameter                    | Description                                                                                          | Default |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| `poll_interval_seconds`             | Polling interval.                                                                                    | 60      |
| `max_init_wait_time_seconds`        | Maximum waiting time between the client initialization and the first config acquisition in secconds. | 5       |
| `on_configuration_changed_callback` | Callback to get notified about changes.                                                              | -       |
| `config_cache_class`                | Custom cache implementation.                                                                         | None    |
| `connect_timeout`                   | The number of seconds to wait for the server to make the initial connection (i.e. completing the TCP connection handshake). | 10 |
| `read_timeout`                      | The number of seconds to wait for the server to respond before giving up.                            | 30      |
| `flagOverrides`                     | Local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides)         | None |

:::caution
Auto polling mode utilizes its polling job in a `threading.Thread` object. If you are running your application behind an uWSGI web server, the auto polling mode may not work as expected, because the uWSGI web server disables Python's threading by default. Please [enable threading](https://uwsgi-docs.readthedocs.io/en/latest/Options.html#enable-threads) or switch to another polling mode in this case.
:::

### Lazy loading
When calling `get_value()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `get_value()` will return the setting value after the cache is updated.

Use `cache_time_to_live_seconds` option parameter to set cache lifetime.
```python
configcatclient.create_client_with_lazy_load(
    '#YOUR-SDK-KEY#', cache_time_to_live_seconds=600)
```

Use a custom `config_cache_class` option parameter.
```python
from configcatclient.interfaces import ConfigCache
class InMemoryConfigCache(ConfigCache):
    def __init__(self):
        self._value = {}

    def get(self, key):
        return self._value.get(key)

    def set(self, key, value):
        self._value[key] = value

configcatclient.create_client_with_lazy_load('#YOUR-SDK-KEY#', config_cache_class=InMemoryConfigCache)
```

Available options:

| Option Parameter             | Description                  | Default |
| ---------------------------- | ---------------------------- | ------- |
| `cache_time_to_live_seconds` | Cache TTL.                   | 60      |
| `config_cache_class`         | Custom cache implementation. | None    |
| `connect_timeout`            | The number of seconds to wait for the server to make the initial connection (i.e. completing the TCP connection handshake). | 10 |
| `read_timeout`               | The number of seconds to wait for the server to respond before giving up. | 30 |
| `flagOverrides`              | Local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides) | None |


### Manual polling
Manual polling gives you full control over when the `config.json` (with the setting values) is downloaded. *ConfigCat SDK* will not update them automatically. Calling `force_refresh()` is your application's responsibility.

```python
configcat_client = configcatclient.create_client_with_manual_poll('#YOUR-SDK-KEY#')
configcat_client.force_refresh()
```

Available options:

| Option Parameter     | Description                  | Default |
| -------------------- | ---------------------------- | ------- |
| `config_cache_class` | Custom cache implementation. | None    |
| `connect_timeout`    | The number of seconds to wait for the server to make the initial connection (i.e. completing the TCP connection handshake). | 10 |
| `read_timeout`       | The number of seconds to wait for the server to send respond giving up. | 30 |
| `flagOverrides`      | Local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides) | None |

> `get_value()` returns `default_value` if the cache is empty. Call `force_refresh()` to update the cache.
```python
configcat_client = configcatclient.create_client_with_manual_poll('#YOUR-SDK-KEY#')
value = configcat_client.get_value('key', 'my default value') # Returns "my default value"
configcat_client.force_refresh()
value = configcat_client.get_value('key', 'my default value') # Returns "value from server"
```


## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local/Offline mode** (`OverrideBehaviour.LocalOnly`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour.LocalOverRemote`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour.RemoteOverLocal`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can set up the SDK to load your feature flag & setting overrides from a dictionary.

```python
dictionary = {
    'enabledFeature': True,
    'disabledFeature': False,
    'intSetting': 5,
    'doubleSetting': 3.14,
    'stringSetting': 'test'
}

configcat_client = ConfigCatClient(
    sdk_key='#YOUR-SDK-KEY#',
    flag_overrides=LocalDictionaryDataSource(source=dictionary, override_behaviour=OverrideBehaviour.LocalOnly)
)
```

## Logging
In the *ConfigCat SDK* there is a default logger writes logs to the standard output. The following example shows how to configure the *Log Level* of the default logger. 

```python
import logging
logging.basicConfig(level=logging.INFO)
```

Available log levels:

| Level | Description                                                                             |
| ----- | --------------------------------------------------------------------------------------- |
| ERROR | Only error level events are logged.                                                     |
| WARN  | Errors and Warnings are logged.                                                         |
| INFO  | Errors, Warnings and feature flag evaluation is logged.                                 |
| DEBUG | All of the above plus debug info is logged. Debug logs can be different for other SDKs. |

Info level logging helps to inspect the feature flag evaluation process:
```bash
INFO -- : Evaluating get_value('isPOCFeatureEnabled').
INFO -- : Evaluating rule: [Email] [CONTAINS] [@something.com] => no match
INFO -- : Evaluating rule: [Email] [CONTAINS] [@example.com] => match, returning: true
```

## `get_all_keys()`
You can query the keys from your configuration in the SDK with the `get_all_keys()` method.

```python
configcat_client = configcatclient.create_client('#YOUR-SDK-KEY#')
keys = configcat_client.get_all_keys()
```

## `get_all_values()`

Evaluates and returns the values of all feature flags and settings. Passing a [User Object](#user-object) is optional.
| Parameters     | Description                                                                                                  | 
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```python
configcat_client = configcatclient.create_client('#YOUR-SDK-KEY#')
all_values = configcat_client.get_all_values(User('435170f4-8a8b-4b67-a723-505ac7cdea92'))  # Optional User Object
```

## Using ConfigCat behind a proxy
Provide your own network credentials (username/password), and proxy server settings (proxy server/port) by passing the proxy details to the creator method.

```python
proxies = {'https': '127.0.0.1:8080'}
proxy_auth = HTTPProxyAuth('user', 'password')
configcat_client = configcatclient.create_client_with_auto_poll('#YOUR-SDK-KEY#',
                                                                proxies=proxies,
                                                                proxy_auth=proxy_auth)
```

## Sample Applications
- <a href="https://github.com/configcat/python-sdk/tree/master/samples/consolesample" target="_blank">Sample Console App</a>
- <a href="https://github.com/configcat/python-sdk/tree/master/samples/webappsample" target="_blank">Django Web App</a>

## Look under the hood
* <a href="https://github.com/configcat/python-sdk" target="_blank">ConfigCat's Python SDK on GitHub</a>
* <a href="https://pypi.org/project/configcat-client/" target="_blank">ConfigCat's Python SDK in PyPI</a>
