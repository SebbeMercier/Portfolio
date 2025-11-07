// src/components/Hero.jsx
const Hero = () => {
    return (
        <section className="min-h-screen bg-[#1a1a2e] pt-[72px] px-12">
            <div className="max-w-6xl mx-auto h-full flex flex-col justify-center relative">
                {/* Conteneur principal avatar + texte */}
                <div className="flex items-start mb-20 relative">
                    {/* Avatar avec effet lumière */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-purple-909/30 rounded-full blur-xl"></div>
                        <img
                            src="https://avatars.githubusercontent.com/u/169470778?s=400&u=5cef47dac5ac1ee53471087b4a104daac7c2f4b1&v=4"
                            alt="Sebbe Mercier avatar"
                            className="w-64 h-64 relative z-10 rounded-full object-cover border-2 border-purple-500/30"
                        />
                    </div>

                    {/* Conteneur texte à droite avec décalage */}
                    <div className="ml-16 mt-10 relative"> {/* mt-10 au lieu de mt-12 (descente très légère) */}
                        {/* Ligne courbée longue (INCHANGÉE) */}
                        <svg
                            className="absolute -left-24 top-0 w-32 h-24 text-purple-400/50"
                            viewBox="0 0 200 100"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M30,20 Q100,0 170,20"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                fill="none"
                                strokeLinecap="round"
                            />
                        </svg>

                        <div className="pt-1"> {/* Ajout d'un petit padding-top pour descentre très légèrement */}
                            <p className="text-purple-400 font-medium mb-1 pl-4">
                                Hello , I'm <span className="text-white">Sebbe Mercier</span>
                            </p>
                            <p className="text-white/70 text-sm mb-6 pl-4">A fullstack developer</p>

                            {/* Texte "Front to back" avec effet violet fluide */}
                            <h1 className="text-5xl font-bold text-white/80 leading-tight pl-4">
                                Front to back<br/>
                                I build what others{" "}
                                <span className="purple-rainbow-text">imagine.</span>
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Le reste du code reste inchangé */}
                <div className="mt-12">
                    <h2 className="text-5xl font-bold text-white mb-2">
                        I'm a Student.
                    </h2>
                    <p className="text-white/60 text-lg ml-1">
                        I study at{" "}
                        <a
                            href="https://isagosselies.com"
                            className="text-purple-400 hover:text-purple-300 transition-colors duration-300 border-b border-transparent hover:border-purple-300"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Isa Gosselies
                        </a>.
                    </p>
                </div>

                <p className="text-white/60 mt-12 max-w-3xl text-lg leading-relaxed">
                    A self-taught full-stack developer, crafting clean and efficient solutions<br/>
                    for the web. I build reliable and scalable digital products that balance<br/>
                    performance, usability, and innovation.
                </p>
            </div>

            <style jsx>{`
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
            `}</style>
        </section>
    );
};

export default Hero;
