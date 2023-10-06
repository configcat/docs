---
id: prerequisite
title: Prerequisite Feature Flags
description: A prerequisite feature flag is a type of feature flag that is used to control the availability of another feature flag.
---

A prerequisite feature flag is a type of feature flag that is used to control the availability of another feature flag. It acts as a condition that must be met before the dependent feature flag becomes active. This allows developers to ensure that certain conditions or requirements are fulfilled before users can access a particular feature. Prerequisite feature flags are particularly useful for managing complex feature dependencies and ensuring a smooth user experience during feature rollouts.

## Considerations
- A prerequisite flag can only be a feature flag (ON/OFF, boolean typed setting).
- You can set if the prerequisite flag should match `false = is Off` or `true = is On` to activate the dependent flag.