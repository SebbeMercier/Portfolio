// Service pour gérer les données CV centralisées dans la table cv_data
import { supabase } from './supabase';
import { translations } from '../translations';

// Récupérer les données CV depuis la table cv_data
export const getCVDataFromTable = async (language = 'fr') => {
  try {
    console.log('🔍 Récupération des données CV depuis cv_data...');

    const { data, error } = await supabase
      .from('cv_data')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    if (!data) {
      console.log('⚠️ Aucune donnée CV trouvée, utilisation des données par défaut');
      return getDefaultCVData(language);
    }

    const cvData = {
      ...data.data,
      generatedAt: new Date().toISOString(),
      language,
      translations: translations[language] || translations.fr
    };

    console.log('✅ Données CV récupérées depuis cv_data:', {
      experiences: cvData.experiences?.length || 0,
      skills: cvData.skills?.length || 0,
      projects: cvData.projects?.length || 0
    });

    return cvData;

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des données CV:', error);
    return getDefaultCVData(language);
  }
};

// Sauvegarder les données CV dans la table cv_data
export const saveCVDataToTable = async (cvData) => {
  try {
    console.log('💾 Sauvegarde des données CV...');

    const { error } = await supabase
      .from('cv_data')
      .upsert([{ 
        id: 1, // ID fixe pour une seule entrée
        data: cvData,
        updated_at: new Date().toISOString()
      }]);

    if (error) throw error;

    console.log('✅ Données CV sauvegardées avec succès');
    return { success: true };

  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error);
    return { success: false, error: error.message };
  }
};

// Initialiser la table cv_data avec des données par défaut
export const initializeCVData = async () => {
  try {
    console.log('🌱 Initialisation des données CV par défaut...');

    const defaultData = getDefaultCVDataStructure();

    const { error } = await supabase
      .from('cv_data')
      .insert([{ data: defaultData }]);

    if (error) throw error;

    console.log('✅ Données CV initialisées');
    return { success: true, data: defaultData };

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    return { success: false, error: error.message };
  }
};

// Mettre à jour une section spécifique des données CV
export const updateCVSection = async (section, data) => {
  try {
    console.log(`📝 Mise à jour de la section ${section}...`);

    // Récupérer les données actuelles
    const { data: currentData, error: fetchError } = await supabase
      .from('cv_data')
      .select('data')
      .single();

    if (fetchError) throw fetchError;

    // Mettre à jour la section
    const updatedData = {
      ...currentData.data,
      [section]: data
    };

    // Sauvegarder
    const { error: updateError } = await supabase
      .from('cv_data')
      .update({ 
        data: updatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);

    if (updateError) throw updateError;

    console.log(`✅ Section ${section} mise à jour`);
    return { success: true };

  } catch (error) {
    console.error(`❌ Erreur mise à jour section ${section}:`, error);
    return { success: false, error: error.message };
  }
};

// Ajouter un élément à une section
export const addCVItem = async (section, item) => {
  try {
    console.log(`➕ Ajout d'un élément à la section ${section}...`);

    // Récupérer les données actuelles
    const { data: currentData, error: fetchError } = await supabase
      .from('cv_data')
      .select('data')
      .single();

    if (fetchError) throw fetchError;

    // Ajouter l'élément
    const updatedSection = [...(currentData.data[section] || []), item];
    const updatedData = {
      ...currentData.data,
      [section]: updatedSection
    };

    // Sauvegarder
    const { error: updateError } = await supabase
      .from('cv_data')
      .update({ 
        data: updatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);

    if (updateError) throw updateError;

    console.log(`✅ Élément ajouté à la section ${section}`);
    return { success: true };

  } catch (error) {
    console.error(`❌ Erreur ajout élément section ${section}:`, error);
    return { success: false, error: error.message };
  }
};

// Supprimer un élément d'une section
export const deleteCVItem = async (section, itemId) => {
  try {
    console.log(`🗑️ Suppression d'un élément de la section ${section}...`);

    // Récupérer les données actuelles
    const { data: currentData, error: fetchError } = await supabase
      .from('cv_data')
      .select('data')
      .single();

    if (fetchError) throw fetchError;

    // Supprimer l'élément
    const updatedSection = (currentData.data[section] || []).filter(item => item.id !== itemId);
    const updatedData = {
      ...currentData.data,
      [section]: updatedSection
    };

    // Sauvegarder
    const { error: updateError } = await supabase
      .from('cv_data')
      .update({ 
        data: updatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);

    if (updateError) throw updateError;

    console.log(`✅ Élément supprimé de la section ${section}`);
    return { success: true };

  } catch (error) {
    console.error(`❌ Erreur suppression élément section ${section}:`, error);
    return { success: false, error: error.message };
  }
};

// Données par défaut en cas d'erreur
const getDefaultCVData = (language = 'fr') => {
  return {
    ...getDefaultCVDataStructure(),
    generatedAt: new Date().toISOString(),
    language,
    translations: translations[language] || translations.fr
  };
};

// Importer les données depuis les tables séparées vers cv_data
export const importFromSeparateTables = async () => {
  try {
    console.log('📥 Import des données depuis les tables séparées...');

    // Récupérer les données actuelles de cv_data
    const { data: currentData, error: fetchError } = await supabase
      .from('cv_data')
      .select('data')
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    let cvData = currentData?.data || getDefaultCVDataStructure();

    // Importer les projets
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectsError) {
      console.error('Erreur récupération projets:', projectsError);
    } else if (projects && projects.length > 0) {
      const importedProjects = projects.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        long_description: project.long_description,
        technologies: project.technologies || [],
        github_url: project.github_url,
        demo_url: project.demo_url,
        category: project.category,
        status: project.status,
        featured: project.featured
      }));

      cvData.projects = importedProjects;
      console.log(`✅ ${importedProjects.length} projets importés`);
    }

    // Importer les expériences
    const { data: experiences, error: expError } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false });

    if (expError) {
      console.error('Erreur récupération expériences:', expError);
    } else if (experiences && experiences.length > 0) {
      const importedExperiences = experiences.map(exp => ({
        id: exp.id,
        title: exp.title,
        company: exp.company,
        location: exp.location,
        description: exp.description,
        start_date: exp.start_date,
        end_date: exp.end_date,
        current: exp.current,
        type: exp.type,
        technologies: exp.technologies || [],
        achievements: exp.achievements || []
      }));

      cvData.experiences = importedExperiences.filter(exp => exp.type === 'work');
      cvData.education = importedExperiences.filter(exp => exp.type === 'education');
      console.log(`✅ ${cvData.experiences.length} expériences et ${cvData.education.length} formations importées`);
    }

    // Importer les compétences
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('*')
      .order('level', { ascending: false });

    if (skillsError) {
      console.error('Erreur récupération compétences:', skillsError);
    } else if (skills && skills.length > 0) {
      const importedSkills = skills.map(skill => ({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        level: skill.level,
        years_experience: skill.years_experience,
        color: skill.color
      }));

      cvData.skills = importedSkills;
      console.log(`✅ ${importedSkills.length} compétences importées`);
    }

    // Sauvegarder les données importées
    const saveResult = await saveCVDataToTable(cvData);
    
    if (saveResult.success) {
      console.log('✅ Import terminé avec succès');
      return { 
        success: true, 
        imported: {
          projects: cvData.projects?.length || 0,
          experiences: cvData.experiences?.length || 0,
          education: cvData.education?.length || 0,
          skills: cvData.skills?.length || 0
        }
      };
    } else {
      throw new Error(saveResult.error);
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    return { success: false, error: error.message };
  }
};

// Structure par défaut des données CV
const getDefaultCVDataStructure = () => {
  return {
    personal_info: {
      name: 'Sebbe Mercier',
      title: 'Développeur Full Stack • React & Node.js',
      email: 'info@sebbe-mercier.tech',
      phone: '+33 6 XX XX XX XX',
      location: 'France',
      website: 'https://sebbe-mercier.tech',
      summary: 'Développeur Full Stack passionné avec une expertise en React, Node.js et TypeScript. Spécialisé dans la création d\'applications web modernes et performantes.'
    },
    experiences: [
      {
        id: 1,
        title: 'Développeur Full Stack Senior',
        company: 'TechCorp Solutions',
        location: 'Paris, France',
        description: 'Développement d\'applications web modernes avec React et Node.js. Gestion d\'équipe de 3 développeurs juniors.',
        start_date: '2022-01-01',
        end_date: null,
        current: true,
        technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
        achievements: [
          'Amélioration des performances de 40%',
          'Migration vers TypeScript',
          'Mise en place CI/CD'
        ]
      }
    ],
    skills: [
      { id: 1, name: 'React', category: 'frontend', level: 5, years_experience: 4 },
      { id: 2, name: 'Node.js', category: 'backend', level: 4, years_experience: 3 },
      { id: 3, name: 'TypeScript', category: 'frontend', level: 4, years_experience: 2 },
      { id: 4, name: 'PostgreSQL', category: 'backend', level: 4, years_experience: 3 },
      { id: 5, name: 'Tailwind CSS', category: 'frontend', level: 5, years_experience: 3 }
    ],
    projects: [
      {
        id: 1,
        title: 'Portfolio Moderne',
        description: 'Site portfolio avec animations avancées et design responsive',
        technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'Supabase'],
        github_url: 'https://github.com/sebbe/portfolio',
        demo_url: 'https://sebbe-mercier.tech'
      }
    ],
    education: [
      {
        id: 1,
        title: 'Master Informatique',
        institution: 'Université de Technologie',
        location: 'France',
        start_date: '2017-09-01',
        end_date: '2019-06-30',
        description: 'Spécialisation en développement web et bases de données'
      }
    ],
    languages: [
      { id: 1, name: 'Français', level: 'Natif' },
      { id: 2, name: 'Anglais', level: 'Professionnel' },
      { id: 3, name: 'Espagnol', level: 'Intermédiaire' }
    ],
    achievements: [
      'Développeur Full Stack expérimenté',
      'Spécialiste React et Node.js',
      'Applications web modernes et performantes',
      'Expertise en bases de données relationnelles',
      'Maîtrise des outils DevOps modernes'
    ]
  };
};