import { useEffect, useLayoutEffect, useRef, useState, RefObject } from 'react';

const REQUETE_REDUIT = '(prefers-reduced-motion: reduce)';

/** Vrai si l'utilisateur demande moins d'animation (suit les changements). */
export function useReduit(): boolean {
  const [reduit, setReduit] = useState(() => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(REQUETE_REDUIT).matches);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(REQUETE_REDUIT);
    const f = () => setReduit(mq.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  return reduit;
}

/** Largeur de fenetre (la geometrie de la reference en depend). */
export function useLargeur(): number {
  const [w, setW] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1440));
  useEffect(() => {
    const f = () => setW(window.innerWidth);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return w;
}

/**
 * Apparition declenchee a l'entree dans l'ecran (brief A.3.6) : vrai une fois
 * que le haut de l'element passe sous 85 % de la hauteur de fenetre (seuil de la
 * reference). Toujours vrai si l'animation est reduite.
 */
export function useVu(ref: RefObject<HTMLElement>, reduit: boolean): boolean {
  const [vu, setVu] = useState(reduit);
  useLayoutEffect(() => {
    if (reduit) { setVu(true); return; }
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.85 && r.bottom > 0) { setVu(true); return; }
    const io = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) { setVu(true); io.disconnect(); }
    }, { rootMargin: '0px 0px -15% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, reduit]);
  return vu || reduit;
}

/** Vrai tant que l'element est (presque) a l'ecran : sert a mettre en pause les bandeaux hors champ. */
export function useAEcran(ref: RefObject<HTMLElement>): boolean {
  const [a, setA] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => setA(es[es.length - 1].isIntersecting), { rootMargin: '200px 0px 200px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return a;
}

/**
 * Volume au defilement (reference, 18/09) : le fond avance de 26 px et la boite
 * de -16 px sur une course d'une hauteur d'ecran. Ecrit directement le style
 * (pas de rendu React a chaque image). Rien du tout si l'animation est reduite.
 */
export function useParallaxe(section: RefObject<HTMLElement>, fond: RefObject<HTMLElement>, boite: RefObject<HTMLElement>, reduit: boolean) {
  useEffect(() => {
    if (reduit) {
      if (fond.current) fond.current.style.transform = '';
      if (boite.current) boite.current.style.transform = '';
      return;
    }
    let attente = false;
    const placer = () => {
      attente = false;
      const s = section.current;
      if (!s) return;
      const h = window.innerHeight;
      const r = s.getBoundingClientRect();
      if (r.bottom < -200 || r.top > h + 200) return;
      const p = (r.top + r.height / 2 - h / 2) / h;
      if (fond.current) fond.current.style.transform = 'translate3d(0,' + (p * 26).toFixed(1) + 'px,0) scale(1.06)';
      if (boite.current) boite.current.style.transform = 'translateY(-50%) translate3d(0,' + (p * -16).toFixed(1) + 'px,0)';
    };
    const surDefilement = () => { if (!attente) { attente = true; requestAnimationFrame(placer); } };
    placer();
    window.addEventListener('scroll', surDefilement, { passive: true });
    window.addEventListener('resize', surDefilement);
    return () => { window.removeEventListener('scroll', surDefilement); window.removeEventListener('resize', surDefilement); };
  }, [section, fond, boite, reduit]);
}

/** Fondu-enchaine de la reference : on eteint (150 ms), on change l'index, on rallume. */
export function useEchange(): [boolean, (f: () => void) => void] {
  const [eteint, setEteint] = useState(false);
  const t = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(t.current), []);
  const lancer = (f: () => void) => {
    window.clearTimeout(t.current);
    setEteint(true);
    t.current = window.setTimeout(() => { f(); setEteint(false); }, 150);
  };
  return [eteint, lancer];
}

/** Envoie une question a Sophie (le tiroir SophieChat l'ecoute). */
export function parlerASophie(texte: string) {
  window.dispatchEvent(new CustomEvent('dh:sophie', { detail: { texte } }));
}
