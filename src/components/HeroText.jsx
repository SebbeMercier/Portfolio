import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TypewriterText } from "./TypewriterText";

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
            className="space-y-6 -mt-12 lg:-mt-28"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="space-y-2 relative" variants={itemVariants}>
                <p className="text-sm sm:text-base text-gray-300 relative z-10">
                    Hello, I'm{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold inline-block">
                        Sebbe Mercier
                    </span>
                </p>

                {/* Subtitle with typewriter effect */}
                <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-[0.35em] font-light">
                    <TypewriterText
                        texts={[
                            "A fullstack developer",
                            "A creative coder",
                            "A problem solver",
                            "A tech enthusiast"
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
                        Front to back
                    </motion.span>
                </span>
                <span className="block text-white overflow-visible">I build what others{" "}
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
                            imagine.
                        </motion.span>
                    )}

                </span>
            </motion.h1>
        </motion.div>
    );
}