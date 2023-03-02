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
