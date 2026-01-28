// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import EasterEggEffect from './components/layout/EasterEggEffect';
import EnhancedLiveChat from './components/chat/EnhancedLiveChat';
import { GradientProvider } from './contexts/GradientContext';
import { EasterEggProvider } from './contexts/EasterEggContext';
import { TranslationProvider } from './hooks/useTranslation';
import { useAnalytics } from './hooks/useAnalytics';
import ErrorBoundary from './components/layout/ErrorBoundary';

import Home from './pages/Home';
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));
const Feedback = lazy(() => import('./pages/Feedback'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component
const PageLoader = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative">
            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <div className="absolute inset-0 bg-purple-500/20 blur-xl animate-pulse rounded-full" />
        </div>
    </div>
);

// Composant interne pour utiliser les hooks
const AppContent = () => {
    // Initialiser le tracking analytics
    useAnalytics();

    return (
        <ErrorBoundary>
            <div className="min-h-screen text-white">
                <Navbar />
                <Suspense fallback={<PageLoader />}>
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
                </Suspense>
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
