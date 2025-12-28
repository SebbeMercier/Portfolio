// Service pour utiliser Groq API (gratuit) avec fallback local
import portfolioAssistant from './portfolioAssistant';
import portfolioDataService from './portfolioDataService';

class GroqChatService {
  constructor() {
    // Groq API gratuite - 14,400 requêtes/jour
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.apiKey = process.env.REACT_APP_GROQ_API_KEY;
    this.isAvailable = !!this.apiKey;
    this.model = 'llama-3.1-70b-versatile'; // Modèle gratuit puissant
    
    console.log(this.isAvailable ? '✅ Groq API configurée' : '⚠️ Groq API non configurée, utilisation du fallback local');
    
    // Précharger les données du portfolio
    this.preloadPortfolioData();
  }

  // Précharger les données pour des réponses plus rapides
  async preloadPortfolioData() {
    try {
      await portfolioDataService.getPortfolioData();
      console.log('✅ Données portfolio préchargées');
    } catch (error) {
      console.log('⚠️ Erreur préchargement données:', error.message);
    }
  }

  // Envoyer un message à Groq
  async sendMessage(message, language = 'fr') {
    // Si pas de clé API, utiliser le fallback local
    if (!this.isAvailable) {
      return this.getFallbackResponse(message, language);
    }

    try {
      // Récupérer les données réelles du portfolio
      const portfolioData = await portfolioDataService.getPortfolioData();
      const formattedData = portfolioDataService.formatForAI(portfolioData);
      
      const systemPrompt = this.getSystemPrompt(language, formattedData);
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 250,
          temperature: 0.7,
          top_p: 0.9
        }),
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`Groq API Error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        text: data.choices[0].message.content,
        source: 'groq',
        model: this.model,
        timestamp: new Date().toISOString(),
        suggestions: this.generateSuggestions(message, language),
        actions: this.generateActions(message)
      };

    } catch (error) {
      console.error('Erreur Groq API:', error);
      
      // Fallback vers l'assistant local
      return this.getFallbackResponse(message, language);
    }
  }

  // Prompt système optimisé pour Groq avec données réelles
  getSystemPrompt(language, portfolioData) {
    const prompts = {
      fr: `Tu es l'assistant personnel de Sebbe Mercier, développeur Full Stack français.

INFORMATIONS PERSONNELLES :
${portfolioData.personal}

COMPÉTENCES TECHNIQUES :
${portfolioData.skills}

EXPÉRIENCE PROFESSIONNELLE :
${portfolioData.experiences}

PROJETS RÉALISÉS :
${portfolioData.projects}

INSTRUCTIONS :
- Réponds de manière professionnelle et concise (max 200 mots)
- Utilise des emojis avec parcimonie pour rendre tes réponses engageantes
- Reste dans le contexte de son portfolio professionnel
- Si les informations détaillées ne sont pas disponibles, invite à explorer le portfolio ou à le contacter directement
- Redirige vers ses projets ou son contact pour plus de détails
- Sois naturel et conversationnel, pas robotique
- Mentionne qu'il est développeur Full Stack avec de l'expérience en React et technologies modernes

Réponds en français de manière naturelle et professionnelle.`,

      en: `You are Sebbe Mercier's personal assistant, a French Full Stack developer.

PERSONAL INFORMATION:
${portfolioData.personal}

TECHNICAL SKILLS:
${portfolioData.skills}

PROFESSIONAL EXPERIENCE:
${portfolioData.experiences}

COMPLETED PROJECTS:
${portfolioData.projects}

INSTRUCTIONS:
- Respond professionally and concisely (max 200 words)
- Use emojis sparingly to make responses engaging
- Stay within his professional portfolio context
- If detailed information is not available, invite to explore the portfolio or contact him directly
- Redirect to his projects or contact for more details
- Be natural and conversational, not robotic
- Mention he's a Full Stack developer with experience in React and modern technologies

Respond in English naturally and professionally.`
    };

    return prompts[language] || prompts.fr;
  }

  // Générer des suggestions contextuelles
  generateSuggestions(message, language) {
    const lowerMessage = message.toLowerCase();
    
    const suggestions = {
      fr: {
        skills: ['Ses compétences React', 'Technologies backend', 'Années d\'expérience'],
        projects: ['Projets e-commerce', 'Portfolio moderne', 'Dashboard analytics'],
        contact: ['Email professionnel', 'Disponibilité', 'Nouveaux projets'],
        default: ['Ses compétences', 'Ses projets', 'Le contacter', 'Télécharger CV']
      },
      en: {
        skills: ['React skills', 'Backend technologies', 'Years of experience'],
        projects: ['E-commerce projects', 'Modern portfolio', 'Analytics dashboard'],
        contact: ['Professional email', 'Availability', 'New projects'],
        default: ['His skills', 'His projects', 'Contact him', 'Download CV']
      }
    };

    // Déterminer la catégorie
    let category = 'default';
    if (/compétence|skill|technologie/i.test(lowerMessage)) category = 'skills';
    else if (/projet|project|réalisation/i.test(lowerMessage)) category = 'projects';
    else if (/contact|email|disponible/i.test(lowerMessage)) category = 'contact';

    return suggestions[language]?.[category] || suggestions.fr.default;
  }

  // Générer des actions
  generateActions(message) {
    const lowerMessage = message.toLowerCase();
    const actions = [];

    if (/cv|curriculum|télécharger|download/i.test(lowerMessage)) {
      actions.push({ type: 'download', label: 'Télécharger CV' });
    }
    
    if (/contact|email/i.test(lowerMessage)) {
      actions.push({ type: 'contact', label: 'Aller au contact', target: 'contact' });
    }
    
    if (/projet|project/i.test(lowerMessage)) {
      actions.push({ type: 'scroll', label: 'Voir les projets', target: 'projects' });
    }

    return actions;
  }

  // Réponse de fallback avec l'assistant local
  async getFallbackResponse(message, language) {
    try {
      const localResponse = await portfolioAssistant.processMessage(message, language);
      
      return {
        ...localResponse,
        source: 'local-fallback',
        model: 'portfolio-assistant-local',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur fallback local:', error);
      
      return {
        text: language === 'fr' 
          ? "Désolé, je rencontre un problème technique. N'hésitez pas à explorer le portfolio ou me contacter directement !"
          : "Sorry, I'm experiencing technical issues. Feel free to explore the portfolio or contact me directly!",
        source: 'error-fallback',
        model: 'error-handler',
        timestamp: new Date().toISOString(),
        suggestions: language === 'fr' 
          ? ['Ses compétences', 'Ses projets', 'Le contacter']
          : ['His skills', 'His projects', 'Contact him']
      };
    }
  }

  // Message d'accueil
  getWelcomeMessage(language = 'fr') {
    const welcomeMessages = {
      fr: {
        text: `Bonjour ! 👋 Je suis l'assistant IA de Sebbe Mercier.\n\n${this.isAvailable ? '🚀 **IA avancée Groq activée** - Réponses ultra-rapides et naturelles !' : '⚡ **Mode local** - Réponses instantanées sur son profil !'}\n\nComment puis-je vous aider à découvrir ses compétences et projets ?`,
        suggestions: ['Ses compétences', 'Ses projets', 'Son expérience', 'Le contacter']
      },
      en: {
        text: `Hello! 👋 I'm Sebbe Mercier's AI assistant.\n\n${this.isAvailable ? '🚀 **Advanced Groq AI activated** - Ultra-fast and natural responses!' : '⚡ **Local mode** - Instant responses about his profile!'}\n\nHow can I help you discover his skills and projects?`,
        suggestions: ['His skills', 'His projects', 'His experience', 'Contact him']
      }
    };

    return welcomeMessages[language] || welcomeMessages.fr;
  }

  // Interface principale
  async processMessage(message, language = 'fr') {
    return await this.sendMessage(message, language);
  }

  // Vérifier le statut de l'API et des données
  async getStatus() {
    const portfolioData = await portfolioDataService.getPortfolioData();
    
    return {
      service: 'Groq',
      available: this.isAvailable,
      model: this.model,
      fallback: 'Local Portfolio Assistant',
      dailyLimit: '14,400 requests',
      cost: 'Free',
      dataSource: portfolioData ? 'Supabase Database' : 'Static Fallback',
      projectsCount: portfolioData.projects?.length || 0,
      skillsCount: portfolioData.skills?.length || 0,
      experiencesCount: portfolioData.experiences?.length || 0
    };
  }
}

// Export d'une instance unique
const groqChatService = new GroqChatService();
export default groqChatService;