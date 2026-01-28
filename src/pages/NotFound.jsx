// Page 404 moderne avec animations et navigation
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Compass, Zap } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();
    const glitchRef = useRef(null);

    useEffect(() => {
        // Effet de glitch sur le 404
        const glitchElement = glitchRef.current;
        if (!glitchElement) return;

        const glitchInterval = setInterval(() => {
            glitchElement.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
            glitchElement.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
            
            setTimeout(() => {
                glitchElement.style.transform = 'translate(0, 0)';
                glitchElement.style.filter = 'hue-rotate(0deg)';
            }, 100);
        }, 3000);

        return () => clearInterval(glitchInterval);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const floatingVariants = {
        animate: {
            y: [-10, 10, -10],
            rotate: [-5, 5, -5],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const quickLinks = [
        { name: 'Accueil', path: '/', icon: Home, description: 'Retour à la page principale' },
        { name: 'Projets', path: '/projects', icon: Compass, description: 'Découvrir mes réalisations' },
        { name: 'Contact', path: '/contact', icon: Zap, description: 'Me contacter directement' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1a2e] via-[#1a2a3e] to-[#0a0f1f] 
                        flex items-center justify-center px-4 relative overflow-hidden">
            
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-500/8 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-3xl" />
                
                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [-20, 20, -20],
                            opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <motion.div
                className="max-w-4xl mx-auto text-center relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* 404 Number avec effet glitch */}
                <motion.div
                    ref={glitchRef}
                    variants={itemVariants}
                    className="relative mb-8"
                >
                    <h1 className="text-[12rem] sm:text-[16rem] font-black text-transparent bg-clip-text 
                                 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 
                                 leading-none select-none relative">
                        404
                        {/* Glitch layers */}
                        <span className="absolute inset-0 text-red-500 opacity-20 animate-pulse"
                              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}>
                            404
                        </span>
                        <span className="absolute inset-0 text-blue-500 opacity-20 animate-pulse"
                              style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)' }}>
                            404
                        </span>
                    </h1>
                </motion.div>

                {/* Message principal */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Oops ! Page introuvable
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Il semblerait que cette page ait disparu dans les méandres du cyberespace. 
                        Mais ne vous inquiétez pas, je peux vous aider à retrouver votre chemin !
                    </p>
                </motion.div>

                {/* Boutons d'action */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <motion.button
                        onClick={() => navigate(-1)}
                        className="group flex items-center justify-center gap-3 px-8 py-4 
                                 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl 
                                 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 
                                 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                        Retour en arrière
                    </motion.button>

                    <motion.button
                        onClick={() => navigate('/')}
                        className="group flex items-center justify-center gap-3 px-8 py-4 
                                 bg-gray-800/50 backdrop-blur-sm text-white rounded-xl border border-white/10
                                 hover:bg-gray-800/70 hover:border-white/20 transition-all duration-300 
                                 hover:scale-105 font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        Accueil
                    </motion.button>
                </motion.div>

                {/* Liens rapides */}
                <motion.div variants={itemVariants}>
                    <h3 className="text-xl font-semibold text-white mb-6">
                        Ou explorez ces sections :
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                        {quickLinks.map((link, index) => (
                            <motion.div
                                key={link.name}
                                variants={floatingVariants}
                                animate="animate"
                                style={{ animationDelay: `${index * 0.5}s` }}
                                className="group cursor-pointer"
                                onClick={() => navigate(link.path)}
                            >
                                <div className="relative overflow-hidden">
                                    {/* Glow effect */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 
                                                  rounded-xl blur-lg opacity-0 group-hover:opacity-100 
                                                  transition-all duration-500" />
                                    
                                    {/* Card */}
                                    <div className="relative bg-gray-900/60 backdrop-blur-xl border border-white/10 
                                                  rounded-xl p-6 hover:border-purple-500/40 hover:bg-gray-900/80
                                                  transition-all duration-300 hover:scale-105">
                                        <link.icon className="w-8 h-8 text-purple-400 mx-auto mb-3 
                                                           group-hover:scale-110 group-hover:text-purple-300 
                                                           transition-all duration-300" />
                                        <h4 className="text-white font-semibold mb-2 group-hover:text-purple-100 
                                                     transition-colors duration-300">
                                            {link.name}
                                        </h4>
                                        <p className="text-gray-400 text-sm group-hover:text-gray-300 
                                                    transition-colors duration-300">
                                            {link.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Message de développeur */}
                <motion.div 
                    variants={itemVariants}
                    className="mt-16 p-6 bg-gray-900/30 backdrop-blur-sm border border-white/5 rounded-xl"
                >
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <Search className="w-5 h-5 text-purple-400" />
                        <span className="text-purple-400 font-medium">Développeur</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        Si vous pensez qu'il s'agit d'une erreur ou si vous cherchiez quelque chose de spécifique, 
                        n'hésitez pas à me contacter. Je serai ravi de vous aider !
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NotFound;