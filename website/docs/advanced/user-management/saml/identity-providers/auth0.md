---
id: auth0
title: Auth0
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Connect ConfigCat with Auth0 via SAML.

### Introduction
Each SSO Identity Provider requires specific information to configure a SAML integration. The following guide will walk you through on how you can connect ConfigCat with Auth0 as a SAML Identity Provider.

### 1. Create an Application in Auth0

- Log in to <a href="https://auth0.com/auth/login" target="_blank">Auth0</a>, go to the admin dashboard, and select `Applications`, then click `Create Application`.

  <img class="saml-tutorial-img" src="/static/assets/saml/auth0/applications.png" />

- Enter a descriptive `Name`, select `Regular Web Applications`, then click `Create`.

  <img class="saml-tutorial-img" src="/static/assets/saml/auth0/app_name.png" />

- Select the `Addons` tab, and click `SAML2`.

  <img class="saml-tutorial-img" src="/static/assets/saml/auth0/enable_saml.png" />

The next step will guide you on how to collect the information required for the appearing configuration dialog.

### 2. Configure SAML for the Okta Application
- Open your organization's authentication settings on the <a href="https://app.configcat.com/organization/authentication" target="_blank">ConfigCat dashboard</a>.

  <img class="saml-tutorial-img" src="/static/assets/saml/dashboard/authentication.png" />

- Select the domain you want to configure with SAML, and click `Set` under the `SAML authentication status`.

  <img class="saml-tutorial-img" src="/static/assets/saml/dashboard/domains.png" />

- From the appearing dialog, copy the following values and paste them into the configuration dialog.
    - `Assertion Consumer Service` -> `Application Callback URL`
    - For `Settings`, use the following JSON value:
    ```
    {
        "signatureAlgorithm": "rsa-sha256",
        "nameIdentifierProbes": [
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ]
    }
    ```

   <img class="saml-tutorial-img" src="/static/assets/saml/auth0/cc_idp.png" />

   <img class="saml-tutorial-img" src="/static/assets/saml/auth0/acs_url.png" />

    - Click on `Save`.

### 3. Configure ConfigCat with SAML Details from Auth0

You can choose one of the following options to configure ConfigCat with SAML Identity Provider metadata.

<Tabs>
  <TabItem value="metadataUrl" label="Metadata URL" default>
    <ul>
      <li>
        Copy the URL of <code>Identity Provide metadata</code>.
        <img class="saml-tutorial-img" src="/static/assets/saml/auth0/metadata_url.png" />
      </li>
      <li>
        Paste the copied value into the <code>Metadata URL</code> field at ConfigCat.
        <img class="saml-tutorial-img" src="/static/assets/saml/auth0/cc_metadata_url.png" />
      </li>
      <li>
        Click on <code>Save</code>.
      </li>
    </ul>
  </TabItem>
  <TabItem value="manual" label="Manual Configuration">
    <ul>
      <li>
        Copy the value of <code>Identity Provider Login URL</code> and download the <code>Identity Provider Certificate</code>, then paste them into the Configuration dialog at ConfigCat.
        <img class="saml-tutorial-img" src="/static/assets/saml/auth0/manual.png" />
        <img class="saml-tutorial-img" src="/static/assets/saml/auth0/cc_manual.png" />
      </li>
      <li>
        Click on <code>Save</code>.
      </li>
    </ul>
  </TabItem>
</Tabs>

### 4. Sign In
- Go to the `Dashboard Log In` page, and click `COMAPNY ACCOUNT - SAML`.
  
  <img class="saml-tutorial-img" src="/static/assets/saml/dashboard/saml_login.png" />

- Sign in with your company email address assigned to the Auth0 application.

  <img class="saml-tutorial-img" src="/static/assets/saml/dashboard/company_email.png" />

- ConfigCat will redirect you to Auth0's sign in page. Type your credentials, and click `Continue`.

  <img class="saml-tutorial-img" src="/static/assets/saml/auth0/login.png" />

- You should be redirected back to ConfigCat signed in with your company account.

### 5. Next Steps

- Configure the [auto-assignment of users](../../auto-assign-users).