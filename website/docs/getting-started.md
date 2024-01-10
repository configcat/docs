---
id: getting-started
title: Getting Started
description: This is a step-by-step guide on how to get started with ConfigCat feature flags and on how to implement feature flags in an application.
---

This page is an overview and a short guide on how to get started.

**ConfigCat** is a cloud-based service that lets you release features without code deployments.

You can use it with many similar techniques such as feature flags/toggles, canary releases, soft launches, A-B testing, remote configuration management, and phased rollouts. Configure your application and features even after deployment.

## The birth of a Feature Flag

First, **add a feature flag** on the _ConfigCat Dashboard_,
then you can **connect your application** to the ConfigCat service to access your feature flag.

### Create a feature flag on the _ConfigCat Dashboard_

1. <a href="https://app.configcat.com/auth/login" target="_blank">Log in</a> to the _Dashboard_
2. Click _ADD FEATURE FLAG_ and give it a name.

<img src="/docs/assets/getting-started-1.png" className="zoomable" alt="getting-started" />

### Connect your application

There are ready to use code snippets for `.NET`, `Java`, `Android (Java)`, `Kotlin`, `iOS (Swift)`, `Dart (Flutter)`, `Node`, `JavaScript`, `React`, `Python`, `Go`, `PHP`, `Ruby`, `Elixir`, `C++` on the <a href="https://app.configcat.com" target="_blank">ConfigCat Dashboard</a>, just scroll down to the **SDK Key and steps to connect your application** section.

All the ConfigCat SDKs are open-source and available on <a href="https://github.com/configcat" target="_blank">GitHub</a>.

See the detailed [Docs on how to use the ConfigCat SDKs.](/sdk-reference/overview.md)

Here's a short example to demonstrate the concept:

```js
const configcat = await import("https://cdn.jsdelivr.net/npm/configcat-js/+esm");
const client = configcat.getClient('YOUR SDK KEY HERE');

const value = await client.getValueAsync('isMyFeatureEnabled', false);

if (value) {
  do_the_new_thing();
} else {
  do_the_old_thing();
}
```
