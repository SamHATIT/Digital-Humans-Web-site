import React from 'react';
import Header from './site/Header';
import Hero from './site/Hero';
import Benefits from './site/Benefits';
import HowItWorks from './site/HowItWorks';
import OurWork from './site/OurWork';
import Pricing from './site/Pricing';
import CTA from './site/CTA';
import Footer from './site/Footer';
import SophieChat from './site/SophieChat';

// Ordre des sections repris du composant racine `Site` du bundle en ligne
// (`_contenu-source/site_racine.js`) : Hero, Benefits, HowItWorks, OurWork,
// Pricing, CTA. `OurAgents` existe dans les sources mais n'est pas monte par le
// site en ligne — il n'est donc pas monte ici non plus (voir components/site/OurAgents.tsx).
const HomePage: React.FC = () => (
  <div data-screen-label="Marketing Home">
    <Header/>
    <main>
      <Hero/>
      <Benefits/>
      <HowItWorks/>
      <OurWork/>
      <Pricing/>
      <CTA/>
    </main>
    <Footer/>
    <SophieChat/>
  </div>
);

export default HomePage;
