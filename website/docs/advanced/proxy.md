---
id: proxy
title: ConfigCat Proxy
description: The ConfigCat Proxy allows you to host a feature flag evaluation service in your own infrastructure.
toc_max_heading_level: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

The <a target="_blank" href="https://github.com/configcat/configcat-proxy">ConfigCat Proxy</a> allows you to host a feature flag evaluation service in your own infrastructure. It's a small Go application that communicates with ConfigCat's CDN network and caches/proxies `config.json` files for your frontend and backend applications. The `config.json` contains all the data that needed for ConfigCat SDKs to evaluate feature flags.

The Proxy provides the following:
- **Performance**: The Proxy can be deployed close to your applications and can serve the downloaded `config.json` files from memory. ConfigCat SDKs then can operate on the [proxied `config.json`](#cdn-proxy). This can reduce the duration of feature flag evaluation for stateless or short lived applications.
- **Reliability**: The Proxy can store the downloaded `config.json` files in an external [cache](#cache). It can fall back to operating on the cached `config.json` if the ConfigCat CDN network becomes inaccessible.
- **Security**: The Proxy can act as a *[server side flag evaluation](#api)* component. Using like that can prevent the exposure of `config.json` files to frontend and mobile applications.
- **Scalability**: Horizontal scaling allows you to align with the load coming from your applications accordingly.
- **Streaming**: The Proxy provides real-time feature flag change notifications via [Server-Sent Events (SSE)](#sse) and [gRPC](#grpc-1).

## Architecture

The following diagram shows the high level architecture of the Proxy.

<img className="bordered zoomable" src="/docs/assets/proxy/proxy_arch.png" alt="High level Proxy architecture" />

### How It Works
The Proxy wraps one or more SDK instances for handling feature flag evaluation requests. It also serves the related `config.json` files that can be consumed by other ConfigCat SDKs running in your applications. 

Within the Proxy, the underlying SDK instances can run in the following modes:
- **Online**: In this mode the underlying SDK has an active connection to the ConfigCat CDN network through the internet.
- **Offline**: In [this mode](#offline-mode) the underlying SDK doesn't have an active connection to ConfigCat. Instead, it uses the configured cache or a file as a source of its `config.json`.

With the combination of the above modes you can construct a cluster of proxies where only one node is responsible for the communication with ConfigCat and all the other nodes are working from a central cache.

<img className="bordered zoomable" src="/docs/assets/proxy/load_balanced.png" alt="Load balanced Proxy architecture" />

### Communication

There are three ways how the Proxy is informed about the availability of new feature flag evaluation data:
- **Polling**: The ConfigCat SDKs within the Proxy are regularly polling the ConfigCat CDN for new `config.json` versions.
- **Webhook**: The Proxy has [webhook endpoints](#webhook) (for each underlying SDK) which can be set on the <a target="_blank" href="https://app.configcat.com/product/webhooks">ConfigCat Dashboard</a> to be invoked when someone saves & publishes new feature flag changes.
- **Cache polling / file watching**: In [offline mode](#offline-mode), the Proxy can regularly poll a cache or watch a file for new `config.json` versions.

These are the ports used by the Proxy by default:
- **8050**: for standard HTTP communication. ([API](#api), [CDN proxy](#cdn-proxy), [Webhook](#webhook), [SSE](#sse), [Status](#status))
- **8051**: for providing [prometheus metrics](#prometheus-metrics).
- **50051**: for [gRPC](#grpc-1) communication.

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

<details>
  <summary><strong>Standalone executable</strong></summary>

You can download the executables directly from <a target="_blank" href="https://github.com/configcat/configcat-proxy/releases">GitHub Releases</a> for your desired platform.

</details>

You can then check the status endpoint of the Proxy to ensure it's working correctly: `http(s)://localhost:8050/status`

## Configuration Options

You can specify options for the Proxy either via a YAML file or with environment variables.

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

<details>
  <summary><strong>Standalone executable</strong></summary>

Running the Proxy as a standalone executable, you can pass the YAML file via the `-c` argument.

```shell
configcat-proxy -c /path-to-file/options.yml
```

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

<details>
  <summary><strong>Standalone executable</strong></summary>

Make sure the related environment variables are available for the Proxy's hosting process. For example:


<Tabs>
<TabItem value="shell" label="shell">

```shell
export CONFIGCAT_SDKS='{"<sdk-identifier>":"<your-sdk-key>"}'
```

</TabItem>
<TabItem value="powershell" label="PowerShell">

```powershell
$Env:CONFIGCAT_SDKS='{"<sdk-identifier>":"<your-sdk-key>"}'
```

</TabItem>
</Tabs>

Then start the Proxy:

```shell
configcat-proxy
```

</details>

</TabItem>
</Tabs>

The following sections will go through each available option in detail.

### SDK

In order to make the Proxy work properly it must be set up with one or more <a target="blank" href="https://app.configcat.com/sdkkey">SDK keys</a>. It will instantiate one SDK instance for each SDK key.
In case of environment variables the SDK keys can be specified in a **JSON key-value** format where the **key is the identifier** of a specific SDK and the **value is the actual SDK key**.
The **SDK identifier** part is later used in [endpoint route variables](#endpoints) to recognize which SDK must serve the given flag evaluation request.

Furthermore, when the Proxy is configured **via environment variables**, the identifier becomes a **part in the SDK specific environment variable's name** using the following format: `CONFIGCAT_<SDK_ID>_<OPTION>`.

For example, given the following SDK key-value option: `CONFIGCAT_SDKS={"my-sdk":"<your-sdk-key>"}`.  
The environment variable that will set the SDK's poll interval will be named like: `CONFIGCAT_MY_SDK_POLL_INTERVAL`.

:::info
The SDK identifier part of the environment variables is always transformed to uppercase and each hyphen (`-`) character is replaced with underscore (`_`).
:::

In case of a YAML file the **SDK identifier** is the property name set under the `sdks` node.

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
<td>The <strong>SDK identifier</strong> and the <strong>SDK key</strong>. The <strong>SDK identifier</strong> is used in <a href="#endpoints">endpoint route variables</a> to recognize which SDK must serve the given flag evaluation request. The <a target="blank" href="https://app.configcat.com/sdkkey">SDK key</a> is crucial for the underlying SDK to operate.</td>
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
<td>The <a href="/advanced/notifications-webhooks/#calculating-signature">key used to sign</a> the webhook requests sent to the Proxy. <a href="#webhook">More about the webhook endpoint</a>.</td>
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
<td>The time period within the webhook requests are considered valid. <a href="#webhook">More about the webhook endpoint</a>.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
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
<td>The verbosity of the SDK related logs.<br />Possible values: <code>error</code>, <code>warn</code>, <code>info</code> or <code>debug</code>.</td>
</tr>

</tbody>
</table>

#### Offline Mode

The following options are specific to the SDK's offline mode. In offline mode, there's two ways the Proxy can get the required feature flag evaluation data for the underlying SDKs.

- **Polling a cache**: The Proxy can poll a cache for feature flag changes. It can use the same cache that an **online** Proxy instance writes. <a href="#cache">More about the cache option</a>.
- **Watching / polling a file**: The Proxy can watch or poll for modifications in a file that contains the evaluation data of feature flags. For watching, the Proxy uses the <a target="blank" href="https://github.com/fsnotify/fsnotify">fsnotify</a> library. It can happen that it doesn't send the modification events properly on some platforms, in that case, you can change to file polling.

<table className="proxy-arg-table">
<thead><tr><th>Option</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
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
    addresses: ["<addr1>", "<addr1>"]
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
CONFIGCAT_CACHE_REDIS_ADDRESSES='["<addr1>", "<addr1>"]'
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

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
cache:
  redis:
    addresses: ["<addr1>", "<addr1>"]
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_CACHE_REDIS_ADDRESSES='["<addr1>", "<addr1>"]'
```

</TabItem>
</Tabs>

</td>
<td><code>["localhost:6379"]</code></td>
<td>The addresses of the Redis instances. The Proxy uses <a target="blank" href="https://redis.uptrace.dev/guide/universal.html">Universal Redis clients</a>, so if the array contains multiple addresses it will use <code>ClusterClient</code> instances.</td>
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

### HTTP / HTTP Proxy

The following HTTP and HTTP Proxy related options are available:

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml title="options.yml"
http:
  port: 8050
  log: 
    level: "<error|warn|info|debug>"

  cdn_proxy:
    enabled: <true|false>
    allow_cors: <true|false>
    headers:
      CUSTOM-HEADER: "<header-value>"

  api:
    enabled: <true|false>
    allow_cors: <true|false>
    headers:
      CUSTOM-HEADER: "<header-value>"
    auth_headers:
      X-API-KEY: "<auth-value>"

  sse:
    log: 
      level: "<error|warn|info|debug>"
    enabled: <true|false>
    allow_cors: <true|false>
    headers:
      CUSTOM-HEADER: "<header-value>"

  webhook:
    enabled: <true|false>
    auth:
      user: "<auth-user>"
      password: "<auth-pass>"
    auth_headers:
      X-API-KEY: "<auth-value>"

http_proxy:
  url: "<proxy-url>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variables">

```shell
CONFIGCAT_HTTP_PORT=8050
CONFIGCAT_HTTP_LOG_LEVEL="<error|warn|info|debug>"

CONFIGCAT_HTTP_CDN_PROXY_ENABLED=<true|false>
CONFIGCAT_HTTP_CDN_PROXY_HEADERS='{"CUSTOM-HEADER":"<header-value>"}'
CONFIGCAT_HTTP_CDN_PROXY_ALLOW_CORS=<true|false>

CONFIGCAT_HTTP_API_ENABLED=<true|false>
CONFIGCAT_HTTP_API_ALLOW_CORS=<true|false>
CONFIGCAT_HTTP_API_HEADERS='{"CUSTOM-HEADER":"<header-value>"}'
CONFIGCAT_HTTP_API_AUTH_HEADERS='{"X-API-KEY":"<auth-value>"}'

CONFIGCAT_HTTP_SSE_ENABLED=<true|false>
CONFIGCAT_HTTP_SSE_LOG_LEVEL="<error|warn|info|debug>"
CONFIGCAT_HTTP_SSE_ALLOW_CORS=<true|false>
CONFIGCAT_HTTP_SSE_HEADERS='{"CUSTOM-HEADER":"<header-value>"}'

CONFIGCAT_HTTP_WEBHOOK_ENABLED=<true|false>
CONFIGCAT_HTTP_WEBHOOK_AUTH_USER="<auth-user>"
CONFIGCAT_HTTP_WEBHOOK_AUTH_PASSWORD="<auth-pass>"
CONFIGCAT_HTTP_WEBHOOK_AUTH_HEADERS='{"X-API-KEY":"<auth-value>"}'

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
<td>The HTTP server's port that serves the <a href="#cdn-proxy">CDN proxy</a>, <a href="#api">API</a>, <a href="#sse">SSE</a>, and <a href="#webhook">webhook</a> endpoints.</td>
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
<td>The verbosity of the HTTP related logs.<br />Possible values: <code>error</code>, <code>warn</code>, <code>info</code> or <code>debug</code>.</td>
</tr>

</tbody>
</table>

#### CDN Proxy Options

<table className="proxy-arg-table">
<thead><tr><th>Option</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
http:
  cdn_proxy:
    enabled: <true|false>
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_HTTP_CDN_PROXY_ENABLED=<true|false>
```

</TabItem>
</Tabs>

</td>
<td><code>true</code></td>
<td>Enables or disables the <a href="#cdn-proxy">CDN proxy endpoint</a>, which can be used by ConfigCat SDKs in your applications.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
http:
  cdn_proxy:
    allow_cors: <true|false>
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_HTTP_CDN_PROXY_ALLOW_CORS=<true|false>
```

</TabItem>
</Tabs>

</td>
<td><code>true</code></td>
<td>Enables or disables the sending of CORS headers. It can be used to restrict access to specific domains. The default allowed origin is set to <code>*</code>, but you can override it with the <code>CONFIGCAT_HTTP_CDN_PROXY_HEADERS</code> option.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
http:
  cdn_proxy:
    headers:
      Access-Control-Allow-Origin: "https://yourdomain.com"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_HTTP_CDN_PROXY_HEADERS='{"Access-Control-Allow-Origin":"https://yourdomain.com"}'
```

</TabItem>
</Tabs>

</td>
<td>-</td>
<td>Additional headers that must be sent back on each <a href="#cdn-proxy">CDN proxy endpoint</a> response.</td>
</tr>

</tbody>
</table>

#### API Options

<table className="proxy-arg-table">
<thead><tr><th>Option</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
http:
  api:
    enabled: <true|false>
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_HTTP_API_PROXY_ENABLED=<true|false>
```

</TabItem>
</Tabs>

</td>
<td><code>true</code></td>
<td>Enables or disables the <a href="#api">API endpoints</a>, which can be used for server side feature flag evaluation.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
http:
  api:
    allow_cors: <true|false>
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_HTTP_API_ALLOW_CORS=<true|false>
```

</TabItem>
</Tabs>

</td>
<td><code>true</code></td>
<td>Enables or disables the sending of CORS headers. It can be used to restrict access to specific domains. The default allowed origin is set to <code>*</code>, but you can override it with the <code>CONFIGCAT_HTTP_API_HEADERS</code> option.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
http:
  api:
    headers:
      Access-Control-Allow-Origin: "https://yourdomain.com"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_HTTP_API_HEADERS='{"Access-Control-Allow-Origin":"https://yourdomain.com"}'
```

</TabItem>
</Tabs>

</td>
<td>-</td>
<td>Additional headers that must be sent back on each <a href="#api">API endpoint</a> response.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
http:
  api:
    auth_headers:
      X-API-KEY: "<auth-value>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_HTTP_API_AUTH_HEADERS='{"X-API-KEY":"<auth-value>"}'
```

</TabItem>
</Tabs>

</td>
<td>-</td>
<td>Additional headers that must be on each request sent to the <a href="#api">API endpoints</a>. If the request doesn't include the specified header, or the values are not matching, the Proxy will respond with a <code>401</code> HTTP status code.</td>
</tr>

</tbody>
</table>

#### SSE Options

<table className="proxy-arg-table">
<thead><tr><th>Option</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
http:
  sse:
    enabled: <true|false>
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_HTTP_SSE_ENABLED=<true|false>
```

</TabItem>
</Tabs>

</td>
<td><code>true</code></td>
<td>Enables or disables the <a href="#sse">SSE endpoint</a>, which can be used for streaming feature flag value changes.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
http:
  sse:
    allow_cors: <true|false>
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_HTTP_SSE_ALLOW_CORS=<true|false>
```

</TabItem>
</Tabs>

</td>
<td><code>true</code></td>
<td>Enables or disables the sending of CORS headers. It can be used to restrict access to specific domains. The default allowed origin is set to <code>*</code>, but you can override it with the <code>CONFIGCAT_HTTP_SSE_HEADERS</code> option.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
http:
  sse:
    headers:
      Access-Control-Allow-Origin: "https://yourdomain.com"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_HTTP_SSE_HEADERS='{"Access-Control-Allow-Origin":"https://yourdomain.com"}'
```

</TabItem>
</Tabs>

</td>
<td>-</td>
<td>Additional headers that must be sent back on each <a href="#sse">SSE endpoint</a> response.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
http:
  sse:
    log:
      level: "<error|warn|info|debug>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_HTTP_SSE_LOG_LEVEL="<error|warn|info|debug>"
```

</TabItem>
</Tabs>

</td>
<td><code>warn</code></td>
<td>The verbosity of the SSE related logs.<br />Possible values: <code>error</code>, <code>warn</code>, <code>info</code> or <code>debug</code>.</td>
</tr>

</tbody>
</table>

#### Webhook Options

<table className="proxy-arg-table">
<thead><tr><th>Option</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
http:
  webhook:
    enabled: <true|false>
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_HTTP_WEBHOOK_PROXY_ENABLED=<true|false>
```

</TabItem>
</Tabs>

</td>
<td><code>true</code></td>
<td>Enables or disables the <a href="#webhook">Webhook endpoint</a>, which can be used for notifying the Proxy about the availability of new feature flag evaluation data.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
http:
  webhook:
    auth:
      user: "<auth-user>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_HTTP_WEBHOOK_AUTH_USER="<auth-user>"
```

</TabItem>
</Tabs>

</td>
<td>-</td>
<td>Basic authentication user. The basic authentication webhook header can be set on the <a target="blank" href="https://app.configcat.com/product/webhooks">Webhooks page</a> of the ConfigCat Dashboard.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
http:
  webhook:
    auth:
      password: "<auth-pass>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_HTTP_WEBHOOK_AUTH_PASSWORD="<auth-pass>"
```

</TabItem>
</Tabs>

</td>
<td>-</td>
<td>Basic authentication password. The basic authentication webhook header can be set on the <a target="blank" href="https://app.configcat.com/product/webhooks">Webhooks page</a> of the ConfigCat Dashboard.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
http:
  webhook:
    auth_headers:
      X-API-KEY: "<auth-value>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_HTTP_WEBHOOK_AUTH_HEADERS='{"X-API-KEY":"<auth-value>"}'
```

</TabItem>
</Tabs>

</td>
<td>-</td>
<td>Additional headers that ConfigCat must send with each request to the <a href="#webhook">Webhook endpoint</a>. Webhook headers can be set on the <a target="blank" href="https://app.configcat.com/product/webhooks">Webhooks page</a> of the ConfigCat Dashboard.</td>
</tr>

</tbody>
</table>

#### HTTP Proxy Options

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

### gRPC

The following <a href="#grpc-1">gRPC</a> related options are available:

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml title="options.yml"
grpc:
  enabled: <true|false>
  port: 50051
  log:
    level: "<error|warn|info|debug>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variables">

```shell
CONFIGCAT_GRPC_ENABLED=<true|false>
CONFIGCAT_GRPC_PORT=50051
CONFIGCAT_GRPC_LOG_LEVEL="<error|warn|info|debug>"
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
grpc:
  enabled: <true|false>
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_GRPC_ENABLED=<true|false>
```

</TabItem>
</Tabs>

</td>
<td><code>true</code></td>
<td>Enables or disables the ability to communicate with the Proxy through <a href="#grpc-1">gRPC</a>.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
grpc:
  port: 50051
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_GRPC_PORT=50051
```

</TabItem>
</Tabs>

</td>
<td><code>50051</code></td>
<td>The port used for <a href="#grpc-1">gRPC</a> communication.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
grpc:
  log:
    level: "<error|warn|info|debug>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_GRPC_LOG_LEVEL="<error|warn|info|debug>"
```

</TabItem>
</Tabs>

</td>
<td><code>warn</code></td>
<td>The verbosity of the <a href="#grpc-1">gRPC</a> related logs.<br />Possible values: <code>error</code>, <code>warn</code>, <code>info</code> or <code>debug</code>.</td>
</tr>

</tbody>
</table>

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

### Metrics

<table className="proxy-arg-table">
<thead><tr><th>Option</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
metrics:
  enabled: <true|false>
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_METRICS_ENABLED=<true|false>
```

</TabItem>
</Tabs>

</td>
<td><code>true</code></td>
<td>Enables or disables <a href="#prometheus-metrics">Prometheus metrics</a>.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
metrics:
  port: 8051
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_METRICS_PORT=8051
```

</TabItem>
</Tabs>

</td>
<td><code>8051</code></td>
<td>The port used for serving metrics.</td>
</tr>

</tbody>
</table>

## Endpoints

The Proxy accepts HTTP requests on the following endpoints:

### CDN Proxy

The CDN proxy endpoint's purpose is to forward the underlying `config.json` to other ConfigCat SDKs used by your application.  

<details open>
  <summary><span className="endpoint"><span className="http-method green">GET</span><span className="http-method gray">OPTIONS</span>/configuration-files/&#123;sdkId&#125;/&#123;config-json-file&#125;</span></summary>

This endpoint is mainly used by ConfigCat SDKs to retreive all required data for feature flag evaluation. 

**Route parameters**:
- `sdkId`: The [SDK identifier](#sdk-identifier--sdk-key) that uniquely identifies an SDK within the Proxy.
- `config-json-file`: It's set by the ConfigCat SDK, it determines which `config.json` schema must be used.  

**Responses**:
<ul className="responses">
  <li className="success"><span className="status">200</span>: The <code>config.json</code> file is downloaded successfully.</li>
  <li className="success"><span className="status">204</span>: In response to an <code>OPTIONS</code> request.</li>
  <li className="success"><span className="status">304</span>: The <code>config.json</code> file isn't modified based on the <code>Etag</code> sent in the <code>If-None-Match</code> header.</li>
  <li className="error"><span className="status">400</span>: The <code>sdkId</code> is missing.</li>
  <li className="error"><span className="status">404</span>: The <code>sdkId</code> is pointing to a non-existent SDK.</li>
</ul>

</details>

> [More about each available CDN proxy option](#cdn-proxy-options).

#### SDK Usage

In order to let a ConfigCat SDK use the Proxy, you have to set the SDK's `baseUrl` parameter to point to the Proxy's host.
Also, you have to pass the [SDK identifier](#sdk-identifier--sdk-key) as the SDK key.

So, let's assume you set up the Proxy with the following SDK option:

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml title="options.yml"
sdks:
  my_sdk:
    key: "<your-sdk-key>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variables">

```shell
CONFIGCAT_SDKS={"my_sdk":"<your-sdk-key>"}
```

</TabItem>
</Tabs>

The initialization of the SDK that should work with the Proxy will look like this:

```js title="example.js"
import * as configcat from "configcat-js";

var configCatClient = configcat.getClient(
  // highlight-next-line
  "my_sdk", // SDK identifier as SDK key
  configcat.PollingMode.AutoPoll,
  // highlight-next-line
  { baseUrl: "http(s)://localhost:8050" } // Proxy URL
);
```

### API

The API endpoints are for server side feature flag evaluation.

<details>
  <summary><span className="endpoint"><span className="http-method blue">POST</span><span className="http-method gray">OPTIONS</span>/api/&#123;sdkId&#125;/eval</span></summary>

This endpoint evaluates a single feature flag identified by a `key` with the given [user object](/advanced/user-object). 

**Route parameters**:
- `sdkId`: The [SDK identifier](#sdk-identifier--sdk-key) that uniquely identifies an SDK within the Proxy.  

**Request body**:
```json
{
  "key": "<feature-flag-key>",
  "user": {
    "Identifier": "<user-id>",
    "Email": "<user-email>",
    "Country": "<user-country>",
    // any other attribute
  }
}
```

**Responses**:
<ul className="responses">
<li className="success"><span className="status">200</span>: The feature flag evaluation finished successfully.<br/>
<div className="response-body">Response body:</div>

```json
{
  "value": <evaluated-value>,
  "variationId": "<variation-id>"
}
```

</li>
<li className="success"><span className="status">204</span>: In response to an <code>OPTIONS</code> request.</li>
<li className="error"><span className="status">400</span>: The <code>sdkId</code> or the <code>key</code> from the request body is missing.</li>
<li className="error"><span className="status">404</span>: The <code>sdkId</code> is pointing to a non-existent SDK.</li>
</ul>

</details>

<details>
  <summary><span className="endpoint"><span className="http-method blue">POST</span><span className="http-method gray">OPTIONS</span>/api/&#123;sdkId&#125;/eval-all</span></summary>

This endpoint evaluates all feature flags with the given [user object](/advanced/user-object). 

**Route parameters**:
- `sdkId`: The [SDK identifier](#sdk-identifier--sdk-key) that uniquely identifies an SDK within the Proxy.  

**Request body**:
```json
{
  "user": {
    "Identifier": "<user-id>",
    "Email": "<user-email>",
    "Country": "<user-country>",
    // any other attribute
  }
}
```

**Responses**:
<ul className="responses">
<li className="success"><span className="status">200</span>: The evaluation of all feature flags finished successfully.<br/>
<div className="response-body">Response body:</div>

```json
[
  "feature-flag-key-1": {
    "value": <evaluated-value>,
    "variationId": "<variation-id>"
  },
  "feature-flag-key-2": {
    "value": <evaluated-value>,
    "variationId": "<variation-id>"
  }
]
```

</li>
<li className="success"><span className="status">204</span>: In response to an <code>OPTIONS</code> request.</li>
<li className="error"><span className="status">400</span>: The <code>sdkId</code> is missing.</li>
<li className="error"><span className="status">404</span>: The <code>sdkId</code> is pointing to a non-existent SDK.</li>
</ul>

</details>

<details>
  <summary><span className="endpoint"><span className="http-method blue">POST</span><span className="http-method gray">OPTIONS</span>/api/&#123;sdkId&#125;/refresh</span></summary>

This endpoint commands the underlying SDK to download the latest available `config.json`. 

**Route parameters**:
- `sdkId`: The [SDK identifier](#sdk-identifier--sdk-key) that uniquely identifies an SDK within the Proxy.  

**Responses**:
<ul className="responses">
<li className="success"><span className="status">200</span>: The refresh was successful.</li>
<li className="success"><span className="status">204</span>: In response to an <code>OPTIONS</code> request.</li>
<li className="error"><span className="status">400</span>: The <code>sdkId</code> is missing.</li>
<li className="error"><span className="status">404</span>: The <code>sdkId</code> is pointing to a non-existent SDK.</li>
</ul>

</details>

<details>
  <summary><span className="endpoint"><span className="http-method green">GET</span><span className="http-method gray">OPTIONS</span>/api/&#123;sdkId&#125;/keys</span></summary>

This endpoint returns all feature flag keys belonging to the given [SDK identifier](#sdk-identifier--sdk-key). 

**Route parameters**:
- `sdkId`: The [SDK identifier](#sdk-identifier--sdk-key) that uniquely identifies an SDK within the Proxy.  

**Responses**:
<ul className="responses">
<li className="success"><span className="status">200</span>: The keys are returned successfully.<br/>
<div className="response-body">Response body:</div>

```json
{
  "keys": [
    "feature-flag-key-1",
    "feature-flag-key-1"
  ]
}
```

</li>
<li className="success"><span className="status">204</span>: In response to an <code>OPTIONS</code> request.</li>
<li className="error"><span className="status">400</span>: The <code>sdkId</code> is missing.</li>
<li className="error"><span className="status">404</span>: The <code>sdkId</code> is pointing to a non-existent SDK.</li>
</ul>

</details>

> [More about each available API option](#api-options).

### SSE

The SSE endpoint allows you to subscribe for feature flag value changes through <a target="blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events">Server-Sent Events</a> connections.

<details>
  <summary><span className="endpoint"><span className="http-method green">GET</span><span className="http-method gray">OPTIONS</span>/sse/&#123;sdkId&#125;/eval/&#123;data&#125;</span></summary> 

This endpoint subscribes to a single flag's changes. Whenever the watched flag's value changes, the Proxy sends the new value to each connected client.

**Route parameters**:
- `sdkId`: The [SDK identifier](#sdk-identifier--sdk-key) that uniquely identifies an SDK within the Proxy.  
- `data`: The `base64` encoded input data for feature flag evaluation that must contain the feature flag's key and a [user object](/advanced/user-object).

**Responses**:
<ul className="responses">
<li className="success"><span className="status">200</span>: The SSE connection established successfully.</li>
<div className="response-body">Response body:</div>

```json
{
  "value": <evaluated-value>,
  "variationId": "<variation-id>"
}
```

<li className="success"><span className="status">204</span>: In response to an <code>OPTIONS</code> request.</li>
<li className="error"><span className="status">400</span>: The <code>sdkId</code>, <code>data</code>, or the <code>key</code> attribute of <code>data</code> is missing.</li>
<li className="error"><span className="status">404</span>: The <code>sdkId</code> is pointing to a non-existent SDK.</li>
</ul>

**Example**:
```js title="example.js"
const rawData = {
  key: "<feature-flag-key>",
  user: {
    Identifier: "<user-id>",
    Email: "<user-email>",
    Country: "<user-country>",
    // any other attribute
  }
}

const data = btoa(JSON.stringify(rawData))
const evtSource = new EventSource("http(s)://localhost:8050/sse/my_sdk/eval/" + data);
evtSource.onmessage = (event) => {
  console.log(event.data); // {"value":<evaluated-value>,"variationId":"<variation-id>"}
};
```

</details>

<details>
  <summary><span className="endpoint"><span className="http-method green">GET</span><span className="http-method gray">OPTIONS</span>/sse/&#123;sdkId&#125;/eval-all/&#123;data&#125;</span></summary> 

This endpoint subscribes to all feature flags' changes behind the given [SDK identifier](#sdk-identifier--sdk-key). When any of the watched flags' value change, the Proxy sends its new value to each connected client.

**Route parameters**:
- `sdkId`: The [SDK identifier](#sdk-identifier--sdk-key) that uniquely identifies an SDK within the Proxy.  
- `data`: **Optional**. The `base64` encoded input data for feature flag evaluation that contains a [user object](/advanced/user-object).

**Responses**:
<ul className="responses">
<li className="success"><span className="status">200</span>: The SSE connection established successfully.</li>
<div className="response-body">Response body:</div>

```json
[
  "feature-flag-key-1": {
    "value": <evaluated-value>,
    "variationId": "<variation-id>"
  },
  "feature-flag-key-2": {
    "value": <evaluated-value>,
    "variationId": "<variation-id>"
  }
]
```

<li className="success"><span className="status">204</span>: In response to an <code>OPTIONS</code> request.</li>
<li className="error"><span className="status">400</span>: The <code>sdkId</code> is missing.</li>
<li className="error"><span className="status">404</span>: The <code>sdkId</code> is pointing to a non-existent SDK.</li>
</ul>

**Example**:
```js title="example.js"
const rawData = {
  user: {
    Identifier: "<user-id>",
    Email: "<user-email>",
    Country: "<user-country>",
    // any other attribute
  }
}

const data = btoa(JSON.stringify(rawData))
const evtSource = new EventSource("http(s)://localhost:8050/sse/my_sdk/eval-all/" + data);
evtSource.onmessage = (event) => {
  console.log(event.data); // {"feature-flag-key":{"value":<evaluated-value>,"variationId":"<variation-id>"}}
};
```

</details>

> [More about each available SSE option](#sse-options).

### Webhook

Through the webhook endpoint, you can notify the Proxy about the availability of new feature flag evaluation data. Also, with the appropriate [SDK options](#additional-sdk-options), the Proxy can [validate the signature](/advanced/notifications-webhooks/#verifying-webhook-requests) of each incoming webhook request.

<details open>
  <summary><span className="endpoint"><span className="http-method green">GET</span><span className="http-method blue">POST</span>/hook/&#123;sdkId&#125;</span></summary>

Notifies the Proxy that the SDK with the given [SDK identifier](#sdk-identifier--sdk-key) must refresh its `config.json` to the latest version. 

**Route parameters**:
- `sdkId`: The [SDK identifier](#sdk-identifier--sdk-key) that uniquely identifies an SDK within the Proxy.  

**Responses**:
<ul className="responses">
<li className="success"><span className="status">200</span>: The Proxy accepted the notification.</li>
<li className="error"><span className="status">400</span>: The <code>sdkId</code> is missing or the <a href="/advanced/notifications-webhooks/#verifying-webhook-requests">webhook signature validation</a> failed.</li>
<li className="error"><span className="status">404</span>: The <code>sdkId</code> is pointing to a non-existent SDK.</li>
</ul>

</details>

> [More about each available webhook option](#webhook-options).

You can set up webhooks to invoke the Proxy on the <a target="blank" href="https://app.configcat.com/product/webhooks">Webhooks page</a> of the ConfigCat Dashboard.

<img className="bordered zoomable" src="/docs/assets/proxy/webhook.png" alt="Webhook" />

## gRPC

The ConfigCat Proxy can communicate over <a target="blank" href="https://grpc.io">gRPC</a>, an open-source, high-performance RPC framework with client support in several languages.

To establish gRPC connections, you'll need the protobuf and the gRPC <a target="blank" href="https://github.com/configcat/configcat-proxy/blob/main/grpc/proto/flag_service.proto">service definition</a>. It's required to generate clients with <a target="blank" href="https://protobuf.dev/downloads/">`protoc`</a> for your <a target="blank" href="https://protobuf.dev/reference/">desired platform</a>. 

```protobuf title="flag_service.proto"
syntax = "proto3";

package configcat;

import "google/protobuf/empty.proto";

// Service that contains feature flag evaluation procedures.
service FlagService {
  // Stream for getting notified when a feature flag's value changes.
  rpc EvalFlagStream(EvalRequest) returns (stream EvalResponse) {}
  // Stream for getting notified when any feature flag's value changes.
  rpc EvalAllFlagsStream(EvalRequest) returns (stream EvalAllResponse) {}

  // Evaluates a feature flag.
  rpc EvalFlag(EvalRequest) returns (EvalResponse) {}
  // Evaluates each feature flag.
  rpc EvalAllFlags(EvalRequest) returns (EvalAllResponse) {}
  // Requests the keys of each feature flag.
  rpc GetKeys(KeysRequest) returns (KeysResponse) {}
  // Commands the underlying SDK to refresh its evaluation data.
  rpc Refresh(RefreshRequest) returns (google.protobuf.Empty) {}
}

// Feature flag evaluation request message.
message EvalRequest {
  // The SDK identifier.
  string sdk_id = 1;
  // The feature flag's key to evaluate.
  string key = 2;
  // The user object.
  map<string, string> user = 3;
}

// Feature flag evaluation response message.
message EvalResponse {
  // The evaluated value.
  oneof value {
    int32 int_value = 1;
    double double_value = 2;
    string string_value = 3;
    bool bool_value = 4;
  }
  // The variation ID.
  string variation_id = 5;
}

// Response message that contains the evaluation result of each feature flag.
message EvalAllResponse {
  // The evaluated value of each feature flag.
  map<string, EvalResponse> values = 1;
}

// Request message for getting each available feature flag's key.
message KeysRequest {
  // The SDK identifier.
  string sdk_id = 1;
}

// Response message that contains each available feature flag's key.
message KeysResponse {
  // The keys of each feature flag.
  repeated string keys = 1;
}

// Request message for the given SDK to refresh its evaluation data.
message RefreshRequest {
  // The SDK identifier.
  string sdk_id = 1;
}
```

In order to secure the gRPC communication with the Proxy, set up [TLS](#tls).

> [More about each available gRPC option](#grpc).

### Client Usage

The following example uses a generated Go client, but gRPC clients generated for other languages are working as well.

```go title="example.go"
opts := []grpc.DialOption{
    grpc.WithBlock(),
    grpc.WithTransportCredentials(credentials.NewTLS(&tls.Config{
        // Any TLS options
    })),
}

conn, err := grpc.DialContext(context.Background(), 
    // highlight-next-line
    "localhost:50051", // Proxy host and gRPC port
    opts...)
if err != nil {
    panic(err)
}

defer func() {
    _ = conn.Close()
}()

client := proto.NewFlagServiceClient(conn)

ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

resp, err := client.EvalFlag(ctx, &proto.EvalRequest{
    SdkId: "my_sdk", 
    Key: "<flag-key>", 
    User: map[string]string{"Identifier": "<user-id>"}
})
if err != nil {
    panic(err)
}

fmt.Printf("Evaluation result: %v", resp.GetBoolValue())
```

## Monitoring

This section will go through the monitoring possibilities.

### Status

The Proxy provides health status information about its components on the following endpoint:

<details open>
  <summary><span className="endpoint"><span className="http-method green">GET</span><span className="http-method gray">OPTIONS</span>/status</span></summary>

The Proxy regularly checks whether the underlying SDKs can communicate with their configured source and with the cache. This endpoint returns the actual state of these checks.

If everything is operational, each `status` node shows the value `healthy`. If an SDK could not connect to its source, it'll put an error to its `records` collection. 
If a component's last two records are errors, its `status` will switch to `degraded`. 
If a component becomes operational again it'll put an `[ok]` to the `records` and will switch to `healthy` again. 

The root `status` is `healthy` if all of the SDKs are `healthy`. If any of the SDKs become `degraded`, the root will also switch to `degraded`.

**Responses**:
<ul className="responses">
<li className="success"><span className="status">200</span>: The status returned successfully.</li>
<li className="success"><span className="status">204</span>: In response to an <code>OPTIONS</code> request.</li>
</ul>

**Example Response**:
```json
{
  "status": "healthy",
  "sdks": {
    "my_sdk": {
      "key": "****************************************hwTYg",
      "mode": "online",
      "source": {
        "type": "remote",
        "status": "healthy",
        "records": [
          "Mon, 29 May 2023 16:36:40 UTC: [ok] config fetched"
        ]
      }
    },
    "another_sdk": {
      "key": "****************************************ovVnQ",
      "mode": "offline",
      "source": {
        "type": "cache",
        "status": "healthy",
        "records": [
          "Mon, 29 May 2023 16:36:40 UTC: [ok] reload from cache succeeded",
          "Mon, 29 May 2023 16:36:45 UTC: [ok] config from cache not modified"
        ]
      }
    }
  },
  "cache": {
    "status": "healthy",
    "records": [
      "Mon, 29 May 2023 16:36:40 UTC: [ok] cache read succeeded",
      "Mon, 29 May 2023 16:36:40 UTC: [ok] cache write succeeded",
      "Mon, 29 May 2023 16:36:40 UTC: [ok] cache read succeeded",
      "Mon, 29 May 2023 16:36:45 UTC: [ok] cache read succeeded"
    ]
  }
}
```

</details>

### Prometheus Metrics

You can set up the Proxy to export metrics about its internal state in Prometheus format. These metrics are served via the `/metrics` endpoint on a specific port, so you can separate it from the public HTTP communication. The default port is `8051`.

The following metrics are exported:

<table className="proxy-arg-table">
<thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>

`configcat_http_request_duration_seconds`

</td>
<td>
Histogram
</td>
<td>
Histogram of Proxy HTTP response time in seconds.<br/><br/>
Tags:

- `route`: The request's URL path.
- `method`: The request's HTTP method.
- `status`: The response's HTTP status.

</td>
</tr>

<tr>
<td>

`configcat_sdk_http_request_duration_seconds`

</td>
<td>
Histogram
</td>
<td>
Histogram of ConfigCat CDN HTTP response time in seconds.<br/><br/>
Tags:

- `sdk`: The SDK's identifier that initiated the request.
- `route`: The request's URL path.
- `status`: The response's HTTP status.

</td>
</tr>

<tr>
<td>

`configcat_stream_connections`

</td>
<td>
Gauge
</td>
<td>
Number of active client connections per stream.<br/><br/>
Tags:

- `sdk`: The SDK's identifier that handles the connection.
- `type`: `sse` or `grpc`.
- `flag`: The feature flag's key.

</td>
</tr>
</tbody>
</table>

:::info
The Proxy also exports metrics about the Go environment, e.g., `go_goroutines` or `go_memstats_alloc_bytes`, and process-related stats, e.g., `process_cpu_seconds_total`.
:::

To integrate with Prometheus, put the following scrape config into your Prometheus configuration that points to the Proxy:

```yaml
scrape_configs:
  - job_name: configcat_proxy
    metrics_path: /metrics
    static_configs:
      - targets:
          - <proxy-host>:8051
```

> [More about each available metrics option](#metrics).