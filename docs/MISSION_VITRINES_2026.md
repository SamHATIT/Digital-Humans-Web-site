# Mission Claude Code — Refonte du site : composants vitrines (dépôt Vite)

**Rédigée le 30/09/2026** · **Branche :** `refonte-2026` (le portage du contenu y est fait et prouvé : 874 lignes, 0 écart) · **Fenêtre :** 1er → 8 octobre · **Ouverture visée : jeudi 15 octobre.**

## Lis d'abord, dans cet ordre
1. `docs/BRIEF_REFONTE_SITE_2026.md` — parties A (A.1 bis : règles de composition) et B.
2. `docs/SPEC_VITRINES_2026.md` — les deux blocs vitrine, la séquence des artefacts.
3. `docs/PORTAGE_CONTENU_2026.md` — le contenu porté et le test de parité.
4. **La référence visuelle validée par Sam le 18/09** : https://digital-humans.fr/refonte/ (prototype, `noindex`). C'est l'étalon — pas le handoff d'origine, dont plusieurs consignes ont été corrigées depuis.

## Ce que Sam a validé sur la référence (18/09) — à reproduire, pas à réinterpréter
1. Deux colonnes **égales et centrées** sur l'axe médian, conteneur **1488 px** (+20 % sur 1240).
2. **Photo à gauche sans bordure**, légèrement plus grande que sa colonne, **qui s'estompe vers le noir** (masque radial) ; saturation +18 %, pas de coins arrondis.
3. **Boîte adaptative flottante** (~330 px), **centrée en hauteur**, à cheval près du bord droit de la photo : onglets en haut, ligne Sophie en bas avec un **vrai champ de saisie** (pas un texte figé), mention IA « You are talking to an AI. It can be wrong. ». Pas de libellé « RÔLE » : le nom de l'onglet actif est affiché **en laiton**.
4. **Canevas de droite** : même hauteur exacte que la photo, **angles droits**, fond à pointillés ; cartes-nœuds **sans bordure ni coins arrondis**, vignettes = **captures réelles de SDS** (fichiers `sds-*.webp`, `art-*.webp` fournis), étiquette laiton ; connecteurs en **courbes de Bézier** laiton, tracés dans l'ordre de la séquence.
5. **Plus de petites boîtes sous la photo** : leur texte **défile horizontalement au bas du canevas** (même animation que le bandeau « Ce que l'équipe maîtrise ») — label laiton, titre, texte ; boucle sans couture (piste dupliquée), pause au survol. Si le contenu est un article du Journal : vignettes cliquables vers l'article.
6. **Volume** : ombre en deux couches sur la boîte et les cartes, parallaxe légère (fond 26 px, boîte −16 px), coupée par `prefers-reduced-motion`.
7. Le même modèle pour les **quatre chapitres** : Pour qui (photos `role-*`), Méthode (`etape-*`), L'Ensemble (portraits d'agents + boîtes « Ce qu'il écrit » / « Ce qu'il garantit »), L'Atelier (`projet-*` + aperçu de SDS qui défile + lien).

Les quinze visuels et dix captures sont dans `/var/www/dh-preview/refonte/uploads/` sur le VPS ; les verser dans `public/visuels/` (WebP, déjà optimisés — 941 Ko au total).

## Ce qui reste hors référence
Héros (carrousel d'artefacts, boîte centrée), tarifs (Free = Nemotron hébergé en Europe ; Pro 79 € HT, Team 1 490 € HT, Enterprise sur devis ; « HT · TVA en sus » ; **pas** de bascule annuelle), FAQ, pied de page, CTA « Entrer dans le studio » → `app.digital-humans.fr/signup` (formulaire avec consentements), « Demander une démo » → ticket (Email-to-Case, décision 16/09 — si l'adresse de routage n'est pas fournie, laisser un TODO visible dans le rapport, pas un mailto silencieux).

## Tests (tous exigés, rouge d'abord pour les nouveaux)
- `test:parite` reste vert pour le **contenu textuel** des routes légales (`/legal`, `/cgv`, `/privacy`) — ces pages ne changent pas. *Attention : la politique de confidentialité a gagné une ligne le 30/09 (« Conversations Free : quatre-vingt-dix jours… ») — re-extraire la référence depuis le bundle servi avant de comparer.*
- `test:routes` vert ; six liens SDS résolus.
- Nouveaux : champ de saisie Sophie fonctionnel ; mention IA visible au premier rendu ; bandeau défilant présent et bouclé ; `prefers-reduced-motion` coupe parallaxe et défilement ; console vide FR/EN, clair/sombre.
- Poids et premier rendu mesurés (référence : 16 Mo / ~1,1 s ; portage : ~0,5 Mo / ~0,45 s).

## Règles
Discipline `dh-discipline-de-preuve`. Un commit par étape, en français. **Aucun déploiement** : la bascule se fait par lien symbolique après validation de Sam. PR ouverte vers `refonte-2026`, pas de fusion. Rapport : `docs/RAPPORT_VITRINES_2026.md`.
