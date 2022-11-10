---
id: onelogin
title: OneLogin Identity Provider
description: This is a step-by-step guide on how to set up and configure OneLogin as a SAML Identity Provider for your organization.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Connect ConfigCat with OneLogin via SAML.

### Introduction
Each SSO Identity Provider requires specific information to configure a SAML integration. The following guide will walk you through on how you can connect ConfigCat with OneLogin as a SAML Identity Provider.

### 1. Create an Application in OneLogin

- Log in to <a href="https://app.onelogin.com/login" target="_blank">OneLogin</a>, and select `Applications`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/applications.png" alt="OneLogin applications" />

- Click on `Add App`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/add_app.png" alt="OneLogin add application" />

- Type `SAML` into the search bar, and select `SAML Custom Connector (Advanced)`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/select_app.png" alt="OneLogin select APP" />

- Enter a descriptive `Display Name`, then click `Save`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/app_name.png" alt="OneLogin app name" />

The next step will guide you on how to collect the information required for the appearing `Configuration` page.

### 2. Configure SAML for the OneLogin Application
- Open your organization's authentication settings on the <a href="https://app.configcat.com/organization/authentication" target="_blank">ConfigCat dashboard</a>.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/authentication.png" alt="ConfigCat authentication settings" />

- Select the domain you want to configure with SAML, and click `Set` under the `SAML SSO status`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/domains.png" alt="ConfigCat SAML SSO status" />

- From the appearing dialog, copy the following values and paste them into the OneLogin application's configuration page.
    - Copy `Entity ID` and paste it into the `Audience (EntityID)` field.
    - Copy `Assertion Consumer Service` and paste it into the `ACS (Consumer) URL` field.
    - Paste the same `Assertion Consumer Service` into the `ACS (Consumer) URL Validator` field in regex format e.g. `^https:\/\/dashboard\-api\.configcat\.com\/saml\/acs\/08d97769\-fed5\-4fd4\-8a09\-0a38bb951177$`

    <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/saml_config.png" alt="ConfigCat SAML configuration" />

    <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/saml_config.png" alt="OneLogin SML configuration" />

- Scroll down a bit on this page and configure the following:
    - Select `OneLogin` as `SAML Initiator`.
    - Select `Email` as `SAML nameID format`.
    - Select `Both` as `SAML signature element`.

    <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/saml_config2.png" alt="OneLogin SAML initiator" />

- Select `Parameters`, and make sure there is a `NameID value` entry under the `SAML Custom Connector (Advanced) Field` with the value `Email`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/name_id.png" alt="OneLogin nameID" />

- Select `SSO`, then select `SHA-256` as `SAML Signature Algorithm`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/sso_signing_algo.png" alt="OneLogin SAML Signature Algorithm"  />

### 3. Configure ConfigCat with SAML Details from OneLogin

You can choose one of the following options to configure ConfigCat with SAML Identity Provider metadata.

<Tabs>
  <TabItem value="metadataUrl" label="Metadata URL" default>
    <ul>
      <li>
        <p>Select <code>SSO</code>, and copy the value of <code>Issuer URL</code>.</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/sso_config.png" alt="OneLogin SAML SSO configuration" />
      </li>
      <li>
        <p>Paste the copied value into the <code>Metadata URL</code> field at ConfigCat.</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/cc_meta_url.png" alt="ConfigCat SAML configuration" />
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
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/sso_config_manual.png"  alt="OneLogin manual SAML SSO configuration" />
      </li>
      <li>
        <p>Copy the value of the <code>X.509 Certificate</code>.</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/cert.png" alt="OneLogin certificate" />
      </li>
      <li>
        <p>Paste the value of the <code>SAML 2.0 Endpoint (HTTP)</code> and the <code>X.509 Certificate</code> into the Configuration dialog at ConfigCat</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/cc_manual.png" alt="ConfigCat manual configuration" />
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

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/users.png" alt="OneLogin users" />

- Select the user you want to get access to the application.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/select_user.png" alt="OneLogin select user"/>

- Select `Applications`, then click on the `+` sign.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/add_application.png" alt="OneLogin add application"/>

- Select your application, then click `Continue`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/app_added.png" alt="OneLogin application added"/>

- Click `Save`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/app_details.png" alt="OneLogin application details"/>

### 5. Sign In
- Go to the <a href="https://app.configcat.com/login" target="_blank">ConfigCat Log In</a> page, and click `COMPANY ACCOUNT - SAML`.
  
  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/saml_login.png" alt="ConfigCat SAML login" />

- Sign in with your company email address assigned to the OneLogin application.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/company_email.png" alt="ConfigCat SAML company login" />

- ConfigCat will redirect you to OneLogin's sign in page. Type your credentials, and click `Continue`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/onelogin/login.png" alt="OneLogin SAML login"  />

- You should be redirected to ConfigCat signed in with your company account.

### 6. Next Steps

- Configure the [auto-assignment of users](/docs/advanced/team-management/auto-assign-users).