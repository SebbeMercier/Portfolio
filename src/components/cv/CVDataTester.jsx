// CVDataTester.jsx - Test simple pour vérifier les données CV
import React, { useState } from 'react';
import { Database, Play, Eye } from 'lucide-react';
import { getCVData } from '../../services/cvService';
import toast from 'react-hot-toast';

export default function CVDataTester() {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const testCVData = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      console.log('🧪 Test récupération données CV...');
      toast.loading('Test des données CV...', { id: 'cv-data-test' });

      const data = await getCVData('fr');
      
      console.log('📊 Données CV brutes:', data);

      const result = {
        success: true,
        data,
        structure: {
          hasPersonalInfo: !!data.personalInfo,
          hasPersonal_info: !!data.personal_info,
          hasExperiences: !!data.experiences,
          hasSkills: !!data.skills,
          hasProjects: !!data.projects,
          hasEducation: !!data.education,
          hasLanguages: !!data.languages,
          hasAchievements: !!data.achievements,
          hasTranslations: !!data.translations,
          language: data.language
        },
        counts: {
          experiences: data.experiences?.length || 0,
          skills: data.skills?.length || 0,
          projects: data.projects?.length || 0,
          education: data.education?.length || 0,
          languages: data.languages?.length || 0,
          achievements: data.achievements?.length || 0
        },
        personalInfoKeys: data.personalInfo ? Object.keys(data.personalInfo) : [],
        personal_infoKeys: data.personal_info ? Object.keys(data.personal_info) : [],
        topLevelKeys: Object.keys(data)
      };

      setTestResult(result);
      toast.success('Données CV récupérées !', { id: 'cv-data-test' });

    } catch (error) {
      console.error('❌ Erreur test données CV:', error);
      
      const result = {
        success: false,
        error: error.message,
        stack: error.stack
      };

      setTestResult(result);
      toast.error(`Erreur: ${error.message}`, { id: 'cv-data-test' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Test Données CV</h3>
      </div>
      
      <p className="text-gray-400 mb-6">
        Test de récupération et validation de la structure des données CV.
      </p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={testCVData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          Tester les données CV
        </button>
      </div>

      {testResult && (
        <div className="space-y-4">
          {testResult.success ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h4 className="text-green-300 font-semibold mb-3">✅ Données récupérées avec succès</h4>
              
              {/* Structure des données */}
              <div className="mb-4">
                <h5 className="text-white font-medium mb-2">Structure détectée :</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(testResult.structure).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-300">{key}:</span>
                      <span className={value ? 'text-green-400' : 'text-red-400'}>
                        {value ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compteurs */}
              <div className="mb-4">
                <h5 className="text-white font-medium mb-2">Nombre d'éléments :</h5>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {Object.entries(testResult.counts).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-300">{key}:</span>
                      <span className="text-white font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clés de niveau supérieur */}
              <div className="mb-4">
                <h5 className="text-white font-medium mb-2">Clés principales :</h5>
                <div className="flex flex-wrap gap-1">
                  {testResult.topLevelKeys.map(key => (
                    <span key={key} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                      {key}
                    </span>
                  ))}
                </div>
              </div>

              {/* Clés personalInfo */}
              {testResult.personalInfoKeys.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-white font-medium mb-2">Clés personalInfo (camelCase) :</h5>
                  <div className="flex flex-wrap gap-1">
                    {testResult.personalInfoKeys.map(key => (
                      <span key={key} className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Clés personal_info */}
              {testResult.personal_infoKeys.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-white font-medium mb-2">Clés personal_info (snake_case) :</h5>
                  <div className="flex flex-wrap gap-1">
                    {testResult.personal_infoKeys.map(key => (
                      <span key={key} className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs">
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Données brutes (tronquées) */}
              <div>
                <h5 className="text-white font-medium mb-2">Aperçu des données :</h5>
                <div className="bg-gray-900/50 p-3 rounded text-xs text-gray-300 overflow-auto max-h-40">
                  <pre>{JSON.stringify(testResult.data, null, 2).substring(0, 1000)}...</pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <h4 className="text-red-300 font-semibold mb-3">❌ Erreur lors du test</h4>
              <p className="text-red-200 mb-2">{testResult.error}</p>
              {testResult.stack && (
                <div className="bg-gray-900/50 p-3 rounded text-xs text-gray-300 overflow-auto max-h-40">
                  <pre>{testResult.stack}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}