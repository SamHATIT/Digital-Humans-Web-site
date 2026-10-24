#!/usr/bin/env python3
"""Decoupe les lignes de presentation des onze agents du site en ligne.

Source : _contenu-source/benefits_howitworks.js (bloc HowItWorks du bundle
servi ; empreinte verifiee identique au bundle du 30/09 par
outils/extraire-bundle.py). Le bloc EN vient d'abord, puis le bloc FR : onze
objets {n:'…', role:'…', …, lines:['…', …]} chacun. Rien n'est retape ;
un nombre d'agents different de 11 + 11 fait echouer le script.

Usage : lignes-agents.py > content/agents-lignes.json
"""
import json, os, re, sys

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '_contenu-source', 'benefits_howitworks.js')
s = open(SRC, encoding='utf-8').read()
objets = re.findall(r"\{n:'([^']+)', role:'([^']+)'[^}]*?lines:\[(.*?)\]\}", s)
if len(objets) != 22:
    sys.exit('ECHEC : %d agents trouves, 22 attendus (11 EN + 11 FR)' % len(objets))
sortie = {}
for i, (nom, role, brut) in enumerate(objets):
    lignes = re.findall(r"'((?:[^'\\]|\\.)*)'", brut)
    if not lignes:
        sys.exit('ECHEC : aucune ligne pour ' + nom)
    langue = 'en' if i < 11 else 'fr'
    prenom = nom.split()[0]
    sortie.setdefault(prenom, {})[langue] = {'nom': nom, 'role': role, 'lignes': lignes}
print(json.dumps(sortie, ensure_ascii=False, indent=2))
