---
id: data-governance
title: Data Governance - CDN
---
Addressing global data handling and processing trends via Data Governance feature. Customers 
can control the geographic location where their config JSONs get published to.

## CDN - Data Centers

To ensure high availability and low response times all around the globe ConfigCat provides
data centers at multiple global locations. All of the data centers have multiple CDN nodes
to guarantee proper redundancy.

![config cat data center locations map](/assets/data-governance-globe.svg)

### ConfigCat Data Center locations
- EU: Amsterdam, Frankfurt
- USA: Newark, New York City, Fremont, San Francisco
- Asia & Oceania: Singapore, Sydney

# How to govern the data?

## Available geographical areas

### Global [Default]
Provides geo-location based load balancing on all nodes around the globe to ensure the lowest response times.

### EU Only
Compliant with GDPR. This way your data will never leave the EU.

## Set preferences on the Dashboard

Open <a href="https://app.configcat.com/organization/data-governance">Data Governance page</a> and follow the steps to set preferences.

> Only team members with Organization Admin role can access Data Governance preferences.

## Configure ConfigCat SDK in your application code

Make sure the `dataGovernance` parameter is passed to the ConfigCat SDK
in your application code when it is being initialized.

> The `dataGovernance` parameter value must be in sync with the selected option on 
> the Dashboard.

## Troubleshooting

#### What if I forgot to pass the `dataGovernance` parameter?
The ConfigCat backend will take the Dashboard preference as primary. Having `EU Only` selected on the Dashboard but forgot to pass the proper `dataGovernance` parameter to the SDK. In this case your config JSONs will only published to the EU CDN nodes. And every config.json download made from your application to any node outside the EU, the request will be redirected automatically to the EU CDN. Recommended to deploy a fix with the correct `dataGovernance` param, since response times will be significantly longer.

#### `Warning: Your dataGovernance parameter at ConfigCatClient initialization is not in sync with your preferences...`
**You worry do not.** Your feature flags are served. See above example.
