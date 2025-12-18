// src/pages/Projects.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { animate } from 'animejs';
import { ExternalLink, Github, Server } from 'lucide-react';
import { useSectionGradient } from '../hooks/useSectionGradient';
import { useProjects } from '../hooks/useProjects';
import FadeIn from '../components/animations/FadeIn';
import StaggerContainer, { StaggerItem } from '../components/animations/StaggerContainer';
import FloatingCard from '../components/animations/FloatingCard';

const ProjectLinks = ({ links }) => {
    const linkItems = [
        { type: 'web', icon: <ExternalLink className="w-4 h-4" />, label: "View site", url: links.web },
        { type: 'githubFront', icon: <Github className="w-4 h-4" />, label: "Frontend", url: links.githubFront },
        { type: 'githubBack', icon: <Server className="w-4 h-4" />, label: "Backend", url: links.githubBack }
    ];

    return (
        <div className="flex gap-3 mt-2">
            {linkItems.map((item, index) => (
                item.url && (
                    <a
                        key={index}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                        aria-label={item.label}
                    >
                        {item.icon}
                        <span className="text-xs text-gray-300 group-hover:text-white">
                            {item.type === 'web' ? 'Site' : item.type === 'githubFront' ? 'Front' : 'Back'}
                        </span>
                    </a>
                )
            ))}
        </div>
    );
};

const ProjectCard = ({ project, index }) => {
    const isLeft = index % 2 === 0;
    const cardRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const cardElement = cardRef.current;
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animate(entry.target, {
                            opacity: [0, 1],
                            translateY: [50, 0],
                            duration: 1000,
                            easing: 'out-expo'
                        });
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (cardElement) {
            observer.observe(cardElement);
        }

        return () => {
            if (cardElement) {
                observer.unobserve(cardElement);
            }
        };
    }, []);

    const statusColors = {
        'Live': 'bg-green-500/20 text-green-400 border-green-500/30',
        'In Development': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'Completed': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };

    return (
        <div 
            ref={cardRef} 
            className="project-card mb-16 opacity-0 group cursor-pointer"
            onClick={() => navigate(`/projects/${project.id}`)}
        >
            <div className="relative overflow-hidden">
                {/* Enhanced glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 
                              rounded-2xl blur-xl opacity-0 group-hover:opacity-100 
                              transition-all duration-700 group-hover:blur-2xl"></div>

                {/* Main card with glassmorphism */}
                <div className="relative bg-gray-900/70 backdrop-blur-2xl 
                              border border-white/10 rounded-2xl p-8
                              hover:border-purple-500/40 hover:bg-gray-900/80
                              transition-all duration-500 hover:scale-[1.02]
                              shadow-2xl hover:shadow-purple-500/10">
                    
                    <div className={`flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8`}>
                        {/* Enhanced Project image */}
                        <div className="lg:w-2/5">
                            <div className="relative overflow-hidden rounded-xl border border-gray-700/50 
                                          shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-500 aspect-video
                                          hover:border-purple-500/50">
                                {/* Image overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <img
                                    src={project.image}
                                    alt={`Screenshot of ${project.title}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%231a1a2e" width="400" height="300"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E' + project.title + '%3C/text%3E%3C/svg%3E';
                                    }}
                                />
                                
                                {/* Shine effect on image */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                              translate-x-[-100%] group-hover:translate-x-[100%] 
                                              transition-transform duration-1000 z-20" />
                            </div>
                        </div>

                        {/* Text content */}
                        <div className="lg:w-3/5 space-y-4">
                            {/* Header with title and badges */}
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-100 transition-colors duration-300">
                                        {project.title}
                                    </h3>
                                    <div className="flex gap-2 items-center">
                                        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                            {project.year}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-purple-400 transition-colors duration-300"></span>
                                        <span className={`text-xs px-3 py-1.5 rounded-full border backdrop-blur-sm ${statusColors[project.status]} 
                                                       hover:scale-105 transition-transform duration-300`}>
                                            {project.status}
                                        </span>
                                    </div>
                                </div>
                                <ProjectLinks links={project.links} />
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 leading-relaxed">
                                {project.description}
                            </p>

                            {/* Features */}
                            {project.features && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-purple-400">Key Features:</h4>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {project.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center text-sm text-gray-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Enhanced Tags */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {project.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="group/tag relative px-3 py-1.5 bg-purple-900/30 text-purple-300 text-xs rounded-full 
                                                 border border-purple-500/20 hover:border-purple-500/60 
                                                 hover:bg-purple-900/50 hover:text-purple-200
                                                 transition-all duration-300 hover:scale-105 cursor-default
                                                 backdrop-blur-sm overflow-hidden"
                                    >
                                        {/* Shine effect on tags */}
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                                       translate-x-[-100%] group-hover/tag:translate-x-[100%] 
                                                       transition-transform duration-500" />
                                        <span className="relative z-10">{tag}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Projects = () => {
    const sectionRef = useSectionGradient('#0a0f1f');
    const [filter, setFilter] = useState('all');
    const { projects: projectsData, loading } = useProjects(); // Utiliser le hook
    
    const categories = ['all', 'Web', 'E-commerce', 'Backend', 'Mobile'];
    
    const filteredProjects = filter === 'all' 
        ? projectsData 
        : projectsData.filter(p => p.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())));
    
    return (
        <section ref={sectionRef} id="projects" className="min-h-screen pt-40 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a1a2e] via-[#1a2a3e] to-[#0a0f1f] relative overflow-hidden">
            {/* Enhanced background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-pink-500/5 rounded-full blur-3xl" />
            </div>
            
            <div className="max-w-6xl mx-auto relative z-10">
                <FadeIn direction="down" duration={0.8}>
                    <h2 className="text-4xl font-bold text-center mb-4 text-white">
                        My <span className="text-purple-400">Projects</span>
                    </h2>
                    <p className="text-gray-400 text-center mb-2">
                        Discover my recent work
                    </p>
                    <p className="text-center mb-12">
                        <span className="text-purple-400 font-semibold">{filteredProjects.length}</span>
                        <span className="text-gray-500"> {filteredProjects.length > 1 ? 'projects' : 'project'}</span>
                    </p>
                </FadeIn>

                {/* Enhanced Filters */}
                <FadeIn delay={0.2} duration={0.6}>
                    <div className="flex justify-center gap-3 mb-16 flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`group relative px-6 py-3 rounded-full font-medium transition-all duration-300 overflow-hidden
                                    ${filter === cat 
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 scale-105' 
                                        : 'bg-gray-800/50 backdrop-blur-sm text-gray-400 hover:text-white hover:bg-gray-800/70 border border-white/10 hover:border-white/20 hover:scale-105'
                                    }`}
                            >
                                {/* Shine effect */}
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                
                                {/* Glow effect for active */}
                                {filter === cat && (
                                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-lg opacity-50 -z-10" />
                                )}
                                
                                <span className="relative z-10">
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </span>
                            </button>
                        ))}
                    </div>
                </FadeIn>

                <StaggerContainer staggerDelay={0.15} className="space-y-12">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                            <p className="text-gray-400">Loading projects...</p>
                        </div>
                    ) : filteredProjects.length > 0 ? (
                        filteredProjects.map((project, index) => (
                            <StaggerItem key={project.id}>
                                <FloatingCard>
                                    <ProjectCard project={project} index={index} />
                                </FloatingCard>
                            </StaggerItem>
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg">No projects found for this category</p>
                        </div>
                    )}
                </StaggerContainer>
            </div>
        </section>
    );
};

export default Projects;
