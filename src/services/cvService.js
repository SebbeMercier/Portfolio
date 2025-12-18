// Service pour récupérer les données CV depuis la base de données
import { supabase } from './supabase';

export const getCVData = async () => {
  try {
    console.log('🔍 Récupération des données CV depuis la base de données...');

    // Récupérer les expériences
    const { data: experiences, error: expError } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false });

    if (expError) {
      console.error('Erreur expériences:', expError);
    }

    // Récupérer les compétences
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('*')
      .order('level', { ascending: false });

    if (skillsError) {
      console.error('Erreur compétences:', skillsError);
    }

    // Récupérer les projets featured
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(6);

    if (projectsError) {
      console.error('Erreur projets:', projectsError);
    }

    // Données personnelles (statiques pour l'instant, mais peuvent être en DB)
    const personalInfo = {
      name: 'Sebbe Mercier',
      title: 'Développeur Full Stack • React & Node.js',
      email: 'info@sebbe-mercier.tech',
      phone: '+33 6 XX XX XX XX',
      location: 'France',
      website: 'https://sebbe-mercier.tech',
      summary: `Développeur Full Stack passionné avec une expertise en React, Node.js et TypeScript. 
                Spécialisé dans la création d'applications web modernes et performantes. 
                Fort de plusieurs années d'expérience, je transforme les idées en solutions digitales innovantes.`
    };

    // Formation (peut être ajoutée en DB plus tard)
    const education = experiences?.filter(exp => exp.type === 'education') || [];

    // Langues (statiques pour l'instant)
    const languages = [
      { name: 'Français', level: 'Natif' },
      { name: 'Anglais', level: 'Professionnel' },
      { name: 'Espagnol', level: 'Intermédiaire' }
    ];

    // Réalisations basées sur les projets
    const achievements = [
      `${projects?.length || 0}+ projets web réalisés`,
      'Applications React performantes',
      'APIs REST et GraphQL',
      'Intégrations tierces complexes',
      'Optimisation SEO et performances'
    ];

    const cvData = {
      personalInfo,
      experiences: experiences || [],
      skills: skills || [],
      projects: projects || [],
      education,
      languages,
      achievements,
      generatedAt: new Date().toISOString()
    };

    console.log('✅ Données CV récupérées:', {
      experiences: experiences?.length || 0,
      skills: skills?.length || 0,
      projects: projects?.length || 0
    });

    return cvData;

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des données CV:', error);
    
    // Données de fallback en cas d'erreur
    return {
      personalInfo: {
        name: 'Sebbe Mercier',
        title: 'Développeur Full Stack • React & Node.js',
        email: 'info@sebbe-mercier.tech',
        phone: '+33 6 XX XX XX XX',
        location: 'France',
        website: 'https://sebbe-mercier.tech',
        summary: 'Développeur Full Stack passionné spécialisé en React et Node.js.'
      },
      experiences: [
        {
          title: 'Développeur Full Stack Senior',
          company: 'TechCorp Solutions',
          location: 'Paris, France',
          description: 'Développement d\'applications web modernes avec React et Node.js.',
          start_date: '2022-01-01',
          current: true,
          achievements: ['Amélioration des performances de 40%', 'Migration vers TypeScript']
        }
      ],
      skills: [
        { name: 'React', category: 'frontend', level: 5 },
        { name: 'Node.js', category: 'backend', level: 4 },
        { name: 'TypeScript', category: 'frontend', level: 4 }
      ],
      projects: [
        {
          title: 'Portfolio Moderne',
          description: 'Site portfolio avec animations avancées',
          technologies: ['React', 'Tailwind CSS', 'Framer Motion']
        }
      ],
      education: [],
      languages: [
        { name: 'Français', level: 'Natif' },
        { name: 'Anglais', level: 'Professionnel' }
      ],
      achievements: [
        'Développeur Full Stack expérimenté',
        'Spécialiste React et Node.js',
        'Applications web modernes'
      ],
      generatedAt: new Date().toISOString()
    };
  }
};

// Fonction pour sauvegarder le téléchargement
export const trackCVDownload = async (visitorId, source = 'unknown') => {
  try {
    const { error } = await supabase
      .from('cv_downloads')
      .insert([
        {
          visitor_id: visitorId,
          format: 'pdf',
          source: source
        }
      ]);

    if (error) {
      console.error('Erreur tracking CV:', error);
    } else {
      console.log('✅ Téléchargement CV tracké');
    }
  } catch (error) {
    console.error('❌ Erreur tracking CV:', error);
  }
};

// Fonction pour obtenir les stats de téléchargement
export const getCVDownloadStats = async () => {
  try {
    const { data, error } = await supabase
      .from('cv_downloads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur stats CV:', error);
      return { total: 0, thisMonth: 0, sources: {} };
    }

    const now = new Date();
    const thisMonth = data?.filter(download => {
      const downloadDate = new Date(download.created_at);
      return downloadDate.getMonth() === now.getMonth() && 
             downloadDate.getFullYear() === now.getFullYear();
    }).length || 0;

    const sources = data?.reduce((acc, download) => {
      acc[download.source] = (acc[download.source] || 0) + 1;
      return acc;
    }, {}) || {};

    return {
      total: data?.length || 0,
      thisMonth,
      sources
    };

  } catch (error) {
    console.error('❌ Erreur stats CV:', error);
    return { total: 0, thisMonth: 0, sources: {} };
  }
};