---
id: gitlab-ci
title: GitLab - Scan your source code for feature flags
---

This section describes how to use the [ConfigCat CLI](/docs/advanced/cli) in <a target="_blank" href="https://docs.gitlab.com/ee/ci/">GitLab CI/CD</a>
to automatically scan your source code for feature flag and setting usages and upload the found code references to ConfigCat.

## Setup
1. Create a new <a target="_blank" href="https://app.configcat.com/my-account/public-api-credentials">ConfigCat Management API credential</a> and store its values in GitLab's <a target="_blank" href="https://docs.gitlab.com/ee/ci/variables/">CI/CD Variables</a> with the following names: `CONFIGCAT_API_USER`, `CONFIGCAT_API_PASS`.
    <img className="bordered" src="/docs/assets/cli/scan/gl_secrets.png" alt="Gitlab secrets" />

2. Get your selected [Config's ID](/docs/advanced/code-references/overview#config-id).

3. Create a new or open your existing `.gitlab-ci.yml` file, and put the following job into it.  
   Don't forget to replace the `PASTE-YOUR-CONFIG-ID-HERE` value with your actual Config ID.
    ```yaml
    configcat-scan-repository:
      stage: deploy # the job will run in the deploy phase, but you can choose from any other phases you have
      image:
        name: configcat/cli:1.6.2
        entrypoint: [""]
      script:
        - configcat scan $CI_PROJECT_DIR 
            --config-id=PASTE-YOUR-CONFIG-ID-HERE 
            --repo=${CI_PROJECT_NAME}
            --branch=${CI_COMMIT_REF_NAME}
            --file-url-template=https://gitlab.com/${CI_PROJECT_PATH}/blob/{commitHash}/{filePath}#L{lineNumber}
            --commit-url-template=https://gitlab.com/${CI_PROJECT_PATH}/commit/{commitHash}
            --runner="ConfigCat GitLab Job" 
            --upload
            --non-interactive
    ```

4. Commit & push your changes.

Scan reports are uploaded for each branch of your repository that triggers the job.