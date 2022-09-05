---
id: overview
title: Scan & Upload Code References Overview
---

import CodeRefIntro from './_intro.mdx'

<CodeRefIntro linkText="CLI" linkUrl="/docs/advanced/cli" linkTarget="_self" />

You can integrate the CLI into your CI/CD pipeline or use it with other execution mechanisms like scheduled jobs or VCS push triggered workflows.

## Scan

The following example shows a simple scan execution that prints the scan result to the console. The `scan` command searches for every feature flag and setting key defined within a selected Config.

![flag-percentage-add](/assets/cli/scan.gif)

If you want to see this in action on your project, run the following command in its root folder:

```bash
configcat scan . --print
```
  
See the `scan` command's <a target="_blank" href="https://configcat.github.io/cli/configcat-scan.html">reference documentation</a> for all available command parameters.

### Deleted Flags

As part of the scanning operation, the CLI gathers each deleted feature flag and setting from the last 180 days and look for their usages
in your source code. When it finds a reference for a deleted feature flag or setting, it prints out a warning that lists their keys.

```bash                                                       
[warning]: 5 deleted feature flag/setting reference(s) found in 4 file(s). Keys: [featureThatWasDeleted1, featureThatWasDeleted2]
```

### Exclude Flags from Scanning

There's an option to exclude feature flags or settings from the scanning operation by their keys.

```bash
configcat scan <dir> --exclude-flag-keys featureFlagToExclude1 featureFlagToExclude2
```

## Config ID

In non-interactive environments, like in a CI/CD pipeline, you have to pass the ID of your ConfigCat Config that you want to scan against. The scanner will use this ID to determine which feature flags & settings to search for in your source code.

To get the ID of a Config, follow the steps below:
1. Go to your <a target="_blank" href="https://app.configcat.com">ConfigCat Dashboard</a>, select the desired Config, and click the code references icon on one of your feature flags.

    <img class="bordered" src="/docs/assets/cli/scan/code_ref.png" alt="ConfigCat code references button" />

2. Copy the Config ID from the highlighted box.

    <img class="bordered" src="/docs/assets/cli/scan/config_id.png" alt="ConfigCat Config ID"  />


## How Scanning Works
The scanner looks for feature flag and setting keys between quotation marks (`'` `"` `` ` ``) in the first place.  

### Aliases
The found keys' context is examined for **aliases**, like variables, constants, or enumerations used to store these keys.
**Aliases** are treated as indirect references and are included in the searching process.

For example, the following `C#` constant's name (`MyAwesomeFeature`) will be recognized as an alias:
```csharp
public static class FeatureFlagKeys
{
  public const string MyAwesomeFeature = "my_awesome_feature";
}
```
The scanner will treat this constant's usage as an indirect reference to the flag.
```csharp
if (configCatClient.GetValue(FeatureFlagKeys.MyAwesomeFeature, false))
{
  // the feature is on.
}
```

:::info
The alias recognition **adapts to the characteristics of different languages**.  
For example, it can find aliases in `Go` constants/variable assignments:
```go
const (
	myAwesomeFeature string = "my_awesome_feature"
)

myAwesomeFeature := "my_awesome_feature"
``` 

And in `Swift` enums/variable assignments as well:
```swift
enum FlagKeys : String {
  case MyAwesomeFeature = "my_awesome_feature"
}

let myAwesomeFeature: String = "my_awesome_feature"
```

You can check <a target="_blank" href="https://raw.githubusercontent.com/configcat/cli/main/test/ConfigCat.Cli.Tests/alias.txt">here</a> a bunch of other samples that we tested.
:::

:::info
An alias must be at least **30% identical to the feature flag/setting key**.
The similarity check is case insensitive and ignores `_` characters. 
This behavior prevents false recognitions in expressions like `<input type="text" value="my_awesome_feature">` where `value` shouldn't be treated as alias.
:::

### Wrappers
In addition to aliases, the scanner also looks for different feature flag/setting key usage patterns. This helps to recognize functions and properties used to wrap direct ConfigCat SDK calls as indirect references. Aliases are also included in this search.

For example, the scanner will treat the `IsMyAwesomeFeatureEnabled` function of the following `C#` wrapper class as an indirect reference:
```csharp
public class FeatureFlagProvider
{
  public bool IsMyAwesomeFeatureEnabled(bool defaultValue = false)
  {
    return configCatClient.GetValue("my_awesome_feature", defaultValue);
  }
}
```
And will include it's usage in the scan report:
```csharp
if (featureFlagProvider.IsMyAwesomeFeatureEnabled())
{
  // the feature is on.
}
```

:::info
The scanner uses the following patterns to look for wrapper usages (case insensitive):
- `[.|->|::]{settingKeyOrAlias}`
- `[.|->|::]get{settingKeyOrAlias}`
- `[.|->|::]is{settingKeyOrAlias}`
- `[.|->|::]is{settingKeyOrAlias}enabled`

Given the key/alias `my_awesome_feature`, the scanner will find any of the following usage examples:
- `.my_awesome_feature` (also: `->my_awesome_feature` / `::my_awesome_feature`)
- `.MY_AWESOME_FEATURE` (also: `->MY_AWESOME_FEATURE` / `::MY_AWESOME_FEATURE`)
- `.get_my_awesome_feature` (also: `->get_my_awesome_feature` / `::get_my_awesome_feature`)
- `.GET_MY_AWESOME_FEATURE` (also: `->GET_MY_AWESOME_FEATURE` / `::GET_MY_AWESOME_FEATURE`)
- `.is_my_awesome_feature` (also: `->is_my_awesome_feature` / `::is_my_awesome_feature`
- `.is_my_awesome_feature_enabled` (also: `->is_my_awesome_feature_enabled` / `::is_my_awesome_feature_enabled`)
- `.myAwesomeFeature` (also: `->myAwesomeFeature` / `::myAwesomeFeature`)
- `.getMyAwesomeFeature` (also: `->getMyAwesomeFeature` / `::getMyAwesomeFeature`)
- `.isMyAwesomeFeature` (also: `->isMyAwesomeFeature` / `::isMyAwesomeFeature`)
- `.isMyAwesomeFeatureEnabled` (also: `->isMyAwesomeFeatureEnabled` / `::isMyAwesomeFeatureEnabled`)
- `.IsMyAwesomeFeatureEnabled` (also: `->IsMyAwesomeFeatureEnabled` / `::IsMyAwesomeFeatureEnabled`)

:::

## Upload Scan Reports

You have the option to upload scan reports for each branch of your repository to ConfigCat. 
Each scan report is associated to one of these branches.

The following screenshot shows how an uploaded report looks like.
<img src="/docs/assets/cli/scan/scan_report.png" alt="ConfigCat code references report" />

### Scanning Git Repositories
The `scan` command automatically detects when it's being executed on a git repository. It collects additional information from Git like the current **branch
name**, the actual **commit hash**, and each active **remote branch**. These extra details are used to enrich the uploaded report on the ConfigCat Dashboard with links to your actual source code.

:::info
If you are not using Git as VCS, you have to set at least the `--branch` parameter of the `scan` command.
:::

### Template URLs
The `scan` command's `--file-url-template` and `--commit-url-template` parameters are used for generating links to your repository.
Based on the information available during the scanning, the CLI replaces the corresponding template parameters to generate the actual links.

- **File URL template**: Used to generate VCS file links.  
  Available template parameters:
    - `commitHash`
    - `filePath`
    - `lineNumber`  
  
  With the following example template URL: `https://github.com/my/repo/blob/{commitHash}/{filePath}#L{lineNumber}`  
  For the file `src/example.js`, the result is: `https://github.com/my/repo/blob/4451d61b63a4b4499ed5c607be6c40ce9eeadb9c/src/example.js#L69`

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
- [Bitrise Step](/docs/advanced/code-references/bitrise-step)

### Manual Integration
If your workflow doesn't have an integration, you can follow the instructions [here](/docs/advanced/code-references/manual) to configure scan executions directly with the ConfigCat CLI.

## Ignore Files

The `scan` command respects all include and exclude patterns listed inside `.gitignore` and `.ignore` files within the scanned directory. 
In addition, you can create an extra `.ccignore` file with patterns that the scanner must take into account.

Each pattern must follow the <a target="_blank" href="https://git-scm.com/docs/gitignore#_pattern_format">gitignore pattern format</a>.