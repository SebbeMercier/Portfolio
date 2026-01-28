// Service de chatbot intelligent avec SLM
import { translations } from '../translations';

class SmartChatbotService {
  constructor() {
    this.models = {
      primary: 'phi4:mini',      // Modèle principal
      fallback: 'qwen2.5:0.5b', // Fallback ultra-rapide
      api_endpoint: 'http://localhost:11434/api/generate' // Ollama local
    };
    
    this.context = {
      name: 'Sebbe Mercier',
      role: 'Développeur Full Stack',
      skills: ['React', 'Node.js', 'TypeScript', 'Supabase'],
      languages: ['Français', 'Anglais', 'Néerlandais']
    };
  }

  // Système de prompt intelligent selon la langue
  getSystemPrompt(language = 'fr') {
    const prompts = {
      fr: `Tu es l'assistant personnel de Sebbe Mercier, développeur Full Stack spécialisé en React et Node.js.
           Réponds de manière professionnelle et concise. Utilise ses compétences et projets pour répondre.
           Reste dans le contexte de son portfolio professionnel.`,
      
      en: `You are Sebbe Mercier's personal assistant, a Full Stack developer specialized in React and Node.js.
           Answer professionally and concisely. Use his skills and projects to respond.
           Stay within his professional portfolio context.`,
      
      nl: `Je bent de persoonlijke assistent van Sebbe Mercier, een Full Stack ontwikkelaar gespecialiseerd in React en Node.js.
           Antwoord professioneel en beknopt. Gebruik zijn vaardigheden en projecten om te antwoorden.
           Blijf binnen de context van zijn professionele portfolio.`
    };
    
    return prompts[language] || prompts.fr;
  }

  // Détection intelligente du type de question
  categorizeQuery(message) {
    const categories = {
      skills: ['compétence', 'skill', 'technologie', 'framework', 'language'],
      projects: ['projet', 'project', 'réalisation', 'portfolio', 'travail'],
      experience: ['expérience', 'experience', 'poste', 'job', 'entreprise'],
      contact: ['contact', 'email', 'téléphone', 'disponible', 'embauche'],
      general: ['bonjour', 'hello', 'salut', 'qui', 'what', 'comment']
    };

    const lowerMessage = message.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return category;
      }
    }
    
    return 'general';
  }

  // Réponses rapides pour questions fréquentes
  getQuickResponse(category, language = 'fr') {
    const quickResponses = {
      fr: {
        skills: "Sebbe maîtrise React, Node.js, TypeScript, Supabase, et Tailwind CSS. Il a 4+ ans d'expérience en développement Full Stack.",
        contact: "Vous pouvez contacter Sebbe à info@sebbe-mercier.tech ou via le formulaire de contact du site.",
        general: "Bonjour ! Je suis l'assistant de Sebbe Mercier. Comment puis-je vous aider à en savoir plus sur ses compétences ?"
      },
      en: {
        skills: "Sebbe masters React, Node.js, TypeScript, Supabase, and Tailwind CSS. He has 4+ years of Full Stack development experience.",
        contact: "You can contact Sebbe at info@sebbe-mercier.tech or via the site's contact form.",
        general: "Hello! I'm Sebbe Mercier's assistant. How can I help you learn more about his skills?"
      },
      nl: {
        skills: "Sebbe beheerst React, Node.js, TypeScript, Supabase, en Tailwind CSS. Hij heeft 4+ jaar Full Stack ontwikkelervaring.",
        contact: "Je kunt Sebbe contacteren op info@sebbe-mercier.tech of via het contactformulier.",
        general: "Hallo! Ik ben Sebbe Mercier's assistent. Hoe kan ik je helpen meer te weten te komen over zijn vaardigheden?"
      }
    };

    return quickResponses[language]?.[category] || quickResponses.fr[category];
  }

  // Appel au modèle SLM
  async callSLM(message, language = 'fr', useQuickResponse = true) {
    try {
      const category = this.categorizeQuery(message);
      
      // Utiliser réponse rapide pour questions simples
      if (useQuickResponse && ['skills', 'contact', 'general'].includes(category)) {
        return {
          response: this.getQuickResponse(category, language),
          source: 'quick_response',
          model: 'built-in'
        };
      }

      // Appel au SLM pour questions complexes
      const response = await fetch(this.models.api_endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.models.primary,
          prompt: `${this.getSystemPrompt(language)}\n\nQuestion: ${message}\nRéponse:`,
          stream: false,
          options: {
            temperature: 0.7,
            max_tokens: 256,
            top_p: 0.9
          }
        })
      });

      if (!response.ok) {
        throw new Error('SLM API error');
      }

      const data = await response.json();
      
      return {
        response: data.response,
        source: 'slm',
        model: this.models.primary
      };

    } catch (error) {
      console.error('Erreur SLM:', error);
      
      // Fallback vers réponse rapide
      const category = this.categorizeQuery(message);
      return {
        response: this.getQuickResponse(category, language),
        source: 'fallback',
        model: 'built-in'
      };
    }
  }

  // Interface principale
  async chat(message, language = 'fr') {
    const startTime = Date.now();
    const result = await this.callSLM(message, language);
    const responseTime = Date.now() - startTime;

    return {
      ...result,
      responseTime,
      timestamp: new Date().toISOString()
    };
  }
}

export default new SmartChatbotService();