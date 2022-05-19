---
id: okta
title: Okta Identity Provider
description: This is a step-by-step guide on how to set up and configure Okta as a SAML Identity Provider for your organization.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Connect ConfigCat with Okta via SAML.

### Introduction
Each SSO Identity Provider requires specific information to configure a SAML integration. The following guide will walk you through on how you can connect ConfigCat with Okta as a SAML Identity Provider.

### 1. Create an Application in Okta

- Log in to <a href="https://login.okta.com/" target="_blank">Okta</a>, go to the admin dashboard, and select `Applications`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/okta/applications.png" alt="Okta applications" />

- Click on `Create App Integration`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/okta/create_app.png" alt="Okta create app"/>

- Select `SAML 2.0` as the Sign-in method.

  <img class="saml-tutorial-img" src="/docs/assets/saml/okta/select_saml.png" alt="Okta select SAML" />

- Enter a descriptive `App name`, then click `Next`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/okta/app_name.png" alt="Okta app name"/>

The next step will guide you on how to collect the information required for the appearing `Configure SAML` section.

### 2. Configure SAML for the Okta Application
- Open your organization's authentication settings on the <a href="https://app.configcat.com/organization/authentication" target="_blank">ConfigCat dashboard</a>.

  <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/authentication.png" alt="ConfigCat authentication settings" />

- Select the domain you want to configure with SAML, and click `Set` under the `SAML SSO status`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/domains.png" alt="ConfigCat SAML SSO status" />

- From the appearing dialog, copy the following values and paste them into the Okta application.
    - `Entity ID` -> `Audience URI (SP Entity ID)`
    - `Assertion Consumer Service` -> `Single sign on URL`

    <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/saml_config.png" alt="ConfigCat SAML configuration" />

    <img class="saml-tutorial-img" src="/docs/assets/saml/okta/saml_url_eid.png" alt="Okta SAML url EID" />

- Set the `Name ID format` to `EmailAddress`, then click `Next`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/okta/saml_nameid.png" alt="Okta SAML nameid" />

- Select `I'm an Okta customer adding an internal app`. Complete the form with any comments and click `Finish`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/okta/feedback.png" alt="Okta SAML feedback" />

### 3. Configure ConfigCat with SAML Details from Okta

You can choose one of the following options to configure ConfigCat with SAML Identity Provider metadata.

<Tabs>
  <TabItem value="metadataUrl" label="Metadata URL" default>
    <ul>
      <li>
        <p>Select the <code>Sign On</code> tab, and copy the URL of <code>Identity Provide metadata</code>.</p>
        <img class="saml-tutorial-img" src="/docs/assets/saml/okta/metadata_url.png" alt="Okta metadata url" />
      </li>
      <li>
        <p>Paste the copied value into the <code>Metadata URL</code> field at ConfigCat.</p>
        <img class="saml-tutorial-img" src="/docs/assets/saml/okta/cc_metadata.png" alt="ConfigCat metadata url" />
      </li>
      <li>
        Click on <code>Save</code>.
      </li>
    </ul>
  </TabItem>
  <TabItem value="manual" label="Manual Configuration">
    <ul>
      <li>
        <p>Select the <code>Sign On</code> tab, and click on <code>View Setup Instructions</code>.</p>
        <img class="saml-tutorial-img" src="/docs/assets/saml/okta/setup.png" alt="Okta SAML setup" />
      </li>
      <li>
        <p>Copy the value of the <code>Identity Provider Single Sign-On URL</code> and <code>X.509 Certificate</code> fields and paste them into the Configuration dialog at ConfigCat.</p>
        <img class="saml-tutorial-img" src="/docs/assets/saml/okta/manual.png" alt="Okta manual configuration" />
        <img class="saml-tutorial-img" src="/docs/assets/saml/okta/manual_cc.png" alt="ConfigCat manual configuration"  />
      </li>
      <li>
        Click on <code>Save</code>.
      </li>
    </ul>
  </TabItem>
</Tabs>

### 4. Assign Users to Okta Application
To let users authenticate via SAML, you need to assign individual users or groups to the Okta application.

- Select the `Assignments` tab, and select either the `Assign to People` or the `Assign to Groups` option.

  <img class="saml-tutorial-img" src="/docs/assets/saml/okta/assign.png" alt="Okta assign to groups" />

### 5. Sign In
- Go to the <a href="https://app.configcat.com/login" target="_blank">ConfigCat Log In</a> page, and click `COMAPNY ACCOUNT - SAML`.
  
  <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/saml_login.png" alt="ConfigCat SAML login" />

- Sign in with your company email address assigned to the Okta application.

  <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/company_email.png" alt="ConfigCat SAML company login" />

- ConfigCat will redirect you to Okta's sign in page. Type your credentials, and click `Sign In`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/okta/okta_sign_in.png" alt="Okta sign in" />

- You should be redirected to ConfigCat signed in with your company account.

### 6. Next Steps

- Configure the [auto-assignment of users](/docs/advanced/team-management/auto-assign-users).