---
id: azure-ad
title: Azure AD Identity Provider
description: This is a step-by-step guide on how to set up and configure Azure AD as a SAML Identity Provider for your organization.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Connect ConfigCat with Azure Active Directory via SAML.

### Introduction
Each SSO Identity Provider requires specific information to configure a SAML integration. The following guide will walk you through on how you can connect ConfigCat with Azure Active Directory as a SAML Identity Provider.

### 1. Create an Azure AD Enterprise Application

- Log in to the <a href="https://portal.azure.com/" target="_blank">Azure Portal</a>, go to the `Azure Active Directory` resource, and select `Enterprise applications`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/azure-ad/eapplications.png" alt="Azure AD enterprise applications"/>

- Click on `New application`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/azure-ad/new_app.png" alt="Azure AD new application"/>

- Click on `Create your own application`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/azure-ad/create_app.png" alt="Azure AD create own application"/>

- Enter a descriptive `App name`, select the `Integrate any other application you don't find in the gallery (Non-gallery)` option, then click `Create`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/azure-ad/app_name.png" alt="Azure AD app name"/>

- On the `Manage` section of the application, select `Single sign-on`, then select `SAML`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/azure-ad/enable_saml.png" alt="Azure AD enable SAML"/>

The next step will guide you on how to collect the information required for Configuring SAML in the application.

### 2. Configure SAML for the Azure Enterprise Application
- Open your organization's authentication settings on the <a href="https://app.configcat.com/organization/authentication" target="_blank">ConfigCat dashboard</a>.

  <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/authentication.png" alt="ConfigCat authentication settings"/>

- Select the domain you want to configure with SAML, and click `Set` under the `SAML SSO status`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/domains.png" alt="ConfigCat SAML SSO status" />

- From the appearing dialog, copy the following values and paste them into the Enterprise application.
    - `Entity ID` -> `Identifier (Entity ID)`
    - `Assertion Consumer Service` -> `Reply URL (Assertion Consumer Service URL)`

    <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/saml_config.png" alt="ConfigCat SAML configuration" />

    <img class="saml-tutorial-img" src="/docs/assets/saml/azure-ad/saml_urls.png" alt="Azure AD URL configuration" />

    <img class="saml-tutorial-img" src="/docs/assets/saml/azure-ad/ad_urls.png" alt="Azure AD URLs" />

### 3. Configure ConfigCat with SAML Details from Azure

You can choose one of the following options to configure ConfigCat with SAML Identity Provider metadata.

<Tabs>
  <TabItem value="metadataUrl" label="Metadata URL" default>
    <ul>
      <li>
        <p>Copy the value of <code>App Federation Metadata Url</code>.</p>
        <img class="saml-tutorial-img" src="/docs/assets/saml/azure-ad/metadata_url.png" alt="Azure AD metadata URL" />
      </li>
      <li>
        <p>Paste the copied value into the <code>Metadata URL</code> field at ConfigCat.</p>
        <img class="saml-tutorial-img" src="/docs/assets/saml/azure-ad/cc_metadata.png" alt="ConfigCat Azure AD metadata URL" />
      </li>
      <li>
        Click on <code>Save</code>.
      </li>
    </ul>
  </TabItem>
  <TabItem value="manual" label="Manual Configuration">
    <ul>
      <li>
        <p>Copy the value of <code>Login URL</code> and download the <code>Certificate (Base64)</code>, then paste them into the Configuration dialog at ConfigCat.</p>
        <img class="saml-tutorial-img" src="/docs/assets/saml/azure-ad/metadata_logon.png" alt="Azure AD metadata login URL" />
        <img class="saml-tutorial-img" src="/docs/assets/saml/azure-ad/metadata_cert.png" alt="Azure AD metadata certificate"/>
        <img class="saml-tutorial-img" src="/docs/assets/saml/azure-ad/cc_manual.png" alt="ConfigCat Azure AD manual configuration"/>
      </li>
      <li>
        Click on <code>Save</code>.
      </li>
    </ul>
  </TabItem>
</Tabs>

### 4. Assign Users to the Enterprise Application

To let users authenticate via SAML, you need to assign individual users or groups to the Enterprise application.

- Select `Users and groups` on the `Manage` section of the menu.

  <img class="saml-tutorial-img" src="/docs/assets/saml/azure-ad/users_groups.png" alt="Azure AD users and groups" />

- Click `Add user/group`, then select the users or groups you want to assign.

  <img class="saml-tutorial-img" src="/docs/assets/saml/azure-ad/add_users.png" alt="Azure AD add user/group" />

### 5. Sign In
- Go to the <a href="https://app.configcat.com/login" target="_blank">ConfigCat Log In</a> page, and click `COMAPNY ACCOUNT - SAML`.
  
  <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/saml_login.png" alt="ConfigCat SAML login"  />

- Sign in with your company email address assigned to the Enterprise application.

  <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/company_email.png" alt="ConfigCat SAML company login"  />

- ConfigCat will redirect you to Microsoft's sign in page. Type your credentials for sign-in.

  <img class="saml-tutorial-img" src="/docs/assets/saml/azure-ad/login.png" alt="Azure AD sign in page" />

- You should be redirected to ConfigCat signed in with your company account.

### 6. Next Steps

- Configure the [auto-assignment of users](/advanced/team-management/auto-assign-users).