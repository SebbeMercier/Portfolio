// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';       // Vérifiez le chemin
import Projects from './pages/Projects'; // Vérifiez le chemin
import Contact from './pages/Contact';   // Vérifiez le chemin (pas '../components/Contact')

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-[#0a0a1a] text-white">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/contact" element={<Contact />} />  {/* Correction: Route avec R majuscule */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
