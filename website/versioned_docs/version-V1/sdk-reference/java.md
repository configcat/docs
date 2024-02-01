---
id: java
title: Java SDK reference
description: ConfigCat Java SDK Reference. This is a step-by-step guide on how to use feature flags in your Java application.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
export const JavaSchema = require('@site/src/schema-markup/sdk-reference/java.json');

<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JavaSchema) }}></script>

[![Star on GitHub](https://img.shields.io/github/stars/configcat/java-sdk.svg?style=social)](https://github.com/configcat/java-sdk/stargazers)
[![Java CI](https://github.com/configcat/java-sdk/actions/workflows/java-ci.yml/badge.svg?branch=master)](https://github.com/configcat/java-sdk/actions/workflows/java-ci.yml)
[![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.configcat/configcat-java-client/badge.svg)](https://maven-badges.herokuapp.com/maven-central/com.configcat/configcat-java-client)
[![Javadocs](https://javadoc.io/badge/com.configcat/configcat-java-client.svg)](https://javadoc.io/doc/com.configcat/configcat-java-client)
[![Coverage Status](https://img.shields.io/sonar/coverage/configcat_java-sdk?logo=SonarCloud&server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/project/overview?id=configcat_java-sdk)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=configcat_java-sdk&metric=alert_status)](https://sonarcloud.io/dashboard?id=configcat_java-sdk)

## Getting Started

### 1. Add the ConfigCat SDK to your project

<Tabs>
<TabItem value="Gradle" label="Gradle">

```groovy title="build.gradle"
dependencies {
    implementation 'com.configcat:configcat-java-client:9.+'
}
```

</TabItem>
<TabItem value="Maven" label="Maven">

```xml title="pom.xml"
<dependency>
  <groupId>com.configcat</groupId>
  <artifactId>configcat-java-client</artifactId>
  <version>[9.0.0,)</version>
</dependency>
```

</TabItem>
</Tabs>

### 2. Import the ConfigCat SDK

```java
import com.configcat.*;
```

### 3. Create and get the _ConfigCat_ client for your _SDK Key_

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#");
```

### 4. Get your setting value

```java
boolean isMyAwesomeFeatureEnabled = client.getValue(Boolean.class, "isMyAwesomeFeatureEnabled", false);
if(isMyAwesomeFeatureEnabled) {
    doTheNewThing();
} else {
    doTheOldThing();
}
```

### 5. Stop _ConfigCat_ client

You can safely shut down the client instance and release all associated resources on application exit.

```java
client.close();
```

You can close all singleton client instances and release all associated resources on application exit.

```java
ConfigCatClient.closeAll();
```

## Java compatibility

The ConfigCat Java SDK is compatible with Java 8 and higher.

## Creating the _ConfigCat Client_

_ConfigCat Client_ is responsible for:

- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`ConfigCatClient.get(<sdkKey>)` returns a client with default options.

### Customizing the _ConfigCat Client_

To customize the SDK's behavior, you can pass an additional `Consumer<Options>` parameter to the `get()` static
factory method where the `Options` class is used to set up the _ConfigCat Client_.

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.pollingMode(PollingModes.autoPoll());
    options.logLevel(LogLevel.INFO);
});
```

These are the available options on the `Options` class:

| Option                                                        | Description                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dataGovernance(DataGovernance)`                              | Optional, defaults to `Global`. Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](/advanced/data-governance). Available options: `Global`, `EuOnly`. |
| `baseUrl(string)`                                             | _Obsolete_ Optional, sets the CDN base url (forward proxy, dedicated subscription) from where the sdk will download the configurations.                                                                                                                                                            |
| `httpClient(OkHttpClient)`                                    | Optional, sets the underlying `OkHttpClient` used to download the feature flags and settings over HTTP. [More about the HTTP Client](#httpclient).                                                                                                                                                 |
| `cache(ConfigCache)`                                          | Optional, sets a custom cache implementation for the client. [More about cache](#custom-cache).                                                                                                                                                                                                    |
| `pollingMode(PollingMode)`                                    | Optional, sets the polling mode for the client. [More about polling modes](#polling-modes).                                                                                                                                                                                                        |
| `logLevel(LogLevel)`                                          | Optional, defaults to `WARNING`. Sets the internal log level. [More about logging](#logging).                                                                                                                                                                                                      |
| `flagOverrides(OverrideDataSourceBuilder, OverrideBehaviour)` | Optional, sets the local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides).                                                                                                                                                                                   |
| `defaultUser(User)`                                           | Optional, sets default user. [More about default user](#default-user).                                                                                                                                                                                                                             |
| `offline(boolean)`                                            | Optional, defaults to `false`. Indicates whether the SDK should be initialized in offline mode. [More about offline mode](#online--offline-mode).                                                                                                                                                  |
| `hooks()`                                                     | Optional, used to subscribe events that the SDK sends in specific scenarios. [More about hooks](#hooks).                                                                                                                                                                                           |

:::caution
We strongly recommend you to use the `ConfigCatClient` as a Singleton object in your application.
The `ConfigCatClient.get("#YOUR-SDK-KEY#")` static factory method constructs singleton client instances for your SDK keys.
These clients can be closed all at once with the `ConfigCatClient.closeAll()` method or individually with `client.close()`.
:::

## Anatomy of `getValue()`

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `classOfT`     | **REQUIRED.** The type of the setting.                                                                       |
| `key`          | **REQUIRED.** Setting-specific key. Set on _ConfigCat Dashboard_ for each setting.                           |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](/advanced/targeting) |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |

```java
boolean value = client.getValue(
    Boolean.class, // Setting type
    "keyOfMySetting", // Setting Key
    User.newBuilder().build("#UNIQUE-USER-IDENTIFIER#"), // Optional User Object
    false // Default value
);
```
:::caution
It is important to provide an argument for the `classOfT` parameter, specifically for the `T` generic type parameter,
that matches the type of the feature flag or setting you are evaluating. Please refer to the following table for the corresponding types.
:::

<div id="setting-type-mapping"></div>

| Setting Kind   | Type parameter `T`    |
| -------------- |-----------------------|
| On/Off Toggle  | `boolean` / `Boolean` |
| Text           | `String`              |
| Whole Number   | `int` / `Integer`     |
| Decimal Number | `double` / `Double`   |

It's important to note that providing any other type for the type parameter will result in an `IllegalArgumentException`.

If you specify an allowed type but it mismatches the setting kind, an error message will be logged and `defaultValue` will be returned.


## Anatomy of `getValueAsync()`

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `classOfT`     | **REQUIRED.** The type of the setting.                                                                       |
| `key`          | **REQUIRED.** Setting-specific key. Set on _ConfigCat Dashboard_ for each setting.                           |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](/advanced/targeting) |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |

```java
client.getValueAsync(
    Boolean.class, // Setting type
    "keyOfMySetting", // Setting Key
    User.newBuilder().build("#UNIQUE-USER-IDENTIFIER#"), // Optional User Object
    false // Default value
).thenAccept(isMyAwesomeFeatureEnabled -> {
    if(isMyAwesomeFeatureEnabled) {
        doTheNewThing();
    } else {
        doTheOldThing();
    }
});
```

:::caution
It is important to provide an argument for the `classOfT` parameter, specifically for the `T` generic type parameter,
that matches the type of the feature flag or setting you are evaluating. Please refer to [this table](#setting-type-mapping) for the corresponding types.
:::


## Anatomy of `getValueDetails()`

`getValueDetails()` is similar to `getValue()` but instead of returning the evaluated value only, it gives more detailed information about the evaluation result.

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `classOfT`     | **REQUIRED.** The type of the setting.                                                                       |
| `key`          | **REQUIRED.** Setting-specific key. Set on _ConfigCat Dashboard_ for each setting.                           |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](/advanced/targeting) |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |

```java
EvaluationDetails<Boolean> details = client.getValueDetails(
    Boolean.class, // Setting type
    "keyOfMySetting", // Setting Key
    User.newBuilder().build("#UNIQUE-USER-IDENTIFIER#"), // Optional User Object
    false // Default value
);
// Or asynchronously
client.getValueDetailsAsync(
    Boolean.class, // Setting type
    "keyOfMySetting", // Setting Key
    User.newBuilder().build("#UNIQUE-USER-IDENTIFIER#"), // Optional User Object
    false // Default value
).thenAccept(details -> {
    // Use the details result
});
```

:::caution
It is important to provide an argument for the `classOfT` parameter, specifically for the `T` generic type parameter,
that matches the type of the feature flag or setting you are evaluating. Please refer to [this table](#setting-type-mapping) for the corresponding types.
:::

The details result contains the following information:

| Property                           | Type                                    | Description                                                                                                |
|------------------------------------|-----------------------------------------|------------------------------------------------------------------------------------------------------------|
| `getValue()`                       | `boolean` / `String` / `int` / `double` | The evaluated value of the feature flag or setting.                                                        |
| `getKey()`                         | `String`                                | The key of the evaluated feature flag or setting.                                                          |
| `isDefaultValue()`                 | `boolean`                               | True when the default value passed to getValueDetails() is returned due to an error.                       |
| `getError()`                       | `String`                                | In case of an error, this field contains the error message.                                                |
| `getUser()`                        | `User`                                  | The User Object that was used for evaluation.                                                              |
| `getMatchedPercentageOption()`     | `PercentageOption`                      | The Percentage Option (if any) that was used to select the evaluated value.                                |
| `getMatchedTargetingRule()`        | `TargetingRule`                         | The Targeting Rule (if any) that matched during the evaluation and was used to return the evaluated value. |
| `getFetchTimeUnixMilliseconds()`   | `long`                                  | The last download time of the current config in unix milliseconds format.                                  |

## User Object

The [User Object](/advanced/user-object) is essential if you'd like to use ConfigCat's [Targeting](/advanced/targeting) feature.

```java
User user = User.newBuilder().build("#UNIQUE-USER-IDENTIFIER#");
```

```java
User user = User.newBuilder().build("john@example.com");
```

| Builder options | Description                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier()`  | **REQUIRED.** Unique identifier of a user in your application. Can be any value, even an email address.                         |
| `email()`       | Optional parameter for easier Targeting Rule definitions.                                                                       |
| `country()`     | Optional parameter for easier Targeting Rule definitions.                                                                       |
| `custom()`      | Optional dictionary for custom attributes of a user for advanced Targeting Rule definitions. e.g. User role, Subscription type. |

```java
java.util.Map<String,Object> customAttributes = new java.util.HashMap<String,Object>();
    customAttributes.put("SubscriptionType", "Pro");
    customAttributes.put("UserRole", "Admin");

User user = User.newBuilder()
    .email("john@example.com")
    .country("United Kingdom")
    .custom(customAttributes)
    .build("#UNIQUE-USER-IDENTIFIER#");
```

The `Custom` dictionary also allows attribute values other than `String` values:

```java
java.util.Map<String,Object> customAttributes = new java.util.HashMap<String,Object>();
    customAttributes.put("Rating", 4.5);
    customAttributes.put("RegisteredAt", new Date("2023-11-22 12:34:56 +00:00"));
    customAttributes.put("Roles", new String[]{"Role1", "Role2"});

User user = User.newBuilder()
    .email("john@example.com")
    .country("United Kingdom")
    .custom(customAttributes)
    .build("#UNIQUE-USER-IDENTIFIER#");
```
### User Object Attribute Types

All comparators support `String` values as User Object attribute (in some cases they need to be provided in a specific format though, see below), but some of them also support other types of values. It depends on the comparator how the values will be handled. The following rules apply:

**Text-based comparators** (EQUALS, IS ONE OF, etc.)
* accept `String` values,
* all other values are automatically converted to `String` (a warning will be logged but evaluation will continue as normal).

**SemVer-based comparators** (IS ONE OF, &lt;, &gt;=, etc.)
* accept `String` values containing a properly formatted, valid semver value,
* all other values are considered invalid (a warning will be logged and the currently evaluated Targeting Rule will be skipped).

**Number-based comparators** (=, &lt;, &gt;=, etc.)
* accept `Double` values and all other numeric values which can safely be converted to `Double`,
* accept `String` values containing a properly formatted, valid `Double` value,
* all other values are considered invalid (a warning will be logged and the currently evaluated Targeting Rule will be skipped).

**Date time-based comparators** (BEFORE / AFTER)
* accept `Date` or `Instant` values, which are automatically converted to a second-based Unix timestamp,
* accept `Double` values representing a second-based Unix timestamp and all other numeric values which can safely be converted to `Double`,
* accept `String` values containing a properly formatted, valid `Double` value,
* all other values are considered invalid (a warning will be logged and the currently evaluated Targeting Rule will be skipped).

**String array-based comparators** (ARRAY CONTAINS ANY OF / ARRAY NOT CONTAINS ANY OF)
* accept arrays and list of `String`,
* accept `String` values containing a valid JSON string which can be deserialized to an array of `String`,
* all other values are considered invalid (a warning will be logged and the currently evaluated Targeting Rule will be skipped).



### Default User

There's an option to set a default User Object that will be used at feature flag and setting evaluation. It can be useful when your application has a single user only, or rarely switches users.

You can set the default User Object either with the ConfigCatClient builder:

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.mode(PollingModes.manualPoll());
    options.baseUrl(server.url("/").toString());
    options.defaultUser(User.newBuilder().build("john@example.com"));
});
```

or with the `setDefaultUser()` method of the ConfigCat client.

```java
client.setDefaultUser(User.newBuilder().build("john@example.com"));
```

Whenever the `getValue()`, `getValueDetails()`, `getAllValues()`, or `getAllValueDetails()` methods are called without an explicit `user` parameter, the SDK will automatically use the default user as a User Object.

```java
client.setDefaultUser(User.newBuilder().build("john@example.com"));
// The default user will be used at the evaluation process.
boolean value = client.getValue(Boolean.class, "keyOfMySetting", false);
```

When the `user` parameter is specified on the requesting method, it takes precedence over the default user.

```java
client.setDefaultUser(User.newBuilder().build("john@example.com"));

User otherUser = User.newBuilder().build("user");
// otherUser will be used at the evaluation process.
boolean value =  client.getValue(Boolean.class, "keyOfMySetting", false, otherUser);
```

For deleting the default user, you can do the following:

```java
client.clearDefaultUser();
```

## Polling Modes

The _ConfigCat SDK_ supports 3 different polling mechanisms to acquire the setting values from _ConfigCat_. After latest setting values are downloaded, they are stored in the internal cache then all `getValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.  
[More about polling modes.](/advanced/caching/)

### Auto polling (default)

The _ConfigCat SDK_ downloads the latest values and stores them automatically every 60 seconds.

Use the the `autoPollIntervalInSeconds` option parameter of the `PollingModes.autoPoll()` to change the polling interval.

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.pollingMode(PollingModes.autoPoll(60 /* polling interval in seconds */));
});
```

Available options:

| Option Parameter            | Description                                                                                         | Default |
| --------------------------- | --------------------------------------------------------------------------------------------------- | ------- |
| `autoPollIntervalInSeconds` | Polling interval.                                                                                   | 60      |
| `maxInitWaitTimeSeconds`    | Maximum waiting time between the client initialization and the first config acquisition in seconds. | 5       |

### Lazy Loading

When calling `getValue()` the _ConfigCat SDK_ downloads the latest setting values if they are not present or expired in the cache. In this case the `getValue()` will return the setting value after the cache is updated.

Use the `cacheRefreshIntervalInSeconds` option parameter of the `PollingModes.lazyLoad()` to set cache lifetime.

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
        options.pollingMode(PollingModes.lazyLoad(60 /* the cache will expire in 120 seconds */));
});
```

If you set the `asyncRefresh` to `false`, the refresh operation will be awaited until the downloading of the new configuration is completed.

Available options:

| Option Parameter                | Description | Default |
| ------------------------------- | ----------- | ------- |
| `cacheRefreshIntervalInSeconds` | Cache TTL.  | 60      |

### Manual Polling

Manual polling gives you full control over when the `config JSON` (with the setting values) is downloaded. ConfigCat SDK will not update them automatically. Calling `forceRefresh()` is your application's responsibility.

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options ->{
        options.pollingMode(PollingModes.manualPoll());
});

client.forceRefresh();
```

> `getValue()` returns `defaultValue` if the cache is empty. Call `forceRefresh()` to update the cache.

## Hooks

With the following hooks you can subscribe to particular events fired by the SDK:

- `onClientReady()`: This event is sent when the SDK reaches the ready state. If the SDK is configured with lazy load or manual polling it's considered ready right after instantiation.
  If it's using auto polling, the ready state is reached when the SDK has a valid config JSON loaded into memory either from cache or from HTTP. If the config couldn't be loaded neither from cache nor from HTTP the `onClientReady` event fires when the auto polling's `maxInitWaitTimeSeconds` is reached.

- `onConfigChanged(Map<String, Setting>)`: This event is sent when the SDK loads a valid config JSON into memory from cache, and each subsequent time when the loaded config JSON changes via HTTP.

- `onFlagEvaluated(EvaluationDetails)`: This event is sent each time when the SDK evaluates a feature flag or setting. The event sends the same evaluation details that you would get from [`getValueDetails()`](#anatomy-of-getvaluedetails).

- `onError(String)`: This event is sent when an error occurs within the ConfigCat SDK.

You can subscribe to these events either on SDK initialization:

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.hooks().addOnFlagEvaluated(details -> {
        /* handle the event */
    });
});
```

or with the `getHooks()` property of the ConfigCat client:

```java
client.getHooks().addOnFlagEvaluated(details -> {
    /* handle the event */
});
```

## Online / Offline mode

In cases when you'd want to prevent the SDK from making HTTP calls, you can put it in offline mode:

```java
client.setOffline();
```

In offline mode, the SDK won't initiate HTTP requests and will work only from its cache.

To put the SDK back in online mode, you can do the following:

```java
client.setOnline();
```

> With `client.isOffline()` you can check whether the SDK is in offline mode.

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local only** (`OverrideBehaviour.LOCAL_ONLY`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour.LOCAL_OVER_REMOTE`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour.REMOTE_OVER_LOCAL`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can load your feature flag & setting overrides from a file or from a simple `Map<String, Object>` structure.

### JSON File

The SDK can load your feature flag & setting overrides from a file or classpath resource.
You can also specify whether the file should be reloaded when it gets modified.

#### File

```java
ConfigCatClient client = ConfigCatClient.get("localhost", options -> {
    options.flagOverrides(OverrideDataSourceBuilder.localFile(
            "path/to/the/local_flags.json", // path to the file
            true // reload the file when it gets modified
        ),
        OverrideBehaviour.LOCAL_ONLY
    );
});
```

#### Classpath Resource

```java
ConfigCatClient client = ConfigCatClient.get("localhost", options -> {
    options.flagOverrides(OverrideDataSourceBuilder.classPathResource(
            "local_flags.json", // name of the resource
            true // reload the resource when it gets modified
        ),
        OverrideBehaviour.LOCAL_ONLY
    );
});
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

You can download your current config JSON from ConfigCat's CDN and use it as a baseline.

<Tabs groupId="config-json-format">
<TabItem value="config-json-v6" label="When using an SDK version v9.0.0 or newer">

A convenient way to get the config JSON for a specific SDK Key is to install the [ConfigCat CLI](https://github.com/configcat/cli) tool
and execute the following command:

```bash
configcat config-json get -f v6 -p {YOUR-SDK-KEY} > config.json
```

(Depending on your [Data Governance](/advanced/data-governance) settings, you may need to add the `--eu` switch.)

Alternatively, you can download the config JSON manually, based on your [Data Governance](/advanced/data-governance) settings:

- GLOBAL: `https://cdn-global.configcat.com/configuration-files/{YOUR-SDK-KEY}/config_v6.json`
- EU: `https://cdn-eu.configcat.com/configuration-files/{YOUR-SDK-KEY}/config_v6.json`

```json
{
  "p": {
    // hash salt, required only when confidential text comparator(s) are used
    "s": "80xCU/SlDz1lCiWFaxIBjyJeJecWjq46T4eu6GtozkM="
  },
  "s": [ // array of segments
    {
      "n": "Beta Users", // segment name
      "r": [ // array of User Conditions (there is a logical AND relation between the elements)
        {
          "a": "Email", // comparison attribute
          "c": 0, // comparator (see below)
          "l": [ // comparison value (see below)
            "john@example.com", "jane@example.com"
          ]
        }
      ]
    }
  ],
  "f": { // key-value map of feature flags & settings
    "isFeatureEnabled": { // key of a particular flag / setting
      "t": 0, // setting type, possible values:
              // 0 -> on/off setting (feature flag)
              // 1 -> text setting
              // 2 -> whole number setting
              // 3 -> decimal number setting
      "r": [ // array of Targeting Rules (there is a logical OR relation between the elements)
        {
          "c": [ // array of conditions (there is a logical AND relation between the elements)
            {
              "u": { // User Condition
                "a": "Email", // comparison attribute
                "c": 2, // comparator, possible values and required comparison value types:
                        // 0  -> IS ONE OF (cleartext) + string array comparison value ("l")
                        // 1  -> IS NOT ONE OF (cleartext) + string array comparison value ("l")
                        // 2  -> CONTAINS ANY OF (cleartext) + string array comparison value ("l")
                        // 3  -> NOT CONTAINS ANY OF (cleartext) + string array comparison value ("l")
                        // 4  -> IS ONE OF (semver) + semver string array comparison value ("l")
                        // 5  -> IS NOT ONE OF (semver) + semver string array comparison value ("l")
                        // 6  -> < (semver) + semver string comparison value ("s")
                        // 7  -> <= (semver + semver string comparison value ("s")
                        // 8  -> > (semver) + semver string comparison value ("s")
                        // 9  -> >= (semver + semver string comparison value ("s")
                        // 10 -> = (number) + number comparison value ("d")
                        // 11 -> <> (number + number comparison value ("d")
                        // 12 -> < (number) + number comparison value ("d")
                        // 13 -> <= (number + number comparison value ("d")
                        // 14 -> > (number) + number comparison value ("d")
                        // 15 -> >= (number) + number comparison value ("d")
                        // 16 -> IS ONE OF (hashed) + string array comparison value ("l")
                        // 17 -> IS NOT ONE OF (hashed) + string array comparison value ("l")
                        // 18 -> BEFORE (UTC datetime) + second-based Unix timestamp number comparison value ("d")
                        // 19 -> AFTER (UTC datetime) + second-based Unix timestamp number comparison value ("d")
                        // 20 -> EQUALS (hashed) + string comparison value ("s")
                        // 21 -> NOT EQUALS (hashed) + string comparison value ("s")
                        // 22 -> STARTS WITH ANY OF (hashed) + string array comparison value ("l")
                        // 23 -> NOT STARTS WITH ANY OF (hashed) + string array comparison value ("l")
                        // 24 -> ENDS WITH ANY OF (hashed) + string array comparison value ("l")
                        // 25 -> NOT ENDS WITH ANY OF (hashed) + string array comparison value ("l")
                        // 26 -> ARRAY CONTAINS ANY OF (hashed) + string array comparison value ("l")
                        // 27 -> ARRAY NOT CONTAINS ANY OF (hashed) + string array comparison value ("l")
                        // 28 -> EQUALS (cleartext) + string comparison value ("s")
                        // 29 -> NOT EQUALS (cleartext) + string comparison value ("s")
                        // 30 -> STARTS WITH ANY OF (cleartext) + string array comparison value ("l")
                        // 31 -> NOT STARTS WITH ANY OF (cleartext) + string array comparison value ("l")
                        // 32 -> ENDS WITH ANY OF (cleartext) + string array comparison value ("l")
                        // 33 -> NOT ENDS WITH ANY OF (cleartext + string array comparison value ("l")
                        // 34 -> ARRAY CONTAINS ANY OF (cleartext) + string array comparison value ("l")
                        // 35 -> ARRAY NOT CONTAINS ANY OF (cleartext) + string array comparison value ("l")
                "l": [ // comparison value - depending on the comparator, another type of value may need
                       // to be specified (see above):
                       // "s": string
                       // "d": number
                  "@example.com"
                ]
              }
            },
            {
              "p": { // Flag Condition (Prerequisite)
                "f": "mainIntFlag", // key of prerequisite flag
                "c": 0, // comparator, possible values: 0 -> EQUALS, 1 -> NOT EQUALS
                "v": { // comparison value (value's type must match the prerequisite flag's type)
                  "i": 42
                }
              }
            },
            {
              "s": { // Segment Condition
                "s": 0, // segment index, a valid index into the top-level segment array ("s")
                "c": 1 // comparator, possible values: 0 -> IS IN SEGMENT, 1 -> IS NOT IN SEGMENT
              }
            }
          ],
          "s": { // alternatively, an array of Percentage Options ("p", see below) can also be specified
            "v": { // the value served when the rule is selected during evaluation
              "b": true
            },
            "i": "bcfb84a7"
          }
        }
      ],
      "p": [ // array of Percentage Options
        {
          "p": 10, // % value
          "v": { // the value served when the Percentage Option is selected during evaluation
            "b": true
          },
          "i": "bcfb84a7"
        },
        {
          "p": 90,
          "v": {
            "b": false
          },
          "i": "bddac6ae"
        }
      ],
      "v": { // fallback value, served when none of the Targeting Rules match,
             // no Percentage Options are defined or evaluation of these is not possible
        "b": false // depending on the setting type, another type of value may need to be specified:
                   // text setting -> "s": string
                   // whole number setting -> "i": number
                   // decimal number setting -> "d": number
      },
      "i": "430bded3" // variation id (for analytical purposes)
    }
  }
}
```

For a more comprehensive specification of the config JSON v6 format, you may refer to [this JSON schema document](https://github.com/configcat/config-json/blob/main/V6/config.schema.json).

</TabItem>
<TabItem value="config-json-v5" label="When using an SDK version older than v9.0.0">

A convenient way to get the config JSON for a specific SDK Key is to install the [ConfigCat CLI](https://github.com/configcat/cli) tool
and execute the following command:

```bash
configcat config-json get -f v5 -p {YOUR-SDK-KEY} > config.json
```

(Depending on your [Data Governance](/advanced/data-governance) settings, you may need to add the `--eu` switch.)

Alternatively, you can download the config JSON manually, based on your [Data Governance](/advanced/data-governance) settings:
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
</TabItem>
</Tabs>

### Map

You can set up the SDK to load your feature flag & setting overrides from a `Map<String, Object>`.

```java
Map<String, Object> map = new HashMap<>();
map.put("enabledFeature", true);
map.put("disabledFeature", false);
map.put("intSetting", 5);
map.put("doubleSetting", 3.14);
map.put("stringSetting", "test");

ConfigCatClient client = ConfigCatClient.get("localhost", options -> {
        options.flagOverrides(OverrideDataSourceBuilder.map(map), OverrideBehaviour.LOCAL_ONLY)
});
```

## `getAllKeys()`, `getAllKeysAsync()`

You can query the keys of each feature flag and setting with the `getAllKeys()` or `getAllKeysAsync()` method.

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#");
java.util.Collection<String> keys = client.getAllKeys();
```

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#");
client.getAllKeysAsync().thenAccept(keys -> {
});
```

## `getAllValues()`, `getAllValuesAsync()`

Evaluates and returns the values of all feature flags and settings. Passing a User Object is optional.

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#");
Map<String, Object> settingValues = client.getAllValues();

// invoke with User Object
User user = User.newBuilder().build("#UNIQUE-USER-IDENTIFIER#")
Map<String, Object> settingValuesTargeting = client.getAllValues(user);
```

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#");
client.getAllValuesAsync().thenAccept(settingValues -> { });

// invoke with User Object
User user = User.newBuilder().build("#UNIQUE-USER-IDENTIFIER#")
client.getAllValuesAsync(user).thenAccept(settingValuesTargeting -> { });
```

## `getAllValueDetails()`, `getAllValueDetailsAsync()`

Evaluates and returns the detailed values of all feature flags and settings. Passing a User Object is optional.

```java
User user = User.newBuilder().build("#UNIQUE-USER-IDENTIFIER#");

ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#");
List<EvaluationDetails<Object>> allValueDetails = client.getAllValueDetails(user);
```

```java
User user = User.newBuilder().build("#UNIQUE-USER-IDENTIFIER#");

ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#");
client.getAllValueDetailsAsync(user).thenAccept(allValueDetails -> { });
```

## Custom Cache

The _ConfigCat SDK_ stores the downloaded config data in a local cache to minimize network traffic and enhance client performance.
If you prefer to use your own cache solution, such as an external or distributed cache in your system,
you can subclass the [`ConfigCache`](https://github.com/configcat/java-sdk/blob/master/src/main/java/com/configcat/ConfigCache.java) abstract class
and call the `cache` method with your implementation in the setup callback of `ConfigCatClient.get`.
This allows you to seamlessly integrate ConfigCat with your existing caching infrastructure.

```java
public class MyCustomCache extends ConfigCache {

    @Override
    public String read(String key) {
        // here you have to return with the cached value
    }

    @Override
    public void write(String key, String value) {
        // here you have to store the new value in the cache
    }
}
```

Then use your custom cache implementation:

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.cache(new MyCustomCache()) // inject your custom cache
});
```

:::info
The Java SDK supports *shared caching*. You can read more about this feature and the required minimum SDK versions [here](/docs/advanced/caching/#shared-cache).
:::

## HttpClient

The ConfigCat SDK internally uses an <a href="https://github.com/square/okhttp" target="_blank">OkHttpClient</a> instance to download the latest configuration over HTTP. You have the option to override the internal Http client with your customized one.

### HTTP Proxy

If your application runs behind a proxy you can do the following:

```java
import java.net.InetSocketAddress;
import java.net.Proxy;

Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("proxyHost", proxyPort));

ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.httpClient(new OkHttpClient.Builder()
            .proxy(proxy)
            .build())
});
```

### HTTP Timeout

You can set the maximum wait time for a ConfigCat HTTP response by using OkHttpClient's timeouts.

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.httpClient(new OkHttpClient.Builder()
            .readTimeout(2, TimeUnit.SECONDS) // set the read timeout to 2 seconds
            .build())
});
```

OkHttpClient's default timeout is 10 seconds.

> As the ConfigCatClient SDK maintains the whole lifetime of the internal http client, it's being closed simultaneously with the ConfigCatClient, refrain from closing the http client manually.

## Force refresh

Call the `forceRefresh()` method on the client to download the latest config JSON and update the cache.

## Logging

As the SDK uses the facade of [slf4j](https://www.slf4j.org) for logging, so you can use any of the slf4j implementation packages.

```
dependencies {
    compile group: 'org.slf4j', name: 'slf4j-simple', version: '1.+'
}
```

You can change the verbosity of the logs by passing a `LogLevel` parameter to the ConfigCatClientBuilder's `logLevel` function.

```java
ConfigCatClient client = ConfigCatClient.get("#YOUR-SDK-KEY#", options -> {
    options.logLevel(LogLevel.INFO);
});
```

Available log levels:

| Level     | Description                                                                             |
| --------- | --------------------------------------------------------------------------------------- |
| `NO_LOG`  | Turn the logging off.                                                                   |
| `ERROR`   | Only error level events are logged.                                                     |
| `WARNING` | Default. Errors and Warnings are logged.                                                |
| `INFO`    | Errors, Warnings and feature flag evaluation is logged.                                 |
| `DEBUG`   | All of the above plus debug info is logged. Debug logs can be different for other SDKs. |

Info level logging helps to inspect how a feature flag was evaluated:

```bash
INFO com.configcat.ConfigCatClient - [5000] Evaluating 'isPOCFeatureEnabled' for User '{"Identifier":"<SOME USERID>","Email":"configcat@example.com","Country":"US","SubscriptionType":"Pro","Role":"Admin","version":"1.0.0"}'
  Evaluating targeting rules and applying the first match if any:
  - IF User.Email CONTAINS ANY OF ['@something.com'] THEN 'False' => no match
  - IF User.Email CONTAINS ANY OF ['@example.com'] THEN 'True' => MATCH, applying rule
  Returning 'True'.
```

### Logging Implementation

You have the flexibility to use any slf4j implementation for logging with ConfigCat. However, some logger implementations may not display debug level messages by default. In these cases, you simply need to adjust the logger configuration to receive all log messages from the ConfigCat SDK.

Examples fo <a href="https://github.com/configcat/java-sdk/blob/master/samples/console/src/main/resources/simplelogger.properties" target="_blank">slf4j-simple</a> and <a href="https://github.com/configcat/java-sdk/blob/master/samples/web/src/main/resources/logback.xml" target="_blank">logback</a> are available under the [Sample Apps](#sample-apps) section.

## Sample Apps

Check out our Sample Applications how they use the ConfigCat SDK

- <a href="https://github.com/ConfigCat/java-sdk/tree/master/samples/console" target="_blank">Simple Console Application</a>
- <a href="https://github.com/ConfigCat/java-sdk/tree/master/samples/web" target="_blank">Spring Boot Web Application</a>

## Guides

See <a href="https://configcat.com/blog/2022/10/28/using-feature-flags-in-java/" target="_blank">this</a> guide on how to use ConfigCat's Java SDK.

## Look Under the Hood

- <a href="https://github.com/ConfigCat/java-sdk" target="_blank">ConfigCat Java SDK's repository on GitHub</a>
- <a href="https://javadoc.io/doc/com.configcat/configcat-java-client" target="_blank">ConfigCat Java SDK's javadoc page</a>
- <a href="https://search.maven.org/artifact/com.configcat/configcat-java-client" target="_blank">ConfigCat Java SDK on Maven Central</a>