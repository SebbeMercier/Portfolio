// InfoCards.jsx
import React, { useEffect, useRef } from "react";
import { createTimeline, animate } from 'animejs';

export function InfoCards() {
    const cardRef = useRef(null);
    const titleRef = useRef(null);
    const linkRef = useRef(null);
    const descRef = useRef(null);

    useEffect(() => {
        // Animation d'entrée en cascade
        createTimeline({
            defaults: {
                easing: 'out-expo',
            }
        })
        .add(titleRef.current, {
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 1200,
        })
        .add(linkRef.current, {
            opacity: [0, 1],
            translateX: [-20, 0],
            duration: 800,
        }, '-=800')
        .add(descRef.current, {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1000,
        }, '-=600');

        // Animation subtile au hover sur le lien
        const linkElement = linkRef.current?.querySelector('a');
        if (linkElement) {
            linkElement.addEventListener('mouseenter', () => {
                animate(linkElement, {
                    scale: [1, 1.05],
                    duration: 300,
                    easing: 'out-quad'
                });
            });

            linkElement.addEventListener('mouseleave', () => {
                animate(linkElement, {
                    scale: [1.05, 1],
                    duration: 300,
                    easing: 'out-quad'
                });
            });
        }
    }, []);

    return (
        <div ref={cardRef} className="space-y-8">
            {/* I'm a Student section */}
            <div className="space-y-2">
                <h2 ref={titleRef} className="text-2xl sm:text-3xl font-bold text-white opacity-0">
                    I'm a Student.
                </h2>
                <p ref={linkRef} className="text-gray-400 text-base opacity-0">
                    I study at{" "}
                    <a
                        href="https://isagosselies.com"
                        className="text-purple-400 hover:text-purple-300 transition-colors duration-300 underline decoration-purple-400/30 hover:decoration-purple-300 inline-block"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Isa Gosselies
                    </a>
                    .
                </p>
            </div>

            {/* Description paragraph */}
            <p ref={descRef} className="text-gray-400 text-base leading-relaxed max-w-2xl opacity-0">
                A self-taught full-stack developer, crafting clean and efficient solutions
                for the web, I build reliable and scalable digital products that balance
                performance, usability, and innovation.
            </p>
        </div>
    );
}
