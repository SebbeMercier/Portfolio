import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../../hooks/useTranslation";

export function HeroArrow() {
    const { currentLanguage } = useTranslation();

    // Ajustements par langue pour une boucle qui passe par le haut et pointe vers le bas
    const getSettings = () => {
        switch (currentLanguage) {
            case 'fr': 
                return { 
                    x: 15, 
                    y: -70, 
                    path: "M 10,210 Q 180,80 320,225", 
                    head: "M 305,218 L 320,225 L 318,208"
                };
            case 'nl': 
                return { 
                    x: 15, 
                    y: -70, 
                    path: "M 10,210 Q 180,80 330,240", 
                    head: "M 315,233 L 330,240 L 328,223" 
                };
            default: // English
                return { 
                    x: 15, 
                    y: -70, 
                    path: "M 10,210 Q 180,80 310,240", 
                    head: "M 295,233 L 310,240 L 308,223" 
                };
        }
    };

    const settings = getSettings();

    const pathVariants = {
        hidden: { 
            pathLength: 0, 
            opacity: 0 
        },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { duration: 1.2, ease: "easeInOut", delay: 0.3 },
                opacity: { duration: 0.3, delay: 0.3 }
            }
        },
        exit: {
            pathLength: 0,
            opacity: 0,
            transition: {
                duration: 0.4,
                ease: "easeIn"
            }
        }
    };

    const arrowHeadVariants = {
        hidden: { 
            pathLength: 0, 
            opacity: 0,
            scale: 0
        },
        visible: {
            pathLength: 1,
            opacity: 1,
            scale: 1,
            transition: {
                pathLength: { duration: 0.5, ease: "easeOut", delay: 1.3 },
                opacity: { duration: 0.2, delay: 1.3 },
                scale: { duration: 0.3, delay: 1.3, ease: "backOut" }
            }
        },
        exit: {
            pathLength: 0,
            opacity: 0,
            scale: 0,
            transition: {
                duration: 0.3,
                ease: "easeIn"
            }
        }
    };

    const svgVariants = {
        hidden: { 
            opacity: 0,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            scale: 1,
            x: settings.x,
            y: settings.y,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.svg
                key={currentLanguage} // Force le remontage lors du changement de langue
                className="hidden lg:block absolute left-[92%] top-[-30px] w-[450px] h-[300px] pointer-events-none z-30"
                variants={svgVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                viewBox="0 0 450 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <motion.path
                    d={settings.path}
                    stroke="url(#arrowGradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    variants={pathVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                />
                <motion.path
                    d={settings.head}
                    stroke="url(#arrowGradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={arrowHeadVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{ transformOrigin: "320px 225px" }} // Centre de rotation pour la tête
                />
                <defs>
                    <linearGradient
                        id="arrowGradient"
                        x1="0"
                        y1="0"
                        x2="100%"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#EC4899" stopOpacity="1" />
                    </linearGradient>
                </defs>
            </motion.svg>
        </AnimatePresence>
    );
}
