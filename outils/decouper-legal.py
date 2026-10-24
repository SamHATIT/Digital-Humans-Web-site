#!/usr/bin/env python3
"""Ecrit content/legal.json par decoupe de `LEGAL_DATA` dans _contenu-source/legal_data.js.

Rien n'est retape : la tranche de texte qui suit `const LEGAL_DATA = ` est
recopiee telle quelle (plus un saut de ligne final, convention du fichier
porte le 18/09), apres verification qu'elle se decode en JSON et que l'objet
relu depuis le fichier ecrit est egal a l'objet source.

Usage : decouper-legal.py [--verifier]   (--verifier : n'ecrit rien, sort 1 si ecart)
"""
import json, os, sys

RACINE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC = os.path.join(RACINE, '_contenu-source', 'legal_data.js')
DST = os.path.join(RACINE, 'content', 'legal.json')
MARQUE = 'const LEGAL_DATA = '

s = open(SRC, encoding='utf-8').read()
if s.count(MARQUE) != 1:
    sys.exit('ECHEC : marque %r trouvee %d fois' % (MARQUE, s.count(MARQUE)))
i = s.index(MARQUE) + len(MARQUE)
obj, fin = json.JSONDecoder().raw_decode(s[i:])
tranche = s[i:i + fin] + '\n'
actuel = open(DST, encoding='utf-8').read() if os.path.exists(DST) else ''
if '--verifier' in sys.argv:
    print('legal.json identique a la decoupe :', actuel == tranche)
    sys.exit(0 if actuel == tranche else 1)
open(DST, 'w', encoding='utf-8').write(tranche)
assert json.load(open(DST, encoding='utf-8')) == obj, 'objet relu different de la source'
print('ecrit', DST, len(tranche.encode('utf-8')), 'octets ; objet relu == objet source')
