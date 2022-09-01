---
id: saml-overview
title: SAML SSO Overview
description: This section is a step-by-step guide on how you can enable SAML Single Sign-On (SSO) for your organization in ConfigCat.
---

This section describes how you can enable SAML Single Sign-On (SSO) for your organization in ConfigCat.

SAML SSO allows your team members to sign up and log in to ConfigCat via their company accounts using your own Identity Provider (IdP).

Go to the [Authentication Preferences](https://app.configcat.com/organization/authentication/) page to set up SAML SSO. You need to be an 
organization admin to do this.


### Prerequisites
- [Verified domain](/advanced/team-management/domain-verification)  
  In order to configure SAML, you have to verify the ownership of the domain that your company uses for email addresses. This step is required, because at the beginning of the login process, we use the user's email domain to select the appropriate SAML Identity Provider. 
- Identity Provider that supports SAML 2.0

### Configure a SAML Identity Provider

We tested and validated the following SAML Identity Providers:
- [Azure AD](/advanced/team-management/saml/identity-providers/azure-ad)
- [ADFS](/advanced/team-management/saml/identity-providers/adfs)
- [Google](/advanced/team-management/saml/identity-providers/google)
- [Okta](/advanced/team-management/saml/identity-providers/okta)
- [Auth0](/advanced/team-management/saml/identity-providers/auth0)
- [OneLogin](/advanced/team-management/saml/identity-providers/onelogin)

:::info
Other Identity Providers might also work with ConfigCat, if they support the SAML 2.0 protocol.
:::


### Supported SAML flows
  - Identity Provider initiated SSO
  - Service Provider initiated SSO

### SAML Requirements
These are the Identity Provider configuration requirements for ConfigCat:

- **Name ID**: ConfigCat only supports the email address in the `NameID` field.
- **Signature algorithm**: ConfigCat only supports the `RSA-SHA256` signature algorithm.