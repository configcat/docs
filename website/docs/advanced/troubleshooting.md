---
id: troubleshooting
title: Troubleshooting
---
The following issues were reported by customers. We collected what we learned and possible solutions.

## Long response times and connection issues


First, you can verify on the [Service Status Monitor](https://status.configcat.com) that ConfigCat is up and running or if there is planned maintenance.
### General SDK Checklist
1. It might be a good idea to update the ConfigCat SDK to the latest version.
1. Check if you configured the [Data Governance](data-governance) functionality properly.
1. Singleton: We strongly recommend using the ConfigCat SDK as a Singleton. Initializing the SDK over and over again can cause serious performance issues in production.
1. Are you using the proper polling mode for your use case? Details on polling modes in the [SDK Docs](/sdk-reference/overview.md).
1. Might be a too frequent `Auto Polling` interval. Please check the [SDK Docs](/sdk-reference/overview.md).
1. In `Manual Polling` mode, it could be a too frequent `forceRefresh()` call in your code, making the SDK download the config.json often.
1. You can try one of our lightweight sample applications to rule out local issues. Find in the [repository of each SDK](https://github.com/configcat). 

### Network Checklist
:::caution
Please, **do not load test** the ConfigCat production infrastructure without our consent.
:::
1. You can check the response times manually by navigating to `https://cdn.configcat.com/ping.txt` and opening your browser's network tab.
1. Does the machine/server your code runs on has access to the above address?
1. You might need to whitelist the following addresses in your firewall: `cdn.configcat.com`, `cdn-eu.configcat.com`, `cdn-global.configcat.com`.
---
## Too many requests error in Angular
The problem was with Angular's Hot Module Replacement functionality during development. The wrapper class, which contained the auto polling ConfigCat SDK was edited, and the Hot Module Replacement reinitialized the whole class without releasing the old, replaced module's Auto Polling timer.
We believe that this is a really rare case, it could happen only during development.