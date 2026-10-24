#!/usr/bin/env python3
"""Decoupe les donnees de la reference visuelle validee le 18/09 dans un module TS.

Source (lecture seule) : /var/www/dh-preview/refonte/index.html, servie sous
https://digital-humans.fr/refonte/. Les blocs de donnees de `renderVals()` sont
recopies LIGNE POUR LIGNE (aucune saisie) dans content/reference-vitrines.ts,
avec la meme fonction `P(fr, en)` que la reference (elle rend ici {fr, en}).
Chaque bloc est repere par sa premiere ligne attendue ; si la reference change,
le script echoue au lieu de decouper au mauvais endroit.

Les corrections de contenu (verite = site en ligne et SDS publiees) ne sont PAS
faites ici : elles sont dans content/vitrines.ts, lisibles et commentees.

Usage : decouper-reference.py [index.html] > content/reference-vitrines.ts
"""
import hashlib, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else '/var/www/dh-preview/refonte/index.html'
brut = open(SRC, 'rb').read()
L = brut.decode('utf-8').split('\n')

def bloc(debut, fin_incluse_prefixe):
    """Lignes depuis la ligne commencant (apres espaces) par `debut` jusqu'a la
    premiere ligne suivante commencant par `fin_incluse_prefixe` (incluse)."""
    i = [k for k, l in enumerate(L) if l.strip().startswith(debut)]
    if len(i) != 1:
        sys.exit('ECHEC : %r trouve %d fois' % (debut, len(i)))
    i = i[0]
    for j in range(i, len(L)):
        if L[j].strip().startswith(fin_incluse_prefixe):
            return i + 1, j + 1, L[i:j + 1]
    sys.exit('ECHEC : fin %r introuvable apres %r' % (fin_incluse_prefixe, debut))

blocs = [
    ('photos agents', bloc('const PHOTO = {', 'const PHOTO = {')),
    ('mention IA', bloc('const aiNotice = ', 'const aiNotice = ')),
    ('artefacts', bloc('const ART = ', 'const pad4 = ')),
    ('cas du heros', bloc('const CASES = [', '];')),
    ('agents', bloc('const AGENTS = [', '];')),
    ('roles', bloc('const ROLES = [', '];')),
    ('etapes', bloc('const STEPS = [', '];')),
    ('projets', bloc('const PROJECTS = [', '];')),
    ('libelles chiffres', bloc('const STAT_LABELS = ', 'const STAT_LABELS = ')),
    ('photos etapes', bloc('const ETAPE_PHOTO=', 'const ETAPE_PHOTO=')),
    ('photos projets', bloc('const PROJET_PHOTO=', 'const PROJET_PHOTO=')),
    ('photos roles', bloc('const ROLE_PHOTO=', 'const ROLE_PHOTO=')),
    ('faq', bloc('const FAQ = [', '];')),
    ('pile', bloc('const stack = [', 'const stack = [')),
]
geo = bloc('const twoCol = W >= 1120;', "const nodeW = wide ? '33%' : '46%';")
bande = bloc('const bandWidth = ', 'const bandDisplay = ')

o = []
o.append('// GENERE par outils/decouper-reference.py — NE PAS MODIFIER A LA MAIN.')
o.append('// Source : /var/www/dh-preview/refonte/index.html (%d octets, sha256 %s…),' % (len(brut), hashlib.sha256(brut).hexdigest()[:16]))
o.append('// reference visuelle validee par Sam le 18/09/2026. Lignes recopiees telles quelles :')
for nom, (a, b, _) in blocs + [('geometrie', geo), ('bandes du heros', bande)]:
    o.append('//   %-18s lignes %d-%d' % (nom, a, b))
o.append('// Les corrections de contenu sont dans content/vitrines.ts.')
o.append('// @ts-nocheck')
o.append('/* eslint-disable */')
o.append('export interface Bi { fr: string; en: string }')
o.append('const P = (fr: string, en: string): Bi => ({ fr, en });')
o.append('')
o.append('export function donneesReference() {')
for nom, (a, b, lignes) in blocs:
    o.append('  // --- %s (l. %d-%d)' % (nom, a, b))
    o.extend(lignes)
o.append('  return { PHOTO, aiNotice, ART, A, BARS, pad4, CASES, AGENTS, ROLES, STEPS, PROJECTS, STAT_LABELS,')
o.append('    ETAPE_PHOTO, PROJET_PHOTO, ROLE_PHOTO, FAQ, stack };')
o.append('}')
o.append('')
o.append('/** Geometrie de la reference, fonction de la largeur de fenetre W. */')
o.append('export function geometrieReference(W: number) {')
o.append('  // --- bandes du heros (l. %d-%d)' % bande[:2])
o.extend(bande[2])
o.append('  // --- geometrie (l. %d-%d)' % geo[:2])
o.extend(geo[2])
o.append('  return { bandWidth, bandDisplay, twoCol, canvasW, gridCols, wide, VIGNETTE, POS, EDGES, nodeW };')
o.append('}')
print('\n'.join(o))
