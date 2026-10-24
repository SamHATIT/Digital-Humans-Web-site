#!/usr/bin/env python3
"""Releve, pour chaque agent, son article le plus recent publie dans le Journal.

Lecture seule de /var/www/journal/*.html (servi sous digital-humans.fr/journal/).
Un article = une page portant un seul lien d'auteur `by/<prenom-nom>` ; les
pages de collection (index, archive, craft, dispatches, manifesto, week-*) en
portent plusieurs ou aucun et sont ignorees. Champs repris tels quels des
balises <title>, meta description, og:image, et de la date affichee en tete.
Une couverture hors du domaine du studio (ex. image par defaut de Ghost) est
ecartee (image = null) plutot que chargee depuis un tiers.

Usage : articles-journal.py [dossier] > content/journal.json
"""
import glob, html, json, os, re, sys

D = sys.argv[1] if len(sys.argv) > 1 else '/var/www/journal'
AUTEURS = {'sophie-chen': 'Sophie', 'olivia-parker': 'Olivia', 'emma-rodriguez': 'Emma',
           'marcus-johnson': 'Marcus', 'raj-patel': 'Raj', 'diego-martinez': 'Diego',
           'zara-thompson': 'Zara', 'aisha-okonkwo': 'Aisha', 'elena-vasquez': 'Elena',
           'jordan-blake': 'Jordan', 'lucas-fernandez': 'Lucas'}
MOIS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
COLLECTIONS = {'index', 'archive', 'craft', 'dispatches', 'manifesto'}

def meta(s, motif):
    m = re.search(motif, s)
    return html.unescape(m.group(1)) if m else None

par_agent = {}
for f in sorted(glob.glob(os.path.join(D, '*.html'))):
    slug = os.path.basename(f)[:-5]
    if slug in COLLECTIONS or slug.startswith('week-'):
        continue
    s = open(f, encoding='utf-8').read()
    auteurs = set(re.findall(r'by/([a-z-]+)', s))
    if len(auteurs) != 1:
        continue
    a = auteurs.pop()
    if a not in AUTEURS:
        continue
    titre = meta(s, r'<title>(.*?) — The Journal')
    # Date affichee en tete d'article : « 06 JAN 2026 » (pas de balise meta).
    m = re.search(r'\b(\d{2}) (JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (\d{4})\b',
                  re.sub(r'<[^>]+>', ' ', s))
    date = '%s-%02d-%s' % (m.group(3), MOIS.index(m.group(2)) + 1, m.group(1)) if m else None
    if not titre or not date:
        sys.exit('ECHEC : titre ou date introuvable dans ' + f)
    image = meta(s, r'<meta property="og:image" content="([^"]+)"')
    if image and not image.startswith('https://blog-admin.digital-humans.fr/'):
        image = None
    art = {'titre': titre, 'description': meta(s, r'<meta name="description" content="([^"]*)"'),
           'image': image, 'date': date, 'url': 'https://digital-humans.fr/journal/%s.html' % slug}
    prenom = AUTEURS[a]
    if prenom not in par_agent or art['date'] > par_agent[prenom]['date']:
        par_agent[prenom] = art
print(json.dumps(par_agent, ensure_ascii=False, indent=2))
