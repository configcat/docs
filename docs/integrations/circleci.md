---
id: circleci
title: CircleCI Orb
---

This utility discovers ConfigCat feature flag usages in your source code and validates them against your feature flags on the ConfigCat Dashboard.

The ConfigCat <a href="https://github.com/configcat/feature-flag-reference-validator" target="_blank">Feature Flag Reference Validator CLI</a> tool is available as a CircleCI Orb to integrate with CircleCI workflows.

## Usage
Get your API Key from your <a href="https://app.configcat.com/connect" target="_blank">ConfigCat Dashboard</a> and store it as a <a href="https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project" target="_blank">CircleCI environment variable</a> with the name `CONFIG_CAT_API_KEY` in your project settings.

Then you can use ConfigCat's Orb as a job:
```yaml
version: 2.1
orbs:
  configcat: configcat/feature-flag-reference-validator@1.1
workflows:
  main:
    jobs:
      - configcat/validate-flag-references
```
Or as an individual command:
```yaml
version: 2.1
orbs:
  configcat: configcat/feature-flag-reference-validator@1.1
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
For more information and usage examples check the <a href="https://circleci.com/orbs/registry/orb/configcat/feature-flag-reference-validator" target="_blank">documentation</a> of ConfigCat's Orb.
