---
id: requests
title: What is a Request?
---

A request is counted every time your application downloads a configuration file from the ConfigCat
CDN. The frequency of these downloads is totally under your control. Between downloads you can access your feature
flags as many times as you like, it still counts as one.

Keep track of the number of requests your apps are making on the <a href="https://app.configcat.com/product/statistics" target="_blank">statistics page.</a> 

![ConfigCat Statistics](/assets/stats.png)

Here is an <a href="https://configcat.com/architecture" target="_blank">overview of the ConfigCat architecture</a>.

# Current request number limits
## Shared infrastructure
The following plans run on shared infrastructure. So all customers use the same API nodes and Config Delivery Network (CDN).

| Plan           | total req/month | avg. req/sec | max. spike req/s |
| -------------- | --------------: | -----------: | ---------------: |
| **Free**       |       5,000,000 |           ~2 |               ~4 |
| **Pro**        |      25,000,000 |          ~10 |              ~20 |
| **Smart**      |     250,000,000 |         ~100 |             ~200 |
| **Enterprise** |   1,000,000,000 |         ~400 |             ~800 |

:::info
If you hit this limit, we will keep your application up and running. However, you can expect us contacting you on how we can meet your needs.
:::

## Dedicated infrastructure
The following plans include dedicated API and CDN nodes.
### Hosted
Runs on dedicated servers provided by ConfigCat.
The basic package includes:
- 1x API node
- 6x CDN nodes (3 pairs, 1 pair in every location)

|                               | total req/month | avg. req/sec | max. spike req/s |
| ----------------------------- | --------------: | -----------: | ---------------: |
| **Basic package**             |   6,000,000,000 |        ~2400 |            ~4800 |
| **Every additional CDN node** | + 1,000,000,000 |         ~400 |             ~800 |

### On-Premise (Self hosted)
Runs on the customer's own servers. We suggest <a href="https://configcat.com/support" target="_blank">contacting ConfigCat's engineering</a> team on exact requirements and performance.

## What is a request?
The ConfigCat SDKs - which you import into your applications - download your feature flags and settings in the 
form of a config.json from the ConfigCat CDN and cache it locally. One config.json download counts as 1 request.

## What is NOT a request?
Reading feature flag and setting values from the cache is not considered a request.
You can call `GetValue()` as many times as you like.
These calls are always evaluated on the client side.

## Example use cases

### Frontend/mobile/desktop applications
Typically, you have a high number of frontend/mobile/desktop application instances. Their number is determined by your user count.

#### Example: A standard web application with 15k active users
Web apps run in the browser, so for each user there will be a different ConfigCat SDK instance running.
In this example, we have 15,000 active users who usually spend 5 hours on your web application per month.
The ConfigCat SDK is set to Auto polling mode with 60 seconds polling interval.

> **18,000** *(5 hours in seconds)* / **60** *polling interval* = **300 requests/user/month**  
> **15,000** *(users)* * **300** *(requests/user/month)* = **4,500,000 requests / month**

#### Example: A mobile application running on 5k devices 24/7
Having a mobile app which runs on the devices as a background process. The ConfigCat SDK is set to Auto polling mode with 1 hour polling interval.  
Your application runs on 5,000 devices.

> **5,000** *(devices)* * **730** *(hours in a month)* = **3,650,000 requests / month**

### Backend applications
Backend applications typically have a lower number of instances than frontend applications.

#### Example: Average frequency polling in 4 instances
Let’s say you have an API for your frontend application and you have 4 instances of them behind a load balancer. 
All these 4 instances use ConfigCat SDK in auto polling mode with a 1 minute polling interval.

> **4** *(instances)* * **43,800** *(minutes in a month)* = **175,200 requests / month**

#### Example: High frequency polling in 10 instances
If you want your system to react faster after changing a feature flag in ConfigCat, you can decrease 
the default polling interval down to 1 seconds. In this case we are calculating with 10 running instances.

> **10** *(instances)* * **2,592,000** *(seconds in a month)* = **25,920,000 requests / month**

## About caching
There are 3 different ways (polling modes) to control caching.

This animation explains the different polling modes:

<figure class="video-container">
<iframe width="100%" src="https://www.youtube.com/embed/_LWPjR4_GqA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</figure>

### Auto polling (default)
In auto polling mode, the ConfigCat SDK downloads the latest values automatically and stores them in the cache.
This is done in every 60 seconds by default.
You can set the polling interval to any number between 1 second and int max.
### Lazy loading
In lazy loading mode, the ConfigCat SDK downloads the latest setting values only if they are not present in the cache, or if the cache has expired.
You can set the cache Time To Leave (TTL) to any number also.
### Manual polling
Manual polling gives you full control over when the setting values are downloaded.
The ConfigCat SDK will not update them automatically.
You can (and should) update the cache manually, by calling a `forceRefresh()` - this will download the latest values and update the cache.
#### Webhooks
Additionally, there are Webhooks available to get notified about changes instantly.
[Read more about Webhooks.](advanced/notifications-webhooks.md)