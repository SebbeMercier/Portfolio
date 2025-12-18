// Hook pour la génération et téléchargement de CV dynamique
import { useState, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { getCVData, trackCVDownload } from '../services/cvService';
import CVDocument from '../components/CVGenerator';
import { useAnalytics } from './useAnalytics';
import toast from 'react-hot-toast';

export const useCVGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [cvData, setCvData] = useState(null);
  const [error, setError] = useState(null);
  const { visitorId, trackEvent } = useAnalytics();

  // Récupérer les données CV
  const fetchCVData = useCallback(async () => {
    try {
      setError(null);
      console.log('📊 Récupération des données CV...');
      
      const data = await getCVData();
      setCvData(data);
      
      console.log('✅ Données CV chargées');
      return data;
    } catch (err) {
      console.error('❌ Erreur récupération CV:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Générer et télécharger le PDF
  const generateAndDownloadCV = useCallback(async (source = 'manual') => {
    if (isGenerating) {
      console.log('⏳ Génération déjà en cours...');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log('🚀 Début génération CV PDF...');
      toast.loading('Génération du CV en cours...', { id: 'cv-generation' });

      // Récupérer les données si pas déjà fait
      let data = cvData;
      if (!data) {
        data = await fetchCVData();
      }

      console.log('📄 Génération du document PDF...');
      
      // Générer le PDF avec React-PDF
      const blob = await pdf(<CVDocument cvData={data} />).toBlob();
      
      console.log('💾 Téléchargement du fichier...');
      
      // Créer le lien de téléchargement
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Nom du fichier avec timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      link.download = `CV-Sebbe-Mercier-${timestamp}.pdf`;
      
      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Nettoyer l'URL
      URL.revokeObjectURL(url);

      // Tracker le téléchargement
      await trackCVDownload(visitorId, source);
      trackEvent('cv_downloaded', {
        source,
        format: 'pdf',
        generated_from_db: true,
        data_points: {
          experiences: data.experiences?.length || 0,
          skills: data.skills?.length || 0,
          projects: data.projects?.length || 0
        }
      });

      toast.success('CV téléchargé avec succès ! 📄', { id: 'cv-generation' });
      console.log('✅ CV généré et téléchargé avec succès');

      return { success: true, filename: link.download };

    } catch (err) {
      console.error('❌ Erreur génération CV:', err);
      setError(err.message);
      
      toast.error('Erreur lors de la génération du CV', { id: 'cv-generation' });
      
      // Fallback vers le CV statique
      console.log('🔄 Fallback vers CV statique...');
      const fallbackLink = document.createElement('a');
      fallbackLink.href = '/cv-sebbe-mercier.pdf';
      fallbackLink.download = 'CV-Sebbe-Mercier-Fallback.pdf';
      fallbackLink.target = '_blank';
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
      
      toast.success('CV de secours téléchargé', { id: 'cv-generation' });
      
      return { success: false, error: err.message, fallback: true };
    } finally {
      setIsGenerating(false);
    }
  }, [cvData, isGenerating, visitorId, trackEvent, fetchCVData]);

  // Prévisualiser le CV (ouvrir dans un nouvel onglet)
  const previewCV = useCallback(async () => {
    try {
      console.log('👁️ Génération aperçu CV...');
      toast.loading('Génération de l\'aperçu...', { id: 'cv-preview' });

      let data = cvData;
      if (!data) {
        data = await fetchCVData();
      }

      const blob = await pdf(<CVDocument cvData={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      
      // Ouvrir dans un nouvel onglet
      window.open(url, '_blank');
      
      // Nettoyer après un délai
      setTimeout(() => URL.revokeObjectURL(url), 10000);

      trackEvent('cv_previewed', { source: 'preview_button' });
      toast.success('Aperçu ouvert !', { id: 'cv-preview' });

    } catch (err) {
      console.error('❌ Erreur aperçu CV:', err);
      toast.error('Erreur lors de l\'aperçu', { id: 'cv-preview' });
      
      // Fallback
      window.open('/cv-sebbe-mercier.pdf', '_blank');
    }
  }, [cvData, trackEvent, fetchCVData]);

  // Obtenir les données CV sans télécharger
  const getCVDataOnly = useCallback(async () => {
    if (cvData) return cvData;
    return await fetchCVData();
  }, [cvData, fetchCVData]);

  return {
    // États
    isGenerating,
    cvData,
    error,
    
    // Actions
    generateAndDownloadCV,
    previewCV,
    fetchCVData,
    getCVDataOnly,
    
    // Utilitaires
    isReady: !!cvData,
    hasError: !!error
  };
};