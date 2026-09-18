import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import BlogList from './components/blog/BlogList';
import BlogArticle from './components/blog/BlogArticle';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <div className="min-h-screen overflow-x-hidden bg-white dark:bg-slate-900">
                {/* Background effects */}
                <div className="fixed inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                <div className="fixed -top-64 -left-32 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[150px] pointer-events-none"></div>
                <div className="fixed -bottom-64 -right-32 w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none"></div>
                
                <Header />
                
                <main className="relative z-10">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/blog" element={<BlogList />} />
                        <Route path="/blog/:slug" element={<BlogArticle />} />
                    </Routes>
                </main>
                
                <Footer />
            </div>
        </BrowserRouter>
    );
};

export default App;
