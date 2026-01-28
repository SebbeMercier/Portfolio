// Hook personnalisé pour les animations au scroll avec anime.js
import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

export const useAnimeOnScroll = (animationConfig, options = {}) => {
    const elementRef = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        animate(element, animationConfig);
                        
                        if (!options.repeat) {
                            hasAnimated.current = true;
                        }
                    }
                });
            },
            {
                threshold: options.threshold || 0.1,
                rootMargin: options.rootMargin || '0px',
            }
        );

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [animationConfig, options]);

    return elementRef;
};
