---
id: requests
title: Guaranteed requests
---

At ConfigCat we only limit the requests which are sent to the ConfigCat servers from your applications.  
We don't limit on MAUs (Monthly Active Users) or any other fictional measurements which are hard to predict or calculate.

Check out our architectural overview to <a href="https://configcat.com/Home/Architecture" target="_blank">learn more</a>.

## How this request limitation works in real life?
Each plan has its own request limitation.
| Plan          | requests/month | requests/second |
| ------------- | --------------: | ---: |
| **Free**      | 5,000,000      | ~2    |
| **Pro**       | 25,000,000     | ~10   |
| **Unlimited** | 250,000,000    | ~100  |
| **Dedicated** | 5,000,000,000  | ~2000 |

> If you hit this limit we will keep your application up and running. You can expect us contacting you on how we can meet your needs.

## What is a request?
ConfigCat SDKs - which you include in your applications - are downloading and caching a config.json from the ConfigCat servers.  
This config.json contains a Config's all feature flags or setting, all of targeting rules and % options for a specific environment. These Config-Environment pairs are referred as the API Keys in the ConfigCat SDKs.  
A config.json download from our servers counts as 1 request.

## What is NOT a request?
As long as the config.json is in the SDK's cache and it is not expired, none of the `GetValue()` calls counts as requests. The `GetValue()` calls are evaluated in the ConfigCat SDK in your application from the cache.

## How are the ConfigCat SDKs caching the config.jsons?
We have different approaches called polling modes in our SDKs.

Check out our video how the polling modes actually work.

<iframe width="800" height="490" src="https://www.youtube.com/embed/_LWPjR4_GqA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Auto polling (default mode in the SDKs)
In auto polling mode the ConfigCat SDK downloads the latest values and stores them automatically. This is done in every 60 seconds by default. Feature flag values are served from local cache.
### Lazy loading
In lazy loading mode the ConfigCat SDK downloads the latest setting values only if they are not present or expired in the cache.
### Manual polling
Manual polling gives you full control over when the setting values are downloaded. ConfigCat SDK will not update them automatically.
### +1: Webhooks
In addition you can always call the `ForceRefresh()` in every polling mode to be sure that the newest config.json is downloaded (one request) and stored in the cache.
This is particularly useful when you use ConfigCat's Webhooks. The webhooks can notify your applications on every feature flag or setting change and when this occurs you can call the ForceRefresh in your application.

You can also use webhooks to get notified about feature flag or setting changes via PubNub. <a href="https://github.com/configcat/node-sdk/tree/master/samples/realtimeupdate" target="_blank">Check out</a> our sample application

## Example request number calculations

### Backend applications
Backend applications typically run on your servers in a limited instance count.

#### Example 1
Let’s say you have an API for your frontend application and you have 4 instances of them behind a load balancer. 
All these 4 instances use ConfigCat SDK in auto polling mode with a 1 minute polling interval.

> **4** *(instances)* * **43,800** *(minutes in a month)* = **175,200 requests / month**

#### Example 2
If you want faster response times after changing a feature flag in ConfigCat you can decrease the default polling interval down to 1 seconds. In this case we are calculating with 10 running instances from your application.

> **10** *(instances)* * **2,592,000** *(seconds in a month)* = **25,920,000 requests / month**

### Frontend/mobile/desktop applications
Frontend/mobile/desktop applications are usually running in lots of instances determined by your users count.

#### Example 3
Your web application runs in your users' browsers so all of your users are running a ConfigCat SDK instance in their browsers.  
You have 15,000 active users who are usually spend 5 hours on your web application per month.  
The ConfigCat SDK is configured to Auto polling with the default 60 seconds polling interval.

> **18,000** *(5 hours in seconds)* / **60** *polling interval* = **300 requests/user/month**  
> **15,000** *(users)* * **300** *(requests/user/month)* = **4,500,000 requests / month**

#### Example 4
You have a mobile application which runs in your users devices as a background process. The ConfigCat SDK is configured to Auto polling with 1 hour polling interval.  
Your application runs on 5,000 different devices.

> **5,000** *(devices)* * **730** *(hours in a month)* = **3,650,000 requests / month**