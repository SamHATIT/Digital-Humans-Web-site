#!/usr/bin/env python3
"""Mesure les chiffres affiches dans l'Atelier a partir des six SDS publiees.

Lecture seule de /var/www/digital-humans.fr/sds-preview/<id>.html (servies sous
https://digital-humans.fr/sds-preview/). Pour chaque SDS, dans le CORPS du
document (la table des matieres est ignoree : elle porte les memes nombres dans
les six fichiers) :
  exigences  = identifiants BR-NNN distincts
  cas_usage  = « Use Cases — N UCs » (titre de la scene iii)
  objets     = « 6.2 Custom Objects (N) »
  flux       = « Flows (N) » de la section 6.8 Automation Design
Une valeur introuvable fait echouer le script (pas de valeur par defaut).

Usage : chiffres-sds.py [dossier-sds] > content/sds-chiffres.json
"""
import html, json, re, sys

DOSSIER = sys.argv[1] if len(sys.argv) > 1 else '/var/www/digital-humans.fr/sds-preview'
IDS = [146, 148, 176, 177, 178, 179]

def texte(chemin):
    s = open(chemin, encoding='utf-8', errors='strict').read()
    s = re.sub(r'<(style|script)[^>]*>.*?</\1>', '', s, flags=re.S)
    t = html.unescape(re.sub(r'<[^>]+>', '|', s))
    return re.sub(r'\s*\|[\s|]*', ' | ', t)

def un(motif, t, quoi, ident):
    m = re.findall(motif, t)
    if not m:
        sys.exit('ECHEC : %s introuvable dans SDS %s' % (quoi, ident))
    return int(m[-1])  # derniere occurrence = corps (la TdM vient avant)

sortie = {}
for i in IDS:
    t = texte('%s/%d.html' % (DOSSIER, i))
    corps = t[t.find('6.1 Data Model'):] if '6.1 Data Model' in t else ''
    if not corps:
        sys.exit('ECHEC : section 6.1 Data Model introuvable dans SDS %d' % i)
    sortie[str(i)] = {
        'exigences': len(set(re.findall(r'\bBR-\d{3}\b', t))),
        'cas_usage': un(r'Use Cases — (\d+) UCs', t, 'Use Cases — N UCs', i),
        'objets': un(r'6\.2 Custom Objects \| \((\d+)\)', corps, '6.2 Custom Objects (N)', i),
        'flux': un(r'Automation Design \| Flows \((\d+)\)', corps, 'Flows (N)', i),
    }
print(json.dumps(sortie, ensure_ascii=False, indent=2))
