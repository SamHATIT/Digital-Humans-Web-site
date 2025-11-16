import React from 'react';
import { LogoIcon } from './icons';

const Footer: React.FC = () => {
    return (
        <footer className="border-t border-slate-800 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
                <div className="flex justify-center mb-4">
                  <LogoIcon className="h-12 w-auto" />
                </div>
                <p>&copy; {new Date().getFullYear()} Digital Humans. All rights reserved.</p>
                <p className="text-sm mt-2">Revolutionizing Salesforce Automation with Artificial Intelligence.</p>
            </div>
        </footer>
    );
};

export default Footer;