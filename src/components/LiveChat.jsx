// Système de Live Chat Intelligent
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, Minimize2, Maximize2, 
  User, Bot, CheckCircle, Eye, ArrowDown, Sparkles,
  Code, Briefcase, Mail, Download, ExternalLink
} from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useNavigate, useLocation } from 'react-router-dom';

const LiveChat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "👋 Salut ! Je suis Sebbe, ton assistant IA personnel !\n\nJe peux t'aider à :\n• 🎯 Naviguer sur mon portfolio\n• 📄 Télécharger mon CV\n• ✨ Mettre en surbrillance des éléments\n• 🌐 Changer de page si nécessaire\n\nQue veux-tu découvrir ?",
      timestamp: new Date(),
      status: 'sent',
      actions: [
        { type: 'scroll', target: 'projects', label: 'Voir mes projets' },
        { type: 'scroll', target: 'skills', label: 'Mes compétences' },
        { type: 'download', label: 'Télécharger CV' }
      ]
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentSection, setCurrentSection] = useState('hero');
  const [pageContext, setPageContext] = useState({});
  const messagesEndRef = useRef(null);
  const { trackEvent, visitorId } = useAnalytics();

  // Mapping des sections vers les pages
  const sectionToPageMap = {
    'projects': '/projects',
    'portfolio': '/projects',
    'work': '/projects',
    'about': '/about',
    'a-propos': '/about',
    'presentation': '/about',
    'contact': '/contact',
    'contact-me': '/contact',
    'feedback': '/feedback',
    'avis': '/feedback',
    'testimonials': '/feedback',
    'admin': '/admin'
  };

  // Pages disponibles avec leurs sections principales
  const pageContent = {
    '/': ['hero', 'skills', 'stats', 'services'],
    '/about': ['about', 'timeline', 'experience'],
    '/projects': ['projects', 'portfolio', 'work'],
    '/contact': ['contact', 'form', 'info'],
    '/feedback': ['testimonials', 'reviews', 'avis'],
    '/admin': ['admin', 'dashboard']
  };

  // Auto-scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Détection de la section actuelle et contexte de page
  useEffect(() => {
    const detectCurrentSection = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      for (const section of sections) {
        const element = document.getElementById(section) || document.querySelector(`[data-section="${section}"]`);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;
          
          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setCurrentSection(section);
            break;
          }
        }
      }
      
      // Collecter le contexte de la page
      setPageContext({
        scrollPosition: window.scrollY,
        pageHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight,
        currentSection,
        projectsVisible: document.querySelectorAll('[data-project]').length,
        skillsVisible: document.querySelectorAll('[data-skill]').length
      });
    };

    const handleScroll = () => {
      detectCurrentSection();
    };

    window.addEventListener('scroll', handleScroll);
    detectCurrentSection(); // Initial detection

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection]);

  // Navigation intelligente vers d'autres pages
  const navigateToPage = (targetPage, sectionId = null) => {
    console.log('🌐 Navigation vers:', targetPage, 'section:', sectionId);
    
    return new Promise((resolve) => {
      navigate(targetPage);
      
      // Attendre que la page se charge
      setTimeout(() => {
        if (sectionId) {
          const found = scrollToSection(sectionId, false); // Ne pas chercher sur d'autres pages
          resolve(found);
        } else {
          resolve(true);
        }
      }, 500); // Délai pour le chargement de la page
    });
  };

  // Fonctions d'interaction avec la page améliorée
  const scrollToSection = (sectionId, allowPageNavigation = true) => {
    console.log('🔍 Recherche de la section:', sectionId, 'Page actuelle:', location.pathname);
    
    // Essayer plusieurs sélecteurs pour trouver la section
    const selectors = [
      `#${sectionId}`,
      `[data-section="${sectionId}"]`,
      `[id*="${sectionId}"]`,
      `.${sectionId}`,
      `section[data-name="${sectionId}"]`
    ];
    
    let element = null;
    
    for (const selector of selectors) {
      element = document.querySelector(selector);
      if (element) {
        console.log('✅ Section trouvée avec sélecteur:', selector);
        break;
      }
    }
    
    // Si pas trouvé, essayer des noms alternatifs
    if (!element) {
      const alternativeNames = {
        'projects': ['portfolio', 'work', 'mes-projets'],
        'skills': ['competences', 'technologies', 'stack'],
        'about': ['a-propos', 'presentation', 'profil'],
        'contact': ['contact-me', 'get-in-touch'],
        'testimonials': ['avis', 'reviews', 'temoignages']
      };
      
      const alternatives = alternativeNames[sectionId] || [];
      for (const alt of alternatives) {
        element = document.getElementById(alt) || document.querySelector(`[data-section="${alt}"]`);
        if (element) {
          console.log('✅ Section trouvée avec nom alternatif:', alt);
          break;
        }
      }
    }
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Effet de surbrillance
      element.style.transition = 'all 0.3s ease';
      element.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.5)';
      element.style.transform = 'scale(1.02)';
      
      setTimeout(() => {
        element.style.boxShadow = '';
        element.style.transform = '';
      }, 2000);
      
      return { found: true, onCurrentPage: true };
    }
    
    console.log('❌ Section non trouvée sur la page actuelle:', sectionId);
    
    // Si pas trouvé et navigation autorisée, chercher sur d'autres pages
    if (allowPageNavigation) {
      const targetPage = sectionToPageMap[sectionId.toLowerCase()];
      if (targetPage && targetPage !== location.pathname) {
        console.log('🌐 Section probablement sur la page:', targetPage);
        return { found: false, targetPage, sectionId };
      }
    }
    
    return { found: false };
  };

  const highlightElement = (selector) => {
    console.log('🔍 Recherche d\'éléments avec sélecteur:', selector);
    
    let elements = document.querySelectorAll(selector);
    
    // Si aucun élément trouvé, essayer des sélecteurs alternatifs
    if (elements.length === 0) {
      const alternativeSelectors = {
        '[data-project]': ['.project', '.portfolio-item', '[class*="project"]'],
        '[data-skill]': ['.skill', '.technology', '[class*="skill"]', '.tech-item'],
        '[data-testimonial]': ['.testimonial', '.review', '[class*="testimonial"]'],
        '[href*="mailto"]': ['a[href^="mailto"]', '.email', '.contact-email']
      };
      
      const alternatives = alternativeSelectors[selector] || [];
      for (const alt of alternatives) {
        elements = document.querySelectorAll(alt);
        if (elements.length > 0) {
          console.log('✅ Éléments trouvés avec sélecteur alternatif:', alt);
          break;
        }
      }
    }
    
    console.log(`📊 ${elements.length} élément(s) trouvé(s)`);
    
    elements.forEach((element, index) => {
      // Effet de surbrillance plus visible
      element.style.transition = 'all 0.5s ease';
      element.style.backgroundColor = 'rgba(168, 85, 247, 0.3)';
      element.style.borderRadius = '8px';
      element.style.padding = '8px';
      element.style.border = '2px solid rgba(168, 85, 247, 0.6)';
      element.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.4)';
      
      // Animation décalée pour chaque élément
      setTimeout(() => {
        element.style.transform = 'scale(1.05)';
        setTimeout(() => {
          element.style.transform = 'scale(1)';
        }, 200);
      }, index * 100);
      
      // Retour à la normale après 4 secondes
      setTimeout(() => {
        element.style.backgroundColor = '';
        element.style.borderRadius = '';
        element.style.padding = '';
        element.style.border = '';
        element.style.boxShadow = '';
        element.style.transform = '';
      }, 4000);
    });
    
    return elements.length;
  };

  // Actions spécifiques selon la page
  const getPageSpecificActions = (pagePath) => {
    const actions = {
      '/': [
        { type: 'scroll', target: 'skills', label: 'Mes compétences' },
        { type: 'scroll', target: 'services', label: 'Mes services' },
        { type: 'navigate', target: '/projects', label: 'Voir mes projets' }
      ],
      '/about': [
        { type: 'scroll', target: 'timeline', label: 'Mon parcours' },
        { type: 'scroll', target: 'experience', label: 'Mon expérience' },
        { type: 'download', label: 'Télécharger CV' }
      ],
      '/projects': [
        { type: 'highlight', target: '[data-project]', label: 'Surligner les projets' },
        { type: 'scroll', target: 'portfolio', label: 'Voir le portfolio' },
        { type: 'navigate', target: '/contact', label: 'Discuter d\'un projet' }
      ],
      '/contact': [
        { type: 'highlight', target: '[href*="mailto"]', label: 'Voir mon email' },
        { type: 'scroll', target: 'form', label: 'Formulaire de contact' },
        { type: 'download', label: 'Télécharger CV' }
      ],
      '/feedback': [
        { type: 'highlight', target: '[data-testimonial]', label: 'Surligner les avis' },
        { type: 'scroll', target: 'reviews', label: 'Lire les témoignages' },
        { type: 'navigate', target: '/projects', label: 'Voir mes projets' }
      ]
    };
    
    return actions[pagePath] || [
      { type: 'navigate', target: '/', label: 'Retour à l\'accueil' },
      { type: 'navigate', target: '/projects', label: 'Mes projets' },
      { type: 'navigate', target: '/contact', label: 'Me contacter' }
    ];
  };

  const triggerDownload = () => {
    console.log('🔍 Recherche du bouton de téléchargement CV dynamique...');
    
    // Essayer plusieurs sélecteurs pour trouver le bouton CV
    const selectors = [
      '[data-download-cv="true"]',
      '[data-download-cv]',
      'button[data-download-cv]',
      'button:contains("CV")',
      'a[href*="cv"]',
      'a[download*="cv"]',
      'button svg[data-lucide="download"]',
      '.download-cv'
    ];
    
    let downloadButton = null;
    
    for (const selector of selectors) {
      try {
        if (selector.includes(':contains')) {
          // Recherche manuelle pour :contains car pas supporté partout
          const buttons = document.querySelectorAll('button');
          downloadButton = Array.from(buttons).find(btn => 
            btn.textContent.toLowerCase().includes('cv') ||
            btn.textContent.toLowerCase().includes('télécharger') ||
            btn.textContent.toLowerCase().includes('génération')
          );
        } else {
          downloadButton = document.querySelector(selector);
        }
        
        if (downloadButton) {
          console.log('✅ Bouton CV dynamique trouvé avec sélecteur:', selector);
          break;
        }
      } catch (e) {
        console.log('❌ Erreur avec sélecteur:', selector, e);
      }
    }
    
    if (downloadButton) {
      console.log('🎯 Clic sur le bouton CV dynamique:', downloadButton);
      downloadButton.click();
      return true;
    }
    
    console.log('❌ Aucun bouton de téléchargement CV trouvé');
    return false;
  };

  // IA intelligente avec actions contextuelles
  const getIntelligentResponse = (message) => {
    const msg = message.toLowerCase();
    let response = "";
    let actions = [];

    // Analyse contextuelle basée sur la section actuelle
    const sectionContext = {
      hero: "Tu es sur ma page d'accueil",
      about: "Tu regardes ma présentation",
      skills: "Tu explores mes compétences",
      projects: "Tu consultes mes projets",
      testimonials: "Tu lis les avis clients",
      contact: "Tu es dans la section contact"
    };

    // Réponses intelligentes avec actions
    if (msg.includes('prix') || msg.includes('tarif') || msg.includes('coût')) {
      response = `💰 Mes tarifs varient selon la complexité :\n\n• Site vitrine : 800-1500€\n• App web : 2000-5000€\n• E-commerce : 1500-3000€\n\nVeux-tu voir des exemples de projets pour mieux estimer ?`;
      actions = [
        { type: 'scroll', target: 'projects', label: 'Voir mes projets' },
        { type: 'scroll', target: 'contact', label: 'Demander un devis' }
      ];
    }
    
    else if (msg.includes('projet') || msg.includes('portfolio') || msg.includes('exemple')) {
      const projectCount = pageContext.projectsVisible || 'plusieurs';
      const isOnProjectsPage = location.pathname === '/projects';
      
      if (isOnProjectsPage) {
        response = `🎨 Tu es sur ma page projets ! J'ai réalisé ${projectCount} projets variés. Que veux-tu découvrir ?`;
        actions = [
          { type: 'highlight', target: '[data-project]', label: 'Surligner les projets' },
          { type: 'scroll', target: 'portfolio', label: 'Voir le portfolio' }
        ];
      } else {
        response = `🎨 J'ai réalisé ${projectCount} projets variés ! Je peux te montrer mes réalisations sur la page dédiée.`;
        actions = [
          { type: 'navigate', target: '/projects', label: 'Aller à mes projets' },
          { type: 'scroll', target: 'projects', label: 'Chercher ici d\'abord' }
        ];
      }
    }
    
    else if (msg.includes('compétence') || msg.includes('skill') || msg.includes('techno')) {
      const isOnAboutPage = location.pathname === '/about';
      
      if (isOnAboutPage) {
        response = `🚀 Tu es sur ma page À propos ! Tu peux voir mon parcours et mes compétences détaillées ici.`;
        actions = [
          { type: 'scroll', target: 'timeline', label: 'Mon parcours' },
          { type: 'scroll', target: 'experience', label: 'Mon expérience' }
        ];
      } else {
        response = `🚀 Je maîtrise un stack moderne : React, Node.js, TypeScript, Tailwind CSS, et Supabase. Veux-tu voir le détail ?`;
        actions = [
          { type: 'scroll', target: 'skills', label: 'Voir mes compétences' },
          { type: 'navigate', target: '/about', label: 'Page À propos' }
        ];
      }
    }
    
    else if (msg.includes('parcours') || msg.includes('expérience') || msg.includes('timeline')) {
      const isOnAboutPage = location.pathname === '/about';
      
      if (isOnAboutPage) {
        response = `📈 Tu es au bon endroit ! Ma timeline et mon expérience sont détaillées sur cette page.`;
        actions = [
          { type: 'scroll', target: 'timeline', label: 'Voir ma timeline' },
          { type: 'scroll', target: 'experience', label: 'Mon expérience' }
        ];
      } else {
        response = `📈 Mon parcours et mon expérience sont détaillés sur ma page À propos !`;
        actions = [
          { type: 'navigate', target: '/about', label: 'Voir mon parcours' },
          { type: 'download', label: 'Télécharger CV' }
        ];
      }
    }
    
    else if (msg.includes('cv') || msg.includes('télécharger') || msg.includes('download')) {
      response = `📄 Parfait ! Je peux télécharger mon CV pour toi directement. Il contient tous les détails sur mon expérience et mes projets.`;
      actions = [
        { type: 'download', label: 'Télécharger mon CV' },
        { type: 'scroll', target: 'about', label: 'En savoir plus sur moi' }
      ];
    }
    
    else if (msg.includes('contact') || msg.includes('email') || msg.includes('rdv')) {
      const isOnContactPage = location.pathname === '/contact';
      
      if (isOnContactPage) {
        response = `📞 Parfait ! Tu es sur ma page contact. Tu peux m'écrire directement ou utiliser le formulaire !`;
        actions = [
          { type: 'highlight', target: '[href*="mailto"]', label: 'Voir mon email' },
          { type: 'scroll', target: 'form', label: 'Formulaire de contact' }
        ];
      } else {
        response = `📞 Excellente idée ! Je t'emmène sur ma page contact où tu trouveras toutes les infos !`;
        actions = [
          { type: 'navigate', target: '/contact', label: 'Aller au contact' },
          { type: 'scroll', target: 'contact', label: 'Chercher ici d\'abord' }
        ];
      }
    }
    
    else if (msg.includes('avis') || msg.includes('témoignage') || msg.includes('client')) {
      const isOnFeedbackPage = location.pathname === '/feedback';
      
      if (isOnFeedbackPage) {
        response = `⭐ Tu es sur ma page avis ! Mes clients sont très satisfaits. Lis leurs retours d'expérience !`;
        actions = [
          { type: 'highlight', target: '[data-testimonial]', label: 'Surligner les avis' },
          { type: 'scroll', target: 'reviews', label: 'Lire les témoignages' }
        ];
      } else {
        response = `⭐ Mes clients sont très satisfaits ! Je t'emmène sur la page des témoignages.`;
        actions = [
          { type: 'navigate', target: '/feedback', label: 'Voir les avis' },
          { type: 'scroll', target: 'testimonials', label: 'Chercher ici d\'abord' }
        ];
      }
    }
    
    else if (msg.includes('scroll') || msg.includes('défiler') || msg.includes('voir')) {
      response = `👀 ${sectionContext[currentSection] || 'Tu navigues sur mon portfolio'}. Où veux-tu aller ensuite ?`;
      actions = [
        { type: 'scroll', target: 'projects', label: 'Mes projets' },
        { type: 'scroll', target: 'skills', label: 'Mes compétences' },
        { type: 'scroll', target: 'contact', label: 'Me contacter' }
      ];
    }
    
    else if (msg.includes('salut') || msg.includes('bonjour') || msg.includes('hello')) {
      response = `👋 Salut ! Je suis Sebbe, développeur fullstack. ${sectionContext[currentSection] || ''} ! Comment puis-je t'aider aujourd'hui ?`;
      actions = [
        { type: 'scroll', target: 'about', label: 'Découvrir mon profil' },
        { type: 'scroll', target: 'projects', label: 'Voir mes réalisations' }
      ];
    }
    
    else if (msg.includes('aide') || msg.includes('help') || msg.includes('?')) {
      response = `🤖 Je peux t'aider à naviguer sur mon portfolio ! Je peux :\n\n• Te montrer mes projets\n• Expliquer mes compétences\n• Télécharger mon CV\n• Te diriger vers le contact\n\nQue veux-tu découvrir ?`;
      actions = [
        { type: 'scroll', target: 'projects', label: 'Projets' },
        { type: 'scroll', target: 'skills', label: 'Compétences' },
        { type: 'download', label: 'CV' }
      ];
    }
    
    else {
      // Réponse contextuelle par défaut
      const contextualResponses = {
        hero: "Tu découvres mon univers ! Je suis développeur fullstack passionné. Que veux-tu savoir sur moi ?",
        about: "Tu lis ma présentation ! As-tu des questions sur mon parcours ?",
        skills: "Tu explores mes compétences techniques ! Une techno t'intéresse en particulier ?",
        projects: "Tu regardes mes réalisations ! Un projet attire ton attention ?",
        testimonials: "Tu lis les retours clients ! Veux-tu en savoir plus sur un projet spécifique ?",
        contact: "Prêt à collaborer ? N'hésite pas à me contacter !"
      };
      
      response = contextualResponses[currentSection] || "Merci pour ton message ! Comment puis-je t'aider à explorer mon portfolio ? 😊";
      actions = [
        { type: 'scroll', target: 'projects', label: 'Voir mes projets' },
        { type: 'scroll', target: 'contact', label: 'Me contacter' }
      ];
    }

    return { response, actions };
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: newMessage,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Tracker le message
    trackEvent('chat_message_sent', {
      message_length: newMessage.length,
      visitor_id: visitorId
    });

    // Réponse intelligente après 1-2 secondes
    setTimeout(() => {
      const { response, actions } = getIntelligentResponse(newMessage);
      
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date(),
        status: 'sent',
        actions: actions // Actions interactives
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      // Si le chat est fermé, incrémenter les non-lus
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    }, Math.random() * 1000 + 800);
  };

  // Gérer les actions des boutons
  const handleAction = async (action) => {
    console.log('🤖 Action déclenchée:', action);
    trackEvent('chat_action', { type: action.type, target: action.target });
    
    switch (action.type) {
      case 'scroll':
        console.log('📍 Tentative de scroll vers:', action.target);
        const result = scrollToSection(action.target);
        
        if (result.found) {
          const confirmMessage = {
            id: Date.now(),
            type: 'bot',
            content: `✅ Je t'ai emmené à la section "${action.target}" !`,
            timestamp: new Date(),
            status: 'sent'
          };
          setMessages(prev => [...prev, confirmMessage]);
        } else if (result.targetPage) {
          // Proposer de naviguer vers une autre page
          const navMessage = {
            id: Date.now(),
            type: 'bot',
            content: `🌐 La section "${action.target}" se trouve sur une autre page. Je peux t'y emmener !`,
            timestamp: new Date(),
            status: 'sent',
            actions: [
              { 
                type: 'navigate', 
                target: result.targetPage, 
                sectionId: result.sectionId,
                label: `Aller à ${result.targetPage}` 
              },
              { 
                type: 'scroll', 
                target: 'top', 
                label: 'Rester ici' 
              }
            ]
          };
          setMessages(prev => [...prev, navMessage]);
        } else {
          const errorMessage = {
            id: Date.now(),
            type: 'bot',
            content: `❌ Section "${action.target}" non trouvée. Voici ce que je peux faire :`,
            timestamp: new Date(),
            status: 'sent',
            actions: [
              { type: 'navigate', target: '/projects', label: 'Voir mes projets' },
              { type: 'navigate', target: '/about', label: 'À propos de moi' },
              { type: 'navigate', target: '/contact', label: 'Me contacter' }
            ]
          };
          setMessages(prev => [...prev, errorMessage]);
        }
        break;
        
      case 'navigate':
        console.log('🌐 Navigation vers:', action.target);
        setIsTyping(true);
        
        try {
          if (action.sectionId) {
            await navigateToPage(action.target, action.sectionId);
            const navMessage = {
              id: Date.now(),
              type: 'bot',
              content: `✅ Je t'ai emmené sur ${action.target} et trouvé la section "${action.sectionId}" !`,
              timestamp: new Date(),
              status: 'sent'
            };
            setMessages(prev => [...prev, navMessage]);
          } else {
            navigate(action.target);
            const navMessage = {
              id: Date.now(),
              type: 'bot',
              content: `✅ Bienvenue sur ${action.target} ! Que veux-tu découvrir ici ?`,
              timestamp: new Date(),
              status: 'sent',
              actions: getPageSpecificActions(action.target)
            };
            setMessages(prev => [...prev, navMessage]);
          }
        } catch (error) {
          console.error('Erreur navigation:', error);
          const errorMessage = {
            id: Date.now(),
            type: 'bot',
            content: `❌ Erreur lors de la navigation vers ${action.target}`,
            timestamp: new Date(),
            status: 'sent'
          };
          setMessages(prev => [...prev, errorMessage]);
        }
        
        setIsTyping(false);
        break;
        
      case 'highlight':
        console.log('✨ Tentative de surbrillance:', action.target);
        const count = highlightElement(action.target);
        const highlightMessage = {
          id: Date.now(),
          type: 'bot',
          content: count > 0 
            ? `✨ J'ai mis en surbrillance ${count} élément${count > 1 ? 's' : ''} pour toi !`
            : `❌ Aucun élément trouvé avec le sélecteur "${action.target}".`,
          timestamp: new Date(),
          status: 'sent'
        };
        setMessages(prev => [...prev, highlightMessage]);
        break;
        
      case 'download':
        console.log('📥 Tentative de téléchargement CV');
        const downloaded = triggerDownload();
        const downloadMessage = {
          id: Date.now(),
          type: 'bot',
          content: downloaded 
            ? `📥 Téléchargement de mon CV lancé ! Tu devrais le recevoir dans quelques secondes.`
            : `📄 Je n'ai pas trouvé le bouton de téléchargement. Clique sur le bouton "CV" dans la navbar pour télécharger mon CV !`,
          timestamp: new Date(),
          status: 'sent'
        };
        setMessages(prev => [...prev, downloadMessage]);
        break;
        
      default:
        console.log('❓ Action inconnue:', action.type);
        break;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setUnreadCount(0);
    trackEvent('chat_opened');
  };

  const closeChat = () => {
    setIsOpen(false);
    trackEvent('chat_closed');
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    trackEvent('chat_minimized', { minimized: !isMinimized });
  };

  return (
    <>
      {/* Bouton flottant */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={openChat}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r 
                     from-purple-500 to-pink-500 rounded-full shadow-lg 
                     hover:shadow-xl transition-all duration-200 flex items-center 
                     justify-center group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle className="w-6 h-6 text-white" />
            
            {/* Badge de notifications */}
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 
                         rounded-full flex items-center justify-center text-white 
                         text-xs font-bold"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.div>
            )}
            
            {/* Pulse animation */}
            <div className="absolute inset-0 rounded-full bg-purple-500 
                          animate-ping opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Fenêtre de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-gray-900/95 
                     backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl 
                     overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r 
                          from-purple-500 to-pink-500">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center 
                              justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Sebbe Mercier</h3>
                  <div className="flex items-center gap-1 text-white/80 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    En ligne
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMinimize}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4 text-white" />
                  ) : (
                    <Minimize2 className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={closeChat}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="h-80 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs ${
                          message.type === 'user'
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/10 text-gray-200'
                        } px-4 py-2 rounded-lg`}>
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          
                          {/* Actions interactives pour les messages du bot */}
                          {message.type === 'bot' && message.actions && message.actions.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {message.actions.map((action, index) => (
                                <motion.button
                                  key={index}
                                  onClick={() => {
                                    console.log('🖱️ Clic sur bouton action:', action);
                                    handleAction(action);
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 
                                           hover:bg-purple-500/30 border border-purple-500/30 
                                           rounded-full text-xs transition-all duration-200 cursor-pointer"
                                >
                                  {action.type === 'scroll' && <ArrowDown className="w-3 h-3" />}
                                  {action.type === 'highlight' && <Sparkles className="w-3 h-3" />}
                                  {action.type === 'download' && <Download className="w-3 h-3" />}
                                  {action.type === 'navigate' && <ExternalLink className="w-3 h-3" />}
                                  <span>{action.label}</span>
                                </motion.button>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {message.type === 'user' && (
                              <CheckCircle className="w-3 h-3 opacity-70" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Indicateur de frappe */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white/10 px-4 py-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                              <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                            </div>
                            <span className="text-sm text-gray-300">IA analyse et répond...</span>
                            <div className="flex gap-1">
                              {[...Array(3)].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"
                                  style={{ animationDelay: `${i * 0.2}s` }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-white/10">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Tapez votre message..."
                        className="flex-1 px-3 py-2 bg-white/10 border border-white/20 
                                 rounded-lg text-white placeholder-gray-400 focus:outline-none 
                                 focus:border-purple-500/50"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 text-white rounded-lg transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChat;