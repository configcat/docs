---
id: vscode
title: Visual Studio Code - Manage your feature flags from VSCode
description: ConfigCat Visual Studio Code extension. This is a step-by-step guide on how to use the ConfigCat Visual Studio Code extension to manage feature flags in your project.
---

<a href="https://marketplace.visualstudio.com/items?itemName=ConfigCat.configcat-feature-flags" target="_blank">ConfigCat's Visual Studio Code extension</a> to manage feature flags from Visual Studio Code.

## Feature overview

<img src="/docs/assets/vscode/usage.gif" className="zoomable" alt="Usage of ConfigCat Feature Flags Visual Studio Code Extension" />

### List of Features

- Turn features On / Off right from Visual Studio Code.
- Add Targeting or Percentage Rules from Visual Studio Code.
- Find Feature Flag usages in your code.
- Create Feature Flags within Visual Studio Code.
- Copy a Feature Flag's key to the clipboard.
- View your Products & Configs.
- Create Configs within Visual Studio Code.
- Connect a Config to your Workspace.
- Open a Config on ConfigCat Dashboard.

## Install extension

### Visual Studio Code Marketplace

1. Open [ConfigCat Feature Flags Extension](https://marketplace.visualstudio.com/items?itemName=ConfigCat.configcat-feature-flags) at Visual Studio Marketplace.
1. Click on the Install button.
1. Configure extension (see below)

### or within Visual Studio Code

1. Search for ConfigCat Feature Flags at the Extensions page.
1. Click on the Install button.
1. Configure extension (see below).

### or install from VSIX file

1. Open [ConfigCat Feature Flags Extension](https://marketplace.visualstudio.com/items?itemName=ConfigCat.configcat-feature-flags) at Visual Studio Marketplace.
1. Click on the Download Extension link.
1. Click on the More Actions icon on the Extensions page in Visual Studio Code and select Install from VSIX...
1. Configure extension (see below).

## Configure extension

### Authentication

<img src="/docs/assets/vscode/auth.gif" className="zoomable" alt="Installation of ConfigCat Feature Flags Visual Studio Code Extension" />

1. Get your ConfigCat Public API credentials from [ConfigCat Dashboard/Public Management API credentials](https://app.configcat.com/my-account/public-api-credentials).
1. Authenticate ConfigCat in Visual Studio Code by
   - clicking on the ConfigCat Feature Flags icon on the Activity Bar and clicking on any of the Authenticate buttons.
   - or running the `ConfigCat - Log In` command from the Command Palette.

### Advanced

If you are trying to use the ConfigCat Feature Flags extension for Visual Studio Code with a `dedicated hosted`/[on-premise](https://configcat.com/on-premise/) ConfigCat instance, you can specify your custom urls by executing the `Preferences: Open Workspace Settings` command from the Command Palette and search for `Extensions/ConfigCat` or clicking the manage button on the ConfigCat Feature Flags extension's page. Important settings:

- `Public Api Base URL`: the base url for the ConfigCat Public Management Api. Defaults to: https://api.configcat.com.
- `Dashboard Base URL`: the base url for ConfigCat Dashboard. Defaults to: https://app.configcat.com.

## Usage

### ConfigCat Feature Flags Views

The ConfigCat Feature Flags Views can be opened by clicking on the ConfigCat Feature Flags icon on the Activity Bar. It consists of 3 different view:

#### Products & Configs View

On the Products & Configs View you can:

- View all of your Products & Configs.
- Create Configs under a Product.
- Connect a Config to your current Workspace.
- Open your Configs on the ConfigCat Dashboard.

#### Feature Flags & Settings View

After you successfully connected a Config to your Workspace, from the Feature Flags & Settings View you can:

- Turn features On / Off right from Visual Studio Code.
- Add Targeting or Percentage Rules from Visual Studio Code.
- View or Update your Feature Flag's value.
- View the connected Config's Feature Flags.
- Create new Feature Flags.
- Copy a Feature Flag's key to clipboard.
- Find your Feature Flag's usages in your code.

#### Help & Feedback View

The Help & Feedback view provides you some quick links to open ConfigCat's Documentation, ConfigCat's Dashboard and gives you the opportunity to report any issues.
