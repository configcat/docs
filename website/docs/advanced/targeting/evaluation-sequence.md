---
id: evaluation-sequence
title: Targeting Rule Evaluation Sequence
description: The evaluation sequence of the targeting rules.
---

Targeting rules are evaluated in the order they are defined in the ConfigCat Dashboard.

Rule sets are evaluated one by one, from top to bottom direction.

:::tip
You can change the order of targeting rules by dragging and dropping them in the ConfigCat Dashboard.
:::

#### AND conditions
To have a match in an AND condition, all the conditions must be met.

#### OR conditions
If a targeting rule doesn't match, the evaluation will continue with the next targeting rule.

### Served value
The value defined in the targeting rule will be served if the targeting rule matches. You can add percentage based values to the targeting rules.

### To all other

This value will be served as a fallback if none of the above rules apply or a [`User Object`](advanced/user-object.md) is not passed to the [ConfigCat SDK](sdk-reference/overview.md) correctly within your application.