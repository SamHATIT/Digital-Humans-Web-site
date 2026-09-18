# Portage du contenu — B.1.2

**Date :** 18 septembre 2026 · **Branche :** `refonte-2026` (depuis `refonte-2026-base`, `ca5272b`)
**Perimetre :** partie B.1.2 du brief `BRIEF_REFONTE_SITE_2026.md`, et elle seule.
**Aucune modification d'apparence.** Le critere B.1.3 est atteint et verifie automatiquement.

---

## 1 · Ce qui est fait, avec la preuve executee

### 1.1 Les sources portees sont bien celles qui sont servies

Constat de depart verifie plutot que suppose : les six fichiers de
`_contenu-source/` sont **octet pour octet** les ressources du bundle servi
aujourd'hui (`/var/www/dh-preview/apercu-recent/index.html`, 16 207 318 octets,
cible du lien symbolique `/var/www/dh-preview/index.html`).

Empreintes SHA-256 (16 premiers caracteres), relevees le 18/09 sur le serveur
puis sur le depot :

| Ressource du bundle | Fichier | Octets | SHA-256 |
|---|---|---|---|
| `b7ddfc56-…` | `header_hero.js` | 5 362 | `3d975686906128a4` |
| `0fbb2257-…` | `site_racine.js` | 1 991 | `edec5a25df35a9eb` |
| `b41ed13f-…` | `sophie_chat.js` | 7 954 | `c96c22077a500af6` |
| `6641f2bf-…` | `benefits_howitworks.js` | 16 979 | `86815bb4a4225862` |
| `b077057a-…` | `app_contenu.js` | 23 401 | `4b304d22d1298f2b` |
| `a1b2c3d4-…` | `legal_data.js` | 32 732 | `57207334da674e69` |
| gabarit | `gabarit_page.html` | 73 858 | `c5c22c85e546fa23` |

Les sept empreintes sont identiques des deux cotes. Le contenu porte est donc
celui de la production, pas une copie datee.

### 1.2 Le contenu porte

Rien n'a ete retape. Les composants et les donnees ont ete **decoupes par
programme** dans ces fichiers, puis enveloppes ; seuls l'en-tete d'import, la
signature et l'export different de l'original. Les props `lang` / `theme` du
bundle viennent desormais des contextes du depot.

| Destination | Origine |
|---|---|
| `content/legal.json` | `LEGAL_DATA` — decoupe JSON verifiee egale a l'objet source (`json.load` des deux cotes). Mentions legales, CGV, confidentialite, FR + EN, clauses IA, SIRET, TVA. |
| `content/agents.ts`, `content/projects.ts`, `content/pricing.ts` | `ENSEMBLE`, `PROJECTS` (dont les six `sds_url`), `PRICING_TIERS` |
| `components/site/*.tsx` | `Header`, `Hero`, `Benefits`, `HowItWorks`, `OurAgents`, `OurWork`, `Pricing`, `CTA`, `Footer`, `SophieChat`, jeu d'icones |
| `components/legal/*.tsx` | `LegalPage`, `LegalLayout` |
| `styles/site.css` | les deux blocs `<style>` du gabarit (1 565 lignes), dont `.footer-ai-note` et `.sophie-disclaimer` |
| `index.html` | metas, Open Graph, Twitter, favicon et `<title>` du gabarit, recopies par programme |

`SophieChat` est porte **sans evolution** : c'est la base de la boite adaptative
(brief A.1), a faire evoluer dans un lot ulterieur.

La plomberie du depot est conservee et c'est elle qui remplace le mini-routeur
du bundle : `react-router-dom` sert `/`, `/legal`, `/cgv`, `/privacy`, plus les
routes `/blog` de janvier.

### 1.3 Critere B.1.3 — egalite de contenu

`npm run test:parite` rend la page servie et la page reconstruite dans le meme
navigateur, extrait le texte visible et le compare ligne a ligne.

La reference n'est pas une copie du depot : `tests/construire-reference.mjs`
rejoue le gabarit et les six scripts du bundle avec React 18.3.1, ReactDOM et
Babel — la meme chaine qu'en production. Cette reference est necessaire parce
que l'egress vers `digital-humans.fr` est ferme depuis le conteneur de travail
(`CONNECT tunnel failed, 403`) : c'est donc le **bundle lui-meme** qui est
rendu, pas une capture.

```
Parite de contenu — site en ligne vs site reconstruit
  OK   / [fr]               240 lignes identiques
  OK   / [en]               244 lignes identiques
  OK   /legal [fr]          59 lignes identiques
  OK   /legal [en]          59 lignes identiques
  OK   /cgv [fr]            70 lignes identiques
  OK   /cgv [en]            70 lignes identiques
  OK   /privacy [fr]        66 lignes identiques
  OK   /privacy [en]        66 lignes identiques

OK : les deux sites disent exactement la meme chose.
```

**Deux controles negatifs**, parce qu'un test vert ne vaut que ce que vaut son
assertion :

1. Un point ajoute a « Modele Nemotron, heberge en Europe » (tarifs, FR seul) —
   detecte, ligne 178 de `/` [fr], et cette seule ligne. Sortie 1.
2. SIRET `…00033` change en `…00034` dans `content/legal.json` — detecte sur
   `/legal` en FR **et** en EN. Sortie 1.

Les deux modifications ont ete annulees et la parite re-verifiee verte.

### 1.4 Tests B.3.1 et B.3.2

`npm run test:routes` :

```
  OK    /legal [fr] : 200, 4 mention(s) presente(s)
  OK    /legal [en] : 200, 4 mention(s) presente(s)
  OK    /cgv [fr] : 200, 1 mention(s) presente(s)
  OK    /cgv [en] : 200, 1 mention(s) presente(s)
  OK    /privacy [fr] : 200, 1 mention(s) presente(s)
  OK    /privacy [en] : 200, 1 mention(s) presente(s)
  OK    Atelier : les 6 liens SDS sont presents
```

Les mentions verifiees sont litterales : `SIRET : 343 172 490 00033`,
« Numero de TVA intracommunautaire : en cours d'attribution. », « systeme
d'intelligence artificielle au sens du reglement (UE) 2024/1689 »,
« conformement a l'article 50 du reglement », et leurs equivalents anglais.

Le test a d'abord ete **rouge** : cinq assertions, ecrites de memoire, ne
correspondaient pas aux formulations reelles. Les formulations ont ete relues
dans les donnees et les assertions corrigees — pas l'inverse. Controle negatif :
un lien SDS change en `999.html` fait echouer le test en nommant le lien absent.

La resolution HTTP des six SDS a ete mesuree **depuis le serveur** le 18/09 :
`/sds-preview/146|148|176|177|178|179.html` repondent tous `200`, de meme que
`/`, `/legal`, `/cgv`, `/privacy`.

### 1.5 Poids et premier affichage (B.3.7)

Mesure, pas reprise de document. Meme machine, meme navigateur, serveur local.

| | En ligne (bundle) | Reconstruit |
|---|---|---|
| Fichier servi | **16 207 318 octets** en un seul `index.html` | `index.html` 3 232 o + JS 319 831 o + CSS 46 284 o |
| Transfert au premier chargement de `/` | le fichier entier | **422 a 504 Kio** (portraits et polices compris) |
| Transfert au premier chargement de `/legal` | le fichier entier | 315 a 361 Kio |
| Premier rendu `/` | 1 093 a 1 231 ms | **418 a 522 ms** |
| Premier rendu `/legal` | 998 a 1 108 ms | 223 a 372 ms |

Le bundle paie deux fois : il embarque 11,8 Mo d'images pour toutes les routes,
et il compile son JSX dans le navigateur a chaque visite (Babel le signale
lui-meme en console). Le build Vite fait les deux a l'avance.

### 1.6 Console

Une seule entree au chargement de `/` et de `/legal`, en FR et EN, en clair et
en sombre : `ERR_CERT_AUTHORITY_INVALID` sur
`fonts.googleapis.com`. C'est le mandataire TLS de ce conteneur, pas le site :
c'est la seule requete sortante de la page, et aucune autre requete n'echoue
(portraits, CSS, JS : `requetes en echec : aucune` par ailleurs). Aucun
`pageerror`, aucun 404. A re-mesurer hors conteneur avant la bascule, et le
point disparait avec les polices auto-hebergees (B.4).

### 1.7 Benefice attendu, mesure

**Une seule base de code au lieu de deux.** Une correction de contenu se fait
desormais dans un fichier TypeScript de quelques dizaines de lignes, relu par
`tsc` et par deux tests, au lieu de passer par le depaquetage et le
rempaquetage d'un fichier de 16 Mo. C'est ce mode d'edition qui avait laisse un
bloc CSS dans un script JSX et noirci le site pendant seize jours (GL-05).

`npm run typecheck` : 0 erreur (le depot n'avait aucune verification de types
avant ce lot ; le script est ajoute).

---

## 2 · Ce qui ne s'est pas confirme

- **`OurAgents` n'est pas monte par le site en ligne.** Le composant existe dans
  les sources et exporte onze portraits, mais le composant racine `Site` du
  bundle ne l'appelle pas : l'accueil enchaine Hero, Benefits, HowItWorks,
  OurWork, Pricing, CTA. La page reconstruite fait donc de meme, et la parite de
  contenu le confirme. Le composant est porte et disponible, non monte.
- **L'intro plein ecran de cinq lignes (brief A.2.0) n'existe pas dans le bundle
  servi.** Ni `intro`, ni `dh_intro_seen` n'apparaissent dans le gabarit ou dans
  les six scripts. Rien a porter ; a construire cote partie A.

---

## 3 · Ce qui reste ouvert

- **Les visuels ne sont pas rapatries** : 11 portraits d'agents et 6 couvertures
  d'Atelier, 10 584 831 octets, embarques dans le bundle. L'egress du conteneur
  est ferme et leur transfert par le canal disponible n'etait pas raisonnable.
  `outils/extraire-visuels.py` les extrait ; il a ete **execute le 18/09 sur le
  serveur** : 17 fichiers ecrits, 10 584 831 octets, couvertures en 1376x768.
  En attendant : les couvertures manquent (`public/covers/LISEZMOI.md`) et les
  portraits affiches sont ceux du depot depuis janvier — memes agents, fichiers
  differents. **Ecart visuel connu, pas un ecart de contenu.** Le brief A.5
  prevoit de tous les regenerer.
- **Defaut latent dans `Pricing`, present dans le site en ligne** : la branche
  `else if (typeof openSophie === 'function') { openSophie(); }` appelle
  `openSophie` sans evenement alors qu'il fait `e.preventDefault()`. La branche
  est morte aujourd'hui (seule l'offre Free est active, et elle prend la branche
  precedente). **Laisse tel quel**, commente sur place : ce lot porte le
  contenu a comportement inchange.
- **Les routes `/blog` de janvier** sont conservees comme plomberie mais ne sont
  pas du contenu porte : elles interrogent une API Ghost et le journal publie
  vit ailleurs (`digital-humans.fr/journal`). Leurs classes Tailwind dependaient
  du CDN charge dans `index.html` ; ce CDN est retire de la page (son reset
  ecrase `styles/site.css` et il journalise un avertissement en console) et
  charge a la demande sur ces seules routes.
- **Tests B.3.3 a B.3.6** (mention IA au premier contact, formulaire
  d'inscription contre l'API reelle, `prefers-reduced-motion`) : ils portent sur
  des comportements que la refonte doit introduire. Hors de ce lot.

---

## 4 · Ce qui n'a pas ete fait, et pourquoi

- **Aucune refonte visuelle.** C'est la consigne : rien ne bouge avant que B.1.3
  soit atteint. Il l'est maintenant.
- **Aucun deploiement.** `digital-humans.fr/refonte/`, le mot de passe, le
  `noindex` et la bascule du lien symbolique (B.2) relevent du lot de
  deploiement. Le site en ligne n'a pas ete touche.
- **Polices auto-hebergees, referencement par route, accessibilite** (B.4) :
  hors perimetre de B.1.2. Les polices restent chez Google, comme aujourd'hui —
  les `@font-face` du bundle pointent vers des binaires qui ne font pas partie
  des sources extraites.

---

## 5 · Rejouer les verifications

```bash
npm install
npm run build
npm run typecheck
npm run test:runtime-reference   # React 18.3.1 + Babel, une fois
npm run test:parite              # critere B.1.3
npm run test:routes              # B.3.1 et B.3.2
```
