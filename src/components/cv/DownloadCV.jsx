// Composant pour télécharger le CV dynamique
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Eye, Database, Sparkles } from 'lucide-react';
import { useCVGenerator } from '../../hooks/useCVGenerator';
import { useTranslation } from '../../hooks/useTranslation';
import toast from 'react-hot-toast';

const DownloadCV = ({ variant = 'button', className = '' }) => {
  const { t } = useTranslation();
  const { 
    generateAndDownloadCV, 
    previewCV, 
    isGenerating, 
    fetchCVData,
    cvData,
    error 
  } = useCVGenerator();

  // Précharger les données CV au montage du composant
  useEffect(() => {
    if (!cvData) {
      fetchCVData().catch(console.error);
    }
  }, [cvData, fetchCVData]);

  const handleDownload = async () => {
    try {
      await generateAndDownloadCV(variant);
    } catch (error) {
      console.error('Erreur téléchargement CV:', error);
      toast.error('Erreur lors du téléchargement');
    }
  };

  const handlePreview = async () => {
    try {
      await previewCV();
    } catch (error) {
      console.error('Erreur aperçu CV:', error);
      toast.error('Erreur lors de l\'aperçu');
    }
  };

  if (variant === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 bg-white/5 backdrop-blur-sm border border-white/10 
                   rounded-xl hover:bg-white/10 transition-all duration-200 ${className}`}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Mon CV</h3>
            <p className="text-gray-400 text-sm">Fullstack Developer • React & Node.js</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <motion.button
            onClick={handleDownload}
            disabled={isGenerating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 
                     bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
                     transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent 
                            rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span className="font-medium">
              {isGenerating ? t('interface.loading', 'Génération...') : t('interface.download', 'Télécharger')}
            </span>
          </motion.button>
          
          <motion.button
            onClick={handlePreview}
            disabled={isGenerating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white 
                     rounded-lg transition-colors disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-500">
            <Database className="w-3 h-3" />
            <span>Généré depuis la DB</span>
          </div>
          <div className="text-gray-500">
            PDF • Mis à jour le {new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>
        
        {cvData && (
          <div className="mt-2 flex items-center gap-2 text-xs text-green-400">
            <Sparkles className="w-3 h-3" />
            <span>
              {cvData.experiences?.length || 0} expériences • 
              {cvData.skills?.length || 0} compétences • 
              {cvData.projects?.length || 0} projets
            </span>
          </div>
        )}
        
        {error && (
          <div className="mt-2 text-xs text-red-400">
            ⚠️ Mode fallback activé
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={handleDownload}
      disabled={isGenerating}
      data-download-cv="true"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 
                 text-white rounded-lg transition-all duration-200 font-medium
                 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isGenerating ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent 
                      rounded-full animate-spin" />
      ) : cvData ? (
        <div className="flex items-center gap-1">
          <Database className="w-3 h-3" />
          <Download className="w-4 h-4" />
        </div>
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span>
        {isGenerating ? t('interface.loading', 'Génération...') : 'CV'}
        {cvData && <span className="text-xs opacity-75 ml-1">DB</span>}
      </span>
    </motion.button>
  );
};

export default DownloadCV;