import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LegalLayout from './components/legal/LegalLayout';
import BlogLayout from './components/blog/BlogLayout';
import BlogList from './components/blog/BlogList';
import BlogArticle from './components/blog/BlogArticle';

// Routes du site en ligne : `/`, `/legal`, `/cgv`, `/privacy`. Le bundle les
// resolvait avec un mini-routeur sur `window.location.pathname`
// (`_contenu-source/site_racine.js`) ; ici c'est react-router-dom, la plomberie
// que le depot apporte.
const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/legal" element={<LegalLayout slug="legal"/>}/>
      <Route path="/cgv" element={<LegalLayout slug="cgv"/>}/>
      <Route path="/privacy" element={<LegalLayout slug="privacy"/>}/>
      <Route path="/blog" element={<BlogLayout><BlogList/></BlogLayout>}/>
      <Route path="/blog/:slug" element={<BlogLayout><BlogArticle/></BlogLayout>}/>
    </Routes>
  </BrowserRouter>
);

export default App;
