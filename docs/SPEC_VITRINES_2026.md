# Spécification — les deux blocs vitrine (18/09/2026)

Décidé avec Sam le 18/09, après lecture de la structure réelle de melius.com.

## 1. Le constat qui simplifie tout

melius.com **n'a pas de boîte flottante qui suit le défilement**. Ce qu'on prenait pour plusieurs
sections est **un seul bloc à cinq onglets** (Advertising, E-commerce, Filmmaking, Fashion, Branding) :
la boîte ne bouge pas parce qu'on ne change pas de section — on change d'onglet, et le fond et les
nœuds se remplacent. Un second bloc du même genre plus bas (« Personas ») porte ses onglets **en bas**.

Toute la page tient donc en **deux composants à onglets**, plus les tarifs, la FAQ et le pied de page.

Conséquence pour nous : pas de composant collant traversant cinq sections. **Un composant `Vitrine`,
instancié deux fois.**

## 2. Les deux instances

| | **Vitrine A — « Pour qui / Ce que vous recevez »** | **Vitrine B — « L'Ensemble et l'Atelier »** |
|---|---|---|
| Onglets | DSI · Architecte Salesforce · Intégrateur / ESN · Direction métier · Achats | Les onze agents, puis les six projets publiés |
| Position des onglets | dans la boîte, en haut | en bas du bloc (comme « Personas » chez Melius) |
| Fond | photo de situation client (colonne pleine hauteur débordant à gauche) | portrait de l'agent / illustration du projet |
| Nœuds | les livrables que **ce rôle** reçoit | les artefacts que **cet agent** produit / les pièces du SDS du projet |
| Prompt Sophie | question propre au rôle | question propre à l'agent ou au projet |

## 3. Le canevas de droite — le fil est le produit

**Le point décisif (Sam, 18/09).** Chez Melius les connecteurs relient des images sans ordre fort.
Chez nous ils racontent **la séquence** : Sophie produit les exigences → Olivia les cas d'usage →
Marcus le modèle de données → Diego le code → Elena les tests. Le canevas n'est pas une mosaïque,
c'est une démonstration du flux.

- Nœuds = **captures réelles des SDS publiées**, pas des blocs abstraits ni des photos.
- Chaque nœud : la capture, un libellé au-dessus (nom du livrable), le nom de l'agent à droite,
  une étiquette laiton en bas à gauche (« 25 exigences », « SDS · 84 pages », « 89 % couverture »).
- Connecteurs : courbes de Bézier fines en laiton, point plein au départ, **traçés dans l'ordre
  de la séquence**, avec un léger décalage de temps entre eux pour que l'œil suive l'enchaînement.
- Les photos comptent moins ici : elles sont petites et en retrait. La matière, ce sont les artefacts.

## 4. Matière disponible (capturée le 18/09, dans `uploads/`)

| Fichier | Contenu | Source |
|---|---|---|
| `sds-exigences.webp` | Tableau des exigences | SDS #146 LogiFleet |
| `sds-usecases.webp` | Index des cas d'usage | SDS #146 |
| `sds-erd.webp`, `art-erd-grand.webp` | Diagramme de modèle de données | SDS #178 Omnichannel Loop |
| `sds-design.webp` | Solution design | SDS #177 Grid Foresight |
| `sds-apercu.webp` | Aperçu de projet | SDS #176 Pipeline Tuner |
| `art-apex.webp` | Spécification Apex | SDS #146 |
| `art-tests.webp` | Plan de tests | SDS #177 |
| `art-flux.webp` | Flux / automatisation | SDS #176 |
| `art-exigences2.webp` | Exigences (variante) | SDS #148 Clinical Trial Watch |
| `role-*.webp` (5) | Photos de situation client | générées le 18/09 |
| 11 portraits d'agents | | WebP, 0,51 Mo au total (étaient 12 Mo) |

## 5. Ce qui est déjà acquis dans le prototype (v3, 18/09)

- Photo = **colonne pleine hauteur débordant du bord gauche** (mesuré : x = −324 px, 1093 × 663).
  Ma règle initiale « panneau borné de 404 px » était fausse : Melius fait déborder. Corrigée.
- Canevas de droite rétréci (595 px), fond sombre à pointillés.
- Contraintes d'animation respectées : courbes personnalisées, pas de `transition: all`,
  `will-change`, `preserve-3d`, `prefers-reduced-motion`, déclenchement à l'entrée dans l'écran.
- Portraits en WebP, références du code mises à jour.

## 6. Ce qui reste à construire, et où

**Dans le dépôt Vite, pas dans le prototype.** La boîte est un composant à état (onglet actif,
transition du prompt, remplacement des nœuds) : c'est le travail de React, et les greffes sur le
fichier de maquette ont montré leur limite.

Composant `Vitrine` avec pour props : les onglets, la fonction qui rend le fond, la liste des nœuds
(capture + libellé + agent + étiquette), les arêtes ordonnées, le prompt par onglet, la position des
onglets (haut ou bas). Deux instances, A et B.

Aperçu du prototype : https://digital-humans.fr/refonte/ (noindex ; le site en ligne est inchangé).
