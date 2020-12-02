---
id: notifications-webhooks
title: Notifications - Webhooks
---
Your application can be notified about Setting value changes in real-time. ConfigCat enables this by calling a public URL of your system (a so-called Webhook). You can add your Webhook URLs in the *Dashboard*.

## Adding Webhook
1. Go to the <a href="https://app.configcat.com/webhook" target="_blank">Webhooks</a> tab.
2. Set the Url and the HttpMethod.
3. Optionally, you can add additional HTTP headers and a body to the request.

## Request body with variables
You can specify a Request body that will be sent as the payload of the HTTP request. 

ConfigCat will replace the following variables in the request body:

| Variable                | The values it gets replaced with                             |
| ----------------------- | ------------------------------------------------------------ |
| **##ConfigName##**      | The name of the Config your setting belongs to.              |
| **##ConfigId##**        | ID of the Config.                                            |
| **##EnvironmentName##** | The name of the Environment where the Setting value changed. |
| **##EnvironmentId##**   | ID of the Environment.                                       |
| **##URL##**             | A direct link to the Config in the *ConfigCat Dashboard.*    |
| **##ChangeNotes##**     | The **Mandatory notes** added to the actual changeset.    |
| **##ChangeDetails##**   | A detailed explanation in JSON format about what is included in the actual changeset.  |

The structure of the JSON array injected into the **##ChangeDetails##** looks like the following:
```
[
  {
    "settingKey": "<key-of-the-changed-setting>",
    "event": "added|deleted|changed",
    "details": "<details-about-the-change>"
  },
  {
    "settingKey": "<key-of-the-changed-setting>",
    "event": "added|deleted|changed",
    "details": "<details-about-the-change>"
  }
]
```

## Testing your Webhook
1. Change some of your settings in the *ConfigCat Dashboard.* 
2. Click **SAVE & PUBLISH SETTINGS**.
3. Check if your Webhook was called correctly.

> **Developer Tip:** Running your Webhook on `localhost`? Expose it to the public internet temporarily by using a tool like <a href="https://ngrok.com/" target="_blank">ngrok</a>. This enables ConfigCat to call your webhook even in your local development environment.

## Connecting to Slack
A few steps to set up Slack and get a message when a setting changes:
1. Define a <a href="https://api.slack.com/incoming-webhooks" target="_blank">Slack Incoming Webhook</a> and copy the Webhook URL.
2. Go to the <a href="https://app.configcat.com/webhook" target="_blank">Webhooks</a> tab in the *ConfigCat Dashboard.* 
3. Create a Webhook and add your Slack URL.
4. Select POST as HTTP method.
5. Add a request body like so:
```
{
  "text": "<##URL##|##ConfigName## - ##EnvironmentName##> changed in ConfigCat."
}
```

## Connecting to Microsoft Teams
A few steps to set up Microsoft Teams and get a message when a setting changes:
1. Define an Incoming Webhook connector in Microsoft Teams and copy the Webhook URL.
2. Go to the <a href="https://app.configcat.com/webhook" target="_blank">Webhooks</a> tab in the *ConfigCat Dashboard.* 
3. Create a Webhook and add your Teams URL.
4. Select POST as the HTTP method.
5. Add a request body like so:

Sample request body of the Webhook: 
```
{
  "@context": "https://schema.org/extensions",
  "@type": "MessageCard",
  "themeColor": "0072C6",
  "title": "##ConfigName## - ##EnvironmentName## ",
  "text": "Config changed",
  "potentialAction": [
    {
      "@type": "OpenUri",
      "name": "Open Config in ConfigCat Dashboard",
      "targets": [
        { "os": "default", "uri": "##URL##" }
      ]
    }
  ]
}
```
