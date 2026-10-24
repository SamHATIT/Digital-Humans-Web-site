import React from 'react';

export interface ElementBandeau {
  aLabel?: string; aTitre?: string; aTexte?: string; aLien?: string | null; aImage?: string | null;
  bLabel: string; bTexte: string; bRef: string;
}

/** Une moitie de piste. La piste en contient deux identiques : la boucle est sans couture. */
function Moitie({ e, double }: { e: ElementBandeau; double: boolean }) {
  const cache = double ? { 'aria-hidden': true as const } : {};
  const parties: React.ReactNode[] = [];
  if (e.aLabel && e.aTitre) {
    parties.push(<span key="al" className="v-bd-lab" {...cache}>{e.aLabel}</span>);
    const corps = (
      <>
        {e.aImage ? <img className="v-bd-vign" src={e.aImage} alt="" loading="lazy" width={34} height={22}/> : null}
        <span className="v-bd-titre">{e.aTitre}</span>
        {e.aTexte ? <span className="v-bd-txt">{e.aTexte}</span> : null}
      </>
    );
    parties.push(e.aLien
      ? <a key="aa" className="v-bd-art" href={e.aLien} target="_blank" rel="noopener" tabIndex={double ? -1 : undefined} {...cache}>{corps}</a>
      : <span key="aa" className="v-bd-art" {...cache}>{corps}</span>);
    parties.push(<span key="as" className="v-bd-sep" aria-hidden="true">·</span>);
  }
  parties.push(<span key="bl" className="v-bd-lab" {...cache}>{e.bLabel}</span>);
  parties.push(<span key="bt" className="v-bd-txt2" {...cache}>{e.bTexte}</span>);
  parties.push(<span key="br" className="v-bd-ref" {...cache}>{e.bRef}</span>);
  parties.push(<span key="bs" className="v-bd-sep" aria-hidden="true">·</span>);
  return <>{parties}</>;
}

/** Bandeau defilant au bas du canevas (remplace les petites boites sous la photo). */
const Bandeau: React.FC<{ e: ElementBandeau; eteint: boolean }> = ({ e, eteint }) => (
  <div className="v-bandeau" style={{ opacity: eteint ? 0 : 1 }}>
    <div className="v-piste" data-piste="">
      <Moitie e={e} double={false}/>
      <Moitie e={e} double={true}/>
    </div>
  </div>
);

export default Bandeau;
