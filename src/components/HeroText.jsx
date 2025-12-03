import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function HeroText() {
    const [showImagine, setShowImagine] = useState(false);

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
            className="space-y-6 -mt-16 lg:-mt-32"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="space-y-2 relative" variants={itemVariants}>
                <p className="text-sm sm:text-base text-gray-300 relative z-10">
                    Hello, I'm{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
                        Sebbe Mercier
                    </span>
                </p>

                {/* Subtitle */}
                <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-[0.35em] font-light">
                    A fullstack developper
                </p>
            </motion.div>

            {/* Main headline */}
            <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.15] pt-2"
                variants={itemVariants}
            >
                <span className="block text-white">Front to back</span>
                <span className="block text-white">I build what others{" "}
                    {showImagine && (
                        <motion.span
                            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600"
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
                            imagine.
                        </motion.span>
                    )}

                </span>
            </motion.h1>
        </motion.div>
    );
}