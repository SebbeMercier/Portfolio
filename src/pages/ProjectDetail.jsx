// ProjectDetail.jsx - Page de détail d'un projet
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { ArrowLeft, ExternalLink, Github, Server, Calendar, Tag, CheckCircle } from 'lucide-react';
import { animate } from 'animejs';
import { useSectionGradient } from '../hooks/useSectionGradient';
import { useProjects } from '../hooks/useProjects';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const sectionRef = useSectionGradient('#0a0f1f');
    const contentRef = useRef(null);
    const { projects: projectsData, loading } = useProjects(); // Utiliser le hook

    const project = projectsData.find(p => p.id === parseInt(id));

    useEffect(() => {
        if (contentRef.current) {
            animate(contentRef.current.querySelectorAll('.animate-item'), {
                opacity: [0, 1],
                translateY: [30, 0],
                delay: (el, i) => i * 100,
                duration: 800,
                easing: 'out-expo'
            });
        }
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-40 pb-20 px-4 flex items-center justify-center bg-gradient-to-b from-[#0a1a2e] via-[#1a2a3e] to-[#0a0f1f]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading project...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen pt-40 pb-20 px-4 flex items-center justify-center bg-gradient-to-b from-[#0a1a2e] via-[#1a2a3e] to-[#0a0f1f]">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
                    <button
                        onClick={() => navigate('/projects')}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 transition-transform"
                    >
                        Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    const statusColors = {
        'Live': 'bg-green-500/20 text-green-400 border-green-500/30',
        'In Development': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'Completed': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };

    return (
        <section ref={sectionRef} className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a1a2e] via-[#1a2a3e] to-[#0a0f1f]">
            <div className="max-w-5xl mx-auto" ref={contentRef}>
                {/* Back button */}
                <button
                    onClick={() => navigate('/projects')}
                    className="animate-item opacity-0 group flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Projects
                </button>

                {/* Header */}
                <div className="animate-item opacity-0 mb-8">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
                                {project.title}
                            </h1>
                            <div className="flex flex-wrap gap-3 items-center">
                                <span className={`text-sm px-3 py-1 rounded-full border ${statusColors[project.status]}`}>
                                    {project.status}
                                </span>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">{project.year}</span>
                                </div>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="flex gap-3">
                            {project.links.web && (
                                <a
                                    href={project.links.web}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 transition-transform"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    <span className="text-sm font-medium">Visit Site</span>
                                </a>
                            )}
                            {project.links.githubFront && (
                                <a
                                    href={project.links.githubFront}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <Github className="w-4 h-4" />
                                    <span className="text-sm">Frontend</span>
                                </a>
                            )}
                            {project.links.githubBack && (
                                <a
                                    href={project.links.githubBack}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <Server className="w-4 h-4" />
                                    <span className="text-sm">Backend</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main image */}
                <div className="animate-item opacity-0 mb-12">
                    <div className="relative overflow-hidden rounded-2xl border border-gray-700 shadow-2xl aspect-video">
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%231a1a2e" width="800" height="600"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="32" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E' + project.title + '%3C/text%3E%3C/svg%3E';
                            }}
                        />
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <div className="animate-item opacity-0">
                            <h2 className="text-2xl font-bold text-white mb-4">About This Project</h2>
                            <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <p className="text-gray-300 leading-relaxed">
                                    {project.description}
                                </p>
                            </div>
                        </div>

                        {/* Key Features */}
                        {project.features && (
                            <div className="animate-item opacity-0">
                                <h2 className="text-2xl font-bold text-white mb-4">Key Features</h2>
                                <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <ul className="space-y-3">
                                        {project.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-300">
                                                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Technologies détaillées */}
                        {project.detailedTech && (
                            <div className="animate-item opacity-0">
                                <h2 className="text-2xl font-bold text-white mb-4">Technical Stack</h2>
                                <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {Object.entries(project.detailedTech).map(([category, techs]) => (
                                            <div key={category}>
                                                <h3 className="text-purple-400 font-semibold mb-2 text-sm uppercase tracking-wide">
                                                    {category}
                                                </h3>
                                                <ul className="space-y-1">
                                                    {techs.map((tech, idx) => (
                                                        <li key={idx} className="text-gray-300 text-sm">
                                                            • {tech}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Related Projects */}
                        {project.relatedProjects && project.relatedProjects.length > 0 && (
                            <div className="animate-item opacity-0">
                                <h2 className="text-2xl font-bold text-white mb-4">Related Projects</h2>
                                <p className="text-gray-400 mb-6">
                                    This ecosystem consists of multiple applications sharing the same backend infrastructure
                                </p>
                                <div className="grid gap-6">
                                    {project.relatedProjects.map((related) => (
                                        <div key={related.id} className="group">
                                            <div className="relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 
                                                              rounded-2xl blur-xl opacity-0 group-hover:opacity-100 
                                                              transition-opacity duration-500"></div>

                                                <div className="relative bg-gray-900/60 backdrop-blur-xl 
                                                              border border-white/10 rounded-2xl p-6
                                                              hover:border-purple-500/30 transition-all duration-300">
                                                    <div className="flex flex-col md:flex-row gap-6">
                                                        {/* Image */}
                                                        <div className="md:w-1/3">
                                                            <div className="relative overflow-hidden rounded-xl border border-gray-700 aspect-video">
                                                                <img
                                                                    src={related.image}
                                                                    alt={related.title}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                    onError={(e) => {
                                                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%231a1a2e" width="400" height="300"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E' + related.title + '%3C/text%3E%3C/svg%3E';
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="md:w-2/3 space-y-3">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div>
                                                                    <h3 className="text-xl font-bold text-white mb-1">
                                                                        {related.title}
                                                                    </h3>
                                                                    <span className="text-sm text-purple-400">
                                                                        {related.type}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <p className="text-gray-300 text-sm">
                                                                {related.description}
                                                            </p>

                                                            {/* Tech tags */}
                                                            <div className="flex flex-wrap gap-2">
                                                                {related.tech.map((tech, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        className="px-2 py-1 bg-purple-900/20 text-purple-300 text-xs rounded-full border border-purple-500/20"
                                                                    >
                                                                        {tech}
                                                                    </span>
                                                                ))}
                                                            </div>

                                                            {/* Links */}
                                                            <div className="flex flex-wrap gap-2 pt-2">
                                                                {related.links.web && (
                                                                    <a
                                                                        href={related.links.web}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <ExternalLink className="w-3 h-3" />
                                                                        Website
                                                                    </a>
                                                                )}
                                                                {related.links.appStore && (
                                                                    <a
                                                                        href={related.links.appStore}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <ExternalLink className="w-3 h-3" />
                                                                        App Store
                                                                    </a>
                                                                )}
                                                                {related.links.playStore && (
                                                                    <a
                                                                        href={related.links.playStore}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <ExternalLink className="w-3 h-3" />
                                                                        Play Store
                                                                    </a>
                                                                )}
                                                                {related.links.github && (
                                                                    <a
                                                                        href={related.links.github}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <Github className="w-3 h-3" />
                                                                        GitHub
                                                                    </a>
                                                                )}
                                                                {related.links.docs && (
                                                                    <a
                                                                        href={related.links.docs}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <ExternalLink className="w-3 h-3" />
                                                                        API Docs
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Tags */}
                        <div className="animate-item opacity-0">
                            <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Tag className="w-5 h-5 text-purple-400" />
                                    <h3 className="text-lg font-semibold text-white">Technologies</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full border border-purple-500/20"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Project Info */}
                        <div className="animate-item opacity-0">
                            <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Project Info</h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="text-gray-400">Status:</span>
                                        <span className="text-white ml-2">{project.status}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Year:</span>
                                        <span className="text-white ml-2">{project.year}</span>
                                    </div>
                                    {project.duration && (
                                        <div>
                                            <span className="text-gray-400">Duration:</span>
                                            <span className="text-white ml-2">{project.duration}</span>
                                        </div>
                                    )}
                                    {project.role && (
                                        <div>
                                            <span className="text-gray-400">Role:</span>
                                            <span className="text-white ml-2">{project.role}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectDetail;
