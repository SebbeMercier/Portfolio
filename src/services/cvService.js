// Service pour récupérer les données CV depuis la base de données
import { supabase } from './supabase';
import { translations } from '../translations';
import { getCVDataFromTable } from './cvDataService';

export const getCVData = async (language = 'fr') => {
  try {
    console.log('🔍 Récupération des données CV...');

    // Essayer d'abord la nouvelle table cv_data
    try {
      const cvDataFromTable = await getCVDataFromTable(language);
      if (cvDataFromTable && cvDataFromTable.personal_info) {
        console.log('✅ Données récupérées depuis cv_data');
        return cvDataFromTable;
      }
    } catch (error) {
      console.log('⚠️ Erreur cv_data, fallback vers les tables séparées');
    }

    // Fallback vers les tables séparées (ancien système)
    console.log('🔄 Utilisation des tables séparées comme fallback...');

    // Récupérer les expériences (work seulement pour le CV)
    const { data: allExperiences, error: expError } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false });

    if (expError) {
      console.error('Erreur expériences:', expError);
    }

    // Séparer work et education
    const experiences = allExperiences?.filter(exp => exp.type === 'work') || [];
    const education = allExperiences?.filter(exp => exp.type === 'education') || [];

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

    // Récupérer les données personnelles depuis la base de données
    const { data: settingsData, error: settingsError } = await supabase
      .from('cv_settings')
      .select('*');

    if (settingsError) {
      console.error('Erreur paramètres CV:', settingsError);
    }

    // Convertir les paramètres en objet
    const settings = {};
    settingsData?.forEach(item => {
      settings[item.key] = item.value;
    });

    const personalInfo = settings.personal_info || {
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

    // Formation déjà récupérée plus haut

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
      education: education || [],
      languages,
      achievements,
      generatedAt: new Date().toISOString(),
      language,
      translations: translations[language] || translations.fr
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
      generatedAt: new Date().toISOString(),
      language,
      translations: translations[language] || translations.fr
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