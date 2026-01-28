// Footer.jsx
import { useEffect, useRef } from 'react';
import { animate, createTimeline, stagger } from 'animejs';
import { useGradient } from '../../contexts/GradientContext';
import { useTranslation } from '../../hooks/useTranslation';
import DownloadCV from '../cv/DownloadCV';

const Footer = () => {
    const { lastColor } = useGradient();
    const { t } = useTranslation();
    const footerRef = useRef(null);
    const columnsRef = useRef(null);

    useEffect(() => {
        const footerElement = footerRef.current;
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const tl = createTimeline({
                            easing: 'out-expo',
                        });
                        
                        tl.add(columnsRef.current?.children, {
                            opacity: [0, 1],
                            translateY: [40, 0],
                            delay: stagger(150),
                            duration: 1000,
                        });
                        
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (footerElement) {
            observer.observe(footerElement);
        }

        return () => {
            if (footerElement) {
                observer.unobserve(footerElement);
            }
        };
    }, []);

    return (
        <footer 
            ref={footerRef} 
            className="relative py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-1000 overflow-hidden"
            style={{
                background: `linear-gradient(to bottom, ${lastColor}, #0a0a0a)`
            }}
        >
            {/* Enhanced background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl" />
                
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
            </div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Glassmorphism container */}
                <div className="glass rounded-2xl p-8 mb-8">
                    <div ref={columnsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="opacity-0 group">
                            <h3 className="text-white font-bold mb-4 text-lg group-hover:text-purple-300 transition-colors duration-300">
                                Sebbe Mercier
                            </h3>
                            <p className="text-white/60 group-hover:text-white/80 transition-colors duration-300">
                                {t('pages.home.description', 'A Full stack developer crafting digital experiences')}
                            </p>
                            
                            {/* Status indicator */}
                            <div className="flex items-center gap-2 mt-4 text-sm">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-green-400">{t('pages.home.available', 'Available for projects')}</span>
                            </div>
                        </div>
                        
                        <div className="opacity-0">
                            <h3 className="text-white font-bold mb-4 text-lg">{t('footer.quickLinks', 'Liens rapides')}</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="/" className="group flex items-center text-white/60 hover:text-purple-400 transition-all duration-300">
                                        <span className="w-0 group-hover:w-2 h-px bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        {t('navigation.home', 'Accueil')}
                                    </a>
                                </li>
                                <li>
                                    <a href="/about" className="group flex items-center text-white/60 hover:text-purple-400 transition-all duration-300">
                                        <span className="w-0 group-hover:w-2 h-px bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        {t('navigation.about', 'À propos')}
                                    </a>
                                </li>
                                <li>
                                    <a href="/projects" className="group flex items-center text-white/60 hover:text-purple-400 transition-all duration-300">
                                        <span className="w-0 group-hover:w-2 h-px bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        {t('navigation.projects', 'Projets')}
                                    </a>
                                </li>
                                <li>
                                    <a href="/feedback" className="group flex items-center text-white/60 hover:text-purple-400 transition-all duration-300">
                                        <span className="w-0 group-hover:w-2 h-px bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        {t('footer.feedback', 'Laisser un avis')}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="opacity-0 group">
                            <a href="/contact" className="inline-block">
                                <h3 className="text-white font-bold mb-4 text-lg group-hover:text-purple-300 transition-colors duration-300">
                                    {t('navigation.contact', 'Contact')}
                                </h3>
                            </a>
                            <div className="space-y-4">
                                <a 
                                    href="mailto:info@sebbe-mercier.tech" 
                                    className="block text-white/60 hover:text-purple-400 transition-colors duration-300 hover:underline"
                                >
                                    info@sebbe-mercier.tech
                                </a>
                                
                                {/* CV Download Button */}
                                <div className="pt-2">
                                    <DownloadCV 
                                        variant="button" 
                                        className="w-full justify-center bg-purple-500 hover:bg-purple-600 text-sm"
                                    />
                                </div>
                                
                                {/* Social links */}
                                <div className="flex gap-3 mt-4">
                                    <button className="w-8 h-8 bg-white/5 hover:bg-purple-500/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                                        <span className="text-xs">GH</span>
                                    </button>
                                    <button className="w-8 h-8 bg-white/5 hover:bg-purple-500/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                                        <span className="text-xs">LI</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Copyright with enhanced styling */}
                <div className="text-center">
                    <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-6" />
                    <p className="text-white/40 text-sm hover:text-white/60 transition-colors duration-300">
                        © {new Date().getFullYear()} Sebbe Mercier. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
