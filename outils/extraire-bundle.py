#!/usr/bin/env python3
"""Re-extrait les sources du bundle servi (lecture seule) vers un dossier.

Le bundle Claude Design (`/var/www/dh-preview/apercu-recent/index.html`) porte
un manifeste JSON de ressources (base64, gzip si `compressed`) et un gabarit
HTML serialise en JSON. Ce script ecrit, sous les memes noms que
`_contenu-source/`, les six scripts et le gabarit, puis imprime pour chacun
octets et SHA-256 (16 premiers caracteres), et s'il differe de `_contenu-source/`.

Usage : extraire-bundle.py <bundle index.html> <dossier de sortie>
Il n'ecrit que dans <dossier de sortie> ; il echoue si une ressource attendue
manque au manifeste (pas de repli).
"""
import base64, gzip, hashlib, json, os, re, sys

NOMS = {
    'b7ddfc56-c91a-475b-8210-cdc552a1589d': 'header_hero.js',
    '0fbb2257-1e12-4e49-857e-4774d4dc6847': 'site_racine.js',
    'b41ed13f-c6c3-4e60-adb9-cad7e009b92b': 'sophie_chat.js',
    '6641f2bf-70da-46eb-a716-a60b6030f1c7': 'benefits_howitworks.js',
    'b077057a-5a3a-41a8-8f45-fe3c0011a134': 'app_contenu.js',
    'a1b2c3d4-e5f6-4789-9abc-def012345678': 'legal_data.js',
}

def main():
    bundle, out = sys.argv[1], sys.argv[2]
    racine = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '_contenu-source')
    src = open(bundle, encoding='utf-8').read()
    mm = re.search(r'<script type="__bundler/manifest">(.*?)</script>', src, re.S)
    tm = re.search(r'<script type="__bundler/template">(.*?)</script>', src, re.S)
    if not mm or not tm:
        sys.exit('ECHEC : manifeste ou gabarit introuvable dans ' + bundle)
    man = json.loads(mm.group(1))
    os.makedirs(out, exist_ok=True)
    fichiers = {}
    for rid, nom in NOMS.items():
        if rid not in man:
            sys.exit('ECHEC : ressource absente du manifeste : ' + rid)
        brut = base64.b64decode(man[rid]['data'])
        fichiers[nom] = gzip.decompress(brut) if man[rid].get('compressed') else brut
    fichiers['gabarit_page.html'] = json.loads(tm.group(1)).encode('utf-8')
    print('bundle :', bundle, os.path.getsize(bundle), 'octets')
    for nom, octets in fichiers.items():
        open(os.path.join(out, nom), 'wb').write(octets)
        h = hashlib.sha256(octets).hexdigest()[:16]
        ancien = os.path.join(racine, nom)
        etat = 'absent de _contenu-source'
        if os.path.exists(ancien):
            ha = hashlib.sha256(open(ancien, 'rb').read()).hexdigest()[:16]
            etat = 'identique' if ha == h else 'DIFFERE (_contenu-source : %s)' % ha
        print('  %-24s %7d o  %s  %s' % (nom, len(octets), h, etat))

if __name__ == '__main__':
    main()
