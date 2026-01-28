// Composant de test pour les traductions des témoignages
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Languages } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTestimonials } from '../hooks/useTestimonials';

const TestimonialsTranslationTest = () => {
  const { t, currentLanguage } = useTranslation();
  const { testimonials, loading } = useTestimonials(currentLanguage);

  if (loading) {
    return (
      <div className="bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const firstTestimonial = testimonials[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 max-w-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4 text-purple-400" />
        <Languages className="w-4 h-4 text-green-400" />
        <span className="text-sm font-semibold text-white">
          Test Traduction Témoignages
        </span>
      </div>
      
      {firstTestimonial ? (
        <div>
          <p className="text-xs text-gray-300 mb-2 italic">
            "{firstTestimonial.content.substring(0, 100)}..."
          </p>
          <div className="flex items-center gap-2">
            <img
              src={firstTestimonial.avatar}
              alt={firstTestimonial.name}
              className="w-6 h-6 rounded-full"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstTestimonial.name)}&background=7c3aed&color=fff&size=24`;
              }}
            />
            <div>
              <p className="text-xs font-medium text-white">{firstTestimonial.name}</p>
              <p className="text-xs text-gray-400">{firstTestimonial.role}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-purple-400">
            Langue: {currentLanguage.toUpperCase()}
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400">Aucun témoignage disponible</p>
      )}
    </motion.div>
  );
};

export default TestimonialsTranslationTest;