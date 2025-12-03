// src/components/Navbar.jsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
        { to: "/projects", label: "My projects" },
        { to: "/contact", label: "Contact" }
    ];

    return (
        <nav className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
            {/* Liquid Glass Container */}
            <div className="relative overflow-visible">
                {/* Glow effect derrière */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-purple-600/20
                              rounded-2xl blur-xl"></div>

                {/* Glass morphism card */}
                <div className="relative bg-gray-900/60 backdrop-blur-2xl
                              border border-white/10 rounded-2xl
                              shadow-[0_8px_32px_0_rgba(168,85,247,0.15)]
                              hover:shadow-[0_8px_48px_0_rgba(168,85,247,0.25)]
                              transition-all duration-500">

                    {/* Gradient overlay subtil */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5
                                  rounded-2xl pointer-events-none"></div>

                    <div className="relative px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">

                            {/* Logo avec cercle pour photo de profil */}
                            <div className="flex-shrink-0">
                                <NavLink to="/" className="block">
                                    <div className="relative group">
                                        {/* Halo au hover - SANS PULSE */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600
                          rounded-full blur-md opacity-0 group-hover:opacity-75
                          transition-all duration-500 group-hover:blur-lg"></div>

                                        {/* Container de l'image */}
                                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden
                          ring-2 ring-purple-400/20 group-hover:ring-purple-400/80
                          transition-all duration-500
                          group-hover:scale-110 group-hover:rotate-3
                          shadow-lg group-hover:shadow-purple-500/50">
                                            <img
                                                src="./logo.png"
                                                alt="Profile"
                                                className="w-full h-full object-cover
                             transition-transform duration-500
                             group-hover:scale-110"
                                            />
                                            {/* Overlay au hover - RETIRÉ LA LUMIÈRE BLANCHE */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0
                              group-hover:from-purple-600/10 group-hover:to-pink-600/10
                              transition-all duration-500"></div>
                                        </div>
                                    </div>
                                </NavLink>
                            </div>

                            {/* Menu Desktop - HOVERS AMÉLIORÉS */}
                            <div className="hidden md:flex items-center space-x-1">
                                {navLinks.map((link) => (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        className={({ isActive }) =>
                                            `relative group px-4 py-2 rounded-xl text-sm font-medium 
                                            transition-all duration-300 overflow-hidden
                                            ${isActive
                                                ? 'text-white scale-105'
                                                : 'text-gray-300 hover:text-white hover:scale-105'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {/* Background pour l'état actif */}
                                                {isActive && (
                                                    <>
                                                        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600
                                                                       rounded-xl"></span>
                                                        {/* Shine effect sur actif */}
                                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                                                                       translate-x-[-100%] group-hover:translate-x-[100%]
                                                                       transition-transform duration-1000 rounded-xl"></span>
                                                    </>
                                                )}

                                                {/* Background animé au hover pour les non-actifs */}
                                                {!isActive && (
                                                    <>
                                                        {/* Gradient de fond */}
                                                        <span className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/0 to-purple-600/0
                                                                       group-hover:from-purple-600/60 group-hover:via-pink-600/60 group-hover:to-purple-600/60
                                                                       rounded-xl transition-all duration-500"></span>

                                                        {/* Shine effect au hover */}
                                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent
                                                                       group-hover:via-white/20
                                                                       translate-x-[-100%] group-hover:translate-x-[100%]
                                                                       transition-all duration-700 rounded-xl"></span>

                                                        {/* Glow sur les côtés */}
                                                        <span className="absolute inset-y-0 -left-2 w-4 bg-purple-500/0 blur-lg
                                                                       group-hover:bg-purple-500/50 transition-all duration-500"></span>
                                                        <span className="absolute inset-y-0 -right-2 w-4 bg-pink-500/0 blur-lg
                                                                       group-hover:bg-pink-500/50 transition-all duration-500"></span>
                                                    </>
                                                )}

                                                <span className="relative z-10 inline-block
                                                               group-hover:-translate-y-0.5 transition-transform duration-300">
                                                    {link.label}
                                                </span>
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>

                            {/* Menu Mobile - HOVER AMÉLIORÉ */}
                            <div className="md:hidden">
                                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="relative group text-white hover:text-white
                                                     backdrop-blur-sm rounded-xl transition-all duration-300
                                                     hover:scale-110 overflow-hidden"
                                        >
                                            {/* Background au hover */}
                                            <span className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0
                                                           group-hover:from-purple-600/20 group-hover:to-pink-600/20
                                                           transition-all duration-300"></span>

                                            {/* Glow effect */}
                                            <span className="absolute inset-0 ring-2 ring-purple-500/0 group-hover:ring-purple-500/50
                                                           rounded-xl transition-all duration-300"></span>

                                            {isOpen ? <X className="relative h-5 w-5 z-10" /> : <Menu className="relative h-5 w-5 z-10" />}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="right"
                                        className="w-[280px] bg-gray-900/95 backdrop-blur-2xl
                                                 border-l border-white/10"
                                    >
                                        {/* Gradient overlay dans le sheet */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10
                                                      pointer-events-none"></div>

                                        <nav className="relative flex flex-col space-y-2 mt-8">
                                            {navLinks.map((link) => (
                                                <NavLink
                                                    key={link.to}
                                                    to={link.to}
                                                    className={({ isActive }) =>
                                                        `group relative px-4 py-3 rounded-xl text-base font-medium 
                                                        transition-all duration-300 overflow-hidden
                                                        ${isActive
                                                            ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30 scale-105'
                                                            : 'text-gray-300 hover:text-white hover:bg-white/5 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20'
                                                        }`
                                                    }
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {/* Shine effect mobile */}
                                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent
                                                                   group-hover:via-white/10
                                                                   translate-x-[-100%] group-hover:translate-x-[100%]
                                                                   transition-transform duration-700"></span>

                                                    <span className="relative z-10">{link.label}</span>
                                                </NavLink>
                                            ))}
                                        </nav>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;