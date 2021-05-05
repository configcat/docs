---
id: vscode
title:  Visual Studio Code Extension
---

<a href="https://marketplace.visualstudio.com/items?itemName=ConfigCat.configcat-feature-flags" target="_blank">ConfigCat's Visual Studio Code extension</a> to manage feature flags from Visual Studio Code.  


## Feature overview

![Usage of ConfigCat Feature Flags Visual Studio Code Extension](/assets/vscode/usage.gif)

- View your Products & Configs.
- Create Configs within Visual Studio Code.
- Connect a Config to your Workspace.
- Open a Config on ConfigCat Dashboard.
- Find Feature Flag usages in your code.
- Copy a Feature Flag's key to the clipboard.
- Create Feature Flags within Visual Studio Code.
- Manage your Feature Flag values right from Visual Studio Code.  

## Installation
### Marketplace
1. Open [ConfigCat Feature Flags Extension](https://marketplace.visualstudio.com/items?itemName=ConfigCat.configcat-feature-flags) at Visual Studio Marketplace.
1. Click on the Install button.
### Within Visual Studio Code
1. Search for ConfigCat Feature Flags at the Extensions page.
1. Click on the Install button.
### Install from VSIX file
1. Open [ConfigCat Feature Flags Extension](https://marketplace.visualstudio.com/items?itemName=ConfigCat.configcat-feature-flags) at Visual Studio Marketplace.
1. Click on the Download Extension link.
1. Click on the More Actions icon on the Extensions page in Visual Studio Code and select Install from VSIX...

## Configuration
### Authentication

![Installation of ConfigCat Feature Flags Visual Studio Code Extension](/assets/vscode/auth.gif)

1. Get your ConfigCat Public API credentials from [ConfigCat Dashboard/Public Management API credentials](https://app.configcat.com/my-account/public-api-credentials).
1. Authenticate ConfigCat in Visual Studio Code by
    - clicking on the ConfigCat Feature Flags icon on the Activity Bar and clicking on any of the Authenticate buttons.
    - or running the `ConfigCat - Log In` command from the Command Palette.

### Advanced
If you are trying to use the ConfigCat Feature Flags extension for Visual Studio Code with a dedicated ConfigCat instance, you can specify your custom urls by executing the `Preferences: Open Workspace Settings` command from the Command Palette and search for `Extensions/ConfigCat`. Important settings:
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
After you successfully connected a Config to your Workspace, on the Feature Flags & Settings View you can:
- View the connected Config's Feature Flags.
- Create new Feature Flags.
- Copy a Feature Flag's key to clipboard.
- Find your Feature Flag's usages in your code.
- View or Update your Feature Flag's value.

#### Help & Feedback View
The Help & Feedback view provides you some quick links to open ConfigCat's Documentation, ConfigCat's Dashboard and gives you the opportunity to report any issues.
