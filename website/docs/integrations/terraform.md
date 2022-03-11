---
id: terraform
title: Terraform
description: ConfigCat Terraform provider. This is a step-by-step guide on how to manage feature flags from Terraform using the ConfigCat Terraform provider.
---

<a href="https://registry.terraform.io/providers/configcat/configcat" target="_blank" >ConfigCat Feature Flags Provider</a> allows you to configure and access ConfigCat resources via ConfigCat Public Management API with <a href="https://www.terraform.io/" target="_blank" >Terraform.</a>

## Installation
Please refer to the <a href="https://registry.terraform.io/providers/configcat/configcat" target="_blank">official documentation</a>.

## Sample usage

```hcl
terraform {
  required_providers {
    configcat = {
      source = "configcat/configcat"
      version = "~> 1.0"
    }
  }
}

provider "configcat" {
  version     = "~> 1.0"

  // Get your ConfigCat Public API credentials at https://app.configcat.com/my-account/public-api-credentials
  basic_auth_username = var.configcat_basic_auth_username
  basic_auth_password = var.configcat_basic_auth_password
}

// Retrieve your Product
data "configcat_products" "my_products" {
  name_filter_regex = "ConfigCat's product"
}

// Retrieve your Config
data "configcat_configs" "ny_configs" {
  product_id = data.configcat_products.my_products.products.0.product_id
  name_filter_regex = "Main Config"
}

// Retrieve your Environment
data "configcat_environments" "my_environments" {
  product_id = data.configcat_products.my_products.products.0.product_id
  name_filter_regex = "Test"
}

// Create a Feature Flag/Setting
resource "configcat_setting" "setting" {
  config_id = data.configcat_configs.ny_configs.configs.0.config_id
  key = "isAwesomeFeatureEnabled"
  name = "My awesome feature flag"
  hint = "This is the hint for my awesome feature flag"
  setting_type = "boolean"
}

// Initialize the Feature Flag/Setting's value
resource "configcat_setting_value" "setting_value" {
    environment_id = data.configcat_environments.my_environments.environments.0.environment_id
    setting_id = configcat_setting.setting.id
    value = "false"
}
```