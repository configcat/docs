---
id: python
title: Python
---
## Getting started:
### 1. Install *ConfigCat SDK*
```
pip install configcat-client
```

### 2. Import the package
```python
import configcatclient
```

### 3. Create the *ConfigCat* client with your *API Key*
```python
configcat_client = configcatclient.create_client('#YOUR-API-KEY#')
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
| `api_key`  | **REQUIRED.** API Key to access your feature flags and configurations. Get it from *ConfigCat Management Console*. |

`create_client_with_auto_poll()`, `create_client_with_lazy_load()`, `create_client_with_manual_poll()`  
Creating the client is different for each polling mode.
[See below](#polling-modes) for details.

> We strongly recommend using the *ConfigCat Client* as a Singleton object in your application.

## Anatomy of `get_value()`
| Parameters      | Description                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| `key`           | **REQUIRED.** Setting-specific key. Set in *ConfigCat Management Console* for each setting.                     |
| `default_value` | **REQUIRED.** This value will be returned in case of an error.                                                  |
| `user`          | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |
```python
value = configcat_client.get_value(
    'keyOfMySetting', # Setting Key
    False, # Default value
    User('435170f4-8a8b-4b67-a723-505ac7cdea92') # Optional User Object
);
```

### User Object 
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

### CDN base url (forward proxy, dedicated subscription)
You can customize your CDN path in the SDK with `base_url` parameter.

```python
configcatclient.create_client_with_auto_poll(
    "#YOUR-API-KEY#", base_url="https://myCDN.configcat.com");
```

The following methods support tha `base_url` parameter:

- `configcatclient.create_client_with_auto_poll()`
- `configcatclient.create_client_with_manual_poll()`
- `configcatclient.create_client_with_lazy_load()`

## Polling Modes
The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all requests are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.

### Auto polling (default)
The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

Use the `poll_interval_seconds` option parameter to change the polling interval.
```python
configcatclient.create_client_with_auto_poll(
    "#YOUR-API-KEY#", poll_interval_seconds=95);
```
Adding a callback to `on_configuration_changed_callback` option parameter will get you notified about changes.
```python
def configuration_changed_callback(self):
# Configuration changed.
    pass

configcatclient.create_client_with_auto_poll("#YOUR-API-KEY#", on_configuration_changed_callback=configuration_changed_callback);
```
Available options:
| Option Parameter                    | Description                                                                                          | Default |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| `poll_interval_seconds`             | Polling interval.                                                                                    | 60      |
| `on_configuration_changed_callback` | Callback to get notified about changes.                                                              | -       |
| `max_init_wait_time_seconds`        | Maximum waiting time between the client initialization and the first config acquisition in secconds. | 5       |
| `config_cache_class`                | Custom cache implementation.                                                                         | None    |

### Lazy loading
When calling `get_value()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. In this case the `get_value()` will return the setting value after the cache is updated.

Use `cache_time_to_live_seconds` option parameter to set cache lifetime.
```python
configcatclient.create_client_with_lazy_load(
    "#YOUR-API-KEY#", cache_time_to_live_seconds=600);
```

Use a custom `config_cache_class` option parameter.
```python
from configcatclient.interfaces import ConfigCache
class InMemoryConfigCache(ConfigCache):
    def __init__(self):
        self._value = None

    def get(self):
        return self._value

    def set(self, value):
        self._value = value

configcatclient.create_client_with_lazy_load("#YOUR-API-KEY#", config_cache_class=InMemoryConfigCache);
```
Available options:
| Option Parameter             | Description                  | Default |
| ---------------------------- | ---------------------------- | ------- |
| `cache_time_to_live_seconds` | Cache TTL.                   | 60      |
| `config_cache_class`         | Custom cache implementation. | None    |

### Manual polling
Manual polling gives you full control over when the setting values are downloaded. *ConfigCat SDK* will not update them automatically. Calling `force_refresh()` is your application's responsibility.

```python
configcat_client = configcatclient.create_client_with_manual_poll("#YOUR-API-KEY#");
configcat_client.force_refresh();
```
Available options:
| Option Parameter     | Description                  | Default |
| -------------------- | ---------------------------- | ------- |
| `config_cache_class` | Custom cache implementation. | None    |

> `get_value()` returns `default_value` if the cache is empty. Call `force_refresh()` to update the cache.
```python
configcat_client = configcatclient.create_client_with_manual_poll('#YOUR-API-KEY#');
value = configcat_client.get_value('key', 'my default value') # Returns "my default value"
configcat_client.force_refresh();
value = configcat_client.get_value('key', 'my default value') # Returns "value from server"
```

## `get_all_keys()`
You can query the keys from your configuration in the SDK with the `get_all_keys()` method.

```python
configcat_client = configcatclient.create_client('#YOUR-API-KEY#')
keys = configcat_client.get_all_keys()
```

## Sample Applications
- <a href="https://github.com/configcat/python-sdk/tree/master/samples/consolesample" target="_blank">Sample Console App</a>
- <a href="https://github.com/configcat/python-sdk/tree/master/samples/webappsample" target="_blank">Django Web App</a>

## Look under the hood
* <a href="https://github.com/configcat/python-sdk" target="_blank">ConfigCat's Python SDK on GitHub</a>
* <a href="https://pypi.org/project/configcat-client/" target="_blank">ConfigCat's Python SDK in PyPI</a>
