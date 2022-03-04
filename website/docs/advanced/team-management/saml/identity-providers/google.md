---
id: google
title: Google
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Connect ConfigCat with Google via SAML.

### Introduction
Each SSO Identity Provider requires specific information to configure a SAML integration. The following guide will walk you through on how you can connect ConfigCat with Google as a SAML Identity Provider.

### 1. Create a SAML Application in Google

- Log in to <a href="https://admin.google.com/" target="_blank">Google Admin console</a>, select `Apps` from the side menu, then select `Web and mobile apps`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/google/applications.png" alt="Google applications" />

- Click `Add App`, then select `Add custom SAML app`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/google/add_saml_app.png" alt="Google add SAML app" />

- Enter a descriptive `App name`, then click `CONTINUE`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/google/app_name.png" img="Google SAML app name" />

The next step will guide you on how to configure ConfigCat with appearing information.

### 2. Configure ConfigCat with SAML Details from Google

- Copy the value of `SSO URL` and `Certificate` fields and save them for further use.

  <img class="saml-tutorial-img" src="/docs/assets/saml/google/meta_url_cert.png" alt="Google SSO url" />

- Open your organization's authentication settings on the <a href="https://app.configcat.com/organization/authentication" target="_blank">ConfigCat dashboard</a>.

  <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/authentication.png" alt="ConfigCat authentication settings" />

- Select the domain you want to configure with SAML, and click `Set` under the `SAML SSO status`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/domains.png" alt="ConfigCat SAML SSO status" />

- Select the `2. Set up ConfigCat` step, click `Manual Configuration`, then paste the copied values into the appearing fields.

  <img class="saml-tutorial-img" src="/docs/assets/saml/google/cc_manual.png" alt="ConfigCat manual configuration" />

- Click `CONTINUE` on the Google App configuration.

  <img class="saml-tutorial-img" src="/docs/assets/saml/google/meta_continue.png" alt="Google SSO app configuration" />

The next step will guide you on how to configure the Google App with details provided by ConfigCat.

### 3. Configure the Google Application with Service Provider Details from ConfigCat
- Select `1. Set up your Identity Provider` step on the ConfigCat configuration dialog, and copy the following values to the Google App.
    - `Entity ID` -> `Entity ID`
    - `Assertion Consumer Service` -> `ACS URL`

    <img class="saml-tutorial-img" src="/docs/assets/saml/google/cc_saml_config.png" alt="Google acs url" />

    - Make sure the `Signed response` option is checked.
    - Select `EMAIL` as `Name ID format`.
    - Select `Basic Information > Primary email` as `Name ID`.
    - Click `CONTINUE`.

    <img class="saml-tutorial-img" src="/docs/assets/saml/google/sp_data.png" alt="Google meta data" />

- Click `FINISH`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/google/attribute_mapping.png" alt="Google attribute mapping" />

- Click `Save` on the ConfigCat SAML configuration dialog.


### 4. Give Users Access to the Application
- Click on `View details` under the `User access` section.
  
  <img class="saml-tutorial-img" src="/docs/assets/saml/google/user_access.png" alt="Google user access" />

- Select `ON for everyone`, then click `SAVE`.
  
  <img class="saml-tutorial-img" src="/docs/assets/saml/google/on_for_everyone.png" alt="Google ON for everyone"/>

### 5. Sign In
- Go to the <a href="https://app.configcat.com/login" target="_blank">ConfigCat Log In</a> page, and click `COMAPNY ACCOUNT - SAML`.
  
  <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/saml_login.png" alt="ConfigCat SAML login" />

- Sign in with your company email address used in Google.

  <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/company_email.png" alt="ConfigCat SAML company login" />

- ConfigCat will redirect you to Google's sign in page. Type your credentials, and sign in.

  <img class="saml-tutorial-img" src="/docs/assets/saml/google/login.png" alt="Google SSO login" />

- You should be redirected to ConfigCat signed in with your company account.

### 5. Next Steps

- Configure the [auto-assignment of users](/docs/advanced/team-management/auto-assign-users).