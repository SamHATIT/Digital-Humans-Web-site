import React from 'react';
import Accueil from './vitrine/Accueil';

// Accueil refondu d'apres la reference validee par Sam le 18/09
// (https://digital-humans.fr/refonte/) : navigation, heros, quatre vitrines
// (Pour qui, Methode, L'Ensemble, L'Atelier), tarifs, FAQ, CTA, pied de page.
// Les anciens composants de l'accueil (components/site/Hero, Benefits,
// HowItWorks, OurWork, Pricing, CTA) ne sont plus montes ; Header, Footer et
// SophieChat restent utilises par les pages legales, inchangees.
const HomePage: React.FC = () => <Accueil/>;

export default HomePage;
