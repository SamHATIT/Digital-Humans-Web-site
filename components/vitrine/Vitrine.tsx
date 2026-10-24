import React, { useRef } from 'react';
import { Langue } from '../../content/vitrines';
import BoiteSophie from './BoiteSophie';
import Bandeau, { ElementBandeau } from './Bandeau';
import { useAEcran, useEchange, useParallaxe, useVu } from './crochets';

export interface PropsVitrine {
  id: string;
  langue: Langue;
  reduit: boolean;
  colonnes: string;
  surtitre: string; titre1: string; titre2: string; compteur: string;
  onglets: string[]; actif: number; onChoisir: (i: number) => void; nomOnglets: string;
  photo: string; nom: string; role: string; citation: string; prompt: string;
  titreCanevas: string;
  canevas: (allume: boolean) => React.ReactNode;
  bandeau: ElementBandeau;
  mention: string;
}

/**
 * Composant vitrine — le meme modele pour les quatre chapitres (mission, point 7) :
 * photo pleine hauteur qui deborde a gauche et s'estompe vers le noir, boite
 * adaptative flottante centree en hauteur, canevas de droite de meme hauteur,
 * bandeau defilant au bas du canevas, parallaxe legere.
 */
const Vitrine: React.FC<PropsVitrine> = p => {
  const section = useRef<HTMLElement>(null);
  const fond = useRef<HTMLDivElement>(null);
  const boite = useRef<HTMLDivElement>(null);
  const vu = useVu(section, p.reduit);
  const aEcran = useAEcran(section);
  const [eteint, echanger] = useEchange();
  useParallaxe(section, fond, boite, p.reduit);
  const allume = vu && !eteint;
  const choisir = (i: number) => { if (i !== p.actif) echanger(() => p.onChoisir(i)); };
  const swap = eteint ? ' v-swap-off' : '';
  return (
    <section ref={section} id={p.id} className={'v-section' + (aEcran ? '' : ' v-hors-ecran')} data-vitrine="">
      <div className="v-section-in">
        <div className="v-tete">
          <div className="v-tete-g">
            <span className="v-surtitre">— {p.surtitre}</span>
            <h2>{p.titre1} <em className="v-laiton">{p.titre2}</em></h2>
          </div>
          <span className="v-compteur">{p.compteur}</span>
        </div>
        <div className="v-grille" style={{ gridTemplateColumns: p.colonnes }}>
          <div className="v-gauche">
            <div className="v-masque">
              <div ref={fond} className="v-fond" data-parallaxe="fond">
                <div className="v-photo" style={{ backgroundImage: 'url(' + p.photo + ')', opacity: allume ? 1 : 0, transform: vu ? 'none' : 'scale(1.05)' }}/>
              </div>
              <div className="v-voile"/>
              <div className={'v-legende' + swap}>
                <span className="v-legende-nom">{p.nom}</span>
                <span className="v-legende-role">{p.role}</span>
                <p className="v-legende-cit">{p.citation}</p>
              </div>
              <BoiteSophie variante="vitrine" langue={p.langue} onglets={p.onglets} actif={p.actif} onChoisir={choisir}
                prompt={p.prompt} eteint={eteint} mention={p.mention} idOnglets={p.nomOnglets} boiteRef={boite}/>
            </div>
          </div>
          <div className="v-canevas">
            <Bandeau e={p.bandeau} eteint={eteint}/>
            <span className="v-canevas-titre">{p.titreCanevas}</span>
            {p.canevas(allume)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vitrine;
