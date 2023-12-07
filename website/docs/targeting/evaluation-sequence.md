---
id: evaluation-sequence
title: Evaluation Sequence
description: The evaluation sequence of the targeting rules.
---

# Evaluation of a Setting

This page provides a detailed description of how a setting is evaluated, that is, the steps and rules the SDK applies when determining the value of a setting during a `GetValue` call.

The descriptions here are based on the fundamental concepts of [targeting](link-to-Targeting-Overview-page), so familiarity with these is necessary for understanding.

The value of a setting is dependent on the following inputs:
* Rules set on the dashboard,
* The [User Object](TODO) provided to the `GetValue` function, and
* The default value given to the `GetValue` function.

The value of a setting is always supplied by precisely one rule according to the following algorithm:

1. If the setting contains targeting rules, the SDK examines each targeting rule in order, from top to bottom, to see if it matches, i.e., if the conditions specified in its IF part are met.
   * If so, the THEN part determines the value of the setting and returns it. (In cases of a Percentage option in the THEN part, it might be impossible to determine the value if the user attribute used for the percentage is not provided. In such cases, even if the targeting rule matches, the SDK moves to the next targeting rule, or to point 2, and continues the evaluation.)
   * If not, the SDK moves to the next targeting rule, or if there are no more, to point 2.
2. If the setting contains a % option rule, the SDK determines the setting value according to the algorithm described in [Evaluation of percentage options](#link), and then returns it. (Here too, if the user attribute used for the percentage is not provided, the SDK jumps to point 3 and continues the evaluation.)
3. When the evaluation process reaches this point, only one "rule" remains: the simple value specified at the end of the setting. Thus, the evaluation concludes, and the SDK returns this value.

In cases where any unexpected error occurs during the evaluation, the result will be the default value provided to the `GetValue` function.

## Evaluation of a Targeting Rule

The SDK examines each targeting rule in order, from top to bottom, to see if the conditions specified in its IF part are met. A condition's evaluation can have three possible outcomes: true, false, or cannot evaluate.

Cannot evaluate occurs when the user attribute referenced in the condition is not provided (either no User Object is given to the `GetValue` function, or the User Object does not contain the specified attribute) or if the user attribute contains an invalid/incorrectly formatted value. (The SDK also notifies about such cases through warning-level log messages.)

A targeting rule matches only if every condition's result is true. In all other cases, the targeting rule does not match.

### Evaluation of a User Condition

The SDK takes the attribute specified by the comparison attribute from the User Object, then performs the comparison operation as defined by the selected comparator on the obtained value and the comparison value set on the dashboard. This operation results in a true/false logical value. This is the result of the condition.

However, if the user attribute referenced by the comparison attribute is not provided or contains a value not matching the expected type/format of the comparator, the comparison operation cannot be performed, resulting in a cannot evaluate outcome.

### Evaluation of a Prerequisite Condition

The SDK first evaluates the selected prerequisite flag as if it were a separate setting. It uses the same User Object for this evaluation as was provided for the evaluation of the dependent setting.

This evaluation always provides a result, which the SDK compares with the comparison value set on the dashboard according to the selected comparator. This operation results in a true/false logical value. This is the result of the condition.

(If an unexpected error occurs during the evaluation of the prerequisite flag, the entire evaluation process is halted, and the SDK will return the default value.)

### Evaluation of a Segment Condition

The SDK first takes the condition specified in the segment. Essentially, this is a user condition, which is evaluated in the same way as a regular user condition.

If the result of the user condition is true and the selected comparator is IS IN SEGENT, or the user condition result is false and the comparator is IS NOT IN SEGMENT, then the result of the segment condition will be true.

If the result of the user condition is false and the selected comparator is IS IN SEGMENT, or the user condition result is true and the comparator is IS NOT IN SEGMENT, then the result of the segment condition will be false.

Otherwise, if the result of the user condition is cannot evaluate, then the result of the segment condition will also be cannot evaluate.

## Evaluation of Percentage Options

The percentage-based targeting is sticky by design and consistent across all SDKs.

Percentage-based targeting by default is based on the identifier of the `User Object` passed to the SDK's `getValue()` methods.
The SDKs are hashing the concatenated value of the `User Object's` `identifier` and the requested feature flag's `Key`. Then they assign a 0-99 number to the User for a specific feature flag. This number is used to evaluate a particular feature flag's value based on the targeting rules.
This number is fix and consistent for each User across all SDKs. The SDKs check if the assigned number is greater or less than the percentage set on the ConfigCat Dashboard.

:::caution
As not only the User's identifier is hashed but the User's identifier concatenated with the evaluated feature flag's key, we can ensure that you won't test on the same user base for all of your feature flags.
:::

:::info
As the evaluation happens in the SDKs, your User's sensitive information will never leave your system. The data flow is unidirectional (only from ConfigCat CDN servers to your SDKs), and ConfigCat doesn't receive or store any of the User Object's attributes passed to the SDKs.
:::

### Example for percentage-based targeting

Let's say you have two users and two different feature flags with percentage-based targeting.

|      | isTwitterSharingEnabled                                                                 | isFacebookSharingEnabled                                                                  |
| ---- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Jane | `hash('Jane' + 'isTwitterSharingEnabled') mod 100` <br/>-> The assigned number is **8** | `hash('Jane' + 'isFacebookSharingEnabled') mod 100` <br/>-> The assigned number is **64** |
| Joe  | `hash('Joe' + 'isTwitterSharingEnabled') mod 100` <br/>-> The assigned number is **32** | `hash('Joe' + 'isFacebookSharingEnabled') mod 100` <br/>-> The assigned number is **12**  |

1. Let's start with both feature flags set to **0% ON / 100% OFF**.

|      | isTwitterSharingEnabled <br/> 0% ON / 100% OFF | isFacebookSharingEnabled <br/> 0% ON / 100% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 >= 0 <br/>-> **OFF**                         | 64 >= 0 <br/>-> **OFF**                         |
| Joe  | 32 >= 0 <br/>-> **OFF**                        | 12 >= 0 <br/>-> **OFF**                         |

2. Let's set both feature flags to **10% ON / 90% OFF**.

|      | isTwitterSharingEnabled <br/> 10% ON / 90% OFF | isFacebookSharingEnabled <br/> 10% ON / 90% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 10 <br/>-> **ON**                          | 64 >= 10 <br/>-> **OFF**                        |
| Joe  | 32 >= 10 <br/>-> **OFF**                       | 12 >= 10 <br/>-> **OFF**                        |

:::caution
Although both feature flags are set to 10% ON / 90% OFF, Jane is only evaluated to **ON** for the `isTwitterSharingEnabled` feature flag.
:::

3. The Twitter Sharing Feature seems alright, so let's increase the `isTwitterSharingEnabled` to **40% ON / 60% OFF**.

|      | isTwitterSharingEnabled <br/> 40% ON / 60% OFF | isFacebookSharingEnabled <br/> 10% ON / 90% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 40 <br/>-> **ON**                          | 64 >= 10 <br/>-> **OFF**                        |
| Joe  | 32 < 40 <br/>-> **ON**                         | 12 >= 10 <br/>-> **OFF**                        |

4. Something seems strange with the Twitter Sharing Feature, so let's rollback to the safe **10% ON / 90% OFF**.

|      | isTwitterSharingEnabled <br/> 10% ON / 90% OFF | isFacebookSharingEnabled <br/> 10% ON / 90% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 10 <br/>-> **ON**                          | 64 >= 10 <br/>-> **OFF**                        |
| Joe  | 32 >= 10 <br/>-> **OFF**                       | 12 >= 10 <br/>-> **OFF**                        |

> As percentage-based targeting is sticky, the same user base is evaluated to **ON** like in the 2. step.

5. If everything seems alright, we can safely increase both feature flags to **100% ON / 0% OFF**.

|      | isTwitterSharingEnabled <br/> 100% ON / 0% OFF | isFacebookSharingEnabled <br/> 100% ON / 0% OFF |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| Jane | 8 < 100 <br/>-> **ON**                         | 64 < 100 <br/>-> **ON**                         |
| Joe  | 32 < 100 <br/>-> **ON**                        | 12 < 100 <br/>-> **ON**                         |

# Examples

## Simple feature flag

[Egy kőegyszerű ff kiértékelésének bemutatása]

## Percentage options

[Egy egyszerű percentage optionsös ff-en a %-os elosztás működésének bemutatása - ide jöhetne ez: https://configcat.com/docs/advanced/targeting/#example-1]

## Targeting rules with AND conditions

[Egy egyszerűbb, 2 targeting rule-os ff-en az OR és AND kapcsolatok működésének bemutatása]

## Segment condition

[Segment condition kiértékelésének bemutatása]

## Prerequisite flag condition

[Prerequisite flag condition kiértékelésének bemutatása]
---




# Evaluation of a setting

Ez az oldal egy részletesebb leírást ad arról, hogy hogyan történik egy setting kiértékelése, azaz, milyen lépéseket
és szabályokat alkalmaz az SDK, amikor egy `GetValue` hívás során a setting értékét megállapítja.

Az itt leírtak a [targeting](link-a-Targeting-Overview-oldalra) alapfogalmaira építenek, ezért a megértéshez szükséges
tisztában lenni ezekkel.

A setting értéke a következő bemenő adatok függvénye:
* a dashboardon megadott szabályok,
* a `GetValue` függvénynek beadott [User Object](link-a-User-Object-oldalra) és
* a `GetValue` függvénynek beadott default value.

A setting értékét mindig pontosan egy szabály fogja szolgáltatni a következő algoritmus szerint:

1. Ha a setting tartalmaz targeting rule-okat, akkor az SDK sorrendben, felülről lefelé haladva megvizsgálja, hogy az
   adott targeting rule matchel-e, azaz annak az IF részében megadott conditonök teljesülnek-e.
   * Ha igen, akkor a THEN rész alapján meghatározza a setting értékét, és visszatér. (Percentage optionös THEN rész
     esetén előfordulhat, hogy az érték meghatározása nem lehetséges, mert a százalékolás alapjául szolgáló user
     attribútum nincs megadva. Ilyenkor - dacára annak, hogy a targeting rule matchelt - az SDK a következő targeting
     rule-ra ugrik, vagy ha nincs több, a 2-es pontra, és folytatja a kiértékelést.)
   * Ha nem, akkor az SDK a következő targeting rule-ra ugrik, vagy ha nincs több, a 2-es pontra.
2. Ha a setting tartalmaz % optionös szabályt, akkor az SDK az [Evaluation of percentage options](#link) részben leírt
   algoritmus szerint meghatározza a setting értékét, és visszatér. (Itt is előfordulhat, hogy a százalékolás alapjául
   szolgáló user attribútum nincs megadva. Ilyenkor az SDK a 3-as pontra ugrik, és folytatja a kiértékelést.)
3. Amikor a kiértékelési folyamat eljut erre a pontra, akkor már csak egy "szabály" marad hátra:
   a setting végén megadott egyszerű érték. A kiértékelés tehát befejeződik, és az SDK visszatér ezzel az értékkel.

Abban az esetben, ha a kiértékelés során bármilyen nem várt hiba történik a kiértékelés eredménye a `GetValue`
függvénynek beadott default value lesz.

## Evaluation of a targeting rule

Az SDK sorrendben, felülről lefelé haladva megvizsgálja, hogy a targeting rule IF részében megadott feltételek
teljesülnek-e. Egy condition kiértékelésének 3 féle eredménye lehet: true, false vagy cannot evaluate.

A cannot evaluate abban az esetben fordulhat elő, amikor a conditionben hivatkozott user attribútum nincs megadva
(nem adtak be User Objectet a `GetValue` függvénynek, vagy a User Objectben nincs kitöltve az adott attribútum)
vagy a user attribútum érvénytelen/hibás formátumú értéket tartalmaz. (Az ilyen esetekről az SDK warning szintű log
üzenetek formájában is tájékoztat.)

A targeting rule akkor fog matchelni, ha mindegyik condition eredménye true. Minden más esetben a targeting rule
nem matchel.

### Evaluation of a user condition

Az SDK veszi a comparison attribute által meghatározott attributúmot a User Objectből, majd a kapott értéken és
a dashboardon megadott comparison value-n elvégzi a kiválasztott comparatornak megfelelő összehasonlítási műveletet.
Ez a művelet egy logikai igaz/hamis értéket eredményez. Ez lesz a condition eredménye.

Azonban, ha a comparison attribute által hivatkozott user attribútum nincs megadva vagy olyan értéket tartalmaz,
ami nem felel meg a comparator által várt típusnak/formátumnak, az összehasonlítási műveletet nem lehet elvégezni,
ezért ebben az esetben az eredmény cannot evaluate lesz.

### Evaluation of a prerequisite condition

Az SDK először kiértékeli a kiválasztott prerequisite flaget, mintha az egy különálló setting lenne.
Ugyanazt a User Objectet használja a kiértékeléshez, mint amit a függő setting kiértékeléséhez beadtak.

Ez a kiértékelés mindig szolgáltat egy eredményt, amit az SDK a kiválasztott comparatornak megfelelően összehasonlít a
dashboardon megadott comparison value-val. Ez a művelet egy logikai igaz/hamis értéket eredményez. Ez lesz a condition
eredménye.

(Abban az esetben, ha a prerequisite flag kiértékelése során nem várt hiba történik, akkor az egész kiértékelési
folyamat megszakad, és az SDK a default value-t fogja visszaadni).

### Evaluation of a segment condition

Az SDK először veszi a segmentben megadott feltételt. Ez lényegében egy user condition, amit ennek megfelelően pontosan
ugyanúgy kiértékel, mint egy sima user conditiont.

Ha a user condition eredménye true és a kiválasztott comparator IS IN SEGMENT, vagy a user condition eredménye false és
a kiválasztott comparator IS NOT IN SEGMENT, akkor a segment condition eredménye true lesz.

Ha a user condition eredménye false és a kiválasztott comparator IS IN SEGMENT, vagy a user condition eredménye true és
a kiválasztott comparator IS NOT IN SEGMENT, akkor a segment condition eredménye false lesz.

Egyébként, ha a user condition eredménye cannot evaluate, akkor a segment condition eredménye is cannot evaluate lesz.