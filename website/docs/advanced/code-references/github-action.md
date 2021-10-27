---
id: github-action
title: GitHub Action
---

This section will describe how to use ConfigCat's <a target="_blank" href="https://github.com/configcat/scan-repository">GitHub Action</a>
to scan your source code for feature flag and setting usages, and to upload the scan report to ConfigCat.

## Configuration
1. Create a new <a target="_blank" href="https://app.configcat.com/my-account/public-api-credentials">ConfigCat Management API credential</a> and store its values in your repository's <a target="_blank" href="https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository">GitHub Secrets</a> with the following names: `CONFIGCAT_API_USER`, `CONFIGCAT_API_PASS`.
    <img class="bordered" src="/docs/assets/cli/scan/gh_secrets.png" />

2. Get your selected [Config's ID](/docs/advanced/code-references/overview#config-id).

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
          uses: actions/checkout@v2
        - name: Scan & upload
          uses: configcat/scan-repository@v1
          with:
            api-user: ${{ secrets.CONFIGCAT_API_USER }}
            api-pass: ${{ secrets.CONFIGCAT_API_PASS }}
            config-id: PASTE-YOUR-CONFIG-ID-HERE
    ```

4. Commit & push your action.

The above example configures a workflow that executes the scan and code references upload on every git `push` event.
The code references will be uploaded for each branch in your repository that triggers the workflow.

## Available Options

| Parameter     | Description                                                                | Required   | Default             |
| ------------- | -------------------------------------------------------------------------- | ---------- | ------------------- |
| `api-host`    | ConfigCat Management API host.                                             | &#9745;    | `api.configcat.com` |
| `api-user`    | ConfigCat Management API basic authentication username.                    | &#9745;    |                     |
| `api-pass`    | ConfigCat Management API basic authentication password.                    | &#9745;    |                     |
| `config-id`   | ID of the ConfigCat config to scan against.                                | &#9745;    |                     |
| `line-count`  | Context line count before and after the reference line. (min: 1, max: 10)  |            | 5                   |
| `sub-folder`  | Sub-folder to scan, relative to the repository root folder.                |            |                     |
| `verbose`     | Turns on detailed logging.                                                 |            | false               |
