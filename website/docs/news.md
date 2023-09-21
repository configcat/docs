---
id: news
title: News & Product Updates
description: Network Traffic refers to the data transmitted between your applications and ConfigCat servers.
---

Instead of spamming your mailbox, we're posting news and product updates here.

## Manage Permission Groups with Terraform

#### Aug 23, 2023

Introducing Permission Group management in [**ConfigCat Feature Flags Provider for Terraform**](https://registry.terraform.io/providers/configcat/configcat/latest/docs)! Use the [**configcat_permission_group**](https://registry.terraform.io/providers/configcat/configcat/latest/docs/resources/permission_group) resource for control and the [**configcat_permission_groups**](https://registry.terraform.io/providers/configcat/configcat/latest/docs/data-sources/permission_groups) data source for access to existing Permission Groups.

## Some updates regarding SLA guaranteed Uptime

#### Aug 15, 2023

We're excited to announce important updates to our Service Level Agreement (SLA) concerning uptime commitments.

We're increasing our uptime commitment for the following plans:

| Uptime Changes | Previous | Current |
| | -- | |
| Free Plan | 99% | 99% (No Change) |
| Pro Plan | 99.8% | 99.9% |
| Smart Plan | 99.9% | 99.95% |
| Enterprise Plan | 99.9% | 99.99% |
| Dedicated Plan | 99.9% | 99.99% |

By enhancing our SLA terms, we aim to provide a more consistent and trustworthy service that you can depend on, day in and day out.

## Old SDKs will stop working after October 1st, 2023.

#### Aug 10, 2023

All ConfigCat SDKs released before Feb, 2020 will stop working after October 1st, 2023. Please, upgrade all your SDKs to the latest.

Although we aim to keep older SDK versions functional, those trailing more than one major or minor release lack official support and SLA. Many of these outdated SDKs will no longer remain functional.

### Affected SDKs and versions:

| SDK Type | Latest available version | Will stop working |
| -- | | -- |
| Python | v8.0.0 | < v3.0.2 |
| Ruby | v7.0.0 | < v2.0.3 |
| .NET | v8.2.0 | < v4.0.0 |
| Go | v8.0.0 | < v4.0.0 |
| Java | v8.2.2 | < v4.0.0 |
| Android | v9.0.1 | < v4.0.0 |
| JS | v8.1.0 | < v3.0.0 |
| JS-SSR | v7.1.0 | < v1.0.2 |
| Node | v10.1.0 | < v4.0.0 |
| PHP | v7.1.1 | < v3.0.2 |
| Swift | v9.4.0 | < v4.0.0 |

[Check outdated ConfigCat SDKs in your applications.](#) (Note: This link might need adjustments as its behavior was tied to Angular's routerLink and \*ngIf directives)

## Introducing Network Traffic limits for all plans

#### Aug 1, 2023

We are introducing [**Network Traffic**](https://configcat.com/docs/network-traffic/) limits for all plans. The usage is based on the Network Traffic your applications are making to the ConfigCat CDN.

### Why are we introducing these limits?

Our cloud provider charges us for the Network Traffic we use to serve your feature flags. By introducing these limits, we can cover these costs and continue providing the service. Instead of raising prices for all users in general, we decided to specifically reflect the network-related operation costs in our current pricing plans.

### What are the limits?

| Free | Pro | Smart | Enterprise |
| - | -- | | - |
| 20 GB / mo | 100 GB / mo | 1 TB / mo | 4 TB / mo |

### What to expect?

94% of our users will not be affected by these limits. If you are in the 6% that exceeds the limit, we will reach out to you directly to assist in the next 3 months in finding the best solution for your specific use case. Rest assured that even if you exceed the limit, your feature flags will continue to work seamlessly.

If you have any further questions or need assistance, please don't hesitate to [**reach out to us**](https://configcat.com/support). We're here to help!

[Monitor your organization's network traffic on the Usage & Quota page.](#) (Note: This link might need adjustments as its behavior was tied to Angular's routerLink and \*ngIf directives)

## Introducing "Test with User"

#### Jul 26, 2023

We're pleased to announce the arrival of "Test with User" for feature flags!

With "Test with User," you can now test your feature flags before deploying them to production. Wondering how your flags will perform for specific users? This feature allows you to see the evaluation results based on a given user object.

Located in the Actions menu of every feature flag:

<!-- ![Testing menu](/assets/images/news/tryit1.png) -->

You also get a detailed log of the flag evaluations. Easily monitor and analyze how your flags behave for different user properties:

<!-- ![Testing dialog](/assets/images/news/tryit2.png) -->

## ConfigCat Stickers

#### Feb 13, 2023

<!-- ![Stickers](/assets/images/news/stickers.png) -->

We just had a bunch of ConfigCat stickers printed. And we're happy to send you a pack in return for a short review on one of the following review sites:

- [G2 Crowd](https://www.g2.com/products/configcat/take_survey)
- [TrustRadius](https://www.trustradius.com/welcome/configcat)
- [TrustPilot](https://www.trustpilot.com/evaluate/configcat.com)
- [Capterra](https://reviews.capterra.com/new/187099)
- [Alternative.me](https://alternative.me/configcat#ConfigCat_Reviews)

[Ask for your pack here](https://forms.gle/uFn4CawYgwGc3m716)

## Chromium Extension SDK (Beta)

#### Dec 3, 2022

A new JS SDK for Chromium Extensions supporting the [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/) API is now on public beta and available via [npm](https://www.npmjs.com/package/configcat-js-chromium-extension).

<!-- ![Chromium logo](/assets/images/languages/chromium.svg) -->

[Open on GitHub](https://github.com/configcat/js-chromium-extension-sdk)

## New ConfigCat SDK for C++

#### Oct 7, 2022

We just released a new official ConfigCat SDK supporting C++ applications.

<!-- ![ConfigCat SDK for C++](/assets/images/languages/cpp.png) -->

[See Documentation](https://configcat.com/docs/sdk-reference/cpp/)

## New ConfigCat SDK for React

#### Sept 6, 2022

We just released a new official ConfigCat SDK supporting React applications.

[See Documentation](https://configcat.com/docs/sdk-reference/react/)

## monday.com integration

#### Jul 18, 2022

Turn your features On / Off right from a monday.com item.

[ConfigCat Feature Flags monday.com app](https://monday.com/marketplace/10000079)

<!-- ![ConfigCat Feature Flags monday.com app](/assets/images/integrations/monday.png) -->

## ISO/IEC 27001:2013 certification

#### Jun 27, 2022

We're happy to announce that ConfigCat has achieved the ISO/IEC 27001:2013 certification for Information Security Management Systems (ISMS).

[Read more and download the certificates here](https://configcat.com/iso/)

## Reordering feature flags and other entities

#### Mar 22, 2022

<!-- Click the ![reorder icon](../../../../assets/images/reorder.svg) icon on any overview to change the ordering of your feature flags, environments, configs, or products. -->

<!-- ![Reorder](/assets/images/news/reorder.png) -->

## Copy feature flag values between environments

#### Feb 23, 2022

You can copy feature flag values (including segment, targeting, percentage rules) from one environment to another.

<!-- ![Copy-to](/assets/images/news/copy-to.png) -->

## Segments are here!!!

#### Feb 15, 2022

Segments let you group your users based on any of their properties (e.g: Beta Testers). You can target the same segment with multiple feature flags.

[Go to segments](/product/segments)

## TV Mode

#### Dec 15, 2021

Display your feature flags on the TVs around the office!

<!-- ![TV Mode](/assets/images/news/tv-mode.png) -->

[Config overview](/overview)

## Config Overview

#### Nov 17, 2021

Introducing a new overview to track your feature flag values in all your environments side-by-side.

<!-- ![Config Overview](/assets/images/news/config-overview.png) -->

Open the environment menu to access the overview.

<!-- ![Config Overview Menu](/assets/images/news/config-overview-menu.png) -->

[Open config overview](/overview)

## "Which projects are using this flag?"

#### Nov 2, 2021

ConfigCat: "Say no more fam! Let me show you!"

<!-- ![Code references](/assets/images/news/code-refs.png) -->

[See the documentation for details](https://configcat.com/docs/advanced/code-references/overview)

## Searching feature flags instead of Ctrl+F

#### Oct 5, 2021

Added a search bar to the feature flags page.

<!-- ![Search](/assets/images/news/search.png) -->

We recommend using it instead of Ctr+F and Cmd+F since the page is lazy loaded. So it might not yield results from parts of the page that are not currently rendered.

## Environment colors are finally here!

#### Sep 24, 2021

Just updated the UX on the product overview page and added a few small features.

- You can choose from a number of colors for your environments.
- Also adding descriptions helps teammates to find their way around environments and configs.

[Set your colors and add descriptions on the product overview page](/product)

## Send less invitations using SAML SSO, Auto-assign users and product join requests

#### Sep 23, 2021

To make organization level user management more convenient we added a bunch of new features:

- Added an [organization overview](/organization) page to see products more clearly.
- Team members can send join requests to admins if they want to join a product.
- Whenever someone signs up to ConfigCat using a verified email domain, they could be automatically assigned to products.
- SAML Single Sign-On supporting all of the major identity providers.
- Improved layout for admins to [manage organization members](/organization/members).

_Only team members with Organization Admin role can access these features._

[Set up user provisioning and SAML Single Sign-On](/organization/authentication)

## New Organization Admin functionalities

#### Aug 13, 2021

- Organization Admins can remove a member from the whole organization.
- Organization Admins can modify a member's permissions globally.

_Only team members with Organization Admin role can access these features._

[Open Organization Members & Roles page](/organization/members)

## Disable Two-factor authentication

#### Aug 4, 2021

Disable Two-factor authentication for your team members. This feature is useful if somebody lost the device used for Two-factor authentication.

_Only team members with Organization Admin role can disable Two-factor authentication._

[Open Organization Members & Roles page](/organization/members)

## Export / Import

#### Jul 28, 2021

Export (download), and import (upload) Configs, Environments, and Feature Flags from, and to file.

<!-- ![Export / Import](/assets/images/news/export-import.png) -->

[Open Export / Import page](/product/exportimport)

## Dashboard v3 released!

#### Jun 30, 2021

Hope you like it.

<!-- ![Celebrating Cat](../../../assets/images/cat_celebrating.svg) -->

Tell us your opinion over [Slack](https://configcat.com/slack) or [Email](mailto:team@configcat.com).

## Help us grow!

#### Jun 10, 2021

If you like ConfigCat, you can help us grow by leaving a review. Plus Capterra is giving **20€ as a reward** to the first 100 reviewers.

Any of the following works:

- [TrustRadius](https://www.trustradius.com/welcome/configcat)
- [Trust Pilot](https://www.trustpilot.com/evaluate/configcat.com)
- [G2 Crowd](https://www.g2.com/products/configcat/reviews/start)
- [Capterra](https://reviews.capterra.com/new/187099) (**20€ reward**)
- [Alternative.me](https://alternative.me/configcat)
- [AlternativeTo](https://alternativeto.net/software/configcat/reviews)

## Visual Studio Code Extension

#### May 06, 2021

Turn your features On / Off and manage your Feature Flags from Visual Studio Code.

- [Visual Studio Code Extension](https://marketplace.visualstudio.com/items?itemName=ConfigCat.configcat-feature-flags)

## Detailed Permission Group system

#### Mar 10, 2021

Permission Groups can be customized in more advanced levels:

- Resource-based permissions (Configs, Environments, Tags, Webhooks)
- Create/Update and Delete permissions are separated
- Team member management permission
- Product preferences permission
- Product Audit Log/Statistics permission
- Integration management permission
- SDK Key View/Rotate permissions

- [Fine-tune Permission Groups](/product/permission-groups)

## Zombie Flags (Stale Flags) Report via email

#### Mar 4, 2021

Feature flags have a tendency to multiply rapidly. In order to keep the tech-debt low, we recommend removing the flags no longer needed. You can now set up a regular email report with a list of these zombie or stale flags.

<!-- ![Watch button location](/assets/images/news/watch.png) -->

- [Set up the Zombie Flags Report](/zombie-flags-report)

## Invoice download

#### Feb 8, 2021

You can download all your current and previous invoices from the Billing & Invoices page.

- [Open Billing & Invoices](/organization/billing)

## Accepting USD payments

#### Nov 26, 2020

We are accepting payments in USD from now on.

- [See plans](/organization/plans)

## ConfigCat & Zoho Flow

#### Nov 21, 2020

ConfigCat's Zoho Flow integration is now available.

- [Detailed Docs and Setup Guide](https://configcat.com/docs/integrations/zoho-flow)

## Default Permission Group

#### Nov 13, 2020

Set a default Permission Group for Team member invites. The chosen group will be the default on the permission group list when inviting others. So you can be sure not to invite someone as an admin by accident.

<!-- ![Default permission group](/assets/images/news/default-permission-group.png) -->

## Amplitude integration

#### Oct 28, 2020

Annotate your setting changes on your Amplitude charts.

<!-- ![Amplitude](/assets/images/news/amplitude.png) -->

- [Docs and Setup Guide](https://configcat.com/docs/integrations/amplitude)

## ConfigCat Feature Flags Provider for Terraform

#### Oct 16, 2020

Configure and access ConfigCat resources via Terraform.

- [ConfigCat Feature Flags Provider for Terraform](https://registry.terraform.io/providers/configcat/configcat/latest/docs)

## Data Governance - Action required

#### Oct 10, 2020

Addressing global data handling and processing trends, we have introduced the Data Governance feature in ConfigCat. We require all our customers to make a statement if they want to use our:

- **Global CDN**: providing geo-location based load balancing on server nodes all around the globe to ensure low response times.
- **EU CDN**: Staying compliant with GDPR by using ConfigCat EU CDN. This way your data will never leave the EU.

- [Read more on Data Governance and CDN](https://configcat.com/docs/advanced/data-governance)

## Organization Management

#### Sep 07, 2020

Featuring:

- **Organization Admin** and **Billing Manager** roles.
- General **security** preferences for the entire organization.
- Customizable **SSO** methods.
- Organization level **audit logs** and usage **statistics**.

<!-- ![Manage Organization](/assets/images/news/organization-menu.png) -->

- [See Docs](https://configcat.com/docs/organization)

## Public Management API v1 released

#### Jul 08, 2020

You can programmatically CREATE, UPDATE, DELETE Feature Flags, Configs, Products and Environments from now on!

<!-- ![Public API](/assets/images/news/public-api.png) -->

- [See Docs and examples](https://api.configcat.com/docs)

## Tags & Filtering

#### May 29, 2020

Add colored tags to your feature flags.

<!-- ![Tags](/assets/images/news/tags.png) -->

## Jira Cloud Plugin

#### May 28, 2020

Turn your features On / Off right from a Jira Issue.

- [ConfigCat Jira Cloud Plugin](https://marketplace.atlassian.com/apps/1222421/configcat-feature-flags?hosting=cloud&tab=overview)

## Slack App

#### April 12, 2020

Get updated via a Slack Channel message when someone changes a feature flag.

- [ConfigCat Feature Flags in Slack App Directory](https://configcat.slack.com/apps/A011CN2QZJB-configcat-feature-flags)

<!-- ![Slack Notification](/assets/images/news/slack-notification.png) -->

## API Key --> SDK Key

#### April 7, 2020

Renamed API Key to SDK Key since it was more confusing as the Public Management API went to production. The API and the API Key are not related. This is a breaking change in some of the SDKs, released under new major versions.

## New JavaScript SDK for SSR

#### April 3, 2020

New JavaScript SDK supporting Server Side Rendered (SSR) frameworks like [NuxtJS](https://nuxtjs.org).

- [See Documentation](https://configcat.com/docs/sdk-reference/js-ssr/)

## Trello Power-Up

#### March 30, 2020

Turn your features On / Off right from a Trello Card.

- [ConfigCat Power-Up](https://trello.com/power-ups/5e694b66d2511a3601ebd0fb)

## Integrations

#### March 21, 2020

Connect the apps you use everyday and be more productive. Check out the [Integrations](/product/integrations) tab.

<!-- ![Integrations Image](/assets/images/news/integrations.png) -->

## View SDK Key permission

#### March 21, 2020

Visibility of information that is normally useful for developers only - like SDK Keys and code examples - can be set for [Permission Groups](/product/permission-groups).

<!-- ![SDK Key Image](/assets/images/news/can-view-apikey.png) -->

## Audit log improvements

#### March 20, 2020

User friendly Feature Flag or Setting value changes in the [Audit log](/auditlog) to improve readability.

<!-- ![Audit log Image](/assets/images/news/audit-log.png) -->

## Long text improvements

#### March 20, 2020

Feature Flag or Setting text values and Targeting comparison values can be viewed and updated in a `textarea`.

<!-- ![Long Text Image](/assets/images/news/long-text.png) -->

## Upper case key generation mode

#### March 17, 2020

Besides "camelCase" and "lower_case" we have added an "UPPER_CASE" key generation mode to preferences.

- [Open Preferences](/product/preferences)

## Statistics

#### March 15, 2020

See detailed statistics about the number of config.json downloads made towards ConfigCat CDN. Also a pie-chart of the SDK types and versions being used.

<!-- ![Statistics Image](/assets/images/news/stats.png) -->

- [Open Stats](/product/statistics)

## ConfigCat Zap

#### March 12, 2020

Zapier integration is now accessible.

- [Detailed Docs and Setup Guide](https://configcat.com/docs/integrations/zapier)

## Public Management API (Beta)

#### March 11, 2020

Released Public Management API to Beta. From now on you can execute Dashboard management operations programmatically.

- [API Documentation](https://api.configcat.com/docs/index.html)

## Sensitive text comparators

#### March 3, 2020

Introduced sensitive text comparators to make sure sensitive info (like email address, user name) is kept hidden in targeting rules. Comes handy in front-end applications.

<!-- ![Sensitive Image](/assets/images/news/sensitive.png) -->

- [Detailed Docs about comparators](https://configcat.com/docs/advanced/targeting/#comparator)
- [Related blog post](https://configcat.com/blog/2020/03/02/sensitive-comparators/)

## Semantic version based user targeting

#### March 3, 2020

Especially useful for Mobile developers.

<!-- ![Semver Image](/assets/images/news/semver-menu.png) -->

- [Detailed Docs about comparators](https://configcat.com/docs/advanced/targeting/#comparator)
- [Related blog post](https://configcat.com/blog/2020/01/27/semver)

## Ruby SDK

#### Oct 29, 2019

It is out!

- [Ruby SDK Docs](https://configcat.com/docs/sdk-reference/ruby/)
- [GitHub repo](https://github.com/configcat/ruby-sdk)
- [Blog post](https://configcat.com/blog/2019/10/29/ruby/)
