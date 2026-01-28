import React from "react";
import { motion } from "framer-motion";
import { Avatar } from "../ui/Avatar";
import { HeroText } from "./HeroText";
import { Curve } from "../ui/Curve";
import { HeroArrow } from "./HeroArrow";
import { MagneticCTA } from "../ui/MagneticCTA";
import { useSectionGradient } from "../../hooks/useSectionGradient";
import { useTranslation } from "../../hooks/useTranslation";
import FadeIn from "../animations/FadeIn";
import ScaleIn from "../animations/ScaleIn";

// Hoisted static background elements to optimize rendering
const BackgroundEffects = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs with enhanced colors */}
        <motion.div 
            className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]"
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
        <motion.div 
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/15 rounded-full blur-[120px]"
            animate={{
                scale: [1, 1.3, 1],
                opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
            }}
        />
        <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-[150px]"
            animate={{
                scale: [1, 1.15, 1],
                opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
            }}
        />

        {/* Dynamic mesh gradient overlay */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(at_0%_0%,rgba(168,85,247,0.15)_0,transparent_50%),radial-gradient(at_100%_100%,rgba(236,72,153,0.15)_0,transparent_50%)]" />

        {/* Grid pattern overlay with mask */}
        <motion.div 
            className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"
            animate={{
                backgroundPosition: ['0px 0px', '40px 40px'],
            }}
            transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
            }}
        />
    </div>
);

export function Hero() {
    const sectionRef = useSectionGradient('#0a0a1a');
    const { t, currentLanguage } = useTranslation();

    // Animation variants pour le changement de langue
    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 pt-44 pb-20 bg-[#0f0a1f] overflow-hidden">
            <div className="absolute inset-0 z-0 bg-[#0f0a1f]" />
            <BackgroundEffects />

            {/* Content */}
            <div className="relative z-20 max-w-[1400px] mx-auto w-full">
                <div className="grid lg:grid-cols-[400px_1fr] gap-12 lg:gap-24 items-center">
                    {/* Left: Avatar + Info */}
                    <div className="flex flex-col items-center lg:items-start space-y-8">
                        <ScaleIn duration={0.8}>
                            <div className="relative">
                                <Avatar />
                                <HeroArrow />
                            </div>
                        </ScaleIn>

                        {/* Enhanced Info section with glassmorphism */}
                        <FadeIn delay={0.3} direction="up">
                            <motion.div 
                                className="relative group"
                                key={`info-${currentLanguage}`}
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                {/* Glassmorphism card */}
                                <motion.div 
                                    className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transition-all duration-500"
                                    whileHover={{ 
                                        scale: 1.02,
                                        boxShadow: "0 20px 50px rgba(168, 85, 247, 0.3)",
                                        borderColor: "rgba(255, 255, 255, 0.2)",
                                        backgroundColor: "rgba(255, 255, 255, 0.1)"
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Gradient overlay */}
                                    <motion.div 
                                        className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 rounded-2xl pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    />

                                    <div className="relative space-y-4 text-center lg:text-left">
                                        <motion.div 
                                            className="space-y-2"
                                            key={`title-${currentLanguage}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2, duration: 0.5 }}
                                        >
                                            <h2 className="text-2xl font-bold text-white group-hover:text-purple-100 transition-colors duration-300">
                                                {t('pages.home.title', 'I\'m a Student.')}
                                            </h2>
                                            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                                                {t('pages.home.subtitle', 'I study at')}{" "}
                                                <motion.a
                                                    href="https://isagosselies.com"
                                                    className="text-purple-400 hover:text-purple-300 transition-colors duration-300 underline decoration-purple-400/30 hover:decoration-purple-300 relative inline-block group/link"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <span className="relative z-10">Isa Gosselies</span>
                                                    <motion.span 
                                                        className="absolute inset-0 bg-purple-500/20 rounded"
                                                        initial={{ scale: 0 }}
                                                        whileHover={{ scale: 1 }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                </motion.a>.
                                            </p>
                                        </motion.div>

                                        <motion.div 
                                            className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: 0.4, duration: 0.6 }}
                                        />

                                        <motion.p 
                                            className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300"
                                            key={`description-${currentLanguage}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5, duration: 0.5 }}
                                        >
                                            {t('pages.home.description', 'A self-taught full-stack developer, crafting clean and efficient solutions for the web. I build reliable and scalable digital products that balance performance, usability, and innovation.')}
                                        </motion.p>

                                        {/* Status indicator */}
                                        <motion.div 
                                            className="flex items-center gap-2 text-xs text-green-400"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.7, duration: 0.5 }}
                                        >
                                            <motion.div 
                                                className="w-2 h-2 bg-green-400 rounded-full"
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    opacity: [1, 0.5, 1],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                            {t('pages.home.available', 'Available for projects')}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </FadeIn>

                        {/* CTA Button */}
                        <FadeIn delay={0.6} direction="up">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full lg:w-auto"
                            >
                                <MagneticCTA href="#contact" className="w-full lg:w-auto justify-center">
                                    {t('pages.home.cta', 'Let\'s work together')}
                                </MagneticCTA>
                            </motion.div>
                        </FadeIn>
                    </div>

                    {/* Right: Hero Text avec la courbe décorative */}
                    <FadeIn delay={0.5} direction="left">
                        <motion.div 
                            className="relative pt-4 lg:pt-0"
                            key={`hero-text-${currentLanguage}`}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <Curve />
                            <HeroText />
                        </motion.div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
