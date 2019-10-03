---
id: circleci
title: CircleCI Orb
---

The [ConfigCat Feature Flag Reference Validator](https://github.com/configcat/feature-flag-reference-validator) CLI tool is available as a CircleCI Orb to integrate with CircleCI workflows.

This tool can be used for discovering ConfigCat feature flag usages in your source code and validating them against your own ConfigCat configuration dashboard. It searches for ConfigCat SDK usage and greps the feature flag keys from the source code, then it compares them with the keys got from your ConfigCat dashboard.

## How to use
Get your API Key from your [ConfigCat Dashboard](https://app.configcat.com/connect) and store it as a [CircleCI environment variable](https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project) with the name `CONFIG_CAT_API_KEY` in your project settings.

Then you can use ConfigCat's Orb as a job:
```yaml
version: 2.1
orbs:
  configcat: configcat/feature-flag-reference-validator@1.0.4
workflows:
  main:
    jobs:
      - configcat/validate-flag-references
```
Or as an individual command:
```yaml
version: 2.1
orbs:
  configcat: configcat/feature-flag-reference-validator@1.0.4
jobs:
  build:
    docker:
      - image: 'circleci/python:2.7'
    steps:
      - checkout:
          path: /repo
      - configcat/install-validator
      - configcat/execute-validation
```

## Documentation
For more information and usage examples check the [official documentation](https://circleci.com/orbs/registry/orb/configcat/feature-flag-reference-validator) of ConfigCat's Orb.