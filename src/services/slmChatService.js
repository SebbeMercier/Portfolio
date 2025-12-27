// Service pour communiquer avec le SLM hébergé sur Railway/Render
class SLMChatService {
  constructor() {
    // URL de votre backend SLM sur Render (gratuit avec GitHub Student Pack)
    this.apiUrl = process.env.REACT_APP_SLM_API_URL || 'https://sebbe-slm-assistant.onrender.com/api';
    this.isAvailable = false;
    this.fallbackService = null;
    
    // Tester la disponibilité au démarrage
    this.checkAvailability();
  }

  // Vérifier si le SLM est disponible
  async checkAvailability() {
    try {
      const response = await fetch(`${this.apiUrl}/health`, {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        const data = await response.json();
        this.isAvailable = true;
        console.log('✅ SLM disponible:', data.model);
        return true;
      }
    } catch (error) {
      console.log('⚠️ SLM non disponible, utilisation du fallback');
      this.isAvailable = false;
    }
    
    return false;
  }

  // Envoyer un message au SLM
  async sendMessage(message, language = 'fr') {
    // Vérifier la disponibilité
    if (!this.isAvailable) {
      await this.checkAvailability();
    }

    // Si le SLM n'est pas disponible, utiliser le fallback
    if (!this.isAvailable) {
      return this.getFallbackResponse(message, language);
    }

    try {
      const response = await fetch(`${this.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          language,
          context: this.getPortfolioContext()
        }),
        timeout: 15000 // 15 secondes max
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      return {
        text: data.response,
        source: 'slm',
        model: data.model,
        timestamp: data.timestamp,
        suggestions: this.generateSuggestions(message, language),
        actions: this.generateActions(message)
      };

    } catch (error) {
      console.error('Erreur SLM:', error);
      
      // Fallback en cas d'erreur
      return this.getFallbackResponse(message, language);
    }
  }

  // Contexte du portfolio pour le SLM
  getPortfolioContext() {
    return {
      name: 'Sebbe Mercier',
      role: 'Développeur Full Stack',
      skills: ['React', 'Node.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
      experience_years: 4,
      location: 'France',
      email: 'info@sebbe-mercier.tech',
      projects: [
        'Portfolio moderne avec animations',
        'E-commerce complet avec paiements',
        'Dashboard analytics temps réel'
      ],
      availability: true
    };
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

    if (/cv|curriculum|télécharger/i.test(lowerMessage)) {
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

  // Réponse de fallback si le SLM n'est pas disponible
  getFallbackResponse(message, language) {
    // Importer le service local en fallback
    if (!this.fallbackService) {
      import('./portfolioAssistant').then(module => {
        this.fallbackService = module.default;
      });
    }

    // Réponse simple en attendant
    const fallbackResponses = {
      fr: {
        text: `Je rencontre un problème de connexion avec mon IA avancée. Voici ce que je peux vous dire sur Sebbe Mercier :\n\n🚀 **Développeur Full Stack** avec 4+ ans d'expérience\n💻 **Spécialités** : React, Node.js, TypeScript\n📧 **Contact** : info@sebbe-mercier.tech\n\nPour plus de détails, n'hésitez pas à explorer le portfolio ou me recontacter !`,
        suggestions: ['Ses compétences', 'Ses projets', 'Le contacter', 'Télécharger CV'],
        actions: [
          { type: 'scroll', label: 'Voir les projets', target: 'projects' },
          { type: 'download', label: 'Télécharger CV' }
        ]
      }
    };

    return {
      ...fallbackResponses[language] || fallbackResponses.fr,
      source: 'fallback',
      model: 'local-fallback',
      timestamp: new Date().toISOString()
    };
  }

  // Message d'accueil
  getWelcomeMessage(language = 'fr') {
    const welcomeMessages = {
      fr: {
        text: `Bonjour ! 👋 Je suis l'assistant IA de Sebbe Mercier.\n\n${this.isAvailable ? '🤖 **IA avancée activée** - Je peux répondre à toutes vos questions !' : '⚡ **Mode rapide** - Réponses instantanées sur son profil !'}\n\nComment puis-je vous aider à découvrir ses compétences et projets ?`,
        suggestions: ['Ses compétences', 'Ses projets', 'Son expérience', 'Le contacter']
      }
    };

    return welcomeMessages[language] || welcomeMessages.fr;
  }

  // Interface principale
  async processMessage(message, language = 'fr') {
    return await this.sendMessage(message, language);
  }
}

// Export d'une instance unique
export default new SLMChatService();