# Revue indépendante — composants vitrines (refonte 2026)

**Testeur :** testeur-site (n'a pas vu le travail se faire) · **Date :** 24/10/2026
**Branche revue :** `claude/vitrines-2026`, HEAD `2ebfabda4e41a9221badec0a4e8830e6cdefb5df` (8 commits, 66 fichiers depuis `origin/refonte-2026` = `4f51145`)
**Discipline :** `dh-discipline-de-preuve`. « Vérifié » = exécuté par moi, sortie citée. « Lu » = lu, non exécuté.
**Aucune** commande git hors du worktree ; `/var/www/*` lu seulement ; aucun appel réel au concierge (intercepté), aucun envoi de formulaire, aucun modèle payant.
Journaux bruts (VPS) : `/root/.dh_orch_vague2/testeur-site-*.log`, scripts : `/root/.dh_orch_vague2/testeur-site-outils/`, captures : `/root/.dh_orch_vague2/testeur-site-captures/`.

---

## 0 · Verdict : **À REPRENDRE**

Le gros du travail tient à la mesure : tous les tests verts à HEAD, rouges au parent, la ligne du 30/09 est bien dans la référence re-extraite **et** dans le rendu, les chiffres et rattachements SDS sont exacts, la géométrie reproduit la référence au pixel près hors tarifs, poids et premier rendu confirmés, console vide. Les écarts volontaires déclarés reposent sur des défauts de la référence que j'ai **re-mesurés et confirmés**.

Mais trois points interdisent « conforme » (détail § 5) :

1. **Repli silencieux introduit** : une question tapée dans une boîte pendant que Sophie répond encore est **avalée** — champ vidé, aucune requête, aucun message (preuve § 4.4).
2. **T2 (boîtes de vitrine) ne prouve pas ce qu'il annonce** : une mention IA rendue invisible (`opacity: 0`) dans les quatre boîtes laisse ces quatre contrôles **verts** (mutant M5, § 2.3).
3. **T6 « chiffres mesurés » est auto-référent** : il compare la page au JSON produit par l'implémenteur, pas aux SDS ; un chiffre faux dans le JSON passe **vert** (mutant M6 bis, § 2.3). Les chiffres actuels sont justes (je les ai re-mesurés autrement, § 4.2) : c'est le dispositif de vérification qui est faible, pas la donnée.

---

## 1 · Tests relancés par moi — avant (parent `4f51145`) / après (HEAD)

Parent construit hors du worktree (`git worktree add --detach /root/.dh_orch_vague2/testeur-site-parent 4f51145`, `npm ci`, `vite build`), retiré en fin de revue (`git worktree remove`).

### 1.1 HEAD — `testeur-site-head.log`

```
$ npm run build            → dist/assets/index-DM-_HzE3.js 363.61 kB · index-DVQBce69.css 74.53 kB   BUILD_EXIT=0
$ npm run typecheck        → TYPECHECK_EXIT=0
$ npm run test:parite
  OK   /legal [fr]          59 lignes identiques
  OK   /legal [en]          59 lignes identiques
  OK   /cgv [fr]            70 lignes identiques
  OK   /cgv [en]            70 lignes identiques
  OK   /privacy [fr]        67 lignes identiques
  OK   /privacy [en]        67 lignes identiques
OK : les deux sites disent exactement la meme chose.          PARITE_EXIT=0
$ npm run test:routes
  OK    /privacy [fr] : 200, 2 mention(s) presente(s)      (… /legal 4, /cgv 1, FR et EN, tous OK)
  OK    Atelier : les 6 liens SDS sont presents
  OK    SDS https://digital-humans.fr/sds-preview/146.html : 200   (… 148, 176, 177, 178, 179 : 200)
OK : tous les controles passent.                              ROUTES_EXIT=0
$ npm run test:vitrines
OK : 73 controles.                                            VITRINES_EXIT=0
```

### 1.2 Parent — `testeur-site-avant.log`

```
A. tests du parent sur le build du parent
  TYPECHECK_EXIT=0
  parite (reference _contenu-source du 17/09) : OK / [fr] 240, / [en] 244, /legal 59, /cgv 70, /privacy 66 (FR+EN)   PARITE_EXIT=0
  routes : 6 routes OK, « Atelier : les 6 liens SDS sont presents »                                              ROUTES_EXIT=0
B. tests de HEAD sur le build du parent
  parite (reference re-extraite)  : ECHEC /privacy [fr] 29 ecart(s) sur 67 lignes (1er : ligne 38), idem [en] ;
                                    /legal et /cgv OK                                  PARITE_HEAD_SUR_PARENT_EXIT=1   (testeur-site-parite-rouge.log)
  routes : ECHEC /privacy [fr] : absent ["Conversations Free : quatre-vingt-dix jours, puis suppression automatisée."]
           ECHEC /privacy [en] : absent ["Free conversations: ninety days, then automated deletion."]  ROUTES_HEAD_SUR_PARENT_EXIT=1
  vitrines : ECHEC : 13 controle(s) en echec sur 21.   (T1, T2×9, T3, T4, T6 en échec ; T5 ×8 OK)  VITRINES_HEAD_SUR_PARENT_EXIT=1
```

| | avant (`4f51145`, mesuré) | après (HEAD, mesuré) |
|---|---|---|
| build / typecheck | 0 / 0 | 0 / 0 |
| `test:parite` (tests du parent) | OK 8 routes, contre la référence du 17/09 | OK 6 routes légales contre la référence re-extraite (59/70/67) |
| `test:parite` de HEAD sur le parent | ECHEC /privacy FR+EN, 29 écarts chacun | — |
| `test:routes` | OK (6 liens présents, non résolus) | OK, ligne du 30/09 FR+EN, 6 liens présents **et** 200 |
| `test:vitrines` | 13 échecs / 21 | 73 OK |

Les chiffres du rapport (§ 1.1 à 1.4) sont **confirmés** à l'identique (29 écarts, 13/21, 73).

---

## 2 · Tests ajoutés ou modifiés — assertion lue, rouge au parent, contrôle négatif

### 2.1 Tests existants modifiés

| Test | Modification | Lecture de l'assertion | Verdict |
|---|---|---|---|
| `test:parite` (`a550e95`) | `ROUTES = ['/legal','/cgv','/privacy']` (retire `/`) | Comparaison ligne à ligne inchangée ; seul le périmètre se réduit. | **Affaiblit, dans ce que la mission autorise** (« vert pour le contenu textuel des routes légales »). La compensation annoncée (« contenu commun de l'accueil contrôlé par T6 ») est **partielle** : T6 vérifie 5 chaînes de tarifs **en FR seulement**, ni l'anglais, ni les puces, ni les textes projets/agents repris du site en ligne. |
| `test:parite` (`0b13bdf`) | référence écrite dans `.reference/` (ignoré) au lieu de `/tmp` ; `_contenu-source/legal_data.js` remplacé par la re-extraction | Prouve : rouge au parent (29+29 écarts), vert à HEAD. | **Renforce** (la référence du 17/09 était périmée). |
| `test:routes` (`14a365c`, `a550e95`) | + ligne du 30/09 FR/EN ; + clic sur chaque onglet de `#atelier` pour accumuler le HTML ; + `fetch` réel des 6 SDS, 200 exigé, réseau injoignable = échec | Prouve ce qu'il annonce. Contrôle négatif rejoué : `curl …/sds-preview/999.html -> 404` (`testeur-site-parite-rouge.log`). | **Renforce.** |
| `serveur-statique.mjs` | type `.webp` | — | neutre |

### 2.2 Référence légale re-extraite (point d'attention de l'orchestrateur)

```
$ python3 outils/extraire-bundle.py /var/www/dh-preview/apercu-recent/index.html /root/.dh_orch_vague2/testeur-site-extraction
bundle : /var/www/dh-preview/apercu-recent/index.html 16207386 octets        (stat : modifié 2026-09-30 14:05:20)
  legal_data.js              32930 o  7373306033260e4d  identique      (les 6 autres ressources : identique)
$ cmp <extraction>/legal_data.js _contenu-source/legal_data.js && echo "CMP legal_data identique"
CMP legal_data identique
$ grep -c "quatre-vingt-dix jours, puis suppression" <extraction>/legal_data.js _contenu-source/legal_data.js content/legal.json .reference/a1b2c3d4-…js
… :1 (dans les quatre fichiers)
$ grep -o "<strong>Conversations Free</strong>[^\"]*" <extraction>/legal_data.js
<strong>Conversations Free</strong> : quatre-vingt-dix jours, puis suppression automatisée.
<strong>Free conversations</strong>: ninety days, then automated deletion.
$ python3 outils/decouper-legal.py --verifier
legal.json identique a la decoupe : True
$ git diff 4f51145 HEAD -- _contenu-source/legal_data.js content/legal.json | grep '^[+-]'    → +2 lignes dans chacun, aucune suppression
```

**Dans le rendu** : `test:routes` à HEAD exige le texte littéral dans `document.body.innerText` de `/privacy` → `OK /privacy [fr] : 200, 2 mention(s)` (FR et EN) ; au parent → `ECHEC … absent [...]`. Vérifié.

### 2.3 Nouveaux tests (`tests/vitrines.mjs`) — rouges au parent et mutants ciblés

Au parent, les échecs sont des **exceptions** (pas de `#who`) : rouge, mais non discriminant. J'ai donc ajouté des **mutants** sur une copie `git archive HEAD` hors dépôt (`testeur-site-outils/mutants.sh`, `mutant7.sh`, journaux `testeur-site-mutants.log`, `testeur-site-mutant7.log`), chacun lancé avec le `tests/vitrines.mjs` de HEAD.

| Test | Assertion lue | Rouge au parent | Mutant ciblé (sortie brute) | Verdict |
|---|---|---|---|---|
| T1 champ Sophie | `INPUT` non `readonly`, placeholder par onglet, Entrée → requête interceptée avec la question, réponse affichée, champ vidé, bouton + champ vide → question suggérée | oui (exception) | M1 `readOnly` : `ECHEC T1 #who : vrai <input> modifiable — INPUT readonly` | **prouve** |
| T2 mention IA, première image | mention dans la fenêtre, opacité 1 sur toute la chaîne, non recouverte, à la 1re image | oui (×8) | M5 (`opacity:0` sur la mention des boîtes) : `ECHEC T2 1488px [fr] intro vue …`, idem `[en]`, `390px [fr]`, `[en]` | **prouve**, avec une réserve : à 390 px intro vue, repli sur « au premier contact » (voir § 5, point 4) |
| T2 boîtes `#who/#process/#agents/#atelier` | `present && !recouvert` seulement | oui (exception) | **M5 : les 4 contrôles restent OK** alors que la mention est à `opacity: 0` | **ne prouve pas** « visible » → reprise 2 |
| T3 bandeau | piste `dh-marquee` infinie, deux moitiés identiques, couture ≤ 1 px, « Le gain »/« Ce qu'on garantit », lien Journal, `animationPlayState === 'paused'` au survol | oui | M3 (`padding-right:7px`) : `ECHEC T3 #who : sans couture … — 3.70 px` (×4) ; M4 (sans `:hover`) : `ECHEC T3 #who : pause au survol — running` | **prouve** |
| T4 reduce | sans reduce : transforms changent, ≥ 5 bandeaux ; avec reduce : transforms égaux, `getAnimations()` vide | oui | M2 (branche `reduit` + règle CSS neutralisées) : `ECHEC T4 reduce : fond et boite immobiles…` et `ECHEC T4 reduce : aucune animation CSS…` | **prouve** |
| T5 console | aucun `console.*`, `pageerror`, `requestfailed`, HTTP ≥ 400, 8 combinaisons, page entière parcourue | **non** (déjà vide au parent, dit dans le rapport) | M7 (`console.warn`) : `ECHEC T5 …` sur les **8** combinaisons, `ECHEC : 8 controle(s) en echec sur 73.` | **prouve** ; ne peut pas être rouge au parent, contrôle négatif rejoué |
| T6 tarifs / CTA / démo | 5 chaînes FR, pas de bascule, lien signup, 0 `mailto`, TODO visible, bouton désactivé, aucune requête non-GET | oui (exception) | — (lu) | prouve, périmètre FR seulement |
| T6 Atelier « chiffres mesurés » | `href` = `sds-preview/<id>` attendu codé en dur ✔ ; chiffres : présents dans le texte **tels que dans `content/sds-chiffres.json`** | oui (exception) | **M6 bis** (JSON 146 `flux` 27 → 28, page et test lisant le même JSON) : `OK T6 Atelier LogiFleet -> SDS 146, chiffres mesures` · `OK : 73 controles.` | **ne prouve pas** « mesurés » → reprise 3 |

---

## 3 · Captures et rendu — comparés à la référence

Référence servie localement depuis `/var/www/dh-preview/refonte/` (lecture seule, `sha256 50f21db2…`, identique à l'en-tête de `content/reference-vitrines.ts` ; la re-découpe par `outils/decouper-reference.py` redonne le fichier à l'octet : `cmp` → identique). Serveurs Node éphémères (port 0, fermés par le script).

**128 captures** `ref-*` / `head-*` × {1488, 390} × {fr, en} × {dark, light} × 8 sections, plus pages entières FR sombre (`testeur-site-captures.log`, `testeur-site-captures/`), et paires côte à côte `cmp/`. **Comparaison par différence de pixels** (`compare -metric AE -fuzz 8%`) et par texte de section ; **pas d'inspection à l'œil** (pas de transfert d'image hors du VPS) : les paires sont prêtes pour Sam dans `testeur-site-captures/cmp/`.

### 3.1 Géométrie (DOM, haut · largeur · hauteur de section) — identique hors tarifs

```
ref-1488-fr-dark  [top,90,1488,1052] [who,1142,…,960] [process,2264,…,960] [agents,3224,…,960] [atelier,4183,…,960] [pricing,5143,…,811] [faq,5954,…,720] [cta,6674,…,442]
head-1488-fr-dark [top,90,1488,1052] [who,1142,…,960] [process,2264,…,960] [agents,3224,…,960] [atelier,4183,…,960] [pricing,5143,…,944] [faq,6087,…,720] [cta,6807,…,442]
ref-390-fr-dark   top 160/996 · who 1156/1670 · process 2989/1670 · agents 4659/1670 · atelier 6329/1636 · pricing 7965/2216 · faq 828 · cta 559
head-390-fr-dark  top 160/996 · who 1156/1670 · process 2989/1670 · agents 4659/1670 · atelier 6329/1636 · pricing 7965/2464 · faq 828 · cta 559
```
Identique dans les 8 combinaisons, sauf `#pricing` (811 → 944 ; 2216 → 2464 / 2362 EN) : contenu du site en ligne, déclaré.

### 3.2 Pixels différents par section (fuzz 8 %)

```
1488-fr-dark   top 8.6%  who 0.8%  process 0.8%  agents 1.2%  atelier 5.2%  pricing 10.5%  faq 0.3%  cta 0.1%
1488-fr-light  top 3.6%  who 0.8%  process 0.8%  agents 1.2%  atelier 5.0%  pricing  9.8%  faq 0.2%  cta 0.1%
1488-en-dark   top 7.0%  who 0.8%  process 0.8%  agents 1.2%  atelier 4.7%  pricing  9.9%  faq 0.2%  cta 0.1%
390-fr-dark    top 10.6% who 1.7%  process 2.3%  agents 3.1%  atelier 4.3%  pricing  9.8%  faq 4.4%  cta 3.9%
390-fr-light   top 17.3% who 1.7%  process 2.3%  agents 3.1%  atelier 4.3%  pricing  9.3%  faq 4.3%  cta 3.8%
```
Lecture : `who`/`process`/`faq`/`cta` ≈ identiques (le résidu suit la phase du bandeau animé). `top` : carrousel 3D animé (phase) et, à 390 px, boîte du héros **34 px plus haute** (mention à 880 px contre 914 dans la référence) parce que le prompt du héros, texte sur plusieurs lignes dans la référence, est devenu un champ d'une ligne. `atelier`/`agents` : corrections de contenu déclarées. `pricing` : contenu du site en ligne.

### 3.3 Texte par section (référence vs HEAD, `testeur-site-textes.log`)

```
[fr|en] nav, who, process, faq, cta, pile « Ce que l'équipe maîtrise » : IDENTIQUE
[fr] top     seulement ref : "Décrivez votre besoin Salesforce — ou choisissez un cas ci-dessus."   (devenu placeholder, déclaré)
[fr] agents  ref « Cheffe de projet · pilote » / head « Cheffe de projet · L'Orchestratrice » ; article Journal « Bienvenue sur le Blog Digital Humans ! »
[en] agents  head : "Bienvenue sur le Blog Digital Humans !" (titre FRANÇAIS sur la page anglaise)
[fr] atelier ref « 1 200 véhicules », « 9 flux » / head « 320 véhicules », « 27 flux » ; « Live in production, week 11 · 0 critical bugs » (anglais en FR, déclaré § 3 du rapport)
[fr] footer  ref contact@ / head hello@ (déclaré)
```

### 3.4 Console

Référence : 3 entrées sur chacune des 8 combinaisons (`console.error … "{{ themeIcon }}"`, `console.error … "{{ e.d }}"`, `console.verbose Password field…`). HEAD : **0** sur les 8 (`bruit(0)`), et T5 vert. Vérifié.

### 3.5 `prefers-reduced-motion`

T4 vert à HEAD, rouge sur le mutant M2 (§ 2.3). Parallaxe : même formule que la référence (`p*26` fond, `p*-16` boîte, `p = (centre − h/2)/h`), lue dans `index.html` l. 755-790 de la référence et dans `crochets.ts`. Vérifié par T4 (émulation `reducedMotion`).

### 3.6 Poids et premier rendu (`testeur-site-sondes.log`, 5 chargements à froid, 1488×900, cache désactivé, serveur local sans compression)

| | octets transférés | requêtes | FCP (ms) | « texte > 200 car. » (ms depuis `goto`) |
|---|---|---|---|---|
| en ligne (`apercu-recent`) | 16 209 793 | 26 | 80–104 (coquille) | 1 660–1 935 |
| référence `/refonte/` | 1 173 417–1 278 349 | 23 | 520–592 (un tirage à 3 396) | 589–676 (un à 4 800) |
| portage (parent) | 2 136 711 | 20 | 460–824 | 477–965 |
| **vitrines (HEAD)** | **909 834** | 15 | **352–416** | **378–530** |

Ventilation HEAD : Script 363 847, Stylesheet 76 299, Image 300 661, Font 165 612, Document 3 415. Les octets du rapport sont confirmés **à l'octet** (909 834 ; 2 136 711) ; mes temps sont du même ordre (VPS chargé : load 5). Les chiffres de la mission (« portage ~0,5 Mo / ~0,45 s ») **ne se retrouvent pas** : 2,14 Mo mesurés pour le portage (dont 1 599 585 o d'images) — l'implémenteur l'avait dit.

### 3.7 Écarts volontaires déclarés — fait vérifié, classement

| Écart | Fait avancé | Ma mesure | Classement |
|---|---|---|---|
| Couture du bandeau | 4,8–5,1 px dans la référence | `ref couture 4.8` ; `head couture 0.2` (`sonde.mjs`) | **justifié par un défaut mesuré** (la mission exige « boucle sans couture ») |
| Pause au survol | inopérante dans la référence (calque par-dessus) | ref : `etat running, sousSouris DIV., dansPiste false` ; head : `paused, SPAN.v-bd-txt, dansPiste true` | **justifié** (la mission exige « pause au survol ») |
| Contraste du bandeau en clair | 1,00 dans la référence | titre ref clair `rgb(10,10,11)` sur dégradé `rgba(10,10,11,.97)` ; fond moyen capturé `srgb(11%,11%,11%)` ; contraste calculé **1,05** ; head : `rgb(245,242,236)` → **16,9** | **justifié** (illisible mesuré) |
| Mention IA de l'intro dès la 1re image | 2,9 s dans la référence | ref : opacité `0` jusqu'à 3 239 ms, `0.94` à 3 696 ms ; head : `1` dès 263 ms | **justifié par la mission** (test « mention IA visible au premier rendu ») ; à signaler à Sam car la référence validée différait |
| Flèche de la boîte → Sophie | la référence ouvrait la modale démo | ref l. 112 et 162 : `onClick="{{ openDemo }}"` ; le prompt du héros y était un `<span>` figé (l. 110) | conséquence directe du point 3 de la mission (« vrai champ de saisie ») ; **réinterprétation mineure à soumettre à Sam** (comportement nouveau) |
| Projets → SDS | 4 rattachements faux dans la référence | `<title>` : 176 Pipeline Tuner, 177 Grid Foresight, 178 Omnichannel Loop, 179 Claim Resolver ; référence l. 550-553 : Claim Resolver 176, Pipeline Tuner 177, Grid Foresight 178, Omnichannel Loop 179 | **justifié** (fait vérifié) |
| Chiffres de l'Atelier | mesurés dans les SDS | ma mesure indépendante (grep, autre méthode) : 146 25/58/17/27 · 148 16/36/16/12 · 176 25/54/16/20 · 177 26/67/34/17 · 178 30/95/26/0 · 179 22/45/13/14 = `content/sds-chiffres.json` ; TdM « Custom Objects (17) » dans les 6 fichiers ; référence : LogiFleet `stats: [25, 58, 17, 9]` | **justifié** |
| Briefs / secteurs / gains = site en ligne | « 1 200 » vs « 320 » | `content/projects.ts` l. 12-14 « 320 » ; référence l. 548 « 1 200 véhicules » | **justifié** (source = site en ligne) ; choix de règle « le site en ligne fait foi » = **à confirmer par Sam** |
| Rôle/citation des agents = site en ligne | « 1 247 projets » ajouté par la référence | référence l. 519 (Marcus) ; head affiche les lignes du site en ligne | idem : justifié sur le fait, **règle à confirmer par Sam** |
| Articles du Journal réels ; Emma/Elena/Lucas omis | aucun article pour eux | `grep -l "by/<auteur>" /var/www/journal/*.html` : emma 0, elena 0, lucas 0 (autres : 3–4) ; 8 URL + 7 couvertures : `curl` → 200 | **justifié** ; mais le titre français s'affiche sur la page anglaise (§ 3.3) → **à soumettre à Sam** |
| Navigation non collante reproduite | `navTop = -3000` | ref et head : `position sticky, top -3000` après `scrollTo(0,3000)` | reproduit tel quel, **attend Sam** (déclaré § 5) |
| 36 visuels, 1 856 422 o | « 941 Ko » faux | `du -sb uploads` → 1856422 ; `diff` des `sha256sum` uploads/ vs public/visuels/ → **36 VISUELS IDENTIQUES** ; largeurs 900×11, 1200×15, 1400×5, 1520×4, 1800×1 | **confirmé** |

Observation sans reprise : les prompts des boîtes sont **tronqués** (champ d'une ligne, 16,5 px) : 24 sur 31 à 1488 px, 29 sur 31 à 390 px (`placeholder.mjs` ; ex. `#who[4] texte 377px > champ 212px`). Dans les vitrines c'est **fidèle à la référence** (même `<input>` l. 160, même police, même largeur — lu, non mesuré séparément). Dans le héros à 390 px, la référence montrait le prompt entier (span multi-ligne) : les 5 prompts du héros y sont désormais coupés. Le brief A.1 fait de la réécriture du prompt « le comportement qui fait la différence » : **à soumettre à Sam**.

---

## 4 · Affirmations du rapport — vérifiées / non vérifiées / fausses

### 4.1 Vérifiées (exécutées par moi)
Rapport § 1.1–1.4 (chiffres des tests, rouge au parent, 29 écarts, 13/21, 73) ; § 1.2 (empreintes du bundle, diff de 2 lignes) ; § 1.5 géométrie des sections ; § 1.6.1–1.6.5 ; § 1.8 octets ; § 2 (36 fichiers, « A.1 bis » absent : `grep -n " bis" docs/*.md` → seulement MISSION et RAPPORT ; TdM figée ; défauts de la référence) ; § 3 SDS 178 « Flows (0) » ; CTA signup `curl → 200` ; 0 `mailto` (T6).

### 4.2 Non vérifiées par moi (lu seulement)
Positions des nœuds et de la boîte au pixel (§ 1.5 : je n'ai mesuré que les sections + la différence de pixels) ; page d'inscription « une case de consentement » (le rapport le dit lui-même « lu, non exécuté »).

### 4.3 Fausses
Aucune affirmation chiffrée fausse trouvée. Une affirmation **trop large** : « le contenu commun de l'accueil (tarifs, liens SDS, chiffres) est contrôlé par `tests/vitrines.mjs` (T6) » (commit `a550e95`, rapport § 1.3) — tarifs : FR seulement ; chiffres : contrôlés contre le JSON, pas contre les SDS (M6 bis).

### 4.4 Replis silencieux
- **Question avalée** (`testeur-site-outils/double-envoi.mjs`, concierge intercepté avec réponse retardée de 2 s, question A envoyée, tiroir fermé, question B tapée + Entrée) :
  ```
  requetes envoyees au concierge : ["Question A"]
  messages utilisateur affiches   : ["Question A"]
  champ apres envoi B             : ""
  ```
  Cause (lu) : `BoiteSophie.envoyer` vide le champ puis émet `dh:sophie` ; `SophieChat.sendMessage` fait `if (!text || sending) return;` sans rien signaler. → reprise 1.
- Formulaire démo : **pas** de faux envoi (bouton `disabled`, TODO visible, aucune requête non-GET : T6). Lettre mensuelle : champ et bouton `disabled`, TODO en `aria-label`. Pas de `mailto` caché. Chiffres : non inventés (§ 3.7). Historique Sophie « silent fail » : préexistant (portage), non introduit ici.

---

## 5 · Reprises (précises et actionnables)

1. **`components/vitrine/BoiteSophie.tsx` + `components/site/SophieChat.tsx` — question avalée.** Constat § 4.4 (1 requête pour 2 questions, champ vidé). Attendu : ne jamais perdre une question ; soit mise en file et envoi après la réponse en cours, soit refus visible (champ non vidé + message « Sophie répond encore »). Ajouter un test rouge d'abord (réponse retardée, deux envois) qui exige 2 requêtes ou un refus visible.
2. **`tests/vitrines.mjs` T2, bloc « chaque boîte de vitrine porte la mention » — assertion trop faible.** Constat : mutant M5 (`opacity: 0` sur `.v-mention`) → les 4 contrôles `T2 #who/#process/#agents/#atelier` restent OK. Attendu : appliquer le même prédicat `VISIBLE` (fenêtre, opacité 1 sur la chaîne, `visibility`, non recouvert) après `scrollIntoView`, et le prouver rouge sur M5.
3. **`tests/vitrines.mjs` T6 « chiffres mesurés » — auto-référent.** Constat : M6 bis (JSON muté, page mutée) → `OK T6 Atelier LogiFleet -> SDS 146, chiffres mesures`. Attendu : le test (ou un test dédié) recalcule les chiffres depuis `/var/www/digital-humans.fr/sds-preview/<id>.html` (ou la page servie) et compare **au JSON** ; échec si une SDS est introuvable (pas de repli). Le libellé doit dire ce qu'il prouve.
4. **`docs/RAPPORT_VITRINES_2026.md` § 5 — critère non tenu à 390 px non soumis à Sam.** Constat : à 390×844, intro déjà vue, la mention IA est sous la ligne de flottaison (head : top 880 ; référence : 914) ; T2 se replie alors sur « au premier contact ». C'est dit au § 1.4 mais absent de la liste « Attend une décision de Sam ». Attendu : l'y inscrire (option : remonter la boîte du héros sur mobile) — le critère de la mission est « visible au premier rendu ».
5. **`docs/RAPPORT_VITRINES_2026.md` § 1.3 et message de `a550e95` — formulation à corriger** : la couverture compensatoire de T6 est partielle (tarifs FR seuls, aucun texte EN de l'accueil, chiffres contre le JSON). Soit élargir T6 (tarifs EN, puces, lignes projets/agents issues de `content/projects.ts`/`agents-lignes.json`), soit le dire tel quel.

### À soumettre à Sam (pas des reprises)
- Flèche/Entrée de la boîte → Sophie (la référence ouvrait la démo).
- Règle « le site en ligne fait foi sur le contenu » (briefs, rôles, citations, tarifs) face à « reproduire, ne pas réinterpréter ».
- Titre d'article du Journal en français sur la page anglaise (Journal FR seulement).
- Prompts tronqués dans les champs (fidèle à la référence dans les vitrines ; nouveau dans le héros à 390 px).
- Points déjà listés par l'implémenteur au § 5 de son rapport (Email-to-Case, nav collante, affirmations FAQ non vérifiées, lettre mensuelle, test B.3.4).

---

## 6 · État du worktree en fin de revue

```
$ git -C /root/workspace/wt-vitrines worktree list
/root/workspace/digital-humans-website  4f51145 [refonte-2026]
/root/workspace/wt-vitrines             2ebfabd [claude/vitrines-2026]
```
Worktree temporaire du parent retiré ; copie mutante supprimée ; aucun serveur laissé (serveurs Node internes aux scripts, fermés). Seul ajout au dépôt : ce fichier (commit ci-dessous, non poussé). `dist/` et `.reference/` régénérés par mes runs (ignorés par `.gitignore`).
