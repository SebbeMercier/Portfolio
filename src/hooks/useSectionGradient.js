// useSectionGradient.js - Hook pour enregistrer la couleur de fin d'une section
import { useEffect, useRef } from 'react';
import { useGradient } from '../contexts/GradientContext';

export const useSectionGradient = (endColor) => {
    const { setLastColor } = useGradient();
    const sectionRef = useRef(null);

    useEffect(() => {
        const sectionElement = sectionRef.current;
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Si la section est visible à plus de 50%
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        setLastColor(endColor);
                    }
                });
            },
            { threshold: [0.5] }
        );

        if (sectionElement) {
            observer.observe(sectionElement);
        }

        return () => {
            if (sectionElement) {
                observer.unobserve(sectionElement);
            }
        };
    }, [endColor, setLastColor]);

    return sectionRef;
};
