// FloatingParticles.jsx - Particules flottantes optimisées
import { useEffect, useRef, useMemo, useCallback } from 'react';

// Throttle helper pour limiter les appels
const throttle = (func, delay) => {
    let timeoutId;
    let lastRan;
    return function (...args) {
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (Date.now() - lastRan >= delay) {
                    func.apply(this, args);
                    lastRan = Date.now();
                }
            }, delay - (Date.now() - lastRan));
        }
    };
};

export function FloatingParticles() {
    const containerRef = useRef(null);
    const rafRef = useRef(null);
    const mousePos = useRef({ x: 0, y: 0 });

    // Générer les particules une seule fois avec useMemo
    const particles = useMemo(() =>
        Array.from({ length: 15 }, (_, i) => ({ // Réduit de 20 à 15
            id: i,
            size: Math.random() * 6 + 3,
            left: Math.random() * 100,
            top: Math.random() * 100,
            color: i % 3 === 0
                ? 'rgba(168, 85, 247, 0.3)'
                : i % 3 === 1
                    ? 'rgba(236, 72, 153, 0.3)'
                    : 'rgba(147, 51, 234, 0.3)',
            duration: 3 + Math.random() * 2,
            delay: i * 0.2,
        }))
        , []);

    // Utiliser requestAnimationFrame pour des animations fluides
    const updateParticles = useCallback(() => {
        const particleElements = containerRef.current?.querySelectorAll('.particle');
        if (!particleElements) return;

        particleElements.forEach((particle) => {
            const rect = particle.getBoundingClientRect();
            const particleX = rect.left + rect.width / 2;
            const particleY = rect.top + rect.height / 2;

            const deltaX = mousePos.current.x - particleX;
            const deltaY = mousePos.current.y - particleY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            const maxDistance = 150; // Réduit de 200 à 150
            if (distance < maxDistance && distance > 0) {
                const force = (maxDistance - distance) / maxDistance;
                const moveX = -deltaX * force * 0.3; // Réduit de 0.5 à 0.3
                const moveY = -deltaY * force * 0.3;

                particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                particle.style.transform = '';
            }
        });
    }, []);

    // Throttle du mousemove
    useEffect(() => {
        const handleMouseMove = throttle((e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };

            // Annuler le RAF précédent
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            // Utiliser RAF pour synchroniser avec le refresh du navigateur
            rafRef.current = requestAnimationFrame(updateParticles);
        }, 16); // ~60fps

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [updateParticles]);

    return (
        <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle absolute rounded-full will-change-transform"
                    style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        background: p.color,
                        boxShadow: '0 0 10px currentColor',
                        filter: 'blur(0.5px)',
                        animation: `float ${p.duration}s ease-in-out infinite`,
                        animationDelay: `${p.delay}s`,
                    }}
                />
            ))}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes float {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.3;
                    }
                    25% {
                        transform: translate(-15px, -20px) scale(1.1);
                        opacity: 0.5;
                    }
                    50% {
                        transform: translate(10px, -30px) scale(0.9);
                        opacity: 0.4;
                    }
                    75% {
                        transform: translate(15px, -15px) scale(1.05);
                        opacity: 0.5;
                    }
                }
            ` }} />
        </div>
    );
}
