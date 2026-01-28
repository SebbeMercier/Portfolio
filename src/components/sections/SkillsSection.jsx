// SkillsSection.jsx - Section des compétences avec barres de progression
import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { useTranslation } from '../../hooks/useTranslation';

const skills = [
    { name: 'React / Next.js', level: 90, color: 'from-cyan-400 to-blue-500' },
    { name: 'Node.js / Golang', level: 85, color: 'from-green-400 to-emerald-500' },
    { name: 'TypeScript / JavaScript', level: 88, color: 'from-yellow-400 to-orange-500' },
    { name: 'PostgreSQL / MongoDB', level: 80, color: 'from-blue-400 to-indigo-500' },
    { name: 'Swift / Kotlin', level: 75, color: 'from-orange-400 to-red-500' },
    { name: 'Redis / Elasticsearch', level: 70, color: 'from-red-400 to-pink-500' }
];

export function SkillsSection() {
    const sectionRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const sectionElement = sectionRef.current;
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        // Animer les titres
                        animate(entry.target.querySelectorAll('.skill-item'), {
                            opacity: [0, 1],
                            translateX: [-50, 0],
                            delay: stagger(100),
                            duration: 600,
                            easing: 'out-expo'
                        });

                        // Animer les barres de progression
                        setTimeout(() => {
                            entry.target.querySelectorAll('.skill-bar').forEach((bar, index) => {
                                animate(bar, {
                                    width: [`0%`, `${skills[index].level}%`],
                                    duration: 1500,
                                    delay: index * 100,
                                    easing: 'out-expo'
                                });
                            });
                        }, 300);

                        setHasAnimated(true);
                    }
                });
            },
            { threshold: 0.2 }
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
                <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        {t('skills.title', 'Technical Skills')}
                    </span>
                </h2>

                <div className="space-y-6">
                    {skills.map((skill, index) => (
                        <div key={index} className="skill-item opacity-0">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white font-medium">{skill.name}</span>
                                <span className="text-gray-400 text-sm">{skill.level}%</span>
                            </div>
                            
                            <div className="relative h-3 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                                {/* Glow effect */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${skill.color} opacity-20 blur-sm`}></div>
                                
                                {/* Progress bar */}
                                <div 
                                    className={`skill-bar absolute inset-y-0 left-0 bg-gradient-to-r ${skill.color} rounded-full transition-all duration-300`}
                                    style={{ width: '0%' }}
                                >
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                                                  translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            ` }} />
        </section>
    );
}
