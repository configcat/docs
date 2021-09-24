---
id: adfs
title: ADFS
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Connect ConfigCat with Active Directory Federation Services (ADFS) via SAML.

### Introduction
Each SSO Identity Provider requires specific information to configure a SAML integration. The following guide will walk you through on how you can connect ConfigCat with ADFS as a SAML Identity Provider.

### 1. Collect SAML Metadata from ConfigCat
- Open your organization's authentication settings on the <a href="https://app.configcat.com/organization/authentication" target="_blank">ConfigCat dashboard</a>.

  <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/authentication.png" />

- Select the domain you want to configure with SAML, and click `Set` under the `SAML SSO status`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/domains.png" />

- From the appearing dialog, copy the following values and save them for further use.
    - `Entity ID`
    - `Assertion Consumer Service`

    <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/saml_config.png" />

### 2. Configure a Relying Party Trust

- Open the ADFS Management console, and click `Add Relying Party Trust`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/2_add_relying_party.png" />

- Make sure the `Claims aware` option is selected, and click `Start`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/3_claims_aware.png" />

- Select the `Enter data about this relying party manually` option, and click `Next`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/4_manual_metadata.png" />

- Type a descriptive `Display name`, and click `Next`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/5_name.png" />

- No action required on the `Configure Certificate` pane, click `Next`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/6_configure_cert.png" />

- Select the `Enable support for the SAML 2.0 WebSSO protocol` option, and paste the value of `Assertion Consumer Service` from [Step 1](#1-collect-saml-metadata-from-configcat) into the `Relying party SAML 2.0 SSO service URL` field.  
Then, Click `Next`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/7_acs_url.png" />

- Paste the value of `Entity ID` from [Step 1](#1-collect-saml-metadata-from-configcat) into the `Relying party trust identifier` field, and click `Add`.  
Then, click `Next`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/8_add_entity_id.png" />

- No action required on the `Choose Access Control Policy` pane, click `Next`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/9_access_control_policy.png" />

- Review the changes, then click `Next`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/10_ready_to_add_trust.png" />

- The Relying Party Trust is now successfully added, make sure the `Configure claims issuance policy for this application` option is checked, and click `Close`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/11_finish_party.png" />

### 3. Configure Claims Issuance Policy

- After adding the Relying Party Trust, the following dialog should appear.  
Click `Add rule`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/12_edit_claims.png" />

- Select `Send LDAP Attributes as Claims` as the `Claim rule template`, and click `Next`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/13_ldap_claims.png" />

- Apply the following, and click `Finish`.
    - Add a descriptive `Claim rule name`.
    - Select `Active Directory` as `Attribute store`.
    - Select `User-Principal-Name` as `LDAP Attribute`.
    - Select `Name ID` as `Outgoing Claim Type`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/14_unc_to_nameid.png" />

- Click `OK`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/15_finish_claims.png" />

### 4. Configure ConfigCat with SAML Details from ADFS

You can choose one of the following options to configure ConfigCat with SAML Identity Provider metadata.

<Tabs>
  <TabItem value="metadataUrl" label="Metadata URL" default>
    <ul>
      <li>
        <p>Select <code>Endpoints</code>, and copy the URL Path of the <code>Federation Metadata</code> endpoint.</p>
        <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/metadata_url.png" />
      </li>
      <li>
        <p>Type the URL into the <code>Metadata URL</code> field at ConfigCat in the following format: <code>https://[ADFS-DOMAIN]/[FEDERATION-METADATA-URL-PATH]</code>.</p>
        <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/cc_metadata.png" />
      </li>
      <li>
        Click on <code>Save</code>.
      </li>
    </ul>
  </TabItem>
  <TabItem value="manual" label="Manual Configuration">
    <ul>
      <li>
        <p>Select <code>Endpoints</code>, and save the URL Path of the <code>SAML 2.0/WS-Federation</code> endpoint.</p>
        <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/login_url.png" />
      </li>
      <li>
        <p>Select <code>Certificates</code>, then select the <code>Token Signing</code> certificate, and click <code>View Certificate</code>.</p>
        <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/view_cert.png" />
      </li>
      <li>
        <p>On the <code>Details</code> tab click <code>Copy to File</code>.</p>
        <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/copy_cert_to_file.png" />
      </li>
      <li>
        <p>Click <code>Next</code>.</p>
        <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/cert_wizard.png" />
      </li>
      <li>
        <p>Select the <code>Base-64 encoded X.509 (.CER)</code> option, and click <code>Next</code>.</p>
        <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/cert_export_base64.png" />
      </li>
      <li>
        <p>Browse the location where the certificate should be exported, and click <code>Next</code>.</p>
        <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/cert_name.png" />
      </li>
      <li>
        <p>Click <code>Finish</code>.</p>
        <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/cert_finish.png" />
      </li>
      <li>
        <p>Click <code>OK</code>.</p>
        <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/cert_export_ok.png" />
      </li>
      <li>
        <p>Type the <code>SAML 2.0/WS-Federation</code> endpoint into the <code>Sign-on URL</code> field in the following format: <code>https://[ADFS-DOMAIN]/[WS-FEDERATION-URL-PATH]</code>.
        Then, paste the exported <code>Token Signing</code> certificate into the <code>X.509 Certificate</code> field.</p>
        <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/cc_manual.png" />
      </li>
      <li>
        Click on <code>Save</code>.
      </li>
    </ul>
  </TabItem>
</Tabs>

### 5. Sign In
- Go to the <a href="https://app.configcat.com/login" target="_blank">ConfigCat Log In</a> page, and click `COMAPNY ACCOUNT - SAML`.
  
  <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/saml_login.png" />

- Sign in with your company email address.

  <img class="saml-tutorial-img" src="/docs/assets/saml/dashboard/company_email.png" />

- ConfigCat will redirect you to the ADFS sign in page. Type your credentials, and click `Sign in`.

  <img class="saml-tutorial-img" src="/docs/assets/saml/adfs/login.png" />

- You should be redirected to ConfigCat signed in with your company account.

### 6. Next Steps

- Configure the [auto-assignment of users](/docs/advanced/team-management/auto-assign-users).