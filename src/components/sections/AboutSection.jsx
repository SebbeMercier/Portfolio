// src/components/About.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useSectionGradient } from '../../hooks/useSectionGradient';
import { useTranslation } from '../../hooks/useTranslation';

export function AboutSection() {
    const sectionRef = useSectionGradient('#0a1a2e');
    const { t } = useTranslation();
    const containerRef = useRef(null);
    const mobileRef = useRef(null); // Nouveau ref pour la section mobile
    const [dimensions, setDimensions] = useState({ width: 0, height: 0, centerX: 0, centerY: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [,setIsMobile] = useState(false);

    // Technologies grille mobile
    const technologies = [
        { name: "Html 5", icon: "https://skillicons.dev/icons?i=html" },
        { name: "CSS3", icon: "https://skillicons.dev/icons?i=css" },
        { name: "JavaScript", icon: "https://skillicons.dev/icons?i=js" },
        { name: "React", icon: "https://skillicons.dev/icons?i=react" },
        { name: "Node.js", icon: "https://skillicons.dev/icons?i=nodejs" },
        { name: "nextJS", icon: "https://skillicons.dev/icons?i=nextjs" },
        { name: "Golang", icon: "https://skillicons.dev/icons?i=golang" },
        { name: "Swift", icon: "https://skillicons.dev/icons?i=swift" },
        { name: "Kotlin", icon: "https://skillicons.dev/icons?i=kotlin" },
        { name: "PostgreSQL", icon: "https://skillicons.dev/icons?i=postgres" },
        { name: "mongoDB", icon: "https://skillicons.dev/icons?i=mongo" },
        { name: "Redis", icon: "https://skillicons.dev/icons?i=redis" },
        { name: "ElasticSearch", icon: "https://skillicons.dev/icons?i=elasticsearch" },
        { name: "Cloudflare", icon: "https://skillicons.dev/icons?i=cloudflare"},
        { name: "Github", icon: "https://skillicons.dev/icons?i=github"},
        { name: "Redhat", icon: "https://skillicons.dev/icons?i=redhat"},
        { name: "SupaBase", icon: "https://skillicons.dev/icons?i=supabase" },

    ];

    // lignes pour desktop
    const technologiesDesktop = [
        { name: "Html 5", icon: "https://skillicons.dev/icons?i=html", line: 1 },
        { name: "CSS3", icon: "https://skillicons.dev/icons?i=css", line: 1 },
        { name: "Node.js", icon: "https://skillicons.dev/icons?i=nodejs", line: 1 },
        { name: "Redis", icon: "https://skillicons.dev/icons?i=redis", line: 1 },
        { name: "JavaScript", icon: "https://skillicons.dev/icons?i=js", line: 1 },
        { name: "ElasticSearch", icon: "https://skillicons.dev/icons?i=elasticsearch", line: 1 },
        { name: "Cloudflare", icon: "https://skillicons.dev/icons?i=cloudflare", line: 1 },


        // Ligne 2 (juste au-dessus du logo)
        { name: "PostgreSQL", icon: "https://skillicons.dev/icons?i=postgres", line: 2 },
        { name: "mongoDB", icon: "https://skillicons.dev/icons?i=mongo", line: 2 },
        { name: "Swift", icon: "https://skillicons.dev/icons?i=swift", line: 2 },
        { name: "Kotlin", icon: "https://skillicons.dev/icons?i=kotlin", line: 2 },
        { name: "React", icon: "https://skillicons.dev/icons?i=react", line: 2 },
        { name: "Golang", icon: "https://skillicons.dev/icons?i=golang", line: 2 },
        { name: "nextJS", icon: "https://skillicons.dev/icons?i=nextjs", line: 2 },
        { name: "Github", icon: "https://skillicons.dev/icons?i=github", line: 2 },
        { name: "Redhat", icon: "https://skillicons.dev/icons?i=redhat", line: 2 },
        { name: "Firebase", icon: "https://skillicons.dev/icons?i=firebase", line: 2 },

    ];

    const calculatePositions = () => {
        const lineConfig = {
            1: { y: -250, spacing: 120 },
            2: { y: -160, spacing: 120 },
        };

        const groupedByLine = technologiesDesktop.reduce((acc, tech) => {
            if (!acc[tech.line]) acc[tech.line] = [];
            acc[tech.line].push(tech);
            return acc;
        }, {});

        return technologiesDesktop.map(tech => {
            const techsInLine = groupedByLine[tech.line];
            const indexInLine = techsInLine.indexOf(tech);
            const totalInLine = techsInLine.length;
            const config = lineConfig[tech.line];

            const totalWidth = (totalInLine - 1) * config.spacing;
            const startX = -totalWidth / 2;
            const x = startX + (indexInLine * config.spacing);

            return {
                ...tech,
                x,
                y: config.y,
            };
        });
    };

    const positionedTechnologies = calculatePositions();

    useEffect(() => {
        const updateDimensions = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            if (containerRef.current && !mobile) {
                const rect = containerRef.current.getBoundingClientRect();
                const height = 800;
                setDimensions({
                    width: rect.width,
                    height: height,
                    centerX: rect.width / 2,
                    centerY: height * 0.5
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 } // Threshold réduit pour déclencher plus facilement
        );

        // Observer les deux refs (desktop et mobile)
        const currentContainer = containerRef.current;
        const currentMobile = mobileRef.current;

        if (currentContainer) {
            observer.observe(currentContainer);
        }
        if (currentMobile) {
            observer.observe(currentMobile);
        }

        return () => {
            window.removeEventListener('resize', updateDimensions);
            if (currentContainer) {
                observer.unobserve(currentContainer);
            }
            if (currentMobile) {
                observer.unobserve(currentMobile);
            }
        };
    }, []);

    return (
        <div ref={sectionRef} className="relative min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a1a2e] text-white overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                       w-[400px] md:w-[800px] h-[400px] md:h-[800px] rounded-full bg-purple-900/20 blur-[80px] md:blur-[120px] animate-pulse-ambient"></div>

                {/* Particules flottantes */}
                <div className="particle-bg particle-1"></div>
                <div className="particle-bg particle-2"></div>
                <div className="particle-bg particle-3"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-40 pb-12 md:pb-16 relative z-10">
                {/* Texte de description centré en haut avec animation */}
                <div className={`text-center mb-8 md:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 md:hidden bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                        {t('about.title', 'About Me')}
                    </h2>
                    <p className="text-sm md:text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
                        {t('about.description.part1', 'A full-stack development student driven by')}{' '}
                        <span className="text-purple-400 font-medium hover:text-purple-300 transition-colors duration-300 cursor-default">{t('about.curiosity', 'curiosity')}</span> {t('about.and', 'and')}{' '}
                        <span className="text-purple-400 font-medium hover:text-purple-300 transition-colors duration-300 cursor-default">{t('about.creativity', 'creativity')}</span>.
                        <span className="hidden md:inline"><br /></span>
                        <span className="inline md:hidden"> </span>
                        {t('about.description.part2', 'I love turning ideas into functional, accessible, and elegant web experiences — and I\'m eager to grow within')}
                        <span className="hidden md:inline"><br /></span>
                        <span className="inline md:hidden"> </span>
                        {t('about.description.part3', 'a collaborative team.')}.
                    </p>
                </div>

                {/* VERSION DESKTOP - Diagramme orbital */}
                <div className="hidden md:block">
                    <div ref={containerRef} className={`relative w-full mx-auto h-[800px]`} style={{ perspective: '1000px' }}>
                        {/* SVG Container pour toutes les lignes */}
                        {dimensions.width > 0 && (
                            <svg
                                className="absolute top-0 left-0 w-full h-full z-10"
                                style={{ overflow: 'visible', pointerEvents: 'none' }}
                            >
                                <defs>
                                    {positionedTechnologies.map((_, index) => (
                                        <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} gradientUnits="userSpaceOnUse"
                                                        x1={dimensions.centerX}
                                                        y1={dimensions.centerY}
                                                        x2={dimensions.centerX + positionedTechnologies[index].x}
                                                        y2={dimensions.centerY + positionedTechnologies[index].y}>
                                            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.8)" />
                                            <stop offset="40%" stopColor="rgba(168, 85, 247, 0.6)" />
                                            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.2)" />
                                        </linearGradient>
                                    ))}
                                </defs>
                                {positionedTechnologies.map((tech, index) => {
                                    const iconX = dimensions.centerX + tech.x;
                                    const iconY = dimensions.centerY + tech.y;

                                    return (
                                        <g key={`line-group-${index}`} className={isVisible ? 'line-draw' : ''} style={{ '--delay': `${index * 0.1}s` }}>
                                            <line
                                                x1={dimensions.centerX}
                                                y1={dimensions.centerY}
                                                x2={iconX}
                                                y2={iconY}
                                                stroke="rgba(168, 85, 247, 0.3)"
                                                strokeWidth="3"
                                                strokeDasharray="4,4"
                                                filter="blur(2px)"
                                                className="animate-pulse-line"
                                            />
                                            <line
                                                x1={dimensions.centerX}
                                                y1={dimensions.centerY}
                                                x2={iconX}
                                                y2={iconY}
                                                stroke={`url(#gradient-${index})`}
                                                strokeWidth="2"
                                                strokeDasharray="4,4"
                                                opacity="0.9"
                                            />
                                        </g>
                                    );
                                })}
                            </svg>
                        )}

                        {/* Logo central */}
                        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                            <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
                                <div className="absolute -inset-24 bg-purple-500/20 rounded-full blur-[80px] animate-pulse-slow pointer-events-none"></div>
                                <div className="absolute -inset-16 bg-purple-500/30 rounded-full blur-[60px] animate-pulse-medium pointer-events-none"></div>
                                <div className="absolute -inset-12 bg-purple-600/40 rounded-full blur-[40px] animate-pulse-fast pointer-events-none"></div>

                                <div className="relative w-48 h-48 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 shadow-[0_0_80px_rgba(168,85,247,0.9),0_0_120px_rgba(168,85,247,0.6),inset_0_0_40px_rgba(168,85,247,0.5)] border-2 border-purple-400/30">
                                    <img
                                        src="./logo.png"
                                        alt="logoSM"
                                        className="w-32 h-32 object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Icônes technologies */}
                        {positionedTechnologies.map((tech, index) => (
                            <div
                                key={`tech-${index}`}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-40 group cursor-pointer transition-all duration-700 ${
                                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                                }`}
                                style={{
                                    left: `calc(50% + ${tech.x}px)`,
                                    top: `calc(50% + ${tech.y}px)`,
                                    transitionDelay: `${index * 0.05}s`
                                }}
                            >
                                <div className="relative w-14 h-14 animate-float-tech" style={{ '--delay': `${index * 0.3}s` }}>
                                    <div className="absolute -inset-2 rounded-full bg-purple-500/0
                                      group-hover:bg-purple-500/30 blur-md transition-all duration-300 pointer-events-none animate-pulse-tech"></div>

                                    <div className="w-full h-full bg-[#1a1a2e] rounded-full flex items-center justify-center
                                      shadow-[0_0_15px_rgba(0,0,0,0.8)]
                                      group-hover:shadow-[0_0_25px_rgba(168,85,247,0.8)]
                                      border border-gray-700/50 group-hover:border-purple-500/70
                                      transition-all duration-300
                                      group-hover:scale-110 group-hover:rotate-12">
                                        <img
                                            src={tech.icon}
                                            alt={tech.name}
                                            className="w-8 h-8 object-contain pointer-events-none"
                                        />
                                    </div>
                                </div>

                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100
                                    transition-all duration-300 bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-md
                                    text-xs text-gray-200 whitespace-nowrap border border-purple-500/30 shadow-lg pointer-events-none
                                    group-hover:-translate-y-1">
                                    {tech.name}
                                </div>
                            </div>
                        ))}

                        {/* Orbites elliptiques */}
                        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-5 pointer-events-none transition-all duration-1000 ${
                            isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                             style={{ transformStyle: 'preserve-3d', transform: 'translate(-50%, -50%) rotateX(75deg)' }}>
                            <div className="absolute border border-purple-500/20 rounded-full animate-orbit-1"
                                 style={{ width: '700px', height: '700px', left: '-350px', top: '-350px' }}></div>
                            <div className="absolute border border-purple-500/25 rounded-full animate-orbit-2"
                                 style={{ width: '550px', height: '550px', left: '-275px', top: '-275px' }}></div>
                            <div className="absolute border border-purple-500/30 rounded-full animate-orbit-3"
                                 style={{ width: '400px', height: '400px', left: '-200px', top: '-200px' }}></div>
                            <div className="absolute border border-purple-500/35 rounded-full animate-orbit-4"
                                 style={{ width: '250px', height: '250px', left: '-125px', top: '-125px' }}></div>
                        </div>
                    </div>
                </div>

                {/* VERSION MOBILE - Grille simple */}
                <div ref={mobileRef} className="block md:hidden">
                    <div className="transition-all duration-1000 opacity-100 translate-y-0">
                        {/* Logo central mobile */}
                        <div className="flex justify-center mb-8">
                            <div className="relative">
                                <div className="absolute -inset-8 bg-purple-500/20 rounded-full blur-[30px] animate-pulse-slow pointer-events-none"></div>
                                <div className="absolute -inset-6 bg-purple-500/30 rounded-full blur-[20px] animate-pulse-medium pointer-events-none"></div>
                                <div className="absolute -inset-4 bg-purple-600/40 rounded-full blur-[15px] animate-pulse-fast pointer-events-none"></div>

                                <div className="relative w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 shadow-[0_0_30px_rgba(168,85,247,0.8),0_0_50px_rgba(168,85,247,0.5)] border-2 border-purple-400/30">
                                    <img
                                        src="./logo.png"
                                        alt="logoSM"
                                        className="w-14 h-14 object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Grille de technologies - FORCÉE VISIBLE */}
                        <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto px-4">
                            {technologies.map((tech, index) => (
                                <div
                                    key={`tech-mobile-${index}`}
                                    className="opacity-100 scale-100 transition-all duration-700"
                                    style={{ transitionDelay: `${index * 0.05}s` }}
                                >
                                    <div className="relative w-full aspect-square">
                                        <div className="w-full h-full bg-[#1a1a2e] rounded-lg flex items-center justify-center
                                          shadow-[0_0_8px_rgba(0,0,0,0.8)]
                                          border border-gray-700/50
                                          transition-all duration-300
                                          active:border-purple-500/70 active:shadow-[0_0_15px_rgba(168,85,247,0.8)]">
                                            <img
                                                src={tech.icon}
                                                alt={tech.name}
                                                className="w-7 h-7 object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Animations CSS */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes pulse-ambient {
                    0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.1); }
                }
                .animate-pulse-ambient {
                    animation: pulse-ambient 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.4; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes pulse-medium {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.5; }
                }
                .animate-pulse-medium {
                    animation: pulse-medium 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes pulse-fast {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.6; }
                }
                .animate-pulse-fast {
                    animation: pulse-fast 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes float-tech {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                }
                .animate-float-tech {
                    animation: float-tech 3s ease-in-out infinite;
                    animation-delay: var(--delay);
                }

                @keyframes pulse-tech {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }
                .animate-pulse-tech {
                    animation: pulse-tech 2s ease-in-out infinite;
                }

                @keyframes pulse-line {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }
                .animate-pulse-line {
                    animation: pulse-line 3s ease-in-out infinite;
                }

                .line-draw line {
                    stroke-dasharray: 1000;
                    stroke-dashoffset: 1000;
                    animation: draw-line 1.5s ease-out forwards;
                    animation-delay: var(--delay);
                }

                @keyframes draw-line {
                    to {
                        stroke-dashoffset: 0;
                    }
                }

                @keyframes orbit-rotate-1 {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-orbit-1 {
                    animation: orbit-rotate-1 40s linear infinite;
                }

                @keyframes orbit-rotate-2 {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
                .animate-orbit-2 {
                    animation: orbit-rotate-2 35s linear infinite;
                }

                @keyframes orbit-rotate-3 {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-orbit-3 {
                    animation: orbit-rotate-3 30s linear infinite;
                }

                @keyframes orbit-rotate-4 {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
                .animate-orbit-4 {
                    animation: orbit-rotate-4 25s linear infinite;
                }

                .particle-bg {
                    position: absolute;
                    background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%);
                    border-radius: 50%;
                    filter: blur(40px);
                }

                .particle-1 {
                    width: 150px;
                    height: 150px;
                    top: 10%;
                    left: 10%;
                    animation: float-particle 20s ease-in-out infinite;
                }

                .particle-2 {
                    width: 120px;
                    height: 120px;
                    top: 60%;
                    right: 10%;
                    animation: float-particle 25s ease-in-out infinite reverse;
                }

                .particle-3 {
                    width: 100px;
                    height: 100px;
                    bottom: 10%;
                    left: 50%;
                    animation: float-particle 30s ease-in-out infinite;
                }

                @media (min-width: 768px) {
                    .particle-1 { width: 300px; height: 300px; }
                    .particle-2 { width: 250px; height: 250px; }
                    .particle-3 { width: 200px; height: 200px; }
                }

                @keyframes float-particle {
                    0%, 100% {
                        transform: translate(0, 0);
                        opacity: 0.3;
                    }
                    25% {
                        transform: translate(30px, -30px);
                        opacity: 0.5;
                    }
                    50% {
                        transform: translate(-20px, 20px);
                        opacity: 0.4;
                    }
                    75% {
                        transform: translate(20px, 30px);
                        opacity: 0.6;
                    }
                }
            ` }} />
        </div>
    );
};