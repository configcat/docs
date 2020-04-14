---
id: public-api
title: Public API

---

With Public API you can access ConfigCat platform programmatically. It is useful when you need to create, modify or delete any entities in ConfigCat. The API is based on HTTP REST, uses resource-oriented URLs, status codes and supports JSON and JSON+HAL format.
## Authentication
Authentication tokens are passed using an `Authorization` header to authenticate as a user account with the API. The method is *[BASIC](https://tools.ietf.org/html/rfc7617)*. If you are not familiar BASIC method follow the [link](https://en.wikipedia.org/wiki/Basic_access_authentication) to build the proper credentials.
### Create Public API credentials
1. Open your [Public API credentials management page](https://app.configcat.com/my-account/public-api-credentials) on the ConfigCat Dashboard
2. Click on the _Add New Credentials_ button and enter a name to identify your credential
3. Click on the _Generate_ button: your credential will generate and it will show in a popup window
4. Save your credential username and password to your favorite key-vault. 
> **IMPORTANT:** if you close the popup window you won’t be able to access your password, and will need to create a new one!
5. Use username-password credentials with BASIC authentication in your HTTP requests. 
> Keep your credentials secure: do not embed it directly in your code and do not share it.
## Service endpoints
You can find the full list of the supported Public API endpoints under swagger link:
**[https://api.configcat.com/docs/index.html](https://api.configcat.com/docs/index.html)**
### Media types
|Media|Content-type  |
|--|--|
|json|application/json|
|json with  [HAL](https://tools.ietf.org/html/draft-kelly-json-hal-08)|application/hal+json|
> The JSON Hypertext Application Language (HAL) is a standard which
   establishes conventions for expressing hypermedia controls, such as
   links, with JSON 
### Public API clients
With [SWAGGER-GEN]([https://github.com/swagger-api/swagger-codegen](https://github.com/swagger-api/swagger-codegen)) you can generate several client types.
#### Sample client
*	[AngularJS](https://github.com/configcat/ng-configcat-publicapi)

## Rate limits
Public API's responsibility is to manage your products / environments / settings. It has the ability to serve the config value in some special cases but you **must not use** it to evaluate a setting value in your production environment.
### Public API rate limit policy
* The rate limit for the one endpoint call is `20` per second and `500` per hour per account credential.
* The rate limit for the one endpoint call is `20` per second per client's IP address.

>**When you hit your limit all api calls response status will be `HTTP429`**

## Service level agreement
[https://configcat.com/sla](https://configcat.com/sla)
## Example
### List my Products
#### Signature
```GET ~/v1/products```
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
### Update setting value with SDK-KEY
This sample updates a setting to `true`. With this endpoint you don't need to know the environment and the setting identifiers.
#### Signature
```PUT ~/v1/settings/{settingKeyOrId}/value```
#### Request - cURL

```
auth_credentials_in_base64="dGVzdDp0ZXN0"
setting_key="enableMyAwesomeFeature"
reason="Automate_Test_Run"
SDK_KEY="mySDK-KEY"

curl -X PUT \
"https://api.configcat.com/v1/settings/${setting_key}/value?reason=${reason}" \
-H "X-CONFIGCAT-APIKEY: ${SDK_KEY}" \
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
