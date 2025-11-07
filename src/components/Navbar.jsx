// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';  // Import correct de NavLink

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
        <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                   <div className="flex-shrink-0"><a href="/"><img
                       src="./logo.png"
                       alt="Logo"
                       className="w-20 h-20 relative z-10"
                   /></a>
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
                            className="text-white focus:outline-none"
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

                {/* Menu Mobile */}
                {isOpen && (
                    <div className="md:hidden pb-4">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `block px-3 py-2 rounded-md text-base font-medium
                    ${isActive ? 'bg-purple-900 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`
                                    }
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
