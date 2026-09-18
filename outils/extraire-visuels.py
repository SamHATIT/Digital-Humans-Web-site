#!/usr/bin/env python3
"""Extrait les visuels embarques dans le bundle Claude Design vers public/.

Les onze portraits d'agents et les six couvertures de l'Atelier vivent dans le
manifeste du bundle (`apercu-recent/index.html`, 16 Mo), sous des identifiants
logiques declares par `<script type="__bundler/ext_resources">` : avSophie,
avEmma, …, cvLogifleet, cvPharma, …

Le portage du contenu (B.1.2) n'a pas rapatrie ces 11,8 Mo d'images : le conteneur
de travail n'avait pas d'acces reseau vers digital-humans.fr, et le brief (A.5)
prevoit de toutes les regenerer (1920 px, 4:5 et 4:3, sans texte incruste).
Cet outil est la pour rapatrier l'existant sans le retaper, a executer la ou le
bundle est lisible (le serveur, /var/www/dh-preview/apercu-recent/index.html).

Usage : extraire-visuels.py <index.html du bundle> <racine du depot>
Ecrit  : <depot>/public/avatars/<slug>.jpg et <depot>/public/covers/<id>.jpg
"""
import base64
import gzip
import json
import os
import re
import sys

# Identifiant logique du bundle -> nom de fichier attendu par le depot.
PORTRAITS = {
    'avSophie': 'sophie', 'avOlivia': 'olivia', 'avEmma': 'emma',
    'avMarcus': 'marcus', 'avDiego': 'diego', 'avZara': 'zara',
    'avRaj': 'raj', 'avAisha': 'aisha', 'avElena': 'elena',
    'avJordan': 'jordan', 'avLucas': 'lucas',
}
# Les identifiants de couverture derivent de l'id de projet de content/projects.ts.
COUVERTURES = {
    'cvLogifleet': 'logifleet', 'cvPharma': 'pharma', 'cvTelecom': 'telecom',
    'cvB2bDistribution': 'b2b-distribution', 'cvEnergy': 'energy', 'cvRetail': 'retail',
}


def charger(bundle_path):
    src = open(bundle_path, encoding='utf-8', errors='replace').read()
    man = json.loads(re.search(r'<script type="__bundler/manifest">(.*?)</script>', src, re.S).group(1))
    ext = json.loads(re.search(r'<script type="__bundler/ext_resources">(.*?)</script>', src, re.S).group(1))
    return man, {e['id']: e['uuid'] for e in ext}


def ecrire(man, uuid, dest):
    entry = man[uuid]
    raw = base64.b64decode(entry['data'])
    if entry.get('compressed'):
        raw = gzip.decompress(raw)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, 'wb') as f:
        f.write(raw)
    return len(raw)


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    bundle, depot = sys.argv[1], sys.argv[2]
    man, ids = charger(bundle)
    total, manquants = 0, []
    for groupe, dossier in ((PORTRAITS, 'avatars'), (COUVERTURES, 'covers')):
        for logique, slug in groupe.items():
            uuid = ids.get(logique)
            if not uuid or uuid not in man:
                manquants.append(logique)
                continue
            dest = os.path.join(depot, 'public', dossier, slug + '.jpg')
            n = ecrire(man, uuid, dest)
            total += n
            print('%-18s -> public/%s/%s.jpg  %8d octets' % (logique, dossier, slug, n))
    print('total : %d octets' % total)
    if manquants:
        print('ECHEC : ressources absentes du bundle : %s' % ', '.join(manquants))
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
