---
id: adfs
title: ADFS Identity Provider
description: This is a step-by-step guide on how to set up and configure ADFS as a SAML Identity Provider for your organization.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Connect ConfigCat with Active Directory Federation Services (ADFS) via SAML.

### Introduction

Each SSO Identity Provider requires specific information to configure a SAML integration. The following guide will walk you through on how you can connect ConfigCat with ADFS as a SAML Identity Provider.

### 1. Collect SAML Metadata from ConfigCat

- Open your organization's authentication settings on the <a href="https://app.configcat.com/organization/authentication" target="_blank">ConfigCat dashboard</a>.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/authentication.png" alt="ConfigCat authentication settings" />

- Select the domain you want to configure with SAML, and click `Set` under the `SAML SSO status`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/domains.png" alt="ConfigCat SAML SSO status" />

- From the appearing dialog, copy the following values and save them for further use.

  - `Entity ID`
  - `Assertion Consumer Service`

    <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/saml_config.png" alt="ConfigCat SAML configuration" />

### 2. Configure a Relying Party Trust

- Open the ADFS Management console, and click `Add Relying Party Trust`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/2_add_relying_party.png" alt="ADFS add relying party trust" />

- Make sure the `Claims aware` option is selected, and click `Start`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/3_claims_aware.png" alt="ADFS claims aware" />

- Select the `Enter data about this relying party manually` option, and click `Next`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/4_manual_metadata.png" alt="ADFS manual relying party setup" />

- Type a descriptive `Display name`, and click `Next`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/5_name.png" alt="ADFS display name" />

- No action required on the `Configure Certificate` pane, click `Next`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/6_configure_cert.png" alt="ADFS certificate configuration" />

- Select the `Enable support for the SAML 2.0 WebSSO protocol` option, and paste the value of `Assertion Consumer Service` from [Step 1](#1-collect-saml-metadata-from-configcat) into the `Relying party SAML 2.0 SSO service URL` field.  
Then, Click `Next`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/7_acs_url.png" alt="ADFS acs URL" />

- Paste the value of `Entity ID` from [Step 1](#1-collect-saml-metadata-from-configcat) into the `Relying party trust identifier` field, and click `Add`.  
Then, click `Next`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/8_add_entity_id.png" alt="ADFS entity ID" />

- No action required on the `Choose Access Control Policy` pane, click `Next`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/9_access_control_policy.png" alt="ADFS Access Control Policy" />

- Review the changes, then click `Next`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/10_ready_to_add_trust.png" alt="ADFS add trust" />

- The Relying Party Trust is now successfully added, make sure the `Configure claims issuance policy for this application` option is checked, and click `Close`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/11_finish_party.png" alt="ADFS finish configuration" />

### 3. Configure Claims Issuance Policy

- After adding the Relying Party Trust, the following dialog should appear.  
Click `Add rule`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/12_edit_claims.png" alt="ADFS edit claims" />

- Select `Send LDAP Attributes as Claims` as the `Claim rule template`, and click `Next`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/13_ldap_claims.png" alt="ADFS LDAP claims" />

- Apply the following, and click `Finish`.

  - Add a descriptive `Claim rule name`.
  - Select `Active Directory` as `Attribute store`.
  - Select `User-Principal-Name` as `LDAP Attribute`.
  - Select `Name ID` as `Outgoing Claim Type`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/14_unc_to_nameid.png" alt="ADFS unc to nameid" />

- Click `OK`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/15_finish_claims.png" alt="ADFS finish claims" />

### 4. Configure ConfigCat with SAML Details from ADFS

You can choose one of the following options to configure ConfigCat with SAML Identity Provider metadata.

<Tabs>
  <TabItem value="metadataUrl" label="Metadata URL" default>
    <ul>
      <li>
        <p>Select <code>Endpoints</code>, and copy the URL Path of the <code>Federation Metadata</code> endpoint.</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/metadata_url.png" alt="ADFS metadata url path" />
      </li>
      <li>
        <p>Type the URL into the <code>Metadata URL</code> field at ConfigCat in the following format: <code>https://[ADFS-DOMAIN]/[FEDERATION-METADATA-URL-PATH]</code>.</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/cc_metadata.png" alt="ADFS metadata url" />
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
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/login_url.png" alt="ADFS SAML verification" />
      </li>
      <li>
        <p>Select <code>Certificates</code>, then select the <code>Token Signing</code> certificate, and click <code>View Certificate</code>.</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/view_cert.png" alt="ADFS certificates" />
      </li>
      <li>
        <p>On the <code>Details</code> tab click <code>Copy to File</code>.</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/copy_cert_to_file.png" alt="ADFS cert details" />
      </li>
      <li>
        <p>Click <code>Next</code>.</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/cert_wizard.png" alt="ADFS cert wizard" />
      </li>
      <li>
        <p>Select the <code>Base-64 encoded X.509 (.CER)</code> option, and click <code>Next</code>.</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/cert_export_base64.png" alt="ADFS export base64" />
      </li>
      <li>
        <p>Browse the location where the certificate should be exported, and click <code>Next</code>.</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/cert_name.png" alt="ADFS cert name" />
      </li>
      <li>
        <p>Click <code>Finish</code>.</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/cert_finish.png" alt="ADFS finish cert" />
      </li>
      <li>
        <p>Click <code>OK</code>.</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/cert_export_ok.png" alt="ADFS cert OK" />
      </li>
      <li>
        <p>Type the <code>SAML 2.0/WS-Federation</code> endpoint into the <code>Sign-on URL</code> field in the following format: <code>https://[ADFS-DOMAIN]/[WS-FEDERATION-URL-PATH]</code>.
        Then, paste the exported <code>Token Signing</code> certificate into the <code>X.509 Certificate</code> field.</p>
        <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/cc_manual.png" alt="ConfigCat manual configuration" />
      </li>
      <li>
        Click on <code>Save</code>.
      </li>
    </ul>
  </TabItem>
</Tabs>

### 5. Sign In

- Go to the <a href="https://app.configcat.com/login" target="_blank">ConfigCat Log In</a> page, and click `COMPANY ACCOUNT - SAML`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/saml_login.png" alt="ConfigCat SAML login" />

- Sign in with your company email address.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/dashboard/company_email.png" alt="ConfigCat SAML company login" />

- ConfigCat will redirect you to the ADFS sign in page. Type your credentials, and click `Sign in`.

  <img className="saml-tutorial-img zoomable" src="/docs/assets/saml/adfs/login.png" alt="ADFS log in" />

- You should be redirected to ConfigCat signed in with your company account.

### 6. Next Steps

- Configure the [auto-assignment of users](/docs/advanced/team-management/auto-assign-users).
