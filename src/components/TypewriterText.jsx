import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function TypewriterText({
    texts = [],
    typingSpeed = 100,
    deletingSpeed = 50,
    pauseDuration = 2000,
    className = ""
}) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (texts.length === 0) return;

        const targetText = texts[currentTextIndex];

        if (isPaused) {
            const pauseTimeout = setTimeout(() => {
                setIsPaused(false);
                setIsDeleting(true);
            }, pauseDuration);
            return () => clearTimeout(pauseTimeout);
        }

        if (!isDeleting && currentText === targetText) {
            setIsPaused(true);
            return;
        }

        if (isDeleting && currentText === '') {
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
            return;
        }

        const timeout = setTimeout(() => {
            setCurrentText(prev => {
                if (isDeleting) {
                    return targetText.substring(0, prev.length - 1);
                } else {
                    return targetText.substring(0, prev.length + 1);
                }
            });
        }, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, isPaused, currentTextIndex, texts, typingSpeed, deletingSpeed, pauseDuration]);

    return (
        <span className={className}>
            {currentText}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="inline-block w-0.5 h-[1em] bg-current ml-1 align-middle"
            />
        </span>
    );
}
