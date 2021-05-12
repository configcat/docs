---
id: cli
title:  Command Line Interface
---

The <a target="_blank" href="https://github.com/configcat/cli">ConfigCat Command Line Interface (CLI)</a> allows you to interact with the [Public Management API](advanced/public-api.md) via the command line. It supports most functionality found on the ConfigCat Dashboard. You can manage ConfigCat resources like Feature Flags, Targeting / Percentage rules, Products, Configs, Environments, and more.

```
configcat
  This is the Command Line Tool of ConfigCat.
  ConfigCat is a hosted feature flag service: https://configcat.com
  For more information, see the documentation here: https://configcat.com/docs/

Usage:
  configcat [options] [command]

Options:
  -v, --verbose   Print detailed execution information
  --version       Show version information
  -?, -h, --help  Show help and usage information

Commands:
  setup                Setup the CLI with Management API host and credentials.
                       You can get your credentials from here:
                       https://app.configcat.com/my-account/public-api-credentials
  ls                   List all Product, Config, and Environment IDs
  p, product           Manage Products. More about Products: https://configcat.com/docs/main-concepts/#product
  c, config            Manage Configs. More about Configs: https://configcat.com/docs/main-concepts/#config
  e, environment       Manage Environments. More about Environments:
                       https://configcat.com/docs/main-concepts/#environment
  t, tag               Manage Tags. Tags are stored under a Product. You can attach a Tag to a Feature Flag or Setting.
  f, flag, s, setting  Manage Feature Flags & Settings
  k, sdk-key           List SDK Keys
  scan <directory>     Scans files for Feature Flag or Setting usages

Use "configcat [command] -?" for more information about a command.
```

## Reference
See the <a target="_blank" href="https://configcat.github.io/cli/">command reference documentation</a> for more information about each available command.

## Getting Started
The following instructions will guide you through the first steps to start using this tool.

### Installation
Distribution via package managers is not yet available, however we plan publishing packages to <a target="_blank" href="https://snapcraft.io/">snapcraft.io</a>, <a target="_blank" href="https://community.chocolatey.org/packages">Chocolatey</a>, <a target="_blank" href="https://brew.sh">Homebrew</a>, and <a target="_blank" href="https://www.docker.com/">docker</a> in the future.

In the meantime, you can download the binaries directly from [GitHub Releases](https://github.com/configcat/cli/releases).

#### Install Script
You can install the CLI by executing an install script on Unix platforms. 
```bash
curl -fsSL "https://raw.githubusercontent.com/configcat/cli/main/scripts/install.sh" | bash
```

By default, the script downloads the OS specific artifact from the latest [GitHub Release](https://github.com/configcat/cli/releases) with `curl` and moves it into the `/usr/local/bin` directory.

It might happen, that you don't have permissions to write into `/usr/local/bin`, then you should execute the install script with `sudo`.

```bash
curl -fsSL "https://raw.githubusercontent.com/configcat/cli/main/scripts/install.sh" | sudo bash
```

The script accepts the following input parameters:

Parameter | Description | Default value
--------- | ----------- | -------------
`-d`, `--dir` | The directory where the CLI should be installed. | `/usr/local/bin`
`-v`, `--version` | The desired version to install. | `latest`
`-a`, `--arch` | The desired architecture to install. | `x64`

The possible **architecture** values for Linux: `x64`, `musl-x64`, `arm`, `arm64`.

:::info
For macOS, the architecture is fixed to `x64`, but we plan the support of Apple silicon in the future.
:::

**Script Usage examples**:

*Custom installation directory*:
```bash
curl -fsSL "https://raw.githubusercontent.com/configcat/cli/main/scripts/install.sh" | bash -s -- -d=/path/to/install
```

*Install a different version*:
```bash
curl -fsSL "https://raw.githubusercontent.com/configcat/cli/main/scripts/install.sh" | bash -s -- -v=1.4.2
```

*Install with custom architecture*:
```bash
curl -fsSL "https://raw.githubusercontent.com/configcat/cli/main/scripts/install.sh" | bash -s -- -a=arm
```

### Configuration
After a successful installation, the CLI must be configured with your <a target="_blank" href="https://app.configcat.com/my-account/public-api-credentials">ConfigCat Management API credentials</a>.

![interactive](/assets/cli/setup.gif)

#### Environment Variables
The CLI can read your credentials from the following environment variables.

Name | Description |
--------- | ----------- |
`CONFIGCAT_API_HOST` | The Management API host. (default: api.configcat.com) | 
`CONFIGCAT_API_USER` | The Management API basic authentication username. |
`CONFIGCAT_API_PASS` | The Management API basic authentication password. | 

:::caution
When any of these environment variables are set, the CLI will use those over their local values set by the `configcat setup` command.
:::

## Modes
The CLI supports both interactive and argument driven execution. When no arguments provided for a command and user input is enabled (stdout is not redirected), the CLI automatically activates interactive mode.

### Interactive

![interactive](/assets/cli/teaser.gif)

### With Arguments
The same operation with command arguments would look like this:
```
configcat flag create \
--config-id <config-id> \ 
--name "My awesome feature" \
--hint "This is my awesome feature" \
--key my_awesome_feature
--type boolean \
--tag-ids <tag-id-1> <tag-id-2> \
```

:::info
Each `create` command writes the newly created resource's ID to the standard output, that you can save for further operations.
:::

## Examples
Here are a few examples showing the true power of the CLI.

### Create a Feature Flag
The following example shows how you can create a Feature Flag in a specific Config via command line.

![create-flag](/assets/cli/create-flag.gif)

### Value update
The following example shows how you can update the value of a Feature Flag in a specific Environment via command line.

![flag-value-update](/assets/cli/flag-value-update.gif)

### Add targeting rules
The following example shows how you can add targeting rules to a Feature Flag via command line.

![flag-targeting-add](/assets/cli/flag-targeting-add.gif)

### Add percentage rules
The following example shows how you can set percentage rules on a Feature Flag via command line.

![flag-percentage-add](/assets/cli/flag-percentage-add.gif)

### Scan for code references
The following example shows how you can scan a codebase for Feature Flag or Setting usages. The scanner command searches for every Feature Flag / Setting key defined within the given Config.

![flag-percentage-add](/assets/cli/scan.gif)

The `scan` command respects all include/exclude patterns listed inside `.gitignore` and `.ignore` files within the given directory. 

In addition, you can create an extra `.ccignore` file with patterns that the scanner must include/exclude.

Each pattern must follow the <a target="_blank" href="https://git-scm.com/docs/gitignore#_pattern_format">gitignore pattern format</a>.