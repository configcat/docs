---
id: zoho-flow
title: Zoho Flow
---
## Connect ConfigCat to 500+ apps with Zoho Flow

<a href="https://www.zoho.com/flow/apps/configcat/integrations" target="_blank">ConfigCat's Zoho Flow integration</a> helps you connect ConfigCat to 500+ other web apps without any code. It helps you automate day-to-day tasks and build complex business workflows within minutes.

You can set **triggers**, add **actions**, use **Delays and Decisions** to create your entire workflow on an easy to use builder.

<a href="https://www.zoho.com/flow/apps/configcat/integrations" target="_blank">ConfigCat's Zoho Flow integration</a> can notify you about Feature Flags or Settings changes in ConfigCat, so you can configure e.g. with Slack to send a message about the changes applied in the ConfigCat environment.


## Setup

1. Log in to your <a href="https://www.zoho.com/flow/" target="_blank">Zoho Flow account</a> or create a new one.

1. Navigate to `My Flows` on the side menu bar.

1. Click on `CREATE FLOW`, fill the name and description boxes then click on `CREATE`.

1. Select the `App` trigger by clicking it's `CONFIGURE` button.

![zoho_trigger](/assets/zoho/select_trigger.png)

1. Search for **ConfigCat**, select it and hit the `NEXT` button.

![zoho_cc_search](/assets/zoho/cc_trigger.png)

1. On the `Choose ConfigCat Trigger` pane select the `Audit event occured` trigger.

![zoho_audit_trigger](/assets/zoho/audit_select.png)

1. On the next pane you have to connect the integration with your ConfigCat environment. Hit the `Connect` button.

![zoho_connect](/assets/zoho/connect.png)
      
1. Generate a Public API credential at <a href="https://app.configcat.com/my-account/public-api-credentials" target="_blank">ConfigCat Dashboard</a>. 

1. Use the generated `Basic auth user name` and `Basic auth password` to connect your ConfigCat account to Zoho Flow.

![zoho_fill_form](/assets/zoho/fill_connect_form.png)

1. On the next pane you have to select the ConfigCat [Product](/main-concepts#product), [Config](/main-concepts#config) and [Environment](/main-concepts#environment) you want to be notified about. Optionally, you can set filter conditions to control exactly when should the trigger fire.

![zoho_product_config_environment](/assets/select_product_config_environment.png)

1. Once that's done you can continue to build your flow, the trigger is handled by ConfigCat!

1. Need inspiration? See how much <a href="https://www.zoho.com/flow/apps/" target="_blank">app you can connect</a> to ConfigCat.

## Example Slack notification setup

1. Use the `Send public/private channel message` action from the Slack app and drag it under the ConfigCat trigger.

![zoho_slack_add](/assets/add_slack.png)

1. Configure the Slack action to which channel and exactly what it should send.
   > You may have to connect the Slack app to your Slack subscription if you didn't do it before.

![zoho_slack_config](/assets/slack_configuration.png)

1. Hit the `Test & Debug` button on the right top corner and wait for the results.

![zoho_slack_config](/assets/slack_message.png)

## Need help?
<a href="https://configcat.com/support" target="_blank">Contact us</a> if you have questions or any improvement ideas for this app.
