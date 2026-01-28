// MagneticButton.jsx - Effet magnétique au hover
import { useRef, useEffect } from 'react';
import { animate } from 'animejs';

export function MagneticButton({ children, className = '', strength = 0.3 }) {
    const buttonRef = useRef(null);

    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;

        const handleMouseMove = (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            animate(button, {
                translateX: x * strength,
                translateY: y * strength,
                duration: 300,
                easing: 'out-quad'
            });
        };

        const handleMouseLeave = () => {
            animate(button, {
                translateX: 0,
                translateY: 0,
                duration: 500,
                easing: 'out-elastic(1, .6)'
            });
        };

        button.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            button.removeEventListener('mousemove', handleMouseMove);
            button.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [strength]);

    return (
        <div ref={buttonRef} className={`inline-block ${className}`}>
            {children}
        </div>
    );
}
