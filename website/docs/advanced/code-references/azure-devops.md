---
id: azure-devops
title: Azure DevOps - Scan your source code for feature flags
---

This section describes how to use the [ConfigCat CLI](/docs/advanced/cli) in <a target="_blank" href="https://docs.microsoft.com/en-us/azure/devops/pipelines/?view=azure-devops">Azure DevOps Pipelines</a>
to automatically scan your source code for feature flag and setting usages and upload the found code references to ConfigCat. 

## Setup
1. Create a new <a target="_blank" href="https://app.configcat.com/my-account/public-api-credentials">ConfigCat Management API credential</a> and store its values in Azure DevOps <a target="_blank" href="https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables">Pipeline Variables</a> with the following names: `CONFIGCAT_API_USER`, `CONFIGCAT_API_PASS`.
    <img className="bordered zoomable" src="/docs/assets/cli/scan/azure_secrets.png" alt="Azure secrets" />

2. Get your selected [Config's ID](/docs/advanced/code-references/overview#config-id).

3. Create a new or open your existing `azure-pipelines.yml` file, and add the following <a target="_blank" href="https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema#job">job</a> to your `jobs` definition.  
   Don't forget to replace the `PASTE-YOUR-CONFIG-ID-HERE` value with your actual Config ID.
   ```yaml
   - job: configcat_scan_and_upload
     container: configcat/cli:azure-devops-1.6.2
     pool:
       vmImage: ubuntu-latest
     steps:
     - checkout: self
       persistCredentials: true
     - script: configcat scan $(Build.Repository.LocalPath) 
         --config-id=PASTE-YOUR-CONFIG-ID-HERE 
         --repo=$(Build.Repository.Name) 
         --branch=$(Build.SourceBranchName)
         --file-url-template="$(Build.Repository.Uri)?path={filePath}&version=GC{commitHash}&line={lineNumber}&lineStartColumn=1&lineEndColumn=1"
         --commit-url-template="$(Build.Repository.Uri)/commit/{commitHash}" 
         --runner="ConfigCat Azure DevOps Job" 
         --upload
         --non-interactive
       name: scan_repository
       env:
         CONFIGCAT_API_PASS: $(CONFIGCAT_API_PASS)
         CONFIGCAT_API_USER: $(CONFIGCAT_API_USER)
   ```

  :::info
  If you are using a different VCS than Azure DevOps' Git, you should set the `--file-url-template` and `--commit-url-template` according to your VCS provider.
  :::

4. Commit & push your changes.

Scan reports are uploaded for each branch of your repository that triggers the job.