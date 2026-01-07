// Service pour récupérer les données CV depuis la base de données
import { supabase } from './supabase';
import { translations } from '../translations';
import { getCVDataFromTable } from './cvDataService';

export const getCVData = async (language = 'fr') => {
  try {
    console.log('🔍 Récupération des données CV...');

    let cvData = null;

    // Essayer d'abord la nouvelle table cv_data
    try {
      const cvDataFromTable = await getCVDataFromTable(language);
      if (cvDataFromTable && (cvDataFromTable.personal_info || cvDataFromTable.personalInfo)) {
        console.log('✅ Données récupérées depuis cv_data');
        cvData = cvDataFromTable;
      }
    } catch (error) {
      console.log('⚠️ Erreur cv_data, fallback vers les tables séparées:', error.message);
    }

    // Fallback vers les tables séparées si pas de données
    if (!cvData) {
      console.log('🔄 Utilisation des tables séparées comme fallback...');
      cvData = await getFallbackCVData(language);
    }

    // Normaliser la structure des données (snake_case vers camelCase)
    const normalizedData = normalizeCVData(cvData, language);
    
    console.log('✅ Données CV normalisées:', {
      hasPersonalInfo: !!normalizedData.personalInfo,
      experiences: normalizedData.experiences?.length || 0,
      skills: normalizedData.skills?.length || 0,
      projects: normalizedData.projects?.length || 0
    });

    return normalizedData;

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des données CV:', error);
    
    // Données de fallback en cas d'erreur totale
    return getStaticFallbackData(language);
  }
};

// Fonction pour récupérer les données depuis les tables séparées
const getFallbackCVData = async (language) => {
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

  const personal_info = settings.personal_info || getDefaultPersonalInfo();

  return {
    personal_info,
    experiences: experiences || [],
    skills: skills || [],
    projects: projects || [],
    education: education || [],
    languages: getDefaultLanguages(),
    achievements: getDefaultAchievements(projects?.length || 0),
    generatedAt: new Date().toISOString(),
    language,
    translations: translations[language] || translations.fr
  };
};
// Normaliser les données CV (convertir snake_case vers camelCase)
const normalizeCVData = (data, language) => {
  return {
    // Normaliser personalInfo
    personalInfo: data.personalInfo || data.personal_info || getDefaultPersonalInfo(),
    
    // Garder les autres champs tels quels
    experiences: data.experiences || [],
    skills: data.skills || [],
    projects: data.projects || [],
    education: data.education || [],
    languages: data.languages || getDefaultLanguages(),
    achievements: data.achievements || getDefaultAchievements(data.projects?.length || 0),
    
    // Métadonnées
    generatedAt: data.generatedAt || new Date().toISOString(),
    language: data.language || language,
    translations: data.translations || translations[language] || translations.fr
  };
};

// Données personnelles par défaut
const getDefaultPersonalInfo = () => {
  return {
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
};

// Langues par défaut
const getDefaultLanguages = () => {
  return [
    { name: 'Français', level: 'Natif' },
    { name: 'Anglais', level: 'Professionnel' },
    { name: 'Espagnol', level: 'Intermédiaire' }
  ];
};

// Réalisations par défaut
const getDefaultAchievements = (projectCount = 0) => {
  return [
    `${projectCount || 12}+ projets web réalisés`,
    'Applications React performantes',
    'APIs REST et GraphQL',
    'Intégrations tierces complexes',
    'Optimisation SEO et performances'
  ];
};

// Données de fallback statiques
const getStaticFallbackData = (language) => {
  return {
    personalInfo: getDefaultPersonalInfo(),
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
    languages: getDefaultLanguages(),
    achievements: getDefaultAchievements(1),
    generatedAt: new Date().toISOString(),
    language,
    translations: translations[language] || translations.fr
  };
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