---
id: notifications-webhooks
title: Notifications (Webhooks)
---
ConfigCat can notify your system about setting changes. Just register your Url in the *Management Console* and ConfigCat will call that Url when setting changes occur.

## Add your webhook
1. Go to the <a href="https://app.configcat.com/webhook" target="_blank">Webhooks</a> tab.
1. Set up the Url, the HttpMethod and the optional Content and save it.

### Content
You can specify a Content at your webhook which will be sent as the payload of the Http call. ConfigCat will replace the following literals in the content:
1. **##ConfigName##** with the Config's name
1. **##EnvironmentName##** with the Environment's name 
1. **##URL##** with a link to the Config in ConfigCat Management Console.

## Test your webhook
1. Change some of your settings and click **SAVE & PUBLISH SETTINGS**.
1. Check if your webhook is called correctly.

## Example Slack Incoming Webhook
We can send a notification to Slack about setting changes. Steps:
1. Define an <a href="https://api.slack.com/incoming-webhooks" target="_blank">Slack Incoming Webhook</a> and copy the Webhook URL.
1. Create a webhook in ConfigCat with the Slack Incoming Webhook Url and with Post Http method. Sample content:
```{"text": "<##URL##|##ConfigName## - ##EnvironmentName##> changed in ConfigCat."}```

> **Developer Tip:** Running your webhook on `localhost`? Expose it to the public internet temporarily by using a tool like <a href="https://ngrok.com/" target="_blank">ngrok</a>. This enables ConfigCat to call your webhook even in your dev env.

