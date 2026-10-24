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
 *  T6  hors reference : tarifs, CTA studio -> app signup, demande de demo sans faux ticket,
 *      chiffres SDS mesures
 *
 * Aucun appel reseau reel vers le concierge : /api/public/concierge/* est intercepte.
 * Usage : CHROMIUM_PATH=… node tests/vitrines.mjs [dossier-candidat]
 */
import { chromium } from 'playwright';
import { serve } from './serveur-statique.mjs';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

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
const VISIBLE = `(texte) => {
  const tous = [...document.querySelectorAll('body *')].filter(e => e.children.length === 0 && e.textContent.trim() === texte);
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
    return { visible: true, n: tous.length };
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
      const r = await page.evaluate(([id, t]) => {
        const sec = document.getElementById(id);
        const e = [...sec.querySelectorAll('*')].find(x => x.children.length === 0 && x.textContent.trim() === t);
        if (!e) return { present: false };
        e.scrollIntoView({ block: 'center' });
        const b = e.getBoundingClientRect();
        const h = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
        return { present: true, recouvert: !(h === e || e.contains(h)) };
      }, [id, MENTION.fr]);
      verifie(r.present && !r.recouvert, `T2 #${id} : la boite porte la mention IA, non recouverte`, JSON.stringify(r));
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

    // chiffres de l'Atelier = SDS mesurees, et correspondance projet -> SDS
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
      verifie(href === `https://digital-humans.fr/sds-preview/${id}.html` && chiffres, `T6 Atelier ${nom} -> SDS ${id}, chiffres mesures`, `${href} ${JSON.stringify(c)}`);
    }
  } catch (e) { ko('T6 exception : ' + e.message.split('\n')[0]); }
  await ctx.close();
}

const run = async () => {
  if (!fs.existsSync(path.join(CAND, 'index.html'))) { console.error('ECHEC : ' + CAND + '/index.html introuvable'); process.exit(2); }
  const srv = await serve(CAND);
  const origin = `http://127.0.0.1:${srv.port}`;
  const browser = await chromium.launch({ headless: true, executablePath: CHROME });
  for (const t of [t1, t2, t3, t4, t5, t6]) await t(browser, origin);
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
