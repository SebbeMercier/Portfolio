import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function ParallaxSection({
    children,
    speed = 0.5,
    className = "",
    direction = "up"
}) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(
        scrollYProgress,
        [0, 1],
        direction === "up" ? [100 * speed, -100 * speed] : [-100 * speed, 100 * speed]
    );

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <motion.div
            ref={ref}
            style={{ y, opacity }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function RevealOnScroll({
    children,
    className = "",
    delay = 0,
    direction = "up",
    amount = 0.3
}) {
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
            x: direction === "left" ? 50 : direction === "right" ? -50 : 0,
            scale: 0.95,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: delay,
                ease: [0.25, 0.4, 0.25, 1],
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: amount }}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
}
