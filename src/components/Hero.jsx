// src/components/Hero.jsx
const Hero = () => {
    return (
        <section className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#1a1a2e] to-[#0f0a1f] pt-24 md:pt-[72px] px-4 sm:px-6 md:px-12 relative overflow-hidden pb-0">
            {/* Particules flottantes en arrière-plan */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
                <div className="particle particle-3"></div>
                <div className="particle particle-4"></div>
                <div className="particle particle-5"></div>
            </div>

            <div className="max-w-6xl mx-auto h-full flex flex-col justify-center relative">

                {/* Version Mobile - Layout Card */}
                <div className="md:hidden flex flex-col items-center space-y-6">
                    {/* Avatar avec carte moderne */}
                    <div className="relative w-full max-w-sm">
                        <div className="bg-gradient-to-br from-purple-900/20 to-purple-600/10 backdrop-blur-sm rounded-3xl p-6 border border-purple-500/20 shadow-2xl animate-fade-in-up">
                            {/* Avatar centré */}
                            <div className="relative avatar-container mx-auto mb-6">
                                <div className="absolute inset-0 bg-purple-900/30 rounded-full blur-xl animate-pulse-glow"></div>
                                <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-2xl animate-rotate-slow"></div>
                                <img
                                    src="https://avatars.githubusercontent.com/u/169470778?s=400&u=5cef47dac5ac1ee53471087b4a104daac7c2f4b1&v=4"
                                    alt="Sebbe Mercier avatar"
                                    className="w-40 h-40 relative z-10 rounded-full object-cover border-4 border-purple-500/40 hover:border-purple-400/80 transition-all duration-500 hover:scale-105 mx-auto"
                                />
                            </div>

                            {/* Texte dans la carte */}
                            <div className="text-center space-y-3">
                                <div className="inline-block px-4 py-1.5 bg-purple-500/10 rounded-full border border-purple-400/30 mb-2">
                                    <p className="text-purple-300 text-sm font-medium">
                                        Hello, I'm <span className="text-white font-semibold">Sebbe Mercier</span>
                                    </p>
                                </div>

                                <p className="text-purple-300/80 text-sm font-medium tracking-wide uppercase">
                                    Fullstack Developer
                                </p>

                                <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent mx-auto my-4"></div>

                                <h1 className="text-2xl font-bold text-white/90 leading-tight px-2">
                                    Front to back<br/>
                                    I build what others{" "}
                                    <span className="purple-rainbow-text">imagine.</span>
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Carte Étudiant */}
                    <div className="w-full max-w-sm animate-fade-in-up delay-300">
                        <div className="bg-gradient-to-br from-purple-900/10 to-purple-600/5 backdrop-blur-sm rounded-2xl p-5 border border-purple-500/20">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    I'm a Student
                                </h2>
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Studying at{" "}
                                <a
                                    href="https://isagosselies.com"
                                    className="text-purple-400 hover:text-purple-300 transition-all duration-300 font-medium underline decoration-purple-400/30 hover:decoration-purple-300"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Isa Gosselies
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="w-full max-w-sm animate-fade-in-up delay-500">
                        <p className="text-white/60 text-sm leading-relaxed text-center px-2">
                            A self-taught full-stack developer, crafting clean and efficient solutions
                            for the web. I build reliable and scalable digital products that balance
                            performance, usability, and innovation.
                        </p>
                    </div>
                </div>

                {/* Version Desktop - Layout Original */}
                <div className="hidden md:flex flex-col">
                    <div className="flex items-start mb-12 relative">
                        {/* Avatar avec effet lumière animé */}
                        <div className="relative avatar-container flex-shrink-0">
                            <div className="absolute inset-0 bg-purple-900/30 rounded-full blur-xl animate-pulse-glow"></div>
                            <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-2xl animate-rotate-slow"></div>
                            <img
                                src="https://avatars.githubusercontent.com/u/169470778?s=400&u=5cef47dac5ac1ee53471087b4a104daac7c2f4b1&v=4"
                                alt="Sebbe Mercier avatar"
                                className="w-64 h-64 relative z-10 rounded-full object-cover border-2 border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 animate-fade-in-up"
                            />
                        </div>

                        {/* Conteneur texte à droite avec décalage */}
                        <div className="ml-16 mt-10 relative animate-fade-in-right">
                            {/* Ligne courbée longue animée */}
                            <svg
                                className="absolute -left-24 top-0 w-32 h-24 text-purple-400/50 animate-draw-line"
                                viewBox="0 0 200 100"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M30,20 Q100,0 170,20"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    fill="none"
                                    strokeLinecap="round"
                                    className="path-animation"
                                />
                            </svg>

                            <div className="pt-1">
                                <p className="text-purple-400 font-medium mb-1 pl-4 animate-fade-in-up delay-200 text-lg">
                                    Hello, I'm <span className="text-white">Sebbe Mercier</span>
                                </p>
                                <p className="text-white/70 text-base mb-6 pl-4 animate-fade-in-up delay-300">
                                    A fullstack developer
                                </p>

                                {/* Texte "Front to back" avec effet violet fluide */}
                                <h1 className="text-5xl font-bold text-white/80 leading-tight pl-4 animate-fade-in-up delay-400">
                                    Front to back<br/>
                                    I build what others{" "}
                                    <span className="purple-rainbow-text">imagine.</span>
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 animate-fade-in-up delay-500">
                        <h2 className="text-5xl font-bold text-white mb-2 hover:text-purple-300 transition-colors duration-300">
                            I'm a Student.
                        </h2>
                        <p className="text-white/60 text-lg ml-1">
                            I study at{" "}
                            <a
                                href="https://isagosselies.com"
                                className="text-purple-400 hover:text-purple-300 transition-all duration-300 border-b border-transparent hover:border-purple-300 inline-block hover:translate-x-1"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Isa Gosselies
                            </a>.
                        </p>
                    </div>

                    <p className="text-white/60 mt-8 max-w-3xl text-lg leading-relaxed animate-fade-in-up delay-600">
                        A self-taught full-stack developer, crafting clean and efficient solutions
                        for the web. I build reliable and scalable digital products that balance
                        performance, usability, and innovation.
                    </p>
                </div>
            </div>

            <style jsx>{`
                /* Animation texte rainbow violet */
                .purple-rainbow-text {
                    background: linear-gradient(90deg,
                    #a855f7, #c084fc, #a855f7,
                    #8b5cf6, #7c3aed, #6d28d9,
                    #a855f7, #c084fc
                    );
                    background-size: 300% 100%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    animation: purpleFlow 8s ease-in-out infinite;
                }

                @keyframes purpleFlow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                /* Fade in up pour les éléments */
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                    opacity: 0;
                }

                /* Fade in right pour le texte */
                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .animate-fade-in-right {
                    animation: fadeInRight 1s ease-out forwards;
                    opacity: 0;
                }

                /* Délais pour les animations */
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-400 { animation-delay: 0.4s; }
                .delay-500 { animation-delay: 0.5s; }
                .delay-600 { animation-delay: 0.6s; }

                /* Pulse glow pour l'avatar */
                @keyframes pulseGlow {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.5;
                        transform: scale(1.05);
                    }
                }

                .animate-pulse-glow {
                    animation: pulseGlow 3s ease-in-out infinite;
                }

                /* Rotation lente */
                @keyframes rotateSlow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .animate-rotate-slow {
                    animation: rotateSlow 20s linear infinite;
                }

                /* Animation ligne SVG */
                @keyframes drawLine {
                    from {
                        stroke-dashoffset: 200;
                        opacity: 0;
                    }
                    to {
                        stroke-dashoffset: 0;
                        opacity: 1;
                    }
                }

                .animate-draw-line path {
                    stroke-dasharray: 200;
                    stroke-dashoffset: 200;
                    animation: drawLine 1.5s ease-out forwards;
                    animation-delay: 0.3s;
                }

                /* Particules flottantes */
                .particle {
                    position: absolute;
                    background: radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%);
                    border-radius: 50%;
                    filter: blur(2px);
                    animation: float 20s ease-in-out infinite;
                }

                .particle-1 {
                    width: 60px;
                    height: 60px;
                    top: 10%;
                    left: 20%;
                    animation-delay: 0s;
                }

                .particle-2 {
                    width: 80px;
                    height: 80px;
                    top: 60%;
                    left: 80%;
                    animation-delay: 3s;
                }

                .particle-3 {
                    width: 50px;
                    height: 50px;
                    top: 40%;
                    left: 10%;
                    animation-delay: 6s;
                }

                .particle-4 {
                    width: 70px;
                    height: 70px;
                    top: 80%;
                    left: 60%;
                    animation-delay: 9s;
                }

                .particle-5 {
                    width: 55px;
                    height: 55px;
                    top: 20%;
                    left: 90%;
                    animation-delay: 12s;
                }

                /* Particules plus grandes sur desktop */
                @media (min-width: 768px) {
                    .particle-1 { width: 100px; height: 100px; }
                    .particle-2 { width: 150px; height: 150px; }
                    .particle-3 { width: 80px; height: 80px; }
                    .particle-4 { width: 120px; height: 120px; }
                    .particle-5 { width: 90px; height: 90px; }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.3;
                    }
                    25% {
                        transform: translate(20px, -20px) scale(1.1);
                        opacity: 0.5;
                    }
                    50% {
                        transform: translate(-15px, 15px) scale(0.9);
                        opacity: 0.4;
                    }
                    75% {
                        transform: translate(15px, 10px) scale(1.05);
                        opacity: 0.6;
                    }
                }
            `}</style>
        </section>
    );
};

export default Hero;