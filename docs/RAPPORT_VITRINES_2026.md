# Rapport — composants vitrines (refonte 2026)

**Date :** 24/10/2026 · **Branche :** `claude/vitrines-2026` (depuis `origin/refonte-2026`, `4f51145`)
**Mission :** `docs/MISSION_VITRINES_2026.md` · **Discipline :** `dh-discipline-de-preuve`
**Aucun déploiement**, rien écrit sous `/var/www`, aucun service touché, aucun appel à un modèle payant.

Journaux bruts : `/root/.dh_orch_vague2/impl-site-*.log` (VPS). Chromium des tests :
`CHROMIUM_PATH=/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome` passé en variable
d'environnement ; la valeur par défaut codée dans les tests (`/opt/pw-browsers/chromium`) **n'a pas été changée**.

---

## 1 · Fait, avec la preuve

### 1.1 État « avant » mesuré sur `4f51145` (après `npm ci` et `vite build`)

Journal `impl-site-avant.log` :

```
  OK   / [fr]               240 lignes identiques
  OK   / [en]               244 lignes identiques
  OK   /legal [fr]          59 lignes identiques      (idem en)
  OK   /cgv [fr]            70 lignes identiques      (idem en)
  OK   /privacy [fr]        66 lignes identiques      (idem en)
OK : les deux sites disent exactement la meme chose.          PARITE_EXIT=0
  OK    /legal [fr] : 200, 4 mention(s) presente(s)   (… 6 lignes OK)
  OK    Atelier : les 6 liens SDS sont presents               ROUTES_EXIT=0
```

**Ce vert était faux en partie** : la référence de `test:parite` était `_contenu-source/` du 17/09,
alors que le bundle servi a changé le 30/09 (voir 1.2).

### 1.2 Politique de confidentialité : référence re-extraite du bundle servi

`outils/extraire-bundle.py` décode le manifeste de `/var/www/dh-preview/apercu-recent/index.html`
(lecture seule) et compare aux sources du dépôt :

```
bundle : /var/www/dh-preview/apercu-recent/index.html 16207386 octets
  header_hero.js              5362 o  3d975686906128a4  identique
  site_racine.js              1991 o  edec5a25df35a9eb  identique
  sophie_chat.js              7954 o  c96c22077a500af6  identique
  benefits_howitworks.js     16979 o  86815bb4a4225862  identique
  app_contenu.js             23401 o  4b304d22d1298f2b  identique
  legal_data.js              32930 o  7373306033260e4d  DIFFERE (_contenu-source : 57207334da674e69)
  gabarit_page.html          73858 o  c5c22c85e546fa23  identique
$ diff _contenu-source/legal_data.js <re-extraction>
307a308 >  "<strong>Conversations Free</strong> : quatre-vingt-dix jours, puis suppression automatisée.",
377a379 >  "<strong>Free conversations</strong>: ninety days, then automated deletion.",
```

- **Rouge d'abord** (`impl-site-parite-rouge.log`), référence re-extraite, dépôt inchangé :
  `ECHEC /privacy [fr] 29 ecart(s)` et `[en]`, premier écart ligne 38 = la ligne du 30/09 ; les 6 autres routes OK.
- `content/legal.json` régénéré par **découpe** (`outils/decouper-legal.py`, pas de saisie) : +2 lignes.
- **Ligne présente dans la référence re-extraite servie au test** :
  ```
  $ grep -o "…quatre-vingt-dix…|…ninety…" .reference/a1b2c3d4-e5f6-4789-9abc-def012345678.js
  <strong>Conversations Free</strong> : quatre-vingt-dix jours, puis suppression automatisée.
  <strong>Free conversations</strong>: ninety days, then automated deletion.
  ```
- **Ligne présente dans le rendu** : `test:routes` l'exige désormais littéralement (FR et EN) ;
  sur le build du parent : `ECHEC /privacy [fr] : absent ["Conversations Free : quatre-vingt-dix jours…"]` (et EN) ;
  après : `OK /privacy [fr] : 200, 2 mention(s) presente(s)` ; `test:parite` : `/privacy 67 lignes identiques` (66 avant).

### 1.3 `test:parite` et `test:routes` avant / après

| | avant (`4f51145`) | après (HEAD) |
|---|---|---|
| `test:parite` | OK sur 8 routes, **contre une référence périmée** | OK sur `/legal`, `/cgv`, `/privacy` FR+EN contre la référence re-extraite (59/70/67 lignes) |
| `test:routes` | OK, 6 liens **présents** (non résolus) | OK : 6 routes légales, ligne du 30/09, 6 liens présents **et résolus en HTTP 200** |

Changements des tests, dits : `test:parite` ne compare plus `/` (l'accueil change par mission) et écrit sa référence dans `.reference/` (ignoré)
au lieu de `/tmp/dh-reference` ; `test:routes` lit les liens SDS onglet par onglet et fait une vraie
requête (contrôle négatif : `sds-preview/999.html -> 404`). Sur le build parent, `test:routes` adapté
trouve toujours les six liens (neutre pour l'ancien accueil). Journal final : `impl-site-final.log`.

**Correction après revue 1 (reprise 5).** J'avais écrit ici, et dans le message du commit `a550e95`,
que « le contenu commun de l'accueil est contrôlé par `test:vitrines` T6 ». C'était trop large : à
`2ebfabd`, T6 ne vérifiait que cinq chaînes de tarifs **en FR**, et les chiffres contre le JSON, pas
contre les SDS. Le message de commit n'est pas réécrit (pas de réécriture d'historique) ; la
couverture réelle est désormais celle de la section « Reprises après revue 1 » : tarifs FR et EN
(4 cartes, 15 puces, chaque texte = littéral des sources du bundle servi), secteur et brief des
6 projets, rôle et citation des 11 agents, chiffres recalculés depuis les six SDS publiées. Ce qui
reste hors contrôle automatique : les textes repris de la référence (rôles, étapes, FAQ, héros), qui
n'existent pas sur le site en ligne.

### 1.4 Nouveaux tests (`npm run test:vitrines`, `tests/vitrines.mjs`) — rouges d'abord

| | Build parent `4f51145` (`impl-site-controles.log`) | HEAD (`impl-site-final.log`) |
|---|---|---|
| T1 champ Sophie fonctionnel | **ECHEC** | 11 OK |
| T2 mention IA au premier rendu | **ECHEC** (×9) | 12 OK |
| T3 bandeau présent, bouclé sans couture, pause au survol | **ECHEC** | 20 OK |
| T4 `prefers-reduced-motion` (contrôle intégré sans reduce) | **ECHEC** | 5 OK |
| T5 console vide FR/EN, clair/sombre, 1488 et 390 px | OK (déjà vide) | 8 OK |
| T6 hors référence (tarifs, CTA, démo, Atelier) | **ECHEC** | 17 OK |
| **Total** | `ECHEC : 13 controle(s) en echec sur 21.` | `OK : 73 controles.` |

- **T5 est vert sur le parent** : la console du portage est déjà vide ; ce test ne peut pas être
  « rouge d'abord ». Contrôle négatif : build avec `console.warn("controle negatif T5")` injecté →
  `ECHEC T5 … console.warning: controle negatif T5` sur les **8** combinaisons.
- Contrôles négatifs supplémentaires, mesurés en lançant la suite sur la **référence** elle-même :
  `ECHEC T3 #who : sans couture … — 4.80 px` (4,80 à 5,11 px selon la section) et
  `ECHEC T5 … console.error: <path> attribute d: … "{{ themeIcon }}"`.
- **Défauts de mon propre test, corrigés en cours de route** (pas des réussites) : une attente
  `waitForFunction` dont le prédicat rendait 0 ; `innerText` qui applique `text-transform`
  (« LE GAIN ») ; un survol qui visait le centre d'une piste de plus de 2 000 px, hors du canevas.
- T2 à 390 px, intro déjà vue : la boîte du héros (et sa mention) est **sous la ligne de flottaison**
  à la première image, comme dans la référence. Le test applique alors la formulation du brief A.1
  (« au premier contact avec la boîte ») : défilement instantané jusqu'à la boîte, contrôle à l'image
  suivante, sans attente. Partout ailleurs, la mention est visible dès la première image.
- Aucun appel réel au concierge : `/api/public/concierge/*` est intercepté par le test.

### 1.5 Reproduction de la référence — mesurée, pas estimée

Mesures DOM (`getBoundingClientRect`) de `https://digital-humans.fr/refonte/` servie localement
depuis `/var/www/dh-preview/refonte/` (lecture seule) et de mon build, en FR :

| 1488 px | référence | ce travail |
|---|---|---|
| section `#who` | 0,1142 · 1488×960 | identique |
| masque photo | 6,1318 · 746×678 | identique |
| photo (avant apparition) | 783×712, `scale(1.05)` | identique |
| boîte adaptative | 398,1581 · 332×151 | identique |
| canevas | 756,1318 · 700×712 | identique |
| 4 nœuds | 230×174 en (778,1389) (1071,1373) (883,1663) (1176,1713) | identiques |
| hauteurs des sections nav/héros/vitrines/pile/FAQ/CTA/pied | 90/1052/960×4/163/720/442/348 | identiques |
| tarifs | 811 | **944** (contenu du site en ligne, voulu) |

À 390 px : mêmes égalités (une colonne ; boîte 26,1707 · 330×151 ; canevas 32,2098 · 326×712 ;
nœuds 196×174) ; tarifs 2 216 → 2 464.

Texte : `innerText` de chaque section comparé ligne à ligne (FR et EN). **Identique** pour la nav,
le héros, Pour qui, Méthode, « Ce que l'équipe maîtrise », la FAQ et le CTA. Écarts = uniquement les
corrections de contenu du § 1.6, plus le prompt du héros devenu `placeholder` d'un vrai champ.

### 1.6 Contenu : la référence ne fait pas foi quand le site en ligne ou les SDS la contredisent

Le texte de la référence est **découpé par programme** (`outils/decouper-reference.py` →
`content/reference-vitrines.ts`, lignes recopiées, sha256 de la source dans l'en-tête). Les corrections
sont toutes dans `content/vitrines.ts`, commentées :

1. **Projet → SDS** : la référence rattachait Claim Resolver à 176, Pipeline Tuner à 177, Grid
   Foresight à 178, Omnichannel Loop à 179. Les titres des pages servies disent :
   `176: SDS · Pipeline Tuner`, `177: Grid Foresight`, `178: Omnichannel Loop`, `179: Claim Resolver`
   (= `content/projects.ts`). Correspondance du site en ligne retenue ; T6 la vérifie onglet par onglet.
2. **Chiffres de l'Atelier mesurés** dans les six SDS (`outils/chiffres-sds.py`, corps du document) :
   146 : 25/58/17/27 · 148 : 16/36/16/12 · 176 : 25/54/16/20 · 177 : 26/67/34/17 · 178 : 30/95/26/**0** ·
   179 : 22/45/13/14 (exigences / cas d'usage / objets / flux). La référence affichait 25/58/17/**9** pour
   LogiFleet et des nombres non mesurés ailleurs.
3. **Secteur, brief, gain des projets** = site en ligne (la référence : LogiFleet « 1 200 véhicules » ;
   en ligne : « 320 véhicules »).
4. **Rôle et citation des agents** = site en ligne (la référence ajoutait à Marcus « Pas une fois en
   1 247 projets », absent du site en ligne).
5. **« Ce qu'il écrit »** = article réel du Journal, cliquable (titre, description, couverture
   `blog-admin.digital-humans.fr`), relevé par `outils/articles-journal.py` ; la référence inventait les
   titres. Emma, Elena et Lucas n'ont **aucun article** : l'élément est omis, pas inventé.
6. **Tarifs** = site en ligne (Free « Modèle Nemotron, hébergé en Europe », Pro 79 € et Team 1 490 €
   « Bientôt », Enterprise sur devis, « HT · TVA en sus », pas de bascule). La référence promettait
   « Build & tests par les agents » en Pro, ce que le site en ligne exclut explicitement.
7. Adresse du pied de page : `hello@digital-humans.fr` (site en ligne, texte simple) au lieu de
   `contact@…` (référence).

### 1.7 Points validés par Sam (1 à 7) et hors référence

| Point | État | Détail |
|---|---|---|
| 1. Deux colonnes égales, conteneur 1488 | **fait** | 700 + 24 + 700 px mesurés (padding de section 32 px, comme la référence) |
| 2. Photo sans bordure, débordante, masque radial, saturation +18 % | **fait** | `saturate(1.18)`, masque et débordement −26/−20 px repris |
| 3. Boîte ~330 px centrée, onglets, vrai champ, mention IA, nom en laiton | **fait** | 332×151 ; Entrée/flèche envoient au tiroir Sophie (SophieChat évolué) |
| 4. Canevas angles droits, pointillés, captures SDS, Bézier dans l'ordre | **fait** | mêmes 4 captures que la référence ; connecteurs montés à l'entrée dans l'écran. « Même hauteur exacte » : la référence a 678 (masque) vs 712 (canevas) — reproduit tel quel |
| 5. Bandeau au bas du canevas, boucle sans couture, pause au survol, articles cliquables | **fait** | couture 0 px (référence 4,8–5,1) ; pause réparée (inopérante dans la référence) |
| 6. Ombre deux couches, parallaxe 26/−16, coupée par reduce | **fait** | T4 |
| 7. Même modèle pour les quatre chapitres | **fait** | un composant `Vitrine`, quatre instances |
| Héros (carrousel 3D, boîte centrée) | **fait** | repris de la référence ; boîte à vrai champ elle aussi |
| Tarifs | **fait** | contenu du site en ligne, mise en forme de la référence |
| FAQ | **fait, attend Sam** | texte de la référence, chiffres non vérifiés (§ 5) |
| Pied de page | **fait, partiel** | liens réels ou texte simple ; lettre mensuelle désactivée (§ 5) |
| CTA « Entrer dans le studio » → `app.digital-humans.fr/signup` | **fait** | lien ; page cible 200 (GET) |
| « Demander une démo » → ticket | **attend Sam** | TODO visible, envoi désactivé, aucun mailto (§ 5) |

### 1.8 Poids et premier rendu (`impl-site-poids.log`)

Cinq chargements à froid par cible, même machine (VPS), même serveur statique **sans compression**,
1488×900, Google Fonts réelles :

| | transfert | requêtes | FCP | LCP | texte > 200 car. dans le DOM |
|---|---|---|---|---|---|
| en ligne (bundle `apercu-recent`) | 16 209 793 o | 26 | 100–196 ms | 100–1 780 ms | 1 707–2 624 ms |
| référence `/refonte/` | 1 282 553–1 387 299 o | 25 | 484–684 ms | 484–684 ms | 387–575 ms |
| portage (parent `4f51145`) | 2 136 711 o | 20 | 248–324 ms | 248–324 ms | 187–255 ms |
| **vitrines (ce travail)** | **909 834 o** | 15 | **304–384 ms** | 304–384 ms | 201–284 ms |

Ventilation (ce travail) : JS 363 847 o, CSS 76 299 o, images 300 661 o, polices 165 612 o.
Le FCP du bundle est trompeur (coquille peinte avant la compilation Babel) ; la colonne « texte » est
la plus comparable à la mesure du portage. Les chiffres de la mission (« portage ~0,5 Mo / ~0,45 s »)
ne se retrouvent pas ici : 2,14 Mo mesurés pour le portage, dont 1,6 Mo de portraits PNG.

---

## 2 · Infirmé

- « Les quinze visuels et dix captures… 941 Ko au total » : **36 fichiers, 1 856 422 octets** (copies
  vérifiées identiques par sha256). Largeurs 900 à 1 800 px, sous les 1 920 px du brief A.5.
- « A.1 bis : règles de composition » (mission) : **cette partie n'existe pas** dans
  `BRIEF_REFONTE_SITE_2026.md` (`grep -n bis` : seule occurrence dans la mission).
- La référence n'est pas « l'étalon » sur le contenu : 4 correspondances projet → SDS fausses, des
  chiffres et briefs inventés (§ 1.6).
- Le vert de `test:parite` au départ ne prouvait pas la parité avec le site servi (référence du 17/09).
- Dans la référence : pause au survol inopérante (calque des nœuds par-dessus), couture de 4,8–5,1 px
  dans le bandeau, titres du bandeau illisibles en thème clair (contraste 1,00), deux erreurs console,
  navigation `sticky` qui ne colle pas (`overflow-x:hidden` sur l'ancêtre : `navTop = -3000` après
  3 000 px). Tout est mesuré ; les trois premiers sont corrigés ici, la nav reproduite (§ 5).
- La table des matières des six SDS publiées porte les mêmes nombres (« Custom Objects (17) »,
  « Relationships (26) »…) dans les six documents : elle est figée, seul le corps fait foi.

## 3 · Reste ouvert

- **SDS 178 (Omnichannel Loop)** : section 6.8 vide (« Flows (0) », « Apex Triggers (0) », « 0 UCs » en
  6.11). L'Atelier affiche donc « 0 flux » et la phrase « 0 flux déclaratifs… ». Défaut du document
  publié, pas du site.
- Les lignes « scope » des projets du site en ligne sont en anglais même en FR (« Live in production,
  week 11 · 0 critical bugs ») : reprises telles quelles dans le bandeau de l'Atelier.
- La page d'inscription de l'app porte **une** case de consentement (`consent_cgv`) et
  `CGV_VERSION: "2026-08-30"` (lu dans son JS, non exécuté) ; le brief A.2 demande deux cases. Hors de
  ce dépôt.
- La langue par défaut suit le navigateur (comportement du site en ligne porté) ; la référence démarre
  toujours en FR.
- Six captures copiées ne sont pas utilisées (`sds-usecases`, `sds-erd`, `sds-design`, `art-tests`,
  `art-flux`, `art-exigences2`) : la référence n'utilise que quatre vignettes par genre d'artefact.
  Elles ne sont pas téléchargées par la page.
- Les anciens composants de l'accueil (`components/site/Hero`, `Benefits`, `HowItWorks`, `OurWork`,
  `Pricing`, `CTA`, `OurAgents`) ne sont plus montés ; laissés en place (`Header`, `Footer`,
  `SophieChat` servent aux pages légales).

## 4 · Pas fait, et pourquoi

- **Test B.3.4 (inscription contre l'API réelle)** : créerait des comptes et enverrait des courriels ;
  interdit sans décision (§ 5).
- **Variante « onglets en bas »** (SPEC § 2, Vitrine B) : absente de la référence validée, qui place les
  onglets en haut dans les quatre chapitres.
- **Polices auto-hébergées, référencement par route, sitemap** (brief B.4) : hors mission.
- **Déploiement, mot de passe, `noindex`, bascule** : interdits ici.
- Captures d'écran comparées à l'œil : non faites (transfert d'images trop coûteux depuis le VPS) ;
  remplacées par les mesures DOM du § 1.5. Le testeur indépendant fera les captures.

## 5 · Attend une décision de Sam

0. **Mention IA à 390 px, intro déjà vue (signalé par la revue)** : à la première image, la mention
   du héros est **sous la ligne de flottaison** — haut à 880 px pour une fenêtre de 844 px (914 px
   dans la référence). Le critère de la mission est « visible au premier rendu » ; T2 se replie alors
   sur « au premier contact avec la boîte » (brief A.1). Elle est visible dès la première image à
   1488 px, et à 390 px quand l'intro joue (mention dans l'intro). Option : remonter la boîte du héros
   sur mobile (écart à la référence). Décision à prendre.
1. **Adresse de routage Email-to-Case** : fournie nulle part (dépôt, docs). La modale « Demander une
   démo » affiche un TODO visible, l'envoi est désactivé ; ni mailto, ni faux numéro de ticket (la
   référence affichait « Email-to-Case · DH-2026-0418 » sans rien envoyer).
2. **Navigation collante** : déclarée `sticky` mais inopérante dans la référence ; reproduite telle
   quelle. La rendre collante (`overflow-x: clip`) fixerait 90 px d'en-tête à 1488 px et **160 px à 390 px**.
3. **Affirmations non vérifiées reprises de la référence** (FAQ et étiquettes) : « quarante mille
   fragments », « trois cent seize dépôts », « 1 247 projets », « onze clauses du Pacte », « SDS · 84
   pages », « 12 ADR »… et le pied « © MMXXVI · Sam Hatit Consulting » (raison sociale ?).
4. **Agents sans article** (Emma, Elena, Lucas) : « Ce qu'il écrit » omis. Publier un article, ou
   accepter l'omission.
5. **Lettre mensuelle du pied de page** : champ et bouton désactivés (aucun service d'inscription) ;
   le brief interdit d'ajouter un traceur sans décision.
6. **Écarts volontaires à la référence** (tous mesurés, réversibles) : couture du bandeau, pause au
   survol, contraste du bandeau en clair, mention IA de l'intro visible dès la première image (2,9 s dans
   la référence), flèche de la boîte qui parle à Sophie (la référence ouvrait la modale démo).
7. **Test B.3.4 contre l'API réelle** : autorisation et compte de test à prévoir.
8. **Relevés par la revue, à trancher** : règle « le site en ligne fait foi sur le contenu » (briefs,
   rôles, citations, tarifs) face à « reproduire, ne pas réinterpréter » ; titre d'article du Journal
   en français sur la page anglaise (le Journal n'existe qu'en français) ; prompts tronqués dans les
   champs d'une ligne (fidèle à la référence dans les vitrines, nouveau dans le héros à 390 px, où la
   référence montrait le prompt entier sur plusieurs lignes).

## Reprises après revue 1 (`docs/REVUE_VITRINES_2026.md`, commit `f974e72`)

| Reprise | Commit | Rouge prouvé | Vert |
|---|---|---|---|
| 1. Question envoyée pendant une réponse : avalée (`if (!text \|\| sending) return;`) | test `3e28b50`, correctif `d35496e` | code d'avant : `ECHEC T1b … — ["Question A"]` ×3 (`impl-site-r1-rouge.log`) | `OK T1b` ×4 (`impl-site-r1-final.log`) |
| 2. T2 boîtes vert avec mention à `opacity:0` | `3e28b50` | mutant M5 : `ECHEC T2 #who/#process/#agents/#atelier … "opacite/visibilite"` (`impl-site-mutants.log`) | `OK T2 #… visible (stricte)` ×4 |
| 3. T6 chiffres comparés au JSON seulement | `3e28b50` | mutant M6 bis (JSON 146 flux 27→28) : `ECHEC T6 SDS 146 … SDS {…"flux":27} / JSON {…"flux":28}` ; le contrôle de page, renommé, reste vert, comme il se doit | `OK T6 SDS 146…179` ×6 |
| 4. 390 px, mention sous la ligne de flottaison, absente du § 5 | ce commit | — | § 5, point 0 |
| 5. Couverture du contenu commun surestimée | `3e28b50` + § 1.3 | mutant M8 (tarif, rôle de Sophie, secteur de LogiFleet altérés dans le JS construit) : `ECHEC T6 tarifs [fr] … ["Modèle Nemotron, hébergé aux États-Unis"]`, `ECHEC T6 Atelier [fr] … ["Transport & logistique"]`, `ECHEC T6 L'Ensemble [fr] … ["role:Cheffe de projet · pilote"]` | `OK T6 tarifs/Atelier/L'Ensemble [fr]` et `[en]` |

Correctif de la reprise 1 (`components/site/SophieChat.tsx`) : une question reçue pendant qu'une
réponse est attendue est affichée tout de suite et mise en file, puis envoyée après la réponse en
cours ; l'état « en cours » est tenu par une ref (l'appel vient d'un écouteur d'événement dont la
fermeture voyait un `sending` périmé). Le champ de la boîte est vidé parce que la question est prise
en charge, pas jetée. Le chemin « SDS introuvable » de T6 bis (valeur `null` ou HTTP ≠ 200 → échec)
est lu, non exécuté sur un vrai 404.

Après reprises (`impl-site-r1-final.log`) : `TYPECHECK=0`, `BUILD=0`, `test:parite` OK (`/legal` 59, `/cgv` 70, `/privacy` 67 lignes, FR et EN), `test:routes` OK (six SDS 200), `test:vitrines` **`OK : 89 controles.`** (73 avant les reprises).

## Reprises après revue 2 (`docs/REVUE_VITRINES_2026_PASSE2.md`) — faites par Claude le 24/10, hors orchestration

| Défaut | Commit | Rouge prouvé | Vert |
|---|---|---|---|
| D1. Erreur de Q1 affichée en fin de liste | test T1c `8b618e1`, correctif `5e81d4c` | code d'avant : `ECHEC T1c une seule bulle d'erreur` et `ECHEC T1c l'erreur suit la question qui a echoue` — bulles `Q1, Q2, REP<Q2>, Q3, REP<Q3>` : **l'erreur avait disparu**, effacée par l'envoi suivant (`setError(null)`), pire que le constat de la revue | `OK T1c` ×4 |
| D2. T6 ter ne discriminait ni la langue ni la carte | `8b618e1` | mutant m1 (puces FR sur la page EN) : `ECHEC T6 tarifs [en] … ["free.puces","pro.puces","team.puces"]` — vert avant ; mutant m2 (puces Pro sur la carte Free) : `ECHEC … ["free.puces"]` | `OK T6 tarifs [fr]/[en] : chaque carte porte … SON palier, dans SA langue` |
| D3. VISIBLE sans couleur ni contraste | `8b618e1` | mutant m3 (`.v-mention{color:transparent}`) : `ECHEC T2` ×8, `"couleur transparente rgba(0, 0, 0, 0)"` — `OK : 89 controles` avant | code réel conforme au seuil WCAG AA fixé avant la mesure |
| D4. LogiFleet : « 12 custom objects · 47 flows · 9 LWC » dans le bandeau, contre 17 objets / 27 flux mesurés dans l'onglet | — | — | **ouvert, décision de Sam** : aligner sur la SDS, retirer la ligne, ou la garder en le disant |

Après reprises : `TYPECHECK=0`, `test:routes` OK, `test:vitrines` **`OK : 95 controles.`** Les mutants sont rejoués dans des copies (`/root/.dh_orch_vague2/site-mut/`), jamais dans ce worktree.

Limite toujours non couverte (revue 2) : le volet « boîtes » de T2 ne tourne qu'en FR à 1488 px.

## 6 · Écarts aux règles, dits platement

- La mesure « avant » a écrit `/tmp/dh-reference` (chemin codé dans `package.json` d'origine) avant
  que je le déplace dans `.reference/` ; supprimé en fin de session.
- Des fichiers de travail ont été écrits sous `/root/.dh_orch_vague2/` (journaux, export `git archive`
  du parent et son build, scripts de mesure), comme autorisé.
- Deux serveurs locaux ont tourné pendant la session (127.0.0.1:8791 référence en lecture seule,
  127.0.0.1:8792 `vite preview`), arrêtés en fin de session.
- Un `pkill -f` a tué son propre shell (motif présent dans sa ligne de commande) ; sans autre effet.

## 7 · Commits (`git log --oneline origin/refonte-2026..HEAD`)

```
d35496e correctif(sophie): ne plus jeter une question envoyee pendant une reponse (reprise 1)
3e28b50 test(vitrines): reprises 1, 2, 3 et 5 de la revue — question perdue, T2 strict, chiffres recalcules, contenu commun
f974e72 docs(revue): revue independante des vitrines — verdict « a reprendre »
2ebfabd docs(rapport): rapport des composants vitrines (fait/preuve, infirme, ouvert, attend Sam)
953f0b2 vitrines: accueil refondu d'apres la reference du 18/09 (quatre vitrines, heros, tarifs, FAQ, CTA)
a550e95 test(parite, routes): restreindre la parite aux routes legales, lire les liens SDS onglet par onglet
873fedc contenu(vitrines): decouper la reference du 18/09 et corriger son contenu par les sources
a1c5fe8 test(vitrines): tests navigateur des vitrines, rouges sur 4f51145
24825cf visuels: verser les 36 WebP de la reference et mesurer les chiffres des six SDS
14a365c contenu(legal): porter la ligne « Conversations Free » du 30/09 ; test:routes l'exige
0b13bdf test(parite): re-extraire la reference legale du bundle servi (30/09)
```

Plus le commit qui met à jour ce rapport (`docs(rapport): reprises après revue 1`), dernier de la branche. `f974e72` est la revue du testeur, conservée telle quelle.

## 8 · Rejouer

```bash
npm ci && npm run test:runtime-reference && npx vite build
export CHROMIUM_PATH=/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome
npm run typecheck && npm run test:parite && npm run test:routes && npm run test:vitrines
python3 outils/extraire-bundle.py /var/www/dh-preview/apercu-recent/index.html <dossier>   # 7 empreintes
python3 outils/decouper-legal.py --verifier                                              # True
```
