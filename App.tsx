import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import OurAgents from './components/OurAgents';
import Benefits from './components/Benefits';
import CTA from './components/CTA';
import Footer from './components/Footer';

const App: React.FC = () => {
    return (
        <div className="min-h-screen overflow-x-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-200/[0.5] dark:bg-grid-slate-700/[0.05] [mask-image:linear-gradient(to_bottom,white_10%,transparent_100%)]"></div>
            <Header />
            <main className="relative z-10">
                <Hero />
                <Benefits />
                <HowItWorks />
                <OurAgents />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default App;