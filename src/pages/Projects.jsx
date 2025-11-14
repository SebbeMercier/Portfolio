// src/pages/Projects.jsx
import React, { lazy, Suspense } from 'react';

// Chargement paresseux des icônes
const FaExternalLinkAlt = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaExternalLinkAlt })));
const FaGithub = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaGithub })));
const FaServer = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaServer })));

// Fallback si les icônes ne chargent pas
const IconFallback = ({ type }) => {
    const icons = {
        link: '🌐',
        github: '🔗',
        backend: '🖥'
    };
    return <span>{icons[type] || '⚙️'}</span>;
};

const projectsData = [
    {
        id: 1,
        title: "Eldocam.com",
        description: "Amélioratio, des performances du site web",
        tags: ["React", "Golang", "GSAP"],
        image: "/images/eldocam-preview.jpg",
        links: {
            web: "https://eldocam.com",
            githubFront: "https://github.com/SebbeMercier/Eldocam-site-frond-end.git",
            githubBack: "https://github.com/SebbeMercier/Eldocam_Back_end.git"
        },
        orientation: "left"
    },
    {
        id: 2,
        title: "Cedra-shop.eu",
        description: "Plateforme e-commerce avec apps mobiles et backend Golang.",
        tags: ["NextJS", "GoLang", "Redis" , "Elasticsearch"],
        image: "/images/cedra-shop-preview.jpg",
        links: {
            web: "https://cedra-shop.eu",
            githubFront: "https://github.com/votre/cedra-front",
            githubBack: "https://github.com/SebbeMercier/Cedra_back_end.git"        },
        orientation: "right"
    },
];

const ProjectLinks = ({ links }) => {
    const linkItems = [
        { type: 'web', icon: <FaExternalLinkAlt />, label: "Voir le site", url: links.web },
        { type: 'githubFront', icon: <FaGithub />, label: "Frontend", url: links.githubFront },
        { type: 'githubBack', icon: <FaServer />, label: "Backend", url: links.githubBack }
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
                        <Suspense fallback={<IconFallback type={item.type === 'web' ? 'link' : item.type === 'githubBack' ? 'backend' : 'github'} />}>
                            {item.icon}
                        </Suspense>
                        <span className="text-xs text-gray-300 group-hover:text-white">
              {item.type === 'web' ? 'Site' : item.type === 'githubFront' ? 'Front' : 'Back'}
            </span>
                    </a>
                )
            ))}
        </div>
    );
};

const ProjectCard = ({ project }) => {
    const isLeft = project.orientation === 'left';

    return (
        <div className={`project-card mb-24 ${isLeft ? 'left' : 'right'}`}>
            <div className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}>
                {/* Contenu texte */}
                <div className="md:w-1/2 space-y-3">
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                        <ProjectLinks links={project.links} />
                    </div>

                    <p className="text-gray-300 bg-gray-800/50 p-5 rounded-lg border border-gray-700">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-purple-900/50 text-purple-200 text-xs rounded-full border border-purple-500/30"
                            >
                {tag}
              </span>
                        ))}
                    </div>
                </div>

                {/* Image du projet */}
                <div className="md:w-1/2 relative group">
                    <div className="relative overflow-hidden rounded-xl border-2 border-gray-800 shadow-2xl hover:shadow-purple-500/20 transition-shadow">
                        <img
                            src={project.image}
                            alt={`Capture de ${project.title}`}
                            className="w-full h-auto rounded-lg object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Projects = () => {
    return (
        <section id="projects" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e]">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-16 text-white">
                    Mes <span className="text-purple-400">Projets</span>
                </h2>

                <div className="space-y-16">
                    {projectsData.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
