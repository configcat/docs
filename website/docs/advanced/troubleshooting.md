---
id: troubleshooting
title: Troubleshooting
---
The following issues were reported by customers. We collected what we learned and possible solutions.

## Long response times and connection issues


First, verify that ConfigCat is up and running of if there is no planned maintenance: [Service Status Monitor](https://status.configcat.com).
### General SDK Checklist
2. It might be a good idea to update the ConfigCat SDK to the latest version.
3. Check if you configured the [Data Governance](data-governance) functionality properly.
4. Singleton: We strongly recommend using the ConfigCat SDK as a Singleton. Initializing the SDK over and over again can cause serious performance issues in production.
5. Are you using the proper polling mode for your use case? Details on polling modes in the [SDK Docs](/sdk-reference/overview.md).
6. Might be a too frequent `Auto Polling` interval. Please check the [SDK Docs](/sdk-reference/overview.md).
7. In `Manual Polling` mode it could be a too frequent `forceRefresh()` call in your code, making the SDK download the config.json often.
8. You can try one of our lightweight sample applications to rule out local issues. Find in the [repository of each SDK](https://github.com/configcat). 

### Network Checklist
:::caution
Please, **do not load test** the ConfigCat production infrastructure without our consent.
:::
1. You can check the response times manually by navigating to `https://cdn.configcat.com/ping.txt` and opening your browser's network tab.
2. Does the machine/server your code runs on has access to the above address?
3. You might need to whitelist the following addresses in your firewall: `cdn.configcat.com`, `cdn-eu.configcat.com`, `cdn-global.configcat.com`.
---
## Too many requests
The problem was with Angular's Hot Module Replacement functionality during development. The wrapper class which contained the auto polling ConfigCat SDK was edited, and the Hot Module Replacement reinitialized the whole class without releasing the old, replaced module's Auto Polling timer.
We believe that this is a really rare case, it could happen only during development.