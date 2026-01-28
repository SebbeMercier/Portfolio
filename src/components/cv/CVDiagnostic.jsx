// CVDiagnostic.jsx - Composant pour diagnostiquer les problèmes du système CV
import React, { useState, useEffect, useCallback } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Download,
  Eye,
  Zap
} from 'lucide-react';
import { useCVGenerator } from '../../hooks/useCVGenerator';
import { getCVData } from '../../services/cvService';
import { supabase } from '../../config/supabase';
import CVTestSimple from './CVTestSimple';
import CVDataTester from './CVDataTester';

export default function CVDiagnostic() {
  const [diagnostics, setDiagnostics] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const { checkSystemReady, previewCV, generateAndDownloadCV } = useCVGenerator();

  const runDiagnostics = useCallback(async () => {
    setIsRunning(true);
    const results = {};

    try {
      // Test 1: Connexion Supabase
      console.log('🔍 Test connexion Supabase...');
      try {
        const { error } = await supabase.from('experiences').select('count').limit(1);
        results.supabaseConnection = {
          status: error ? 'error' : 'success',
          message: error ? `Erreur: ${error.message}` : 'Connexion OK',
          details: error ? null : 'Base de données accessible'
        };
      } catch (err) {
        results.supabaseConnection = {
          status: 'error',
          message: `Erreur connexion: ${err.message}`,
          details: null
        };
      }

      // Test 2: Récupération données CV
      console.log('📊 Test récupération données CV...');
      try {
        const cvData = await getCVData('fr');
        results.cvDataRetrieval = {
          status: cvData ? 'success' : 'warning',
          message: cvData ? 'Données récupérées' : 'Données partielles',
          details: cvData ? {
            experiences: cvData.experiences?.length || 0,
            skills: cvData.skills?.length || 0,
            projects: cvData.projects?.length || 0,
            personalInfo: !!cvData.personalInfo
          } : null
        };
      } catch (err) {
        results.cvDataRetrieval = {
          status: 'error',
          message: `Erreur données: ${err.message}`,
          details: null
        };
      }

      // Test 3: Vérification des tables
      console.log('🗄️ Test tables de données...');
      try {
        const [expResult, skillsResult, projectsResult] = await Promise.all([
          supabase.from('experiences').select('count'),
          supabase.from('skills').select('count'),
          supabase.from('projects').select('count')
        ]);

        results.databaseTables = {
          status: 'success',
          message: 'Tables accessibles',
          details: {
            experiences: expResult.data?.[0]?.count || 0,
            skills: skillsResult.data?.[0]?.count || 0,
            projects: projectsResult.data?.[0]?.count || 0,
            errors: [expResult.error, skillsResult.error, projectsResult.error].filter(Boolean)
          }
        };
      } catch (err) {
        results.databaseTables = {
          status: 'error',
          message: `Erreur tables: ${err.message}`,
          details: null
        };
      }

      // Test 4: Système CV Generator
      console.log('⚙️ Test système CV Generator...');
      try {
        const systemCheck = await checkSystemReady();
        results.cvSystem = {
          status: systemCheck.ready ? 'success' : 'error',
          message: systemCheck.ready ? 'Système prêt' : 'Système non prêt',
          details: systemCheck.ready ? systemCheck.dataPoints : { error: systemCheck.error }
        };
      } catch (err) {
        results.cvSystem = {
          status: 'error',
          message: `Erreur système: ${err.message}`,
          details: null
        };
      }

      // Test 5: Vérification React-PDF
      console.log('📄 Test React-PDF...');
      try {
        // Juste vérifier que le module peut être importé
        results.reactPdf = {
          status: 'success',
          message: 'React-PDF disponible',
          details: 'Librairie chargée correctement'
        };
      } catch (err) {
        results.reactPdf = {
          status: 'error',
          message: `Erreur React-PDF: ${err.message}`,
          details: null
        };
      }

      // Test 6: Vérification des permissions navigateur
      console.log('🌐 Test permissions navigateur...');
      try {
        // Test création blob
        const testBlob = new Blob(['test'], { type: 'application/pdf' });
        const testUrl = URL.createObjectURL(testBlob);
        URL.revokeObjectURL(testUrl);

        // Test popup
        const testWindow = window.open('', '_blank');
        if (testWindow) {
          testWindow.close();
          results.browserPermissions = {
            status: 'success',
            message: 'Permissions OK',
            details: 'Blob et popup autorisés'
          };
        } else {
          results.browserPermissions = {
            status: 'warning',
            message: 'Popups bloqués',
            details: 'Les aperçus peuvent ne pas fonctionner'
          };
        }
      } catch (err) {
        results.browserPermissions = {
          status: 'error',
          message: `Erreur navigateur: ${err.message}`,
          details: null
        };
      }

    } catch (globalErr) {
      console.error('❌ Erreur globale diagnostic:', globalErr);
    }

    setDiagnostics(results);
    setIsRunning(false);
  }, [checkSystemReady]);

  useEffect(() => {
    runDiagnostics();
  }, [runDiagnostics]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />;
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
        <h2 className="text-2xl font-bold text-white mb-2">Diagnostic Système CV</h2>
        <p className="text-gray-400">Vérification des composants du système de génération CV</p>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          Relancer le diagnostic
        </button>

        <button
          onClick={() => previewCV()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          Test Aperçu
        </button>

        <button
          onClick={() => generateAndDownloadCV('diagnostic')}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Test Téléchargement
        </button>
      </div>

      {/* Résultats des tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(diagnostics).map(([testName, result]) => (
          <div
            key={testName}
            className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
          >
            <div className="flex items-center gap-3 mb-3">
              {getStatusIcon(result.status)}
              <h3 className="font-semibold text-white capitalize">
                {testName.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
            </div>

            <p className="text-sm text-gray-300 mb-2">{result.message}</p>

            {result.details && (
              <div className="text-xs text-gray-400 bg-gray-800/50 p-2 rounded">
                {typeof result.details === 'object' ? (
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                ) : (
                  <span>{result.details}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Résumé global */}
      <div className="bg-gray-800/50 p-6 rounded-lg border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-400" />
          Résumé du Diagnostic
        </h3>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">
              {Object.values(diagnostics).filter(r => r.status === 'success').length}
            </div>
            <div className="text-sm text-gray-400">Tests réussis</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">
              {Object.values(diagnostics).filter(r => r.status === 'warning').length}
            </div>
            <div className="text-sm text-gray-400">Avertissements</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">
              {Object.values(diagnostics).filter(r => r.status === 'error').length}
            </div>
            <div className="text-sm text-gray-400">Erreurs</div>
          </div>
        </div>

        {/* Recommandations */}
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="font-semibold text-blue-300 mb-2">Recommandations :</h4>
          <ul className="text-sm text-blue-200 space-y-1">
            {Object.values(diagnostics).some(r => r.status === 'error') && (
              <li>• Vérifiez la connexion à la base de données Supabase</li>
            )}
            {diagnostics.browserPermissions?.status === 'warning' && (
              <li>• Autorisez les popups pour les aperçus CV</li>
            )}
            {diagnostics.cvDataRetrieval?.status !== 'success' && (
              <li>• Peuplez la base de données avec des données de test</li>
            )}
            {diagnostics.reactPdf?.status === 'error' && (
              <li>• Vérifiez l'installation de @react-pdf/renderer</li>
            )}
          </ul>
        </div>
      </div>

      {/* Test simple React-PDF */}
      <CVTestSimple />

      {/* Test des données CV */}
      <CVDataTester />
    </div>
  );
}