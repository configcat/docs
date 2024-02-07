---
id: bitrise-step
title: Bitrise - Scan your source code for feature flags
---

This section describes how to use ConfigCat's <a target="_blank" href="https://www.bitrise.io/integrations/steps/configcat-feature-flag-sync">Bitrise Step</a>
to automatically scan your source code for feature flag and setting usages and upload the found code references to ConfigCat.
<a target="_blank" href="https://www.bitrise.io/">Bitrise</a> is full-featured mobile CI/CD platform. You can find more information about Bitrise Steps <a target="_blank" href="https://devcenter.bitrise.io/en/steps-and-workflows/introduction-to-steps.html">here</a>.

## Setup

1. Create a new <a target="_blank" href="https://app.configcat.com/my-account/public-api-credentials">ConfigCat Management API credential</a> and store its values in secure pipeline variables with the following names: `CONFIGCAT_API_USER`, `CONFIGCAT_API_PASS`.
   <img  src="/docs/assets/cli/scan/bitrise_secrets.png" alt="Bitrise secrets" />

2. Get your selected [Config's ID](/docs/advanced/code-references/overview#config-id).

3. Add the following step to the workflows section of your `bitrise.yml` file.
   Don't forget to replace the `PASTE-YOUR-CONFIG-ID-HERE` value with your actual Config ID.

   ```yaml
   - configcat-feature-flag-sync@0:
     inputs:
       - configcat_config_id: 'PASTE-YOUR-CONFIG-ID-HERE'
   ```

4. Commit & push your changes.

Scan reports are uploaded for each branch of your repository that triggers the job.

## Available Options

| Parameter             | Description                                                                                                                                                          | Required | Default             |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------- |
| `configcat_config_id` | The [config ID](/advanced/code-references/overview#config-id) tells the step which feature flags it should search for in your source code. | &#9745;  |                     |
| `configcat_api_host`  | ConfigCat Management API host.                                                                                                                                       |          | `api.configcat.com` |
| `line_count`          | Code snippet line count before and after the reference line. (min: 1, max: 10)                                                                                       |          | 4                   |
| `sub_folder`          | Sub-folder to scan, relative to the repository root folder.                                                                                                          |          |                     |
| `verbose`             | Turns on detailed logging.                                                                                                                                           |          | false               |
