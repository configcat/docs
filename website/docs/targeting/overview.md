---
id: overview
title: Targeting Overview
description: Overview of the ConfigCat targeting feature with examples.
---

> mi a targeting? mire jo?
>
> 

## What is what?
![Targeting Overview](../../../static/assets/targeting/targeting.png)

## Examples
This is the simplest feature flag you can create. It is enabled for everyone.
![Basic Feature Flag](../../../static/assets/targeting/basic.png)

This feature flag is enabled for everyone whose email address ends with `@example.com`.
![Simple Feature Flag](../../../static/assets/targeting/simple.png)

This is a more complex feature flag. It is enabled for everyone whose email address ends with `@example.com` AND the OS is `iOS or Android`. This flag is also enabled for everyone who is among the `Beta Users` segment. Read more about segments [here](segments.md).
![Complex Feature Flag](../../../static/assets/targeting/complex.png)

> 