#!/usr/bin/env python3
"""Repack du bundle Claude Design : remplace des ressources (par id) et le gabarit.
Usage : pack.py <index.html source> <dossier de travail> <sortie> <id1> [<id2> ...]
Convention d'echappement verifiee le 15/09 : seuls </script et </style sont ecrits <\\u002F..."""
import re, json, base64, gzip, sys
src_path, work, out_path, *ids = sys.argv[1:]
src = open(src_path, encoding='utf-8').read()
mm = re.search(r'(<script type="__bundler/manifest">)(.*?)(</script>)', src, re.S)
tm = re.search(r'(<script type="__bundler/template">)(.*?)(</script>)', src, re.S)
man_txt, tpl_txt = mm.group(2), tm.group(2)
def ser(s):
    c = json.dumps(s, ensure_ascii=False)
    for t in ('script','style'): c = c.replace('</'+t, '<\\u002F'+t)
    return c
assert ser(json.loads(tpl_txt)) == tpl_txt.strip(), 'convention de serialisation du gabarit non reproduite'
man = json.loads(man_txt)
for rid in ids:
    old = man[rid]['data']
    assert man_txt.count(old) == 1, rid
    new_txt = open(f'{work}/{rid}.js', encoding='utf-8').read().encode('utf-8')
    new = base64.b64encode(gzip.compress(new_txt) if man[rid]['compressed'] else new_txt).decode('ascii')
    man_txt = man_txt.replace(old, new); print('ressource remplacee :', rid, len(new_txt), 'octets')
tpl2 = open(f'{work}/template.html', encoding='utf-8').read()
lead = tpl_txt[:len(tpl_txt)-len(tpl_txt.lstrip())]; trail = tpl_txt[len(tpl_txt.rstrip()):]
out = src[:mm.start(2)] + man_txt + src[mm.end(2):tm.start(2)] + lead + ser(tpl2) + trail + src[tm.end(2):]
open(out_path,'w',encoding='utf-8').write(out); print('ecrit', out_path, len(out), 'octets')
