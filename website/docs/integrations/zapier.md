---
id: zapier
title: Zapier
---
## Connect ConfigCat to hundreds of other apps with Zapier

<a href="https://zapier.com/apps/configcat/integrations" target="_blank">ConfigCat's Zap</a> lets you connect ConfigCat to 2,000+ other web services. Automated connections called Zaps, set up in minutes with no coding, can automate your day-to-day tasks and build workflows between apps that otherwise wouldn't be possible.

Each Zap has one app as the **Trigger**, where your information comes from and which causes one or more **Actions** in other apps, where your data gets sent automatically. 

<a href="https://zapier.com/apps/configcat/integrations" target="_blank">ConfigCat's Zap</a> can notify you about Feature Flags or Settings changes in ConfigCat so you can easily send e.g. a Slack message/e-mail when somebody changed Feature Flags or Settings in ConfigCat.


## Setup

1. Log in to your <a href="https://zapier.com/sign-up" target="_blank">Zapier account</a> or create a new account.

2. Navigate to "My Apps" from the top menu bar.

3. Now click on "Connect a new account..." and search for "ConfigCat"

![zapier_signin](/assets/zapier_signin.png)

1. Generate a Public API credential at <a href="https://app.configcat.com/my-account/public-api-credentials" target="_blank">ConfigCat Dashboard</a>. 
   Use the generated `Basic auth user name` and `Basic auth password` to connect your ConfigCat account to Zapier.

![zapier_auth](/assets/zapier_auth.png)

1. You should select the [Product](/main-concepts#product) in which you want to get notified about the Feature Flag or Setting value changes and optionally you can filter these notifications by specific [Configs](/main-concepts#config) or [Environments](/main-concepts#environment).

![zapier_customize](/assets/zapier_customize.png)

1. Once that's done you can start creating an automation! Use a pre-made Zap or create your own with the Zap Editor. Creating a Zap requires no coding knowledge and you'll be walked step-by-step through the setup. 

2. Need inspiration? See everything that's possible with <a href="https://zapier.com/apps/configcat/integrations" target="_blank">ConfigCat and Zapier</a>.


Available fields to include in your flow:
* **When**: When was the change
* **Who (email), Who (full name)**: Who made the change
* **Where**: To which Config and Environment the change belongs to
* **What**: The exact values that changed

## Use cases

## Example Slack notification setup
### Configuration in Zapier:
![zapier_config](/assets/zapier_config.png)

### Result in Slack:
![zapier_slack](/assets/zapier_slack.png)

## Need help?
<a href="https://configcat.com/support/" target="_blank">Contact us</a> if you need any help or you have any awesome improvement ideas for this Zap.
