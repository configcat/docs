---
id: evaluation-sequence
title: Targeting Rule Evaluation Sequence
description: The evaluation sequence of the targeting rules.
---

> Nev: Evaluation process, details of evaluation
>
> mi tortenik amikor egy getValuet()-t meghiv valaki
> linkeljuk a fogalmakat az overview-ben
>
> ez technnikai resz, lehet bonyolultabb
> 
> peldakon keresztul mutassuk be a kiertekelest
>
> 1. Boolean FF
> Ha erre getvaluet hivsz akkor mi tortenik
> ha hiba torenik akkor a default value megy vissza
> (a tipusegyeztetes fontos: default value type -> ugyanaz mint a ff type)
>
> https://docs.google.com/document/d/12DGGPe6r6HTEh25c33j0Raj322JyRIsAvpa0ljX0XdA/edit#heading=h.fb3lgx7nv9hl
>
> https://docs.google.com/document/d/18zUhtRUeX8IR1cDyKygVi7n_nwKR8GkZjqqqljOjqjc/edit#heading=h.gjdgxs
>
>
> 

Targeting rules are evaluated in the order they are defined in the ConfigCat Dashboard.

Conditions and targeting rules are evaluated one by one, from top to bottom direction.

:::tip
You can change the order of targeting rules by dragging and dropping them in the ConfigCat Dashboard.
:::

#### AND conditions
To have a match in an AND condition, all the conditions must be met.

#### OR conditions
If a targeting rule doesn't match, the evaluation will continue with the next targeting rule.

### Served value
The value defined in the targeting rule will be served if the targeting rule matches. You can add percentage-based values to the targeting rules.

### To all other

This value will be served as a fallback if none of the above rules apply or a [`User Object`](advanced/user-object.md) is not passed to the [ConfigCat SDK](sdk-reference/overview.md) correctly within your application.