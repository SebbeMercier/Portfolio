import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export function InteractiveCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const rafRef = useRef(null);
    const cursorPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Détecter si c'est un appareil mobile ou tactile
        const checkMobile = () => {
            const isTouch = window.matchMedia("(pointer: coarse)").matches;
            const isSmallScreen = window.innerWidth < 1024;
            setIsMobile(isTouch || isSmallScreen);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        if (isMobile) return;

        const updateMousePosition = (e) => {
            cursorPos.current = { x: e.clientX, y: e.clientY };

            // Annuler le RAF précédent
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            // Utiliser RAF pour synchroniser avec le refresh
            rafRef.current = requestAnimationFrame(() => {
                setMousePosition(cursorPos.current);
            });
        };

        const handleMouseOver = (e) => {
            if (
                e.target.tagName === 'BUTTON' ||
                e.target.tagName === 'A' ||
                e.target.closest('button') ||
                e.target.closest('a')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', updateMousePosition, { passive: true });
        window.addEventListener('mouseover', handleMouseOver, { passive: true });

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [isMobile]);

    if (isMobile) return null;


    return (
        <>
            {/* Main cursor */}
            <motion.div
                className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] mix-blend-difference will-change-transform"
                animate={{
                    x: mousePosition.x - 12,
                    y: mousePosition.y - 12,
                    scale: isHovering ? 1.5 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    mass: 0.4,
                }}
            >
                <div className="w-full h-full rounded-full border-2 border-white" />
            </motion.div>

            {/* Trailing cursor */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9999] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full will-change-transform"
                animate={{
                    x: mousePosition.x - 4,
                    y: mousePosition.y - 4,
                    scale: isHovering ? 2 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 12,
                    mass: 0.1,
                }}
            />
        </>
    );
}
