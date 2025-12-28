// Service pour récupérer les données du portfolio depuis Supabase
import { supabase } from '../config/supabase';

class PortfolioDataService {
  constructor() {
    this.cachedData = null;
    this.lastFetch = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Récupérer toutes les données du portfolio
  async getPortfolioData() {
    // Utiliser le cache si récent
    if (this.cachedData && this.lastFetch && 
        (Date.now() - this.lastFetch) < this.cacheTimeout) {
      return this.cachedData;
    }

    try {
      // Récupérer les données en parallèle
      const [
        experiencesResult,
        skillsResult,
        projectsResult,
        cvDataResult
      ] = await Promise.all([
        supabase.from('experiences').select('*').order('start_date', { ascending: false }),
        supabase.from('skills').select('*').order('level', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('cv_data').select('*').single()
      ]);

      // Construire l'objet de données
      const portfolioData = {
        personal: cvDataResult.data?.personal_info || {
          name: 'Sebbe Mercier',
          role: 'Développeur Full Stack',
          email: 'info@sebbe-mercier.tech',
          location: 'Belgium',
          experience_years: 4,
          availability: true
        },
        experiences: experiencesResult.data || [],
        skills: skillsResult.data || [],
        projects: projectsResult.data || [],
        cvData: cvDataResult.data || null
      };

      // Mettre en cache
      this.cachedData = portfolioData;
      this.lastFetch = Date.now();

      return portfolioData;

    } catch (error) {
      console.error('Erreur récupération données portfolio:', error);
      
      // Fallback avec données statiques
      return this.getFallbackData();
    }
  }

  // Données de fallback minimales si la DB est inaccessible
  getFallbackData() {
    return {
      personal: {
        name: 'Sebbe Mercier',
        role: 'Développeur Full Stack',
        email: 'info@sebbe-mercier.tech',
        location: 'France',
        experience_years: 4,
        availability: true
      },
      experiences: [],
      skills: [],
      projects: [],
      cvData: null
    };
  }

  // Formater les données pour l'IA
  formatForAI(data) {
    const { personal, experiences, skills, projects } = data;

    return {
      personal: `
Nom: ${personal.name}
Rôle: ${personal.role}
Email: ${personal.email}
Localisation: ${personal.location}
Expérience: ${personal.experience_years}+ ans
Disponibilité: ${personal.availability ? 'Disponible pour nouveaux projets' : 'Actuellement occupé'}`,

      skills: skills.length > 0 
        ? skills.map(skill => 
            `${skill.name} (${skill.category}) - Niveau ${skill.level}/5, ${skill.years || 'N/A'} ans`
          ).join('\n')
        : 'Informations sur les compétences disponibles dans le portfolio',

      experiences: experiences.length > 0
        ? experiences.map(exp => 
            `${exp.title} chez ${exp.company} (${exp.period})
Localisation: ${exp.location || 'Non spécifié'}
Description: ${exp.description || 'Non spécifié'}
Technologies: ${Array.isArray(exp.technologies) ? exp.technologies.join(', ') : 'Non spécifié'}`
          ).join('\n\n')
        : 'Informations sur l\'expérience disponibles dans le portfolio',

      projects: projects.length > 0
        ? projects.map(project => 
            `${project.name}
Description: ${project.description}
Technologies: ${Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || 'Non spécifié'}
Statut: ${project.status}
${project.url ? `URL: ${project.url}` : ''}`
          ).join('\n\n')
        : 'Informations sur les projets disponibles dans le portfolio'
    };
  }

  // Vider le cache (utile pour forcer une mise à jour)
  clearCache() {
    this.cachedData = null;
    this.lastFetch = null;
  }
}

// Export d'une instance unique
const portfolioDataService = new PortfolioDataService();
export default portfolioDataService;