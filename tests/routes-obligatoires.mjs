/**
 * Tests B.3.1 et B.3.2 du brief.
 *
 *  1. /legal, /cgv, /privacy repondent et rendent leur document, en FR et EN,
 *     avec les clauses IA (reglement UE 2024/1689, art. 50), le SIRET et la
 *     mention « TVA en cours d'attribution ».
 *  2. Les six liens SDS de l'Atelier sont presents sur la page d'accueil.
 *
 * La resolution HTTP des six SDS n'est pas verifiable depuis ce conteneur
 * (egress ferme vers digital-humans.fr) : elle a ete mesuree depuis le serveur
 * le 18/09/2026, les six repondent 200 (voir docs/PORTAGE_CONTENU_2026.md).
 *
 * Usage : node tests/routes-obligatoires.mjs [dossier-candidat]
 */
import { chromium } from 'playwright';
import { serve } from './serveur-statique.mjs';
import path from 'node:path';

const CHROME = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
const CAND = path.resolve(process.argv[2] || 'dist');

const SDS = [146, 148, 176, 177, 178, 179]
  .map(n => `https://digital-humans.fr/sds-preview/${n}.html`);

// Formulations exactes attendues, par route et par langue.
const ATTENDU = {
  '/legal': {
    fr: [
      'SIRET : 343 172 490 00033',
      "Num\u00e9ro de TVA intracommunautaire : en cours d'attribution.",
      "syst\u00e8me d'intelligence artificielle au sens du r\u00e8glement (UE) 2024/1689",
      "conform\u00e9ment \u00e0 l'article 50 du r\u00e8glement",
    ],
    en: [
      'Business registration (SIRET): 343 172 490 00033',
      'VAT registration: application in progress.',
      'artificial intelligence system within the meaning of Regulation (EU) 2024/1689',
      'in accordance with Article 50 of the Regulation',
    ],
  },
  '/cgv': {
    fr: ["Les prix indiqu\u00e9s s'entendent hors taxes (HT)."],
    en: ['Prices are stated excluding tax.'],
  },
  '/privacy': {
    fr: ['Tout incident de s\u00e9curit\u00e9 affectant des donn\u00e9es personnelles serait notifi\u00e9 \u00e0 la CNIL'],
    en: ['Any security incident affecting personal data would be notified to the data protection authority'],
  },
};

const results = [];
const fail = m => { results.push('  ECHEC ' + m); };
const ok = m => { results.push('  OK    ' + m); };

async function pageText(browser, origin, route, lang) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.addInitScript(([l]) => {
    try { localStorage.setItem('dh-lang', l); localStorage.setItem('dh-theme', 'dark'); } catch (e) {}
  }, [lang]);
  const res = await page.goto(origin + route, { waitUntil: 'load' });
  await page.waitForSelector('header.glass, .legal-doc', { timeout: 30000 });
  const status = res ? res.status() : 0;
  const text = await page.evaluate(() => document.body.innerText);
  const html = await page.content();
  await ctx.close();
  return { status, text, html };
}

const run = async () => {
  const srv = await serve(CAND);
  const origin = `http://127.0.0.1:${srv.port}`;
  const browser = await chromium.launch({ headless: true, executablePath: CHROME });

  // 1 — routes legales
  for (const [route, parLangue] of Object.entries(ATTENDU)) {
    for (const [lang, phrases] of Object.entries(parLangue)) {
      const { status, text } = await pageText(browser, origin, route, lang);
      if (status !== 200) { fail(`${route} [${lang}] : statut ${status}`); continue; }
      const manquantes = phrases.filter(p => !text.includes(p));
      if (manquantes.length) fail(`${route} [${lang}] : absent ${JSON.stringify(manquantes)}`);
      else ok(`${route} [${lang}] : 200, ${phrases.length} mention(s) presente(s)`);
    }
  }

  // 2 — les six liens SDS de l'Atelier
  const { html } = await pageText(browser, origin, '/', 'fr');
  const manquants = SDS.filter(u => !html.includes(u));
  if (manquants.length) fail(`Atelier : ${manquants.length} lien(s) SDS absent(s) : ${manquants.join(', ')}`);
  else ok(`Atelier : les ${SDS.length} liens SDS sont presents`);

  await browser.close();
  srv.server.close();

  console.log('Routes obligatoires — /legal, /cgv, /privacy, liens SDS');
  console.log('  candidat :', CAND);
  console.log(results.join('\n'));
  const ko = results.filter(r => r.includes('ECHEC')).length;
  if (ko) { console.error(`\nECHEC : ${ko} controle(s) en echec.`); process.exit(1); }
  console.log('\nOK : tous les controles passent.');
};

run().catch(e => { console.error('ECHEC :', e); process.exit(2); });
