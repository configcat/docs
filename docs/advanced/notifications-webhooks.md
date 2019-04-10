---
id: notifications-webhooks
title: Notifications (Webhooks)
---
ConfigCat can notify your system about setting changes. Just register your Url in in the *Management Console* and ConfigCat will call that Url when setting changes occur.

1. <a href="https://app.configcat.com/login" target="_blank">Log in</a> to the *Management Console* and click the **Webhooks** tab.
2. Set up the Url and the HttpMethod and click on Save Webhook.
3. Change some of your settings and click **SAVE & PUBLISH SETTINGS**.
4. Check if your webhook is called correctly.
5. You can expose your locally running webhook to the public internet temporarily by using a tool like <a href="https://ngrok.com/" target="_blank">ngrok</a>. This enables ConfigCat to call your webhook even in your dev env.