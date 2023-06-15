---
id: 'react'
title: React SDK Reference
description: ConfigCat React SDK Reference. This is a step-by-step guide on how to use feature flags in your React applications.
---

export const ReactSchema = require('@site/src/schema-markup/sdk-reference/react.json');

<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ReactSchema) }}></script>

[![Star on GitHub](https://img.shields.io/github/stars/configcat/react-sdk.svg?style=social)](https://github.com/configcat/react-sdk/stargazers)
[![REACT CI](https://github.com/configcat/react-sdk/actions/workflows/react-ci.yml/badge.svg)](https://github.com/configcat/react-sdk/actions/workflows/react-ci.yml)
[![codecov](https://codecov.io/gh/configcat/react-sdk/branch/main/graph/badge.svg?token=X9kFVT7xXL)](https://codecov.io/gh/configcat/react-sdk)
[![Known Vulnerabilities](https://snyk.io/test/github/configcat/react-sdk/badge.svg?targetFile=package.json)](https://snyk.io/test/github/configcat/react-sdk?targetFile=package.json)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=configcat_react-sdk&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=configcat_react-sdk)
[![JSDELIVR](https://data.jsdelivr.com/v1/package/npm/configcat-react/badge)](https://www.jsdelivr.com/package/npm/configcat-react)

<a href="https://github.com/configcat/react-sdk" target="_blank">ConfigCat React SDK on GitHub</a>

## Getting started

### 1. Install package

_via [NPM package](https://npmjs.com/package/configcat-react):_

```bash
npm i configcat-react
```

### 2. Import and initialize a `ConfigCatProvider` with your SDK Key

In most cases you should wrap your root component with `ConfigCatProvider` to access ConfigCat features in child components with Context API.

```tsx
import React from 'react';
import { ConfigCatProvider } from 'configcat-react';

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
  const { value: isAwesomeFeatureEnabled, loading } = useFeatureFlag('isAwesomeFeatureEnabled', false);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div>Feature flag value: {isAwesomeFeatureEnabled ? 'ON' : 'OFF'}</div>
  );
}
```

The React HOC (`WithConfigCatClientProps`) way:

```tsx
class TestHOCComponent extends React.Component<
  WithConfigCatClientProps,
  { isAwesomeFeatureEnabled: boolean; loading: boolean }
> {
  constructor(props: WithConfigCatClientProps) {
    super(props);

    this.state = { isAwesomeFeatureEnabled: false, loading: true };
  }

  componentDidMount() {
    this.evaluateFeatureFlag();
  }

  componentDidUpdate(prevProps: any) {
    // To achieve hot reload on config JSON updates.
    if (prevProps?.lastUpdated !== this.props.lastUpdated) {
      this.evaluateFeatureFlag();
    }
  }

  evaluateFeatureFlag() {
    this.props
      .getValue('isAwesomeFeatureEnabled', false)
      .then((v: boolean) =>
        this.setState({ isAwesomeFeatureEnabled: v, loading: false }),
      );
  }

  render() {
    return loading ? (
      <div>Loading...</div>
    ) : (
      <div>
        Feature flag value: {this.state.isAwesomeFeatureEnabled ? 'ON' : 'OFF'}
      </div>
    );
  }
}

const ConfigCatTestHOCComponent = withConfigCatClient(TestHOCComponent);
```

## Creating the _ConfigCat_ Client

_ConfigCat Client_ is responsible for:

- managing the communication between your application and ConfigCat servers.
- caching your setting values and feature flags.
- serving values quickly in a failsafe way.

`<ConfigCatProvider sdkKey="#YOUR_SDK_KEY#"  pollingMode={PollingMode.AutoPoll} options={{ ... }}>` initializes a client.

| Attributes    | Description                                                                                                                             | Default                |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `sdkKey`      | **REQUIRED.** SDK Key to access your feature flags and configurations. Get it from _ConfigCat Dashboard_.                               | -                      |
| `pollingMode` | Optional. The polling mode to use to acquire the setting values from the ConfigCat servers. [More about polling modes](#polling-modes). | `PollingMode.AutoPoll` |
| `options`     | Optional. The options object. See the table below.                                                                                      | -                      |

The available options depends on the chosen polling mode. However, there are some common options which can be set in the case of every polling mode:

| Option Parameter   | Description                                                                                                                                                                                                                                                                                      | Default                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| `logger`           | Custom [`IConfigCatLogger`](https://github.com/configcat/common-js/blob/master/src/ConfigCatLogger.ts) implementation for tracing.                                                                                                                                                               | [`ConfigCatConsoleLogger`](https://github.com/configcat/common-js/blob/master/src/ConfigCatLogger.ts) (with WARN level) |
| `requestTimeoutMs` | The amount of milliseconds the SDK waits for a response from the ConfigCat servers before returning values from the cache.                                                                                                                                                                       | 30000                   |
| `baseUrl`          | Sets the CDN base url (forward proxy, dedicated subscription) from where the SDK will download the config JSON.                                                                                                                                                                                  |                         |
| `dataGovernance`   | Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. [More about Data Governance](advanced/data-governance.md). Available options: `DataGovernance.Global`, `DataGovernance.EuOnly`. | `DataGovernance.Global` |
| `cache`            | Custom [`IConfigCatCache`](https://github.com/configcat/common-js/blob/master/src/ConfigCatCache.ts) implementation for caching the downloaded config.                                                                                                                                           | [`InMemoryConfigCache`](https://github.com/configcat/common-js/blob/master/src/ConfigCatCache.ts) |
| `flagOverrides`    | Local feature flag & setting overrides. [More about feature flag overrides](#flag-overrides).                                                                                                                                                                                                    | -                       |
| `defaultUser`      | Sets the default user. [More about default user](#default-user).                                                                                                                                                                                                                                 | `undefined` (none)      |
| `offline`          | Determines whether the client should be initialized to offline mode. [More about offline mode](#online--offline-mode).                                                                                                                                                                           | `false`                 |

Options also include a property named `setupHook`, which you can use to subscribe to the hooks (events) at the time of initialization. [More about hooks](#hooks).

For example:

```tsx
<ConfigCatProvider
  sdkKey="YOUR_SDK_KEY"
  pollingMode={PollingMode.AutoPoll}
  options={{
    setupHooks: (hooks) =>
      hooks.on('clientReady', () => console.log('Client is ready!')),
  }}
>
  ...
</ConfigCatProvider>
```

### Acquire the ConfigCat instance

The SDK supports two ways to acquire the initialized ConfigCat instance:

- Custom hook: `useConfigCatClient()` (from React v16.8)
- Higher-order component: `withConfigCatClient()`

## Anatomy of `useFeatureFlag()`

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on _ConfigCat Dashboard_ for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

```tsx
function ButtonComponent() {
  const { value: isAwesomeFeatureEnabled, loading } = useFeatureFlag('isAwesomeFeatureEnabled', false);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div>Feature flag value: {isAwesomeFeatureEnabled ? 'ON' : 'OFF'}</div>
  );
}
```

:::caution
It is important to provide an argument for the `defaultValue` parameter that matches the type of the feature flag or setting you are evaluating.
Please refer to the following table for the corresponding types.
:::

<div id="setting-type-mapping"></div>

| Setting Kind   | `typeof defaultValue` |
| -------------- | ----------------------|
| On/Off Toggle  | `boolean`             |
| Text           | `string`              |
| Whole Number   | `number`              |
| Decimal Number | `number`              |

In addition to the types mentioned above, you also have the option to provide `null` or `undefined` for the `defaultValue` parameter regardless of the setting kind.
However, if you do so, the type of `value` returned by the `useFeatureFlag` method will be
* `boolean | string | number | null` when `defaultValue` is `null` or
* `boolean | string | number | undefined` when `defaultValue` is `undefined`.

This is because in these cases the exact return type cannot be determined at compile-time as the TypeScript compiler has no information about the setting type.

It's important to note that providing any other type for the `defaultValue` parameter will result in a `TypeError`.

If you specify an allowed type but it mismatches the setting kind, an error message will be logged and `defaultValue` will be returned.

## Anatomy of `useConfigCatClient()`

This custom hook returns the ConfigCat instance from the context API. You have to wrap your parent element with `ConfigCatProvider` to ensure a `ConfigCatContextData`.

```tsx
export const FlagDetailsComponent = () => {
  const client = useConfigCatClient();

  const [flagDetails, setFlagDetails] =
    useState<IEvaluationDetails<boolean> | null>(null);

  useEffect(() => {
    client
      .getValueDetailsAsync('isAwesomeFeatureEnabled', false)
      .then((v) => setFlagDetails(v));
  }, [client]);

  return (
    <>{flagDetails && <p>FlagDetails: {JSON.stringify(flagDetails)}</p>}</>
  );
};
```

## Anatomy of `withConfigCatClient()`

This is a higher-order component that can take your React component and will return the component with the injected ConfigCat related props (`WithConfigCatClientProps`).

These props are the following:

```tsx
export interface WithConfigCatClientProps {
  configCatClient: IConfigCatClient;
  getValue: GetValueType;
  lastUpdated?: Date;
}
```

Sample declaration of class component with ConfigCat SDK's higher-order component:

```tsx
class MyComponent extends React.Component<
  { myProp: string } & WithConfigCatClientProps
> {
  constructor(props: { myProp: string } & WithConfigCatClientProps) {
    super(props);

    // props.configCatClient - use any method on the instance
    // props.getValue - helper function for flag evaluation
  }

  ...
}

// HOC declaration
const ConfigCatMyComponent = withConfigCatClient(MyComponent);

// Usage of the wrapped component
<ConfigCatMyComponent myProp='ConfigCat <3 React' />
```

### Props - `configCatClient`

The ConfigCat client instance (`IConfigCatClient`) to access all features of the _ConfigCat SDK_.

In this example the component can invoke the `forceRefreshAsync` method on the injected ConfigCat instance.

```tsx
class ManualRefreshComponent extends React.Component<
  { featureFlagKey: string } & WithConfigCatClientProps,
  { refreshAt: string | null }
> {
  constructor(props: { featureFlagKey: string } & WithConfigCatClientProps) {
    super(props);

    this.state = { refreshAt: '-' };
  }

  refresh() {
    this.props.configCatClient
      .forceRefreshAsync()
      .then(() =>
        this.setState({ refreshAt: new Date().toLocaleTimeString() }),
      );
  }

  render() {
    return (
      <div>
        <button onClick={() => this.refresh()}>Refresh</button>
        <p>Last manual refresh: {this.state.refreshAt}</p>
      </div>
    );
  }
}

const ConfigCatManualRefreshComponent = withConfigCatClient(
  ManualRefreshComponent,
);
```

### Props - `getValue`

A helper function to get the value of a feature flag.

| Parameters     | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`          | **REQUIRED.** Setting-specific key. Set on _ConfigCat Dashboard_ for each setting.                           |
| `defaultValue` | **REQUIRED.** This value will be returned in case of an error.                                               |
| `user`         | Optional, _User Object_. Essential when using Targeting. [Read more about Targeting.](advanced/targeting.md) |

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
    // To achieve hot reload on config JSON updates.
    if (prevProps?.lastUpdated !== this.props.lastUpdated) {
      this.evaluateFeatureFlag();
    }
  }

  evaluateFeatureFlag() {
    this.props
      .getValue('isAwesomeFeatureEnabled', false)
      .then((v: boolean) =>
        this.setState({ isAwesomeFeatureEnabled: v, loading: false }),
      );
  }

  render() {
    return loading ? (
      <div>Loading...</div>
    ) : (
      <div>
        Feature flag value: {this.state.isAwesomeFeatureEnabled ? 'ON' : 'OFF'}
      </div>
    );
  }
}
```

:::caution
It is important to provide an argument for the `defaultValue` parameter that matches the type of the feature flag or setting you are evaluating.
Please refer to [this table](#setting-type-mapping) for the corresponding types.
:::

### Props - `lastUpdated`

The timestamp of when the config was last updated.

## User Object

The [User Object](../advanced/user-object.md) is essential if you'd like to use ConfigCat's [Targeting](advanced/targeting.md) feature.

For simple targeting:

```tsx
const userObject = new User('#UNIQUE-USER-IDENTIFIER#');
```

or

```tsx
const userObject = new User('john@example.com');
```

| Parameters   | Description                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `identifier` | **REQUIRED.** Unique identifier of a user in your application. Can be any `string` value, even an email address.                |
| `email`      | Optional parameter for easier targeting rule definitions.                                                                       |
| `country`    | Optional parameter for easier targeting rule definitions.                                                                       |
| `custom`     | Optional dictionary for custom attributes of a user for advanced targeting rule definitions. e.g. User role, Subscription type. |

For advanced targeting:

```tsx
const userObject = new User(
  /* identifier: */ '#UNIQUE-USER-IDENTIFIER#',
  /*      email: */ 'john@example.com',
  /*    country: */ 'United Kingdom',
  /*     custom: */ {
    SubscriptionType: 'Pro',
    UserRole: 'Admin',
  },
);
```

```tsx
function ButtonComponent() {
  const { value: isAwesomeFeatureEnabled, loading } = useFeatureFlag(
    'isAwesomeFeatureEnabled',
    false,
    userObject,
  );

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div>Feature flag value: {isAwesomeFeatureEnabled ? 'ON' : 'OFF'}</div>
  );
}
```

### Default user

It's possible to set a default user object that will be used on feature flag and setting evaluation. It can be useful when your application has a single user only or rarely switches users.

You can set the default user object either on SDK initialization:

```tsx
<ConfigCatProvider
  sdkKey="YOUR_SDK_KEY"
  pollingMode={PollingMode.AutoPoll}
  options={{ defaultUser: new User('john@example.com') }}
>
  ...
</ConfigCatProvider>
```

...or using the `setDefaultUser()` method of the `configCatClient` instance:

```tsx
const CurrentUser: User = new User('john@example.com');

export const SetConfigCatUserComponent = () => {
  const client = useConfigCatClient();

  const [user] = useState(CurrentUser);

  useEffect(() => {
    client.setDefaultUser(user);
  }, [client, user]);

  return null;
};
```

Whenever the evaluation methods like `getValueAsync()`, `getValueDetailsAsync()`, etc. are called without an explicit user object parameter, the SDK will automatically use the default user as a user object.

```tsx
export const FlagValueDetailsComponent = () => {
  const client = useConfigCatClient();

  const [flagDetails, setFlagDetails] =
    useState<IEvaluationDetails<boolean> | null>(null);

  // invoke getValueDetailsAsync method WITHOUT User object
  useEffect(() => {
    client
      .getValueDetailsAsync('featureFlagKey', false)
      .then((v) => setFlagDetails(v));
  }, [client]);

  return (
    <>{flagDetails && <p>FlagDetails: {JSON.stringify(flagDetails)}</p>}</>
  );
};
```

When a user object parameter is passed to the evaluation methods, it takes precedence over the default user.

```tsx
const CurrentUser: User = new User('john@example.com');

export const FlagValueDetailsComponent = () => {
  const client = useConfigCatClient();

  const [flagDetails, setFlagDetails] =
    useState<IEvaluationDetails<boolean> | null>(null);
  const [user] = useState(CurrentUser);

  // invoke getValueDetailsAsync method WITH User object
  useEffect(() => {
    client
      .getValueDetailsAsync('featureFlagKey', false, user)
      .then((v) => setFlagDetails(v));
  }, [client, user]);

  return (
    <>{flagDetails && <p>FlagDetails: {JSON.stringify(flagDetails)}</p>}</>
  );
};
```

You can also remove the default user by doing the following:

```tsx
export const ClearConfigCatUserComponent = () => {
  const client = useConfigCatClient();

  useEffect(() => {
    client.clearDefaultUser();
  }, [client]);

  return null;
};
```

## Polling Modes

The _ConfigCat SDK_ supports 3 different polling mechanisms to acquire the setting values from _ConfigCat_. After latest setting values are downloaded, they are stored in the local cache then all `getValueAsync()` calls are served from there. With the following polling modes, you can customize the SDK to best fit to your application's lifecycle.
[More about polling modes.](/advanced/caching/)

### Auto polling (default)

The _ConfigCat SDK_ downloads the latest values and stores them automatically every 60 seconds.

#### Initialization

```tsx
<ConfigCatProvider sdkKey="YOUR_SDK_KEY" options={{...}}>
  ...
</ConfigCatProvider>
```

or

```tsx
<ConfigCatProvider sdkKey="YOUR_SDK_KEY" pollingMode={PollingMode.AutoPoll} options={{...}}>
  ...
</ConfigCatProvider>
```

Use the `pollIntervalSeconds` option parameter to change the polling interval.

```tsx
<ConfigCatProvider
  sdkKey="YOUR_SDK_KEY"
  pollingMode={PollingMode.AutoPoll}
  options={{ pollIntervalSeconds: 95 }}
>
  ...
</ConfigCatProvider>
```

Available options (in addition to the [common ones](#creating-the-configcat-client)):

| Option Parameter         | Description                                                                                         | Default |
| ------------------------ | --------------------------------------------------------------------------------------------------- | ------- |
| `pollIntervalSeconds`    | Polling interval in seconds.                                                                        | 60s     |
| `maxInitWaitTimeSeconds` | Maximum waiting time between the client initialization and the first config acquisition in seconds. | 5s      |

### Lazy loading

When calling `useFeatureFlag()` or `WithConfigCatClientProps.getValue()` the _ConfigCat SDK_ downloads the latest setting values if they are not present or expired in the cache.

#### Initialization

```tsx
<ConfigCatProvider sdkKey="YOUR_SDK_KEY" pollingMode={PollingMode.LazyLoad} options={{...}}>
  ...
</ConfigCatProvider>
```

Use `cacheTimeToLiveSeconds` option parameter to set cache lifetime.

```tsx
<ConfigCatProvider
  sdkKey="YOUR_SDK_KEY"
  pollingMode="{PollingMode.LazyLoad}"
  options={{ cacheTimeToLiveSeconds: 600 }}
>
  ...
</ConfigCatProvider>
```

Available options (in addition to the [common ones](#creating-the-configcat-client)):

| Option Parameter         | Description           | Default |
| ------------------------ | ----------------------| ------- |
| `cacheTimeToLiveSeconds` | Cache TTL in seconds. | 60s     |

### Manual polling

Manual polling gives you full control over when the config JSON (with the setting values) is downloaded. _ConfigCat SDK_ will not update them automatically. Calling `forceRefreshAsync()` is your application's responsibility.

#### Initialization

```tsx
<ConfigCatProvider sdkKey="YOUR_SDK_KEY" pollingMode={PollingMode.ManualPoll} options={{...}}>
  ...
</ConfigCatProvider>
```

```tsx
const client = useConfigCatClient();
useEffect(() => {
  client.forceRefreshAsync().then(() => {
    console.log('forceRefreshAsync() invoked');
  });
});
```

## SDK Hooks (not React Hooks)

> ** ConfigCat SDK hooks are different than React Hooks. **

The SDK provides several hooks (events), by means of which you can get notified of its actions.
You can subscribe to the following events emitted by the client:

- `clientReady`: This event is emitted when the SDK reaches the ready state. If the SDK is set up to use lazy load or manual polling, it's considered ready right after instantiation.
  If auto polling is used, the ready state is reached when the SDK has a valid config JSON loaded into memory either from cache or from HTTP. If the config couldn't be loaded neither from cache nor from HTTP, the `clientReady` event fires when the auto polling's `MaxInitWaitTime` has passed.
- `configChanged`: This event is emitted first when the SDK loads a valid config JSON into memory from cache, then each time afterwards when a config JSON with changed content is downloaded via HTTP.
- `flagEvaluated`: This event is emitted each time when the SDK evaluates a feature flag or setting. The event provides the same evaluation details that you would get from `getValueDetailsAsync()`.
- `clientError`: This event is emitted when an error occurs within the ConfigCat SDK.

You can subscribe to these events either on initialization:

```tsx
<ConfigCatProvider
  sdkKey="YOUR_SDK_KEY"
  pollingMode={PollingMode.ManualPoll}
  options={{
    setupHooks: (hooks) =>
      hooks.on('flagEvaluated', () => {
        /* handle the event */
      }),
  }}
>
  ...
</ConfigCatProvider>
```

...or directly on the `ConfigCatClient` instance:

```tsx
export const ConfigCatWithHookComponent = () => {
  const client = useConfigCatClient();

  const [configChangedAt, setConfigChanged] = useState('-');

  useEffect(() => {
    function hookLogic() {
      const t = new Date().toISOString();
      setConfigChanged(t);
      console.log(t);
    }

    client.on('configChanged', hookLogic);

    return () => {
      client.off('configChanged', hookLogic);
    };
  });

  return <p>configChangedAt: {configChangedAt}</p>;
};
```

Using higher-order component (HOC):

```tsx
class ConfigChangedComponent extends React.Component<
  WithConfigCatClientProps,
  { refreshAt: string | null }
> {
  constructor(props: WithConfigCatClientProps) {
    super(props);

    this.state = { refreshAt: '-' };
  }

  componentDidMount() {
    this.props.configCatClient.on('configChanged', () => this.myHookLogic());
  }

  componentWillUnmount() {
    this.props.configCatClient.off('configChanged', () => this.myHookLogic());
  }

  myHookLogic() {
    this.setState({ refreshAt: new Date().toISOString() });
  }

  render() {
    return (
      <div>
        <p>configChangedAt: {this.state.refreshAt}</p>
      </div>
    );
  }
}

const ConfigCatManualRefreshComponent = withConfigCatClient(
  ConfigChangedComponent,
);
```

## Online / Offline mode

In cases where you want to prevent the SDK from making HTTP calls, you can switch it to offline mode:

```tsx
export const ConfigCatIsOfflineComponent = () => {
  const client = useConfigCatClient();

  const [isOffline, setIsOffline] = useState(false);

  function setMode() {
    if (isOffline) {
      client.setOnline();
    } else {
      client.setOffline();
    }

    setIsOffline(client.isOffline);
  }

  return (
    <>
      <p>ConfigCat mode: {isOffline ? 'Offline' : 'Online'}</p>
      <button
        onClick={() => {
          setMode();
        }}
      >
        Set {isOffline ? 'Online' : 'Offline'}
      </button>
    </>
  );
};
```

In offline mode, the SDK won't initiate HTTP requests and will work only from its cache.

To switch the SDK back to online mode, invoke `setOnline()` method.

Using the `isOffline` property you can check whether the SDK is in offline mode or not.

## Flag Overrides

With flag overrides you can overwrite the feature flags & settings downloaded from the ConfigCat CDN with local values.
Moreover, you can specify how the overrides should apply over the downloaded values. The following 3 behaviours are supported:

- **Local only** (`OverrideBehaviour.LocalOnly`): When evaluating values, the SDK will not use feature flags & settings from the ConfigCat CDN, but it will use all feature flags & settings that are loaded from local-override sources.

- **Local over remote** (`OverrideBehaviour.LocalOverRemote`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the local-override version will take precedence.

- **Remote over local** (`OverrideBehaviour.RemoteOverLocal`): When evaluating values, the SDK will use all feature flags & settings that are downloaded from the ConfigCat CDN, plus all feature flags & settings that are loaded from local-override sources. If a feature flag or a setting is defined both in the downloaded and the local-override source then the downloaded version will take precedence.

You can set up the SDK to load your feature flag & setting overrides from a `{ [name: string]: any }` map.

```tsx
const flagOverrides: createFlagOverridesFromMap({
    enabledFeature: true,
    disabledFeature: false,
    intSetting: 5,
    doubleSetting: 3.14,
    stringSetting: "test"
},
OverrideBehaviour.LocalOnly);
```

```tsx
<ConfigCatProvider
  sdkKey="YOUR_SDK_KEY"
  pollingMode={PollingMode.ManualPoll}
  options={{ flagOverrides }}
>
  ...
</ConfigCatProvider>
```

## Logging

### Setting log levels

```tsx
const logger = createConsoleLogger(LogLevel.Info); // Setting log level to Info
```

```tsx
<ConfigCatProvider
  sdkKey="YOUR_SDK_KEY"
  pollingMode={PollingMode.ManualPoll}
  options={{ logger }}
>
  ...
</ConfigCatProvider>
```

Available log levels:

| Level | Description                                             |
| ----- | ------------------------------------------------------- |
| Off   | Nothing gets logged.                                    |
| Error | Only error level events are logged.                     |
| Warn  | Default. Errors and Warnings are logged.                |
| Info  | Errors, Warnings and feature flag evaluation is logged. |
| Debug | All of the above plus debug info is logged.             |

Info level logging helps to inspect the feature flag evaluation process:

```bash
ConfigCat - INFO - [5000] Evaluate 'isPOCFeatureEnabled'
 User : {"identifier":"#SOME-USER-ID#","email":"configcat@example.com"}
 Evaluating rule: 'configcat@example.com' CONTAINS '@something.com' => no match
 Evaluating rule: 'configcat@example.com' CONTAINS '@example.com' => MATCH
 Returning value : true
```

## Using custom cache implementation

Config data is stored in a cache for reducing network traffic and for improving performance of the client. If you would like to use your own cache solution (for example when your system uses external or distributed cache) you can implement the [`ICache` interface](https://github.com/configcat/common-js/blob/master/src/Cache.ts) and set the `cache` parameter in the options.

```ts
class MyCustomCache implements IConfigCatCache {
  set(key: string, value: string): Promise<void> | void {
    // insert your cache write logic here
  }

  get(key: string): Promise<string | null | undefined> | string | null | undefined {
    // insert your cache read logic here
  }
}
```

or

```js
function MyCustomCache() { }

MyCustomCache.prototype.set = function (key, value) {
  // insert your cache write logic here
};
MyCustomCache.prototype.get = function (key) {
  // insert your cache read logic here
};
```

then

```tsx
<ConfigCatProvider
  sdkKey="YOUR_SDK_KEY"
  pollingMode={PollingMode.ManualPoll}
  options={{ cache: new MyCustomCache() }}
>
  ...
</ConfigCatProvider>
```

## Sensitive information handling

The frontend/mobile SDKs are running in your users' browsers/devices. The SDK is downloading a [config JSON](/docs/requests/) file from ConfigCat's CDN servers. The URL path for this config JSON file contains your SDK key, so the SDK key and the content of your config JSON file (feature flag keys, feature flag values, targeting rules, % rules) can be visible to your users.
This SDK key is read-only, it only allows downloading your config JSON file, but nobody can make any changes with it in your ConfigCat account.

If you do not want to expose the SDK key or the content of the config JSON file, we recommend using the SDK in your backend components only. You can always create a backend endpoint using the ConfigCat SDK that can evaluate feature flags for a specific user, and call that backend endpoint from your frontend/mobile applications.

Also, we recommend using [confidential targeting comparators](/advanced/targeting/#confidential-text-comparators) in the targeting rules of those feature flags that are used in the frontend/mobile SDKs.

## Sample Application

- <a href="https://github.com/configcat/react-sdk/tree/main/samples/react-sdk-sample" target="_blank">React</a>

## Guides

See <a href="https://configcat.com/blog/2022/09/22/configcat-react-sdk-announcement/" target="_blank">this</a> guide on how to use ConfigCat's React SDK.

## Look under the hood

- <a href="https://github.com/configcat/react-sdk" target="_blank">ConfigCat React SDK on GitHub</a>
- <a href="https://www.npmjs.com/package/configcat-react" target="_blank">ConfigCat React SDK in NPM</a>
