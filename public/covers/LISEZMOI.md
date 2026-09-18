# Couvertures de l'Atelier — absentes

Les six visuels de couverture (`logifleet`, `pharma`, `telecom`,
`b2b-distribution`, `energy`, `retail`) vivent dans le bundle en ligne, pas
dans les sources extraites. Ils n'ont pas ete rapatries pendant le portage du
contenu : le conteneur de travail n'avait pas d'acces reseau vers
digital-humans.fr, et ils sont de toute facon a regenerer (brief A.5 :
1920 px de large, 4:3, sans texte incruste).

Pour les recuperer tels qu'ils sont en ligne, la ou le bundle est lisible :

    python3 outils/extraire-visuels.py \
      /var/www/dh-preview/apercu-recent/index.html .

Execute le 18/09/2026 sur le serveur : 17 fichiers ecrits, 10 584 831 octets,
couvertures en 1376x768.
