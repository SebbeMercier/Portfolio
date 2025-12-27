// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EasterEggEffect from './components/EasterEggEffect';
import EnhancedLiveChat from './components/EnhancedLiveChat';
import { GradientProvider } from './contexts/GradientContext';
import { EasterEggProvider } from './contexts/EasterEggContext';
import { TranslationProvider } from './hooks/useTranslation';
import { useAnalytics } from './hooks/useAnalytics';

// Import direct des pages pour debug
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Feedback from './pages/Feedback';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';


// Composant interne pour utiliser les hooks
const AppContent = () => {
    // Initialiser le tracking analytics
    useAnalytics();

    return (
        <ErrorBoundary>
            <div className="min-h-screen text-white">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route path="/contact" element={<Contact />} />

                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/*" element={<Admin />} />
                    <Route path="/feedback" element={<Feedback />} />
                    
                    {/* Route 404 - doit être en dernier */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
                <EasterEggEffect />
                <EnhancedLiveChat />
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: 'rgba(17, 24, 39, 0.9)',
                            color: '#fff',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }
                    }}
                />
            </div>
        </ErrorBoundary>
    );
};

function App() {
    return (
        <Router>
            <TranslationProvider>
                <EasterEggProvider>
                    <GradientProvider>
                        <AppContent />
                    </GradientProvider>
                </EasterEggProvider>
            </TranslationProvider>
        </Router>
    );
}

export default App;
