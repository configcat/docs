---
id: okta
title: Okta
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Connect ConfigCat with Okta via SAML.

### Introduction
Each SSO Identity Provider requires specific information to configure a SAML integration. The following guide will walk you through on how you can connect ConfigCat with Okta as a SAML Identity Provider.

### 1. Create an Application in Okta

- Log in to <a href="https://login.okta.com/" target="_blank">Okta</a>, go to the admin dashboard, and select `Applications`.

  <img class="saml-tutorial-img" src="/static/assets/saml/okta/applications.png" />

- Click on `Create App Integration`.

  <img class="saml-tutorial-img" src="/static/assets/saml/okta/create_app.png" />

- Select `SAML 2.0` as the Sign-in method.

  <img class="saml-tutorial-img" src="/static/assets/saml/okta/select_saml.png" />

- Enter a descriptive `App name`, then click `Next`.

  <img class="saml-tutorial-img" src="/static/assets/saml/okta/app_name.png" />

The next step will guide you on how to collect the information required for the appearing `Configure SAML` section.

### 2. Configure SAML for the Okta Application
- Open your organization's authentication settings on the <a href="https://app.configcat.com/organization/authentication" target="_blank">ConfigCat dashboard</a>.

  <img class="saml-tutorial-img" src="/static/assets/saml/dashboard/authentication.png" />

- Select the domain you want to configure with SAML, and click `Set` under the `SAML SSO status`.

  <img class="saml-tutorial-img" src="/static/assets/saml/dashboard/domains.png" />

- From the appearing dialog, copy the following values and paste them into the Okta application.
    - `Entity ID` -> `Audience URI (SP Entity ID)`
    - `Assertion Consumer Service` -> `Single sign on URL`

    <img class="saml-tutorial-img" src="/static/assets/saml/dashboard/saml_config.png" />

    <img class="saml-tutorial-img" src="/static/assets/saml/okta/saml_url_eid.png" />

- Set the `Name ID format` to `EmailAddress`, then click `Next`.

  <img class="saml-tutorial-img" src="/static/assets/saml/okta/saml_nameid.png" />

- Select `I'm an Okta customer adding an internal app`. Complete the form with any comments and click `Finish`.

  <img class="saml-tutorial-img" src="/static/assets/saml/okta/feedback.png" />

### 3. Configure ConfigCat with SAML Details from Okta

You can choose one of the following options to configure ConfigCat with SAML Identity Provider metadata.

<Tabs>
  <TabItem value="metadataUrl" label="Metadata URL" default>
    <ul>
      <li>
        <p>Select the <code>Sign On</code> tab, and copy the URL of <code>Identity Provide metadata</code>.</p>
        <img class="saml-tutorial-img" src="/static/assets/saml/okta/metadata_url.png" />
      </li>
      <li>
        <p>Paste the copied value into the <code>Metadata URL</code> field at ConfigCat.</p>
        <img class="saml-tutorial-img" src="/static/assets/saml/okta/cc_metadata.png" />
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
        <img class="saml-tutorial-img" src="/static/assets/saml/okta/setup.png" />
      </li>
      <li>
        <p>Copy the value of the <code>Identity Provider Single Sign-On URL</code> and <code>X.509 Certificate</code> fields and paste them into the Configuration dialog at ConfigCat.</p>
        <img class="saml-tutorial-img" src="/static/assets/saml/okta/manual.png" />
        <img class="saml-tutorial-img" src="/static/assets/saml/okta/manual_cc.png" />
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

  <img class="saml-tutorial-img" src="/static/assets/saml/okta/assign.png" />

### 5. Sign In
- Go to the <a href="https://app.configcat.com/login" target="_blank">ConfigCat Log In</a> page, and click `COMAPNY ACCOUNT - SAML`.
  
  <img class="saml-tutorial-img" src="/static/assets/saml/dashboard/saml_login.png" />

- Sign in with your company email address assigned to the Okta application.

  <img class="saml-tutorial-img" src="/static/assets/saml/dashboard/company_email.png" />

- ConfigCat will redirect you to Okta's sign in page. Type your credentials, and click `Sign In`.

  <img class="saml-tutorial-img" src="/static/assets/saml/okta/okta_sign_in.png" />

- You should be redirected to ConfigCat signed in with your company account.

### 6. Next Steps

- Configure the [auto-assignment of users](../../auto-assign-users).