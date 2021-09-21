---
id: onelogin
title: OneLogin
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Connect ConfigCat with OneLogin via SAML.

### Introduction
Each SSO Identity Provider requires specific information to configure a SAML integration. The following guide will walk you through on how you can connect ConfigCat with OneLogin as a SAML Identity Provider.

### 1. Create an Application in OneLogin

- Log in to <a href="https://app.onelogin.com/login" target="_blank">OneLogin</a>, and select `Applications`.

  <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/applications.png" />

- Click on `Add App`.

  <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/add_app.png" />

- Type `saml` into the search bar, and select `SAML Custom Connector (Advanced)`.

  <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/select_app.png" />

- Enter a descriptive `Display Name`, then click `Save`.

  <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/app_name.png" />

The next step will guide you on how to collect the information required for the appearing `Configuration` page.

### 2. Configure SAML for the OneLogin Application
- Open your organization's authentication settings on the <a href="https://app.configcat.com/organization/authentication" target="_blank">ConfigCat dashboard</a>.

  <img class="saml-tutorial-img" src="/static/assets/saml/dashboard/authentication.png" />

- Select the domain you want to configure with SAML, and click `Set` under the `SAML SSO status`.

  <img class="saml-tutorial-img" src="/static/assets/saml/dashboard/domains.png" />

- From the appearing dialog, copy the following values and paste them into the OneLogin application's configuration page.
    - Copy `Entity ID` and paste it into the `Audience (EntityID)`.
    - Copy `Assertion Consumer Service` and paste it into the `ACS (Consumer) URL`.
    - Paste the same `Assertion Consumer Service` into the `ACS (Consumer) URL Validator` in regex format.
    - For `Login URL` type `https://app.configcat.com/login`.

    <img class="saml-tutorial-img" src="/static/assets/saml/dashboard/saml_config.png" />

    <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/saml_config.png" />

- Scroll down a bit on this page and configure the following:
    - Select `Service Provider` as `SAML Initiator`.
    - Select `Email` as `SAML nameID format`.
    - Select `Both` as `SAML signature element`.

    <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/saml_config2.png" />

- Select `Parameters`, and make sure there is a `NameID value` entry under the `SAML Custom Connector (Advanced) Field` with the value `Email`.

  <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/name_id.png" />

- Select `SSO`, then select `SHA-256` as `SAML Signature Algorithm`.

  <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/sso_signing_algo.png" />

### 3. Configure ConfigCat with SAML Details from OneLogin

You can choose one of the following options to configure ConfigCat with SAML Identity Provider metadata.

<Tabs>
  <TabItem value="metadataUrl" label="Metadata URL" default>
    <ul>
      <li>
        <p>Select <code>SSO</code>, and copy the value of <code>Issuer URL</code>.</p>
        <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/sso_config.png" />
      </li>
      <li>
        <p>Paste the copied value into the <code>Metadata URL</code> field at ConfigCat.</p>
        <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/cc_meta_url.png" />
      </li>
      <li>
        Click on <code>Save</code>.
      </li>
    </ul>
  </TabItem>
  <TabItem value="manual" label="Manual Configuration">
    <ul>
      <li>
        <p>Select <code>SSO</code>, and copy the value of <code>SAML 2.0 Endpoint (HTTP)</code>, then click <code>View Details</code> under the <code>X.509 Certificate</code>.</p>
        <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/sso_config_manual.png" />
      </li>
      <li>
        <p>Copy the value of the <code>X.509 Certificate</code>.</p>
        <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/cert.png" />
      </li>
      <li>
        <p>Paste the value of the <code>SAML 2.0 Endpoint (HTTP)</code> and the <code>X.509 Certificate</code> into the Configuration dialog at ConfigCat</p>
        <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/cc_manual.png" />
      </li>
      <li>
        Click on <code>Save</code>.
      </li>
    </ul>
  </TabItem>
</Tabs>

### 4. Assign the OneLogin Application to Users
To let users authenticate via SAML, you need to assign the newly created application to them.

- Select `Users`.

  <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/users.png" />

- Select the user you want to get access to the application.

  <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/select_user.png" />

- Select `Applications`, then click on the `+` sign.

  <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/add_application.png" />

- Select your application, then click `Continue`.

  <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/app_added.png" />

- Click `Save`.

  <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/app_details.png" />

### 5. Sign In
- Go to the <a href="https://app.configcat.com/login" target="_blank">ConfigCat Log In</a> page, and click `COMAPNY ACCOUNT - SAML`.
  
  <img class="saml-tutorial-img" src="/static/assets/saml/dashboard/saml_login.png" />

- Sign in with your company email address assigned to the OneLogin application.

  <img class="saml-tutorial-img" src="/static/assets/saml/dashboard/company_email.png" />

- ConfigCat will redirect you to OneLogin's sign in page. Type your credentials, and click `Continue`.

  <img class="saml-tutorial-img" src="/static/assets/saml/onelogin/login.png" />

- You should be redirected to ConfigCat signed in with your company account.

### 6. Next Steps

- Configure the [auto-assignment of users](../../auto-assign-users).