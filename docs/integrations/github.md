---
id: github
title: GitHub Action
---

The [ConfigCat Feature Flag Reference Validator](https://github.com/configcat/feature-flag-reference-validator) CLI tool is available as a GitHub Action to integrate with GitHub workflows.

This tool can be used for discovering ConfigCat feature flag usages in your source code and validating them against your own ConfigCat configuration dashboard. It searches for ConfigCat SDK usage and greps the feature flag keys from the source code, then it compares them with the keys got from your ConfigCat dashboard.

## How to use
Get your API Key from your [ConfigCat Dashboard](https://app.configcat.com/connect) and store it as a [GitHub secret](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) with the name `CONFIG_CAT_API_KEY` in your repository settings.

In yourt GitHub repository create a new Actions workflow.

- **If you already have an `action.yml` file:** Copy and paste the `ConfigCatCodeReferences` job declaration below into the jobs section in your `action.yml` file.
- **If you don't already have a workflow file:** Create a new file titled `action.yml` in the `.github/workflows` directory of your repository. Paste the following code in the **Edit file** section:

```yaml
on: push
name: Example Workflow
jobs:
  ConfigCatCodeReferences:
    name: ConfigCat Code References
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - name: ConfigCat Feature Flag Reference Validator
      uses: configcat/feature-flag-reference-validator-action@master
      with:
        configcat-api-key: ${{ secrets.CONFIG_CAT_API_KEY }}
        fail-on-warnings: false
```

> We strongly recommend that you update the second uses attribute value to reference the latest tag in the [configcat/feature-flag-reference-validator-action](https://github.com/configcat/feature-flag-reference-validator-action) repository. This pins your workflow to a latest version of the action.

Commit this file under a new branch and submit as a PR to your code reviewers to be merged into your master branch.

> Feature Flag Reference Validator are not blocked by PR approval. To block the PR use `fail-on-warnings: true`

As shown in the example above, the workflow should run on the push event and contain an action provided by the [configcat/feature-flag-reference-validator-action](https://github.com/configcat/feature-flag-reference-validator-action) repository.

## Documentation
For more information and usage examples check the [official documentation](https://circleci.com/orbs/registry/orb/configcat/feature-flag-reference-validator) of ConfigCat's GitHub Action.
