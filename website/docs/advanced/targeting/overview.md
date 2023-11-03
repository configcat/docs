---
id: overview
title: Targeting Overview
description: Overview of the ConfigCat targeting feature with examples.
---
## Examples
This is the simplest feature flag you can create. It is enabled for everyone.
![Basic Feature Flag](../../assets/../../static/assets/targeting/basic.png)

This feature flag is enabled for everyone whose email address ends with `@example.com`.
![Simple Feature Flag](../../assets/../../static/assets/targeting/simple.png)

This is a more complex feature flag. It is enabled for everyone whose email address ends with `@example.com` AND the OS is `iOS or Android`. This flag is also enabled for everyone who is among the `Beta Users` segment. Read more about segments [here](segments.md).
![Complex Feature Flag](../../assets/../../static/assets/targeting/complex.png)
