---
id: team-collaboration
title: Team and Collaboration Management
---

*Team members* are your friends, colleagues, and clients who work on the same *Product*. You can invite as many of them to your *Product* as many you want.

## Invite others to collaborate
1. Navigate to the <a href="https://app.configcat.com/product" target="_blank">Manage product page</a>.
1. Click **INVITE TEAM MEMBERS** and enter the invitees' email addresses (comma separated).
1. Setup the invitees' initial *Permission group* and click on **SEND INVITATION EMAIL**.
1. A ConfigCat invitation will be sent to the invitees' email addresses.

You can modify their permissions anytime.

## Managing team members
1. Navigate to the <a href="https://app.configcat.com/product" target="_blank">Manage product page</a>.
1. Click on  🗑️ ️to delete a *Team member*.
1. Click on a *Team member*'s *Permission group* to change it.

## Permissions & Permission Groups

### Permissions
* *Manage Product* - access to invite and remove team members, manage permissions, and see the product-level audit log.
* *Manage Resources* - access to create, update and delete feature flags, tags, settings, configs, and environments
* *View SDK Key* - access to view the SDK Key which is considered as a sensitive information, since your applications can download the config.json files only using this key.

#### Access to Feature Flag and Setting values
* *Full access* to all/some environment - access to change setting values and switch feature flags
* *Read-only access* to all/some environment - access to see feature flags and settings, but prevents from changing their value
* *No access* to a specific environment - prevents from seeing and changing values

### Permission Groups
*Permission groups* are collections of permissions. They help you organize the permissions into groups that are meaningful to you. You can control your *Team members* permissions by assigning them to *Permission groups*. 

> For example, you could define the following *Permission groups*:
> * Administrator - *Manage Product*, *Manage Resources*, *Full access* to all environments
> * Product Manager -  *Full access* to all environments
> * Developer - *Manage Resources*, *Read-only access* to LIVE environment, *Full access* to all other environments