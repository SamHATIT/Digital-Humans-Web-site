import React, { useRef, useState, KeyboardEvent, FormEvent } from 'react';
import { Langue } from '../../content/vitrines';
import { parlerASophie } from './crochets';

interface Props {
  variante: 'heros' | 'vitrine';
  langue: Langue;
  onglets: string[];
  actif: number;
  onChoisir: (i: number) => void;
  prompt: string;
  eteint: boolean;
  mention: string;
  idOnglets: string;
  boiteRef?: React.Ref<HTMLDivElement>;
}

const LIB = {
  fr: { parler: 'Parler à Sophie', champ: 'Poser une question à Sophie', envoyer: 'Envoyer à Sophie', prec: 'Onglets précédents', suiv: 'Onglets suivants' },
  en: { parler: 'Talk to Sophie', champ: 'Ask Sophie a question', envoyer: 'Send to Sophie', prec: 'Previous tabs', suiv: 'Next tabs' },
};

/**
 * Boite adaptative (brief A.1) : onglets en haut, ligne Sophie en bas avec un
 * vrai champ de saisie, mention IA permanente. Evolution de SophieChat : la
 * question tapee (ou, champ vide, la question suggeree) est remise au tiroir
 * Sophie, qui l'envoie au concierge.
 */
const BoiteSophie: React.FC<Props> = ({ variante, langue, onglets, actif, onChoisir, prompt, eteint, mention, idOnglets, boiteRef }) => {
  const l = LIB[langue];
  const [valeur, setValeur] = useState('');
  const bande = useRef<HTMLDivElement>(null);
  const pousser = (dir: number) => bande.current?.scrollBy({ left: dir * 190, behavior: 'smooth' });
  const choisir = (i: number) => {
    onChoisir(i);
    const el = bande.current;
    const btn = el?.children[i] as HTMLElement | undefined;
    if (el && btn) el.scrollTo({ left: Math.max(btn.offsetLeft - 56, 0), behavior: 'smooth' });
  };
  const clavier = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = onglets.length;
    const cible = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (cible < 0) return;
    e.preventDefault();
    choisir(cible);
    (bande.current?.children[cible] as HTMLElement | undefined)?.focus();
  };
  const envoyer = (e: FormEvent) => {
    e.preventDefault();
    const texte = valeur.trim() || prompt;
    if (!texte) return;
    parlerASophie(texte);
    setValeur('');
  };
  return (
    <div ref={boiteRef} className={'v-boite v-boite--' + variante} data-parallaxe={variante === 'vitrine' ? 'boite' : undefined}>
      <div className="v-onglets">
        <button type="button" className="v-fleche" aria-label={l.prec} onClick={() => pousser(-1)}>‹</button>
        <div ref={bande} className="v-bande-onglets" role="tablist" aria-label={idOnglets}>
          {onglets.map((o, i) => (
            <button key={o} type="button" role="tab" className="v-onglet" aria-selected={i === actif} tabIndex={i === actif || (actif < 0 && i === 0) ? 0 : -1}
              onClick={() => choisir(i)} onKeyDown={e => clavier(e, i)}>{o}</button>
          ))}
        </div>
        <button type="button" className="v-fleche" aria-label={l.suiv} onClick={() => pousser(1)}>›</button>
      </div>
      <form className="v-sophie" onSubmit={envoyer}>
        <img className="v-sophie-av" src="/visuels/sophie-pm.webp" alt="Sophie" width={30} height={30}/>
        <div className={'v-sophie-txt' + (eteint ? ' v-swap-off' : '')}>
          <span className="v-sophie-lib">{l.parler}</span>
          <input type="text" className="v-ask" value={valeur} onChange={e => setValeur(e.target.value)} placeholder={prompt} aria-label={l.champ} enterKeyHint="send"/>
        </div>
        <button type="submit" className="v-envoyer" aria-label={l.envoyer}>→</button>
      </form>
      <div className="v-mention" data-mention-ia="">{mention}</div>
    </div>
  );
};

export default BoiteSophie;
