// src/pages/Projects.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Server } from 'lucide-react';
import { useSectionGradient } from '../hooks/useSectionGradient';
import { useProjects } from '../hooks/useProjects';
import { useTranslation } from '../hooks/useTranslation';
import FadeIn from '../components/animations/FadeIn';
import StaggerContainer, { StaggerItem } from '../components/animations/StaggerContainer';
import FloatingCard from '../components/animations/FloatingCard';

const ProjectLinks = ({ links = {} }) => {
    const { t } = useTranslation();
    
    const linkItems = [
        { type: 'web', icon: <ExternalLink className="w-4 h-4" />, label: t('projects.viewSite', 'View site'), url: links.web },
        { type: 'githubFront', icon: <Github className="w-4 h-4" />, label: t('projects.frontend', 'Frontend'), url: links.githubFront },
        { type: 'githubBack', icon: <Server className="w-4 h-4" />, label: t('projects.backend', 'Backend'), url: links.githubBack }
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
                            {item.type === 'web' ? t('projects.site', 'Site') : item.type === 'githubFront' ? t('projects.front', 'Front') : t('projects.back', 'Back')}
                        </span>
                    </a>
                )
            ))}
        </div>
    );
};

const ProjectCard = ({ project, index }) => {
    const isLeft = index % 2 === 0;
    const navigate = useNavigate();

    const statusColors = {
        'Live': 'bg-green-500/20 text-green-400 border-green-500/30',
        'In Development': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'Completed': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="project-card mb-16 group cursor-pointer"
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
                                <ProjectLinks links={project.links || {}} />
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
                                        {(project.features || []).map((feature, idx) => (
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
                                {(project.tags || []).map((tag, idx) => (
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
        </motion.div>
    );
};

const Projects = () => {
    const sectionRef = useSectionGradient('#0a0f1f');
    const [filter, setFilter] = useState('all');
    const { projects: projectsData, loading } = useProjects(); // Utiliser le hook
    const { t } = useTranslation();
    
    const categories = ['all', 'Web', 'E-commerce', 'Backend', 'Mobile'];
    
    const filteredProjects = filter === 'all' 
        ? projectsData 
        : projectsData.filter(p => (p.tags || []).some(tag => tag.toLowerCase().includes(filter.toLowerCase())));
    
    return (
        <section 
            ref={sectionRef} 
            id="projects" 
            className="min-h-screen pt-40 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a1a2e] via-[#1a2a3e] to-[#0a0f1f] relative overflow-hidden"
            style={{ contentVisibility: 'auto', containIntrinsicSize: '1000px' }}
        >
            {/* Enhanced background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-pink-500/5 rounded-full blur-3xl" />
            </div>
            
            <div className="max-w-6xl mx-auto relative z-10">
                <FadeIn direction="down" duration={0.8}>
                    <h2 className="text-4xl font-bold text-center mb-4 text-white">
                        {t('navigation.projects', 'My')} <span className="text-purple-400">{t('projects.title', 'Projects')}</span>
                    </h2>
                    <p className="text-gray-400 text-center mb-2">
                        {t('projects.subtitle', 'Discover my recent work')}
                    </p>
                    <p className="text-center mb-12">
                        <span className="text-purple-400 font-semibold">{filteredProjects.length}</span>
                        <span className="text-gray-500"> {filteredProjects.length > 1 ? t('projects.projects', 'projects') : t('projects.project', 'project')}</span>
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
                            <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-lg mx-auto">
                                <div className="mb-6">
                                    <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Aucun projet trouvé</h3>
                                    <p className="text-gray-400">
                                        {filter === 'all' 
                                            ? 'Aucun projet n\'est encore configuré dans la base de données.'
                                            : `Aucun projet trouvé pour la catégorie "${filter}".`
                                        }
                                    </p>
                                </div>
                                
                                {filter === 'all' ? (
                                    <div className="space-y-4">
                                        <p className="text-purple-400 text-sm font-medium">Pour ajouter des projets :</p>
                                        <div className="space-y-2 text-sm text-gray-400 text-left">
                                            <div className="flex items-start gap-3">
                                                <span className="text-purple-400 font-bold">1.</span>
                                                <span>Va dans le <strong className="text-white">panel admin</strong> (/admin)</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-purple-400 font-bold">2.</span>
                                                <span>Connecte-toi avec <strong className="text-white">Google</strong></span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-purple-400 font-bold">3.</span>
                                                <span>Clique <strong className="text-white">"New Project"</strong> pour créer tes projets</span>
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <button
                                                onClick={() => window.location.href = '/admin'}
                                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 transition-transform font-medium"
                                            >
                                                Aller au panel admin
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => setFilter('all')}
                                            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            Voir tous les projets
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </StaggerContainer>
            </div>
        </section>
    );
};

export default Projects;
