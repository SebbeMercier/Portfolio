// Service pour utiliser Groq API (gratuit) avec fallback local
import portfolioAssistant from './portfolioAssistant';
import portfolioDataService from './portfolioDataService';

class GroqChatService {
  constructor() {
    // Groq API gratuite - 14,400 requêtes/jour
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.apiKey = process.env.REACT_APP_GROQ_API_KEY;
    this.isAvailable = !!this.apiKey;
    this.model = 'llama-3.1-8b-instant'; // Modèle gratuit et rapide encore supporté
    
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
      
      // Contexte intelligent basé sur la question
      const formattedData = portfolioDataService.formatForAI(portfolioData, message, 2000); // Réduit de 4000 à 2000
      
      const systemPrompt = this.getSystemPrompt(language, formattedData);
      
      // Vérifier la taille du prompt (estimation)
      const promptSize = systemPrompt.length / 4; // ~4 chars par token
      if (promptSize > 3000) { // Réduit de 5000 à 3000
        console.warn(`⚠️ Prompt potentiellement trop long: ~${Math.round(promptSize)} tokens`);
        // Réduire encore le contexte si nécessaire
        const reducedData = portfolioDataService.formatForAI(portfolioData, message, 1000); // Réduit de 2000 à 1000
        const reducedPrompt = this.getSystemPrompt(language, reducedData);
        return await this.sendToGroq(reducedPrompt, message);
      }
      
      return await this.sendToGroq(systemPrompt, message);

    } catch (error) {
      console.error('Erreur Groq API:', error);
      
      // Fallback vers l'assistant local
      return this.getFallbackResponse(message, language);
    }
  }

  // Méthode séparée pour l'appel API
  async sendToGroq(systemPrompt, userMessage) {
    try {
      // Vérifier la taille du prompt
      const promptLength = systemPrompt.length;
      console.log('📏 Taille du prompt système:', promptLength, 'caractères');
      
      if (promptLength > 8000) {
        console.warn('⚠️ Prompt trop long, troncature à 8000 caractères');
        systemPrompt = systemPrompt.substring(0, 8000) + '\n\n[Contexte tronqué pour respecter les limites]';
      }

      const requestBody = {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 300,
        temperature: 0.7,
        top_p: 0.9
      };

      console.log('🚀 Envoi vers Groq:', {
        model: this.model,
        systemPromptLength: systemPrompt.length,
        userMessage: userMessage.substring(0, 100) + '...'
      });

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Groq API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Groq API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      return {
        text: data.choices[0].message.content,
        source: 'groq',
        model: this.model,
        timestamp: new Date().toISOString(),
        suggestions: this.generateSuggestions(userMessage, 'fr'),
        actions: this.generateActions(userMessage)
      };
    } catch (error) {
      console.error('💥 Erreur dans sendToGroq:', error);
      throw error;
    }
  }

  // Prompt système optimisé et adaptatif
  getSystemPrompt(language, portfolioData) {
    const baseInstructions = {
      fr: `Tu es l'assistant personnel de Sebbe Mercier, développeur Full Stack français.

INSTRUCTIONS :
- Réponds de manière professionnelle et concise (max 200 mots)
- Utilise des emojis avec parcimonie pour rendre tes réponses engageantes
- Si les informations détaillées ne sont pas disponibles, invite à explorer le portfolio
- Redirige vers ses projets ou son contact pour plus de détails
- Sois naturel et conversationnel, pas robotique

INFORMATIONS DISPONIBLES :`,

      en: `You are Sebbe Mercier's personal assistant, a French Full Stack developer.

INSTRUCTIONS:
- Respond professionally and concisely (max 200 words)
- Use emojis sparingly to make responses engaging
- If detailed information is not available, invite to explore the portfolio
- Redirect to his projects or contact for more details
- Be natural and conversational, not robotic

AVAILABLE INFORMATION:`
    };

    const contextSections = [];
    
    // Ajouter seulement les sections disponibles
    if (portfolioData.personal) {
      contextSections.push(`PROFIL :\n${portfolioData.personal}`);
    }
    
    if (portfolioData.summary) {
      contextSections.push(`RÉSUMÉ :\n${portfolioData.summary}`);
    }
    
    if (portfolioData.projects) {
      contextSections.push(`PROJETS SÉLECTIONNÉS :\n${portfolioData.projects}`);
    }
    
    if (portfolioData.skills) {
      contextSections.push(`COMPÉTENCES PRINCIPALES :\n${portfolioData.skills}`);
    }
    
    if (portfolioData.experiences) {
      contextSections.push(`EXPÉRIENCES RÉCENTES :\n${portfolioData.experiences}`);
    }

    const prompt = baseInstructions[language] || baseInstructions.fr;
    return `${prompt}\n\n${contextSections.join('\n\n')}\n\nRéponds en ${language === 'en' ? 'anglais' : 'français'} de manière naturelle et professionnelle.`;
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