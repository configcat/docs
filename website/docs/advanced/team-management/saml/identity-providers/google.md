---
id: google
title: Google Identity Provider
description: This is a step-by-step guide on how to set up and configure Google as a SAML Identity Provider for your organization.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Connect ConfigCat with Google via SAML.

## Introduction

Each SSO Identity Provider requires specific information to configure a SAML integration. The following guide will walk you through on how you can connect ConfigCat with Google as a SAML Identity Provider.

## 1. Create a SAML Application in Google

- Log in to <a href="https://admin.google.com/" target="_blank">Google Admin console</a>, select `Apps` from the side menu, then select `Web and mobile apps`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/google/applications.png" alt="Google applications" />

- Click `Add App`, then select `Add custom SAML app`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/google/add_saml_app.png" alt="Google add SAML app" />

- Enter a descriptive `App name`, then click `CONTINUE`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/google/app_name.png" alt="Google SAML app name" />

The next step will guide you on how to configure ConfigCat with appearing information.

## 2. Configure ConfigCat with SAML Details from Google

- Copy the value of `SSO URL` and `Certificate` fields and save them for further use.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/google/meta_url_cert.png" alt="Google SSO url" />

- Open your organization's authentication settings on the <a href="https://app.configcat.com/organization/authentication" target="_blank">ConfigCat dashboard</a>.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/authentication.png" alt="ConfigCat authentication settings" />

- Click `ADD SAML IDENTITY PROVIDER`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/add_idp.png" alt="ConfigCat Add Identity Provider" />

- Give a name for your Identity Provider, and click `Create`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/google_name.png" alt="ConfigCat Name Identity Provider" />

- Select the `3. Set up ConfigCat` step, click `Manual Configuration`, then paste the copied values into the appearing fields.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/google/cc_manual_new.png" alt="ConfigCat manual configuration" />

- Click `CONTINUE` on the Google App configuration.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/google/meta_continue.png" alt="Google SSO app configuration" />

The next step will guide you on how to configure the Google App with details provided by ConfigCat.

## 3. Configure the Google Application with Service Provider Details from ConfigCat

- Select `2. Set up your Identity Provider` step on the ConfigCat configuration dialog, and copy the following values to the Google App.

  - `Entity ID` -> `Entity ID`
  - `Assertion Consumer Service` -> `ACS URL`

    <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/acs_entity_id_2.png" alt="Google acs url" />

  - Make sure the `Signed response` option is checked.
  - Select `EMAIL` as `Name ID format`.
  - Select `Basic Information > Primary email` as `Name ID`.
  - Click `CONTINUE`.

    <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/google/google_acs_eid.png" alt="Google meta data" />

- Click `FINISH`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/google/attribute_mapping.png" alt="Google attribute mapping" />

## 4. Select Trusted Domains on the SAML Configuration Dialog

- Only user accounts from trusted domains can login with SAML SSO. You can bind multiple verified domains to a SAML Identity Provider.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/select_trusted_domains.png" alt="Select trusted domains" />

- Click `Save`.

## 5. Give Users Access to the Application

- Click on `View details` under the `User access` section.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/google/user_access.png" alt="Google user access" />

- Select `ON for everyone`, then click `SAVE`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/google/on_for_everyone.png" alt="Google ON for everyone"/>

## 6. Sign In

- Go to the <a href="https://app.configcat.com/auth/login" target="_blank">ConfigCat Log In</a> page, and click `COMPANY ACCOUNT - SAML`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/saml_login.png" alt="ConfigCat SAML login" />

- Sign in with your company email address used in Google.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/company_email.png" alt="ConfigCat SAML company login" />

- ConfigCat will redirect you to Google's sign in page. Type your credentials, and sign in.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/google/login.png" alt="Google SSO login" />

- You should be redirected to ConfigCat signed in with your company account.

## 7. Next Steps

- Configure the [auto-assignment of users](/docs/advanced/team-management/auto-assign-users).
