// projectsData.js - Données par défaut (fallback et initialisation)
// Ces données sont utilisées pour :
// 1. Initialiser Supabase la première fois
// 2. Fallback si Supabase ne répond pas
// 3. Développement local

export const projectsData = [
    {
        id: 1,
        title: "Example Project",
        description: "This is an example project. Replace this with your real projects in the admin panel.",
        tags: ["React", "Supabase", "TailwindCSS"],
        image: "https://via.placeholder.com/800x600/1a1a2e/ffffff?text=Example+Project",
        links: {
            web: "",
            githubFront: "",
            githubBack: ""
        },
        features: [
            "Modern tech stack",
            "Responsive design",
            "Fast performance"
        ],
        detailedTech: {
            "Frontend": ["React", "TailwindCSS"],
            "Backend": ["Supabase", "PostgreSQL"],
            "Tools": ["Git", "Vite"]
        },
        year: new Date().getFullYear().toString(),
        status: "In Development",
        duration: "1 month",
        role: "Full-Stack Developer"
    }
];
