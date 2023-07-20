---
id: network-traffic
title: What is considered as Network Traffic?
description: Network Traffic refers to the data transmitted between your applications and ConfigCat servers.
---
Network Traffic refers to the data transmitted between your applications and ConfigCat CDN. It includes the requests made to fetch feature flags and settings.

### Shared infrastructure

The following plans run on shared infrastructure. So all customers use the same API nodes and Config Delivery Network (CDN).

| Plan           | GB /month |
| -------------- | --------: |
| **Free**       |        20 |
| **Pro**        |       100 |
| **Smart**      |      1000 |
| **Enterprise** |     24000 |

:::info
If you hit this limit, we will keep your application up and running. However, you can expect us to contact you on how we can meet your needs.
:::

### Dedicated infrastructure

The following plans include dedicated API and CDN nodes.

#### Hosted

Runs on dedicated servers provided by ConfigCat. The basic package includes:
- 1x API node
- 6x CDN nodes

|                               | GB /month |
| ----------------------------- | --------: |
| **Basic package**             |        24 |
| **Every additional CDN node** |       + 4 |

#### On-Premise (Self-hosted)

Runs on the customer's own servers. We suggest <a href="https://configcat.com/support/" target="_blank">contacting ConfigCat's engineering</a>team on exact requirements and performance.

## How to reduce the monthly Network Traffic?

Generally speaking the Network Traffic is proportional to the size of the `config JSON` and the number of `config JSON` downloads per month.

### Delete the old feature flags and unused targeting rules

If you have a lot of feature flags and targeting rules in a config, you can lower the size of the `config JSON` by deleting the old ones.

### Avoid keeping lots of data in the comparison value of targeting rules or segments

The comparison value of a targeting rule or segment is stored in the `config JSON` and downloaded by the SDKs. If you have a lot of targeting rules or segments with long comparison values, you can lower the size of the `config JSON` by shortening them.

### Consider the amount of text you keep in a text setting's value

Similarly to the comparison value of targeting rules or segments, the value of a text setting is stored in the `config JSON` and downloaded by the SDKs. If you have a lot of text settings with long values, you can lower the size of the `config JSON` by shortening them.

### Separate your feature flags into multiple configs

If you have a lot of feature flags, you can lower the size of the `config JSON` by separating them into multiple configs. This way the payload of each download will be smaller.