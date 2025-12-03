// InfoCards.jsx
import React from "react";

export function InfoCards() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* I'm a Student section */}
            <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    I'm a Student.
                </h2>
                <p className="text-gray-400 text-base">
                    I study at{" "}
                    <a
                        href="https://isagosselies.com"
                        className="text-purple-400 hover:text-purple-300 transition-colors duration-300 underline decoration-purple-400/30 hover:decoration-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Isa Gosselies
                    </a>
                    .
                </p>
            </div>

            {/* Description paragraph */}
            <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
                A self-taught full-stack developer, crafting clean and efficient solutions
                for the web, I build reliable and scalable digital products that balance
                performance, usability, and innovation.
            </p>
        </div>
    );
}
