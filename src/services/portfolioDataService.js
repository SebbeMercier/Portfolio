// Service pour récupérer les données du portfolio depuis Supabase (OPTIMISÉ)
import { supabase } from '../config/supabase';

class PortfolioDataService {
  constructor() {
    this.cachedData = null;
    this.lastFetch = null;
    this.cacheTimeout = 2 * 60 * 1000; // 2 minutes (cache plus court car on a la vue matérialisée)
  }

  // Récupérer toutes les données du portfolio (VERSION ULTRA-RAPIDE)
  async getPortfolioData() {
    // Utiliser le cache si récent
    if (this.cachedData && this.lastFetch && 
        (Date.now() - this.lastFetch) < this.cacheTimeout) {
      console.log('📦 Utilisation du cache local portfolio');
      return this.cachedData;
    }

    console.log('🚀 Récupération des données portfolio optimisées...');

    try {
      // Utiliser la fonction SQL optimisée avec vue matérialisée
      const { data, error } = await supabase.rpc('get_ai_portfolio_fast');
      
      if (error) {
        console.warn('⚠️ Erreur fonction optimisée, fallback vers requêtes classiques:', error);
        return await this.getFallbackData();
      }

      if (!data) {
        console.warn('⚠️ Pas de données dans le cache matérialisé, fallback...');
        return await this.getFallbackData();
      }

      // Transformer les données de la vue matérialisée
      const portfolioData = {
        personal: data.personal_data || this.getDefaultPersonal(),
        skills: data.primary_skills || [],
        experiences: data.recent_experiences || [],
        projects: data.featured_projects || [],
        
        // Métadonnées enrichies
        metadata: {
          ...data.stats,
          lastUpdated: data.last_updated,
          dataSource: 'materialized_view',
          cacheHit: true
        }
      };

      // Mettre en cache
      this.cachedData = portfolioData;
      this.lastFetch = Date.now();

      console.log('✅ Données portfolio ultra-rapides récupérées:', {
        projects: portfolioData.projects?.length || 0,
        skills: portfolioData.skills?.length || 0,
        experiences: portfolioData.experiences?.length || 0,
        source: 'optimized_cache'
      });

      return portfolioData;

    } catch (error) {
      console.error('❌ Erreur récupération données optimisées:', error);
      
      // Fallback avec requêtes classiques
      return await this.getFallbackData();
    }
  }

  // Fallback avec requêtes classiques (si la vue matérialisée n'est pas prête)
  async getFallbackData() {
    console.log('🔄 Utilisation du fallback avec requêtes classiques...');
    
    try {
      // Requêtes en parallèle mais optimisées avec les nouveaux index
      const [
        personalResult,
        skillsResult,
        experiencesResult,
        projectsResult
      ] = await Promise.all([
        // Infos personnelles
        supabase
          .from('personal_info')
          .select('name, role, email, location, experience_years, availability, bio')
          .single(),
        
        // Compétences principales seulement (utilise idx_skills_primary_ordered)
        supabase
          .from('skills')
          .select('name, category, level, years_experience, description')
          .eq('is_primary', true)
          .order('level', { ascending: false })
          .limit(10),
        
        // Expériences récentes (utilise idx_experiences_timeline)
        supabase
          .from('experiences')
          .select('title, company, location, start_date, end_date, is_current, description, technologies')
          .order('is_current', { ascending: false })
          .order('start_date', { ascending: false })
          .limit(5),
        
        // Projets optimisés (utilise idx_projects_ai_query)
        supabase
          .from('projects')
          .select('id, title, short_description, description, technologies, tags, status, live_url, github_url, links, complexity_level, impact_score, ai_priority, is_featured, featured')
          .eq('visibility', 'public')
          .in('status', ['completed', 'live', 'Live', 'Completed'])
          .order('ai_priority', { ascending: true })
          .order('impact_score', { ascending: false })
          .limit(8)
      ]);

      // Construire l'objet de données
      const portfolioData = {
        personal: personalResult.data || this.getDefaultPersonal(),
        skills: skillsResult.data || [],
        experiences: experiencesResult.data || [],
        projects: projectsResult.data || [],
        
        // Métadonnées
        metadata: {
          totalProjects: projectsResult.data?.length || 0,
          totalSkills: skillsResult.data?.length || 0,
          totalExperiences: experiencesResult.data?.length || 0,
          lastUpdated: new Date().toISOString(),
          dataSource: 'fallback_queries',
          cacheHit: false
        }
      };

      // Mettre en cache
      this.cachedData = portfolioData;
      this.lastFetch = Date.now();

      console.log('✅ Données portfolio fallback récupérées');
      return portfolioData;

    } catch (error) {
      console.error('❌ Erreur fallback:', error);
      return this.getStaticFallback();
    }
  }

  // Données par défaut si personal_info est vide
  getDefaultPersonal() {
    return {
      name: 'Sebbe Mercier',
      role: 'Développeur Full Stack',
      email: 'info@sebbe-mercier.tech',
      location: 'Belgium',
      experience_years: 4,
      availability: true,
      bio: 'Développeur passionné spécialisé dans les technologies modernes.'
    };
  }

  // Données statiques en dernier recours
  getStaticFallback() {
    console.log('🔄 Utilisation des données statiques de secours');
    
    return {
      personal: this.getDefaultPersonal(),
      skills: [
        { name: 'React', category: 'frontend', level: 5, years_experience: 4 },
        { name: 'JavaScript', category: 'frontend', level: 5, years_experience: 4 },
        { name: 'Node.js', category: 'backend', level: 4, years_experience: 3 },
        { name: 'Supabase', category: 'backend', level: 4, years_experience: 2 },
        { name: 'Tailwind CSS', category: 'frontend', level: 5, years_experience: 3 }
      ],
      experiences: [
        {
          title: 'Développeur Full Stack Freelance',
          company: 'Indépendant',
          start_date: '2021-01-01',
          is_current: true,
          description: 'Développement d\'applications web modernes avec React, Node.js et bases de données'
        }
      ],
      projects: [
        {
          title: 'Portfolio Interactif avec IA',
          short_description: 'Portfolio moderne avec assistant IA intégré utilisant Groq API',
          description: 'Portfolio personnel développé avec React et Tailwind CSS, intégrant un assistant IA conversationnel',
          technologies: ['React', 'Tailwind CSS', 'Supabase', 'Groq API'],
          tags: ['React', 'Portfolio', 'IA'],
          status: 'live',
          is_featured: true,
          live_url: 'https://sebbe-mercier.tech',
          complexity_level: 4,
          impact_score: 9
        }
      ],
      metadata: {
        totalProjects: 1,
        totalSkills: 5,
        totalExperiences: 1,
        lastUpdated: new Date().toISOString(),
        dataSource: 'static_fallback',
        cacheHit: false
      }
    };
  }

  // Formater les données pour l'IA avec gestion intelligente du contexte (OPTIMISÉ)
  formatForAI(data, userMessage = '', maxTokens = 4000) {
    const { personal, experiences, skills, projects } = data;

    // Contexte de base (toujours inclus)
    const baseContext = {
      personal: `
Nom: ${personal.name}
Rôle: ${personal.role}
Email: ${personal.email}
Localisation: ${personal.location}
Expérience: ${personal.experience_years}+ ans
Disponibilité: ${personal.availability ? 'Disponible pour nouveaux projets' : 'Actuellement occupé'}${personal.bio ? `\nBio: ${personal.bio}` : ''}`,

      summary: `
Portfolio: ${projects.length} projets vedettes, ${skills.length} compétences principales, ${experiences.length} expériences récentes
Spécialités: ${skills.slice(0, 5).map(s => s.name).join(', ')}`
    };

    // Estimation grossière des tokens (1 token ≈ 4 caractères)
    let usedTokens = JSON.stringify(baseContext).length / 4;
    const remainingTokens = maxTokens - usedTokens - 500; // Marge de sécurité

    // Sélection intelligente basée sur la question
    const contextSections = this.selectRelevantContext(userMessage, data, remainingTokens);

    return {
      ...baseContext,
      ...contextSections
    };
  }

  // Sélectionner le contexte pertinent selon la question (OPTIMISÉ)
  selectRelevantContext(userMessage, data, availableTokens) {
    const lowerMessage = userMessage.toLowerCase();
    const context = {};
    let usedTokens = 0;

    // Priorités basées sur la question avec scoring
    const priorities = [];
    
    if (/projet|project|réalisation|portfolio|travaux|création/i.test(lowerMessage)) {
      priorities.push({ type: 'projects', score: 10 });
    }
    if (/compétence|skill|technologie|tech|savoir|maîtrise|langage/i.test(lowerMessage)) {
      priorities.push({ type: 'skills', score: 10 });
    }
    if (/expérience|parcours|travail|career|emploi|poste|entreprise/i.test(lowerMessage)) {
      priorities.push({ type: 'experiences', score: 10 });
    }

    // Recherche de technologies spécifiques
    const techKeywords = ['react', 'javascript', 'node', 'python', 'typescript', 'vue', 'angular'];
    const mentionedTechs = techKeywords.filter(tech => lowerMessage.includes(tech));
    if (mentionedTechs.length > 0) {
      priorities.push({ type: 'projects', score: 8 });
      priorities.push({ type: 'skills', score: 8 });
    }

    // Si pas de mots-clés spécifiques, inclure un peu de tout
    if (priorities.length === 0) {
      priorities.push(
        { type: 'projects', score: 5 },
        { type: 'skills', score: 4 },
        { type: 'experiences', score: 3 }
      );
    }

    // Trier par score et ajouter les sections
    priorities.sort((a, b) => b.score - a.score);
    
    for (const priority of priorities) {
      if (usedTokens >= availableTokens) break;

      const sectionData = this.formatSection(priority.type, data[priority.type], availableTokens - usedTokens, mentionedTechs);
      if (sectionData) {
        context[priority.type] = sectionData;
        usedTokens += sectionData.length / 4; // Estimation tokens
      }
    }

    return context;
  }

  // Formater une section avec limite de tokens (OPTIMISÉ)
  formatSection(sectionType, items, maxTokens, mentionedTechs = []) {
    if (!items || items.length === 0) return null;

    const maxItems = Math.floor(maxTokens / 200); // ~200 tokens par item
    let limitedItems = items.slice(0, Math.max(3, maxItems)); // Minimum 3 items

    // Filtrer par technologies mentionnées si applicable
    if (mentionedTechs.length > 0 && (sectionType === 'projects' || sectionType === 'skills')) {
      const filtered = items.filter(item => {
        const itemTechs = (item.technologies || item.tags || item.name || '').toString().toLowerCase();
        return mentionedTechs.some(tech => itemTechs.includes(tech));
      });
      
      if (filtered.length > 0) {
        limitedItems = filtered.slice(0, Math.max(2, Math.floor(maxItems / 2)));
      }
    }

    switch (sectionType) {
      case 'projects':
        return limitedItems
          .map(project => {
            const description = project.short_description || project.description || '';
            const truncatedDesc = description.length > 120 ? description.substring(0, 120) + '...' : description;
            const technologies = project.technologies || project.tags || [];
            const techStr = Array.isArray(technologies) ? technologies.slice(0, 4).join(', ') : technologies || 'N/A';
            const liveUrl = project.live_url || (project.links && project.links.web) || '';
            
            return `${project.title}: ${truncatedDesc}
Tech: ${techStr}
Statut: ${project.status}${liveUrl ? ` | URL: ${liveUrl}` : ''}`;
          }).join('\n\n');

      case 'skills':
        // Grouper par catégorie pour plus de clarté
        const skillsByCategory = limitedItems.reduce((acc, skill) => {
          const category = skill.category || 'other';
          if (!acc[category]) acc[category] = [];
          acc[category].push(`${skill.name} (${skill.level || 3}/5${skill.years_experience ? `, ${skill.years_experience}ans` : ''})`);
          return acc;
        }, {});

        return Object.entries(skillsByCategory)
          .map(([category, skills]) => `${category.toUpperCase()}: ${skills.join(', ')}`)
          .join('\n');

      case 'experiences':
        return limitedItems
          .map(exp => {
            const period = exp.is_current ? `${exp.start_date} - Actuellement` : 
                         exp.end_date ? `${exp.start_date} - ${exp.end_date}` : exp.start_date;
            const description = exp.description || '';
            const truncatedDesc = description.length > 80 ? description.substring(0, 80) + '...' : description;
            const technologies = exp.technologies || [];
            const techStr = Array.isArray(technologies) ? technologies.slice(0, 3).join(', ') : technologies;
            
            return `${exp.title} @ ${exp.company} (${period})
${truncatedDesc}${techStr ? `\nTech: ${techStr}` : ''}`;
          }).join('\n\n');

      default:
        return null;
    }
  }

  // Récupérer des projets spécifiques par technologie (FONCTION SQL OPTIMISÉE)
  async getProjectsByTechnology(tech, limit = 5) {
    try {
      const { data, error } = await supabase.rpc('get_projects_by_tech', {
        tech_name: tech,
        max_results: limit
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`❌ Erreur récupération projets ${tech}:`, error);
      
      // Fallback avec requête classique
      try {
        const { data, error: fallbackError } = await supabase
          .from('projects')
          .select('id, title, short_description, description, technologies, tags, status, live_url, links')
          .or(`technologies.cs.{${tech}},tags.cs.{${tech}}`)
          .eq('visibility', 'public')
          .in('status', ['completed', 'live', 'Live', 'Completed'])
          .order('ai_priority', { ascending: true })
          .limit(limit);

        if (fallbackError) throw fallbackError;
        return data || [];
      } catch (fallbackError) {
        console.error(`❌ Erreur fallback projets ${tech}:`, fallbackError);
        return [];
      }
    }
  }

  // Récupérer les compétences par catégorie (FONCTION SQL OPTIMISÉE)
  async getSkillsByCategory(category = null) {
    try {
      const { data, error } = await supabase.rpc('get_skills_by_category', {
        cat_name: category
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Erreur récupération compétences par catégorie:', error);
      
      // Fallback
      try {
        let query = supabase
          .from('skills')
          .select('name, category, level, years_experience')
          .order('level', { ascending: false });

        if (category) {
          query = query.eq('category', category).eq('is_primary', true);
        }

        const { data, error: fallbackError } = await query;
        if (fallbackError) throw fallbackError;
        return data || [];
      } catch (fallbackError) {
        console.error('❌ Erreur fallback compétences:', fallbackError);
        return [];
      }
    }
  }

  // Rafraîchir le cache matérialisé (pour l'admin)
  async refreshCache() {
    try {
      const { data, error } = await supabase.rpc('refresh_ai_cache');
      
      if (error) throw error;
      
      // Vider aussi le cache local
      this.clearCache();
      
      console.log('✅ Cache IA rafraîchi avec succès');
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erreur rafraîchissement cache:', error);
      return { success: false, error: error.message };
    }
  }

  // Analyser les performances (pour l'admin)
  async analyzePerformance() {
    try {
      const { data, error } = await supabase.rpc('analyze_ai_performance');
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erreur analyse performance:', error);
      return { success: false, error: error.message };
    }
  }

  // Calculer les statistiques depuis les données du portfolio (OPTIMISÉ)
  async getPortfolioStats() {
    try {
      const portfolioData = await this.getPortfolioData();
      
      if (!portfolioData) {
        return {
          projects: 0,
          clients: 0,
          technologies: 0,
          experience: 3,
          averageRating: 0
        };
      }

      const { projects = [], metadata = {} } = portfolioData;
      
      // Compter les projets live/completed
      const liveProjects = projects.filter(p => 
        p.status === 'Live' || 
        p.status === 'Completed' || 
        p.status === 'live' || 
        p.status === 'completed'
      );

      // Extraire les technologies uniques
      const techSet = new Set();
      projects.forEach(project => {
        if (project.technologies && Array.isArray(project.technologies)) {
          project.technologies.forEach(tech => techSet.add(tech.toLowerCase()));
        }
        if (project.tags && Array.isArray(project.tags)) {
          project.tags.forEach(tag => techSet.add(tag.toLowerCase()));
        }
      });

      // Calculer l'expérience (depuis 2021)
      const startDate = new Date('2021-01-01');
      const now = new Date();
      const experience = Math.max(3, Math.floor((now - startDate) / (365.25 * 24 * 60 * 60 * 1000)));

      return {
        projects: liveProjects.length,
        technologies: Math.max(techSet.size, 8), // Minimum 8 pour être réaliste
        experience,
        // Ces valeurs seront complétées par le hook useStats avec les témoignages
        clients: metadata.totalClients || 0,
        averageRating: metadata.averageRating || 0
      };

    } catch (error) {
      console.error('❌ Erreur calcul stats portfolio:', error);
      return {
        projects: 12,
        clients: 15,
        technologies: 18,
        experience: 4,
        averageRating: 4.8
      };
    }
  }

  // Vider le cache (utile pour forcer une mise à jour)
  clearCache() {
    this.cachedData = null;
    this.lastFetch = null;
    console.log('🗑️ Cache portfolio vidé');
  }
}

// Export d'une instance unique
const portfolioDataService = new PortfolioDataService();
export default portfolioDataService;