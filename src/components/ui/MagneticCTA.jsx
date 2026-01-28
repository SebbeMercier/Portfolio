import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function MagneticCTA({
    children,
    href = "#",
    onClick,
    className = "",
    showArrow = true
}) {
    const buttonRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * 0.3;
        const deltaY = (e.clientY - centerY) * 0.3;

        setPosition({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const Component = href ? motion.a : motion.button;
    const props = href ? { href } : { onClick };

    return (
        <Component
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            className={`group relative inline-flex items-center gap-3 px-8 py-4 overflow-hidden rounded-2xl font-semibold text-white transition-all duration-300 ${className}`}
            animate={{
                x: position.x,
                y: position.y,
            }}
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 0.1,
            }}
            {...props}
        >
            {/* Animated gradient background */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%]"
                animate={{
                    backgroundPosition: isHovered ? ['0% 50%', '100% 50%'] : '0% 50%',
                }}
                transition={{
                    duration: 2,
                    repeat: isHovered ? Infinity : 0,
                    repeatType: "reverse",
                }}
            />

            {/* Glow effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-0 group-hover:opacity-50"
                animate={{
                    scale: isHovered ? 1.5 : 1,
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Shine effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: isHovered ? '100%' : '-100%' }}
                transition={{ duration: 0.6 }}
            />

            {/* Content */}
            <span className="relative z-10 flex items-center gap-3">
                {children}
                {showArrow && (
                    <motion.span
                        animate={{
                            x: isHovered ? 5 : 0,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                        }}
                    >
                        <ArrowRight className="w-5 h-5" />
                    </motion.span>
                )}
            </span>

            {/* Border highlight */}
            <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-white/0 group-hover:border-white/20"
                transition={{ duration: 0.3 }}
            />
        </Component>
    );
}
