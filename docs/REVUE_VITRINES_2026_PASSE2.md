# Revue indépendante, passe 2 — composants vitrines (refonte 2026)

**Testeur :** testeur-site2 (n'a vu ni le travail ni la passe 1 se faire) · **Date :** 24/10/2026
**Branche revue :** `claude/vitrines-2026`, HEAD `c8ddab616fc04e342acca17d022ea77759e73409` (reprises : `3e28b50` tests, `d35496e` correctif Sophie, `c8ddab6` rapport)
**Référence de la passe 1 :** `docs/REVUE_VITRINES_2026.md` (`f974e72`), 5 reprises.
**Discipline :** `dh-discipline-de-preuve`. « Vérifié » = exécuté par moi, sortie citée. « Lu » = lu, non exécuté.
**Méthode :** aucune modification dans le worktree ; chaque scénario tourne sur une copie `git archive HEAD` sous `/root/.dh_orch_vague2/testeur-site2-<scénario>/` (sources copiées, `node_modules` en liens durs), toujours avec le `tests/vitrines.mjs` de HEAD (contrôlé par `cmp` dans chaque journal). Concierge **intercepté** partout (aucun appel réel), aucun formulaire envoyé, aucun modèle payant. Serveurs Node éphémères (port 0, fermés par les scripts ; `ps` en fin de revue : aucun reste).
Journaux : `/root/.dh_orch_vague2/testeur-site2-*.log` · scripts : `/root/.dh_orch_vague2/testeur-site2-outils/` · captures : `/root/.dh_orch_vague2/testeur-site2-captures/`.

---

## 0 · Verdict : **À REPRENDRE**

Les cinq reprises sont traitées, et chacune a été prouvée rouge sans le correctif ou sur mes propres mutants :

| Reprise | Traitée | Rouge sans correctif / sur mutant (mesuré par moi) |
|---|---|---|
| 1. Question avalée pendant une réponse | **oui** | **oui** : code `d35496e^` + tests de HEAD → 3 échecs T1b ; mon scénario navigateur (3 questions en rafale) : 1 requête sur 3 avant, 3 sur 3 dans l'ordre après |
| 2. T2 boîtes vert avec mention invisible | **oui** | **oui** : `visibility:hidden` → 4 × ECHEC ; hors écran (`position:fixed; left:-9999px`) → 4 × ECHEC |
| 3. T6 chiffres comparés au JSON seulement | **oui** | **oui** : JSON 177 `objets` 34 → 33 (page reconstruite, elle affiche 33) → `ECHEC T6 SDS 177` ; chemin « SDS introuvable » **exécuté** : vrai 404, valeur absente, réseau refusé → 3 × ECHEC |
| 4. Mention à 390 px absente de « attend Sam » | **oui** | sans objet (document) : rapport § 5 point 0 |
| 5. Couverture « contenu commun » surestimée | **oui** sur la formulation | **oui** sur mutant grossier (texte EN altéré → ECHEC) ; **non** sur deux mutants plausibles (défaut D2) |

« À reprendre » à cause des défauts restants du § 5, dont un introduit par le correctif de la reprise 1 (D1) et un défaut de contenu visible sur l'accueil (D4). Conformément à la consigne (dernière passe autorisée), ils sont consignés comme **ouverts pour Sam**. Je n'ai rien corrigé.

---

## 1 · Tests relancés par moi à HEAD — `testeur-site2-head.log`

```
$ cd /root/workspace/wt-vitrines ; for s in build typecheck test:parite test:routes test:vitrines; do npm run $s; echo "EXIT[$s]=$?"; done
dist/assets/index-DVQBce69.css   74.53 kB │ gzip:  14.42 kB
dist/assets/index-DNTXF_Ln.js   363.79 kB │ gzip: 118.54 kB
EXIT[build]=0
EXIT[typecheck]=0
  OK   /legal [fr]          59 lignes identiques      (idem [en])
  OK   /cgv [fr]            70 lignes identiques      (idem [en])
  OK   /privacy [fr]        67 lignes identiques      (idem [en])
OK : les deux sites disent exactement la meme chose.
EXIT[test:parite]=0
  OK    /legal [fr] : 200, 4 mention(s) presente(s)   … /cgv 1, /privacy 2, FR et EN
  OK    Atelier : les 6 liens SDS sont presents
  OK    SDS https://digital-humans.fr/sds-preview/146.html : 200   (… 148, 176, 177, 178, 179 : 200)
OK : tous les controles passent.
EXIT[test:routes]=0
  OK    T1b les deux questions partent au concierge, dans l’ordre (aucune perdue)
  OK    T1b les deux questions sont affichees dans le dialogue
  OK    T1b les deux reponses sont affichees
  OK    T1b champ vide apres la 2e question (elle est prise en charge, pas jetee)
  OK    T2 #who : la boite porte la mention IA, visible (stricte) une fois a l'ecran   (… #process, #agents, #atelier)
  OK    T6 tarifs [fr] : 4 cartes, 15 puces, chaque texte affiche est un litteral du bundle servi   (… [en])
  OK    T6 Atelier [fr] : secteur et brief des 6 projets = textes du bundle servi                    (… [en])
  OK    T6 L’Ensemble [fr] : role et citation des 11 agents = textes du bundle servi                (… [en])
  OK    T6 SDS 146 : chiffres recalcules depuis https://digital-humans.fr/sds-preview/146.html = content/sds-chiffres.json   (… 148, 176, 177, 178, 179)
OK : 89 controles.
EXIT[test:vitrines]=0
```

Les chiffres du rapport (« `OK : 89 controles.` (73 avant les reprises) », parité 59/70/67, six SDS en 200) sont **confirmés**. `git status --short` est vide après ces runs (`dist/` et `.reference/` sont ignorés).
Copie de base : `git archive HEAD` + `npx vite build` → `diff -r` avec le `dist/` du worktree : `DIST_IDENTIQUE`.

---

## 2 · Reprises, une par une

### Reprise 1 — question avalée (`SophieChat.tsx`, `BoiteSophie.tsx`) : **traitée**

**Correctif lu (`d35496e`, 1 fichier : `components/site/SophieChat.tsx`).** `if (!text || sending) return;` est remplacé par un état « en cours » tenu dans une ref (`enCours`) et une file (`file`). `sendMessage` affiche la question tout de suite, la met en file si une réponse est attendue, sinon appelle `transmettre`. Le `finally` de `transmettre` dépile la question suivante. Un échec HTTP (`!res.ok`) lève une exception et affiche `t.error` : il n'y a pas de nouveau repli silencieux. `BoiteSophie.tsx` n'est pas modifié : le champ est vidé, mais la question est maintenant prise en charge.

**Assertion lue (T1b, `3e28b50`).** Le concierge est intercepté avec une réponse retardée de 2 s. Le test envoie A, ferme le tiroir, puis envoie B. Il exige `envois === ["Question A","Question B"]`, les deux questions et les deux réponses affichées. Elle prouve la reprise. Le quatrième contrôle (« champ vide ») ne discrimine pas : il est vert aussi sur l'ancien code (voir plus bas). Il est inoffensif, mais ne prouve rien à lui seul.

**Rouge sans le correctif (vérifié).** Copie `testeur-site2-r1` = HEAD, avec `components/site/SophieChat.tsx` remplacé par `git show d35496e^:components/site/SophieChat.tsx`. Le test vient de HEAD (`cmp … && echo TEST_IDENTIQUE_HEAD` → `TEST_IDENTIQUE_HEAD`). Le build donne `index-DM-_HzE3.js`, le hash exact de la passe 1 à `2ebfabd`.
```
$ node tests/vitrines.mjs dist          # testeur-site2-r1.log
  ECHEC T1b les deux questions partent au concierge, dans l’ordre (aucune perdue) — ["Question A"]
  ECHEC T1b les deux questions sont affichees dans le dialogue — ["Question A"]
  ECHEC T1b les deux reponses sont affichees
  OK    T1b champ vide apres la 2e question (elle est prise en charge, pas jetee)
ECHEC : 3 controle(s) en echec sur 89.
VITRINES_EXIT=1
```

**Vérification en navigateur, scénarios à moi (distincts de T1b).** Le script `testeur-site2-outils/double-envoi.mjs` envoie trois questions en rafale : Q1 et Q2 dans `#who`, Q3 dans `#process`, à moins de 80 ms d'écart et sans fermer le tiroir. La réponse est retardée de 1,5 s. Toutes les requêtes `concierge` sont interceptées par `ctx.route`, qui pose un en-tête `x-intercepte` contrôlé sur chaque réponse. Journal : `testeur-site2-double-envoi.log`.
```
### HEAD
=== S1 FR, trois questions en rafale (2 boites), reponses lentes 1,5 s
  684 debut traitement « Q1 » · 696 Q1 tapee · 727 Q2 tapee · 764 Q3 tapee
  2185 fin « Q1 » -> 200 · 2189 debut traitement « Q2 » · 3690 fin « Q2 » -> 200 · 3697 debut traitement « Q3 » · 5197 fin « Q3 » -> 200
envois au concierge (ordre) : ["Q1","Q2","Q3"]
questions affichees 200 ms apres la rafale : ["Q1","Q2","Q3"]
bulles du dialogue a la fin : ["Bonjour ! …","Q1","Q2","Q3","REP<Q1>","REP<Q2>","REP<Q3>"]
etat final : {"textareaDisabled":false,"reflexion":0,"erreur":[]}
requetes concierge non interceptees : []
=== S3 EN, trois questions en rafale        → envois ["Q1","Q2","Q3"], même séquencement, non interceptees []
### code d35496e^ (copie r1)
=== S1 FR …  envois au concierge (ordre) : ["Q1"]   questions affichees : ["Q1"]   champs des boites apres envoi : ["",""]
=== S3 EN …  envois au concierge (ordre) : ["Q1"]
```
Les envois sont **séquentiels** : chaque requête part 4 à 12 ms après la fin de la précédente. Ils partent dans l'ordre, et aucun appel réel n'atteint le concierge (l'API est relative et servie par le serveur local ; les 100 % des requêtes `concierge` sont interceptées). Avec une seule question, le tiroir est **identique au pixel** avant et après le correctif : `compare -metric AE -fuzz 2%` → `0` à 1488 FR sombre et à 390 EN clair (`testeur-site2-tiroir.log`, `tiroir-*.png`).

Le scénario S2 (première réponse en HTTP 500) révèle le défaut **D1** du § 5.

### Reprise 2 — T2 boîtes, mention invisible mais contrôle vert : **traitée**

**Assertion lue.** Pour chacune de `#who/#process/#agents/#atelier`, le test fait défiler jusqu'au premier `[data-mention-ia]` de la section (`scrollIntoView`), attend deux images, puis applique le prédicat `VISIBLE` limité à la section. Le prédicat vérifie : taille non nulle, rectangle dans la fenêtre, `visibility === 'visible'`, `display !== 'none'` et opacité 1 sur toute la chaîne des parents, plus `elementFromPoint` au centre. C'est le prédicat que demandait la passe 1.

**Mes mutants** (règle CSS ajoutée au CSS construit d'une copie, test de HEAD ; `testeur-site2-r2.log`) :
```
### mutant r2-hidden : ajout CSS « .v-mention{visibility:hidden!important} »
  ECHEC T2 #who : la boite porte la mention IA, visible (stricte) une fois a l'ecran — {"visible":false,"n":1,"details":["opacite/visibilite"]}
  ECHEC T2 #process … ["opacite/visibilite"]   ECHEC T2 #agents … ["opacite/visibilite"]   ECHEC T2 #atelier … ["opacite/visibilite"]
ECHEC : 8 controle(s) en echec sur 89.       (4 boîtes + 4 contrôles du héros « intro vue »)
### mutant r2-horsecran : ajout CSS « .v-mention{position:fixed!important;left:-9999px!important} »
  ECHEC T2 #who … {"visible":false,"n":1,"details":["hors fenetre 438"]}   (… #process 439, #agents 439, #atelier 439)
ECHEC : 8 controle(s) en echec sur 89.
### mutant r2-transparent : ajout CSS « .v-mention{color:transparent!important} »
  OK    T2 #who : la boite porte la mention IA, visible (stricte) une fois a l'ecran   (… les 4 boîtes, et tout T2 du héros)
OK : 89 controles.
```
Le mutant transparent est bien actif : `getComputedStyle(.v-mention).color` vaut `rgb(184, 178, 166)` sur la base et `rgba(0, 0, 0, 0)` sur le mutant (`testeur-site2-verif-mutant-mention.log`). La reprise est traitée telle qu'elle était formulée (même prédicat, rouge sur `opacity:0`, `visibility:hidden` et hors écran). La limite qui reste dans le prédicat (couleur ou contraste non contrôlés) est consignée en **D3**.

### Reprise 3 — T6 « chiffres mesurés » auto-référent : **traitée**

**Assertion lue (T6 bis).** Le test fait un `fetch` HTTPS des six SDS publiées. Il exige le statut 200 ; en cas d'exception, il échoue avec « injoignable ». Il recalcule en JS les quatre chiffres sur le corps du document : `BR-\d{3}` distincts, dernier « Use Cases — n UCs », « 6.2 Custom Objects (n) » et « Automation Design | Flows (n) » après « 6.1 Data Model ». Une valeur introuvable (`null`) fait échouer le contrôle. Le résultat est comparé à `content/sds-chiffres.json`. Le contrôle de page a été renommé et dit maintenant ce qu'il prouve : « la page affiche les chiffres de content/sds-chiffres.json ». Par transitivité, page = JSON = SDS.

**Mon mutant, différent de M6 bis** : 177 `objets` 34 → 33 dans le JSON, puis **reconstruction**, si bien que la page affiche aussi 33 (`testeur-site2-r3.log`) :
```
avant 177 {'exigences': 26, 'cas_usage': 67, 'objets': 34, 'flux': 17}
apres 177 {'exigences': 26, 'cas_usage': 67, 'objets': 33, 'flux': 17}
  OK    T6 Atelier Grid Foresight -> SDS 177 ; la page affiche les chiffres de content/sds-chiffres.json
  ECHEC T6 SDS 177 : chiffres recalcules depuis https://digital-humans.fr/sds-preview/177.html = content/sds-chiffres.json — SDS {"exigences":26,"cas_usage":67,"objets":34,"flux":17} / JSON {"exigences":26,"cas_usage":67,"objets":33,"flux":17}
ECHEC : 1 controle(s) en echec sur 89.
```

**Chemin « SDS introuvable », exécuté** (l'implémenteur l'avait seulement lu). Un module préchargé, `node --import testeur-site2-outils/stub-sds.mjs`, enveloppe `fetch` sans toucher au test : 146 est redirigé vers la **vraie** `sds-preview/999.html`, 148 est servie en 200 mais sans « Flows (n) », 176 lève `ECONNREFUSED`.
```
$ curl -s -o /dev/null -w '%{http_code}\n' https://digital-humans.fr/sds-preview/999.html
404
[stub] 146 -> 999.html : HTTP 404
[stub] 148 : HTTP 200, « Flows ( » retire
[stub] 176 : ECONNREFUSED simule
  ECHEC T6 SDS 146 : chiffres recalcules depuis la SDS publiee — HTTP 404
  ECHEC T6 SDS 148 : chiffres recalcules depuis https://digital-humans.fr/sds-preview/148.html = content/sds-chiffres.json — introuvable : flux
  ECHEC T6 SDS 176 : chiffres recalcules depuis la SDS publiee — injoignable (ECONNREFUSED)
  OK    T6 SDS 177 … OK T6 SDS 178 … OK T6 SDS 179 …
ECHEC : 3 controle(s) en echec sur 89.
```
Il n'y a pas de repli : les trois modes d'échec font échouer la suite.

### Reprise 4 — mention à 390 px dans « attend Sam » : **traitée**

```
$ grep -n "^## 5" -A 8 docs/RAPPORT_VITRINES_2026.md
247:## 5 · Attend une décision de Sam
249-0. **Mention IA à 390 px, intro déjà vue (signalé par la revue)** : à la première image, la mention
250-   du héros est **sous la ligne de flottaison** — haut à 880 px pour une fenêtre de 844 px (914 px
251-   dans la référence). Le critère de la mission est « visible au premier rendu » ; T2 se replie alors
252-   sur « au premier contact avec la boîte » (brief A.1). … Option : remonter la boîte du héros
253-   sur mobile (écart à la référence). Décision à prendre.
```
Je confirme la mesure : avec le mutant `visibility:hidden`, le détail de T2 à `390px [fr] intro vue` affiche `"premiere":{… "hors fenetre 880" …}`. Le comportement de la page n'a pas changé (géométrie identique, § 3).

### Reprise 5 — « contenu commun contrôlé par T6 » : **traitée sur la formulation, avec un angle mort (D2)**

**Texte corrigé (lu).** Le rapport § 1.3 dit maintenant platement que l'affirmation était trop large à `2ebfabd` et décrit la couverture réelle : « tarifs FR et EN (4 cartes, 15 puces, chaque texte = littéral des sources du bundle servi), secteur et brief des 6 projets, rôle et citation des 11 agents, chiffres recalculés depuis les six SDS publiées ». Il cite aussi ce qui reste hors contrôle. Le message de `a550e95` n'est pas réécrit, et le rapport le dit.

**Assertion lue (T6 ter).** `litteral(s) = SOURCE.includes("'" + s + "'")`, où `SOURCE` concatène `_contenu-source/app_contenu.js` et `benefits_howitworks.js`. Le contrôle vérifie donc que chaque texte affiché **existe quelque part** dans le bundle. Il ne vérifie ni la langue, ni la carte, ni la position.

**Mes mutants** (chaîne remplacée dans le JS construit d'une copie, test de HEAD ; `testeur-site2-r5.log`). Le rendu de chaque mutant est vérifié dans `testeur-site2-verif-mutant-tarifs.log` :
```
### mutant r5-en-altere : « Nemotron model, hosted in Europe » -> « Nemotron model, hosted in the USA »
  ECHEC T6 tarifs [en] : 4 cartes, 15 puces, chaque texte affiche est un litteral du bundle servi — {"cartes":4,"puces":15,"absents":["Nemotron model, hosted in the USA"]}
ECHEC : 1 controle(s) en echec sur 89.
### mutant r5-en-fr : « Nemotron model, hosted in Europe » -> « Modèle Nemotron, hébergé en Europe »   (texte FR sur la page EN)
  OK    T6 tarifs [en] : 4 cartes, 15 puces, chaque texte affiche est un litteral du bundle servi
OK : 89 controles.
### mutant r5-palier : « Chat with Sophie and Olivia » -> « Full ensemble of 11 agents »   (puce du palier Pro dans la carte Free)
  OK    T6 tarifs [en] : 4 cartes, 15 puces, chaque texte affiche est un litteral du bundle servi
OK : 89 controles.

$ node verif-mutant-tarifs.mjs      # 1re carte de #pricing, page EN
base [en] 1re carte : ["Free","◆Chat with Sophie and Olivia","◆No file upload, no persistent memory","◆Nemotron model, hosted in Europe","◆Sessions stateless — nothing stored"]
r5-en-fr [en] 1re carte : ["Free","◆Chat with Sophie and Olivia","◆No file upload, no persistent memory","◆Modèle Nemotron, hébergé en Europe","◆Sessions stateless — nothing stored"]
r5-palier [en] 1re carte : ["Free","◆Full ensemble of 11 agents","◆No file upload, no persistent memory","◆Nemotron model, hosted in Europe","◆Sessions stateless — nothing stored"]
```
La phrase du rapport est exacte au sens littéral : « chaque texte = littéral des sources ». La reprise est donc traitée. Mais le contrôle « tarifs EN » ne voit ni une page anglaise qui affiche le texte français, ni une carte Free qui promet « 11 agents ». C'est le défaut **D2**.

---

## 3 · Régressions visuelles et replis silencieux introduits par les reprises

**Périmètre du code modifié (vérifié).**
```
$ git diff 2ebfabd c8ddab6 --stat
 components/site/SophieChat.tsx |  32 ++++--
 docs/RAPPORT_VITRINES_2026.md  |  49 +++++++-
 docs/REVUE_VITRINES_2026.md    | 249 +++++++++++++++++
 tests/vitrines.mjs             | 155 ++++++++++++++---
```
Seul `SophieChat.tsx` touche le rendu, et seulement dans le tiroir.

**Captures** (`testeur-site2-outils/captures.mjs` : le script de la passe 1, avec seulement la cible et le dossier de sortie changés ; `diff` des deux scripts dans le journal). Elles couvrent HEAD × {1488, 390} × {fr, en} × {dark, light} × 8 sections, plus une page entière FR sombre par largeur, soit 66 `head-*.jpg` dans `testeur-site2-captures/`. S'y ajoutent les captures du tiroir (`tiroir-*.png`) et celles du mutant transparent (`mutant-*-boite-who.png`).

Géométrie DOM comparée au `resume.json` de la passe 1 (HEAD `2ebfabd`) :
```
head-1488-fr-dark h 7597 -> 7597 geo identique bruit 0      head-390-fr-dark h 12253 -> 12253 geo identique bruit 0
head-1488-fr-light h 7597 -> 7597 geo identique bruit 0     head-390-fr-light h 12253 -> 12253 geo identique bruit 0
head-1488-en-dark h 7597 -> 7597 geo identique bruit 0      head-390-en-dark h 12072 -> 12072 geo identique bruit 0
head-1488-en-light h 7597 -> 7597 geo identique bruit 0     head-390-en-light h 12072 -> 12072 geo identique bruit 0
```
Pixels différents entre la passe 2 et la passe 1, à `compare -metric AE -fuzz 8%` (`testeur-site2-cmp.log`) :
```
1488-fr-dark   top 1.1%  who 0.3%  process 0.3%  agents 0.3%  atelier 3.0%  pricing 0.0%  faq 0.0%  cta 0.0%
1488-fr-light  top 0.7%  who 0.3%  process 0.2%  agents 0.0%  atelier 1.5%  pricing 0.0%  faq 0.0%  cta 0.0%
1488-en-dark   top 4.4%  who 0.3%  process 0.3%  agents 0.3%  atelier 3.0%  pricing 0.0%  faq 0.0%  cta 0.0%
1488-en-light  top 2.7%  who 0.3%  process 0.3%  agents 0.3%  atelier 3.1%  pricing 0.0%  faq 0.0%  cta 0.0%
390-*          0.0% partout (8 sections × 4 combinaisons)
```
Les zones différentes (`compare -highlight` puis `-trim`) correspondent aux animations :
- `who` : `654x16+773+849`, une bande de 16 px, celle du bandeau défilant ;
- `atelier` : `645x600+771+263`, le canevas, où l'aperçu de SDS défile automatiquement ;
- `top` : `1432x425+52+191`, le carrousel 3D.

J'ai inspecté à l'œil la paire `cmp/1488-fr-dark-atelier-p1-vs-p2.jpg` : même mise en page, seul le défilement de l'aperçu diffère. Console : `bruit 0` sur les 8 combinaisons. **Aucune régression visuelle constatée.**

**Replis silencieux.** Je n'en ai trouvé aucun nouveau. Le chemin d'erreur du concierge affiche toujours `t.error`, et T6 bis échoue sur tous les modes d'erreur (§ 2, reprise 3). Le chargement de l'historique « silent fail » (`SophieChat.tsx` l. 88) est **préexistant** (portage), non modifié par les reprises (lu). Un défaut de **signalement** est en revanche introduit par la file d'attente : c'est D1.

---

## 4 · Affirmations du rapport (section « Reprises après revue 1 ») — statut

| Affirmation | Statut |
|---|---|
| Reprise 1 rouge sur le code d'avant : `ECHEC T1b … ["Question A"]` ×3 | **vérifiée** (même sortie, § 2) |
| Reprise 2 rouge sur M5 | non rejouée (j'ai utilisé mes propres mutants, rouges, § 2) |
| Reprise 3 rouge sur M6 bis | non rejouée ; mon mutant 177 est rouge |
| « Le chemin "SDS introuvable" … lu, non exécuté » | **désormais exécuté** par moi : 3 modes, 3 échecs |
| Reprise 5, mutant M8 rouge | non rejoué ; mon mutant « EN altéré » est rouge, mais deux mutants plausibles restent verts (D2) |
| `test:vitrines` « OK : 89 controles » | **vérifiée** |
| § 1.3 « chiffres recalculés depuis les six SDS publiées » | **vérifiée** |

---

## 5 · Défauts restants (ouverts pour Sam)

**D1 — Introduit par `d35496e` : une erreur de la 1re question est affichée au mauvais endroit, après les réponses suivantes.** Scénario S2 (`testeur-site2-double-envoi.log`) : Q1 reçoit un HTTP 500, Q2 et Q3 sont en file.
```
envois au concierge (ordre) : ["Q1","Q2","Q3"]
bulles du dialogue a la fin : ["Bonjour ! …","Q1","Q2","Q3","REP<Q2>","REP<Q3>","Désolée, j'ai eu un souci. Réessaie ?"]
etat final : {"textareaDisabled":false,"reflexion":0,"erreur":["Désolée, j'ai eu un souci. Réessaie ?"]}
```
Le visiteur voit trois questions, puis deux réponses, puis « Réessaie ? ». Rien n'indique que c'est **Q1** qui a échoué, et la mise en page suggère que REP<Q2> répond à Q1 et que Q3 a échoué. Avant le correctif, l'erreur suivait directement Q1 : la file a déplacé le signal. Ce n'est pas un repli silencieux (l'erreur est affichée), mais le signal est trompeur.
Même sans erreur, les réponses arrivent groupées après toutes les questions (`Q1,Q2,Q3,REP<Q1>,REP<Q2>,REP<Q3>`). C'est lisible, mais moins clair qu'un dialogue alterné (observation, pas un défaut).
Cause (lu) : `error` est un état unique, rendu après la liste des messages (`{error && …}`, l. 222). `transmettre` le pose sans le rattacher à la question, et seul `sendMessage` l'efface.
Attendu : rattacher l'erreur au message en échec (par exemple, insérer la bulle d'erreur à sa place dans `messages`). Ajouter un test rouge d'abord sur S2.

**D2 — T6 ter ne discrimine ni la langue ni la carte.** `litteral()` accepte tout texte présent n'importe où dans le bundle. Deux mutants plausibles sont verts (§ 2, reprise 5) : la page EN qui affiche la puce française, et la carte Free qui affiche « Full ensemble of 11 agents ». La couverture « tarifs FR et EN » protège contre un texte inventé, pas contre une mauvaise clé de langue ni un mauvais palier.
Attendu : comparer chaque carte à `PRICING_TIERS[i].bullets[lang]` (et `role`/`quote` à l'agent et à la langue attendus), ou dire cette limite dans le rapport.

**D3 — Le prédicat `VISIBLE` (T2) ne contrôle ni la couleur ni le contraste du texte.** Mutant `.v-mention{color:transparent!important}` : `OK : 89 controles.` La mention est alors invisible dans les quatre boîtes **et** dans la boîte du héros, avec tout T2 vert. La reprise 2 telle que formulée est faite, mais « visible » reste une affirmation plus forte que ce que le test mesure.
Attendu : ajouter au moins une couleur non transparente, et idéalement un contraste minimal avec le fond calculé. La passe 1 avait déjà mesuré un contraste de 1,05 dans la référence : la méthode existe.

**D4 — Préexistant (présent à `2ebfabd`), relevé ni par l'implémenteur ni par la passe 1 : chiffres contradictoires sur LogiFleet dans la même section.** L'onglet LogiFleet de l'Atelier affiche les chiffres mesurés **17 objets / 27 flux**. Le bandeau de la même section affiche « … 12 custom objects · 47 flows · 9 LWC » (`testeur-site2-logifleet.log`) :
```
[fr] lignes autour des cartes : [… "25","EXIGENCES","58","CAS D’USAGE","17","OBJETS","27","FLUX"]
[fr] lignes contenant « flows » : ["Service Cloud · Field Service · 320 assets · 12 custom objects · 47 flows · 9 LWC"]
[en] lignes contenant « flows » : ["Service Cloud · Field Service · 320 assets · 12 custom objects · 47 flows · 9 LWC","27 declarative flows, and the cases where Apex is justified over a Flow.","FLOWS"]
```
Source : `content/projects.ts` l. 15, `scope[1]` du site en ligne, porté tel quel. `content/vitrines.ts` l. 89 le met dans `gainBody`. La référence du 18/09 ne contenait pas ce texte (`grep -c "47 flows" /var/www/dh-preview/refonte/index.html` → `0`). C'est exactement le type d'affirmation chiffrée non vérifiée que la mission voulait éliminer de l'Atelier. Le rapport ne le signale pas (§ 1.6 et § 3 ne parlent que de l'anglais en FR). T6 ter ne contrôle pas cette ligne ; il la laisserait passer de toute façon (littéral du bundle).
Attendu : décision de Sam (aligner sur la SDS, retirer la ligne, ou garder en le disant). Ajouter au minimum ce point au § 5 du rapport.

**Limite de couverture notée (lu, non un défaut bloquant).** Le volet « boîtes » de T2 ne tourne qu'en FR à 1488 px (`contexte(browser, { lang: 'fr' })`). La mention EN dans les quatre boîtes et l'ensemble des boîtes à 390 px ne sont contrôlés par aucun test.

### Ce qui n'a pas été fait, et pourquoi
- Les mutants M5, M6 bis et M8 de l'implémenteur n'ont pas été rejoués : la consigne demandait mes propres mutants.
- La paire de captures du tiroir à deux questions (`cmp/tiroir-2q.jpg`) n'a pas été inspectée à l'œil. Le contenu est vérifié par texte (`testeur-site2-tiroir.log`), et le cas à une question par différence de pixels (0).
- Aucune comparaison à la référence `/refonte/` en passe 2 : la passe 1 l'a faite à `2ebfabd`, et la géométrie et les pixels sont inchangés depuis (§ 3).

---

## 6 · Rejouer

```bash
O=/root/.dh_orch_vague2/testeur-site2-outils
$O/copie.sh <scenario>                       # copie de testeur-site2-base (git archive HEAD + dist)
$O/mutants.sh r2 | r3 | r5                   # mutants CSS / JSON + introuvable / tarifs
CHROMIUM_PATH=… node $O/double-envoi.mjs <dist>   # reprise 1 en navigateur (S1, S2, S3)
CHROMIUM_PATH=… node $O/captures.mjs && $O/cmp.sh # captures et différence avec la passe 1
```

## 7 · État du worktree en fin de revue

Aucune commande git hors de `/root/workspace/wt-vitrines`. Aucun fichier de code ni de test modifié dans le worktree. Le seul ajout est ce fichier, commité et **non poussé**. Les copies `testeur-site2-*` restent sous `/root/.dh_orch_vague2/` pour pouvoir rejouer. Aucun serveur ni navigateur ne reste lancé.
