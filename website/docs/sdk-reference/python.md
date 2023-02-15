---
id: python
title: Python SDK Reference
description: ConfigCat Python SDK Reference. This is a step-by-step guide on how to use feature flags in your Python application.
---

[![Star on GitHub](https://img.shields.io/github/stars/configcat/python-sdk.svg?style=social)](https://github.com/configcat/python-sdk/stargazers)
[![Python CI](https://github.com/configcat/python-sdk/actions/workflows/python-ci.yml/badge.svg?branch=master)](https://github.com/configcat/python-sdk/actions/workflows/python-ci.yml)
[![codecov](https://codecov.io/gh/ConfigCat/python-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/ConfigCat/python-sdk)
[![PyPI](https://img.shields.io/pypi/v/configcat-client.svg)](https://pypi.python.org/pypi/configcat-client)
[![PyPI](https://img.shields.io/pypi/pyversions/configcat-client.svg)](https://pypi.python.org/pypi/configcat-client)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=configcat_python-sdk&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=configcat_python-sdk)

<a href="https://github.com/configcat/python-sdk" target="_blank">ConfigCat Python SDK on GitHub</a>

## Getting started

### 1. Install _ConfigCat SDK_

```
pip install configcat-client
```

### 2. Import the package

```python
import configcatclient
```

### 3. Create the _ConfigCat_ client with your _SDK Key_

```python
client = configcatclient.get('#YOUR-SDK-KEY#')
```

### 4. Get your setting value

```python
is_my_awesome_feature_enabled = client.get_value('isMyAwesomeFeatureEnabled', False)
if is_my_awesome_feature_enabled:
    do_the_new_thing()
else:
    do_the_old_thing()
```

### 5. Stop _ConfigCat_ client

You can safely shut down all clients at once or individually and release all associated resources on application exit.

```python
configcatclient.close_all() # closes all clients

client.close() # closes a specific client
```

## Creating the _ConfigCat Client_

_ConfigCat Client_ is responsible for:

- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`configcatclient.get('#YOUR-SDK-KEY#')` returns a client with default options.

| Client options            | Description                                                                                                                | Default |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------- |
| `base_url`                | *Obsolete*, sets the CDN base url (forward proxy, dedicated subscription) from where the sdk will download the config.json. | None |
| `polling_mode`            | Sets the polling mode for the client. [More about polling modes](#polling-modes). | PollingMode.auto_poll() |
| `config_cache`            | Sets a custom config cache implementation for the client. [More about cache](#custom-cache). | None |
| `proxies`                 | Sets custom proxies for the client. [More about proxy](#using-configcat-behind-a-proxy). | None |
| `proxy_auth`              | Sets proxy authentication for the custom proxies. [More about proxy](#using-configcat-behind-a-proxy). | None |
| `connect_timeout_seconds` | The number of seconds to wait for the server to make the initial connection (i.e. completing the TCP connection handshake). | 10      |
| `read_timeout_seconds`    | The number of seconds to wait for the server to respond before giving up.                                                   | 30      |
| `flag_overrides`          | Local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides)                                | None    |
| `data_governance`         | Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `Global`, `EuOnly`. | `Global`|
| `default_user`            | Sets the default user. [More about default user](#default-user). | None |
| `hooks`                   | Used to subscribe events that the SDK sends in specific scenarios. [More about hooks](#hooks). | None |
| `offline`                 | Indicates whether the SDK should be initialized in offline mode. [More about offline mode.](#online--offline-mode). | False |


```python
client = configcatclient.get('#YOUR-SDK-KEY#',
    ConfigCatOptions(
        polling_mode=PollingMode.auto_poll()
    )
)
```

:::caution
We strongly recommend you to use the _ConfigCat Client_ as a Singleton object in your application.
The `configcatclient.get()` static factory method constructs singleton client instances for your SDK keys.
These clients can be closed all at once with the `configcatclient.close_all()` method or individually with `client.close()`.
:::

## Anatomy of `get_value()`

| Parameters      | Description                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`           | **REQUIRED.** Setting-specific key. Set on _ConfigCat Dashboard_ for each setting.                           |
| `default_value` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`          | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```python
value = client.get_value(
    'keyOfMySetting', # Setting Key
    False, # Default value
    User('#UNIQUE-USER-IDENTIFIER#') # Optional User Object
)
```

## Anatomy of `get_value_details()`

`get_value_details()` is similar to `get_value()` but instead of returning the evaluated value only, it gives an _EvaluationDetails_ 
object with more detailed information about the evaluation result.

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on _ConfigCat Dashboard_ for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```python
details = client.get_value_details(
    'keyOfMySetting', # Setting Key
    False, # Default value
    User('#UNIQUE-USER-IDENTIFIER#') # Optional User Object
)
```

The details result contains the following information:

| Property                             | Description                                                                               |
| ------------------------------------ | ----------------------------------------------------------------------------------------- |
| `value`                              | The evaluated value of the feature flag or setting.                                       |
| `key`                                | The key of the evaluated feature flag or setting.                                         |
| `is_default_value`                   | True when the default value passed to get_value_details() is returned due to an error.    |
| `error`                              | In case of an error, this field contains the error message.                               |
| `user`                               | The user object that was used for evaluation.                                             |
| `matched_evaluation_percentage_rule` | If the evaluation was based on a percentage rule, this field contains that specific rule. |
| `matched_evaluation_rule`            | If the evaluation was based on a targeting rule, this field contains that specific rule.  |
| `fetch_time`                         | The last download time (UTC _datetime_) of the current config.                            |


## User Object

The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature.

```python
user_object = User('#UNIQUE-USER-IDENTIFIER#')
```

```python
user_object = User('john@example.com')
```

### Customized user object creation

| Parameters   | Description                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier` | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                         |
| `email`      | Optional parameter for easier targeting rule definitions.                                                                       |
| `country`    | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom`     | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |

```python
user_object = User(
  '#UNIQUE-USER-IDENTIFIER#',
  'john@example',
  'United Kingdom',
  { SubscriptionType: 'Pro', UserRole: 'Admin' },
);
```

### Default user

There's an option to set a default user object that will be used at feature flag and setting evaluation. It can be useful when your application has a single user only, or rarely switches users.

You can set the default user object either on SDK initialization:
```python
client = configcatclient.get('#YOUR-SDK-KEY#',
    ConfigCatOptions(
        default_user=User('john@example.com')
    )
)
```

or with the `set_default_user()` method of the ConfigCat client.
```python
client.set_default_user(User('john@example.com'));
```

Whenever the `get_value()`, `get_value_details()`, `get_variation_id()`, `get_all_variation_ids()`, or `get_all_values()` methods are called without an explicit user object parameter, the SDK will automatically use the default user as a user object.

```python
client = configcatclient.get('#YOUR-SDK-KEY#',
    ConfigCatOptions(
        default_user=User('john@example.com')
    )
)
# The default user will be used at the evaluation process.
value = client.get_value('keyOfMySetting', False)
```

When the user object parameter is specified on the requesting method, it takes precedence over the default user.

```python
client = configcatclient.get('#YOUR-SDK-KEY#',
    ConfigCatOptions(
        default_user=User('john@example.com')
    )
)
other_user = User('brian@example.com')
# otherUser will be used at the evaluation process.
value = client.get_value('keyOfMySetting', False, other_user)
```

For deleting the default user, you can do the following:
```python
client.clear_default_user()
```

## Polling Modes

The _ConfigCat SDK_ supports 3 different polling mechanisms to acquire the setting values from _ConfigCat_. After latest setting values are downloaded, they are stored in the internal cache then all `get_value()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.  
[More about polling modes.](/advanced/caching/)

### Auto polling (default)

The _ConfigCat SDK_ downloads the latest values and stores them automatically every 60 seconds.

Use the `poll_interval_seconds` option parameter of the `PollingMode.auto_poll()` to change the polling interval.

```python
client = configcatclient.get('#YOUR-SDK-KEY#',
    ConfigCatOptions(
        polling_mode=PollingMode.auto_poll(poll_interval_seconds=95)
    )
)
```

Available options:

| Option Parameter             | Description                              | Default |
| ---------------------------- | ---------------------------------------- | ------- |
| `poll_interval_seconds`      | Polling interval.                        | 60      |
| `max_init_wait_time_seconds` | Maximum waiting time between the client initialization and the first config acquisition in seconds. | 5       |

:::caution
Auto polling mode utilizes its polling job in a `threading.Thread` object. If you are running your application behind an uWSGI web server, the auto polling mode may not work as expected because the uWSGI web server disables Python's threading by default. Please [enable threading](https://uwsgi-docs.readthedocs.io/en/latest/Options.html#enable-threads) or switch to another polling mode in this case.
:::

### Lazy loading

When calling `get_value()` the _ConfigCat SDK_ downloads the latest setting values if they are not present or expired in the cache. In this case the `get_value()` will return the setting value after the cache is updated.

Use `cache_refresh_interval_seconds` option parameter to set cache lifetime.

```python
client = configcatclient.get('#YOUR-SDK-KEY#',
    ConfigCatOptions(
        polling_mode=PollingMode.lazy_load(cache_refresh_interval_seconds=600)
    )
)
```

Available options:

| Option Parameter             | Description                  | Default |
| ---------------------------- | ---------------------------- | ------- |
| `cache_time_to_live_seconds` | Cache TTL.                   | 60      |


### Manual polling

Manual polling gives you full control over when the `config.json` (with the setting values) is downloaded. _ConfigCat SDK_ will not update them automatically. Calling `force_refresh()` is your application's responsibility.

```python
client = configcatclient.get('#YOUR-SDK-KEY#',
    ConfigCatOptions(
        polling_mode=PollingMode.manual_poll()
    )
)
client.force_refresh()
```

> `get_value()` returns `default_value` if the cache is empty. Call `force_refresh()` to update the cache.

```python
client = configcatclient.get('#YOUR-SDK-KEY#',
    ConfigCatOptions(
        polling_mode=PollingMode.manual_poll()
    )
)
value = client.get_value('key', 'my default value') # Returns "my default value"
client.force_refresh()
value = client.get_value('key', 'my default value') # Returns "value from server"
```

## Hooks

With the following hooks you can subscribe to particular events fired by the SDK:

- `on_client_ready()`: This event is sent when the SDK reaches the ready state. If the SDK is set up with lazy load or manual polling it's considered ready right after instantiation.
If it's using auto polling, the ready state is reached when the SDK has a valid config.json loaded into memory either from cache or from HTTP. If the config couldn't be loaded neither from cache nor from HTTP the `on_client_ready` event fires when the auto polling's `max_init_wait_time_seconds` is reached.

- `on_config_changed(config: dict)`: This event is sent when the SDK loads a valid config.json into memory from cache, and each subsequent time when the loaded config.json changes via HTTP.

- `on_flag_evaluated(evaluation_details: EvaluationDetails)`: This event is sent each time when the SDK evaluates a feature flag or setting. The event sends the same evaluation details that you would get from [`get_value_details()`](#anatomy-of-getvaluedetails).

- `on_error(error: str)`: This event is sent when an error occurs within the ConfigCat SDK.

You can subscribe to these events either on SDK initialization: 
```python
def on_flag_evaluated(evaluation_details):
    # handle the event
    pass

client = configcatclient.get('#YOUR-SDK-KEY#',
    ConfigCatOptions(
        hooks=Hooks(on_flag_evaluated=on_flag_evaluated)
    )
)
```
or with the `get_hooks()` method of the ConfigCat client:
```python
client.get_hooks().add_on_flag_evaluated(on_flag_evaluated)
```

## Online / Offline mode

In cases when you'd want to prevent the SDK from making HTTP calls, you can put it in offline mode:
```python
client.set_offline()
```
In offline mode, the SDK won't initiate HTTP requests and will work only from its cache.

To put the SDK back in online mode, you can do the following:
```python
client.set_online()
```

> With `client.is_offline()` you can check whether the SDK is in offline mode.

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local only** (`OverrideBehaviour.LocalOnly`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour.LocalOverRemote`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour.RemoteOverLocal`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can set up the SDK to load your feature flag & setting overrides from a file or a dictionary.

### JSON File

The SDK can load your feature flag & setting overrides from a file.

#### File

```python
client = configcatclient.get(
    sdk_key='#YOUR-SDK-KEY#',
    ConfigCatOptions(
        flag_overrides=LocalFileFlagOverrides(
            file_path='path/to/the/local_flags.json',  # path to the file
            override_behaviour=OverrideBehaviour.LocalOnly  # local/offline mode
        )
    )
)
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

### Dictionary

You can set up the SDK to load your feature flag & setting overrides from a dictionary.

```python
dictionary = {
    'enabledFeature': True,
    'disabledFeature': False,
    'intSetting': 5,
    'doubleSetting': 3.14,
    'stringSetting': 'test'
}

client = configcatclient.get(
    sdk_key='#YOUR-SDK-KEY#',
    ConfigCatOptions(
        flag_overrides=LocalDictionaryFlagOverrides(source=dictionary, override_behaviour=OverrideBehaviour.LocalOnly)
    )
)
```

## Logging

The _ConfigCat SDK_ uses Python's built-in <a href="https://docs.python.org/3/library/logging.html" target="_blank">logging library</a>. The default logger writes logs to the standard output.

The _ConfigCat SDK_ specifies an internal logger called `'configcat'`.
The following example shows how to set the _Log Level_ on the internal _ConfigCat_ logger.

```python
import logging

logger = logging.getLogger('configcat')
logger.setLevel(logging.INFO)
```

Available log levels:

| Level | Description                                                                             |
| ----- | --------------------------------------------------------------------------------------- |
| ERROR | Only error level events are logged.                                                     |
| WARN  | Default. Errors and Warnings are logged.                                                |
| INFO  | Errors, Warnings and feature flag evaluation is logged.                                 |
| DEBUG | All of the above plus debug info is logged. Debug logs can be different for other SDKs. |

Info level logging helps to inspect the feature flag evaluation process:

```bash
INFO -- : Evaluating get_value('isPOCFeatureEnabled').
User object:
{
    "Identifier" : "#UNIQUE-USER-IDENTIFIER#",
    "Email" : "john@example.com"
}
Evaluating rule: [Email] [CONTAINS] [@something.com] => no match
Evaluating rule: [Email] [CONTAINS] [@example.com] => match, returning: True
```

## `get_all_keys()`

You can query the keys from your config.json in the SDK with the `get_all_keys()` method.

```python
client = configcatclient.get('#YOUR-SDK-KEY#')
keys = client.get_all_keys()
```

## `get_all_values()`

Evaluates and returns the values of all feature flags and settings. Passing a [User Object](#user-object) is optional.

| Parameters | Description                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| `user`     | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```python
client = configcatclient.get('#YOUR-SDK-KEY#')
all_values = client.get_all_values(User('#UNIQUE-USER-IDENTIFIER#'))  # Optional User Object
```

## `get_all_value_details()`

Evaluates and returns the detailed values of all feature flags and settings. Passing a [User Object](#user-object) is optional.

```python
client = configcatclient.get('#YOUR-SDK-KEY#')
all_value_details = client.get_all_value_details(User('#UNIQUE-USER-IDENTIFIER#'))  # Optional User Object
```

## Custom cache

You have the option to inject your custom cache implementation into the client. All you have to do is to inherit from the ConfigCache abstract class:

```python
from configcatclient.interfaces import ConfigCache

class InMemoryConfigCache(ConfigCache):
    def __init__(self):
        self._value = {}

    def get(self, key):
        # you should return the cached value
        return self._value.get(key)

    def set(self, key, value):
        # you should cache the new value
        self._value[key] = value
```

Then use your custom cache implementation:

```python
client = configcatclient.get('#YOUR-SDK-KEY#',
    ConfigCatOptions(
        config_cache=InMemoryConfigCache()
    )
)
```

## Using ConfigCat behind a proxy

Provide your own network credentials (username/password), and proxy server settings (proxy server/port) by passing the proxy details to the creator method.

```python
proxies = {'https': '127.0.0.1:8080'}
proxy_auth = HTTPProxyAuth('user', 'password')
client = configcatclient.get('#YOUR-SDK-KEY#',
    ConfigCatOptions(
        proxies=proxies,
        proxy_auth=proxy_auth
    )
)
```

## Sample Applications

- <a href="https://github.com/configcat/python-sdk/tree/master/samples/consolesample" target="_blank">Sample Console App</a>
- <a href="https://github.com/configcat/python-sdk/tree/master/samples/webappsample" target="_blank">Django Web App</a>

## Guides

See <a href="https://configcat.com/blog/2022/08/12/how-to-use-feature-flag-with-flask/" target="_blank">this</a> guide on how to use ConfigCat's Python SDK in a Flask application.

## Look under the hood

- <a href="https://github.com/configcat/python-sdk" target="_blank">ConfigCat's Python SDK on GitHub</a>
- <a href="https://pypi.org/project/configcat-client/" target="_blank">ConfigCat's Python SDK in PyPI</a>
