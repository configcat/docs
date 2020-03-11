---
id: zapier
title: Zapier
---

The [ConfigCat Zap](https://zapier.com/developer/public-invite/90616/693fd87b5bb34ea90583f7d7ce216223/) is currently under review by the Zapier team. You can try the beta version with the [public invitation link](https://zapier.com/developer/public-invite/90616/693fd87b5bb34ea90583f7d7ce216223/).

This Zap can notify you about Feature Flags or Settings changes in ConfigCat so you can easily send e.g. a Slack message/e-mail when somebody changed Feature Flags or Settings in ConfigCat.

## Setup

1. Open the [public invitation link](https://zapier.com/developer/public-invite/90616/693fd87b5bb34ea90583f7d7ce216223/) and click Accept Invite & Build a Zap

2. Create a new Zap and select ConfigCat at Choose App & Event.

3. The ConfigCat Zap currently supports a Trigger Event - Feature Flag & Setting value changed. Click continue to select it.
> [Contact us](https://configcat.com/support) if you have any awesome ideas to include in this Zap.

4. Generate a Public API credential at [ConfigCat Dashboard](https://app.configcat.com/my-account/public-api-credentials). Use the generated `Basic auth user name` and `Basic auth password` during the Zapier authentication flow. Click continue.

5. You should select the [Product](main-concepts/#product) in which you want to get notified about the Feature Flag or Setting value changes and optionally you can filter these notifications by specific [Configs](main-concepts/#config) or [Environments](main-concepts/#environment).

6. Make sure you have changed a Feature Flag or Setting value in ConfigCat in the past 1 hour so Zapier can poll those changes from ConfigCat. Optionally you can skip this Find data step at all.

7. Add an App or Event to use the Feature Flag or Setting value change data in your flows.

## Need help?
[Contact us](https://configcat.com/support) if you need any help or you have any awesome improvement ideas for this Zap.