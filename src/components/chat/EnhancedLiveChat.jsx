import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, X, User, Bot } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import groqChatService from '../../services/groqChatService';
import usePortfolioData from '../../hooks/usePortfolioData'; // Nouveau hook

const EnhancedLiveChat = () => {
  const { t, currentLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Hook pour les données du portfolio (pour usage futur)
  // eslint-disable-next-line no-unused-vars
  const { 
    data: portfolioData, 
    loading: dataLoading, 
    error: dataError,
    dataSource,
    refresh: refreshData 
  } = usePortfolioData();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Message d'accueil personnalisé
      const welcomeMessage = groqChatService.getWelcomeMessage(currentLanguage);
      setMessages([{
        id: 1,
        text: welcomeMessage.text,
        sender: 'assistant',
        timestamp: new Date(),
        suggestions: welcomeMessage.suggestions
      }]);
    }
  }, [isOpen, currentLanguage, messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Obtenir la réponse de Groq API (gratuit) avec fallback local
      const response = await groqChatService.processMessage(inputMessage, currentLanguage);
      
      setTimeout(() => {
        const assistantMessage = {
          id: Date.now() + 1,
          text: response.text,
          sender: 'assistant',
          timestamp: new Date(),
          suggestions: response.suggestions,
          actions: response.actions,
          source: response.source
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 800); // Délai réaliste de frappe

    } catch (error) {
      console.error('Erreur assistant:', error);
      setIsTyping(false);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: t('chat.error', 'Désolé, je rencontre un problème technique. Pouvez-vous réessayer ?'),
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleActionClick = (action) => {
    if (action.type === 'scroll') {
      const element = document.getElementById(action.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Fermer le chat après navigation
        setTimeout(() => setIsOpen(false), 1000);
      }
    } else if (action.type === 'download') {
      // Déclencher téléchargement CV
      window.dispatchEvent(new CustomEvent('downloadCV'));
    } else if (action.type === 'contact') {
      // Aller à la section contact
      const contactElement = document.getElementById('contact');
      if (contactElement) {
        contactElement.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => setIsOpen(false), 1000);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
          aria-label={t('chat.toggle', 'Ouvrir le chat')}
        >
          {isOpen ? (
            <X size={24} className="transition-transform group-hover:rotate-90" />
          ) : (
            <MessageCircle size={24} className="transition-transform group-hover:scale-110" />
          )}
        </button>
      </div>

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl z-50 flex flex-col border border-slate-200 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-slate-700 text-white p-4 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">
                  Assistant Portfolio
                </h3>
                <p className="text-xs text-slate-300 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  En ligne • IA avancée
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-slate-700 text-white rounded-br-sm'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'assistant' && (
                        <Bot size={16} className="text-slate-600 mt-0.5 flex-shrink-0" />
                      )}
                      {message.sender === 'user' && (
                        <User size={16} className="text-white mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {message.text}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-6">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-full border border-slate-300 transition-all hover:scale-105"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {message.actions && message.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-6">
                    {message.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleActionClick(action)}
                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-full transition-all hover:scale-105 flex items-center gap-1"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Indicateur de frappe */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-2 shadow-sm">
                  <Bot size={16} className="text-slate-600" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-slate-500 ml-2">Assistant réfléchit...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('chat.placeholder', 'Posez-moi une question sur Sebbe...')}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm transition-all"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-300 text-white p-2 rounded-lg transition-all hover:scale-105 disabled:hover:scale-100"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="text-xs text-slate-500 mt-2 text-center">
              Assistant IA professionnel • Réponses sécurisées
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedLiveChat;