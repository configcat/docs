---
id: github
title: GitHub Action
---

The [ConfigCat Feature Flag Reference Validator](https://github.com/configcat/feature-flag-reference-validator) CLI tool is available as a GitHub Action to integrate with GitHub workflows.

This tool can be used for discovering ConfigCat feature flag usages in your source code and validating them against your own ConfigCat configuration dashboard. It searches for ConfigCat SDK usage and greps the feature flag keys from the source code, then it compares them with the keys got from your ConfigCat dashboard.

## Installation
1. Get your API Key from [ConfigCat Dashboard](https://app.configcat.com/connect) and store it as a [GitHub secret](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) under the name `CONFIG_CAT_API_KEY`.

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
       - uses: actions/checkout@v1.0.0
       - name: ConfigCat Feature Flag Cleanup
         uses: configcat/github-action-feature-flag-cleanup@master
         with:
           configcat-api-key: ${{ secrets.CONFIG_CAT_API_KEY }}
           fail-on-warnings: false
   ```

  > We strongly recommend that you update the second uses attribute value to reference the latest tag in the [configcat/github-action-feature-flag-cleanup](https://github.com/configcat/github-action-feature-flag-cleanup) repository. This pins your workflow to a latest version of the action.

3. Commit & push `action.yml`.

## Usage

Feature Flag Cleanup Action will run on any push event.

> Will not block PR approvals until you set `fail-on-warnings: true`.

## Configuration options

Add these to the `with` section to enable more functionality.

| Parameter              | Description                                                                         |      Default       |
| ---------------------- | ----------------------------------------------------------------------------------- | :----------------: |
| `configcat-api-key`    | The [API Key](https://app.configcat.com/connect) for your feature flags & settings. | CONFIG_CAT_API_KEY |
| `scan-directory`       | The directory to run flag validations on.                                           |         .          |
| `configcat-cdn-server` | To set a custom ConfigCat CDN server.                                               | cdn.configcat.com  |
| `fail-on-warnings`     | Show warnings or stop on a build error when validation fails.                       |       false        |
| `debug`                | More verbose logging.                                                               |       false        |

## Documentation
For more information check the [official documentation](https://circleci.com/orbs/registry/orb/configcat/feature-flag-reference-validator) of ConfigCat's GitHub Action.
