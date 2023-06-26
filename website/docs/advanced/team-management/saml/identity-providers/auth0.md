---
id: auth0
title: Auth0 Identity Provider
description: This is a step-by-step guide on how to set up and configure Auth0 as a SAML Identity Provider for your organization.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Connect ConfigCat with Auth0 via SAML.

## Introduction

Each SSO Identity Provider requires specific information to configure a SAML integration. The following guide will walk you through on how you can connect ConfigCat with Auth0 as a SAML Identity Provider.

## 1. Create an Application in Auth0

- Log in to <a href="https://auth0.com/auth/login" target="_blank">Auth0</a>, select `Applications` from the menu, then click `Create Application`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/auth0/applications.png" alt="Auth0 applications" />

- Enter a descriptive `Name`, select `Regular Web Applications`, then click `Create`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/auth0/app_name.png" alt="Auth0 app name" />

- Select the `Addons` tab, and click `SAML2`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/auth0/enable_saml.png"  alt="Auth0 enable SAML"/>

The next step will guide you on how to collect the information required for the appearing configuration dialog.

## 2. Configure SAML for the Auth0 Application

- Open your organization's authentication settings on the <a href="https://app.configcat.com/organization/authentication" target="_blank">ConfigCat dashboard</a>.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/authentication.png" alt="ConfigCat authentication settings" />

- Click `ADD SAML IDENTITY PROVIDER`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/add_idp.png" alt="ConfigCat Add Identity Provider" />

- Give a name for your Identity Provider, and click `Create`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/idp_name.png" alt="ConfigCat Name Identity Provider" />

- From the next section of the dialog, copy the following values and paste them into the Auth0 configuration dialog.

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

   <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/acs_only.png"  alt="ConfigCat ACS configuration" />

   <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/auth0/acs_url.png" alt="Auth0 ACS configuration"/>

  - Click on `Save`.

## 3. Configure ConfigCat with SAML Details from Auth0

You can choose one of the following options to configure ConfigCat with SAML Identity Provider metadata.

<Tabs>
  <TabItem value="metadataUrl" label="Metadata URL" default>
    <ul>
      <li>
        <p>Copy the URL of <code>Identity Provide metadata</code>.</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/auth0/metadata_url.png" alt="Auth0 metadata URL" />
      </li>
      <li>
        <p>Paste the copied value into the <code>Metadata URL</code> field at ConfigCat.</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/auth0/cc_metadata_url_new.png" alt="ConfigCat metadata URL"/>
      </li>
      <li>
        <p>Select the <strong>trusted domains</strong>. Only user accounts from trusted domains can login with SAML SSO. You can bind multiple verified domains to a SAML Identity Provider.</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/select_trusted_domains.png" alt="Select trusted domains" />
      </li>
      <li>
        Click on <code>Save</code>.
      </li>
    </ul>
  </TabItem>
  <TabItem value="manual" label="Manual Configuration">
    <ul>
      <li>
        <p>Copy the value of <code>Identity Provider Login URL</code> and download the <code>Identity Provider Certificate</code>, then paste them into the Configuration dialog at ConfigCat.</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/auth0/manual.png" alt="Auth0 manual configuration" />
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/auth0/cc_manual_new.png" alt="ConfigCat manual configuration"/>
      </li>
      <li>
        <p>Select the <strong>trusted domains</strong>. Only user accounts from trusted domains can login with SAML SSO. You can bind multiple verified domains to a SAML Identity Provider.</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/select_trusted_domains.png" alt="Select trusted domains" />
      </li>
      <li>
        Click on <code>Save</code>.
      </li>
    </ul>
  </TabItem>
</Tabs>

## 4. Sign In

- Go to the <a href="https://app.configcat.com/auth/login" target="_blank">ConfigCat Log In</a> page, and click `COMPANY ACCOUNT - SAML`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/saml_login.png" alt="ConfigCat SAML login" />

- Sign in with your company email address assigned to the Auth0 application.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/company_email.png" alt="ConfigCat SAML company login" />

- ConfigCat will redirect you to Auth0's sign in page. Type your credentials, and click `Continue`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/auth0/login.png" alt="Auth0 login" />

- You should be redirected to ConfigCat signed in with your company account.

## 5. Next Steps

- Configure the [auto-assignment of users](/docs/advanced/team-management/auto-assign-users).
