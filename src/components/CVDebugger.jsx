// CVDebugger.jsx - Debug spécialisé pour identifier les problèmes de génération PDF
import React, { useState } from 'react';
import { Bug, Play, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { getCVData } from '../services/cvService';
import { pdf } from '@react-pdf/renderer';
import CVDocument from './CVGenerator';
import toast from 'react-hot-toast';

export default function CVDebugger() {
  const [debugResults, setDebugResults] = useState({});
  const [isDebugging, setIsDebugging] = useState(false);
  const [currentStep, setCurrentStep] = useState('');

  const debugSteps = [
    { id: 'data', name: 'Récupération données CV', description: 'Test de getCVData()' },
    { id: 'validation', name: 'Validation données', description: 'Vérification structure des données' },
    { id: 'component', name: 'Création composant PDF', description: 'Test de CVDocument' },
    { id: 'pdf', name: 'Génération PDF', description: 'Test de pdf().toBlob()' },
    { id: 'blob', name: 'Validation blob', description: 'Vérification du blob généré' }
  ];

  const runFullDebug = async () => {
    setIsDebugging(true);
    setDebugResults({});
    
    const results = {};

    try {
      // Étape 1: Récupération des données
      setCurrentStep('data');
      console.log('🔍 Debug Étape 1: Récupération données CV...');
      
      let cvData;
      try {
        cvData = await getCVData('fr');
        results.data = {
          status: 'success',
          message: 'Données récupérées avec succès',
          details: {
            hasPersonalInfo: !!cvData.personalInfo,
            experiencesCount: cvData.experiences?.length || 0,
            skillsCount: cvData.skills?.length || 0,
            projectsCount: cvData.projects?.length || 0,
            hasTranslations: !!cvData.translations,
            language: cvData.language
          }
        };
        console.log('✅ Données CV récupérées:', results.data.details);
      } catch (error) {
        results.data = {
          status: 'error',
          message: `Erreur récupération données: ${error.message}`,
          details: { error: error.stack }
        };
        console.error('❌ Erreur données:', error);
      }

      // Étape 2: Validation des données
      setCurrentStep('validation');
      console.log('🔍 Debug Étape 2: Validation données...');
      
      if (cvData) {
        const validation = validateCVData(cvData);
        results.validation = {
          status: validation.isValid ? 'success' : 'warning',
          message: validation.isValid ? 'Données valides' : 'Données partiellement valides',
          details: validation
        };
        console.log('✅ Validation:', validation);
      } else {
        results.validation = {
          status: 'error',
          message: 'Pas de données à valider',
          details: null
        };
      }

      // Étape 3: Création du composant PDF
      setCurrentStep('component');
      console.log('🔍 Debug Étape 3: Création composant PDF...');
      
      let pdfComponent;
      try {
        pdfComponent = (
          <CVDocument 
            cvData={cvData} 
            language={cvData.language || 'fr'} 
            translations={cvData.translations} 
          />
        );
        results.component = {
          status: 'success',
          message: 'Composant PDF créé',
          details: { componentType: typeof pdfComponent }
        };
        console.log('✅ Composant PDF créé');
      } catch (error) {
        results.component = {
          status: 'error',
          message: `Erreur création composant: ${error.message}`,
          details: { error: error.stack }
        };
        console.error('❌ Erreur composant:', error);
      }

      // Étape 4: Génération PDF
      setCurrentStep('pdf');
      console.log('🔍 Debug Étape 4: Génération PDF...');
      
      let blob;
      try {
        const startTime = Date.now();
        
        // Test avec timeout
        const pdfPromise = pdf(pdfComponent).toBlob();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout après 15 secondes')), 15000)
        );

        blob = await Promise.race([pdfPromise, timeoutPromise]);
        
        const endTime = Date.now();
        const duration = endTime - startTime;

        results.pdf = {
          status: 'success',
          message: `PDF généré en ${duration}ms`,
          details: { 
            duration,
            blobExists: !!blob,
            blobType: blob?.type,
            blobSize: blob?.size
          }
        };
        console.log('✅ PDF généré:', results.pdf.details);
      } catch (error) {
        results.pdf = {
          status: 'error',
          message: `Erreur génération PDF: ${error.message}`,
          details: { error: error.stack }
        };
        console.error('❌ Erreur PDF:', error);
      }

      // Étape 5: Validation du blob
      setCurrentStep('blob');
      console.log('🔍 Debug Étape 5: Validation blob...');
      
      if (blob) {
        const blobValidation = validateBlob(blob);
        results.blob = {
          status: blobValidation.isValid ? 'success' : 'error',
          message: blobValidation.message,
          details: blobValidation
        };
        console.log('✅ Validation blob:', blobValidation);
      } else {
        results.blob = {
          status: 'error',
          message: 'Pas de blob à valider',
          details: null
        };
      }

    } catch (globalError) {
      console.error('❌ Erreur globale debug:', globalError);
      results.global = {
        status: 'error',
        message: `Erreur globale: ${globalError.message}`,
        details: { error: globalError.stack }
      };
    }

    setDebugResults(results);
    setCurrentStep('');
    setIsDebugging(false);

    // Résumé
    const successCount = Object.values(results).filter(r => r.status === 'success').length;
    const totalSteps = debugSteps.length;
    
    if (successCount === totalSteps) {
      toast.success(`Debug terminé: ${successCount}/${totalSteps} étapes réussies`);
    } else {
      toast.error(`Debug terminé: ${successCount}/${totalSteps} étapes réussies`);
    }
  };

  const validateCVData = (data) => {
    const issues = [];
    let isValid = true;

    if (!data.personalInfo) {
      issues.push('personalInfo manquant');
      isValid = false;
    } else {
      if (!data.personalInfo.name) issues.push('personalInfo.name manquant');
      if (!data.personalInfo.title) issues.push('personalInfo.title manquant');
    }

    if (!data.experiences || !Array.isArray(data.experiences)) {
      issues.push('experiences manquant ou invalide');
      isValid = false;
    }

    if (!data.skills || !Array.isArray(data.skills)) {
      issues.push('skills manquant ou invalide');
      isValid = false;
    }

    if (!data.projects || !Array.isArray(data.projects)) {
      issues.push('projects manquant ou invalide');
      isValid = false;
    }

    if (!data.translations) {
      issues.push('translations manquant');
    }

    return {
      isValid,
      issues,
      dataStructure: {
        personalInfo: !!data.personalInfo,
        experiences: data.experiences?.length || 0,
        skills: data.skills?.length || 0,
        projects: data.projects?.length || 0,
        education: data.education?.length || 0,
        languages: data.languages?.length || 0,
        achievements: data.achievements?.length || 0
      }
    };
  };

  const validateBlob = (blob) => {
    const issues = [];
    let isValid = true;

    if (!blob) {
      return { isValid: false, message: 'Blob inexistant', issues: ['Blob null ou undefined'] };
    }

    if (blob.size === 0) {
      issues.push('Blob vide (taille 0)');
      isValid = false;
    }

    if (blob.type !== 'application/pdf') {
      issues.push(`Type MIME incorrect: ${blob.type} (attendu: application/pdf)`);
      isValid = false;
    }

    if (blob.size < 1000) {
      issues.push('Blob très petit (< 1KB), probablement invalide');
      isValid = false;
    }

    return {
      isValid,
      message: isValid ? 'Blob valide' : 'Blob invalide',
      issues,
      size: blob.size,
      sizeKB: Math.round(blob.size / 1024),
      type: blob.type
    };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'border-green-500/20 bg-green-500/5';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/5';
      case 'error':
        return 'border-red-500/20 bg-red-500/5';
      default:
        return 'border-gray-500/20 bg-gray-500/5';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Bug className="w-6 h-6 text-red-400" />
          Debugger CV PDF
        </h2>
        <p className="text-gray-400">Debug détaillé du processus de génération PDF</p>
      </div>

      {/* Contrôles */}
      <div className="flex justify-center">
        <button
          onClick={runFullDebug}
          disabled={isDebugging}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <Play className="w-4 h-4" />
          {isDebugging ? 'Debug en cours...' : 'Lancer le debug complet'}
        </button>
      </div>

      {/* Étape actuelle */}
      {isDebugging && currentStep && (
        <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-300 font-medium">
              Étape en cours: {debugSteps.find(s => s.id === currentStep)?.name}
            </span>
          </div>
          <p className="text-sm text-blue-200">
            {debugSteps.find(s => s.id === currentStep)?.description}
          </p>
        </div>
      )}

      {/* Résultats */}
      {Object.keys(debugResults).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Résultats du Debug</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {debugSteps.map((step) => {
              const result = debugResults[step.id];
              if (!result) return null;

              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <h4 className="font-semibold text-white">{step.name}</h4>
                      <p className="text-sm text-gray-400">{step.description}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-2">{result.message}</p>

                  {result.details && (
                    <div className="text-xs text-gray-400 bg-gray-800/50 p-3 rounded overflow-auto max-h-40">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Résumé global */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
            <h4 className="font-semibold text-white mb-2">Résumé</h4>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="text-lg font-bold text-green-400">
                  {Object.values(debugResults).filter(r => r.status === 'success').length}
                </div>
                <div className="text-gray-400">Succès</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-400">
                  {Object.values(debugResults).filter(r => r.status === 'warning').length}
                </div>
                <div className="text-gray-400">Avertissements</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-400">
                  {Object.values(debugResults).filter(r => r.status === 'error').length}
                </div>
                <div className="text-gray-400">Erreurs</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}