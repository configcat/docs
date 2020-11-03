---
id: public-api
title: Public Management API
---

To access the ConfigCat platform programmatically. 
It's purpose is to **Create**, **Read**, **Update** and **Delete** any entities 
like **Feature Flags, Configs, Environments** or **Products** within ConfigCat. The API is 
based on HTTP REST, uses resource-oriented URLs, status codes and supports JSON 
and JSON+HAL format.

> Do not use this API for accessing and evaluating feature flag values. Use the 
> [SDKs instead](sdk-reference/overview.md).

## Endpoints
**[Detailed list of all available endpoints and schemas](https://api.configcat.com/docs)**

## Authentication

The API uses the <a href="https://en.wikipedia.org/wiki/Basic_access_authentication" target="_blank">
'Basic' HTTP Authentication Scheme</a>. 


Where a **Basic auth user name** and a 
**Basic auth password** is passed in an `Authorization: Basic` header joined by a single 
colon `:` and **Base64 encoded** .

e.g: `Basic MDhkN2UxMzYtZjE2OS02MzUyLTk5NmQtMjVkMGNmNzQ4ODFjO9`

![BasicAuth](/assets/basic-auth.png)

### Create Public API credentials

1. Open your [Public API credentials management page](https://app.configcat.com/my-account/public-api-credentials) on the ConfigCat Dashboard
2. Click **+ Add New Credentials**, give it a name, hit **Generate**. 
3. Save your basic auth username and password to your favorite key-vault.

	> Due to security reasons we don't store your password, so if you close the dialog you 
	> won't be able to access it again.

5. Use username-password credentials with BASIC authentication in your HTTP requests.

	> Keep your credentials secure: do not embed it directly in your code and do not share it.

### Media types
| Media                                                                                                     | Content-type         |
| --------------------------------------------------------------------------------------------------------- | -------------------- |
| json                                                                                                      | application/json     |
| json with  <a href="https://en.wikipedia.org/wiki/Hypertext_Application_Language" target="_blank">HAL</a> | application/hal+json |

The JSON Hypertext Application Language (HAL) is a standard which
   establishes conventions for expressing hypermedia controls, such as
   links, with JSON 

### Public API clients
You can create clients easily using <a href="https://github.com/swagger-api/swagger-codegen" target="_blank">Swagger Codegen</a>.

#### Sample client
<a href="https://github.com/configcat/ng-configcat-publicapi" target="_blank">ConfigCat Public API client for Angular</a>

## Throttling and rate limits
> Do not use this API for accessing and evaluating feature flag values. Use the 
> [SDKs instead](sdk-reference/overview.md).

`HTTP 429 - Too many requests` status is returned in case throttling gets activated, along 
with a reason message with details.

### Public API rate limit policy
* You can expect the limits around `20` per second and `500` per minute for each endpoint.
* <a href="https://configcat.com/support" target="_blank">Let's get in touch</a> if you have different requirements.

****

## Examples
### Get your Products

Sample request on how to get all your **Products**.

#### Endpoint
```GET https://api.configcat.com/v1/products```

[Detailed list of available endpoints](https://api.configcat.com/docs)
#### Request - cURL
```
auth_credentials_in_base64="dGVzdDp0ZXN0"

curl -X GET \
"https://api.configcat.com/v1/products" \
-H "accept: text/plain" \
-H "Authorization: Basic ${auth_credentials_in_base64}"
```
#### Response
```
[{
	"productId": "00d553ae-832b-5532-d8ad-9b2ae6ddfa11",
	"name": "cat@example.com"
}]
```
### Updating a Feature Flag using SDK Key for identification

A sample on how to switch on `enableMyAwesomeFeature` by updating a 
**Feature Flag** value from `false` to `true`.

This endpoint uses the `SDK_KEY` in the Header to identify the **Config** and 
**Environment** for the feature flag. So you don't need to get their IDs before
updating. [Get your SDK Key](https://app.configcat.com/sdkkey) 

#### Endpoint

```PUT https://api.configcat.com/v1/settings/{settingKeyOrId}/value```

[Detailed list of available endpoints](https://api.configcat.com/docs)

#### Request - cURL

```
auth_credentials_in_base64="dGVzdDp0ZXN0"
setting_key="enableMyAwesomeFeature"
reason="Automate_Test_Run"
SDK_KEY="#YOUR-SDK-KEY#"

curl -X PUT \
"https://api.configcat.com/v1/settings/${setting_key}/value?reason=${reason}" \
-H "X-CONFIGCAT-SDKKEY: ${SDK_KEY}" \
-H "Authorization: Basic ${auth_credentials_in_base64}" \
-H "Content-Type: application/json" \
-d "{\"value\":true}"
```
#### Response
When the update was successful 
```HTTP/1.1 200 OK``` 
```
{
	"config": {
		"configId": "8aea7255-6f50-4b4b-8a50-094f3ab95b31",
		"name": "Live Demo Project"
	},
	"environment": {
		"environmentId": "c37af0af-e693-47e2-8017-6b3de388a652",
		"name": "Production"
	},
	"readOnly": false,
	"setting": {
		"settingId": 965497318,
		"key": "enableMyAwesomeFeature",
		"name": "Enable My Awesome Feature",
		"hint": "",
		"settingType": "boolean"
	},
	"integrationLinks": [],
	"rolloutRules": [],
	"rolloutPercentageItems": [],
	"value": true
}
```
