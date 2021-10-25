---
id: overview
title: Overview
---

The [ConfigCat CLI](/docs/advanced/cli) can be used to scan your own source code for feature flag and setting usages, and to upload the resulting scan report to ConfigCat. This feature can help cleaning up unused or <a target="_blank" href="https://app.configcat.com/my-account/zombie-flags-report">zombie feature flags and settings</a> from your code, as you can track their usages in one centralized place.

The following example shows a simple scan execution that only prints the scan result to the console. The `scan` command searches for every feature flag and setting key defined within a selected Config.

![flag-percentage-add](/assets/cli/scan.gif)

See the `scan` command's <a target="_blank" href="https://configcat.github.io/cli/configcat-scan.html">reference documentation</a> for all available command parameters.

## Config ID

In non-interactive environments, like in a CI/CD pipeline, you have to pass the ID of your ConfigCat Config that you want to scan against. The scanner will use this ID to determine which feature flags & settings to search for in your source code.

To get the ID of the desired Config, follow the steps below:
1. Go to your <a target="_blank" href="https://app.configcat.com">ConfigCat Dashboard</a>, select the desired Config, and click the code references icon on one of your feature flags.

    <img class="bordered" src="/docs/assets/cli/scan/code_ref.png" />

2. Copy the Config ID from the highlighted box.

    <img class="bordered" src="/docs/assets/cli/scan/config_id.png" />


## Upload Scan Reports

You have the option to upload scan reports for each branch in your associated repository to ConfigCat. You can do this by
configuring the scan execution in your CI/CD pipeline or running the scan manually. Each scan report is associated to a branch of your repository.

The following screenshot shows how an uploaded report looks like.
<img class="bordered" src="/docs/assets/cli/scan/scan_report.png" />

### Scanning Git Repositories
The `scan` command automatically detects when it's being executed on a git repository. When this happens, it collects the current **branch
name**, the actual **commit hash**, and each active **remote branches** from the repository. The command uses these extra details to enrich the uploaded report on the ConfigCat Dashboard with links to your actual source code.

:::info
If you are not using Git as VCS, you have to set at least the `--branch` parameter of the `scan` command.
:::

### Template URLs
The `scan` command has a `--file-url-template` and a `--commit-url-template` parameter used to generate links to your repository.
Based on the information available during a scan, the CLI replaces the corresponding template parameters to generate the actual links.

- **File URL template**: Used to generate VCS file links.  
  Available template parameters:
    - `branch`
    - `filePath`
    - `lineNumber`  
  
  With the following example template URL: `https://github.com/my/repo/blob/{branch}/{filePath}#L{lineNumber}`  
  For the file `src/example.js` the result will be: `https://github.com/my/repo/blob/main/src/example.js#L69`

- **Commit URL template**: Used to generate VCS commit links.  
  Available template parameters:
    - `commitHash`
  
  With the following example template URL: `https://github.com/my/repo/commit/{commitHash}`  
  For commit hash `4451d61b63a4b4499ed5c607be6c40ce9eeadb9c` the result will be: `https://github.com/my/repo/commit/4451d61b63a4b4499ed5c607be6c40ce9eeadb9c`

:::info
When these template URLs are not set, the uploaded report will not contain VCS links.
:::

### Stale Branches
Every scan execution uploads the active remote branches of your repository, which allows the clean-up of each stale report that belongs to a deleted branch.

### CI/CD Integrations
- [GitHub Action](/docs/advanced/code-references/github-action)
- [CircleCI Orb](/docs/advanced/code-references/circleci-orb)
- [GitLab CI/CD](/docs/advanced/code-references/gitlab-ci)

### Manual Integration
Follow the instructions [here](/docs/advanced/code-references/manual) to configure scan executions directly with the ConfigCat CLI.

## Ignore Files

The `scan` command respects all include and exclude patterns listed inside `.gitignore` and `.ignore` files within the scanned directory. 
In addition, you can create an extra `.ccignore` file with patterns that the scanner must take into account.

Each pattern must follow the <a target="_blank" href="https://git-scm.com/docs/gitignore#_pattern_format">gitignore pattern format</a>.