/**
 * Critere B.1.3 du brief de refonte : le site reconstruit doit dire EXACTEMENT
 * la meme chose que celui en ligne. Tout ecart de texte est un echec.
 *
 * Reference = la page servie aujourd'hui par digital-humans.fr, rejouee
 * localement : le gabarit et les six scripts du bundle `apercu-recent`
 * (conserves dans `_contenu-source/`, empreintes SHA-256 verifiees identiques
 * aux ressources du bundle en production le 18/09/2026), avec React 18.3.1 et
 * Babel, exactement comme en production. Le dossier de reference est fabrique
 * par `tests/construire-reference.mjs`.
 *
 * Candidat = le build Vite du depot (`dist/`).
 *
 * Les deux pages sont rendues dans le meme navigateur, leur texte visible est
 * extrait, normalise, puis compare ligne a ligne.
 *
 * Usage : node tests/parite-contenu.mjs <dossier-reference> [dossier-candidat]
 */
import { chromium } from 'playwright';
import { serve } from './serveur-statique.mjs';
import path from 'node:path';
import fs from 'node:fs';

const CHROME = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
const REF = path.resolve(process.argv[2] || '/tmp/claude-0/ref/site');
const CAND = path.resolve(process.argv[3] || 'dist');

const ROUTES = ['/', '/legal', '/cgv', '/privacy'];
const LANGS = ['fr', 'en'];

/** Texte visible, normalise : une ligne par ligne rendue, espaces resserres. */
function normalise(raw) {
  return raw
    .split('\n')
    .map(l => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

async function textOf(page, origin, route, lang) {
  await page.addInitScript(([l]) => {
    try {
      localStorage.setItem('dh-lang', l);
      localStorage.setItem('dh-theme', 'dark');
    } catch (e) { /* ignore */ }
  }, [lang]);
  await page.goto(origin + route, { waitUntil: 'load' });
  // La reference compile son JSX avec Babel dans le navigateur : on attend le
  // premier noeud rendu par React plutot qu'un delai arbitraire.
  await page.waitForSelector('header.glass, .legal-doc', { timeout: 30000 });
  await page.waitForFunction(() => document.body.innerText.trim().length > 200, null, { timeout: 30000 });
  return normalise(await page.evaluate(() => document.body.innerText));
}

function diff(a, b) {
  const out = [];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    if (a[i] !== b[i]) out.push({ i, ref: a[i], cand: b[i] });
  }
  return out;
}

const run = async () => {
  for (const d of [REF, CAND]) {
    if (!fs.existsSync(path.join(d, 'index.html'))) {
      console.error(`ECHEC : ${d}/index.html introuvable.`);
      process.exit(2);
    }
  }
  const ref = await serve(REF);
  const cand = await serve(CAND);
  const browser = await chromium.launch({ headless: true, executablePath: CHROME });

  let failures = 0;
  const report = [];
  for (const route of ROUTES) {
    for (const lang of LANGS) {
      const ctxA = await browser.newContext();
      const ctxB = await browser.newContext();
      const a = await textOf(await ctxA.newPage(), `http://127.0.0.1:${ref.port}`, route, lang);
      const b = await textOf(await ctxB.newPage(), `http://127.0.0.1:${cand.port}`, route, lang);
      await ctxA.close(); await ctxB.close();
      const d = diff(a, b);
      const label = `${route} [${lang}]`;
      if (d.length === 0) {
        report.push(`  OK   ${label.padEnd(20)} ${a.length} lignes identiques`);
      } else {
        failures += d.length;
        report.push(`  ECHEC ${label.padEnd(19)} ${d.length} ecart(s) sur ${Math.max(a.length, b.length)} lignes`);
        for (const e of d.slice(0, 12)) {
          report.push(`        ligne ${e.i}`);
          report.push(`          en ligne  : ${JSON.stringify(e.ref)}`);
          report.push(`          reconstruit: ${JSON.stringify(e.cand)}`);
        }
        if (d.length > 12) report.push(`        … ${d.length - 12} ecart(s) de plus`);
      }
    }
  }

  await browser.close();
  ref.server.close(); cand.server.close();

  console.log('Parite de contenu — site en ligne vs site reconstruit');
  console.log('  reference :', REF);
  console.log('  candidat  :', CAND);
  console.log(report.join('\n'));
  if (failures) {
    console.error(`\nECHEC : ${failures} ecart(s) de texte.`);
    process.exit(1);
  }
  console.log('\nOK : les deux sites disent exactement la meme chose.');
};

run().catch(e => { console.error('ECHEC :', e); process.exit(2); });
