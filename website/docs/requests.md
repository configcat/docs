---
id: requests
title: What is a config.json download?
---

A config.json download is counted every time your application downloads a configuration file from the ConfigCat
CDN. The frequency of these downloads is totally under your control. Between downloads you can access your feature
flags as many times as you like, it still counts as one.

See an <a href="https://configcat.com/architecture" target="_blank">overview of the ConfigCat architecture</a>.

Use the  <a href="https://configcat.com/calculator" target="_blank">Plan Calculator</a> to get your estimated config.json downloads.

Keep track of the number of config.json downloads your apps are making on the <a href="https://app.configcat.com/product/statistics" target="_blank">statistics page.</a> 

![ConfigCat Statistics](/assets/stats.png)


# Current config.json download limits
## Shared infrastructure
The following plans run on shared infrastructure. So all customers use the same API nodes and Config Delivery Network (CDN).

| Plan           | total req/month | avg. req/sec | max. spike req/s |
| -------------- | --------------: | -----------: | ---------------: |
| **Free**       |       5,000,000 |           ~2 |               ~4 |
| **Pro**        |      25,000,000 |          ~10 |              ~20 |
| **Smart**      |     250,000,000 |         ~100 |             ~200 |
| **Enterprise** |   1,000,000,000 |         ~400 |             ~800 |

Use the  <a href="https://configcat.com/calculator" target="_blank">Plan Calculator</a> to get your estimated config.json downloads.

:::info
If you hit this limit, we will keep your application up and running. However, you can expect us to contact you on how we can meet your needs.
:::

## Dedicated infrastructure
The following plans include dedicated API and CDN nodes.
### Hosted
Runs on dedicated servers provided by ConfigCat.
The basic package includes:
- 1x API node
- 6x CDN nodes

|                               | total req/month | avg. req/sec | max. spike req/s |
| ----------------------------- | --------------: | -----------: | ---------------: |
| **Basic package**             |   6,000,000,000 |        ~2400 |            ~4800 |
| **Every additional CDN node** | + 1,000,000,000 |         ~400 |             ~800 |

### On-Premise (Self-hosted)
Runs on the customer's own servers. We suggest <a href="https://configcat.com/support" target="_blank">contacting ConfigCat's engineering</a> 
team on exact requirements and performance.

## config.json downloads
The ConfigCat SDK - which you import into your applications - downloads your feature flags and settings in the 
form of a config.json file from the ConfigCat CDN and caches locally.

## `GetValue()` call is NOT a config.json download
Reading feature flag and setting values from cache with `GetValue()` is not considered as a config.json download.
If the cache is empty (e.g: on application launch) or expired, a config.json will be downloaded then all coming `GetValue()`
calls served from cache.

## Example use cases

### Frontend/mobile/desktop applications
Typically, you have a high number of frontend/mobile/desktop application instances. Their number is determined by your user count.

#### Example: A standard web application with 15k active users
Web apps run in the browser, so for each user there will be a different ConfigCat SDK instance running.
In this example, we have 15,000 active users who usually spend 5 hours on your web application per month.
The ConfigCat SDK is set to Auto polling mode with 60 seconds polling interval.

> **18,000** *(5 hours in seconds)* / **60** *polling interval* = **300 config.json downloads/user/month**  
> **15,000** *(users)* * **300** *(config.json downloads/user/month)* = **4,500,000 config.json downloads / month**

#### Example: A mobile application running on 5k devices 24/7
Having a mobile app which runs on the devices as a background process. The ConfigCat SDK is set to Auto polling mode with 1 hour polling interval.  
Your application runs on 5,000 devices.

> **5,000** *(devices)* * **730** *(hours in a month)* = **3,650,000 config.json downloads / month**

### Backend applications
Backend applications typically have a lower number of instances than frontend applications.

#### Example: Average frequency polling in 4 instances
Let’s say you have an API for your frontend application and you have 4 instances of them behind a load balancer. 
All these 4 instances use ConfigCat SDK in auto polling mode with a 1-minute polling interval.

> **4** *(instances)* * **43,800** *(minutes in a month)* = **175,200 config.json downloads / month**

#### Example: High frequency polling in 10 instances
If you want your system to react faster after changing a feature flag in ConfigCat, you can decrease 
the default polling interval down to 1 second. In this case we are calculating with 10 running instances.

> **10** *(instances)* * **2,592,000** *(seconds in a month)* = **25,920,000 config.json downloads / month**

## How to lower the monthly config.json download count?

### Increasing the polling interval
You can lower the frequency your application downloads the `config.json` by setting larger polling intervals or using a different [polling mode](advanced/caching) other than the default auto polling. See the [SDK References for more.](sdk-reference/overview)

### Using Webhooks
In a backend application, you might want to try using [Webhooks.](advanced/notifications-webhooks) This way your application gets notified about changes and downloads the `config.json` only when it is needed.

### Calling your backend instead of the ConfigCat CDN
In the case of a frontend application, you can lower the number of calls made towards the ConfigCat CDN by moving the evaluation logic from the frontend application to your backend.