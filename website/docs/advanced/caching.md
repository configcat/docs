---
id: caching
title: Polling modes & Caching
description: This section describes how to use the SDK's caching feature. There are three different polling modes available in the ConfigCat SDKs.
---

There are 3 different ways (polling modes) to control caching.

## Auto polling (default)

In auto polling mode, the ConfigCat SDK downloads the latest values automatically and stores them in the cache.
This is done in every 60 seconds by default.
You can set the polling interval to any number between 1 second and int max.

## Lazy loading

In lazy loading mode, the ConfigCat SDK downloads the latest setting values only if they are not present in the cache, or if the cache has expired.
You can set the cache Time To Live (TTL) to any number also.

## Manual polling

Manual polling gives you full control over when the `config JSON` (with the setting values) is downloaded.
The ConfigCat SDK will not download the `config JSON` automatically.
You can (and should) update the cache manually, by calling a `forceRefresh()` - this will download the latest `config JSON` and update the cache.

This animation explains the different polling modes:

<figure className="video-container">
<iframe width="100%" src="https://www.youtube.com/embed/_LWPjR4_GqA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</figure>

## Caching

ConfigCat SDKs in their default setup store all the information they need for feature flag evaluation in memory. This behavior is extendable with custom cache implementations that you can use for pointing the SDK to your own data storage.

The main reason for caching is to accelerate serving feature flag evaluation requests when your application is in a stateless environment or frequently restarts.
When the SDK notices that it has a valid cache entry to work with, it will use the data from the cache rather than initiating a new HTTP request towards ConfigCat.
The cache's validity is based on the polling interval in case of [auto polling](#auto-polling-default) or on the TTL in case of [lazy loading](#lazy-loading).

:::info
See the [SDK specific docs](/docs/sdk-reference/overview) of your desired platform for how to use custom cache implementations.
:::

### Offline mode

ConfigCat SDKs has the capability to go offline. In offline mode they work only from the configured cache and never communicate with ConfigCat over HTTP. 

This allows you to set up a centralized cache that only one online ConfigCat SDK writes, but serves many offline ones.

:::info
See the [SDK specific docs](/docs/sdk-reference/overview) of your desired platform for how to enable offline mode.
:::

### Shared cache

As of certain versions, ConfigCat SDKs support using a shared cache. To achieve that, each SDK constructs the key for identifying a specific cache entry based on the SDK key passed at initialization. This means each platform specific SDK that uses the same SDK key will use the same cache entry.

Mixing this behavior with [offline mode](#offline-mode), you can have a centralized shared cache that serves many SDKs regardless of what platform they run on.

Support for shared caching was introduced in these SDK versions:

| SDK     | Version                                                                |
| ------- | ---------------------------------------------------------------------- |
| .NET    | [v8.1.0](https://github.com/configcat/.net-sdk/releases/tag/v8.1.0)    |
| C++     | TBA                                                                    |
| Dart    | TBA                                                                    |
| Elixir  | TBA                                                                    |
| Go      | TBA                                                                    |
| Java    | [v8.2.0](https://github.com/configcat/java-sdk/releases/tag/v8.2.0)    |
| Android | [v9.0.0](https://github.com/configcat/android-sdk/releases/tag/v9.0.0) |
| JS      | [v8.0.0](https://github.com/configcat/js-sdk/releases/tag/v8.0.0)      |
| JS SSR  | [v7.0.0](https://github.com/configcat/js-ssr-sdk/releases/tag/v7.0.0)  |
| React   | [v3.0.0](https://github.com/configcat/react-sdk/releases/tag/v3.0.0)   |
| Kotlin  | [v2.0.0](https://github.com/configcat/kotlin-sdk/releases/tag/2.0.0)   |
| Node    | [v10.0.0](https://github.com/configcat/node-sdk/releases/tag/v10.0.0)  |
| PHP     | TBA                                                                    |
| Python  | TBA                                                                    |
| Ruby    | TBA                                                                    |
| Swift   | TBA                                                                    |
