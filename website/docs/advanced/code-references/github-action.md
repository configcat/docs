---
id: github-action
title: GitHub Action - Scan your source code for feature flags
---

This section describes how to use ConfigCat's <a target="_blank" href="https://github.com/marketplace/actions/configcat-scan-repository">GitHub Action</a>
to automatically scan your source code for feature flag and setting usages and upload the found code references to ConfigCat.
You can find more information about GitHub Actions <a target="_blank" href="https://github.com/features/actions">here</a>.

## Setup

1. Create a new <a target="_blank" href="https://app.configcat.com/my-account/public-api-credentials">ConfigCat Management API credential</a> and store its values in your repository's <a target="_blank" href="https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository">GitHub Secrets</a> with the following names: `CONFIGCAT_API_USER`, `CONFIGCAT_API_PASS`.
   <img className="bordered zoomable" src="/docs/assets/cli/scan/gh_secrets.png" alt="Github Action secrets" />

2. Get your selected [Config's ID](/docs/advanced/code-references/index#config-id).

3. Create a new Actions workflow in your GitHub repository under the `.github/workflows` folder, and put the following snippet into it. Don't forget to replace the `PASTE-YOUR-CONFIG-ID-HERE` value with your actual Config ID.

   ```yaml
   on: [push]
   name: Code references
   jobs:
     scan-repo:
       runs-on: ubuntu-latest
       name: Scan repository for code references
       steps:
         - name: Checkout
           uses: actions/checkout@v3
         - name: Scan & upload
           uses: configcat/scan-repository@v2
           with:
             api-user: ${{ secrets.CONFIGCAT_API_USER }}
             api-pass: ${{ secrets.CONFIGCAT_API_PASS }}
             config-id: PASTE-YOUR-CONFIG-ID-HERE
             # line-count: 5             # optional
             # sub-folder: src           # optional
             # exclude-keys: >           # optional
             #   flag_key_to_exclue_1
             #   flag_key_to_exclue_2
             # verbose: true             # optional
   ```

4. Commit & push your action.

The above example configures a workflow that executes the scan and code references upload on every git `push` event.
Scan reports are uploaded for each branch of your repository that triggers the workflow.

## Available Options

| Parameter      | Description                                                                                                                                       | Required | Default             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------- |
| `config-id`    | ID of the ConfigCat config to scan against.                                                                                                       | &#9745;  |                     |
| `api-user`     | <a target="_blank" href="https://app.configcat.com/my-account/public-api-credentials">ConfigCat Management API basic authentication username</a>. | &#9745;  |                     |
| `api-pass`     | <a target="_blank" href="https://app.configcat.com/my-account/public-api-credentials">ConfigCat Management API basic authentication password</a>. | &#9745;  |                     |
| `api-host`     | ConfigCat Management API host.                                                                                                                    |          | `api.configcat.com` |
| `line-count`   | Context line count before and after the reference line. (min: 1, max: 10)                                                                         |          | 4                   |
| `sub-folder`   | Sub-folder to scan, relative to the repository root folder.                                                                                       |          |                     |
| `exclude-keys` | List of feature flag keys that must be excluded from the scan report.                                                                             |          |                     |
| `verbose`      | Turns on detailed logging.                                                                                                                        |          | false               |
