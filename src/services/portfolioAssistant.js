// Assistant Portfolio Intelligent - 100% côté client
class PortfolioAssistant {
  constructor() {
    // Base de connaissances sur Sebbe Mercier
    this.knowledge = {
      personal: {
        name: 'Sebbe Mercier',
        role: 'Développeur Full Stack',
        email: 'info@sebbe-mercier.tech',
        website: 'https://sebbe-mercier.tech',
        location: 'France',
        experience_years: 4,
        availability: true
      },
      skills: {
        frontend: [
          { name: 'React', level: 5, years: 4, description: 'Framework principal, maîtrise avancée' },
          { name: 'TypeScript', level: 4, years: 3, description: 'Typage statique, code robuste' },
          { name: 'Tailwind CSS', level: 5, years: 3, description: 'Framework CSS utilitaire' },
          { name: 'Next.js', level: 4, years: 2, description: 'Framework React full-stack' },
          { name: 'JavaScript', level: 5, years: 5, description: 'Langage de base, ES6+' }
        ],
        backend: [
          { name: 'Node.js', level: 4, years: 4, description: 'Runtime JavaScript serveur' },
          { name: 'Express', level: 4, years: 3, description: 'Framework web Node.js' },
          { name: 'Supabase', level: 4, years: 2, description: 'Backend-as-a-Service' },
          { name: 'PostgreSQL', level: 4, years: 3, description: 'Base de données relationnelle' }
        ],
        tools: [
          { name: 'Git', level: 5, years: 5, description: 'Contrôle de version' },
          { name: 'Docker', level: 3, years: 2, description: 'Conteneurisation' },
          { name: 'AWS', level: 3, years: 2, description: 'Services cloud' }
        ]
      },
      projects: [
        {
          name: 'Portfolio Moderne',
          description: 'Site portfolio avec animations avancées et design responsive',
          technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'Supabase'],
          features: ['Animations fluides', 'Design responsive', 'Multilingue', 'CV dynamique'],
          status: 'En ligne'
        },
        {
          name: 'E-commerce Complet',
          description: 'Plateforme e-commerce avec panier, paiements et gestion admin',
          technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
          features: ['Paiements sécurisés', 'Gestion stock', 'Interface admin', 'Analytics'],
          status: 'Terminé'
        },
        {
          name: 'Dashboard Analytics',
          description: 'Interface de visualisation de données en temps réel',
          technologies: ['React', 'D3.js', 'Node.js', 'MongoDB'],
          features: ['Graphiques interactifs', 'Temps réel', 'Export données', 'Filtres avancés'],
          status: 'Terminé'
        }
      ],
      experience: [
        {
          title: 'Développeur Full Stack Senior',
          company: 'TechCorp Solutions',
          period: '2022 - Présent',
          location: 'Paris, France',
          achievements: [
            'Amélioration des performances de 40%',
            'Migration complète vers TypeScript',
            'Gestion d\'équipe de 3 développeurs',
            'Mise en place CI/CD'
          ],
          technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS']
        }
      ]
    };

    // Patterns de reconnaissance d'intention
    this.intentPatterns = {
      skills: [
        /compétence|skill|technologie|framework|language|maîtrise|savoir/i,
        /react|node|typescript|javascript|css|html|database/i,
        /frontend|backend|full.?stack|développement/i
      ],
      projects: [
        /projet|project|réalisation|portfolio|travail|création/i,
        /site|application|app|plateforme|système/i,
        /ecommerce|dashboard|analytics|chatbot/i
      ],
      experience: [
        /expérience|experience|poste|job|entreprise|carrière/i,
        /travail|emploi|mission|responsabilité/i,
        /senior|développeur|équipe|management/i
      ],
      contact: [
        /contact|email|téléphone|disponible|embauche|recrutement/i,
        /joindre|contacter|écrire|appeler|rencontrer/i,
        /collaboration|projet|opportunité/i
      ],
      cv: [
        /cv|curriculum|résumé|télécharger|download|pdf/i,
        /diplôme|formation|parcours|qualification/i
      ],
      greeting: [
        /bonjour|hello|salut|hi|hey|bonsoir/i,
        /qui|what|comment|how|présent/i
      ],
      help: [
        /aide|help|assistance|question|info|information/i,
        /expliquer|dire|parler|savoir/i
      ]
    };
  }

  // Analyser l'intention du message
  analyzeIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(lowerMessage)) {
          return intent;
        }
      }
    }
    
    return 'default';
  }

  // Extraire des entités spécifiques du message
  extractEntities(message) {
    const entities = {
      technologies: [],
      projectTypes: [],
      timeframe: null
    };

    const lowerMessage = message.toLowerCase();

    // Technologies mentionnées
    const allTechs = [
      ...this.knowledge.skills.frontend,
      ...this.knowledge.skills.backend,
      ...this.knowledge.skills.tools
    ];

    allTechs.forEach(tech => {
      if (lowerMessage.includes(tech.name.toLowerCase())) {
        entities.technologies.push(tech);
      }
    });

    // Types de projets
    const projectKeywords = {
      'ecommerce': ['ecommerce', 'e-commerce', 'boutique', 'vente'],
      'dashboard': ['dashboard', 'tableau', 'analytics', 'données'],
      'portfolio': ['portfolio', 'site', 'personnel'],
      'chatbot': ['chatbot', 'chat', 'assistant', 'bot']
    };

    for (const [type, keywords] of Object.entries(projectKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        entities.projectTypes.push(type);
      }
    }

    return entities;
  }

  // Générer une réponse contextuelle
  generateResponse(message, language = 'fr', entities = {}) {
    const intent = this.analyzeIntent(message);
    const extractedEntities = this.extractEntities(message);
    
    const responses = this.getResponseTemplates(language);
    const response = responses[intent] || responses.default;

    // Personnaliser la réponse selon les entités
    let personalizedResponse = response.text;
    let suggestions = [...response.suggestions];
    let actions = response.actions || [];

    // Ajouter des détails spécifiques si des technologies sont mentionnées
    if (extractedEntities.technologies.length > 0) {
      const techDetails = extractedEntities.technologies.map(tech => 
        `**${tech.name}** (${tech.level}/5, ${tech.years} ans) - ${tech.description}`
      ).join('\n');
      
      if (intent === 'skills') {
        personalizedResponse += `\n\n📋 **Détails sur les technologies mentionnées:**\n${techDetails}`;
      }
    }

    // Ajouter des projets spécifiques si mentionnés
    if (extractedEntities.projectTypes.length > 0 && intent === 'projects') {
      const relevantProjects = this.knowledge.projects.filter(project =>
        extractedEntities.projectTypes.some(type =>
          project.name.toLowerCase().includes(type) ||
          project.description.toLowerCase().includes(type)
        )
      );

      if (relevantProjects.length > 0) {
        const projectDetails = relevantProjects.map(project =>
          `🎯 **${project.name}**: ${project.description}\n   Technologies: ${project.technologies.join(', ')}`
        ).join('\n\n');
        
        personalizedResponse += `\n\n**Projets correspondants:**\n${projectDetails}`;
      }
    }

    return {
      text: personalizedResponse,
      suggestions,
      actions,
      intent,
      confidence: this.calculateConfidence(message, intent)
    };
  }

  // Calculer la confiance de la réponse
  calculateConfidence(message, intent) {
    const patterns = this.intentPatterns[intent] || [];
    const matches = patterns.filter(pattern => pattern.test(message.toLowerCase())).length;
    return Math.min(0.3 + (matches * 0.2), 1.0);
  }

  // Templates de réponses par langue
  getResponseTemplates(language) {
    const templates = {
      fr: {
        skills: {
          text: `Sebbe maîtrise un large éventail de technologies modernes :\n\n🚀 **Frontend** (${this.knowledge.skills.frontend.length} technologies)\n${this.knowledge.skills.frontend.map(s => `• ${s.name} - Niveau ${s.level}/5`).join('\n')}\n\n💻 **Backend** (${this.knowledge.skills.backend.length} technologies)\n${this.knowledge.skills.backend.map(s => `• ${s.name} - Niveau ${s.level}/5`).join('\n')}\n\n🛠️ **Outils** (${this.knowledge.skills.tools.length} technologies)\n${this.knowledge.skills.tools.map(s => `• ${s.name} - Niveau ${s.level}/5`).join('\n')}\n\nIl a **${this.knowledge.personal.experience_years}+ ans d'expérience** en développement Full Stack !`,
          suggestions: ['Voir ses projets', 'Son expérience', 'Télécharger son CV', 'Le contacter']
        },
        projects: {
          text: `Sebbe a réalisé **${this.knowledge.projects.length} projets majeurs** :\n\n${this.knowledge.projects.map(p => `🎨 **${p.name}**\n   ${p.description}\n   Technologies: ${p.technologies.join(', ')}\n   Statut: ${p.status}`).join('\n\n')}\n\nTous ses projets utilisent les **dernières technologies** et suivent les **meilleures pratiques** !`,
          suggestions: ['Détails techniques', 'Ses compétences', 'Le contacter', 'Télécharger son CV']
        },
        experience: {
          text: `Sebbe a une **solide expérience professionnelle** :\n\n💼 **${this.knowledge.experience[0].title}**\n🏢 ${this.knowledge.experience[0].company} (${this.knowledge.experience[0].period})\n📍 ${this.knowledge.experience[0].location}\n\n🎯 **Réalisations clés:**\n${this.knowledge.experience[0].achievements.map(a => `• ${a}`).join('\n')}\n\n💻 **Technologies utilisées:**\n${this.knowledge.experience[0].technologies.join(' • ')}\n\nIl est **passionné** par les technologies modernes et l'innovation !`,
          suggestions: ['Ses projets', 'Ses compétences', 'Le contacter', 'Télécharger son CV']
        },
        contact: {
          text: `Vous pouvez **facilement contacter** Sebbe :\n\n📧 **Email professionnel**\n   ${this.knowledge.personal.email}\n\n🌐 **Site web**\n   ${this.knowledge.personal.website}\n\n📍 **Localisation**\n   ${this.knowledge.personal.location}\n\n✅ **Disponibilité**\n   ${this.knowledge.personal.availability ? 'Disponible pour de nouveaux projets !' : 'Actuellement occupé'}\n\n💼 **Spécialités**\n   Développement Full Stack • React • Node.js\n\nN'hésitez pas à le contacter pour discuter de vos **projets** !`,
          suggestions: ['Télécharger son CV', 'Ses compétences', 'Ses projets', 'Voir son portfolio'],
          actions: [
            { type: 'contact', label: 'Aller au contact', target: 'contact' },
            { type: 'download', label: 'Télécharger CV' }
          ]
        },
        cv: {
          text: `Le **CV de Sebbe** est disponible en téléchargement direct !\n\n📄 **CV Dynamique**\n   • Généré en temps réel depuis la base de données\n   • Toujours à jour avec ses derniers projets\n   • Design moderne et professionnel\n\n🌍 **Multilingue**\n   • Français, Anglais, Néerlandais\n   • Adaptation automatique selon la langue\n\n📊 **Contenu complet**\n   • ${this.knowledge.skills.frontend.length + this.knowledge.skills.backend.length + this.knowledge.skills.tools.length} compétences techniques\n   • ${this.knowledge.projects.length} projets détaillés\n   • Expérience professionnelle complète\n\nLe CV est **synchronisé** avec ses dernières réalisations !`,
          suggestions: ['Télécharger maintenant', 'Ses projets', 'Ses compétences', 'Le contacter'],
          actions: [{ type: 'download', label: '📄 Télécharger CV' }]
        },
        greeting: {
          text: `Bonjour ! 👋 **Ravi de vous rencontrer !**\n\nJe suis l'**assistant personnel** de **${this.knowledge.personal.name}**, ${this.knowledge.personal.role} passionné basé en ${this.knowledge.personal.location}.\n\n🎯 **Je peux vous aider à découvrir :**\n• Ses **${this.knowledge.skills.frontend.length + this.knowledge.skills.backend.length + this.knowledge.skills.tools.length} compétences techniques**\n• Ses **${this.knowledge.projects.length} projets réalisés**\n• Son **expérience professionnelle**\n• Ses **informations de contact**\n• **Télécharger son CV**\n\n💡 **Posez-moi n'importe quelle question** sur son parcours !`,
          suggestions: ['Ses compétences', 'Ses projets', 'Son expérience', 'Le contacter']
        },
        help: {
          text: `Je suis là pour vous **aider** ! 🤝\n\n❓ **Questions que vous pouvez me poser :**\n\n🚀 **Compétences**\n   "Quelles technologies maîtrise-t-il ?"\n   "Quel est son niveau en React ?"\n\n💼 **Projets**\n   "Quels projets a-t-il réalisés ?"\n   "Montre-moi ses réalisations e-commerce"\n\n📈 **Expérience**\n   "Quelle est son expérience ?"\n   "Où a-t-il travaillé ?"\n\n📞 **Contact**\n   "Comment le contacter ?"\n   "Est-il disponible ?"\n\n📄 **CV**\n   "Je veux télécharger son CV"\n\n**Essayez une question !** 💬`,
          suggestions: ['Ses compétences', 'Ses projets', 'Son expérience', 'Le contacter']
        },
        default: {
          text: `C'est une **excellente question** ! 🤔\n\nJe peux vous parler de **${this.knowledge.personal.name}** sur plusieurs aspects :\n\n🚀 **Compétences techniques**\n   ${this.knowledge.skills.frontend.length + this.knowledge.skills.backend.length + this.knowledge.skills.tools.length} technologies maîtrisées\n\n💼 **Projets réalisés**\n   ${this.knowledge.projects.length} projets majeurs terminés\n\n📈 **Expérience professionnelle**\n   ${this.knowledge.personal.experience_years}+ ans en développement Full Stack\n\n📞 **Contact & disponibilité**\n   Informations pour le joindre\n\n📄 **CV téléchargeable**\n   Document toujours à jour\n\n**Que vous intéresse le plus ?** 🎯`,
          suggestions: ['Ses compétences', 'Ses projets', 'Son expérience', 'Le contacter']
        }
      }
    };

    return templates[language] || templates.fr;
  }

  // Message d'accueil personnalisé
  getWelcomeMessage(language = 'fr') {
    const welcomeMessages = {
      fr: {
        text: `Bonjour ! 👋 Je suis l'**assistant personnel** de **${this.knowledge.personal.name}**.\n\nIl est **${this.knowledge.personal.role}** avec **${this.knowledge.personal.experience_years}+ ans d'expérience**, spécialisé en **React** et **Node.js**.\n\n🎯 **Comment puis-je vous aider ?**\n\nJe connais tout sur ses compétences, projets, expérience et je peux vous aider à le contacter !`,
        suggestions: ['Ses compétences', 'Ses projets', 'Son expérience', 'Le contacter']
      }
    };

    return welcomeMessages[language] || welcomeMessages.fr;
  }

  // Interface principale pour traiter un message
  async processMessage(message, language = 'fr') {
    // Simuler un petit délai pour le réalisme
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    
    return this.generateResponse(message, language);
  }

  // Obtenir des suggestions contextuelles
  getContextualSuggestions(intent, language = 'fr') {
    const suggestions = {
      fr: {
        skills: ['Niveau en React', 'Technologies backend', 'Années d\'expérience', 'Outils utilisés'],
        projects: ['Projet e-commerce', 'Dashboard analytics', 'Portfolio moderne', 'Technologies utilisées'],
        experience: ['Poste actuel', 'Réalisations', 'Équipe managée', 'Technologies'],
        contact: ['Email professionnel', 'Disponibilité', 'Nouveaux projets', 'Collaboration'],
        cv: ['Télécharger PDF', 'Format multilingue', 'Dernière version', 'Contenu détaillé']
      }
    };

    return suggestions[language]?.[intent] || suggestions.fr.skills;
  }
}

// Export d'une instance unique
export default new PortfolioAssistant();