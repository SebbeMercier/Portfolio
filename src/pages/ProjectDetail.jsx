// ProjectDetail.jsx - Page de détail d'un projet avec informations complètes
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { ArrowLeft, ExternalLink, Github, Server, Calendar, Tag, CheckCircle, Clock, Building, Eye } from 'lucide-react';
import { animate } from 'animejs';
import { useSectionGradient } from '../hooks/useSectionGradient';
import { useProjects } from '../hooks/useProjects';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const sectionRef = useSectionGradient('#0a0f1f');
    const contentRef = useRef(null);
    const { projects: projectsData, loading } = useProjects();

    // Recherche robuste du projet
    const project = projectsData.find(p => String(p.id) === String(id));

    // Trouver les projets du même client/type
    const relatedProjects = project ? projectsData.filter(p => 
        p.id !== project.id && (
            p.client === project.client || 
            p.category === project.category ||
            (p.tags && project.tags && p.tags.some(tag => project.tags.includes(tag)))
        )
    ).slice(0, 3) : [];

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
    }, [project]);

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
                    <p className="text-gray-400 mb-2">Searched for ID: {id}</p>
                    <p className="text-gray-400 mb-6">
                        {projectsData.length > 0 ? `Available projects: ${projectsData.map(p => p.id).join(', ')}` : 'No projects available.'}
                    </p>
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
        'Completed': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'Maintenance': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };

    return (
        <section ref={sectionRef} className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a1a2e] via-[#1a2a3e] to-[#0a0f1f]">
            <div className="max-w-6xl mx-auto" ref={contentRef}>
                {/* Back button */}
                <button
                    onClick={() => navigate('/projects')}
                    className="animate-item opacity-0 group flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Projects
                </button>

                {/* Header avec informations client */}
                <div className="animate-item opacity-0 mb-8">
                    <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
                        <div className="flex-1 min-w-0">
                            {project.client && (
                                <div className="flex items-center gap-2 text-purple-400 mb-2">
                                    <Building className="w-4 h-4" />
                                    <span className="text-sm font-medium">{project.client}</span>
                                </div>
                            )}
                            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
                                {project.title}
                            </h1>
                            <p className="text-xl text-gray-300 mb-4 leading-relaxed">
                                {project.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-3 items-center">
                                <span className={`text-sm px-3 py-1 rounded-full border ${statusColors[project.status] || statusColors['Completed']}`}>
                                    {project.status}
                                </span>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">{project.year}</span>
                                </div>
                                {project.duration && (
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm">{project.duration}</span>
                                    </div>
                                )}
                                {project.views && (
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Eye className="w-4 h-4" />
                                        <span className="text-sm">{project.views} views</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Links */}
                        <div className="flex flex-wrap gap-3">
                            {project.links?.web && (
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
                            {project.links?.githubFront && (
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
                            {project.links?.githubBack && (
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
                {project.image && (
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
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Key Features */}
                        {project.features && project.features.length > 0 && (
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

                        {/* Challenges & Solutions */}
                        {project.challenges && (
                            <div className="animate-item opacity-0">
                                <h2 className="text-2xl font-bold text-white mb-4">Challenges & Solutions</h2>
                                <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <p className="text-gray-300 leading-relaxed">
                                        {project.challenges}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Results & Impact */}
                        {project.results && (
                            <div className="animate-item opacity-0">
                                <h2 className="text-2xl font-bold text-white mb-4">Results & Impact</h2>
                                <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <p className="text-gray-300 leading-relaxed">
                                        {project.results}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Related Projects */}
                        {relatedProjects.length > 0 && (
                            <div className="animate-item opacity-0">
                                <h2 className="text-2xl font-bold text-white mb-4">
                                    {project.client ? `Other Projects for ${project.client}` : 'Related Projects'}
                                </h2>
                                <div className="grid gap-4">
                                    {relatedProjects.map((related) => (
                                        <div 
                                            key={related.id} 
                                            className="group cursor-pointer"
                                            onClick={() => navigate(`/projects/${related.id}`)}
                                        >
                                            <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-purple-500/30 transition-all duration-300">
                                                <div className="flex gap-4">
                                                    {related.image && (
                                                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
                                                            <img
                                                                src={related.image}
                                                                alt={related.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                                                            {related.title}
                                                        </h3>
                                                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                                                            {related.description}
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {(related.tags || []).slice(0, 3).map((tag, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-1 bg-purple-900/20 text-purple-300 text-xs rounded-full"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
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
                        {/* Project Info */}
                        <div className="animate-item opacity-0">
                            <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
                                <div className="space-y-3 text-sm">
                                    {project.client && (
                                        <div>
                                            <span className="text-gray-400">Client:</span>
                                            <span className="text-white ml-2">{project.client}</span>
                                        </div>
                                    )}
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
                                    {project.team && (
                                        <div>
                                            <span className="text-gray-400">Team Size:</span>
                                            <span className="text-white ml-2">{project.team}</span>
                                        </div>
                                    )}
                                    {project.budget && (
                                        <div>
                                            <span className="text-gray-400">Budget:</span>
                                            <span className="text-white ml-2">{project.budget}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Technologies */}
                        <div className="animate-item opacity-0">
                            <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Tag className="w-5 h-5 text-purple-400" />
                                    <h3 className="text-lg font-semibold text-white">Technologies</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(project.tags || []).map((tag, idx) => (
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

                        {/* Performance Metrics */}
                        {project.metrics && (
                            <div className="animate-item opacity-0">
                                <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
                                    <div className="space-y-3 text-sm">
                                        {Object.entries(project.metrics).map(([key, value]) => (
                                            <div key={key}>
                                                <span className="text-gray-400 capitalize">{key.replace('_', ' ')}:</span>
                                                <span className="text-white ml-2">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectDetail;