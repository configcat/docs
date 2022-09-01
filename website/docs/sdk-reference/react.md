---
id: "react"
title: React SDK Reference
description: ConfigCat React SDK Reference. This is a step-by-step guide on how to use feature flags in your React applications.
---
[![Star on GitHub](https://img.shields.io/github/stars/configcat/react-sdk.svg?style=social)](https://github.com/configcat/react-sdk/stargazers)
[![REACT CI](https://github.com/configcat/react-sdk/actions/workflows/react-ci.yml/badge.svg)](https://github.com/configcat/react-sdk/actions/workflows/react-ci.yml)
[![codecov](https://codecov.io/gh/configcat/react-sdk/branch/main/graph/badge.svg?token=X9kFVT7xXL)](https://codecov.io/gh/configcat/react-sdk)
[![Known Vulnerabilities](https://snyk.io/test/github/configcat/react-sdk/badge.svg?targetFile=package.json)](https://snyk.io/test/github/configcat/react-sdk?targetFile=package.json) 
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=configcat_react-sdk&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=configcat_react-sdk) 
[![JSDELIVR](https://data.jsdelivr.com/v1/package/npm/configcat-react/badge)](https://www.jsdelivr.com/package/npm/configcat-react)  

<a href="https://github.com/configcat/react-sdk" target="_blank">ConfigCat React SDK on GitHub</a>

## Getting started

### 1. Install package

*via [NPM package](https://npmjs.com/package/configcat-react):*
```bash
npm i configcat-react
```

### 2. Import and initialize a `ConfigCatProvider` with your SDK Key

In most cases you should wrap your root component with `ConfigCatProvider` to access ConfigCat features in child components with Context API.

```tsx
import React from "react";
import { ConfigCatProvider } from "configcat-react";

function App() {
  return (
    <ConfigCatProvider sdkKey="#YOUR_SDK_KEY#">
      {/* your application code */}
    </ConfigCatProvider>
  );
}

export default App;
```

### 3. Get your setting value

The React hooks (`useFeatureFlag`) way:
```tsx
function ButtonComponent() {
  const { value: isAwesomeFeatureEnabled, loading } = useFeatureFlag("isAwesomeFeatureEnabled", false);

  return loading ? (<div>Loading...</div>) : (
    <div>Feature flag value: {isAwesomeFeatureEnabled ? 'ON' : 'OFF'}</div>
  );
}
```

The React HOC (`WithConfigCatClientProps`) way:
```tsx
class TestHOCComponent extends React.Component<
    WithConfigCatClientProps,
    { isAwesomeFeatureEnabled: string }
> {
    constructor(props: WithConfigCatClientProps) {
        super(props);

        this.state = { isAwesomeFeatureEnabled: false, loading: true };
    }

    componentDidMount() {
        this.evaluateFeatureFlag();
    }

    componentDidUpdate(prevProps: any) {
      // To achieve hot reload on config.json updates.
      if (prevProps?.lastUpdated !== this.props.lastUpdated) {
        this.evaluateFeatureFlag();
      }
    }

    evaluateFeatureFlag(){
        this.props
            .getValue("isAwesomeFeatureEnabled", false)
            .then((v: boolean) => this.setState({ isAwesomeFeatureEnabled: v, loading: false }));
    }
    
    render() {
        return loading ? (<div>Loading...</div>) : (
            <div>Feature flag value: {this.state.isAwesomeFeatureEnabled ? 'ON' : 'OFF'}</div>
        );
    }
}
```

## Creating the *ConfigCat* Client

*ConfigCat Client* is responsible for:
- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`<ConfigCatProvider sdkKey="#YOUR_SDK_KEY#"  pollingMode={PollingMode.AutoPoll} options={{ ... }}>` initializes a client.

| Properties | Description                                                                                               | Default |
| ---------- | --------------------------------------------------------------------------------------------------------- | --- |
| `sdkKey`   | **REQUIRED.** SDK Key to access your feature flags and configurations. Get it from *ConfigCat Dashboard*. | - |
| `pollingMode`  | Optional. [More about polling modes](#polling-modes). | `PollingMode.AutoPoll` |
| `options`  | Optional.  [More about polling options](#polling-modes). | - |

## Anatomy of `useFeatureFlag()`

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```tsx
function ButtonComponent() {
  const { value: isAwesomeFeatureEnabled, loading } = useFeatureFlag("isAwesomeFeatureEnabled", false);

  return loading ? (<div>Loading...</div>) : (
    <div>Feature flag value: {isAwesomeFeatureEnabled ? 'ON' : 'OFF'}</div>
  );
}
```

## Anatomy of `WithConfigCatClientProps.getValue()`

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on *ConfigCat Dashboard* for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, *User Object*. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```tsx
class TestHOCComponent extends React.Component<
    WithConfigCatClientProps,
    { isAwesomeFeatureEnabled: string }
> {
    constructor(props: WithConfigCatClientProps) {
        super(props);

        this.state = { isAwesomeFeatureEnabled: false, loading: true };
    }

    componentDidMount() {
        this.evaluateFeatureFlag();
    }

    componentDidUpdate(prevProps: any) {
      // To achieve hot reload on config.json updates.
      if (prevProps?.lastUpdated !== this.props.lastUpdated) {
        this.evaluateFeatureFlag();
      }
    }

    evaluateFeatureFlag(){
        this.props
            .getValue("isAwesomeFeatureEnabled", false)
            .then((v: boolean) => this.setState({ isAwesomeFeatureEnabled: v, loading: false }));
    }
    
    render() {
        return loading ? (<div>Loading...</div>) : (
            <div>Feature flag value: {this.state.isAwesomeFeatureEnabled ? 'ON' : 'OFF'}</div>
        );
    }
}
```

## User Object

The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature. 
For simple targeting:
```tsx
var userObject = {
    identifier : "435170f4-8a8b-4b67-a723-505ac7cdea92"
};   
```
or
```tsx
var userObject = {
    identifier : "john@example.com"
};   
```

| Parameters   | Description                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier` | **REQUIRED.** Unique identifier of a user in your application. Can be any `string` value, even an email address.                |
| `email`      | Optional parameter for easier targeting rule definitions.                                                                       |
| `country`    | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom`     | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |

For advanced targeting:
```tsx
var userObject = {
    identifier : "435170f4-8a8b-4b67-a723-505ac7cdea92",
    email : "john@example.com",
    country : "United Kingdom",
    custom : {
        "SubscriptionType": "Pro",
        "UserRole": "Admin"
    }
};
```

```tsx
function ButtonComponent() {
  const { value: isAwesomeFeatureEnabled, loading } = useFeatureFlag("isAwesomeFeatureEnabled", false, userObject);

  return loading ? (<div>Loading...</div>) : (
    <div>Feature flag value: {isAwesomeFeatureEnabled ? 'ON' : 'OFF'}</div>
  );
}
```

## Polling Modes

The *ConfigCat SDK* supports 3 different polling mechanisms to acquire the setting values from *ConfigCat*. After latest setting values are downloaded, they are stored in the internal cache then all `getValue()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.  
[More about polling modes.](/advanced/caching/)

### Auto polling (default)

The *ConfigCat SDK* downloads the latest values and stores them automatically every 60 seconds.

#### Initialization

```html
<ConfigCatProvider sdkKey="YOUR_SDK_KEY", options={{...}})>
    ...
</ConfigCatProvider>
```
or
```html
<ConfigCatProvider sdkKey="YOUR_SDK_KEY", pollingMode={PollingMode.AutoPoll} options={{...}})>
    ...
</ConfigCatProvider>
```

| Option Parameter      | Description                                                                                                                | Default        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `pollIntervalSeconds` | Polling interval. Range: `1 - Number.MAX_SAFE_INTEGER`                                                                     | 60             |
| `configChanged`       | Callback to get notified about changes.                                                                                    | -              |
| `logger`              | Custom logger. See below for details.                                                                                      | Console logger |
| `requestTimeoutMs`    | The amount of milliseconds the SDK waits for a response from the ConfigCat servers before returning values from the cache. | 30000          |
| `dataGovernance`      | Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `DataGovernance.Global`, `DataGovernance.EuOnly`. | `DataGovernance.Global` |
| `maxInitWaitTimeSeconds` | Maximum waiting time between the client initialization and the first config acquisition in seconds.                     | 5              |
| `flagOverrides`       | Local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides).                              | -              |

Use the `pollIntervalSeconds` option parameter to change the polling interval.
```html
<ConfigCatProvider sdkKey="YOUR_SDK_KEY", pollingMode={PollingMode.AutoPoll} options={{ pollIntervalSeconds: 95 }})>
    ...
</ConfigCatProvider>
```

### Lazy loading

When calling `useFeatureFlag()` or `WithConfigCatClientProps.getValue()` the *ConfigCat SDK* downloads the latest setting values if they are not present or expired in the cache. 

#### Initialization

```html
<ConfigCatProvider sdkKey="YOUR_SDK_KEY", pollingMode={PollingMode.LazyLoad} options={{...}})>
    ...
</ConfigCatProvider>
```

| Option Parameter         | Description                                                                                                                | Default        |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `cacheTimeToLiveSeconds` | Cache TTL. Range: `1 - Number.MAX_SAFE_INTEGER`                                                                            | 60             |
| `logger`                 | Custom logger. See below for details.                                                                                      | Console logger |
| `requestTimeoutMs`       | The amount of milliseconds the SDK waits for a response from the ConfigCat servers before returning values from the cache. | 30000          |
| `dataGovernance` | Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `DataGovernance.Global`, `DataGovernance.EuOnly`. | `DataGovernance.Global` |
| `flagOverrides`       | Local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides).                                 | -              |


Use `cacheTimeToLiveSeconds` option parameter to set cache lifetime.

```html
<ConfigCatProvider sdkKey="YOUR_SDK_KEY", pollingMode={PollingMode.LazyLoad} options={{cacheTimeToLiveSeconds: 600}})>
    ...
</ConfigCatProvider>
```

### Manual polling
Manual polling gives you full control over when the `config.json` (with the setting values) is downloaded. *ConfigCat SDK* will not update them automatically. Calling `forceRefresh()` or `forceRefreshAsync()` is your application's responsibility.

#### Initialization

| Option Parameter   | Description                                                                                                                | Default        |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `logger`           | Custom logger. See below for details.                                                                                      | Console logger |
| `requestTimeoutMs` | The amount of milliseconds the SDK waits for a response from the ConfigCat servers before returning values from the cache. | 30000          |
| `dataGovernance` | Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `DataGovernance.Global`, `DataGovernance.EuOnly`. | `DataGovernance.Global` |
| `flagOverrides`       | Local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides).                           | -              |

```html
<ConfigCatProvider sdkKey="YOUR_SDK_KEY", pollingMode={PollingMode.ManualPoll} options={{ ... }})>
    ...
</ConfigCatProvider>
```
```tsx
const client = useConfigCatClient();
useEffect(() => client.forceRefresh(() => { setRefreshed(true) }));
```

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local/Offline mode** (`OverrideBehaviour.LocalOnly`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour.LocalOverRemote`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour.RemoteOverLocal`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can set up the SDK to load your feature flag & setting overrides from a `{ [name: string]: any }` map.
```tsx
const flagOverrides: configcat.createFlagOverridesFromMap({
    enabledFeature: true,
    disabledFeature: false,
    intSetting: 5,
    doubleSetting: 3.14,
    stringSetting: "test"
}, 
configcat.OverrideBehaviour.LocalOnly);
```
```html
<ConfigCatProvider sdkKey="YOUR_SDK_KEY", pollingMode={PollingMode.ManualPoll} options={{flagOverrides}})>
    ...
</ConfigCatProvider>
```

## Logging

### Setting log levels

```tsx
const logger = configcat.createConsoleLogger(3); // Setting log level to 3 (= Info)
```
```html
<ConfigCatProvider sdkKey="YOUR_SDK_KEY", pollingMode={PollingMode.ManualPoll} options={{logger}})>
    ...
</ConfigCatProvider>
```

Available log levels:

| Level | Name  | Description                                             |
| ----- | ----- | ------------------------------------------------------- |
| -1    | Off   | Nothing gets logged.                                    |
| 1     | Error | Only error level events are logged.                     |
| 2     | Warn  | Default. Errors and Warnings are logged.                         |
| 3     | Info  | Errors, Warnings and feature flag evaluation is logged. |
| 4     | Debug | All of the above plus debug info is logged.             |

You can use `LogLevel` enum type from `configcat-common` package:

```
import { LogLevel } from 'configcat-common';

const logger = configcat.createConsoleLogger(LogLevel.Info);
```


Info level logging helps to inspect the feature flag evaluation process:
```bash
ConfigCat - INFO - Evaluate 'isPOCFeatureEnabled'
 User : {"identifier":"#SOME-USER-ID#","email":"configcat@example.com"}
 Evaluating rule: 'configcat@example.com' CONTAINS '@something.com' => no match
 Evaluating rule: 'configcat@example.com' CONTAINS '@example.com' => MATCH
 Returning value : true
```

## Using custom cache implementation

Config's data stored in a cache, it is efficiency increases in retrieval of data and performance of the client. If you would like to use your cache solution (for example your system uses external or distributed cache) you can implement those function and set to `cache` parameters in the setting.

```tsx
function myCustomCache() { }

myCustomCache.prototype.get = function(key) {
    // `key` [string] - a unique cachekey

    // insert here your cache read logic

}

myCustomCache.prototype.set = function(key, item) {
    // `key` [string] - a unique cachekey
    // `item` [object] - configcat's cache config item

    // insert here your cache write logic
}

// set the `myCustomCache` when create a client instance
```
```html
<ConfigCatProvider sdkKey="YOUR_SDK_KEY", pollingMode={PollingMode.ManualPoll} options={{cache: new myCustomCache()}})>
    ...
</ConfigCatProvider>
```


## Sensitive information handling

The frontend/mobile SDKs are running in your users' browsers/devices. The SDK is downloading a [config.json](https://configcat.com/docs/requests/) file from ConfigCat's CDN servers. The URL path for this config.json file contains your SDK key, so the SDK key and the content of your config.json file (feature flag keys, feature flag values, targeting rules, % rules) can be visible to your users. 
This SDK key is read-only, it only allows downloading your config.json file, but nobody can make any changes with it in your ConfigCat account.  
Suppose you don't want your SDK key or the content of your config.json file visible to your users. In that case, we recommend you use the SDK only in your backend applications and call a backend endpoint in your frontend/mobile application to evaluate the feature flags for a specific application customer.  
Also, we recommend using [confidential targeting comparators](https://configcat.com/docs/advanced/targeting/#confidential-text-comparators) in the targeting rules of those feature flags that are used in the frontend/mobile SDKs.


## Sample Application

- <a href="https://github.com/configcat/react-sdk/tree/main/samples/react-sdk-sample" target="_blank">React</a>

## Look under the hood

* <a href="https://github.com/configcat/react-sdk" target="_blank">ConfigCat React SDK on GitHub</a>
* <a href="https://www.npmjs.com/package/configcat-react" target="_blank">ConfigCat React SDK in NPM</a>
