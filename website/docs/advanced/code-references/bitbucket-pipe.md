---
id: bitbucket-pipe
title: Bitbucket Pipe
---

This section will describe how to use ConfigCat's <a target="_blank" href="https://bitbucket.org/configcat/scan-repository-pipe">Bitbucket Pipe</a>
to scan your source code for feature flag and setting usages, and to upload the scan report to ConfigCat.

## Configuration
1. Create a new <a target="_blank" href="https://app.configcat.com/my-account/public-api-credentials">ConfigCat Management API credential</a> and store its values in secure pipeline variables with the following names: `CONFIGCAT_API_USER`, `CONFIGCAT_API_PASS`.
    <img class="bordered" src="/docs/assets/cli/scan/pipe_secrets.png" />

2. Get your selected [Config's ID](/docs/advanced/code-references/overview#config-id).

3. Add the following snippet to the script section of your `bitbucket-pipelines.yml` file.
   Don't forget to replace the `PASTE-YOUR-CONFIG-ID-HERE` value with your actual Config ID.
    ```yaml
    - pipe: configcat/scan-repository-pipe:1.0.0
      variables:
        CONFIG_ID: 'PASTE-YOUR-CONFIG-ID-HERE'
    ```

4. Commit & push your changes.

The code references will be uploaded for each branch in your repository that triggers the pipe. 

## Available Options

| Parameter             | Description                                                                | Required   | Default             |
| --------------------- | -------------------------------------------------------------------------- | ---------- | ------------------- |
| `CONFIGCAT_API_HOST`  | ConfigCat Management API host.                                             | &#9745;    | `api.configcat.com` |
| `CONFIG_ID `          | ID of the ConfigCat config to scan against.                                | &#9745;    |                     |
| `LINE_COUNT`          | Context line count before and after the reference line. (min: 1, max: 10)  |            | 5                   |
| `SUB_FOLDER`          | Sub-folder to scan, relative to the repository root folder.                |            |                     |
| `VERBOSE`             | Turns on detailed logging.                                                 |            | false               |

