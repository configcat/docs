---
id: requests
title: What is a config JSON download?
description: Learn how the usage & quota works, how the number of config JSON downloads is counted and how to lower your monthly usage.
---

A config JSON download is counted every time your application downloads a configuration file from the ConfigCat
CDN. The frequency of these downloads is totally under your control. Between downloads you can access your feature
flags as many times as you like, it still counts as one.

See an <a href="https://configcat.com/architecture/" target="_blank">overview of the ConfigCat architecture</a>.

Use the <a href="https://configcat.com/calculator/" target="_blank">Plan Calculator</a> to get your estimated config JSON downloads.

Keep track of the number of config JSON downloads your apps are making on the <a href="https://app.configcat.com/product/usage" target="_blank">Usage & Quota page.</a>

<img src="/docs/assets/stats.png" className="zoomable" alt="ConfigCat Statistics" />

## Current config JSON download limits

### Shared infrastructure

The following plans run on shared infrastructure. So all customers use the same API nodes and Config Delivery Network (CDN).

| Plan           | total req/month | avg. req/sec | max. spike req/s |
| -------------- | --------------: | -----------: | ---------------: |
| **Free**       |       5,000,000 |           ~2 |               ~4 |
| **Pro**        |      25,000,000 |          ~10 |              ~20 |
| **Smart**      |     250,000,000 |         ~100 |             ~200 |
| **Enterprise** |   1,000,000,000 |         ~400 |             ~800 |

Use the <a href="https://configcat.com/calculator/" target="_blank">Plan Calculator</a> to get your estimated config JSON downloads.

:::info
If you hit this limit, we will keep your application up and running. However, you can expect us to contact you on how we can meet your needs.
:::

### Dedicated infrastructure

The following plans include dedicated API and CDN nodes.

#### Hosted

Runs on dedicated servers provided by ConfigCat.
The basic package includes:

- 1x API node
- 6x CDN nodes

|                               | total req/month | avg. req/sec | max. spike req/s |
| ----------------------------- | --------------: | -----------: | ---------------: |
| **Basic package**             |   6,000,000,000 |        ~2400 |            ~4800 |
| **Every additional CDN node** | + 1,000,000,000 |         ~400 |             ~800 |

#### On-Premise (Self-hosted)

Runs on the customer's own servers. We suggest <a href="https://configcat.com/support/" target="_blank">contacting ConfigCat's engineering</a>
team on exact requirements and performance.

## config JSON downloads

The ConfigCat SDK - which you import into your applications - downloads your feature flags and settings in the
form of a config JSON file from the ConfigCat CDN and caches it locally.

## `GetValue()` call is NOT a config JSON download

Reading feature flag and setting values from cache with `GetValue()` is not considered as a config JSON download.
If the cache is empty (e.g: on application launch) or expired, a config JSON will be downloaded then all coming `GetValue()`
calls served from cache.

## Example use cases

### Frontend/mobile/desktop applications

Typically, you have a high number of frontend/mobile/desktop application instances. Their number is determined by your user count.

#### Example: A standard web application with 15k active users

Web apps run in the browser, so for each user there will be a different ConfigCat SDK instance running.
In this example, we have 15,000 active users who usually spend 5 hours on your web application per month.
The ConfigCat SDK is set to Auto polling mode with 60 seconds polling interval.

> **18,000** _(5 hours in seconds)_ / **60** _polling interval_ = **300 config JSON downloads/user/month**  
> **15,000** _(users)_ × **300** _(config JSON downloads/user/month)_ = **4,500,000 config JSON downloads / month**

#### Example: A mobile application running on 5k devices 24/7

Having a mobile app which runs on the devices as a background process. The ConfigCat SDK is set to Auto polling mode with 1 hour polling interval.
Your application runs on 5,000 devices.

> **5,000** _(devices)_ × **730** _(hours in a month)_ = **3,650,000 config JSON downloads / month**

### Backend applications

Backend applications typically have a lower number of instances than frontend applications.

#### Example: Average frequency polling in 4 instances

Let’s say you have an API for your frontend application and you have 4 instances of them behind a load balancer.
All these 4 instances use ConfigCat SDK in auto polling mode with a 1-minute polling interval.

> **4** _(instances)_ × **43,800** _(minutes in a month)_ = **175,200 config JSON downloads / month**

#### Example: High frequency polling in 10 instances

If you want your system to react faster after changing a feature flag in ConfigCat, you can decrease
the default polling interval down to 1 second. In this case we are calculating with 10 running instances.

> **10** _(instances)_ × **2,592,000** _(seconds in a month)_ = **25,920,000 config JSON downloads / month**

## How to lower the monthly config JSON download count?

### Use the ConfigCat Client as a Singleton

Make sure that you use the _ConfigCat Client_ as a Singleton object in your application code.
If you want to use multiple SDK Keys in the same application, create only one _ConfigCat Client_ per SDK Key.

### Increase the polling interval

You can lower the frequency your application downloads the `config JSON` by setting larger polling intervals or using a different [polling mode](/advanced/caching) other than the default auto polling. See the [SDK References for more.](/sdk-reference/overview)

### Use webhooks

In a backend application, you might want to try using [Webhooks.](/advanced/notifications-webhooks) This way your application gets notified about changes and downloads the `config JSON` only when it is needed.

### Call your backend instead of the ConfigCat CDN

In the case of a frontend application, you can lower the number of calls made towards the ConfigCat CDN by moving the evaluation logic from the frontend application to your backend.
