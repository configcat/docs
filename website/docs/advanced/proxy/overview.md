---
id: proxy-overview
title: ConfigCat Proxy (Beta)
description: The ConfigCat Proxy allows you to host a feature flag evaluation service in your own infrastructure.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

:::info
The ConfigCat Proxy is in a public beta phase. If you have feedback or questions, please [contact us](https://configcat.com/support).
:::

The <a target="_blank" href="https://github.com/configcat/configcat-proxy">ConfigCat Proxy</a> allows you to host a feature flag evaluation service in your own infrastructure. It's a small Go application that communicates with ConfigCat's CDN network and caches/proxies *config JSON* files for your frontend and backend applications. The *config JSON* contains all the data that is needed for ConfigCat SDKs to evaluate feature flags.

The Proxy provides the following:
- **Performance**: The Proxy can be deployed close to your applications and can serve the downloaded *config JSON* files from memory. ConfigCat SDKs then can operate on the [proxied *config JSON*](/advanced/proxy/endpoints#cdn-proxy). This can reduce the duration of feature flag evaluation for stateless or short lived applications.
- **Reliability**: The Proxy can store the downloaded *config JSON* files in an external [cache](#cache). It can fall back to operating on the cached *config JSON* if the ConfigCat CDN network becomes inaccessible.
- **Security**: The Proxy can act as a [server side flag evaluation](/advanced/proxy/endpoints#api) component. Using it like that can prevent the exposure of *config JSON* files to frontend and mobile applications.
- **Scalability**: Horizontal scaling allows you to align with the load coming from your applications accordingly.
- **Streaming**: The Proxy provides real-time feature flag change notifications via [Server-Sent Events (SSE)](/advanced/proxy/endpoints#sse) and [gRPC](/advanced/proxy/grpc).

## Architecture

The following diagram shows the high level architecture of the Proxy.

<img className="bordered zoomable" src="/docs/assets/proxy/proxy_arch.png" alt="High level Proxy architecture" />

### How It Works
The Proxy wraps one or more SDK instances for handling feature flag evaluation requests. It also serves the related *config JSON* files that can be consumed by other ConfigCat SDKs running in your applications. 

Within the Proxy, the underlying SDK instances can run in the following modes:
- **Online**: In this mode, the underlying SDK has an active connection to the ConfigCat CDN network through the internet.
- **Offline**: In [this mode](#offline-mode), the underlying SDK doesn't have an active connection to ConfigCat. Instead, it uses the configured cache or a file as a source of its *config JSON*.

With the combination of the above modes, you can construct a cluster of proxies where only one node is responsible for the communication with ConfigCat, and all the other nodes are working from a central cache.

<img className="bordered zoomable" src="/docs/assets/proxy/load_balanced.png" alt="Load balanced Proxy architecture" />

### Communication

There are three ways how the Proxy is informed about the availability of new feature flag evaluation data:
- **Polling**: The ConfigCat SDKs within the Proxy are regularly polling the ConfigCat CDN for new *config JSON* versions.
- **Webhook**: The Proxy has [webhook endpoints](/advanced/proxy/endpoints#webhook) (for each underlying SDK) which can be set on the <a target="_blank" href="https://app.configcat.com/product/webhooks">ConfigCat Dashboard</a> to be invoked when someone saves & publishes new feature flag changes.
- **Cache polling / file watching**: In [offline mode](#offline-mode), the Proxy can regularly poll a cache or watch a file for new *config JSON* versions.

These are the ports used by the Proxy by default:
- **8050**: for standard HTTP communication. ([API](/advanced/proxy/endpoints#api), [CDN proxy](/advanced/proxy/endpoints#cdn-proxy), [Webhook](/advanced/proxy/endpoints#webhook), [SSE](/advanced/proxy/endpoints#sse), [Status](/advanced/proxy/monitoring#status))
- **8051**: for providing [prometheus metrics](/advanced/proxy/monitoring#prometheus-metrics).
- **50051**: for [gRPC](/advanced/proxy/grpc) communication.

## Installation

You can install the ConfigCat Proxy from the following sources:

<details open>
  <summary><strong>Docker</strong></summary>

The docker image is available on DockerHub. You can run the image either as a standalone docker container or via `docker-compose`.

<Tabs>
<TabItem value="standalone" label="Standalone" default>

Pull the latest image:
```shell
docker pull configcat/proxy:latest
```

Run the ConfigCat Proxy:
```shell
docker run -d --name configcat-proxy \ 
  -p 8050:8050 -p 8051:8051 -p 50051:50051 \
  -e CONFIGCAT_SDKS='{"<sdk-identifier>":"<your-sdk-key>"}' \
  configcat/proxy
```

</TabItem>
<TabItem value="compose" label="docker-compose">

```yaml title="docker-compose.yml"
services:
  configcat_proxy:
    image: configcat/proxy:latest
    environment:
      - CONFIGCAT_SDKS={"<sdk-identifier>":"<your-sdk-key>"}
    ports:
      - "8050:8050"
      - "8051:8051"
      - "50051:50051"
```

To start docker services, execute the following command:
```shell
docker-compose up -f docker-compose.yml -d
```

</TabItem>
</Tabs>

</details>

<details open>
  <summary><strong>Standalone executable</strong></summary>

You can download the executables directly from <a target="_blank" href="https://github.com/configcat/configcat-proxy/releases">GitHub Releases</a> for your desired platform.

</details>

You can then check the [status endpoint](/advanced/proxy/monitoring#status) of the Proxy to ensure it's working correctly: `http(s)://localhost:8050/status`

## Available Options

You can specify options for the Proxy either via a YAML file or with environment variables. When an option is defined in both places, the environment variable's value takes precedence.

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

<details open>
  <summary><strong>Docker</strong></summary>

When running the Proxy in docker, you can mount the YAML file as a volume.
```shell
docker run -d --name configcat-proxy \ 
  -p 8050:8050 -p 8051:8051 -p 50051:50051 \
  // highlight-next-line
  -v <path-to-file>/options.yml:/cnf/options.yml \
  configcat/proxy -c /cnf/options.yml
```

</details>

<details open>
  <summary><strong>Standalone executable</strong></summary>

Running the Proxy as a standalone executable, you can pass the YAML file via the `-c` argument.

<Tabs groupId="yaml-env-win">
<TabItem value="unix" label="macOS / Linux" default>

```shell
./configcat-proxy -c /path-to-file/options.yml
```

</TabItem>
<TabItem value="win" label="Windows">

```powershell
.\configcat-proxy.exe -c \path-to-file\options.yml
```

</TabItem>
</Tabs>

</details>

</TabItem>
<TabItem value="env-vars" label="Environment variables">

<details open>
  <summary><strong>Docker</strong></summary>

When running the Proxy in docker, you can pass environment variables for the executing container.
```shell
docker run -d --name configcat-proxy \ 
  -p 8050:8050 -p 8051:8051 -p 50051:50051 \
  // highlight-next-line
  -e CONFIGCAT_SDKS='{"<sdk-identifier>":"<your-sdk-key>"}' \
  configcat/proxy
```

</details>

<details open>
  <summary><strong>Standalone executable</strong></summary>

Make sure the related environment variables are available for the Proxy's hosting process.


<Tabs>
<TabItem value="shell" label="shell">

```shell
export CONFIGCAT_SDKS='{"<sdk-identifier>":"<your-sdk-key>"}'
```

Then start the Proxy:

```shell
./configcat-proxy
```

</TabItem>
<TabItem value="powershell" label="PowerShell">

```powershell
$Env:CONFIGCAT_SDKS='{"<sdk-identifier>":"<your-sdk-key>"}'
```

Then start the Proxy:

```powershell
.\configcat-proxy.exe
```

</TabItem>
</Tabs>

</details>

</TabItem>
</Tabs>

The following sections will go through each available option in detail.

### Logging

The Proxy supports the following log levels: `debug`, `info`, `warn`, and `error`. The default is `warn`.

You can specify the log level either globally or for each individual component. If you don't set a component's log level explicitly, it will inherit the global level's value.

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
log:
  level: "<error|warn|info|debug>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variables">

```shell
CONFIGCAT_LOG_LEVEL="<error|warn|info|debug>"
```

</TabItem>
</Tabs>

### Default User Attributes

There's an option to predefine [user object](/advanced/user-object) attributes with default values. Whenever the Proxy receives an evaluation request it will automatically attach these predefined attributes to the request. If the evaluation request contains a different value for an attribute you previously defined, the request's value will take precedence.

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
default_user_attributes:
  attribute_key1: "<attribute_value1>"
  attribute_key2: "<attribute_value2>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variables">

```shell
CONFIGCAT_DEFAULT_USER_ATTRIBUTES='{"attribute_key1":"<attribute_value1>","attribute_key2":"<attribute_value2>"}'
```

</TabItem>
</Tabs>

:::info
It's also possible to set default user attributes at the SDK level. See the [SDK options](#sdk) section below for more details.
:::

### SDK

In order to make the Proxy work properly, it must be set up with one or more <a target="blank" href="https://app.configcat.com/sdkkey">SDK keys</a>. It will instantiate one SDK instance for each SDK key.
In case of environment variables, the SDK keys can be specified in a **JSON key-value** format, where the **key is the identifier** of a specific SDK and the **value is the actual SDK key**.
The **SDK identifier** part is later used in [endpoint route variables](/advanced/proxy/endpoints) to recognize which SDK must serve the given flag evaluation request.

Furthermore, when configuring the Proxy **via environment variables**, the identifier becomes a **part of the SDK specific environment variable's name** using the following format: `CONFIGCAT_<SDK_ID>_<OPTION>`.

For example, suppose we have the following SDK key-value option: `CONFIGCAT_SDKS={"my-sdk":"<your-sdk-key>"}`.  
In this case, the environment variable that sets the SDK's poll interval will be named as follows: `CONFIGCAT_MY_SDK_POLL_INTERVAL`.

:::info
The SDK identifier part of the environment variables is always transformed to uppercase and each hyphen (`-`) character is replaced with underscore (`_`).
:::

In case of a YAML file, the **SDK identifier** is the property name set under the `sdks` node.

```yaml title="options.yml"
sdks:
  // highlight-next-line
  my_sdk:
    ...
```

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

This is the whole YAML section of the SDK specific options.
```yaml title="options.yml"
sdks:
  my_sdk:
    key: "<your-sdk-key>"
    base_url: "<base-url>"
    poll_interval: 30
    data_governance: <"eu"|"global">
    webhook_signing_key: "<key>"
    webhook_signature_valid_for: 300
    default_user_attributes:
      attribute_key: "<attribute_value>"
    log:
      level: "<error|warn|info|debug>"
    offline:
      log:
        level: "<error|warn|info|debug>"
      enabled: <true|false>
      use_cache: <true|false>
      cache_poll_interval: 5
      local:
        file_path: "./path/local.json"
        polling: <true|false>
        poll_interval: 5
  another_sdk:
    ...
```

</TabItem>
<TabItem value="env-vars" label="Environment variables">

These are the SDK specific environment variables.
```shell
CONFIGCAT_SDKS='{"my-sdk":"<your-sdk-key>","another-sdk":"<another-sdk-key>"}'
CONFIGCAT_MY_SDK_BASE_URL="<base-url>"
CONFIGCAT_MY_SDK_POLL_INTERVAL=30
CONFIGCAT_MY_SDK_DATA_GOVERNANCE="<eu|global>"
CONFIGCAT_MY_SDK_LOG_LEVEL="<error|warn|info|debug>"
CONFIGCAT_MY_SDK_OFFLINE_ENABLED=<true|false>
CONFIGCAT_MY_SDK_OFFLINE_LOG_LEVEL="<error|warn|info|debug>"
CONFIGCAT_MY_SDK_OFFLINE_LOCAL_FILE_PATH="./path/local.json"
CONFIGCAT_MY_SDK_OFFLINE_LOCAL_POLLING=<true|false>
CONFIGCAT_MY_SDK_OFFLINE_LOCAL_POLL_INTERVAL=5
CONFIGCAT_MY_SDK_OFFLINE_USE_CACHE=<true|false>
CONFIGCAT_MY_SDK_OFFLINE_CACHE_POLL_INTERVAL=5
CONFIGCAT_MY_SDK_WEBHOOK_SIGNING_KEY="<key>"
CONFIGCAT_MY_SDK_WEBHOOK_SIGNATURE_VALID_FOR=300
CONFIGCAT_MY_SDK_DEFAULT_USER_ATTRIBUTES='{"attribute_key":"<attribute_value>"}'

CONFIGCAT_ANOTHER_SDK_POLL_INTERVAL=15
...
```

</TabItem>
</Tabs>

Here's the explanation for each option:

#### SDK Identifier / SDK Key

<table className="proxy-arg-table">
<thead><tr><th>Option</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
my_sdk:
  key: "<your-sdk-key>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_SDKS={"my_sdk":"<your-sdk-key>"}
```

</TabItem>
</Tabs>

</td>
<td>The <strong>SDK identifier</strong> and the <strong>SDK key</strong>. The <strong>SDK identifier</strong> is used in <a href="/advanced/proxy/endpoints">endpoint route variables</a> to recognize which SDK must serve the given flag evaluation request. The <a target="blank" href="https://app.configcat.com/sdkkey">SDK key</a> is crucial for the underlying SDK to operate.</td>
</tr>
</tbody>
</table>

#### Additional SDK Options

<table className="proxy-arg-table">
<thead><tr><th>Option</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
my_sdk:
  base_url: "<base-url>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_MY_SDK_BASE_URL="<base-url>"
```

</TabItem>
</Tabs>

</td>
<td>ConfigCat's CDN url.</td>
<td>The CDN base url (forward proxy, dedicated subscription) from where the SDK will download the <code>config.json</code>.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
my_sdk:
  poll_interval: 30
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_MY_SDK_POLL_INTERVAL=30
```

</TabItem>
</Tabs>

</td>
<td><code>30</code></td>
<td>The underlying SDK's polling interval in seconds.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
my_sdk:
  data_governance: "<global|eu>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_MY_SDK_DATA_GOVERNANCE="<global|eu>"
```

</TabItem>
</Tabs>

</td>
<td><code>global</code></td>
<td>Describes the location of your feature flag and setting data within the ConfigCat CDN. This parameter needs to be in sync with your Data Governance preferences. <a href="/advanced/data-governance">More about Data Governance</a>.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
my_sdk:
  webhook_signing_key: "<key>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_MY_SDK_WEBHOOK_SIGNING_KEY="<key>"
```

</TabItem>
</Tabs>

</td>
<td>-</td>
<td>The <a href="/advanced/notifications-webhooks/#calculating-signature">key used to sign</a> the webhook requests sent to the Proxy. <a href="/advanced/proxy/endpoints#webhook">More about the webhook endpoint</a>.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
my_sdk:
  webhook_signature_valid_for: 300
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_MY_SDK_WEBHOOK_SIGNATURE_VALID_FOR=300
```

</TabItem>
</Tabs>

</td>
<td><code>300</code></td>
<td>The time period within the webhook requests are considered valid. <a href="/advanced/proxy/endpoints#webhook">More about the webhook endpoint</a>.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
my_sdk:
  default_user_attributes:
    attribute_key: "<attribute_value>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_MY_SDK_DEFAULT_USER_ATTRIBUTES='{"attribute_key":"<attribute_value>"}'
```

</TabItem>
</Tabs>

</td>
<td>-</td>
<td>Additional SDK specific <a href="#default-user-attributes">default user attributes</a>. The Proxy will use these attributes when an evaluation request doesn't contain a value for the predefined attribute.<br />When there's a default value defined for the same attribute at both SDK and global level, the one at the SDK level will take precedence.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
my_sdk:
  log:
    level: "<error|warn|info|debug>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_MY_SDK_LOG_LEVEL="<error|warn|info|debug>"
```

</TabItem>
</Tabs>

</td>
<td><code>warn</code></td>
<td>The verbosity of the SDK related logs.<br />Possible values: <code>error</code>, <code>warn</code>, <code>info</code>, or <code>debug</code>.</td>
</tr>

</tbody>
</table>

#### Offline Mode

The following options are specific to the SDK's offline mode. In offline mode, there are two ways the Proxy can get the required feature flag evaluation data for the underlying SDKs.

- **Polling a cache**: The Proxy can poll a cache for feature flag changes. It can use the same cache that an **online** Proxy instance writes. <a href="#cache">More about the cache option</a>.
- **Watching / polling a file**: The Proxy can watch or poll for modifications in a file that contains the evaluation data of feature flags. For watching, the Proxy uses the <a target="blank" href="https://github.com/fsnotify/fsnotify">fsnotify</a> library.

<table className="proxy-arg-table">
<thead><tr><th>Option</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
my_sdk:
  offline:
    enabled: <true|false>
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_MY_SDK_OFFLINE_ENABLED=<true|false>
```

</TabItem>
</Tabs>

</td>
<td><code>false</code></td>
<td>Enables or disables the SDK's offline mode. In offline mode the SDK will not communicate with the ConfigCat CDN network. Instead, it uses the configured cache or a file as the source of its <code>config.json</code>.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
my_sdk:
  offline:
    use_cache: <true|false>
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_MY_SDK_OFFLINE_USE_CACHE=<true|false>
```

</TabItem>
</Tabs>

</td>
<td><code>false</code></td>
<td>Indicates whether the SDK should use the configured cache as the source of its <code>config.json</code>. <a href="#cache">More about the cache option</a>.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
my_sdk:
  offline:
    cache_poll_interval: 5
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_MY_SDK_OFFLINE_CACHE_POLL_INTERVAL=5
```

</TabItem>
</Tabs>

</td>
<td><code>5</code></td>
<td>The cache polling interval in seconds. Used only, when the <code>use_cache</code> option is <code>true</code>. <a href="#cache">More about the cache option</a>.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
my_sdk:
  offline:
    log:
      level: "<error|warn|info|debug>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_MY_SDK_OFFLINE_LOG_LEVEL="<error|warn|info|debug>"
```

</TabItem>
</Tabs>

</td>
<td><code>warn</code></td>
<td>The verbosity of the offline mode related logs.<br />Possible values: <code>error</code>, <code>warn</code>, <code>info</code> or <code>debug</code>.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
my_sdk:
  offline:
    local:
      file_path: "./path/local.json"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_MY_SDK_OFFLINE_LOCAL_FILE_PATH="./path/local.json"
```

</TabItem>
</Tabs>

</td>
<td>-</td>
<td>Path to the local file that contains the appropriate <code>config.json</code>.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
my_sdk:
  offline:
    local:
      polling: <true|false>
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_MY_SDK_OFFLINE_LOCAL_POLLING=<true|false>
```

</TabItem>
</Tabs>

</td>
<td><code>false</code></td>
<td>Indicates whether the Proxy should switch to local file polling instead of file system watching.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
my_sdk:
  offline:
    local:
      poll_interval: 5
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_MY_SDK_OFFLINE_LOCAL_POLL_INTERVAL=5
```

</TabItem>
</Tabs>

</td>
<td><code>5</code></td>
<td>The polling interval of the local file in seconds.</td>
</tr>
</tbody>
</table>

### Cache

You have the option to cache feature flag evaluation data in an external cache. Currently, the only available option is <a target="blank" href="https://redis.io">Redis</a>.  
The cache key for the underlying SDKs is based on the [SDK Key](#sdk-identifier--sdk-key). This means that multiple Proxy instances using the same SDK key will read/write the same cache entry.

:::info
The ConfigCat Proxy supports *shared caching*, which means it can feed an external cache that is shared by other ConfigCat SDKs. You can read more about this feature and the required minimum SDK versions [here](/docs/advanced/caching/#shared-cache).

<img className="bordered zoomable" src="/docs/assets/proxy/shared_cache.png" alt="Shared cache architecture" />

:::

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

This is the whole YAML section of the cache specific options.
```yaml title="options.yml"
cache:
  redis:
    enabled: <true|false>
    db: 0
    user: "<user>"
    password: "<pass>"
    addresses: ["<addr1>", "<addr2>"]
    tls: 
      enabled: <true|false>
      min_version: <1.0|1.1|1.2|1.3>
      server_name: "<server-name>"
      certificates:
        - cert: "<path-to-cert>"
          key: "<path-to-key>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variables">

These are the cache specific environment variables.
```shell
CONFIGCAT_CACHE_REDIS_ENABLED=<true|false>
CONFIGCAT_CACHE_REDIS_DB=0
CONFIGCAT_CACHE_REDIS_USER="<user>"
CONFIGCAT_CACHE_REDIS_PASSWORD="<pass>"
CONFIGCAT_CACHE_REDIS_ADDRESSES='["<addr1>", "<addr2>"]'
CONFIGCAT_CACHE_REDIS_TLS_ENABLED=<true|false>
CONFIGCAT_CACHE_REDIS_TLS_MIN_VERSION=<1.0|1.1|1.2|1.3>
CONFIGCAT_CACHE_REDIS_TLS_SERVER_NAME="<server-name>"
CONFIGCAT_CACHE_REDIS_TLS_CERTIFICATES='[{"key":"<path-to-key>","cert":"<path-to-cert>"}]'
```

</TabItem>
</Tabs>

Here's the explanation for each option:

#### Redis

<table className="proxy-arg-table">
<thead><tr><th>Option</th><th>Default</th><th>Description</th></tr></thead>
<tbody>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
cache:
  redis:
    addresses: ["<addr1>", "<addr2>"]
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_CACHE_REDIS_ADDRESSES='["<addr1>", "<addr2>"]'
```

</TabItem>
</Tabs>

</td>
<td><code>["localhost:6379"]</code></td>
<td>The addresses of the Redis instances. The Proxy uses <a target="blank" href="https://redis.uptrace.dev/guide/universal.html">Universal Redis clients</a>, so if the array contains multiple addresses, it will use <code>ClusterClient</code> instances.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
cache:
  redis:
    enabled: <true|false>
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_CACHE_REDIS_ENABLED=<true|false>
```

</TabItem>
</Tabs>

</td>
<td><code>false</code></td>
<td>Enables or disables caching into Redis.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
cache:
  redis:
    db: 0
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_CACHE_REDIS_DB=0
```

</TabItem>
</Tabs>

</td>
<td><code>0</code></td>
<td>The selected Redis database.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
cache:
  redis:
    user: "<user>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_CACHE_REDIS_USER="<user>"
```

</TabItem>
</Tabs>

</td>
<td>-</td>
<td>The username for connecting to Redis.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
cache:
  redis:
    password: "<pass>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_CACHE_REDIS_PASSWORD="<pass>"
```

</TabItem>
</Tabs>

</td>
<td>-</td>
<td>The password for connecting to Redis.</td>
</tr>
</tbody>
</table>

The following options are related to securing the connection to Redis with TLS.

<table className="proxy-arg-table">
<thead><tr><th>Option</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
cache:
  redis:
    tls: 
      enabled: <true|false>
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_CACHE_REDIS_TLS_ENABLED=<true|false>
```

</TabItem>
</Tabs>

</td>
<td><code>false</code></td>
<td>Enables or disables TLS connection to Redis.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
cache:
  redis:
    tls: 
      min_version: <1.0|1.1|1.2|1.3>
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_CACHE_REDIS_TLS_MIN_VERSION=<1.0|1.1|1.2|1.3>
```

</TabItem>
</Tabs>

</td>
<td><code>1.2</code></td>
<td>The minimum TLS version to use.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
cache:
  redis:
    tls: 
      server_name: "<server-name>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_CACHE_REDIS_TLS_SERVER_NAME="<server-name>"
```

</TabItem>
</Tabs>

</td>
<td>-</td>
<td>The name of the Redis server.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
cache:
  redis:
    certificates:
      - cert: "<path-to-cert>"
        key: "<path-to-key>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_CACHE_REDIS_TLS_CERTIFICATES='[{"key":"<path-to-key>","cert":"<path-to-cert>"}]'
```

</TabItem>
</Tabs>

</td>
<td>-</td>
<td>A list of TLS certificate/key pairs.</td>
</tr>
</tbody>
</table>

### HTTP

The following HTTP and HTTP Proxy related options are available:

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml title="options.yml"
http:
  port: 8050
  log: 
    level: "<error|warn|info|debug>"

http_proxy:
  url: "<proxy-url>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variables">

```shell
CONFIGCAT_HTTP_PORT=8050
CONFIGCAT_HTTP_LOG_LEVEL="<error|warn|info|debug>"

CONFIGCAT_HTTP_PROXY_URL="<proxy-url>"
```

</TabItem>
</Tabs>

Here's the explanation for each option:

<table className="proxy-arg-table">
<thead><tr><th>Option</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
http:
  port: 8050
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_HTTP_PORT=8050
```

</TabItem>
</Tabs>

</td>
<td><code>8050</code></td>
<td>The HTTP server's port that serves the <a href="/advanced/proxy/endpoints#cdn-proxy">CDN proxy</a>, <a href="/advanced/proxy/endpoints#api">API</a>, <a href="/advanced/proxy/endpoints#sse">SSE</a>, and <a href="/advanced/proxy/endpoints#webhook">webhook</a> endpoints.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
http:
  log:
    level: "<error|warn|info|debug>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_HTTP_LOG_LEVEL="<error|warn|info|debug>"
```

</TabItem>
</Tabs>

</td>
<td><code>warn</code></td>
<td>The verbosity of the HTTP related logs.<br />Possible values: <code>error</code>, <code>warn</code>, <code>info</code>, or <code>debug</code>. When <code>debug</code> is set, the Proxy will log every HTTP request it receives.</td>
</tr>

</tbody>
</table>

#### HTTP Proxy

<table className="proxy-arg-table">
<thead><tr><th>Option</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
http_proxy:
  url: "<proxy-url>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_HTTP_PROXY_URL="<proxy-url>"
```

</TabItem>
</Tabs>

</td>
<td>-</td>
<td>The network proxy's URL that the ConfigCat Proxy must use for communication through the internet.</td>
</tr>

</tbody>
</table>

#### Endpoints

The options for HTTP endpoints are discussed in the [Endpoints](/advanced/proxy/endpoints) section.

### TLS

For securing direct communication to the ConfigCat Proxy, you have the option to set up TLS. Another option would be to use a full-featured reverse proxy that secures the communication and forwards each request to the Proxy.

The following options are for the first scenario where you secure the direct HTTP and gRPC communication.

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml title="options.yml"
tls: 
  enabled: <true|false>
  min_version: <1.0|1.1|1.2|1.3>
  certificates:
    - cert: "<path-to-cert>"
      key: "<path-to-key>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variables">

```shell
CONFIGCAT_TLS_ENABLED=<true|false>
CONFIGCAT_TLS_MIN_VERSION=<1.0|1.1|1.2|1.3>
CONFIGCAT_TLS_CERTIFICATES='[{"key":"<path-to-key>","cert":"<path-to-cert>"}]'
```

</TabItem>
</Tabs>

Here's the explanation for each option:

<table className="proxy-arg-table">
<thead><tr><th>Option</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
tls: 
  enabled: <true|false>
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_TLS_ENABLED=<true|false>
```

</TabItem>
</Tabs>

</td>
<td><code>false</code></td>
<td>Enables or disables the enforcement of TLS connection to the ConfigCat Proxy.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
tls: 
  min_version: <1.0|1.1|1.2|1.3>
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_TLS_MIN_VERSION=<1.0|1.1|1.2|1.3>
```

</TabItem>
</Tabs>

</td>
<td><code>1.2</code></td>
<td>The minimum TLS version to accept.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
tls:
  certificates:
    - cert: "<path-to-cert>"
      key: "<path-to-key>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_TLS_CERTIFICATES='[{"key":"<path-to-key>","cert":"<path-to-cert>"}]'
```

</TabItem>
</Tabs>

</td>
<td>-</td>
<td>A list of TLS certificate/key pairs.</td>
</tr>
</tbody>
</table>