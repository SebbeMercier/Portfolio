// Hook pour la génération et téléchargement de CV dynamique (AMÉLIORÉ)
import { useState, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { getCVData, trackCVDownload } from '../services/cvService';
import CVDocument from '../components/CVGenerator';
import { useAnalytics } from './useAnalytics';
import { useTranslation } from './useTranslation';
import toast from 'react-hot-toast';

export const useCVGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [cvData, setCvData] = useState(null);
  const [error, setError] = useState(null);
  const { visitorId, trackEvent } = useAnalytics();
  const { currentLanguage } = useTranslation();

  // Récupérer les données CV
  const fetchCVData = useCallback(async (language = currentLanguage) => {
    try {
      setError(null);
      console.log('📊 Récupération des données CV...');
      
      const data = await getCVData(language);
      setCvData(data);
      
      console.log('✅ Données CV chargées:', {
        experiences: data.experiences?.length || 0,
        skills: data.skills?.length || 0,
        projects: data.projects?.length || 0
      });
      return data;
    } catch (err) {
      console.error('❌ Erreur récupération CV:', err);
      setError(err.message);
      throw err;
    }
  }, [currentLanguage]);

  // Générer le PDF avec gestion d'erreurs améliorée
  const generatePDF = useCallback(async (data) => {
    try {
      console.log('📄 Génération du document PDF...', {
        timestamp: new Date().toISOString(),
        dataValidation: {
          hasData: !!data,
          hasPersonalInfo: !!data?.personalInfo,
          personalInfoKeys: data?.personalInfo ? Object.keys(data.personalInfo) : [],
          experiencesCount: data?.experiences?.length || 0,
          skillsCount: data?.skills?.length || 0,
          projectsCount: data?.projects?.length || 0
        }
      });
      
      // Vérifier que les données sont valides
      if (!data || !data.personalInfo) {
        const errorMsg = 'Données CV invalides ou manquantes';
        console.error('❌', errorMsg, { data });
        throw new Error(errorMsg);
      }

      console.log('✅ Validation des données réussie');

      // Créer le document PDF
      console.log('🏗️ Création du composant React-PDF...');
      const doc = (
        <CVDocument 
          cvData={data} 
          language={data.language || 'fr'} 
          translations={data.translations} 
        />
      );

      console.log('🔄 Conversion en blob avec React-PDF...');
      
      // Générer le blob avec timeout
      const pdfPromise = pdf(doc).toBlob();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout génération PDF (30s)')), 30000)
      );

      const startTime = Date.now();
      const blob = await Promise.race([pdfPromise, timeoutPromise]);
      const generationTime = Date.now() - startTime;
      
      if (!blob || blob.size === 0) {
        const errorMsg = 'Blob PDF vide ou invalide';
        console.error('❌', errorMsg, { blob });
        throw new Error(errorMsg);
      }

      console.log('✅ PDF généré avec succès:', {
        size: `${Math.round(blob.size / 1024)}KB`,
        type: blob.type,
        generationTime: `${generationTime}ms`,
        isValidBlob: blob instanceof Blob,
        blobConstructor: blob.constructor.name
      });

      return blob;

    } catch (error) {
      console.error('❌ Erreur génération PDF:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        timestamp: new Date().toISOString()
      });
      throw new Error(`Erreur génération PDF: ${error.message}`);
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
      console.log('🚀 Début génération CV PDF...', { source, timestamp: new Date().toISOString() });
      toast.loading('Génération du CV en cours...', { id: 'cv-generation' });

      // Récupérer les données si pas déjà fait
      let data = cvData;
      if (!data || data.language !== currentLanguage) {
        console.log('📊 Récupération des données CV...');
        data = await fetchCVData(currentLanguage);
      }

      console.log('📄 Données CV pour génération:', {
        hasPersonalInfo: !!data.personalInfo,
        experiences: data.experiences?.length || 0,
        skills: data.skills?.length || 0,
        projects: data.projects?.length || 0,
        language: data.language
      });

      // Générer le PDF
      console.log('🔄 Début génération PDF avec React-PDF...');
      const blob = await generatePDF(data);
      
      console.log('💾 Téléchargement du fichier...', {
        blobSize: blob.size,
        blobType: blob.type
      });
      
      // Créer le lien de téléchargement
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Nom du fichier avec timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `CV-Sebbe-Mercier-${timestamp}.pdf`;
      link.download = filename;
      
      console.log('🔗 Création du lien de téléchargement:', {
        url: url.substring(0, 50) + '...',
        filename,
        linkCreated: !!link
      });
      
      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('✅ Téléchargement déclenché avec succès');
      
      // Nettoyer l'URL après un délai
      setTimeout(() => {
        URL.revokeObjectURL(url);
        console.log('🧹 URL blob nettoyée');
      }, 1000);

      // Tracker le téléchargement
      try {
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
        console.log('📊 Téléchargement tracké avec succès');
      } catch (trackError) {
        console.warn('⚠️ Erreur tracking:', trackError);
      }

      toast.success('CV téléchargé avec succès ! 📄', { id: 'cv-generation' });
      console.log('✅ CV généré et téléchargé avec succès');

      return { success: true, filename };

    } catch (err) {
      console.error('❌ Erreur génération CV:', err);
      console.error('Stack trace:', err.stack);
      setError(err.message);
      
      toast.error(`Erreur génération CV: ${err.message}`, { id: 'cv-generation' });
      
      return { success: false, error: err.message };
    } finally {
      setIsGenerating(false);
    }
  }, [cvData, isGenerating, visitorId, trackEvent, fetchCVData, currentLanguage, generatePDF]);

  // Prévisualiser le CV (ouvrir dans un nouvel onglet)
  const previewCV = useCallback(async () => {
    if (isGenerating) {
      toast.error('Génération en cours, veuillez patienter...');
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('👁️ Génération aperçu CV...', { timestamp: new Date().toISOString() });
      toast.loading('Génération de l\'aperçu...', { id: 'cv-preview' });

      let data = cvData;
      if (!data || data.language !== currentLanguage) {
        console.log('📊 Récupération des données pour aperçu...');
        data = await fetchCVData(currentLanguage);
      }

      console.log('📄 Données CV pour aperçu:', {
        hasPersonalInfo: !!data.personalInfo,
        experiences: data.experiences?.length || 0,
        skills: data.skills?.length || 0,
        projects: data.projects?.length || 0
      });

      // Générer le PDF
      console.log('🔄 Génération PDF pour aperçu...');
      const blob = await generatePDF(data);
      const url = URL.createObjectURL(blob);
      
      console.log('🔗 Ouverture de l\'aperçu...', {
        blobSize: blob.size,
        url: url.substring(0, 50) + '...'
      });
      
      // Ouvrir dans un nouvel onglet
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        throw new Error('Popup bloqué par le navigateur');
      }
      
      console.log('✅ Aperçu ouvert dans nouvel onglet');
      
      // Nettoyer après un délai
      setTimeout(() => {
        URL.revokeObjectURL(url);
        console.log('🧹 URL aperçu nettoyée');
      }, 30000);

      try {
        trackEvent('cv_previewed', { source: 'preview_button' });
        console.log('📊 Aperçu tracké');
      } catch (trackError) {
        console.warn('⚠️ Erreur tracking aperçu:', trackError);
      }

      toast.success('Aperçu ouvert !', { id: 'cv-preview' });

    } catch (err) {
      console.error('❌ Erreur aperçu CV:', err);
      console.error('Stack trace:', err.stack);
      toast.error(`Erreur aperçu: ${err.message}`, { id: 'cv-preview' });
    } finally {
      setIsGenerating(false);
    }
  }, [cvData, trackEvent, fetchCVData, currentLanguage, generatePDF, isGenerating]);

  // Obtenir les données CV sans télécharger
  const getCVDataOnly = useCallback(async () => {
    if (cvData && cvData.language === currentLanguage) return cvData;
    return await fetchCVData();
  }, [cvData, fetchCVData, currentLanguage]);

  // Vérifier si le système est prêt
  const checkSystemReady = useCallback(async () => {
    try {
      const data = await getCVDataOnly();
      return {
        ready: true,
        dataPoints: {
          experiences: data.experiences?.length || 0,
          skills: data.skills?.length || 0,
          projects: data.projects?.length || 0
        }
      };
    } catch (err) {
      return {
        ready: false,
        error: err.message
      };
    }
  }, [getCVDataOnly]);

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
    checkSystemReady,
    
    // Utilitaires
    isReady: !!cvData && cvData.language === currentLanguage,
    hasError: !!error,
    dataStats: cvData ? {
      experiences: cvData.experiences?.length || 0,
      skills: cvData.skills?.length || 0,
      projects: cvData.projects?.length || 0
    } : null
  };
};