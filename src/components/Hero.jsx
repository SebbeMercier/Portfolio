import React from "react";
import { Avatar } from "./Avatar";
import { HeroText } from "./HeroText";
import { Curve } from "./Curve";
import { HeroArrow } from "./HeroArrow";
import { MagneticCTA } from "./MagneticCTA";
import { useSectionGradient } from "../hooks/useSectionGradient";
import { useTranslation } from "../hooks/useTranslation";
// Removed unused motion import
import FadeIn from "./animations/FadeIn";
import ScaleIn from "./animations/ScaleIn";

export function Hero() {
    const sectionRef = useSectionGradient('#0a0a1a');
    const { t } = useTranslation();

    return (
        <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 py-20 bg-gradient-to-b from-[#0f0a1f] via-[#1a0b2e] to-[#0a0a1a] overflow-hidden">
            {/* Enhanced background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Animated gradient orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow" />

                {/* Floating particles */}
                <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400/60 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
                <div className="absolute top-40 right-32 w-1 h-1 bg-pink-400/60 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
                <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }} />
                <div className="absolute top-1/3 right-20 w-1 h-1 bg-purple-300/60 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
            </div>

            {/* Content */}
            <div className="relative z-20 max-w-7xl mx-auto w-full">
                <div className="grid lg:grid-cols-[350px_1fr] gap-12 lg:gap-20 items-center">
                    {/* Left: Avatar + Info */}
                    <div className="flex flex-col items-center lg:items-start space-y-8">
                        <ScaleIn duration={0.8}>
                            <div className="relative">
                                <Avatar />
                                <HeroArrow />
                            </div>
                        </ScaleIn>

                        {/* Enhanced Info section with glassmorphism */}
                        <FadeIn delay={0.3} direction="up">
                            <div className="relative group">
                                {/* Glassmorphism card */}
                                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:bg-white/10 hover:border-white/20">
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative space-y-4 text-center lg:text-left">
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-bold text-white group-hover:text-purple-100 transition-colors duration-300">
                                                {t('pages.home.title', 'I\'m a Student.')}
                                            </h2>
                                            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                                                {t('pages.home.subtitle', 'I study at')}{" "}
                                                <a
                                                    href="https://isagosselies.com"
                                                    className="text-purple-400 hover:text-purple-300 transition-colors duration-300 underline decoration-purple-400/30 hover:decoration-purple-300 relative inline-block group/link"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <span className="relative z-10">Isa Gosselies</span>
                                                    <span className="absolute inset-0 bg-purple-500/20 rounded scale-0 group-hover/link:scale-100 transition-transform duration-300" />
                                                </a>.
                                            </p>
                                        </div>

                                        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

                                        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                            {t('pages.home.description', 'A self-taught full-stack developer, crafting clean and efficient solutions for the web. I build reliable and scalable digital products that balance performance, usability, and innovation.')}
                                        </p>

                                        {/* Status indicator */}
                                        <div className="flex items-center gap-2 text-xs text-green-400">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                            {t('pages.home.available', 'Available for projects')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        {/* CTA Button */}
                        <FadeIn delay={0.6} direction="up">
                            <MagneticCTA href="#contact" className="w-full lg:w-auto justify-center">
                                {t('pages.home.cta', 'Let\'s work together')}
                            </MagneticCTA>
                        </FadeIn>
                    </div>

                    {/* Right: Hero Text avec la courbe décorative */}
                    <FadeIn delay={0.5} direction="left">
                        <div className="relative pt-4 lg:pt-0">
                            <Curve />
                            <HeroText />
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
