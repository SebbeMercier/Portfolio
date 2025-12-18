// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EasterEggEffect from './components/EasterEggEffect';
import LiveChat from './components/LiveChat';
import { GradientProvider } from './contexts/GradientContext';
import { EasterEggProvider } from './contexts/EasterEggContext';
import { useAnalytics } from './hooks/useAnalytics';

// Import direct des pages pour debug
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Feedback from './pages/Feedback';
import CVManager from './components/CVManager';


// Composant interne pour utiliser les hooks
const AppContent = () => {
    // Initialiser le tracking analytics
    useAnalytics();

    return (
        <div className="min-h-screen text-white">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/contact" element={<Contact />} />

                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/cv" element={<CVManager />} />
                <Route path="/feedback" element={<Feedback />} />
            </Routes>
            <Footer />
            <EasterEggEffect />
            <LiveChat />
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
    );
};

function App() {
    return (
        <Router>
            <EasterEggProvider>
                <GradientProvider>
                    <AppContent />
                </GradientProvider>
            </EasterEggProvider>
        </Router>
    );
}

export default App;
