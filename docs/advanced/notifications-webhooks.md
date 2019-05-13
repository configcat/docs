---
id: notifications-webhooks
title: Notifications (Webhooks)
---
ConfigCat can notify your system about setting changes. Just register your Url in the *Management Console* and ConfigCat will call that Url when setting changes occur.

### Add your webhook
1. Go to the <a href="https://app.configcat.com/webhook" target="_blank">Webhooks</a> tab.
1. Set up the Url, and the HttpMethod and save it.

### Test your webhook
1. Change some of your settings and click **SAVE & PUBLISH SETTINGS**.
1. Check if your webhook is called correctly.

> **Developer Tip:** Running your webhook on `localhost`? Expose it to the public internet temporarily by using a tool like <a href="https://ngrok.com/" target="_blank">ngrok</a>. This enables ConfigCat to call your webhook even in your dev env.

