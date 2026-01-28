// ServicesSection.jsx - Ce que je fais
import { useEffect, useRef, useState } from 'react';
import { Globe, Smartphone, Database, Zap } from 'lucide-react';
import { animate, stagger } from 'animejs';
import { useTranslation } from '../../hooks/useTranslation';

export function ServicesSection() {
    const sectionRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    const { t } = useTranslation();

    const services = [
        {
            icon: Globe,
            title: t('services.webDev.title', 'Web Development'),
            description: t('services.webDev.description', 'Building responsive and performant web applications with React, Next.js, and modern frameworks.'),
            features: [
                t('services.webDev.feature1', 'SPA & SSR'), 
                t('services.webDev.feature2', 'Progressive Web Apps'), 
                t('services.webDev.feature3', 'E-commerce Solutions')
            ]
        },
        {
            icon: Smartphone,
            title: t('services.mobileDev.title', 'Mobile Development'),
            description: t('services.mobileDev.description', 'Creating native mobile experiences for iOS and Android using Swift and Kotlin.'),
            features: [
                t('services.mobileDev.feature1', 'Native iOS Apps'), 
                t('services.mobileDev.feature2', 'Native Android Apps'), 
                t('services.mobileDev.feature3', 'Cross-platform Solutions')
            ]
        },
        {
            icon: Database,
            title: t('services.backendDev.title', 'Backend Development'),
            description: t('services.backendDev.description', 'Designing scalable APIs and microservices with Node.js and Golang.'),
            features: [
                t('services.backendDev.feature1', 'RESTful APIs'), 
                t('services.backendDev.feature2', 'GraphQL'), 
                t('services.backendDev.feature3', 'Microservices Architecture')
            ]
        },
        {
            icon: Zap,
            title: t('services.performance.title', 'Performance Optimization'),
            description: t('services.performance.description', 'Optimizing applications for speed, scalability, and user experience.'),
            features: [
                t('services.performance.feature1', 'Caching Strategies'), 
                t('services.performance.feature2', 'Database Optimization'), 
                t('services.performance.feature3', 'CDN Integration')
            ]
        }
    ];

    useEffect(() => {
        const sectionElement = sectionRef.current;
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        animate(entry.target.querySelectorAll('.service-card'), {
                            opacity: [0, 1],
                            translateY: [50, 0],
                            scale: [0.9, 1],
                            delay: stagger(150),
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
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        {t('services.title', 'What I Do')}
                    </span>
                </h2>
                <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                    {t('services.subtitle', 'Specialized in building modern, scalable, and user-friendly digital solutions')}
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    {services.map((service, index) => (
                        <div key={index} className="service-card opacity-0 group">
                            <div className="relative overflow-hidden h-full">
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 
                                              rounded-2xl blur-xl opacity-0 group-hover:opacity-100 
                                              transition-opacity duration-500"></div>

                                <div className="relative bg-gray-900/60 backdrop-blur-xl 
                                              border border-white/10 rounded-2xl p-8
                                              hover:border-purple-500/30 transition-all duration-300
                                              h-full flex flex-col">
                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 
                                                  flex items-center justify-center mb-6
                                                  group-hover:scale-110 group-hover:rotate-3 
                                                  transition-transform duration-300
                                                  shadow-lg shadow-purple-500/25">
                                        <service.icon className="w-7 h-7 text-white" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        {service.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-400 mb-6 flex-grow">
                                        {service.description}
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-2">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center text-sm text-gray-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
