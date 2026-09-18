import React from 'react';
import Hero from './Hero';
import RealityCheck from './RealityCheck';
import HowItWorks from './HowItWorks';
import OurAgents from './OurAgents';
import Manifesto from './Manifesto';
import CTA from './CTA';
import FAQ from './FAQ';

const HomePage: React.FC = () => {
    return (
        <>
            <Hero />
            <RealityCheck />
            <HowItWorks />
            <OurAgents />
            <Manifesto />
            <CTA />
            <FAQ />
        </>
    );
};

export default HomePage;
