// Hook CV Generator sans fallback pour debug
import { useState, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { getCVData } from '../services/cvService';
import CVDocument from '../components/cv/CVGenerator';
import { useTranslation } from './useTranslation';
import toast from 'react-hot-toast';

export const useCVGeneratorDebug = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [cvData, setCvData] = useState(null);
  const [error, setError] = useState(null);
  const [debugLog, setDebugLog] = useState([]);
  const { currentLanguage } = useTranslation();

  const addLog = useCallback((message, type = 'info') => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      type
    };
    console.log(`[CV Debug ${type.toUpperCase()}]`, message);
    setDebugLog(prev => [...prev, logEntry]);
  }, []);

  const fetchCVData = useCallback(async (language = currentLanguage) => {
    try {
      setError(null);
      addLog('Début récupération données CV', 'info');
      
      const data = await getCVData(language);
      setCvData(data);
      
      addLog(`Données CV récupérées: ${data.experiences?.length || 0} exp, ${data.skills?.length || 0} skills, ${data.projects?.length || 0} projets`, 'success');
      return data;
    } catch (err) {
      addLog(`Erreur récupération CV: ${err.message}`, 'error');
      setError(err.message);
      throw err;
    }
  }, [currentLanguage, addLog]);

  const generatePDFDebug = useCallback(async (data) => {
    try {
      addLog('Début génération PDF', 'info');
      
      // Vérifier les données
      if (!data || !data.personalInfo) {
        throw new Error('Données CV invalides ou manquantes');
      }
      addLog('Données CV validées', 'success');

      // Créer le document
      addLog('Création du composant CVDocument', 'info');
      const doc = (
        <CVDocument 
          cvData={data} 
          language={data.language || 'fr'} 
          translations={data.translations} 
        />
      );
      addLog('Composant CVDocument créé', 'success');

      // Générer le PDF avec monitoring
      addLog('Début conversion PDF...', 'info');
      const startTime = Date.now();
      
      const blob = await pdf(doc).toBlob();
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      addLog(`PDF généré en ${duration}ms, taille: ${Math.round(blob.size / 1024)}KB`, 'success');

      if (!blob || blob.size === 0) {
        throw new Error('Blob PDF vide ou invalide');
      }

      if (blob.type !== 'application/pdf') {
        addLog(`Attention: type MIME inattendu: ${blob.type}`, 'warning');
      }

      return blob;

    } catch (error) {
      addLog(`Erreur génération PDF: ${error.message}`, 'error');
      throw error;
    }
  }, [addLog]);

  const generateAndDownloadCVDebug = useCallback(async (source = 'debug') => {
    if (isGenerating) {
      addLog('Génération déjà en cours', 'warning');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setDebugLog([]);

    try {
      addLog('=== DÉBUT DEBUG GÉNÉRATION CV ===', 'info');
      toast.loading('Génération CV debug...', { id: 'cv-debug' });

      // Récupérer les données
      let data = cvData;
      if (!data || data.language !== currentLanguage) {
        addLog('Récupération des données CV...', 'info');
        data = await fetchCVData(currentLanguage);
      } else {
        addLog('Utilisation des données en cache', 'info');
      }

      // Générer le PDF
      const blob = await generatePDFDebug(data);
      
      // Télécharger
      addLog('Création du lien de téléchargement', 'info');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `CV-Debug-${timestamp}-${Date.now()}.pdf`;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      addLog(`CV téléchargé: ${filename}`, 'success');
      addLog('=== FIN DEBUG GÉNÉRATION CV ===', 'info');
      
      toast.success('CV debug généré avec succès !', { id: 'cv-debug' });

      return { success: true, filename, debugLog };

    } catch (err) {
      addLog(`ERREUR FATALE: ${err.message}`, 'error');
      addLog(`Stack trace: ${err.stack}`, 'error');
      setError(err.message);
      
      toast.error(`Erreur debug: ${err.message}`, { id: 'cv-debug' });
      
      return { success: false, error: err.message, debugLog };
    } finally {
      setIsGenerating(false);
    }
  }, [cvData, isGenerating, fetchCVData, currentLanguage, generatePDFDebug, addLog]);

  const previewCVDebug = useCallback(async () => {
    if (isGenerating) {
      toast.error('Génération en cours, veuillez patienter...');
      return;
    }

    setIsGenerating(true);
    setDebugLog([]);
    
    try {
      addLog('=== DÉBUT DEBUG APERÇU CV ===', 'info');
      toast.loading('Génération aperçu debug...', { id: 'cv-preview-debug' });

      let data = cvData;
      if (!data || data.language !== currentLanguage) {
        addLog('Récupération des données pour aperçu...', 'info');
        data = await fetchCVData(currentLanguage);
      }

      const blob = await generatePDFDebug(data);
      const url = URL.createObjectURL(blob);
      
      addLog('Ouverture de l\'aperçu...', 'info');
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        throw new Error('Popup bloqué par le navigateur');
      }
      
      setTimeout(() => URL.revokeObjectURL(url), 30000);

      addLog('Aperçu ouvert avec succès', 'success');
      toast.success('Aperçu debug ouvert !', { id: 'cv-preview-debug' });

    } catch (err) {
      addLog(`Erreur aperçu: ${err.message}`, 'error');
      toast.error(`Erreur aperçu debug: ${err.message}`, { id: 'cv-preview-debug' });
    } finally {
      setIsGenerating(false);
    }
  }, [cvData, fetchCVData, currentLanguage, generatePDFDebug, isGenerating, addLog]);

  const clearDebugLog = useCallback(() => {
    setDebugLog([]);
    addLog('Log de debug vidé', 'info');
  }, [addLog]);

  return {
    // États
    isGenerating,
    cvData,
    error,
    debugLog,
    
    // Actions
    generateAndDownloadCVDebug,
    previewCVDebug,
    fetchCVData,
    clearDebugLog,
    
    // Utilitaires
    isReady: !!cvData && cvData.language === currentLanguage,
    hasError: !!error,
    logCount: debugLog.length
  };
};