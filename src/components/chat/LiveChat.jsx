// Système de Live Chat Intelligent avec traductions
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, Minimize2, Maximize2, 
  Sparkles
} from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useTranslation } from '../../hooks/useTranslation';
import { useNavigate, useLocation } from 'react-router-dom';

const LiveChat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, currentLanguage } = useTranslation();
  const { trackEvent, visitorId } = useAnalytics();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Générer le message d'accueil traduit
  const getWelcomeMessage = () => {
    const greeting = t('chat.greeting');
    const helpText = t('chat.helpText');
    const capabilities = [
      t('chat.capabilities.navigate'),
      t('chat.capabilities.download'),
      t('chat.capabilities.highlight'),
      t('chat.capabilities.changePage')
    ];
    const question = t('chat.question');
    
    return `${greeting}\n\n${helpText}\n${capabilities.map(cap => `• ${cap}`).join('\n')}\n\n${question}`;
  };

  const getWelcomeActions = () => {
    const actions = [
      { type: 'scroll', target: 'projects', label: t('chat.actions.viewProjects') },
      { type: 'scroll', target: 'skills', label: t('chat.actions.viewSkills') },
      { type: 'download', label: t('chat.actions.downloadCV') }
    ];
    console.log('getWelcomeActions retourne:', actions);
    return actions;
  };

  const [messages, setMessages] = useState([]);

  // Initialiser le message de bienvenue une fois que les traductions sont prêtes
  useEffect(() => {
    // Vérifier que les traductions sont chargées
    const testTranslation = t('chat.greeting');
    if (testTranslation && testTranslation !== 'chat.greeting' && messages.length === 0) {
      console.log('Initialisation du message de bienvenue avec actions:', getWelcomeActions());
      setMessages([
        {
          id: 1,
          type: 'bot',
          content: getWelcomeMessage(),
          timestamp: new Date(),
          status: 'sent',
          actions: getWelcomeActions()
        }
      ]);
    }
  }, [t, messages.length]);

  // Mettre à jour le message d'accueil quand la langue change
  useEffect(() => {
    if (messages.length > 0) {
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        if (updatedMessages[0] && updatedMessages[0].type === 'bot') {
          updatedMessages[0] = {
            ...updatedMessages[0],
            content: getWelcomeMessage(),
            actions: getWelcomeActions()
          };
        }
        return updatedMessages;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage]);

  // Auto-scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fonction pour obtenir les réponses traduites
  const getTranslatedResponse = (type) => {
    const responses = {
      projects: t('chat.responses.projectsInfo'),
      skills: t('chat.responses.skillsInfo'),
      about: t('chat.responses.aboutInfo'),
      contact: t('chat.responses.contactInfo'),
      cv: t('chat.responses.cvInfo'),
      default: t('chat.responses.defaultResponse')
    };
    
    return responses[type] || responses.default;
  };

  // Fonction pour obtenir les actions traduites
  const getTranslatedActions = (type) => {
    const actionSets = {
      projects: [
        { type: 'scroll', target: 'projects', label: t('chat.actions.viewProjects') },
        { type: 'navigate', target: '/projects', label: t('chat.actions.viewProjects') }
      ],
      skills: [
        { type: 'scroll', target: 'skills', label: t('chat.actions.viewSkills') },
        { type: 'navigate', target: '/about', label: t('chat.actions.viewAbout') }
      ],
      contact: [
        { type: 'navigate', target: '/contact', label: t('chat.actions.viewContact') },
        { type: 'scroll', target: 'contact', label: t('chat.actions.viewContact') }
      ],
      default: [
        { type: 'scroll', target: 'projects', label: t('chat.actions.viewProjects') },
        { type: 'scroll', target: 'skills', label: t('chat.actions.viewSkills') },
        { type: 'navigate', target: '/contact', label: t('chat.actions.viewContact') }
      ]
    };
    
    return actionSets[type] || actionSets.default;
  };

  // IA intelligente avec réponses traduites
  const getIntelligentResponse = (message) => {
    const msg = message.toLowerCase();
    let response = "";
    let actions = [];

    // Mots-clés multilingues
    const keywords = {
      projects: ['projet', 'project', 'portfolio', 'réalisation', 'projecten'],
      skills: ['compétence', 'skill', 'technologie', 'stack', 'vaardigheid', 'technologie'],
      contact: ['contact', 'email', 'rdv', 'contacteer'],
      cv: ['cv', 'télécharger', 'download', 'downloaden'],
      help: ['aide', 'help', 'hulp', '?'],
      greeting: ['salut', 'bonjour', 'hello', 'hallo', 'hi']
    };

    if (keywords.projects.some(keyword => msg.includes(keyword))) {
      response = getTranslatedResponse('projects');
      actions = getTranslatedActions('projects');
    }
    else if (keywords.skills.some(keyword => msg.includes(keyword))) {
      response = getTranslatedResponse('skills');
      actions = getTranslatedActions('skills');
    }
    else if (keywords.cv.some(keyword => msg.includes(keyword))) {
      response = getTranslatedResponse('cv');
      actions = [
        { type: 'download', label: t('chat.actions.downloadCV') },
        { type: 'navigate', target: '/about', label: t('chat.actions.viewAbout') }
      ];
    }
    else if (keywords.contact.some(keyword => msg.includes(keyword))) {
      response = getTranslatedResponse('contact');
      actions = getTranslatedActions('contact');
    }
    else if (keywords.help.some(keyword => msg.includes(keyword))) {
      const helpText = t('chat.helpText');
      const capabilities = [
        t('chat.capabilities.navigate'),
        t('chat.capabilities.download'),
        t('chat.capabilities.highlight'),
        t('chat.capabilities.changePage')
      ];
      const question = t('chat.question');
      
      response = `🤖 ${helpText}\n\n${capabilities.map(cap => `• ${cap}`).join('\n')}\n\n${question}`;
      actions = getTranslatedActions('default');
    }
    else if (keywords.greeting.some(keyword => msg.includes(keyword))) {
      response = `👋 ${t('chat.greeting')} ${t('chat.question')}`;
      actions = getTranslatedActions('default');
    }
    else {
      response = getTranslatedResponse('default');
      actions = getTranslatedActions('default');
    }

    return { response, actions };
  };

  // Gérer l'envoi de message
  const handleSendMessage = async () => {
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

    // Analytics
    trackEvent('chat_message_sent', {
      message_length: newMessage.length,
      visitor_id: visitorId,
      page: location.pathname
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
        actions: actions
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    }, Math.random() * 1000 + 1000);
  };

  // Gérer les actions du bot
  const handleAction = (action) => {
    console.log('handleAction appelée avec:', action);
    
    trackEvent('chat_action_clicked', {
      action_type: action.type,
      action_target: action.target,
      visitor_id: visitorId
    });

    switch (action.type) {
      case 'scroll':
        const element = document.getElementById(action.target) || 
                      document.querySelector(`[data-section="${action.target}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      
      case 'navigate':
        navigate(action.target);
        break;
      
      case 'download':
        // Déclencher le téléchargement du CV
        const downloadEvent = new CustomEvent('downloadCV');
        window.dispatchEvent(downloadEvent);
        break;
      
      case 'highlight':
        const targets = document.querySelectorAll(action.target);
        targets.forEach(target => {
          target.style.outline = '2px solid #8B5CF6';
          target.style.outlineOffset = '4px';
          setTimeout(() => {
            target.style.outline = '';
            target.style.outlineOffset = '';
          }, 3000);
        });
        break;
      
      default:
        console.log('Action non reconnue:', action.type);
        break;
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
    
    trackEvent('chat_toggled', {
      action: isOpen ? 'close' : 'open',
      visitor_id: visitorId
    });
  };

  return (
    <>
      {/* Bouton flottant */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
      >
        <button
          onClick={toggleChat}
          className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <MessageCircle className="w-6 h-6" />
          
          {/* Badge de notifications */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          
          {/* Effet de pulsation */}
          <div className="absolute inset-0 bg-purple-600 rounded-full animate-ping opacity-20"></div>
        </button>
      </motion.div>

      {/* Fenêtre de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] z-50"
          >
            <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Sebbe</h3>
                    <p className="text-white/80 text-sm">{t('chat.online')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white/80 hover:text-white p-1 rounded"
                    title={isMinimized ? t('chat.maximize') : t('chat.minimize')}
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={toggleChat}
                    className="text-white/80 hover:text-white p-1 rounded"
                    title={t('chat.close')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              {!isMinimized && (
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-100'
                        }`}
                      >
                        <p className="whitespace-pre-line text-sm">{message.content}</p>
                        
                        {/* Actions du bot */}
                        {message.actions && message.actions.length > 0 ? (
                          <div className="mt-3 space-y-2">
                            {console.log('Rendu des actions pour le message:', message.id, message.actions)}
                            {message.actions.map((action, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  console.log('Action cliquée:', action);
                                  handleAction(action);
                                }}
                                className="block w-full text-left px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg text-sm transition-colors cursor-pointer"
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        ) : (
                          console.log('Pas d\'actions pour le message:', message.id, message.actions)
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Indicateur de frappe */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800 text-gray-100 p-3 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-gray-400">{t('chat.typing')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Input */}
              {!isMinimized && (
                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={t('chat.placeholder')}
                      className="flex-1 bg-gray-800 text-white placeholder-gray-400 px-4 py-2 rounded-lg border border-white/10 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white p-2 rounded-lg transition-colors"
                      title={t('chat.send')}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChat;