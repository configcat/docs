---
id: circleci-orb
title: CircleCI Orb - Scan your source code for feature flags
---

This section describes how to use ConfigCat's <a target="_blank" href="https://circleci.com/developer/orbs/orb/configcat/scan-repository">CircleCI Orb</a>
to automatically scan your source code for feature flag and setting usages and upload the found code references to ConfigCat. 
You can find more information about CircleCI Orbs <a target="_blank" href="https://circleci.com/orbs/">here</a>.

## Setup
1. Create a new <a target="_blank" href="https://app.configcat.com/my-account/public-api-credentials">ConfigCat Management API credential</a> and store its values in <a target="_blank" href="https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project">CircleCI Environment Variables</a> with the following names: `CONFIGCAT_API_USER`, `CONFIGCAT_API_PASS`.
    <img class="bordered" src="/docs/assets/cli/scan/cco_secrets.png" alt="CircleCI Orb secrets" />

2. Get your selected [Config's ID](/docs/advanced/code-references/overview#config-id).

3. Create a new CircleCI YAML config in your repository under the `.circleci` folder, and put the following snippet into it. 
   Don't forget to replace the `PASTE-YOUR-CONFIG-ID-HERE` value with your actual Config ID.
    ```yaml
    version: 2.1

    orbs:
      configcat: configcat/scan-repository@1.4.0

    workflows:
      main:
        jobs:
          - configcat/scan:
              config-id: PASTE-YOUR-CONFIG-ID-HERE # required
              file-url-template: 'https://github.com/your/repo/blob/{commitHash}/{filePath}#L{lineNumber}' # optional, used to generate links to your repository
              commit-url-template: 'https://github.com/your/repo/commit/{commitHash}' # optional, used to generate links to your repository
    ```

4. Commit & push your changes.

The above example configures a workflow that executes the scan and code reference upload on every git `push` event.
Scan reports are uploaded for each branch of your repository that triggers the workflow.

## Available Options

| Parameter             | Description                                                                | Required   | Default             |
| --------------------- | -------------------------------------------------------------------------- | ---------- | ------------------- |
| `config-id`           | ID of the ConfigCat config to scan against.                                | &#9745;    |                     |
| `api-host`            | ConfigCat Management API host.                                             |            | `api.configcat.com` |
| `api-user`            | Name of the environment variable where the <a target="_blank" href="https://app.configcat.com/my-account/public-api-credentials">ConfigCat Management API basic authentication username</a> is stored.                                                                                              |            | CONFIGCAT_API_USER  |
| `api-pass`            | Name of the environment variable where the <a target="_blank" href="https://app.configcat.com/my-account/public-api-credentials">ConfigCat Management API basic authentication password</a> is stored.                                                                                              |            | CONFIGCAT_API_PASS  |
| `file-url-template`   | Template url used to generate VCS file links. Available template parameters: `commitHash`, `filePath`, `lineNumber`. Example: https://github.com/my/repo/blob/{commitHash}/{filePath}#L{lineNumber}                           |            |                     |
| `commit-url-template` | Template url used to generate VCS commit links. Available template parameters: `commitHash`. Example: https://github.com/my/repo/commit/{commitHash}                                                                      |            |                     |
| `line-count`          | Context line count before and after the reference line. (min: 1, max: 10)  |            | 4                   |
| `sub-folder`          | Sub-folder to scan, relative to the repository root folder.                |            |                     |
| `verbose`             | Turns on detailed logging.                                                 |            | false               |

