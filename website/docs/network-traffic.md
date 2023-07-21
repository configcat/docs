---
id: network-traffic
title: Network Traffic
description: Network Traffic refers to the data transmitted between your applications and ConfigCat servers.
---
Network Traffic refers to the data transmitted between your applications and ConfigCat CDN. It includes the requests made to fetch feature flags and settings.

Generally speaking, the Network Traffic is proportional to:
- the size of the `config JSON`, 
- the number of clients connecting to ConfigCat,
- and the frequency of changes in the `config JSON`.

#### Size of the `config JSON`
Affected by the number of feature flags, settings, targeting rules, segments, and the length of their values.

#### Number of clients connecting to ConfigCat
Every time a client downloads the config JSON, it contributes to the overall Network Traffic.

#### Frequency of changes in the `config JSON`
The `config JSON` is cached on the ConfigCat CDN. If there is no change, the ConfigCat CDN will reply with a `304 Not Modified` response. If there is a change, the ConfigCat CDN will reply with a `200 OK` response and the new `config JSON` will be downloaded.

### Shared infrastructure

The following plans run on shared infrastructure. So all customers use the same API nodes and Config Delivery Network (CDN).

| Plan           | Data / month |
| -------------- | -----------: |
| **Free**       |        20 GB |
| **Pro**        |       100 GB |
| **Smart**      |         1 TB |
| **Enterprise** |         4 TB |

:::info
If you hit this limit, we will keep your application up and running. However, you can expect us to contact you on how we can meet your needs.
:::

### Dedicated infrastructure

The following plans include dedicated API and CDN nodes.

#### Hosted

Runs on dedicated servers provided by ConfigCat.

|                               | Data / month |
| ----------------------------- | -----------: |
| **Basic package**             |        24 TB |
| **Every additional CDN node** |      + 4  TB |

#### On-Premise (Self-hosted)

Runs on the customer's own servers. We suggest <a href="https://configcat.com/support/" target="_blank">contacting ConfigCat's engineering</a> team on exact requirements and performance.

## How to reduce the monthly Network Traffic?

### Delete the old feature flags and unused targeting rules

If you have a lot of feature flags and targeting rules in a config, you can lower the size of the `config JSON` by deleting the old ones.

### Avoid keeping lots of data in the comparison value of targeting rules or segments

The comparison value of a targeting rule or segment is stored in the `config JSON` and downloaded by the SDKs. If you have a lot of targeting rules or segments with long comparison values, you can lower the size of the `config JSON` by shortening them.

### Consider the amount of text you keep in a text setting's value

Similarly to the comparison value of targeting rules or segments, the value of a text setting is stored in the `config JSON` and downloaded by the SDKs. If you have a lot of text settings with long values, you can lower the size of the `config JSON` by shortening them.

### Separate your feature flags into multiple configs

If you have a lot of feature flags, you can lower the size of the `config JSON` by separating them into multiple configs. This way the payload of each download will be smaller.