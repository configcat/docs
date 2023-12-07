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

## Evaluation of percentage options

[Ide jönne a % alapú csoportba osztás algoritmusának leírása (https://configcat.com/docs/advanced/targeting/#stickiness--consistency)
azzal a kiegészítéssel, hogy a %-olás alapja most már lehet más is, nem csak a User.Identifier]

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