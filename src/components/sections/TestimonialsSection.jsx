// TestimonialsSection.jsx - Section témoignages avec Supabase
import { useEffect, useRef, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTestimonials } from '../../hooks/useTestimonials';
import { useTranslation } from '../../hooks/useTranslation';
import FadeIn from '../animations/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';

export function TestimonialsSection() {
    const sectionRef = useRef(null);
    const scrollRef = useRef(null);
    const { t, currentLanguage } = useTranslation();
    const { testimonials, loading } = useTestimonials(currentLanguage);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Vérifier si on peut scroller
    const checkScrollButtons = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        checkScrollButtons();
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', checkScrollButtons);
            return () => scrollElement.removeEventListener('scroll', checkScrollButtons);
        }
    }, [testimonials]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 320; // Largeur d'une card + gap
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return (
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">{t('testimonials.loading')}</p>
                </div>
            </section>
        );
    }

    if (!testimonials || testimonials.length === 0) {
        return null; // Ne pas afficher la section s'il n'y a pas de témoignages
    }

    return (
        <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <FadeIn direction="up">
                    <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">
                        <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                            {t('testimonials.title')}
                        </span>
                    </h2>
                    <p className="text-gray-400 text-center mb-8">
                        {t('testimonials.subtitle')}
                    </p>
                    <div className="text-center mb-12">
                        <span className="text-purple-400 font-semibold">{testimonials.length}</span>
                        <span className="text-gray-500"> {testimonials.length > 1 ? t('testimonials.testimonials') : t('testimonials.testimonial')}</span>
                    </div>
                </FadeIn>

                {/* Container avec scroll horizontal */}
                <div className="relative">
                    {/* Boutons de navigation */}
                    <AnimatePresence>
                        {testimonials.length > 3 && (
                            <>
                                {canScrollLeft && (
                                    <motion.button
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onClick={() => scroll('left')}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-gray-800 transition-colors shadow-lg"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </motion.button>
                                )}
                                {canScrollRight && (
                                    <motion.button
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        onClick={() => scroll('right')}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-gray-800 transition-colors shadow-lg"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </motion.button>
                                )}
                            </>
                        )}
                    </AnimatePresence>

                    {/* Scroll container */}
                    <div 
                        ref={scrollRef}
                        className={`flex gap-6 overflow-x-auto scrollbar-hide pb-4 ${
                            testimonials.length <= 3 ? 'justify-center' : ''
                        }`}
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {testimonials.map((testimonial, index) => (
                            <motion.div 
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex-shrink-0 w-80 group"
                            >
                                <div className="relative overflow-hidden h-full">
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 
                                                  rounded-2xl blur-xl opacity-0 group-hover:opacity-100 
                                                  transition-opacity duration-500"></div>

                                    <div className="relative bg-gray-900/60 backdrop-blur-xl 
                                                  border border-white/10 rounded-2xl p-6
                                                  hover:border-purple-500/30 transition-all duration-300
                                                  h-full flex flex-col hover:scale-105">
                                        {/* Quote icon */}
                                        <Quote className="w-8 h-8 text-purple-400/30 mb-4" />

                                        {/* Content */}
                                        <p className="text-gray-300 mb-6 flex-grow italic leading-relaxed">
                                            "{testimonial.content}"
                                        </p>

                                        {/* Rating */}
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>

                                        {/* Author */}
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/30"
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=7c3aed&color=fff&size=48`;
                                                }}
                                            />
                                            <div>
                                                <p className="text-white font-semibold">{testimonial.name}</p>
                                                <p className="text-gray-400 text-sm">{testimonial.role}</p>
                                                {testimonial.company && (
                                                    <p className="text-purple-400 text-xs">{testimonial.company}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Indicateur de scroll pour mobile */}
                {testimonials.length > 3 && (
                    <div className="text-center mt-6 md:hidden">
                        <p className="text-gray-500 text-sm">{t('testimonials.swipeHint')}</p>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            ` }} />
        </section>
    );
}
