---
id: overview
title: Overview
description: Targeting allows you to define targeting rules for feature flags. This way you can target a specific user group with a specific feature.
---

Comparison-based Targeting
Overview
- mi az az összehasonlítás alapú targetálás alias “targeting rule”, mire jó, mit lehet vele elérni? - “Using this feature you will be able to set different setting values for different users in your application [based on the conditions you specify]…”
- hol tud targeting rule-t hozzáadni egy ff-hez a dashboardon
- hogyan működik nagy vonalakban? - csak amennyire egy product managernek értenie kell, kb:
  - OR kapcsolat van közöttük, azaz felülről lefelé az első match fog érvényesülni
  - két része van: IF és THEN
    - az IF részben vannak a conditionök, amik között AND kapcsolat van, azaz mindegyiknek igazra kell kiértékelődni, hogy a targeting rule matcheljen
    - a THEN rész mondja meg, hogy milyen értéket kap a user, amikor matchel rá a targeting rule (lehet egyszerű érték, vagy % options + hol lehet % options-t hozzáadni a targeting rule-hoz a dashboardon)
  - mi történik, ha nem adják be a targeting rule kiértékeléséhez szükséges user attribútumot? (ilyenkor ugrunk a köv. rule-ra, ill. ha nincs több, akkor a feltétel nélküli % optionsre, ill. ha nincs olyan, akkor a ff végén lévő fallback value lesz az eredmény)
- hogyan lehet átrendezni a sorrendet (“Multiple targeting rules and ordering” rész a jelenlegi doksiban)
- példa - dashboard screenshot egy legalább 2 targeting rule-os ff-ről (jó, ha AND condition is van benne), rövid szöveges magyarázattal, pl. “ha a User.Emailben ezt az X értéket adják be, akkor ez a targeting rule matchel, és ez lesz az kiszolgált érték, ha ezt az Y értéket, akkor pedig az a targeting rule matchel, …”

> ezt mar user condition nek hivjuk
> condition based targeting
> targetig rule overview - IF resze , THEN resze
>  - condition-ok vannak benne
> - 3 condition altipus

> legyen egy targeting rule overview
> ebben legyen h OR kapcsolat van koztuk
>
> IF reszben legyen leirva hogy ezek kozott AND kapcsolat van






Adam:

Amíg még frissek az emlékek, írtam gyorsan egy vázlatot, hogy hogyan nézne ki, milyen kérdésekre kellene választ adnia az átdolgozott Targeting résznek:
Targeting
Targeting Overview
mi az a targeting, mire jó, mit lehet vele elérni? - kb. ami a jelenlegi doksiban is van: “...Using this feature you will be able to set different setting values for different users in your application. Let’s say you would like to enable a feature only for the users within your company or only to a small percentage of your users before releasing it to the entire world…”
hogyan működik nagy vonalakban? - csak amennyire egy product managernek értenie kell, kb: “a dashboardon szabályokat definiál a userek különböző csoportjaira + az alkalmazás oldalon beadja a szabályokban hivatkozott user attribútumokat a User Objectben az SDK-nak”
alapfogalmak, linkekkel a részletesebb leírásokra - User Object + a feature flag felépítése (l. Catnip terminology doksi: https://docs.google.com/document/d/1_ebnJRu16dd90RsMrr_C3HOWdTtXWZ-e0t2qyoBjggU)
hogy néz ki egy targetinges feature flag a dashboardon? + screenshot segítségével megmutatni, hogy a fogalmakhoz kapcsolódó dolgokat hol találja a dashboardon
egy pár mondat arról, hogy programozói oldalon mit kell csinálni, hogy működjön a targeting (ill. ha ez már le van írva máshol részletesebben, átlinkelni oda) + vsz. érdemes lenne egy dashboard screenshotos példát is adni hozzá: “ha van egy ilyen X ff-ed a dashboardon, akkor a programozóidnak ezeknek az Y user attribútumoknak a beadásáról kell gondoskodnia”
Percentage-based Targeting
mi az a % alapú targetálás alias “% options”, mire jó, mit lehet vele elérni? - “…a specific percentage of users are selected to receive access to the feature. This allows developers to control and monitor the impact of the new feature in a controlled manner.”
hol tud % options-t hozzáadni egy ff-hez a dashboardon
hogyan működik nagy vonalakban? - csak amennyire egy product managernek értenie kell, kb:
a csoportosítás egy user objectben beadott attibútumon alapul (defaultból ez a User.Identifier, de át lehet állítani ff szinten + hol lehet átállítani screenshottal)
a csoportosítás véletlenszerű, de sticky (az, hogy a stickységet technikailag hogyan érjük el, az nem ide tartozik, max. egy link lenne a technikai leírásra)
mi történik, ha nem adják be a % options kiértékeléséhez szükséges user attribútumot? (ilyenkor ff végén lévő fallback value lesz az eredmény)
példa - dashboard screenshot egy feltétel nélküli % optionös ff-ről, rövid szöveges magyarázattal, pl. “ha a User.Identifierben ezt az X értéket adják be, akkor ebbe a csoportba kerül, ha azt az Y értéket, akkor meg abba a csoportba”
Comparison-based Targeting
Overview
mi az az összehasonlítás alapú targetálás alias “targeting rule”, mire jó, mit lehet vele elérni? - “Using this feature you will be able to set different setting values for different users in your application [based on the conditions you specify]…”
hol tud targeting rule-t hozzáadni egy ff-hez a dashboardon
hogyan működik nagy vonalakban? - csak amennyire egy product managernek értenie kell, kb:
OR kapcsolat van közöttük, azaz felülről lefelé az első match fog érvényesülni
két része van: IF és THEN
az IF részben vannak a conditionök, amik között AND kapcsolat van, azaz mindegyiknek igazra kell kiértékelődni, hogy a targeting rule matcheljen
a THEN rész mondja meg, hogy milyen értéket kap a user, amikor matchel rá a targeting rule (lehet egyszerű érték, vagy % options + hol lehet % options-t hozzáadni a targeting rule-hoz a dashboardon)
mi történik, ha nem adják be a targeting rule kiértékeléséhez szükséges user attribútumot? (ilyenkor ugrunk a köv. rule-ra, ill. ha nincs több, akkor a feltétel nélküli % optionsre, ill. ha nincs olyan, akkor a ff végén lévő fallback value lesz az eredmény)
hogyan lehet átrendezni a sorrendet (“Multiple targeting rules and ordering” rész a jelenlegi doksiban)
példa - dashboard screenshot egy legalább 2 targeting rule-os ff-ről (jó, ha AND condition is van benne), rövid szöveges magyarázattal, pl. “ha a User.Emailben ezt az X értéket adják be, akkor ez a targeting rule matchel, és ez lesz az kiszolgált érték, ha ezt az Y értéket, akkor pedig az a targeting rule matchel, …”
User Object attribute-based targeting
mi az a User Object attribute comparison condition alias “user condition”, mire jó, mit lehet vele elérni? - “egy olyan feltétel, ami egy user attribútum és a dashboardon megadott érték összehasonlításán alapul, stb.”
hol tud user conditiont hozzáadni egy targeting rule-hoz a dashboardon
hogyan működik nagy vonalakban? - csak amennyire egy product managernek értenie kell, kb. az ami a jelenlegi doksiban is van: “comparison attribute”, “comparator”, “comparison value”
példa screenshottal, rövid szöveges magyarázattal
Prerequisite Feature Flags
mi az a “prerequisite flag condition”, mire jó, mit lehet vele elérni? - “egy olyan feltétel, ami egy másik feature flag értékének és a dashboardon megadott értéknek az összehasonlításán alapul, stb.”
hol tud prerequisite flag conditiont hozzáadni egy targeting rule-hoz a dashboardon
hogyan működik nagy vonalakban? - csak amennyire egy product managernek értenie kell, kb.: “a függő flag kiértékelésekor a feltételben hivatkozott prereq flag ki lesz értékelve (ugyanazzal a User Objecttel, mint amit a függő flag kiértékeléséhez beadtak), és a kiértékelés eredményének és a comparison value-nak az összehasonlítása fogja adni az eredményt”
példa screenshottal, rövid szöveges magyarázattal
Segmentation & Segments
mi az a “segment condition”, mire jó, mit lehet vele elérni? - “egy olyan feltétel, ami egy product szinten definiált user condition, más néven segment kiértékelésén alapul, stb.”
hol tud segmentet definiálni és hol tud segment condition hozzáadni egy targeting rule-hoz a dashboardon
hogyan működik nagy vonalakban? - csak amennyire egy product managernek értenie kell
példa screenshottal, rövid szöveges magyarázattal
Details of feature flag evaluation (ennek vsz. nem is a Targeting dropdownon belül lenne a helye, hanem utána)
Mi a feature flag kiértékelés pontos menete?
alapvetően a kiértékelési algoritmus szöveges leírása, esetleg screenshotokkal, logokkal illusztrálva
részletesség: valahol a product manager és a programozó között (azaz az előbbi is meg tudja érteni, ha akarja)
de legyen benne, hogy a gyakoribb hibalehetőség, edge case-ek hogyan vannak lekezelve