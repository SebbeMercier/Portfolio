// Test direct pour vérifier la génération CV
import React, { useState } from 'react';
import { useCVGenerator } from '../../hooks/useCVGenerator';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Download, Eye, AlertCircle, CheckCircle } from 'lucide-react';

const CVTestDirect = () => {
  const { 
    generateAndDownloadCV, 
    previewCV, 
    fetchCVData,
    cvData,
    isGenerating,
    error 
  } = useCVGenerator();

  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, success, message) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testFetchData = async () => {
    try {
      addTestResult('Fetch Data', false, 'Démarrage...');
      const data = await fetchCVData();
      addTestResult('Fetch Data', true, `Données récupérées: ${data.experiences?.length || 0} exp, ${data.skills?.length || 0} skills`);
    } catch (err) {
      addTestResult('Fetch Data', false, `Erreur: ${err.message}`);
    }
  };

  const testPreview = async () => {
    try {
      addTestResult('Preview', false, 'Génération aperçu...');
      await previewCV();
      addTestResult('Preview', true, 'Aperçu généré avec succès');
    } catch (err) {
      addTestResult('Preview', false, `Erreur aperçu: ${err.message}`);
    }
  };

  const testDownload = async () => {
    try {
      addTestResult('Download', false, 'Génération téléchargement...');
      const result = await generateAndDownloadCV('test-direct');
      addTestResult('Download', result.success, result.success ? 'Téléchargement réussi' : `Erreur: ${result.error}`);
    } catch (err) {
      addTestResult('Download', false, `Erreur téléchargement: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Test Direct CV Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* État actuel */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-lg">
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${cvData ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <p className="text-sm text-gray-300">Données CV</p>
              <p className="text-xs text-gray-400">{cvData ? 'Chargées' : 'Non chargées'}</p>
            </div>
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${isGenerating ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
              <p className="text-sm text-gray-300">Génération</p>
              <p className="text-xs text-gray-400">{isGenerating ? 'En cours' : 'Inactive'}</p>
            </div>
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${error ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <p className="text-sm text-gray-300">Erreurs</p>
              <p className="text-xs text-gray-400">{error ? 'Présentes' : 'Aucune'}</p>
            </div>
          </div>

          {/* Boutons de test */}
          <div className="grid grid-cols-3 gap-4">
            <Button
              onClick={testFetchData}
              disabled={isGenerating}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Test Fetch Data
            </Button>
            <Button
              onClick={testPreview}
              disabled={isGenerating || !cvData}
              className="bg-purple-500 hover:bg-purple-600"
            >
              <Eye className="w-4 h-4 mr-2" />
              Test Aperçu
            </Button>
            <Button
              onClick={testDownload}
              disabled={isGenerating || !cvData}
              className="bg-green-500 hover:bg-green-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Test Téléchargement
            </Button>
          </div>

          {/* Résultats des tests */}
          {testResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Résultats des Tests</h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg flex items-start gap-3 ${
                      result.success ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
                    }`}
                  >
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className={`font-medium ${result.success ? 'text-green-300' : 'text-red-300'}`}>
                          {result.test}
                        </span>
                        <span className="text-xs text-gray-400">{result.timestamp}</span>
                      </div>
                      <p className={`text-sm mt-1 ${result.success ? 'text-green-200' : 'text-red-200'}`}>
                        {result.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informations de debug */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h4 className="text-red-300 font-medium mb-2">Erreur Actuelle:</h4>
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {cvData && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-blue-300 font-medium mb-2">Données CV Disponibles:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-200">Expériences:</span>
                  <span className="text-white ml-2">{cvData.experiences?.length || 0}</span>
                </div>
                <div>
                  <span className="text-blue-200">Compétences:</span>
                  <span className="text-white ml-2">{cvData.skills?.length || 0}</span>
                </div>
                <div>
                  <span className="text-blue-200">Projets:</span>
                  <span className="text-white ml-2">{cvData.projects?.length || 0}</span>
                </div>
                <div>
                  <span className="text-blue-200">Langue:</span>
                  <span className="text-white ml-2">{cvData.language || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CVTestDirect;