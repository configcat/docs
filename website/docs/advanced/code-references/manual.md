---
id: manual
title: Manual Integration
---

This section will describe how to use the [ConfigCat CLI](/docs/advanced/cli)
to scan your source code for feature flag and setting usages, and to upload the scan report to ConfigCat.

## Prerequisites

- [Install](/docs/advanced/cli#installation) the CLI in your CI/CD or local environment.
- [Configure](/docs/advanced/cli#configuration) the CLI with your ConfigCat Manangement API credentials.
- Get your selected [Config's ID](/docs/advanced/code-references/overview#config-id).

## Scan & Upload

To initiate the scanning with uploading the results, you can use the `scan` command with the `--upload` option.

### With Git VCS
The scan command detects when it's being executed on a git repository, and extracts additional information automatically.  
The following snippet shows a minimal example that uses only the required parameters in case of a Git repository.
```bash
configcat scan /path/to/your/repo \
    --config-id YOUR-CONFIG-ID \ # required
    --repo YOUR-REPOSITORY-NAME \ # required
    --upload # upload the scan report
```

You can also use the optional template URL parameters for generating VCS links on the ConfigCat Dashboard to your source code.

```bash
configcat scan /path/to/your/repo \
    --config-id YOUR-CONFIG-ID \ # required
    --repo YOUR-REPOSITORY-NAME \ # required
    --file-url-template "https://github.com/my/repo/blob/{branch}/{filePath}#L{lineNumber}" \ # optional, used to generate VCS file links
    --commit-url-template "https://github.com/my/repo/commit/{commitHash}" \ # optional, used to generate VCS commit links
    --upload # upload the scan report
```

:::info
The template parameters (`branch`, `filePath`, `lineNumber`, and `commitHash`) are automatically replaced by the CLI based on the
collected information from the Git repository.
:::

### With Non-Git VCS
As the `scan` command is not able to determine such information as `branch` and `commitHash` when you execute it on a non-Git repository, you have to set these parameters manually.

```bash
configcat scan /path/to/your/repo \
    --config-id YOUR-CONFIG-ID \ # required
    --repo YOUR-REPOSITORY-NAME \ # required
    --branch BRANCH-NAME \ # required in case of non-git repository
    --commit-hash \ # optional, used to show it on the report and generate commit links
    --file-url-template "https://github.com/my/repo/blob/{branch}/{filePath}#L{lineNumber}" \ # optional, used to generate VCS file links
    --commit-url-template "https://github.com/my/repo/commit/{commitHash}" \ # optional, used to generate VCS commit links
    --upload # upload the scan report
```

### Execute with Docker
After pulling the ConfigCat CLI via Docker, you can scan your repository by mounting its folder as a volume, and by setting the ConfigCat Management API credentials as environment variables on the executing container.
```bash
docker run --rm \
    -v /path/to/your/repo:/repository \ # mount the repository as volume
    -e CONFIGCAT_API_USER=YOUR-API-USER \ # Management API username
    -e CONFIGCAT_API_PASS=YOUR-API-PASS \ # Management API password
    configcat/cli scan /repository \ # scan the mounted volume
    --config-id YOUR-CONFIG-ID \ # required
    --repo YOUR-REPOSITORY-NAME \ # required
    --upload # upload the scan report
```


## Reference
See the `scan` command's <a target="_blank" href="https://configcat.github.io/cli/configcat-scan.html">reference documentation</a> for all available command parameters.