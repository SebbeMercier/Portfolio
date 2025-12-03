import React from "react";
import { Avatar } from "./Avatar";
import { HeroText } from "./HeroText";
import { Curve } from "./Curve";
import { HeroArrow } from "./HeroArrow";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 py-20">
            {/* Gradient background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
            </div>

            {/* Content */}
            <div className="relative z-20 max-w-7xl mx-auto w-full">
                <div className="grid lg:grid-cols-[350px_1fr] gap-12 lg:gap-20 items-center">
                    {/* Left: Avatar + Info */}
                    <div className="flex flex-col items-center lg:items-start space-y-8">
                        <div className="relative">
                            <Avatar />


                            <HeroArrow />


                        </div>

                        {/* Info section */}
                        <div className="space-y-6 text-center lg:text-left max-w-sm animate-fade-in-up -mt-4 lg:-mt-8">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-white">
                                    I'm a Student.
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    I study at{" "}
                                    <a
                                        href="https://isagosselies.com"
                                        className="text-purple-400 hover:text-purple-300 transition-colors duration-300 underline decoration-purple-400/30 hover:decoration-purple-300"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Isa Gosselies
                                    </a>.
                                </p>
                            </div>

                            <p className="text-gray-400 text-sm leading-relaxed">
                                A self-taught full-stack developer, crafting clean and efficient solutions
                                for the web, I build reliable and scalable digital products that balance
                                performance, usability, and innovation.
                            </p>
                        </div>
                    </div>

                    {/* Right: Hero Text avec la courbe décorative */}
                    <div className="relative pt-4 lg:pt-0">
                        <Curve />
                        <HeroText />
                    </div>
                </div>
            </div>
        </section>
    );
}
