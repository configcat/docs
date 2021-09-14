---
id: sso-overview
title: Overview
---

This section describes how you can enable SAML Single Sign-On (SSO) for your ConfigCat environment.

SAML SSO allows your team members to authenticate with ConfigCat via their company accounts using your own Identity Provider (IdP).

### Prerequisites
- [Verified domain](../domain-verification)  
  In order to configure SAML, you have to verify the ownership of the domain that your company uses for email addresses. This step is required, because at the beginning of the login process, we use the user's email domain to select the appropriate SAML Identity Provider. 
- Identity Provider that supports SAML 2.0

### Configure a SAML Identity Provider

We tested and validated the following SAML Identity Providers:
- [Azure AD](identity-providers/azure-ad)
- [ADFS](identity-providers/adfs)
- [Google](identity-providers/google)
- [Okta](identity-providers/okta)
- [Auth0](identity-providers/auth0)
- [OneLogin](identity-providers/onelogin)

:::info
Other Identity Providers might also work with ConfigCat, if they support the SAML 2.0 protocol.
:::

### SAML Attributes
- Supported SAML flows:
    - IdP initiated SSO
    - SP initiated SSO

- Required NameID format: `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`
- Supported Signature Algorithm: `RSA-SHA256`
#### 