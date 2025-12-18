// Script pour peupler la base de données avec des données CV d'exemple
import { supabase } from '../services/supabase.js';

const seedCVData = async () => {
  console.log('🌱 Début du peuplement des données CV...');

  try {
    // 1. Insérer les expériences
    console.log('📊 Insertion des expériences...');
    const experiences = [
      {
        title: 'Développeur Full Stack Senior',
        company: 'TechCorp Solutions',
        location: 'Paris, France',
        description: 'Développement d\'applications web modernes avec React et Node.js. Gestion d\'équipe de 3 développeurs juniors. Architecture et optimisation de bases de données.',
        start_date: '2022-01-01',
        end_date: null,
        current: true,
        type: 'work',
        technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
        achievements: [
          'Amélioration des performances de 40%',
          'Migration vers TypeScript',
          'Mise en place CI/CD',
          'Formation de l\'équipe junior'
        ]
      },
      {
        title: 'Développeur React',
        company: 'StartupInnovante',
        location: 'Lyon, France',
        description: 'Développement d\'une plateforme SaaS en React. Intégration d\'APIs tierces et optimisation SEO.',
        start_date: '2020-06-01',
        end_date: '2021-12-31',
        current: false,
        type: 'work',
        technologies: ['React', 'Redux', 'Node.js', 'MongoDB'],
        achievements: [
          'Développement de 0 à 10k utilisateurs',
          'Intégration Stripe et PayPal',
          'Optimisation SEO (+200% trafic)'
        ]
      },
      {
        title: 'Développeur Web Junior',
        company: 'WebAgency Pro',
        location: 'Marseille, France',
        description: 'Développement de sites vitrines et e-commerces. Apprentissage des technologies modernes.',
        start_date: '2019-03-01',
        end_date: '2020-05-31',
        current: false,
        type: 'work',
        technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'WordPress'],
        achievements: [
          '15+ sites web livrés',
          'Certification Google Analytics',
          'Formation continue en React'
        ]
      },
      {
        title: 'Master Informatique',
        company: 'Université de Technologie',
        location: 'France',
        description: 'Spécialisation en développement web et bases de données.',
        start_date: '2017-09-01',
        end_date: '2019-06-30',
        current: false,
        type: 'education',
        technologies: ['Java', 'Python', 'SQL', 'JavaScript'],
        achievements: [
          'Mention Bien',
          'Projet de fin d\'études en React',
          'Stage en entreprise'
        ]
      }
    ];

    const { error: expError } = await supabase
      .from('experiences')
      .upsert(experiences, { onConflict: 'title,company' });

    if (expError) {
      console.error('❌ Erreur insertion expériences:', expError);
    } else {
      console.log('✅ Expériences insérées');
    }

    // 2. Insérer les compétences
    console.log('🚀 Insertion des compétences...');
    const skills = [
      // Frontend
      { name: 'React', category: 'frontend', level: 5, years_experience: 4, color: '#61DAFB' },
      { name: 'TypeScript', category: 'frontend', level: 4, years_experience: 3, color: '#3178C6' },
      { name: 'Next.js', category: 'frontend', level: 4, years_experience: 2, color: '#000000' },
      { name: 'Tailwind CSS', category: 'frontend', level: 5, years_experience: 3, color: '#06B6D4' },
      { name: 'JavaScript', category: 'frontend', level: 5, years_experience: 5, color: '#F7DF1E' },
      { name: 'HTML/CSS', category: 'frontend', level: 5, years_experience: 5, color: '#E34F26' },
      
      // Backend
      { name: 'Node.js', category: 'backend', level: 4, years_experience: 4, color: '#339933' },
      { name: 'Express.js', category: 'backend', level: 4, years_experience: 4, color: '#000000' },
      { name: 'PostgreSQL', category: 'backend', level: 4, years_experience: 3, color: '#336791' },
      { name: 'MongoDB', category: 'backend', level: 3, years_experience: 2, color: '#47A248' },
      { name: 'Supabase', category: 'backend', level: 4, years_experience: 2, color: '#3ECF8E' },
      
      // Tools
      { name: 'Git', category: 'tools', level: 5, years_experience: 5, color: '#F05032' },
      { name: 'Docker', category: 'tools', level: 3, years_experience: 2, color: '#2496ED' },
      { name: 'AWS', category: 'tools', level: 3, years_experience: 2, color: '#FF9900' },
      { name: 'Vercel', category: 'tools', level: 4, years_experience: 3, color: '#000000' },
      { name: 'Figma', category: 'tools', level: 3, years_experience: 3, color: '#F24E1E' }
    ];

    const { error: skillsError } = await supabase
      .from('skills')
      .upsert(skills, { onConflict: 'name' });

    if (skillsError) {
      console.error('❌ Erreur insertion compétences:', skillsError);
    } else {
      console.log('✅ Compétences insérées');
    }

    // 3. Insérer les projets
    console.log('🎨 Insertion des projets...');
    const projects = [
      {
        title: 'E-commerce Modern',
        slug: 'ecommerce-modern',
        description: 'Plateforme e-commerce complète avec panier, paiements et gestion admin.',
        long_description: 'Développement d\'une plateforme e-commerce moderne avec React, Node.js et Stripe. Interface admin complète, gestion des stocks, analytics en temps réel.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
        github_url: 'https://github.com/sebbe/ecommerce-modern',
        demo_url: 'https://ecommerce-demo.sebbe-mercier.tech',
        images: ['/images/projects/ecommerce-1.jpg', '/images/projects/ecommerce-2.jpg'],
        featured: true,
        status: 'completed',
        start_date: '2023-01-01',
        end_date: '2023-03-31',
        client: 'Client Privé',
        category: 'E-commerce'
      },
      {
        title: 'Dashboard Analytics',
        slug: 'dashboard-analytics',
        description: 'Dashboard d\'analytics en temps réel avec graphiques interactifs.',
        long_description: 'Interface de visualisation de données avec graphiques D3.js, filtres avancés et exports PDF.',
        technologies: ['React', 'D3.js', 'Node.js', 'MongoDB', 'Chart.js'],
        github_url: 'https://github.com/sebbe/dashboard-analytics',
        demo_url: 'https://dashboard-demo.sebbe-mercier.tech',
        images: ['/images/projects/dashboard-1.jpg'],
        featured: true,
        status: 'completed',
        start_date: '2023-04-01',
        end_date: '2023-06-30',
        client: 'StartupTech',
        category: 'SaaS'
      },
      {
        title: 'Portfolio Créatif',
        slug: 'portfolio-creatif',
        description: 'Site portfolio avec animations avancées et effets 3D.',
        long_description: 'Portfolio interactif avec Three.js, animations GSAP et design responsive.',
        technologies: ['React', 'Three.js', 'GSAP', 'Tailwind CSS'],
        github_url: 'https://github.com/sebbe/portfolio-creatif',
        demo_url: 'https://portfolio-demo.sebbe-mercier.tech',
        images: ['/images/projects/portfolio-1.jpg'],
        featured: true,
        status: 'completed',
        start_date: '2023-07-01',
        end_date: '2023-08-31',
        client: 'Artiste Digital',
        category: 'Portfolio'
      }
    ];

    const { error: projectsError } = await supabase
      .from('projects')
      .upsert(projects, { onConflict: 'slug' });

    if (projectsError) {
      console.error('❌ Erreur insertion projets:', projectsError);
    } else {
      console.log('✅ Projets insérés');
    }

    // 4. Insérer quelques témoignages
    console.log('⭐ Insertion des témoignages...');
    const testimonials = [
      {
        name: 'Marie Dubois',
        position: 'CEO',
        company: 'TechCorp Solutions',
        content: 'Sebbe est un développeur exceptionnel. Son expertise technique et sa capacité à livrer des projets de qualité dans les délais font de lui un atout précieux pour notre équipe.',
        rating: 5,
        featured: true
      },
      {
        name: 'Pierre Martin',
        position: 'CTO',
        company: 'StartupInnovante',
        content: 'Travail remarquable sur notre plateforme SaaS. Sebbe a su comprendre nos besoins et proposer des solutions innovantes. Je le recommande vivement !',
        rating: 5,
        featured: true
      },
      {
        name: 'Sophie Laurent',
        position: 'Directrice Marketing',
        company: 'WebAgency Pro',
        content: 'Collaboration excellente ! Sebbe a transformé notre vision en une réalité digitale impressionnante. Très professionnel et à l\'écoute.',
        rating: 5,
        featured: true
      }
    ];

    const { error: testimonialsError } = await supabase
      .from('testimonials')
      .upsert(testimonials, { onConflict: 'name,company' });

    if (testimonialsError) {
      console.error('❌ Erreur insertion témoignages:', testimonialsError);
    } else {
      console.log('✅ Témoignages insérés');
    }

    console.log('🎉 Peuplement des données CV terminé avec succès !');
    
    return {
      success: true,
      data: {
        experiences: experiences.length,
        skills: skills.length,
        projects: projects.length,
        testimonials: testimonials.length
      }
    };

  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
    return { success: false, error: error.message };
  }
};

// Exporter pour utilisation
export { seedCVData };

// Si exécuté directement
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCVData().then(result => {
    console.log('Résultat:', result);
    process.exit(result.success ? 0 : 1);
  });
}