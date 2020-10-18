---
id: github
title: GitHub Action
---

This utility discovers ConfigCat feature flag usages in your source code and validates them against your feature flags on the ConfigCat Dashboard.

The ConfigCat <a href="https://github.com/configcat/feature-flag-reference-validator" target="_blank">Feature Flag Reference Validator CLI</a> tool is available as a GitHub Action to integrate with GitHub workflows.


## Installation
1. Get your SDK Key from <a href="https://app.configcat.com/sdkkey" target="_blank">ConfigCat Dashboard</a> and store it as a <a href="https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets" target="_blank">GitHub secret</a> under the name `CONFIG_CAT_SDK-KEY`.

2. Create a new Actions workflow in your GitHub repo.

   - **If you already have an `action.yml` file:** Copy and paste the `ConfigCatFeatureFlagCleanup` job declaration below into the jobs section in your `action.yml` file.
   - **If you don't already have a workflow file:** Create a new file titled `action.yml` in the `.github/workflows` directory of your repository. Copy and paste the following code to `action.yml`.

   ```yaml
   on: push
   name: Example Workflow
   jobs:
     ConfigCatFeatureFlagCleanup:
       name: ConfigCat Feature Flag Cleanup
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v1
       - name: ConfigCat Feature Flag Cleanup
         uses: configcat/github-action-feature-flag-cleanup@1.0.0
         with:
           configcat-sdk-key: ${{ secrets.CONFIG_CAT_SDK-KEY }}
           fail-on-warnings: false
   ```
:::caution
We strongly recommend that you update the second uses attribute value to reference the latest tag in the <a href="https://github.com/configcat/github-action-feature-flag-cleanup" target="_blank">configcat/github-action-feature-flag-cleanup</a> repository. This pins your workflow to a latest version of the action.
:::

3. Commit & push `action.yml`.

## Usage

Feature Flag Cleanup Action will run on any push event.

> Will not block PR approvals until you set `fail-on-warnings: true`.

## Configuration options

Add these to the `with` section to enable more functionality.

| Parameter              | Description                                                                                                   |      Default       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- | :----------------: |
| `configcat-sdk-key`    | The <a href="https://app.configcat.com/sdkkey" target="_blank">SDK Key</a> for your feature flags & settings. | CONFIG_CAT_SDK-KEY |
| `scan-directory`       | The directory to run flag validations on.                                                                     |         .          |
| `configcat-cdn-server` | To set a custom ConfigCat CDN server.                                                                         | cdn.configcat.com  |
| `fail-on-warnings`     | Show warnings or stop on a build error when validation fails.                                                 |       false        |
| `debug`                | More verbose logging.                                                                                         |       false        |

## Documentation
For more information check the <a href="https://github.com/marketplace/actions/configcat-feature-flag-cleanup" target="_blank">ConfigCat's GitHub Action</a> on the GitHub Marketplace.
