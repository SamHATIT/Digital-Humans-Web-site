# Contenu source — extrait du site en ligne le 17/09/2026

**Ne pas modifier ces fichiers.** Ce sont les sources React du site servi par https://digital-humans.fr/,
extraites du bundle Claude Design (`/var/www/dh-preview/apercu-recent/index.html`, 16 Mo, un seul fichier).
Ils sont ici comme **référence de contenu** : la branche `refonte-2026` doit porter ce contenu vers le dépôt,
pas le retaper.

Pourquoi : le dépôt s'est arrêté en janvier 2026 ; le contenu a beaucoup évolué depuis (transcréation
française de fin août, pages légales, clauses IA de l'AI Act, SIRET, six SDS publiées, tarifs révisés).
La source de vérité du **contenu** est donc le bundle ; le dépôt n'apporte que sa plomberie
(`react-router-dom`, découpage `HomePage`, composants de blog), absente du bundle.

## Les fichiers

| Fichier | Ce qu'il contient | Priorité |
|---|---|---|
| `legal_data.js` | `LEGAL_DATA` : mentions légales, CGV, politique de confidentialité — **FR et EN**, clauses IA (règlement UE 2024/1689 art. 50), SIRET 343 172 490 00033, siège, TVA « en cours d'attribution », hébergeur. | **Critique — à ne jamais retaper à la main.** Une faute de frappe ici est une infraction. |
| `app_contenu.js` | Les onze agents (`ENSEMBLE`), les six projets de l'Atelier avec leurs `sds_url`, les tarifs (Free = « Modèle Nemotron, hébergé en Europe » ; Pro 79 € HT ; Team 1 490 € HT ; Enterprise sur devis), les textes de sections, FR et EN. | Haute |
| `sophie_chat.js` | Composant `SophieChat` déjà en place. **Base de la boîte adaptative** du brief (partie A.1) — à faire évoluer, pas à réécrire. | Haute |
| `benefits_howitworks.js` | Composants `Benefits` et `HowItWorks` + leur CSS (dont les règles `.footer-ai-note` et `.sophie-disclaimer` de la mention IA). | Moyenne |
| `header_hero.js` | `Header`, `Hero`, dictionnaire `I`. | Moyenne |
| `site_racine.js` | Composant racine `Site` : routage interne actuel (`/legal`, `/cgv`, `/privacy`), gestion `dh-lang` / `dh-theme` / `dh_intro_seen` en `localStorage`. | Moyenne |
| `gabarit_page.html` | Gabarit HTML du bundle : `<style>` global, polices, méta. | Référence |
| `pack.py` | Outil de dépaquetage / rempaquetage du bundle (écrit le 15/09, convention d'échappement `<\u002F` vérifiée par contrôle d'identité). Utile pour re-extraire si besoin. | Outil |

## Routes à conserver à l'identique

`/legal`, `/cgv`, `/privacy` — servies aujourd'hui par le bundle, indexables depuis le 17/09.
Elles sont le premier test de non-régression exigé par le brief (partie B.3).

## Critère de fin du portage

Le site reconstruit dit **exactement la même chose** que celui en ligne : mêmes textes FR et EN,
mêmes pages légales, mêmes tarifs, mêmes six liens SDS. Comparaison texte à texte, tout écart = échec.
Aucune modification d'apparence avant que ce critère soit atteint.
