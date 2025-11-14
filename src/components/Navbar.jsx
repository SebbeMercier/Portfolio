// src/components/Navbar.jsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Liste des liens pour éviter la répétition
    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
        { to: "/projects", label: "My projects" },
        { to: "/contact", label: "Contact" }
    ];

    return (
        <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md z-50 shadow-lg">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo avec cercle pour photo de profil */}
                    <div className="flex-shrink-0">
                        <NavLink to="/" className="block">
                            <div className="relative group">
                                {/* Halo au hover */}
                                <div className="absolute -inset-1 bg-purple-500/30 rounded-full blur-md
                                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Container de l'image */}
                                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden
                                              border-2 border-purple-400/50 group-hover:border-purple-400
                                              transition-all duration-300 group-hover:scale-105
                                              shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                                    <img
                                        src="./logo.png"
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </NavLink>
                    </div>

                    {/* Menu Desktop */}
                    <div className="hidden md:flex space-x-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `text-white hover:text-purple-400 transition-colors font-medium relative pb-1
                                    ${isActive ? 'text-purple-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-400' : ''}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Bouton Mobile */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white focus:outline-none hover:text-purple-400 transition-colors"
                            aria-label="Toggle menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Menu Mobile avec animation */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-base font-medium transition-colors
                                    ${isActive ? 'bg-purple-900 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`
                                }
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;