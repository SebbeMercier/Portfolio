// Composant de démonstration pour les traductions
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Sparkles } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageSelector from './LanguageSelector';

const LanguageDemo = () => {
  const { t, currentLanguage } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Globe className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              {t('interface.languageDemo', 'Système Multilingue')}
            </h3>
            <p className="text-xs text-gray-400">
              {t('interface.currentLang', 'Langue actuelle')}: <span className="text-purple-400">{currentLanguage.toUpperCase()}</span>
            </p>
          </div>
        </div>
        
        <LanguageSelector />
        
        <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
          <Sparkles className="w-3 h-3" />
          <span>{t('interface.realTimeTranslation', 'Traduction en temps réel')}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LanguageDemo;