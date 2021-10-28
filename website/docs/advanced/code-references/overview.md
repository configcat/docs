---
id: overview
title: Overview
---

The [ConfigCat CLI](/docs/advanced/cli) has the ability to scan your source code for feature flag and setting usages and upload the found code references to ConfigCat. 

This feature makes the erasement of technical debt easier, as it can show which repositories reference your feature flags and settings in one centralized place on your <a target="_blank" href="https://app.configcat.com">Dashboard</a>.

You can integrate the CLI into your CI/CD pipeline or use it with other execution mechanisms like scheduled jobs or VCS push triggered workflows.

## Scan

The following example shows a simple scan execution that prints the scan result to the console. The `scan` command searches for every feature flag and setting key defined within a selected Config.

![flag-percentage-add](/assets/cli/scan.gif)

If you want to see this in action on your project, run the following command in its root folder:

```bash
configcat scan . --print
```
  
See the `scan` command's <a target="_blank" href="https://configcat.github.io/cli/configcat-scan.html">reference documentation</a> for all available command parameters.

## Config ID

In non-interactive environments, like in a CI/CD pipeline, you have to pass the ID of your ConfigCat Config that you want to scan against. The scanner will use this ID to determine which feature flags & settings to search for in your source code.

To get the ID of a Config, follow the steps below:
1. Go to your <a target="_blank" href="https://app.configcat.com">ConfigCat Dashboard</a>, select the desired Config, and click the code references icon on one of your feature flags.

    <img class="bordered" src="/docs/assets/cli/scan/code_ref.png" />

2. Copy the Config ID from the highlighted box.

    <img class="bordered" src="/docs/assets/cli/scan/config_id.png" />


## Upload Scan Reports

You have the option to upload scan reports for each branch of your repository to ConfigCat. 
Each scan report is associated to one of these branches.

The following screenshot shows how an uploaded report looks like.
<img class="bordered" src="/docs/assets/cli/scan/scan_report.png" />

### Scanning Git Repositories
The `scan` command automatically detects when it's being executed on a git repository. It collects additional information from Git like the current **branch
name**, the actual **commit hash**, and each active **remote branches**. These extra details are used to enrich the uploaded report on the ConfigCat Dashboard with links to your actual source code.

:::info
If you are not using Git as VCS, you have to set at least the `--branch` parameter of the `scan` command.
:::

### Template URLs
The `scan` command's `--file-url-template` and `--commit-url-template` parameters are used for generating links to your repository.
Based on the information available during the scanning, the CLI replaces the corresponding template parameters to generate the actual links.

- **File URL template**: Used to generate VCS file links.  
  Available template parameters:
    - `branch`
    - `filePath`
    - `lineNumber`  
  
  With the following example template URL: `https://github.com/my/repo/blob/{branch}/{filePath}#L{lineNumber}`  
  For the file `src/example.js`, the result is: `https://github.com/my/repo/blob/main/src/example.js#L69`

- **Commit URL template**: Used to generate VCS commit links.  
  Available template parameters:
    - `commitHash`
  
  With the following example template URL: `https://github.com/my/repo/commit/{commitHash}`  
  For the commit hash `4451d61b63a4b4499ed5c607be6c40ce9eeadb9c`, the result is: `https://github.com/my/repo/commit/4451d61b63a4b4499ed5c607be6c40ce9eeadb9c`

:::info
When these template URLs are not set, the uploaded report will not contain VCS links.
:::

### Stale Branches
When the scan is executed on a Git repository, the CLI attaches the currently active remote branches to the uploaded report. This information is used for cleaning up each stale report that belongs to a deleted branch.

### CI/CD Integrations
We prepared the following integrations to simplify the usage of the scanner in your CI/CD workflow:
- [GitHub Action](/docs/advanced/code-references/github-action)
- [CircleCI Orb](/docs/advanced/code-references/circleci-orb)
- [GitLab CI/CD](/docs/advanced/code-references/gitlab-ci)
- [Azure DevOps](/docs/advanced/code-references/azure-devops)
- [Bitbucket Pipe](/docs/advanced/code-references/bitbucket-pipe)

### Manual Integration
If your workflow doesn't have an integration, you can follow the instructions [here](/docs/advanced/code-references/manual) to configure scan executions directly with the ConfigCat CLI.

## Ignore Files

The `scan` command respects all include and exclude patterns listed inside `.gitignore` and `.ignore` files within the scanned directory. 
In addition, you can create an extra `.ccignore` file with patterns that the scanner must take into account.

Each pattern must follow the <a target="_blank" href="https://git-scm.com/docs/gitignore#_pattern_format">gitignore pattern format</a>.