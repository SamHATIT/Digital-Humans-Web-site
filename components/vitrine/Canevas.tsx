import React from 'react';
import { BARRES, Langue, t } from '../../content/vitrines';

/** Surimpressions dessinees par la reference sur chaque vignette, selon le genre d'artefact. */
function Surimpression({ genre }: { genre: string }) {
  const b = BARRES[genre] || BARRES.list;
  if (genre === 'list') return (
    <div className="v-ov v-ov-liste">
      <div className="v-ov-liste-tete"><span className="v-b" style={{ height: 5, width: '38%', background: '#8C6E4A' }}/><span className="v-b" style={{ height: 5, width: '16%', background: 'rgba(10,10,11,.22)' }}/></div>
      <div className="v-ov-liste-corps">
        {b.map((w, i) => <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}><span className="v-b" style={{ flex: 'none', width: 15, height: 6, borderRadius: 2, background: 'rgba(140,110,74,.55)' }}/><span className="v-b" style={{ height: 5, background: 'rgba(10,10,11,.22)', width: String(w) }}/></span>)}
      </div>
    </div>
  );
  if (genre === 'page') return (
    <div className="v-ov v-ov-page">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, borderBottom: '1px solid rgba(10,10,11,.14)', paddingBottom: 7 }}>
        <span className="v-b" style={{ height: 7, width: '58%', background: '#8C6E4A' }}/>
        <span className="v-b" style={{ height: 4, width: '34%', borderRadius: 2, background: 'rgba(10,10,11,.2)' }}/>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
        {['rgba(10,10,11,.17)', 'rgba(10,10,11,.12)'].map(c => (
          <div key={c} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {b.map((w, i) => <span key={i} className="v-b" style={{ height: 4, borderRadius: 2, background: c, width: String(w) }}/>)}
          </div>
        ))}
      </div>
    </div>
  );
  if (genre === 'erd') return (
    <div className="v-ov v-ov-erd">
      {b.map((_, i) => (
        <span key={i} style={{ border: '1px solid rgba(10,10,11,.24)', borderRadius: 4, background: 'rgba(255,255,255,.55)', display: 'flex', flexDirection: 'column', gap: 3, padding: 4, overflow: 'hidden' }}>
          <span className="v-b" style={{ height: 4, borderRadius: 2, background: 'rgba(140,110,74,.7)' }}/>
          <span className="v-b" style={{ height: 3, width: '80%', borderRadius: 2, background: 'rgba(10,10,11,.16)' }}/>
          <span className="v-b" style={{ height: 3, width: '62%', borderRadius: 2, background: 'rgba(10,10,11,.12)' }}/>
        </span>
      ))}
    </div>
  );
  return (
    <div className="v-ov v-ov-code">
      <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
        {b.map((_, i) => <span key={i} className="v-b" style={{ height: 4, width: 7, borderRadius: 2, background: 'rgba(245,242,236,.22)' }}/>)}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
        {b.map((w, i) => <span key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span className="v-b" style={{ height: 5, width: '26%', background: 'rgba(200,169,126,.75)' }}/><span className="v-b" style={{ height: 5, background: 'rgba(129,140,248,.5)', width: String(w) }}/></span>)}
      </div>
    </div>
  );
}

export interface Artefact { kind: string; label: any; agent: string; meta: any }
interface PropsNoeuds { arts: Artefact[]; allume: boolean; geo: any; langue: Langue; cle: string }

/** Canevas a noeuds : captures reelles de SDS reliees par des courbes de Bezier, dans l'ordre de la sequence. */
export const CanevasNoeuds: React.FC<PropsNoeuds> = ({ arts, allume, geo, langue, cle }) => {
  const liens = arts.length === 4 ? 4 : Math.max(arts.length - 1, 1);
  const aretes = geo.EDGES.slice(0, liens);
  return (
    <div className="v-noeuds">
      {/* Les connecteurs ne sont montes (et animes) qu'une fois la section a l'ecran (A.3.8). */}
      {allume ? (
        <svg className="v-aretes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" key={cle}>
          {aretes.map((e: any, i: number) => (
            <path key={i} className="v-arete" d={e.d} fill="none" stroke="#C8A97E" strokeWidth={1.25} strokeLinecap="round" strokeDasharray="210" strokeDashoffset="0" vectorEffect="non-scaling-stroke"
              style={{ animationDelay: (0.2 + i * 0.12).toFixed(2) + 's' }}/>
          ))}
        </svg>
      ) : null}
      {aretes.map((e: any, i: number) => (
        <span key={i} className="v-depart" style={{ left: e.x, top: e.y, opacity: allume ? 1 : 0, transitionDelay: (0.2 + i * 0.12).toFixed(2) + 's' }}/>
      ))}
      {arts.map((a, i) => {
        const img = geo.VIGNETTE[a.kind];
        const d = (i * 0.07).toFixed(2) + 's';
        return (
          <div key={i} className="v-noeud" style={{ left: geo.POS[i].x, top: geo.POS[i].y, width: geo.nodeW, opacity: allume ? 1 : 0, transform: allume ? 'none' : 'translate3d(0,14px,0)', transitionDelay: d + ',' + d }}>
            <div className="v-noeud-tete"><b>{t(a.label, langue)}</b><span>{a.agent}</span></div>
            <div className="v-vign">
              {img ? <img src={img} alt="" loading="lazy"/> : null}
              <Surimpression genre={a.kind}/>
              <span className="v-etiquette">{t(a.meta, langue)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface PropsSds { tampon: string; nom: string; secteur: string; sections: { head: string; text: string }[]; chiffres: { value: number; label: string }[]; lien: string; libLien: string }

/** Variante unique de l'Atelier : apercu du SDS qui defile, chiffres du document, lien vers la page publiee. */
export const CanevasSds: React.FC<PropsSds> = ({ tampon, nom, secteur, sections, chiffres, lien, libLien }) => (
  <div className="v-sds">
    <div className="v-sds-page">
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div className="v-sds-defile">
          <div className="v-sds-entete">
            <span className="v-sds-tampon">{tampon}</span>
            <span className="v-sds-nom">{nom}</span>
            <span style={{ fontSize: 10, color: '#4A4640' }}>{secteur}</span>
          </div>
          {sections.map(s => (
            <div key={s.head} className="v-sds-sect">
              <span className="v-sds-sect-h">{s.head}</span>
              <span className="v-sds-sect-t">{s.text}</span>
              <span className="v-b" style={{ height: 4, borderRadius: 2, background: 'rgba(10,10,11,.1)' }}/>
              <span className="v-b" style={{ height: 4, width: '88%', borderRadius: 2, background: 'rgba(10,10,11,.08)' }}/>
              <span className="v-b" style={{ height: 4, width: '64%', borderRadius: 2, background: 'rgba(10,10,11,.06)' }}/>
            </div>
          ))}
        </div>
      </div>
      <div className="v-sds-fondu"/>
    </div>
    <div className="v-chiffres">
      {chiffres.map(c => (
        <div key={c.label} className="v-chiffre"><span className="v-chiffre-v">{c.value}</span><span className="v-chiffre-l">{c.label}</span></div>
      ))}
    </div>
    <a className="v-lire" href={lien} target="_blank" rel="noopener">{libLien}</a>
  </div>
);
