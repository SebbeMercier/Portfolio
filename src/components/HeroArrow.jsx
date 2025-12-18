import React from "react";
import { motion } from "framer-motion";

export function HeroArrow() {
    const pathVariants = {
        hidden: {
            pathLength: 0,
            opacity: 0
        },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: {
                    duration: 1.2,
                    ease: "easeInOut",
                    delay: 0.3
                },
                opacity: {
                    duration: 0.3,
                    delay: 0.3
                }
            }
        }
    };

    const arrowHeadVariants = {
        hidden: {
            pathLength: 0,
            opacity: 0
        },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: {
                    duration: 0.5,
                    ease: "easeOut",
                    delay: 1.3
                },
                opacity: {
                    duration: 0.2,
                    delay: 1.3
                }
            }
        }
    };

    return (
        <svg
            className="hidden lg:block absolute left-[95%] -top-[20px] w-[360px] h-[110px] pointer-events-none z-30"
            viewBox="0 0 480 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <motion.path
                d="M 50,80 Q 180,40 280,135"
                stroke="url(#arrowGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
            />
            <motion.path
                d="M 268 130 L 280 135 L 274 124"
                stroke="url(#arrowGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={arrowHeadVariants}
                initial="hidden"
                animate="visible"
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
        </svg>
    );
}
