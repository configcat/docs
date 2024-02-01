---
id: unreal
title: Unreal Engine SDK Reference
description: ConfigCat Unreal Engine SDK Reference. This is a step-by-step guide on how to use feature flags in your Unreal Engine project.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
export const CPPSchema = require('@site/src/schema-markup/sdk-reference/cpp.json');

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(CPPSchema) }}
></script>

[![Star on GitHub](https://img.shields.io/github/stars/configcat/unreal-engine-sdk.svg?style=social)](https://github.com/configcat/unreal-engine-sdk/stargazers)
[![Build Status](https://img.shields.io/github/actions/workflow/status/configcat/unreal-engine-sdk/plugin-ci.yml?logo=GitHub&label=Unreal&branch=main)](https://github.com/configcat/unreal-engine-sdk/actions/workflows/plugin-ci.yml)

<a href="https://github.com/ConfigCat/unreal-engine-sdk" target="_blank">ConfigCat Unreal SDK on GitHub</a>

## Getting Started:

### 1. Installing the ConfigCat plugin to your project

Via **[Unreal Marketplace](https://www.unrealengine.com/marketplace/product/e142293a397d4ce4bf6a1f3053a2316d)**

Via **[GitHub clone](https://github.com/configcat/unreal-engine-sdk)**

Prequesities to cloning manually:
- you are working in a [C++ project](https://docs.unrealengine.com/5.2/en-US/compiling-game-projects-in-unreal-engine-using-cplusplus/)
- you've completed the [Visual Studio](https://docs.unrealengine.com/5.2/en-US/setting-up-visual-studio-development-environment-for-cplusplus-projects-in-unreal-engine/) or [Visual Studio Code](https://docs.unrealengine.com/5.2/en-US/setting-up-visual-studio-code-for-unreal-engine/) setup

Run the following commands in the root folder of your project (where the `.uproject` file is located):

```cmd
mkdir -p Plugins
cd Plugins
git clone https://github.com/configcat/unreal-engine-sdk ConfigCat
```

### 2. Enable the ConfigCat plugin in your project

<img className="unreal-enable-plugin zoomable" src="/docs/assets/unreal/enable-plugin.png" alt="Unreal Engine enable plugin" />

Navigate to `Edit -> Plugins` and perform the following steps:
1. Find the `Config Cat` plugin and **tick** the enable checkbox.
1. Press `Restart` to load up the editor.

Note: if you are using a locally built plugin, you will need to rebuild from source manually.

### 3. Set up the _ConfigCat_ settings with your _SDK Key_

You can configure all ConfigCat related settings inside the `ProjectSettings -> Feature Flags -> ConfigCat`.

<img className="unreal-plugin-settings zoomable" src="/docs/assets/unreal/plugin-settings.png" alt="Unreal Engine plugin settings" />

| Properties                    | Description                                                                                                                                                                                                                                                                                         |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Sdk Key`                     | SDK Key to access your feature flags and configurations. Get it from ConfigCat Dashboard.                                                                                                                                                                                                           |
| `Base Url`                    | Optional, sets the CDN base url (forward proxy, dedicated subscription) from where the sdk will download the config JSON.                                                                                                                                                                           |
| `Data Governance`             | Optional, defaults to `Global`. Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](/advanced/data-governance). Available options: `Global`, `EuOnly`.    |
| `Connect Timeout`             | Optional, defaults to `8000ms`. Sets the amount of milliseconds to wait for the server to make the initial connection (i.e. completing the TCP connection handshake). `0` means it never times out during transfer                                                                                  |
| `Read Timeout`                | Optional, defaults to `5000ms`. Sets the amount of milliseconds to wait for the server to respond before giving up. `0` means it never times out during transfer.                                                                                                                                   |
| `Polling Mode`                | Optional, sets the polling mode for the client. [More about polling modes](#polling-modes).                                                                                                                                                                                                         |
| `Auto Poll Interval`          | For PollingMode == Custom, sets at least how often this policy should fetch the latest config JSON and refresh the cache.                                                                                                                                                                           |
| `Maximum Inititial Wait Time` | For PollingMode == Custom, sets the maximum waiting time between initialization and the first config acquisition in seconds.                                                                                                                                                                        |
| `Cache Refresh Interval`      | For PollingMode == LazyLoad, sets how long the cache will store its value before fetching the latest from the network again.                                                                                                                                                                        |
| `Proxies`                     | Optional, sets proxy addresses. e.g. { "https": "your_proxy_ip:your_proxy_port" } on each http request                                                                                                                                                                                              |
| `Proxy Authentications`       | Optional, sets proxy authentication on each http request.                                                                                                                                                                                                                                           |
| `Start Offline`               | Optional, sets the SDK ot be initialized in offline mode.                                                                                                                                                                                                                                           |

### 4. Get your setting value

<Tabs groupId="unreal-languages">
<TabItem value="blueprints" label="Blueprints">

<img className="unreal-blueprints-get-value zoomable" src="/docs/assets/unreal/blueprints-get-value.png" alt="Unreal Engine Get Value" />

</TabItem>
<TabItem value="cpp" label="C++">

Add Depedency to your `.Build.cs` file:

```cpp
PrivateDependencyModuleNames.AddRange(new string[]
{
  "ConfigCat"
});
```

Access feature flags:
```cpp
UConfigCatSubsystem* ConfigCat = UConfigCatSubsystem::Get(this);
bool bIsMyAwesomeFeatureEnabled = ConfigCat->GetBoolValue(TEXT("isMyAwesomeFeatureEnabled"), false);
SetMyAwesomeFeatureEnabled(bIsMyAwesomeFeatureEnabled);
```

</TabItem>
</Tabs>

## Anatomy of `GetValue`

| Parameters      | Description                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| `Key`           | **REQUIRED.** The key of a specific setting or feature flag. Set on _ConfigCat Dashboard_ for each setting.  |
| `Default Value` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `User`          | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](/advanced/targeting) |

<Tabs groupId="unreal-languages">
<TabItem value="blueprints" label="Blueprints">

<img className="unreal-blueprints-get-value-overloads zoomable" src="/docs/assets/unreal/blueprints-get-value-overloads.png" alt="Unreal Engine Get Value Overloads" />
<img className="unreal-blueprints-get-value-targeted zoomable" src="/docs/assets/unreal/blueprints-get-value-targeted.png" alt="Unreal Engine Get Values Targeted" />

</TabItem>
<TabItem value="cpp" label="C++">

Access value depending on type:
```cpp
UConfigCatSubsystem* ConfigCat = UConfigCatSubsystem::Get(this);

bool bMyFirstFeatureFlag = ConfigCat->GetBoolValue(TEXT("myFirstFeatureFlag"), false);
int MySecondFeatureFlag = ConfigCat->GetIntValue(TEXT("mySecondFeatureFlag"), 0);
double MyThirdFeatureFlag = ConfigCat->GetDoubleValue(TEXT("myThirdFeatureFlag"), 0.0);
FString MyFourthFeatureFlag = ConfigCat->GetStringValue(TEXT("myForthFeatureFlag"), TEXT(""));
```

Access value depending on type targeting an user:
```cpp
UConfigCatSubsystem* ConfigCat = UConfigCatSubsystem::Get(this);

FConfigCatUser User = FConfigCatUser(TEXT("#USER-IDENTIFIER#"));
FString TargetValue = ConfigCat->GetStringValue(TEXT("targetValue"), TEXT(""), User);
```

</TabItem>
</Tabs>

## Anatomy of `GetValueDetails()`

`GetValueDetails()` is similar to `GetValue()` but instead of returning the evaluated value only, it gives more detailed information about the evaluation result.

| Parameters      | Description                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| `Key`           | **REQUIRED.** The key of a specific setting or feature flag. Set on _ConfigCat Dashboard_ for each setting.  |
| `Default Value` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `User`          | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](/advanced/targeting) |

<Tabs groupId="unreal-languages">
<TabItem value="blueprints" label="Blueprints">

<img className="unreal-blueprints-get-value-details zoomable" src="/docs/assets/unreal/blueprints-get-value-details.png" alt="Unreal Engine Get Value Details" />

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
UConfigCatSubsystem* ConfigCat = UConfigCatSubsystem::Get(this);

FConfigCatUser User = FConfigCatUser(TEXT("#USER-IDENTIFIER#"));
FConfigCatEvaluationDetails Details = ConfigCat->GetStringValueDetails(TEXT("myFeatureFlag"),
  TEXT(""), User);
```

</TabItem>
</Tabs>

The `Details` result contains the following information:

| Field                                | Description                                                                               |
| ------------------------------------ | ----------------------------------------------------------------------------------------- |
| `Value`                              | The evaluated value of the feature flag or setting.                                       |
| `Key`                                | The key of the evaluated feature flag or setting.                                         |
| `Is Default Value`                   | True when the default value passed to getValueDetails() is returned due to an error.      |
| `Error`                              | In case of an error, this field contains the error message.                               |
| `User`                               | The User Object that was used for evaluation.                                             |
| `Matched Evaluation Percentage Rule` | If the evaluation was based on a percentage rule, this field contains that specific rule. |
| `Matched Evaluation Rule`            | If the evaluation was based on a Targeting Rule, this field contains that specific rule.  |
| `FetchTime`                          | The last download time of the current config.                                             |

## User Object

The [User Object](/advanced/user-object) is essential if you'd like to use ConfigCat's [Targeting](/advanced/targeting) feature.

<Tabs groupId="unreal-languages">
<TabItem value="blueprints" label="Blueprints">

<img className="unreal-blueprints-create-user zoomable" src="/docs/assets/unreal/blueprints-create-user.png" alt="Unreal Engine Create User" />

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
FConfigCatUser User = FConfigCatUser(TEXT("#UNIQUE-USER-IDENTIFIER#"));
```

</TabItem>
</Tabs>

### Customized User Object creation

| Argument  | Description                                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `Id`      | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                         |
| `Email`   | Optional parameter for easier Targeting Rule definitions.                                                                       |
| `Country` | Optional parameter for easier Targeting Rule definitions.                                                                       |
| `Custom`  | Optional dictionary for custom attributes of a user for advanced Targeting Rule definitions. e.g. User role, Subscription type. |

<Tabs groupId="unreal-languages">
<TabItem value="blueprints" label="Blueprints">

<img className="unreal-blueprints-create-user-custom zoomable" src="/docs/assets/unreal/blueprints-create-user-custom.png" alt="Unreal Engine Create User Custom" />

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
TMap<FString, FString> Attributes;
Attributes.Emplace(TEXT("SubscriptionType"), TEXT("Pro"));
Attributes.Emplace(TEXT("UserRole"), TEXT("Admin"));
FConfigCatUser User = FConfigCatUser(TEXT("#UNIQUE-USER-IDENTIFIER#"), TEXT("john@example.com"), 
  TEXT("United Kingdom"), Attributes);
```

</TabItem>
</Tabs>

### Default user

There's an option to set a default User Object that will be used at feature flag and setting evaluation. It can be useful when your application has a single user only, or rarely switches users.

You can set the default User Object with the `setDefaultUser()` method of the ConfigCat client.

<Tabs groupId="unreal-languages">
<TabItem value="blueprints" label="Blueprints">

<img className="unreal-blueprints-set-default-user zoomable" src="/docs/assets/unreal/blueprints-set-default-user.png" alt="Unreal Engine Set Default User" />

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
UConfigCatSubsystem* ConfigCat = UConfigCatSubsystem::Get(this);
FConfigCatUser User = FConfigCatUser(TEXT("#UNIQUE-USER-IDENTIFIER#"));
ConfigCat->SetDefaultUser(User);
```

</TabItem>
</Tabs>

Whenever the `GetValue()`, `GetValueDetails()`, `GetAllValues()`, or `GetAllValueDetails()` methods are called without an explicit `user` parameter, the SDK will automatically use the default user as a User Object.

<Tabs groupId="unreal-languages">
<TabItem value="blueprints" label="Blueprints">

<img className="unreal-blueprints-default-user-example zoomable" src="/docs/assets/unreal/blueprints-default-user-example.png" alt="Unreal Engine Default User Example" />

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
UConfigCatSubsystem* ConfigCat = UConfigCatSubsystem::Get(this);
FConfigCatUser User = FConfigCatUser(TEXT("#UNIQUE-USER-IDENTIFIER#"));
ConfigCat->SetDefaultUser(User);

// The default user will be used at the evaluation process.
bool bMySetting = ConfigCat->GetBoolValue(TEXT("keyOfMySetting"), false);
```

</TabItem>
</Tabs>

When the `user` parameter is specified on the requesting method, it takes precedence over the default user.

<Tabs groupId="unreal-languages">
<TabItem value="blueprints" label="Blueprints">

<img className="unreal-blueprints-other-user-example zoomable" src="/docs/assets/unreal/blueprints-other-user-example.png" alt="Unreal Engine Other User Example" />

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
UConfigCatSubsystem* ConfigCat = UConfigCatSubsystem::Get(this);
FConfigCatUser User = FConfigCatUser(TEXT("#UNIQUE-USER-IDENTIFIER#"));
ConfigCat->SetDefaultUser(User);

FConfigCatUser OtherUser = FConfigCatUser(TEXT("#OTHER-UNIQUE-USER-IDENTIFIER#"));

// OtherUser will be used at the evaluation process.
bool bMySetting = ConfigCat->GetBoolValue(TEXT("keyOfMySetting"), false, OtherUser);
```

</TabItem>
</Tabs>

For deleting the default user, you can do the following:

<Tabs groupId="unreal-languages">
<TabItem value="blueprints" label="Blueprints">

<img className="unreal-blueprints-clear-default-user zoomable" src="/docs/assets/unreal/blueprints-clear-default-user.png" alt="Unreal Engine Clear Default User" />

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
UConfigCatSubsystem* ConfigCat = UConfigCatSubsystem::Get(this);
ConfigCat->ClearDefaultUser();
```

</TabItem>
</Tabs>

## Polling Modes

The _ConfigCat SDK_ supports 3 different polling mechanisms to acquire the setting values from _ConfigCat_. After latest setting values are downloaded, they are stored in the internal cache then all `GetValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.  
[More about polling modes.](/advanced/caching/)

### Auto polling (default)

The _ConfigCat SDK_ downloads the latest values and stores them automatically every 60 seconds.

<img className="unreal-blueprints-settings-polling-mode-auto zoomable" src="/docs/assets/unreal/settings-polling-mode-auto.png" alt="Unreal Engine Polling Mode Auto" />

Available options:

| Option Parameter           | Description                                                                                         | Default |
| -------------------------- | --------------------------------------------------------------------------------------------------- | ------- |
| `Auto Poll Interval`       | Polling interval.                                                                                   | 60      |
| `Max Inititial Wait Time`  | Maximum waiting time between the client initialization and the first config acquisition in seconds. | 5       |

### Lazy Loading

When calling `getValue()` the _ConfigCat SDK_ downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

<img className="unreal-settings-polling-mode-lazy zoomable" src="/docs/assets/unreal/settings-polling-mode-lazy.png" alt="Unreal Engine Polling Mode Lazy" />

Available options:

| Parameter                | Description | Default |
| ------------------------ | ----------- | ------- |
| `Cache Refresh Interval` | Cache TTL.  | 60      |

### Manual Polling

Manual polling gives you full control over when the `config JSON` (with the setting values) is downloaded. ConfigCat SDK will not update them automatically. Calling `ForceRefresh()` is your application's responsibility.

<img className="unreal-settings-polling-mode-manual zoomable" src="/docs/assets/unreal/settings-polling-mode-manual.png" alt="Unreal Engine Polling Mode Manual" />

<Tabs groupId="unreal-languages">
<TabItem value="blueprints" label="Blueprints">

<img className="unreal-blueprints-manual-force-refresh zoomable" src="/docs/assets/unreal/blueprints-manual-force-refresh.png" alt="Unreal Engine Manual Force Refresh" />

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
UConfigCatSubsystem* ConfigCat = UConfigCatSubsystem::Get(this);
ConfigCat->ForceRefresh();
```

</TabItem>
</Tabs>

> `GetValue()` returns `DefaultValue` if the cache is empty. Call `ForceRefresh()` to update the cache.

## Delegates 

With the following delegates you can subscribe to particular events fired by the SDK:

- `OnClientReady`: This event is sent when the SDK reaches the ready state. If the SDK is initialized with lazy load or manual polling, it's considered ready right after instantiation.
  If it's using auto polling, the ready state is reached when the SDK has a valid config JSON loaded into memory either from cache or from HTTP. If the config couldn't be loaded neither from cache nor from HTTP the `onClientReady` event fires when the auto polling's `maxInitWaitTimeInSeconds` is reached.

- `OnConfigChanged`: This event is sent when the SDK loads a valid config JSON into memory from cache, and each subsequent time when the loaded config JSON changes via HTTP.

- `OnFlagEvaluated`: This event is sent each time when the SDK evaluates a feature flag or setting. The event sends the same evaluation details that you would get from [`getValueDetails()`](#anatomy-of-getvaluedetails).

- `OnError`: This event is sent when an error occurs within the ConfigCat SDK.

You can subscribe to these events either on SDK initialization:

<Tabs groupId="unreal-languages">
<TabItem value="blueprints" label="Blueprints">

<img className="unreal-blueprint-event-delegates zoomable" src="/docs/assets/unreal/blueprint-event-delegates.png" alt="Unreal Engine Blueprint Event Delegates" />

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
UConfigCatSubsystem* ConfigCat = UConfigCatSubsystem::Get(this);

ConfigCat->OnClientReady.AddWeakLambda(this, [](){ /* OnClientReady callback */ });
ConfigCat->OnConfigChanged.AddWeakLambda(this, [](const FConfigCatConfig& Config){ /* OnConfigChanged callback */ });
ConfigCat->OnFlagEvaluated.AddWeakLambda(this, [](const FConfigCatEvaluationDetails& Details){ /* OnFlagEvaluated callback */ });
ConfigCat->OnError.AddWeakLambda(this, [](const FString& Error){ /* OnError callback */ });
```

</TabItem>
</Tabs>

## Online / Offline mode

In cases when you'd want to prevent the SDK from making HTTP calls, you can put it in offline mode with `SetOffline`.

In offline mode, the SDK won't initiate HTTP requests and will work only from its cache.

To put the SDK back in online mode, you can use `SetOnline`; 

> With `IsOffline` you can check whether the SDK is in offline mode.

<Tabs groupId="unreal-languages">
<TabItem value="blueprints" label="Blueprints">

<img className="unreal-blueprint-offline-functionality zoomable" src="/docs/assets/unreal/blueprint-offline-functionality.png" alt="Unreal Engine Blueprint Offline Functionality" />

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
UConfigCatSubsystem* ConfigCat = UConfigCatSubsystem::Get(this);

ConfigCat->SetOffline();
ConfigCat->SetOnline();
bool bIsOffline = ConfigCat->IsOffline();
```

</TabItem>
</Tabs>

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local only** (`OverrideBehaviour::LocalOnly`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour::LocalOverRemote`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour::RemoteOverLocal`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can set up the SDK to load your feature flag & setting overrides from a file or a map.

<img className="unreal-settings-overrides zoomable" src="/docs/assets/unreal/settings-overrides.png" alt="Unreal Engine Settings Overrides" />

### JSON File

The SDK can be set up to load your feature flag & setting overrides from a file.

#### File

If specified the SDK will load the JSON data `%PROJECT_ROOT/Content/ConfigCat/flags.json` file. This file needs to be created manually in the specified folder to ensure it gets packaged in the final executable. 

Note: This file needs to be created in your file explorer and cannot be done within Unreal.

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

**Coming soon**: [Support for Flag overrides via Map #8](https://github.com/configcat/unreal-engine-sdk/issues/8)

:::info
The Unreal Engine SDK doesn't support programmatically setting a flag map override currently.
:::

## `GetAllKeys()`

You can query the keys of each feature flag and setting with the `getAllKeys()` method.

<Tabs groupId="unreal-languages">
<TabItem value="blueprints" label="Blueprints">

<img className="unreal-blueprints-get-all-keys zoomable" src="/docs/assets/unreal/blueprints-get-all-keys.png" alt="Unreal Engine Get All Keys" />

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
UConfigCatSubsystem* ConfigCat = UConfigCatSubsystem::Get(this);

TArray<FString> Keys = ConfigCat->GetAllKeys();
```

</TabItem>
</Tabs>

## `GetAllValues()`

Evaluates and returns the values of all feature flags and settings. Passing a User Object is optional.

<Tabs groupId="unreal-languages">
<TabItem value="blueprints" label="Blueprints">

<img className="unreal-blueprints-get-all-values zoomable" src="/docs/assets/unreal/blueprints-get-all-values.png" alt="Unreal Engine Get All Values" />

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
UConfigCatSubsystem* ConfigCat = UConfigCatSubsystem::Get(this);
TMap<FString, FConfigCatValue> SettingValues = ConfigCat->GetAllValues(); 
	
FConfigCatUser User = FConfigCatUser(TEXT("#UNIQUE-USER-IDENTIFIER#"));
TMap<FString, FConfigCatValue> SettingValuesTargeting = ConfigCat->GetAllValues(User);
```

</TabItem>
</Tabs>

## `GetAllValueDetails`

Evaluates and returns the detailed values of all feature flags and settings. Passing a [User Object](#user-object) is optional.

<Tabs groupId="unreal-languages">
<TabItem value="blueprints" label="Blueprints">

<img className="unreal-blueprints-get-all-value-details zoomable" src="/docs/assets/unreal/blueprints-get-all-value-details.png" alt="Unreal Engine Get All Value Details" />

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
UConfigCatSubsystem* ConfigCat = UConfigCatSubsystem::Get(this);
FConfigCatUser User = FConfigCatUser(TEXT("#UNIQUE-USER-IDENTIFIER#"));

TArray<FConfigCatEvaluationDetails> AllValueDetails = ConfigCat->GetAllValueDetails(User);
```

</TabItem>
</Tabs>

## Custom Cache

**Coming soon**: [Support for Custom Cache #9](https://github.com/configcat/unreal-engine-sdk/issues/9)

:::info
The Unreal Engine SDK doesn't support custom cache implementations currently.
:::

## Force refresh

Call the `forceRefresh()` method on the client to download the latest config JSON and update the cache.

<Tabs groupId="unreal-languages">
<TabItem value="blueprints" label="Blueprints">

<img className="unreal-blueprints-force-refresh zoomable" src="/docs/assets/unreal/blueprints-force-refresh.png" alt="Unreal Engine Blueprint Force Refresh" />

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
UConfigCatSubsystem* ConfigCat = UConfigCatSubsystem::Get(this);

ConfigCat->ForceRefresh();
```

</TabItem>
</Tabs>

## Using ConfigCat behind a proxy

:::info
The Unreal Engine HTTP module doesn't support running behinde a proxy.
:::

## Changing the default HTTP timeout

Set the maximum wait time for a ConfigCat HTTP response by changing the _ConnectTimeoutMs_ or _ReadTimeoutMs_ in the ConfigCat `ProjectSettings`.
The default _ConnectTimeoutMs_ is 8 seconds. The default _ReadTimeoutMs_ is 5 seconds.

<img className="unreal-settings-http-timeout zoomable" src="/docs/assets/unreal/settings-http-timeout.png" alt="Unreal Engine Settings Http Timeout" />

## Logging

All ConfigCat logs are inside the `LogConfigCat` category. By default the verbosity is set to `Log`, but it can be changed to any [Verbosity Level](https://docs.unrealengine.com/5.3/en-US/logging-in-unreal-engine/#logverbosity).

The verbosity can be changed:

Via **Command line arguments**:

Run the executable with `-LogCmds="LogConfigCat VerbosityLevel"`. For example: `-LogCmds="LogConfigCat Warning"` to only show warnings and above.

Via **DefaultEngine.ini**:

In the `[Core.Log]` category add `LogConfigCat=VerbosityLevel` inside the `DefaultEngine.ini`. For example:

```
[Core.Log]
LogConfigCat=Warning ;to only show warnings and above
```

Note: Since the Unreal Engine SDK is a wrapper of the CPP SDK, all logs coming from the CPP SDK are tagged wtih `[CPP-SDK]`.

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

The frontend/mobile SDKs are running in your users' browsers/devices. The SDK is [downloading a config JSON](/requests/) file from ConfigCat's CDN servers. The URL path for this config JSON file contains your SDK key, so the SDK key and the content of your config JSON file (feature flag keys, feature flag values, Targeting Rules, % rules) can be visible to your users.
This SDK key is read-only, it only allows downloading your config JSON file, but nobody can make any changes with it in your ConfigCat account.

If you do not want to expose the SDK key or the content of the config JSON file, we recommend using the SDK in your backend components only. You can always create a backend endpoint using the ConfigCat SDK that can evaluate feature flags for a specific user, and call that backend endpoint from your frontend/mobile applications.

Also, we recommend using [confidential targeting comparators](/advanced/targeting/#confidential-text-comparators) in the Targeting Rules of those feature flags that are used in the frontend/mobile SDKs.

## Look Under the Hood

- <a href="https://github.com/ConfigCat/unreal-engine-sdk" target="_blank">ConfigCat Unreal Engine SDK's repository on GitHub</a>
