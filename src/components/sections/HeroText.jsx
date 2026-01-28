import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TypewriterText } from "../ui/TypewriterText";
import { useTranslation } from "../../hooks/useTranslation";

export function HeroText() {
    const [showImagine, setShowImagine] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowImagine(true);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            className="space-y-6 -mt-44 lg:-mt-44"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="space-y-2 relative" variants={itemVariants}>
                <p className="text-sm sm:text-base text-gray-300 relative z-10">
                    {t('hero.greeting', 'Hello, I\'m')}{" "}
                    <motion.span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 font-bold inline-block relative"
                        style={{ backgroundSize: '200% auto' }}
                        animate={{
                            backgroundPosition: ['0% center', '200% center']
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        whileHover={{ scale: 1.05 }}
                    >
                        Sebbe Mercier
                        <span className="absolute inset-0 blur-sm bg-gradient-to-r from-purple-400/30 to-pink-400/30 -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.span>
                </p>

                {/* Subtitle with typewriter effect */}
                <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-[0.35em] font-light">
                    <TypewriterText
                        texts={[
                            t('hero.role1', 'A fullstack developer'),
                            t('hero.role2', 'A creative coder'),
                            t('hero.role3', 'A problem solver'),
                            t('hero.role4', 'A tech enthusiast')
                        ]}
                        typingSpeed={80}
                        deletingSpeed={40}
                        pauseDuration={2500}
                    />
                </p>
            </motion.div>

            {/* Main headline */}
            <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.3] pt-2"
                variants={itemVariants}
            >
                <span className="block text-white relative overflow-hidden">
                    <motion.span
                        className="inline-block"
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                    >
                        {t('hero.frontToBack', 'Front to back')}
                    </motion.span>
                </span>
                <span className="block text-white overflow-visible">{t('hero.buildWhat', 'I build what others')}{" "}
                    {showImagine && (
                        <motion.span
                            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 pb-1"
                            initial={{
                                opacity: 0,
                                filter: "blur(10px)",
                            }}
                            animate={{
                                opacity: 1,
                                filter: "blur(0px)",
                            }}
                            transition={{
                                duration: 1.5,
                                ease: "easeOut"
                            }}
                            style={{
                                backgroundSize: "200% auto",
                                textShadow: "0 0 20px rgba(168, 85, 247, 0.5)"
                            }}
                        >
                            {t('hero.imagine', 'imagine.')}
                        </motion.span>
                    )}

                </span>
            </motion.h1>
        </motion.div>
    );
}
