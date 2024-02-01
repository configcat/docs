---
id: jira
title: Jira Cloud Plugin - Manage feature flags from Jira
description: ConfigCat Jira Cloud Plugin. This is a step-by-step guide on how to connect and manage feature flags from Jira Cloud boards.
---

Turn features On / Off right from a linked Issue on your Jira board with <a href="https://marketplace.atlassian.com/1222421" target="_blank">ConfigCat Feature Flags Jira Cloud Plugin</a>. Also you can add Targeting or Percentage Rules just as easily.

## Installation

<img src="/docs/assets/jira/auth.gif" className="zoomable" alt="Installation of the ConfigCat Feature Flags Jira Cloud Plugin" />

1. Add <a href="https://marketplace.atlassian.com/1222421" target="_blank">ConfigCat Feature Flags</a> to your Jira Cloud instance.
2. Select `Configure`.
3. Get your ConfigCat Public API credentials: https://app.configcat.com/my-account/public-api-credentials
4. Click authorize.

> Every Jira user should authorize ConfigCat in Jira who wants to use the ConfigCat Feature Flags Jira Cloud Plugin.

## Usage

### Linking existing feature flags

<img src="/docs/assets/jira/link-existing.gif" className="zoomable" alt="Linking existing feature flags in Jira Cloud Plugin" />

1. Open any Issue on your Jira board.
2. Push `Link/Create ConfigCat Feature Flag`
3. On the `Link existing` tab select a ConfigCat Product, Config, Environment and a Feature Flag to be linked to your issue.
4. When linked, you can turn your features On / Off right from this Issue.

### Creating new feature flags

<img src="/docs/assets/jira/create-link.gif" className="zoomable" alt="Create feature flags in Jira Cloud Plugin" />

1. Open any Issue on your Jira board.
2. Push `Link/Create ConfigCat Feature Flag`
3. On the `Create and Link` tab select a ConfigCat Product, Config where you want to create the feature flag.
4. Setup your feature flag.
5. Select which environment would you like to link to this item.
6. When linked, you can turn your features On / Off right from this Issue.

### View and Edit linked feature flags

<img src="/docs/assets/jira/edit-ff.gif" className="zoomable" alt="View and Edit linked feature flags in Jira Cloud Plugin" />

1. Open an Issue on your Jira board with linked feature flag.
2. You can see the linked feature flags in the `Feature Flag (ConfigCat)` issue section.
3. You can turn your features On / Off right from this Issue.
4. You can add new targeting rules, target a new segment or target a percentage of users.
5. You can remove targeting rules as well.
6. To see the feature flag in the ConfigCat dashboard just use the `Open in ConfigCat` link.

### Remove linked feature flags

<img src="/docs/assets/jira/remove-ff.gif" className="zoomable" alt="Remove linked feature flags in Jira Cloud Plugin" />

1. Open an Issue on your Jira board with linked feature flag.
2. Remove the linked feature flag by clicking the red X in the top right corner.

### View flag status in Releases

<img src="/docs/assets/jira/release-field.gif" className="zoomable" alt="View feature flags in releases field" />

1. Open an Issue on your Jira board with linked feature flag.
2. Check the `Releases` field values in the issue Details section to see the linked feature flags status in the Issue.
3. Click it for more detailed dialog.

<img src="/docs/assets/jira/release-hub.gif" className="zoomable" alt="View feature flags in Release hub" />

1. Open a version in the project Release Hub to see the related issues feature flag status.
2. Click it for more detailed dialog.

### View linked issues in ConfigCat

<img src="/docs/assets/jira/open-from-dashboard.gif" className="zoomable" alt="Link in Dashboard" />

1. View linked issues next to your Feature Flags in ConfigCat and jump to the Jira Issue directly.
