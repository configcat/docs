---
id: slack
title: Slack - Get notified when a feature flag changes
description: ConfigCat Feature Flags Slack App. This is a step-by-step guide on how to connect the ConfigCat feature flag service to Slack.
---

## Overview

Get updated via a Slack Channel message when someone changes a feature flag with the <a href="https://configcat.slack.com/apps/A011CN2QZJB-configcat-feature-flags" target="_blank">ConfigCat Feature Flags Slack App</a>.

<img src="/docs/assets/slack/notification.png" className="zoomable" alt="slack_notification" />

## Installation

1. Open the <a href="https://app.configcat.com/product/integrations" target="_blank">integrations tab</a> on ConfigCat Dashboard.
1. Click on Slack's CONNECT button and connect ConfigCat Feature Flags with your Slack workspace.
1. You're all set. Go ahead and make some changes on your feature flags then check your Slack Channel for notifications.

## Un-installation

1. Open the <a href="https://app.configcat.com/product/integrations" target="_blank">integrations tab</a> on ConfigCat Dashboard.
1. Click on Slack's DISCONNECT button.

With disconnecting ConfigCat, it stops sending notifications to your selected Slack channel. To manage authorizations or remove the integration completely, please follow the instructions below:

1. Open your Slack App Directory: `<YOUR-WORKSPACE>.slack.com/apps/manage`
2. Select the `ConfigCat Feature Flags` app.
3. Select the `Configuration` tab.
   - If you'd like to remove the integration from an individual channel, you can just **Revoke** its access under the `Your authorization` section.
   - If you'd like to remove the integration from your workspace completely, click on the **Remove app** button under the `Remove app` section.

## Usage

1. Make some changes on your feature flags.
1. Check your Slack Channel for notifications.
