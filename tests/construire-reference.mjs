/**
 * Fabrique une copie jouable de la page servie aujourd'hui par
 * digital-humans.fr, a partir des sources conservees dans `_contenu-source/`.
 *
 * Ces sources sont les ressources du bundle `apercu-recent/index.html` : leurs
 * empreintes SHA-256 ont ete verifiees identiques a celles du bundle en
 * production le 18/09/2026 (voir docs/PORTAGE_CONTENU_2026.md). Le gabarit et
 * les six scripts sont recopies tels quels ; seules les trois balises de
 * runtime (React 18.3.1, ReactDOM, Babel), embarquees dans le bundle, sont
 * remplacees par les memes versions installees depuis npm.
 *
 * Usage : node tests/construire-reference.mjs [dossier-de-sortie]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Les runtimes de reference vivent dans leur propre arbre : le depot depend de
// React 19, la page en ligne tourne sous React 18.3.1.
const RUNTIME_DIR = path.join(ROOT, 'tests/.runtime/node_modules');
const OUT = path.resolve(process.argv[2] || '/tmp/dh-reference');
const SRC = path.join(ROOT, '_contenu-source');

// Identifiants des ressources dans le manifeste du bundle.
const RUNTIME = {
  'e03eb37b-e93c-465d-95fa-ef6801f4b5a3': 'react/umd/react.development.js',
  '6633b62e-97d2-4947-9f72-56d63e72e82a': 'react-dom/umd/react-dom.development.js',
  '29972f31-e2c2-4762-88d2-105144f08352': '@babel/standalone/babel.min.js',
};
const SCRIPTS = {
  'b7ddfc56-c91a-475b-8210-cdc552a1589d': 'header_hero.js',
  '6641f2bf-70da-46eb-a716-a60b6030f1c7': 'benefits_howitworks.js',
  'b077057a-5a3a-41a8-8f45-fe3c0011a134': 'app_contenu.js',
  'a1b2c3d4-e5f6-4789-9abc-def012345678': 'legal_data.js',
  'b41ed13f-c6c3-4e60-adb9-cad7e009b92b': 'sophie_chat.js',
  '0fbb2257-1e12-4e49-857e-4774d4dc6847': 'site_racine.js',
};

fs.mkdirSync(OUT, { recursive: true });
let html = fs.readFileSync(path.join(SRC, 'gabarit_page.html'), 'utf-8');

for (const [id, mod] of Object.entries(RUNTIME)) {
  const resolved = path.join(RUNTIME_DIR, mod);
  if (!fs.existsSync(resolved)) {
    console.error(`ECHEC : ${mod} introuvable sous ${RUNTIME_DIR}.`);
    console.error('  npm run test:runtime-reference');
    process.exit(2);
  }
  fs.copyFileSync(resolved, path.join(OUT, id + '.js'));
  html = html.replace(`<script src="${id}"`, `<script src="${id}.js"`);
}
// Les attributs d'integrite portent sur les ressources du bundle, pas sur les
// copies npm : ils sont retires avec le meme empreintement que le bundle.
html = html.replace(/ integrity="[^"]*" crossorigin="anonymous"/g, '');

for (const [id, file] of Object.entries(SCRIPTS)) {
  fs.copyFileSync(path.join(SRC, file), path.join(OUT, id + '.js'));
  html = html.replace(`src="${id}"`, `src="${id}.js"`);
}

const restants = html.match(/src="[0-9a-f]{8}-[0-9a-f-]{27}"/g);
if (restants) { console.error('ECHEC : ressources non resolues', restants); process.exit(2); }

fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log('reference ecrite dans', OUT);
