/**
 * Tests des composants vitrines (mission docs/MISSION_VITRINES_2026.md).
 * Ecrits avant le code : ils doivent etre ROUGES sur le commit 4f51145.
 *
 *  T1  champ de saisie Sophie fonctionnel (frappe, Entree, bouton, prompt par onglet)
 *  T2  mention IA visible au premier rendu (FR/EN, intro jouee ou deja vue, 1488 et 390 px) :
 *      a la premiere image, la mention est dans la fenetre ; sinon (390 px, boite du heros
 *      sous la ligne de flottaison) elle doit l'etre « au premier contact avec la boite »
 *      (brief A.1) : defilement instantane jusqu'a la boite, verification a l'image suivante.
 *  T3  bandeau defilant present et boucle sans couture (piste dupliquee), pause au survol
 *  T4  prefers-reduced-motion coupe parallaxe et defilement (controle : sans reduce, actifs)
 *  T5  console vide FR/EN, clair/sombre, 1488 et 390 px (console, pageerror, requetes)
 *  T1b deux questions envoyees pendant une reponse lente : aucune n'est perdue (reprise 1)
 *  T6  hors reference : CTA studio -> app signup, demande de demo sans faux ticket,
 *      projet -> SDS ; chiffres RECALCULES depuis les SDS publiees et compares a
 *      content/sds-chiffres.json (reprise 3) ; contenu commun de l'accueil (tarifs FR+EN,
 *      puces, projets, agents) compare aux sources du bundle servi, _contenu-source/ (reprise 5)
 *
 * Aucun appel reseau reel vers le concierge : /api/public/concierge/* est intercepte.
 * Usage : CHROMIUM_PATH=… node tests/vitrines.mjs [dossier-candidat]
 */
import { chromium } from 'playwright';
import { serve } from './serveur-statique.mjs';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';

// Reprise D2 (revue passe 2) : contenu ATTENDU par carte, par onglet et par
// langue, lu dans les sources (content/*.ts) — et non « un litteral present
// quelque part dans le bundle », qui laissait passer une puce FR sur la page EN
// ou une puce Pro sur la carte Free.
const RACINE_DEPOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ATTENDU = await (async () => {
  const out = buildSync({ stdin: { contents: "export { PRICING_TIERS } from './content/pricing'; export { AGENTS, PROJETS } from './content/vitrines';",
    resolveDir: RACINE_DEPOT, loader: 'ts' }, bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'error' });
  return import('data:text/javascript;base64,' + Buffer.from(out.outputFiles[0].text).toString('base64'));
})();
const espaces = x => String(x).replace(/\s+/g, ' ').trim();

const CHROME = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
const CAND = path.resolve(process.argv[2] || 'dist');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHIFFRES = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/sds-chiffres.json'), 'utf-8'));

const MENTION = { fr: 'Vous échangez avec une IA. Elle peut se tromper.', en: 'You are talking to an AI. It can be wrong.' };
const DESKTOP = { width: 1488, height: 900 };
const MOBILE = { width: 390, height: 844 };

const resultats = [];
const ok = m => resultats.push('  OK    ' + m);
const ko = m => resultats.push('  ECHEC ' + m);
const verifie = (cond, m, detail) => (cond ? ok(m) : ko(m + (detail !== undefined ? ' — ' + detail : '')));

async function contexte(browser, { lang = 'fr', theme = 'dark', intro = 'vue', viewport = DESKTOP, reduced = 'no-preference' } = {}) {
  const ctx = await browser.newContext({ viewport, reducedMotion: reduced });
  await ctx.addInitScript(([l, t, i]) => {
    try {
      localStorage.setItem('dh-lang', l);
      localStorage.setItem('dh-theme', t);
      if (i === 'vue') localStorage.setItem('dh-intro-seen', '1');
    } catch (e) { /* ignore */ }
  }, [lang, theme, intro]);
  return ctx;
}

/** Visibilite stricte : dans la fenetre, opacite 1 sur toute la chaine, non recouvert. */
const VISIBLE = `(texte, racine) => {
  const tous = [...document.querySelectorAll((racine || 'body') + ' *')].filter(e => e.children.length === 0 && e.textContent.trim() === texte);
  const details = [];
  for (const e of tous) {
    const r = e.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) { details.push('taille nulle'); continue; }
    if (r.top < 0 || r.bottom > innerHeight || r.left < 0 || r.right > innerWidth) { details.push('hors fenetre ' + Math.round(r.top)); continue; }
    let n = e, opaque = true;
    while (n && n.nodeType === 1) { const cs = getComputedStyle(n); if (cs.visibility !== 'visible' || cs.display === 'none' || parseFloat(cs.opacity) < 1) { opaque = false; break; } n = n.parentElement; }
    if (!opaque) { details.push('opacite/visibilite'); continue; }
    const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    if (!(h === e || e.contains(h))) { details.push('recouvert par ' + (h ? h.tagName + '.' + h.className : 'rien')); continue; }
    // Reprise D3 (revue passe 2) : couleur et contraste. Seuil WCAG AA fixe
    // AVANT mesure : 4,5:1 (3:1 si grand texte). Fond effectif = composition
    // des fonds translucides des parents ; sans fond opaque, celui du body.
    const rgba = c => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const v = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number); return [v[0], v[1], v[2], v.length > 3 ? v[3] : 1]; };
    const csT = getComputedStyle(e), coul = rgba(csT.color);
    if (!coul || coul[3] < 0.5) { details.push('couleur transparente ' + csT.color); continue; }
    let fond = [0, 0, 0, 0]; let p = e;
    const sur = (haut, bas) => { const a = haut[3] + bas[3] * (1 - haut[3]); if (!a) return [0, 0, 0, 0]; return [0, 1, 2].map(i => (haut[i] * haut[3] + bas[i] * bas[3] * (1 - haut[3])) / a).concat([a]); };
    while (p && p.nodeType === 1 && fond[3] < 0.99) { const b = rgba(getComputedStyle(p).backgroundColor); if (b && b[3] > 0) fond = sur(fond, b); p = p.parentElement; }
    if (fond[3] < 0.99) fond = sur(fond, rgba(getComputedStyle(document.body).backgroundColor) || [255, 255, 255, 1]);
    const texte_c = sur(coul, fond);
    const lum = c => { const [r, g, b] = c.slice(0, 3).map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const L1 = lum(texte_c), L2 = lum(fond), ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const taille = parseFloat(csT.fontSize), gras = parseInt(csT.fontWeight) >= 700;
    const seuil = (taille >= 24 || (gras && taille >= 18.66)) ? 3 : 4.5;
    if (ratio < seuil) { details.push('contraste ' + ratio.toFixed(2) + ' < ' + seuil); continue; }
    return { visible: true, n: tous.length, contraste: Math.round(ratio * 100) / 100 };
  }
  return { visible: false, n: tous.length, details };
}`;

async function intercepterConcierge(page, envois) {
  await page.route('**/api/public/concierge/history/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.route('**/api/public/concierge/talk', async r => {
    envois.push(JSON.parse(r.request().postData() || '{}'));
    await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ reply: 'Réponse simulée par le test.', next_action: null }) });
  });
}

async function accueil(page, origin) {
  await page.goto(origin + '/', { waitUntil: 'load' });
  await page.waitForSelector('#who', { timeout: 15000 });
}

// ---------------------------------------------------------------- T1
async function t1(browser, origin) {
  const ctx = await contexte(browser);
  const page = await ctx.newPage();
  const envois = [];
  await intercepterConcierge(page, envois);
  try {
    await accueil(page, origin);
    const who = page.locator('section#who');
    await who.scrollIntoViewIfNeeded();
    const champ = who.getByRole('textbox');
    verifie(await champ.count() === 1, 'T1 #who : un seul champ de saisie dans la boite', await champ.count());
    const tag = await champ.evaluate(e => e.tagName + (e.readOnly ? ' readonly' : '') + (e.disabled ? ' disabled' : ''));
    verifie(tag === 'INPUT', 'T1 #who : vrai <input> modifiable', tag);
    verifie(await champ.getAttribute('placeholder') === 'Comment tu t’intègres à mon backlog existant ?', 'T1 #who : prompt de l’onglet DSI', await champ.getAttribute('placeholder'));

    await who.getByRole('tab', { name: 'Achats' }).click();
    await page.waitForFunction(() => document.querySelector('section#who input')?.placeholder.startsWith('Qu’est-ce que je signe'), null, { timeout: 3000 }).catch(() => {});
    verifie(await champ.getAttribute('placeholder') === 'Qu’est-ce que je signe exactement, et qu’est-ce qui reste chez moi ?', 'T1 #who : le prompt se reecrit pour l’onglet Achats', await champ.getAttribute('placeholder'));
    verifie(await who.getByRole('tab', { name: 'Achats' }).getAttribute('aria-selected') === 'true', 'T1 #who : onglet Achats selectionne (aria-selected)');

    const question = 'Combien de temps pour un premier SDS ?';
    await champ.fill(question);
    verifie(await champ.inputValue() === question, 'T1 #who : la frappe est conservee', await champ.inputValue());
    await champ.press('Enter');
    await page.waitForSelector('.sophie-drawer', { timeout: 3000 }).catch(() => {});
    await page.waitForFunction(() => document.querySelectorAll('.sophie-msg--assistant').length > 0 && document.body.innerText.includes('Réponse simulée'), null, { timeout: 4000 }).catch(() => {});
    verifie(envois.length === 1 && envois[0].message === question && envois[0].visitor_language === 'fr', 'T1 #who : Entree envoie la question tapee au concierge', JSON.stringify(envois));
    verifie(await page.locator('.sophie-msg--user', { hasText: question }).count() === 1, 'T1 #who : la question apparait dans le dialogue Sophie');
    verifie(await page.getByText('Réponse simulée par le test.').count() === 1, 'T1 #who : la reponse est affichee');
    verifie(await champ.inputValue() === '', 'T1 #who : champ vide apres envoi', await champ.inputValue());

    // Champ vide + bouton : la question suggeree (placeholder) est envoyee
    await page.locator('.sophie-drawer button[aria-label="Fermer"]').click().catch(() => {});
    const proc = page.locator('section#process');
    await proc.scrollIntoViewIfNeeded();
    const attendu = await proc.getByRole('textbox').getAttribute('placeholder');
    await proc.getByRole('button', { name: 'Envoyer à Sophie' }).click();
    for (let i = 0; i < 30 && envois.length < 2; i++) await page.waitForTimeout(100);
    verifie(attendu === 'Montre-moi comment tu transformes un brief en exigences.' && envois.length === 2 && envois[1].message === attendu,
      'T1 #process : champ vide + bouton envoie la question suggeree', JSON.stringify({ attendu, envois }));
  } catch (e) { ko('T1 exception : ' + e.message.split('\n')[0]); }
  await ctx.close();
}

// ---------------------------------------------------------------- T1b
async function t1b(browser, origin) {
  const ctx = await contexte(browser);
  const page = await ctx.newPage();
  const envois = [];
  await page.route('**/api/public/concierge/history/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.route('**/api/public/concierge/talk', async r => {
    const corps = JSON.parse(r.request().postData() || '{}');
    envois.push(corps.message);
    await new Promise(f => setTimeout(f, 2000)); // reponse lente : la 2e question arrive pendant la 1re
    await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ reply: 'Réponse à : ' + corps.message, next_action: null }) });
  });
  try {
    await accueil(page, origin);
    const who = page.locator('section#who');
    await who.scrollIntoViewIfNeeded();
    const champ = who.getByRole('textbox');
    await champ.fill('Question A');
    await champ.press('Enter');
    for (let i = 0; i < 30 && envois.length < 1; i++) await page.waitForTimeout(100);
    await page.locator('.sophie-drawer button[aria-label="Fermer"]').click().catch(() => {});
    await champ.fill('Question B');
    await champ.press('Enter');
    const apresB = await champ.inputValue();
    for (let i = 0; i < 80 && (envois.length < 2 || await page.getByText('Réponse à : Question B').count() === 0); i++) await page.waitForTimeout(100);
    const users = await page.locator('.sophie-msg--user').allTextContents();
    verifie(JSON.stringify(envois) === '["Question A","Question B"]', 'T1b les deux questions partent au concierge, dans l’ordre (aucune perdue)', JSON.stringify(envois));
    verifie(JSON.stringify(users) === '["Question A","Question B"]', 'T1b les deux questions sont affichees dans le dialogue', JSON.stringify(users));
    verifie(await page.getByText('Réponse à : Question A').count() === 1 && await page.getByText('Réponse à : Question B').count() === 1, 'T1b les deux reponses sont affichees');
    verifie(apresB === '', 'T1b champ vide apres la 2e question (elle est prise en charge, pas jetee)', apresB);
  } catch (e) { ko('T1b exception : ' + e.message.split('\n')[0]); }
  await ctx.close();
}

// ---------------------------------------------------------------- T1c
// Reprise D1 (revue passe 2) : Q1 echoue (HTTP 500) pendant que Q2 et Q3 sont
// en file. L'erreur doit suivre Q1, pas s'afficher a la fin apres REP<Q2>/REP<Q3>.
async function t1c(browser, origin) {
  const ctx = await contexte(browser);
  const page = await ctx.newPage();
  const envois = [];
  await page.route('**/api/public/concierge/history/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.route('**/api/public/concierge/talk', async r => {
    const corps = JSON.parse(r.request().postData() || '{}');
    envois.push(corps.message);
    await new Promise(f => setTimeout(f, 1200));
    if (corps.message === 'Q1') await r.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
    else await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ reply: 'REP<' + corps.message + '>', next_action: null }) });
  });
  try {
    await accueil(page, origin);
    const who = page.locator('section#who');
    await who.scrollIntoViewIfNeeded();
    const champ = who.getByRole('textbox');
    await champ.fill('Q1'); await champ.press('Enter');
    for (let i = 0; i < 30 && envois.length < 1; i++) await page.waitForTimeout(100);
    const tiroir = page.locator('.sophie-drawer textarea');
    for (const q of ['Q2', 'Q3']) { await tiroir.fill(q); await tiroir.press('Enter'); }
    for (let i = 0; i < 100 && await page.getByText('REP<Q3>').count() === 0; i++) await page.waitForTimeout(100);
    const bulles = await page.locator('.sophie-drawer-body .sophie-msg').evaluateAll(ns => ns.map(n =>
      (n.querySelector('.sophie-msg-bubble--error') ? 'ERREUR' : n.textContent.trim())));
    const iQ1 = bulles.indexOf('Q1');
    verifie(JSON.stringify(envois) === '["Q1","Q2","Q3"]', 'T1c les trois questions partent, dans l’ordre', JSON.stringify(envois));
    verifie(bulles.filter(b => b === 'ERREUR').length === 1, 'T1c une seule bulle d’erreur', JSON.stringify(bulles));
    verifie(iQ1 >= 0 && bulles[iQ1 + 1] === 'ERREUR', 'T1c l’erreur suit la question qui a echoue (Q1)', JSON.stringify(bulles));
    verifie(bulles.includes('REP<Q2>') && bulles.includes('REP<Q3>'), 'T1c les questions suivantes recoivent leur reponse', JSON.stringify(bulles));
  } catch (e) { ko('T1c exception : ' + e.message.split('\n')[0]); }
  await ctx.close();
}

// ---------------------------------------------------------------- T2
async function t2(browser, origin) {
  for (const viewport of [DESKTOP, MOBILE]) {
    for (const lang of ['fr', 'en']) {
      for (const intro of ['jouee', 'vue']) {
        const ctx = await contexte(browser, { lang, intro, viewport });
        const page = await ctx.newPage();
        const lab = `T2 ${viewport.width}px [${lang}] intro ${intro}`;
        try {
          await page.goto(origin + '/', { waitUntil: 'domcontentloaded' });
          await page.waitForFunction(t => document.body.innerText.includes(t), MENTION[lang], { timeout: 10000 });
          // premier rendu : la premiere image apres l'apparition du texte, sans attendre d'animation
          const r = await page.evaluate(`new Promise(res => requestAnimationFrame(() => res((${VISIBLE})(${JSON.stringify(MENTION[lang])}))))`);
          if (r.visible) ok(lab + ' : mention IA visible des la premiere image');
          else {
            const r2 = await page.evaluate(`new Promise(res => {
              const m = [...document.querySelectorAll('#top [data-mention-ia]')][0];
              if (!m) return res({ visible: false, details: ['pas de mention dans le heros'] });
              m.closest('.v-boite, [data-mention-ia]').scrollIntoView({ block: 'center', behavior: 'instant' });
              requestAnimationFrame(() => res((${VISIBLE})(${JSON.stringify(MENTION[lang])})));
            })`);
            verifie(r2.visible, lab + ' : mention IA sous la ligne de flottaison a la 1re image ; visible des le premier contact avec la boite du heros', JSON.stringify({ premiere: r, contact: r2 }));
          }
        } catch (e) { ko(lab + ' exception : ' + e.message.split('\n')[0]); }
        await ctx.close();
      }
    }
  }
  // chaque boite de vitrine porte la mention, visible quand la boite est a l'ecran
  const ctx = await contexte(browser, { lang: 'fr' });
  const page = await ctx.newPage();
  try {
    await accueil(page, origin);
    for (const id of ['who', 'process', 'agents', 'atelier']) {
      const boite = page.locator(`section#${id} [role="tablist"]`).first();
      if (!(await boite.count())) { ko(`T2 #${id} : pas de boite a onglets`); continue; }
      await boite.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      // Meme predicat strict qu'a la premiere image (fenetre, opacite 1 sur toute la
      // chaine, visibility, display, non recouverte), limite a la section (reprise 2).
      const r = await page.evaluate(`new Promise(res => {
        const sec = document.getElementById(${JSON.stringify(id)});
        const e = [...sec.querySelectorAll('[data-mention-ia]')][0];
        if (!e) return res({ visible: false, details: ['pas de [data-mention-ia] dans la section'] });
        e.scrollIntoView({ block: 'center', behavior: 'instant' });
        requestAnimationFrame(() => requestAnimationFrame(() => res((${VISIBLE})(${JSON.stringify(MENTION.fr)}, '#${id}'))));
      })`);
      verifie(r.visible, `T2 #${id} : la boite porte la mention IA, visible (stricte) une fois a l'ecran`, JSON.stringify(r));
    }
  } catch (e) { ko('T2 boites exception : ' + e.message.split('\n')[0]); }
  await ctx.close();
}

// ---------------------------------------------------------------- T3
const PISTES = `() => {
  const out = [];
  for (const e of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(e);
    if (cs.animationName.split(',').map(s => s.trim()).includes('dh-marquee')) {
      const enfants = [...e.children];
      const k = enfants.length / 2;
      const moitieA = enfants.slice(0, k).map(c => c.textContent).join('|');
      const moitieB = enfants.slice(k).map(c => c.textContent).join('|');
      const debutB = Number.isInteger(k) && k > 0 ? enfants[k].getBoundingClientRect().left - e.getBoundingClientRect().left : -1;
      const sec = e.closest('section');
      out.push({ section: sec ? (sec.id || 'pile') : '?', iteration: cs.animationIterationCount, pair: Number.isInteger(k),
                 dupliquee: Number.isInteger(k) && moitieA === moitieB && moitieA.length > 0,
                 couture: Math.abs(debutB - e.offsetWidth / 2), texte: moitieA.slice(0, 120) });
    }
  }
  return out;
}`;
async function t3(browser, origin) {
  const ctx = await contexte(browser);
  const page = await ctx.newPage();
  try {
    await accueil(page, origin);
    const pistes = await page.evaluate(`(${PISTES})()`);
    for (const id of ['who', 'process', 'agents', 'atelier']) {
      const p = pistes.find(x => x.section === id);
      verifie(!!p, `T3 #${id} : bandeau defilant present au bas du canevas`);
      if (!p) continue;
      verifie(p.iteration === 'infinite', `T3 #${id} : boucle infinie`, p.iteration);
      verifie(p.dupliquee, `T3 #${id} : piste dupliquee (deux moities identiques)`, p.texte);
      verifie(p.couture <= 1, `T3 #${id} : sans couture (2e moitie a exactement 50 % de la piste)`, p.couture.toFixed(2) + ' px');
    }
    const pile = pistes.filter(x => !['who', 'process', 'agents', 'atelier'].includes(x.section));
    verifie(pile.length >= 1 && pile.every(p => p.dupliquee && p.couture <= 1 && p.iteration === 'infinite'), 'T3 bandeau « Ce que l’équipe maîtrise » present, duplique, sans couture', JSON.stringify(pile));

    // contenu : label laiton + titre + texte, et lien vers l'article du Journal (Sophie)
    const who = page.locator('section#who');
    const tw = await who.evaluate(s => s.textContent); // innerText appliquerait text-transform
    verifie(tw.includes('Le gain') && tw.includes('Ce qu’on garantit'), 'T3 #who : bandeau avec « Le gain » et « Ce qu’on garantit »');
    const lien = page.locator('section#agents a[href^="https://digital-humans.fr/journal/"]');
    verifie(await lien.count() >= 1, 'T3 #agents : « Ce qu’il écrit » renvoie a un article reel du Journal (lien)', await lien.count());

    // pause au survol
    await who.scrollIntoViewIfNeeded();
    const piste = who.locator('[data-piste]').first();
    if (await piste.count()) {
      // La piste defile et deborde largement du canevas : on survole le centre VISIBLE du bandeau.
      const c = await piste.evaluate(e => { const r = e.parentElement.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
      await page.mouse.move(c.x, c.y);
      await page.waitForTimeout(200);
      const etat = await piste.evaluate(e => getComputedStyle(e).animationPlayState);
      verifie(etat === 'paused', 'T3 #who : pause au survol', etat);
    } else ko('T3 #who : piste [data-piste] introuvable pour le survol');
  } catch (e) { ko('T3 exception : ' + e.message.split('\n')[0]); }
  await ctx.close();
}

// ---------------------------------------------------------------- T4
async function mesurerMouvement(browser, origin, reduced) {
  const ctx = await contexte(browser, { reduced });
  const page = await ctx.newPage();
  await accueil(page, origin);
  await page.waitForTimeout(1200);
  const prendre = async y => {
    await page.evaluate(y => window.scrollTo(0, y), y);
    await page.waitForTimeout(250);
    return page.evaluate(() => {
      const sec = document.getElementById('who');
      const f = sec.querySelector('[data-parallaxe="fond"]');
      const b = sec.querySelector('[data-parallaxe="boite"]');
      return { fond: f ? getComputedStyle(f).transform : null, boite: b ? getComputedStyle(b).transform : null };
    });
  };
  const top = await page.evaluate(() => document.getElementById('who').getBoundingClientRect().top + scrollY);
  const a = await prendre(top - 500);
  const b = await prendre(top - 100);
  // toutes les animations CSS, en pause ou non (les bandeaux hors ecran sont en pause, regle A.3.6)
  const anims = await page.evaluate(() => document.getAnimations().filter(x => x.constructor.name === 'CSSAnimation').map(x => x.animationName));
  await ctx.close();
  return { a, b, anims };
}
async function t4(browser, origin) {
  try {
    const libre = await mesurerMouvement(browser, origin, 'no-preference');
    const reduit = await mesurerMouvement(browser, origin, 'reduce');
    // controle : sans reduce, la parallaxe bouge et le defilement tourne
    verifie(libre.a.fond !== null && libre.a.boite !== null, 'T4 controle : couches de parallaxe presentes (fond, boite)', JSON.stringify(libre.a));
    verifie(libre.a.fond !== libre.b.fond && libre.a.boite !== libre.b.boite, 'T4 controle : sans reduce, fond et boite se deplacent au defilement', JSON.stringify(libre));
    verifie(libre.anims.filter(n => n === 'dh-marquee').length >= 5, 'T4 controle : sans reduce, au moins 5 bandeaux animes', libre.anims.join(','));
    // reduce
    verifie(reduit.a.fond === reduit.b.fond && reduit.a.boite === reduit.b.boite, 'T4 reduce : fond et boite immobiles au defilement', JSON.stringify(reduit));
    verifie(reduit.anims.length === 0, 'T4 reduce : aucune animation CSS en cours (bandeaux, connecteurs, intro)', reduit.anims.join(','));
  } catch (e) { ko('T4 exception : ' + e.message.split('\n')[0]); }
}

// ---------------------------------------------------------------- T5
async function t5(browser, origin) {
  for (const viewport of [DESKTOP, MOBILE]) {
    for (const lang of ['fr', 'en']) {
      for (const theme of ['dark', 'light']) {
        const ctx = await contexte(browser, { lang, theme, viewport, intro: 'jouee' });
        const page = await ctx.newPage();
        const bruit = [];
        page.on('console', m => bruit.push(`console.${m.type()}: ${m.text()}`));
        page.on('pageerror', e => bruit.push('pageerror: ' + e.message));
        page.on('requestfailed', r => bruit.push('requestfailed: ' + r.url() + ' ' + (r.failure()?.errorText || '')));
        page.on('response', r => { if (r.status() >= 400) bruit.push('http ' + r.status() + ' ' + r.url()); });
        const lab = `T5 ${viewport.width}px [${lang}] ${theme}`;
        try {
          await page.goto(origin + '/', { waitUntil: 'networkidle' });
          const h = await page.evaluate(() => document.body.scrollHeight);
          for (let y = 0; y < h; y += 600) { await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(120); }
          await page.waitForTimeout(800);
          verifie(bruit.length === 0, lab + ' : console vide, aucune erreur ni requete en echec', bruit.slice(0, 5).join(' | '));
        } catch (e) { ko(lab + ' exception : ' + e.message.split('\n')[0]); }
        await ctx.close();
      }
    }
  }
}

// ---------------------------------------------------------------- T6
async function t6(browser, origin) {
  const ctx = await contexte(browser);
  const page = await ctx.newPage();
  const envois = [];
  page.on('request', r => { if (r.method() !== 'GET') envois.push(r.method() + ' ' + r.url()); });
  try {
    await accueil(page, origin);
    const prix = await page.locator('section#pricing').innerText().catch(() => '');
    for (const t of ['Modèle Nemotron, hébergé en Europe', '79€', '1 490€', 'HT · TVA en sus', 'Sur devis'])
      verifie(prix.includes(t), `T6 tarifs : « ${t} »`);
    verifie(!/annuel|annual|yearly/i.test(prix), 'T6 tarifs : pas de bascule annuelle');
    const studio = page.getByRole('link', { name: 'Entrer dans le studio' });
    verifie(await studio.count() >= 1 && (await studio.first().getAttribute('href')) === 'https://app.digital-humans.fr/signup', 'T6 CTA « Entrer dans le studio » -> app.digital-humans.fr/signup');
    verifie(await page.locator('a[href^="mailto:"]').count() === 0, 'T6 aucun lien mailto sur l’accueil');

    await page.locator('section#cta').getByRole('button', { name: /Demander une démo/ }).click();
    const dlg = page.getByRole('dialog');
    await dlg.waitFor({ timeout: 3000 });
    const td = await dlg.innerText();
    verifie(td.includes('TODO') && td.includes('Email-to-Case'), 'T6 demo : TODO visible (adresse Email-to-Case non fournie)', td.slice(0, 200));
    const envoyer = dlg.getByRole('button', { name: /Créer le ticket/ });
    verifie(await envoyer.count() === 1 && await envoyer.isDisabled(), 'T6 demo : envoi desactive tant que le routage n’existe pas');
    await dlg.getByLabel(/E-mail/).fill('test@example.com').catch(() => {});
    await dlg.getByLabel(/besoin/i).fill('Un besoin Salesforce de test').catch(() => {});
    await envoyer.click({ force: true, timeout: 1000 }).catch(() => {});
    await page.waitForTimeout(300);
    verifie(!(await dlg.innerText()).includes('Ticket créé') && envois.length === 0, 'T6 demo : aucun faux « Ticket créé », aucune requete envoyee', envois.join(','));
    await page.keyboard.press('Escape');

    // correspondance projet -> SDS, et la page affiche les chiffres de content/sds-chiffres.json
    const atelier = page.locator('section#atelier');
    await atelier.scrollIntoViewIfNeeded();
    const attendu = { 'LogiFleet': 146, 'Clinical Trial Watch': 148, 'Claim Resolver': 179, 'Pipeline Tuner': 176, 'Grid Foresight': 177, 'Omnichannel Loop': 178 };
    for (const [nom, id] of Object.entries(attendu)) {
      await atelier.getByRole('tab', { name: nom }).click().catch(() => {});
      await page.waitForTimeout(450);
      const href = await atelier.getByRole('link', { name: /Lire le SDS complet/ }).getAttribute('href').catch(() => null);
      const txt = await atelier.innerText().catch(() => '');
      const c = CHIFFRES[String(id)];
      const chiffres = [c.exigences, c.cas_usage, c.objets, c.flux].every(v => new RegExp('(^|\\n)' + v + '\\n').test(txt));
      verifie(href === `https://digital-humans.fr/sds-preview/${id}.html` && chiffres, `T6 Atelier ${nom} -> SDS ${id} ; la page affiche les chiffres de content/sds-chiffres.json`, `${href} ${JSON.stringify(c)}`);
    }
  } catch (e) { ko('T6 exception : ' + e.message.split('\n')[0]); }
  await ctx.close();
}

// ---------------------------------------------------------------- T6 bis : chiffres recalcules depuis les SDS publiees
/** Recalcul independant (JS) des regles d'outils/chiffres-sds.py, sur le CORPS de la SDS servie. */
function chiffresDepuisSds(html) {
  let t = html.replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, '|').replace(/&mdash;|&#8212;/g, '—');
  t = t.replace(/\s*\|[\s|]*/g, ' | ');
  const dernier = (re, txt) => { const m = [...txt.matchAll(re)]; return m.length ? Number(m[m.length - 1][1]) : null; };
  const i = t.indexOf('6.1 Data Model');
  const corps = i >= 0 ? t.slice(i) : '';
  return {
    exigences: new Set(t.match(/\bBR-\d{3}\b/g) || []).size || null,
    cas_usage: dernier(/Use Cases — (\d+) UCs/g, t),
    objets: corps ? dernier(/6\.2 Custom Objects \| \((\d+)\)/g, corps) : null,
    flux: corps ? dernier(/Automation Design \| Flows \((\d+)\)/g, corps) : null,
  };
}
async function t6bis() {
  for (const id of ['146', '148', '176', '177', '178', '179']) {
    const url = `https://digital-humans.fr/sds-preview/${id}.html`;
    let mesure = null, erreur = '';
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (r.status !== 200) erreur = 'HTTP ' + r.status; else mesure = chiffresDepuisSds(await r.text());
    } catch (e) { erreur = 'injoignable (' + (e.cause?.code || e.name) + ')'; }
    if (!mesure) { ko(`T6 SDS ${id} : chiffres recalcules depuis la SDS publiee — ${erreur}`); continue; }
    const json = CHIFFRES[id];
    const manque = Object.entries(mesure).filter(([, v]) => v === null).map(([k]) => k);
    verifie(!manque.length && JSON.stringify(mesure) === JSON.stringify(json),
      `T6 SDS ${id} : chiffres recalcules depuis ${url} = content/sds-chiffres.json`,
      manque.length ? 'introuvable : ' + manque.join(',') : `SDS ${JSON.stringify(mesure)} / JSON ${JSON.stringify(json)}`);
  }
}

// ---------------------------------------------------------------- T6 ter : contenu commun = sources du bundle servi
const SOURCE = ['app_contenu.js', 'benefits_howitworks.js'].map(f => fs.readFileSync(path.join(ROOT, '_contenu-source', f), 'utf-8')).join('\n');
/** Vrai si `s` figure tel quel comme litteral '…' dans les sources du bundle (empreintes : outils/extraire-bundle.py). */
const litteral = s => SOURCE.includes(`'${s}'`);
/** Citation affichee = une ou plusieurs lignes du bundle jointes par une espace. */
const citation = q => litteral(q) || [...q.matchAll(/ /g)].some(m => litteral(q.slice(0, m.index)) && citation(q.slice(m.index + 1)));
async function t6ter(browser, origin) {
  for (const lang of ['fr', 'en']) {
    const ctx = await contexte(browser, { lang });
    const page = await ctx.newPage();
    try {
      await accueil(page, origin);
      // tarifs : chaque element affiche est un litteral du bundle ; 4 cartes, 15 puces
      const t = await page.evaluate(() => {
        const n = e => e.textContent.replace(/\s+/g, ' ').replace(/\s*→\s*$/, '').trim();
        const sec = document.getElementById('pricing');
        const cartes = [...sec.querySelectorAll('.v-offre')];
        const elems = cartes.flatMap(c => [...c.querySelectorAll('.v-offre-acc, .v-prix-m, .v-prix-p, .v-prix-tva, .v-quota, li > span:last-child, .v-offre-note, .v-offre-cta')]).map(n).filter(Boolean);
        return { cartes: cartes.length, puces: sec.querySelectorAll('li').length, elems };
      });
      const absents = t.elems.filter(e => !litteral(e));
      const cartesD2 = await page.evaluate(() => [...document.querySelectorAll('#pricing .v-offre')].slice(0, 3).map(c => ({
        nom: c.querySelector('h3').textContent, acc: c.querySelector('.v-offre-acc').textContent,
        prix: c.querySelector('.v-prix-m').textContent, puces: [...c.querySelectorAll('li > span:last-child')].map(x => x.textContent) })));
      const ecartsD2 = [];
      ATTENDU.PRICING_TIERS.forEach((tier, i) => {
        const c = cartesD2[i] || {};
        const att = { nom: tier.name[lang], acc: tier.tagline[lang], prix: tier.price[lang], puces: tier.bullets[lang] };
        for (const k of Object.keys(att)) if (JSON.stringify(Array.isArray(att[k]) ? att[k].map(espaces) : espaces(att[k])) !== JSON.stringify(Array.isArray(c[k]) ? c[k].map(espaces) : espaces(c[k] ?? ''))) ecartsD2.push(`${tier.id}.${k}`);
      });
      verifie(ecartsD2.length === 0, `T6 tarifs [${lang}] : chaque carte porte le nom, l’accroche, le prix et les puces de SON palier, dans SA langue`, JSON.stringify(ecartsD2));
      verifie(t.cartes === 4 && t.puces === 15 && absents.length === 0, `T6 tarifs [${lang}] : 4 cartes, 15 puces, chaque texte affiche est un litteral du bundle servi`,
        JSON.stringify({ cartes: t.cartes, puces: t.puces, absents }));
      // projets : secteur et brief de chaque onglet
      const at = page.locator('section#atelier');
      await at.scrollIntoViewIfNeeded();
      const absP = [];
      for (let i = 0; i < 6; i++) {
        await at.getByRole('tab').nth(i).click();
        await page.waitForTimeout(450);
        const v = await at.evaluate(s => [s.querySelector('.v-legende-role').textContent, s.querySelector('.v-legende-cit').textContent]);
        v.filter(x => !litteral(x)).forEach(x => absP.push(x.slice(0, 60)));
        const pr = ATTENDU.PROJETS[i];
        if (espaces(v[0]) !== espaces(pr.sector[lang]) || espaces(v[1]) !== espaces(pr.brief[lang])) absP.push(`D2 onglet ${i} (${pr.name}) : secteur/brief d’un autre projet ou d’une autre langue`);
      }
      verifie(absP.length === 0, `T6 Atelier [${lang}] : secteur et brief des 6 projets = textes du bundle servi`, JSON.stringify(absP));
      // agents : role et citation de chaque onglet
      const ag = page.locator('section#agents');
      await ag.scrollIntoViewIfNeeded();
      const absA = [];
      for (let i = 0; i < 11; i++) {
        await ag.getByRole('tab').nth(i).click();
        await page.waitForTimeout(450);
        const [role, cit] = await ag.evaluate(s => [s.querySelector('.v-legende-role').textContent, s.querySelector('.v-legende-cit').textContent]);
        if (!litteral(role)) absA.push('role:' + role);
        if (!citation(cit)) absA.push('citation:' + cit.slice(0, 60));
        const agt = ATTENDU.AGENTS[i];
        if (espaces(role) !== espaces(agt.role[lang])) absA.push(`D2 role ${agt.first} : attendu ${agt.role[lang]}`);
        if (espaces(cit) !== espaces(agt.quote[lang])) absA.push(`D2 citation ${agt.first} : pas celle de l’agent dans cette langue`);
      }
      verifie(absA.length === 0, `T6 L’Ensemble [${lang}] : role et citation des 11 agents = textes du bundle servi`, JSON.stringify(absA));
    } catch (e) { ko(`T6 contenu commun [${lang}] exception : ` + e.message.split('\n')[0]); }
    await ctx.close();
  }
}

const run = async () => {
  if (!fs.existsSync(path.join(CAND, 'index.html'))) { console.error('ECHEC : ' + CAND + '/index.html introuvable'); process.exit(2); }
  const srv = await serve(CAND);
  const origin = `http://127.0.0.1:${srv.port}`;
  const browser = await chromium.launch({ headless: true, executablePath: CHROME });
  for (const t of [t1, t1b, t1c, t2, t3, t4, t5, t6, t6ter]) await t(browser, origin);
  await t6bis();
  await browser.close();
  srv.server.close();
  console.log('Vitrines — tests navigateur');
  console.log('  candidat :', CAND);
  console.log(resultats.join('\n'));
  const n = resultats.filter(r => r.includes('ECHEC')).length;
  if (n) { console.error(`\nECHEC : ${n} controle(s) en echec sur ${resultats.length}.`); process.exit(1); }
  console.log(`\nOK : ${resultats.length} controles.`);
};
run().catch(e => { console.error('ECHEC :', e); process.exit(2); });
