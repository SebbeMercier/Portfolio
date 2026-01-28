// TimelineSection.jsx - Timeline du parcours
import { useEffect, useRef, useState } from 'react';
import { GraduationCap, Briefcase, Code } from 'lucide-react';
import { animate, stagger } from 'animejs';
import { useTranslation } from '../../hooks/useTranslation';

export function TimelineSection() {
    const sectionRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    const { t } = useTranslation();

    const timeline = [
        {
            year: '2023',
            icon: GraduationCap,
            title: t('timeline.item1.title', 'Started Full-Stack Development'),
            description: t('timeline.item1.description', 'Began my journey in web development at Isa Gosselies'),
            color: 'from-purple-400 to-pink-500'
        },
        {
            year: '2024',
            icon: Code,
            title: t('timeline.item2.title', 'First Professional Projects'),
            description: t('timeline.item2.description', 'Developed Eldocam.com and Cedra-shop.eu with modern tech stack'),
            color: 'from-blue-400 to-cyan-500'
        },
        {
            year: '2025',
            icon: Briefcase,
            title: t('timeline.item3.title', 'Expanding Skills'),
            description: t('timeline.item3.description', 'Learning mobile development with Swift and Kotlin'),
            color: 'from-green-400 to-emerald-500'
        }
    ];

    useEffect(() => {
        const sectionElement = sectionRef.current;
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        animate(entry.target.querySelectorAll('.timeline-item'), {
                            opacity: [0, 1],
                            translateY: [50, 0],
                            delay: stagger(200),
                            duration: 800,
                            easing: 'out-expo'
                        });
                        setHasAnimated(true);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionElement) {
            observer.observe(sectionElement);
        }

        return () => {
            if (sectionElement) {
                observer.unobserve(sectionElement);
            }
        };
    }, [hasAnimated]);

    return (
        <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        {t('timeline.title', 'My Journey')}
                    </span>
                </h2>

                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 hidden md:block"></div>

                    <div className="space-y-12">
                        {timeline.map((item, index) => (
                            <div key={index} className="timeline-item opacity-0 relative">
                                <div className="flex items-start gap-6">
                                    {/* Icon */}
                                    <div className="hidden md:flex relative z-10">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} 
                                                      flex items-center justify-center
                                                      shadow-lg shadow-purple-500/25
                                                      group-hover:scale-110 transition-transform duration-300`}>
                                            <item.icon className="w-8 h-8 text-white" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 group">
                                        <div className="relative overflow-hidden">
                                            {/* Glow effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 
                                                          rounded-2xl blur-xl opacity-0 group-hover:opacity-100 
                                                          transition-opacity duration-500"></div>

                                            <div className="relative bg-gray-900/60 backdrop-blur-xl 
                                                          border border-white/10 rounded-2xl p-6
                                                          hover:border-purple-500/30 transition-all duration-300">
                                                {/* Year badge */}
                                                <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${item.color} 
                                                              text-white text-sm font-semibold mb-3`}>
                                                    {item.year}
                                                </div>

                                                <h3 className="text-xl font-bold text-white mb-2">
                                                    {item.title}
                                                </h3>

                                                <p className="text-gray-400">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
