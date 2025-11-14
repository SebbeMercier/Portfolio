// src/pages/About.jsx
import React, { useRef, useEffect, useState } from 'react';

const About = () => {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0, centerX: 0, centerY: 0 });

    // Technologies avec système de lignes
    const technologies = [
        // Ligne 1 (la plus haute)
        { name: "HTML5", icon: "https://skillicons.dev/icons?i=html", line: 1 },
        { name: "CSS3", icon: "https://skillicons.dev/icons?i=css", line: 1 },
        { name: "Node.js", icon: "https://skillicons.dev/icons?i=nodejs", line: 1 },
        { name: "Redis", icon: "https://skillicons.dev/icons?i=redis", line: 1 },
        { name: "JavaScript", icon: "https://skillicons.dev/icons?i=js", line: 1 },
        { name: "ElasticSearch", icon: "https://skillicons.dev/icons?i=elasticsearch", line: 1 },

        // Ligne 2 (juste au-dessus du logo)
        { name: "PostgreSQL", icon: "https://skillicons.dev/icons?i=postgres", line: 2 },
        { name: "MySQL", icon: "https://skillicons.dev/icons?i=mysql", line: 2 },
        { name: "Swift", icon: "https://skillicons.dev/icons?i=swift", line: 2 },
        { name: "Kotlin", icon: "https://skillicons.dev/icons?i=kotlin", line: 2 },
        { name: "Express", icon: "https://skillicons.dev/icons?i=express", line: 2 },
        { name: "Golang", icon: "https://skillicons.dev/icons?i=golang", line: 2 },
    ];

    // Configuration des lignes
    const lineConfig = {
        1: { y: -250, spacing: 120 }, // Ligne du haut
        2: { y: -160, spacing: 120 }, // Ligne du milieu
        3: { y: -70, spacing: 120 },  // Ligne optionnelle (proche du logo)
    };

    // Calcul automatique des positions X pour chaque ligne
    const calculatePositions = () => {
        const groupedByLine = technologies.reduce((acc, tech) => {
            if (!acc[tech.line]) acc[tech.line] = [];
            acc[tech.line].push(tech);
            return acc;
        }, {});

        return technologies.map(tech => {
            const techsInLine = groupedByLine[tech.line];
            const indexInLine = techsInLine.indexOf(tech);
            const totalInLine = techsInLine.length;
            const config = lineConfig[tech.line];

            // Centrer les éléments sur la ligne
            const totalWidth = (totalInLine - 1) * config.spacing;
            const startX = -totalWidth / 2;
            const x = startX + (indexInLine * config.spacing);

            return {
                ...tech,
                x,
                y: config.y
            };
        });
    };

    const positionedTechnologies = calculatePositions();

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setDimensions({
                    width: rect.width,
                    height: 800,
                    centerX: rect.width / 2,
                    centerY: 800 * 0.45
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a0b2e] to-[#0a0a1a] text-white overflow-hidden relative">
            {/* Effet de lumière d'arrière-plan global */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                       w-[800px] h-[800px] rounded-full bg-purple-900/20 blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                {/* Texte de description centré en haut */}
                <div className="text-center mb-20">
                    <p className="text-base md:text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        A full-stack development student driven by{' '}
                        <span className="text-purple-400 font-medium">curiosity</span> and{' '}
                        <span className="text-purple-400 font-medium">creativity</span>.<br />
                        I love turning ideas into functional, accessible, and elegant web experiences — and I'm eager to grow within<br />
                        a collaborative team.
                    </p>
                </div>

                {/* Conteneur principal avec perspective 3D */}
                <div ref={containerRef} className="relative w-full h-[800px] mx-auto" style={{ perspective: '1000px' }}>
                    {/* SVG Container pour toutes les lignes - Z-INDEX 10 */}
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
                                    <g key={`line-group-${index}`}>
                                        {/* Ligne de glow (effet de lumière) */}
                                        <line
                                            x1={dimensions.centerX}
                                            y1={dimensions.centerY}
                                            x2={iconX}
                                            y2={iconY}
                                            stroke="rgba(168, 85, 247, 0.3)"
                                            strokeWidth="3"
                                            strokeDasharray="4,4"
                                            filter="blur(2px)"
                                        />
                                        {/* Ligne principale */}
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

                    {/* Logo central avec effet glow 3D - Z-INDEX 30 */}
                    <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                        <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
                            {/* Multi-couches de glow pour effet 3D */}
                            <div className="absolute -inset-24 bg-purple-500/20 rounded-full blur-[80px] animate-pulse-slow pointer-events-none"></div>
                            <div className="absolute -inset-16 bg-purple-500/30 rounded-full blur-[60px] pointer-events-none"></div>
                            <div className="absolute -inset-12 bg-purple-600/40 rounded-full blur-[40px] pointer-events-none"></div>
                            <div className="absolute -inset-8 bg-purple-500/50 rounded-full blur-[20px] pointer-events-none"></div>

                            {/* Sphère du logo avec dégradé radial */}
                            <div className="relative w-48 h-48 rounded-full flex items-center justify-center
                             bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700
                             shadow-[0_0_80px_rgba(168,85,247,0.9),0_0_120px_rgba(168,85,247,0.6),inset_0_0_40px_rgba(168,85,247,0.5)]
                             border-2 border-purple-400/30">
                                {/* Image du logo remplaçant le texte <S·M> */}
                                <img
                                    src="./logo.png"
                                    alt="logoSM"
                                    className="w-32 h-32 object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Icônes technologies - Z-INDEX 40 (AU-DESSUS DES LIGNES) */}
                    {positionedTechnologies.map((tech, index) => (
                        <div
                            key={`tech-${index}`}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-40 group cursor-pointer"
                            style={{
                                left: `calc(50% + ${tech.x}px)`,
                                top: `calc(45% + ${tech.y}px)`
                            }}
                        >
                            <div className="relative w-14 h-14">
                                {/* Halo externe */}
                                <div className="absolute -inset-2 rounded-full bg-purple-500/0
                                  group-hover:bg-purple-500/30 blur-md transition-all duration-300 pointer-events-none"></div>

                                {/* Cercle de l'icône */}
                                <div className="w-full h-full bg-[#1a1a2e] rounded-full flex items-center justify-center
                                  shadow-[0_0_15px_rgba(0,0,0,0.8)]
                                  group-hover:shadow-[0_0_25px_rgba(168,85,247,0.8)]
                                  border border-gray-700/50 group-hover:border-purple-500/70
                                  transition-all duration-300
                                  group-hover:scale-110">
                                    <img
                                        src={tech.icon}
                                        alt={tech.name}
                                        className="w-8 h-8 object-contain pointer-events-none"
                                    />
                                </div>
                            </div>

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100
                                transition-opacity duration-300 bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-md
                                text-xs text-gray-200 whitespace-nowrap border border-purple-500/30 shadow-lg pointer-events-none">
                                {tech.name}
                            </div>
                        </div>
                    ))}

                    {/* Orbites elliptiques en bas avec perspective - Z-INDEX 5 */}
                    <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-5 pointer-events-none"
                         style={{ transformStyle: 'preserve-3d', transform: 'translate(-50%, -50%) rotateX(75deg)' }}>
                        {/* Orbite 1 (la plus grande) */}
                        <div className="absolute border border-purple-500/20 rounded-full"
                             style={{ width: '700px', height: '700px', left: '-350px', top: '-350px' }}></div>
                        {/* Orbite 2 */}
                        <div className="absolute border border-purple-500/25 rounded-full"
                             style={{ width: '550px', height: '550px', left: '-275px', top: '-275px' }}></div>
                        {/* Orbite 3 */}
                        <div className="absolute border border-purple-500/30 rounded-full"
                             style={{ width: '400px', height: '400px', left: '-200px', top: '-200px' }}></div>
                        {/* Orbite 4 (la plus proche) */}
                        <div className="absolute border border-purple-500/35 rounded-full"
                             style={{ width: '250px', height: '250px', left: '-125px', top: '-125px' }}></div>
                    </div>
                </div>
            </div>

            {/* Animations */}
            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.4; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default About;
