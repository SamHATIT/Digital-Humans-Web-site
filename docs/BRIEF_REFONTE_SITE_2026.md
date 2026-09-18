# Brief de refonte — digital-humans.fr

**Date :** 17 septembre 2026 · **Décidé par :** Sam Hatit · **Rédigé par :** Claude
**État de départ :** site en ligne depuis le 17/09 (bundle `apercu-recent`, sauvegardé dans `SamHATIT/dh-sites`, commit `1fee417`).
**Maquette de référence :** `design_handoff_site_melius_style/Digital-Humans Melius-style v2.dc.html` + son README.
**Inspiration :** melius.com — carrousel d'entrée à onglets, boîte de dialogue flottante.

Ce brief se lit en deux parties. La **partie A** part chez Claude Design : elle produit un prototype visuel qu'on regarde et qu'on ajuste. La **partie B** part chez Claude Code une fois le visuel arrêté : elle porte le prototype validé dans le dépôt Vite et le met en ligne.

---

# Partie A — Prototype visuel (Claude Design)

## A.0 Le principe qui gouverne tout

**Ce qu'on montre, c'est ce que le studio produit.** Melius fait défiler ses vraies sorties, étiquetées du modèle qui les a faites. L'équivalent Digital·Humans n'est pas une photo d'agent en situation — un agent est un logiciel — mais l'**artefact** : liste d'exigences, cas d'usage, diagramme de modèle de données, extrait Apex, page de SDS. Six SDS complètes sont publiées et utilisables comme matière (`digital-humans.fr/sds-preview/146|148|176|177|178|179.html`).

Les photos de situation existent et sont bonnes, mais elles illustrent **le client**, pas le studio : elles vont sur « Pour qui », pas sur « Méthode » ni dans le carrousel.

## A.1 La boîte adaptative — cœur de la refonte

Une seule boîte, réutilisée à chaque section, avec **deux zones superposées** :

- **Zone haute — navigation de la section.** Les onglets de la section courante (rôles, étapes, agents, industries). C'est ce qui pilote la zone de droite.
- **Zone basse — la ligne Sophie.** Séparée visuellement de la zone haute par un filet. Avatar, libellé « Parler à Sophie », un prompt et un bouton rond.

**Le comportement qui fait la différence : le prompt se réécrit selon l'onglet actif.** Exemples à produire dans le prototype :

| Section / onglet | Prompt proposé |
|---|---|
| Pour qui · Architecte Salesforce | « Comment tu documentes un modèle de données existant ? » |
| Pour qui · Achats | « Qu'est-ce que je signe exactement, et qu'est-ce qui reste chez moi ? » |
| Méthode · Analyse | « Montre-moi comment tu transformes un brief en exigences. » |
| Méthode · Build | « Montre-moi du code Apex que tu génères. » |
| Agents · Diego | « Écris-moi un trigger avec son test unitaire. » |
| Atelier · LogiFleet | « Résume-moi ce SDS en trois points. » |

Dans le hero, la boîte est **centrée**. Dans les sections, elle **flotte au-dessus du fond** dans la colonne de gauche, en `position: sticky`.

**Mention IA obligatoire.** Au premier contact avec la boîte — hero comme sections — une ligne discrète mais lisible : « Vous échangez avec une IA. Elle peut se tromper. » Non masquable, pas une infobulle. C'est l'article 50 du règlement européen sur l'IA, en vigueur depuis le 2 août 2026.

## A.2 Structure de la page

### 0 · Intro plein écran
Cinq lignes, comme aujourd'hui. Trois changements : bouton **« Passer l'intro → » visible dès la première seconde** (aujourd'hui il arrive tard) ; **mention IA** dans l'intro elle-même ; ne se joue **qu'une fois par navigateur** (mémorisation). Durée totale ramenée de 7,6 s à **4 s environ**.

### 1 · Hero
Fond : carrousel d'**artefacts** en approche 3D dans les bandes latérales, jamais au centre. Chaque carte = un artefact réel avec son étiquette : « 25 exigences · Sophie », « ERD, 17 objets · Marcus », « Trigger + test · Diego », « 58 cas d'usage · Olivia », « Page de SDS · Emma ». Au centre : titre, sous-titre, **boîte Sophie centrée**, et les cinq boutons de cas d'usage. Sélectionner un cas remplace les artefacts du carrousel par ceux de ce cas.

### 2 · Pour qui (`#who`)
Fond photo à gauche (photos de situation fournies), boîte flottante par-dessus. Onglets : DSI, Architecte Salesforce, Intégrateur / ESN, Direction métier, Achats. Zone droite : livrables du rôle. Suivi du bandeau défilant « Ce que l'équipe maîtrise ».

### 3 · Méthode (`#process`)
Onglets : Analyse IA, Validation client, Build automatisé, Déploiement. Zone droite : **artefacts de l'étape** reliés par les connecteurs, pas des portraits.

### 4 · L'Ensemble — les agents (`#agents`)
Onglets : les onze prénoms. Fond : portrait de l'agent. Zone droite : ce que **cet agent produit**.
**Nouveauté demandée par Sam :** deux boîtes supplémentaires dans cette section, alimentées par l'agent sélectionné —
- une boîte **« Ce qu'il écrit »** : extrait du Journal signé de cet agent (articles réels du blog) ;
- une boîte **« Ce qu'il garantit »** : la clause du Pacte qui le concerne — quelle décision lui est interdite sans validation humaine.

C'est là que le Pacte et le Journal reprennent leur place, incarnés plutôt qu'énoncés.

### 5 · L'Atelier (`#atelier`) — **section renommée et repensée**
Remplace « Industries » de la maquette. Onglets : les six projets publiés (LogiFleet, Clinical Trial Watch, Claim Resolver, Pipeline Tuner, Grid Foresight, Omnichannel Loop).
Colonne gauche : **le brief client** sur illustration de fond, dans la boîte.
Zone droite : **variante unique du composant** — pas des cartes-nœuds mais un **aperçu du SDS qui défile lentement** (page réelle, en réduction), avec en dessous les chiffres du document (exigences, cas d'usage, objets, flux) et le lien **« Lire le SDS complet → »** vers la page publiée.

### 6 · Tarifs (`#pricing`)
Quatre offres. **Pas de bascule mensuel/annuel** (décision Sam du 17/09 : à revoir quand la viabilité économique sera établie). Free = « Modèle Nemotron, hébergé en Europe ». Mention TVA inchangée : « HT · TVA en sus ».

### 7 · FAQ, 8 · CTA, 9 · Footer
Comme la maquette. CTA « Demander une démo » → crée un ticket (Email-to-Case), pas un simple `mailto`. CTA « Entrer dans le studio » → **formulaire d'inscription complet** : e-mail, mot de passe, **deux cases de consentement (CGV et confidentialité) et version des CGV**, puis message « lien de confirmation envoyé ». L'inscription en une étape est fermée côté serveur ; un bouton qui pointe ailleurs mènera à une erreur.

## A.3 Contraintes d'animation — non négociables

Le premier prototype ne les avait pas, d'où la sensation de manque de fluidité. Elles sont **exigées dès la première version** :

1. **Aucune courbe par défaut.** Interdiction de `ease` seul : chaque animation a sa `cubic-bezier`. Pour l'approche 3D du carrousel, une courbe qui accélère en fin de course (un objet qui se rapproche ne va pas à vitesse constante) — `linear` est la cause principale de l'effet mécanique actuel.
2. **Jamais `transition: all`.** Nommer les propriétés : `transform`, `opacity`, `background-color`, `border-color`.
3. **N'animer que `transform` et `opacity`.** Retirer le `filter: saturate()` animé de l'entrée de fond.
4. **`will-change: transform, opacity`** et `transform-style: preserve-3d` sur les cartes du carrousel ; `backface-visibility: hidden`.
5. **Fondus adoucis** dans les images-clés : les ruptures sèches à 12 % et 85 % deviennent des transitions progressives.
6. **Apparitions déclenchées à l'entrée dans l'écran**, pas au chargement de la page.
7. **Bloc `prefers-reduced-motion` obligatoire** : coupe approche, bandeau défilant, connecteurs animés, intro.
8. Le `stroke-dashoffset` des connecteurs n'est pas accéléré par le compositeur : le limiter aux connecteurs visibles.

## A.4 Ce qui ne change pas

Charte intégrale : obsidienne, os, laiton, indigo ; Cormorant Garamond, Inter, JetBrains Mono ; jetons de la maquette inchangés. Bilingue FR/EN. Thème clair et sombre.

## A.5 Visuels

Photos disponibles mais à régénérer : **1920 px de large minimum**, formats **4:5** (cartes) et **4:3** (cartes-nœuds), **aucun texte visible** dans l'image — quatre des treize actuelles portent du texte cassé (« tiser Experience », « Cortificate of Cortifications »). Portraits d'agents à convertir en WebP : 12 Mo aujourd'hui pour onze fichiers.

En attendant, placeholders explicites, comme dans la maquette actuelle.

---

# Partie B — Mise en œuvre (Claude Code)

## B.1 Où — et l'ordre des opérations

Dépôt `SamHATIT/Digital-Humans-Web-site`, branche `refonte-2026` depuis `refonte-2026-base` (commit `70bfa29`).

**Vite + React 19 + Tailwind, `LanguageContext` pour FR/EN.** Les `.dc.html` de la maquette sont des références de design, pas du code à copier ; `support.js` et `_ds/` ne se portent pas.

### B.1.1 Constat qui gouverne l'ordre des tâches

Le site en ligne **n'est pas du HTML figé : c'est déjà du React**, empaqueté en un fichier de 16 Mo par Claude Design. Les ressources déballées (`/root/workspace/site-work/dh/`) contiennent `Header`, `Hero`, `Benefits`, `HowItWorks`, `OurAgents`, `LegalPage`, `SophieChat`, et React lui-même.

Le dépôt Vite, lui, s'est arrêté en janvier : son contenu est **obsolète de huit mois** (pas de transcréation française d'août, pas de pages légales, pas de clauses IA, pas de SIRET, pas des six SDS, tarifs périmés).

**Conséquence : la source de vérité du contenu est le bundle en ligne, pas le dépôt.** Le travail de janvier n'apporte que sa plomberie — `react-router-dom`, découpage `HomePage`, composants de blog — qui, elle, n'existe pas dans le bundle.

### B.1.2 Première tâche : porter le contenu, avant toute refonte visuelle

Aucune modification d'apparence tant que ce portage n'est pas terminé et vérifié.

Trois blocs à récupérer depuis `/root/workspace/site-work/dh/` (déjà déballés le 15/09) :

| Ressource | Contenu | Destination |
|---|---|---|
| `a1b2c3d4-…js` → `LEGAL_DATA` | Mentions légales, CGV, confidentialité — FR et EN, clauses IA (art. 50), SIRET, TVA « en cours d'attribution » | Données des routes `/legal`, `/cgv`, `/privacy`. **À ne jamais retaper à la main.** |
| `b077057a-…js` | Onze agents, six projets de l'Atelier avec leurs URL de SDS, tarifs, textes de sections — toute la transcréation française de fin août | `LanguageContext` + données de composants |
| `b41ed13f-…js` → `SophieChat` | Composant de dialogue existant | **Base de la boîte adaptative** (A.1), à faire évoluer plutôt qu'à réécrire |

Le dépaquetage et le rempaquetage du bundle se font avec `/root/workspace/site-work/pack.py` (écrit le 15/09, convention d'échappement vérifiée).

### B.1.3 Critère de fin du portage — avant la première ligne de refonte

Le site reconstruit **dit exactement la même chose** que celui en ligne : mêmes textes FR et EN, mêmes pages légales, mêmes tarifs, mêmes six liens SDS. Comparaison automatique texte à texte entre la page servie et la page reconstruite, écart = échec.

Bénéfice attendu, à énoncer dans le rapport : **une seule base de code** au lieu de deux. Les prochaines corrections de contenu ne passeront plus par le dépaquetage d'un fichier de 16 Mo — c'est ce mode d'édition qui a laissé un bloc CSS dans un script JSX et noirci le site pendant seize jours (GL-05).

## B.2 Le site actuel ne bouge pas

`/var/www/dh-preview/index.html` est un **lien symbolique** vers `apercu-recent/index.html`. La refonte se construit et se déploie à côté :

- servie sur `digital-humans.fr/refonte/`, en `noindex` **et derrière un mot de passe** ;
- bascule = `ln -sfn` sur le lien symbolique ; retour arrière = la même commande.

Aucune modification du site en ligne avant validation explicite de Sam. Si le calendrier dérape, on reste sur l'actuel sans rien défaire.

## B.3 Tests exigés avant toute bascule

1. **Routes légales identiques** : `/legal`, `/cgv`, `/privacy` répondent 200, en FR et EN, avec les clauses IA, le SIRET, et « TVA en cours d'attribution ». Test automatique, rouge d'abord.
2. **Six liens SDS** présents dans l'Atelier et résolvant en 200.
3. **Mention IA** présente au premier contact avec la boîte Sophie (test navigateur).
4. **Formulaire d'inscription** : refuse sans consentement, refuse sans version de CGV, accepte avec — contre l'API réelle.
5. **Console vide** au chargement, en FR et EN, en thème clair et sombre.
6. **`prefers-reduced-motion`** : animations coupées, vérifié en émulation.
7. **Poids de la page** et premier affichage mesurés avant/après. Référence actuelle : 16 Mo.
8. **Égalité de contenu** avec le site en ligne (critère B.1.3) : textes FR et EN, pages légales, tarifs, liens SDS.

## B.4 Reste à faire, hors maquette

- **Polices auto-hébergées** (supprime le transfert vers Google déclaré dans la politique de confidentialité).
- **Référencement** : titres et descriptions par route, image de partage, `sitemap.xml` cohérent.
- **Accessibilité** : onglets au clavier, focus visibles, contraste du texte sur les photos, textes alternatifs.
- **Pas de traceur** aujourd'hui, donc pas de bandeau cookies. Si une mesure d'audience est ajoutée, bandeau et politique de confidentialité à reprendre — ne rien ajouter sans décision explicite.
- **Sauvegarde continue** : verser l'état en ligne dans `SamHATIT/dh-sites` à chaque modification.

## B.5 Discipline

Règles de `dh-discipline-de-preuve` : « exécuté » n'est pas « lu », test rouge avant correctif, contrôle négatif quand le correctif discrimine deux cas, mesurer plutôt que reprendre un chiffre, pas de repli silencieux. Un commit par correctif, message en français : défaut, cause, correctif, preuve exécutée.

---

## Ordre de marche

1. **Portage du contenu** (B.1.2) — indépendant du design, peut commencer tout de suite, en parallèle de la partie A.
2. Partie A chez Claude Design → prototype → revue par Sam → ajustements.
3. Régénération des visuels selon les besoins réels du prototype validé.
4. Partie B chez Claude Code → refonte visuelle sur le contenu déjà porté, déploiement en parallèle, tests.
5. Revue sur `/refonte/`, puis bascule du lien symbolique.

**Hors chemin critique du 1er octobre.** L'ouverture se fait sur le site actuel ; la refonte arrive quand elle est prête.
