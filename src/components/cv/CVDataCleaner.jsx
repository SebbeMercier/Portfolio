// Composant pour nettoyer et vérifier les données CV
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AlertCircle, CheckCircle, Trash2, RefreshCw, Eye } from 'lucide-react';
import { getCVDataFromTable, saveCVDataToTable, initializeCVData } from '../../services/cvDataService';
import toast from 'react-hot-toast';

const CVDataCleaner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const analyzeData = (data) => {
    const issues = [];
    const warnings = [];

    // Vérifier les informations personnelles
    if (!data.personal_info && !data.personalInfo) {
      issues.push('Informations personnelles manquantes');
    } else {
      const personalInfo = data.personal_info || data.personalInfo;
      if (!personalInfo.name || personalInfo.name.includes('trou du cul') || personalInfo.name.includes('test')) {
        issues.push('Nom inapproprié ou de test détecté');
      }
      if (!personalInfo.title || personalInfo.title.includes('test')) {
        warnings.push('Titre professionnel manquant ou de test');
      }
      if (!personalInfo.summary || personalInfo.summary.includes('test')) {
        warnings.push('Résumé manquant ou de test');
      }
    }

    // Vérifier les expériences
    if (!data.experiences || data.experiences.length === 0) {
      warnings.push('Aucune expérience professionnelle');
    } else {
      data.experiences.forEach((exp, index) => {
        if (!exp.title || exp.title.includes('test') || exp.title.includes('trou du cul')) {
          issues.push(`Expérience ${index + 1}: titre inapproprié`);
        }
        if (!exp.company || exp.company.includes('test')) {
          warnings.push(`Expérience ${index + 1}: entreprise manquante ou de test`);
        }
        if (!exp.description || exp.description.includes('test') || exp.description.includes('trou du cul')) {
          issues.push(`Expérience ${index + 1}: description inappropriée`);
        }
      });
    }

    // Vérifier les compétences
    if (!data.skills || data.skills.length === 0) {
      warnings.push('Aucune compétence définie');
    } else {
      data.skills.forEach((skill, index) => {
        if (!skill.name || skill.name.includes('test') || skill.name.includes('trou du cul')) {
          issues.push(`Compétence ${index + 1}: nom inapproprié`);
        }
      });
    }

    // Vérifier les projets
    if (!data.projects || data.projects.length === 0) {
      warnings.push('Aucun projet défini');
    } else {
      data.projects.forEach((project, index) => {
        if (!project.title || project.title.includes('test') || project.title.includes('trou du cul')) {
          issues.push(`Projet ${index + 1}: titre inapproprié`);
        }
        if (!project.description || project.description.includes('test') || project.description.includes('trou du cul')) {
          issues.push(`Projet ${index + 1}: description inappropriée`);
        }
      });
    }

    return { issues, warnings };
  };

  const loadCurrentData = async () => {
    setIsLoading(true);
    try {
      const data = await getCVDataFromTable();
      setCurrentData(data);
      const analysisResult = analyzeData(data);
      setAnalysis(analysisResult);
      
      if (analysisResult.issues.length > 0) {
        toast.error(`${analysisResult.issues.length} problème(s) détecté(s) dans les données CV`);
      } else if (analysisResult.warnings.length > 0) {
        toast.success(`Données CV chargées avec ${analysisResult.warnings.length} avertissement(s)`);
      } else {
        toast.success('Données CV chargées - Aucun problème détecté');
      }
    } catch (error) {
      toast.error(`Erreur chargement: ${error.message}`);
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cleanData = (data) => {
    const cleanedData = JSON.parse(JSON.stringify(data)); // Deep copy

    // Nettoyer les informations personnelles
    if (cleanedData.personal_info || cleanedData.personalInfo) {
      const personalInfo = cleanedData.personal_info || cleanedData.personalInfo;
      
      if (personalInfo.name && (personalInfo.name.includes('trou du cul') || personalInfo.name.includes('test'))) {
        personalInfo.name = 'Sebbe Mercier';
      }
      if (personalInfo.title && personalInfo.title.includes('test')) {
        personalInfo.title = 'Développeur Full Stack • React & Node.js';
      }
      if (personalInfo.summary && (personalInfo.summary.includes('test') || personalInfo.summary.includes('trou du cul'))) {
        personalInfo.summary = 'Développeur Full Stack passionné avec une expertise en React, Node.js et TypeScript. Spécialisé dans la création d\'applications web modernes et performantes.';
      }
      
      // Normaliser la structure
      cleanedData.personalInfo = personalInfo;
      if (cleanedData.personal_info) {
        delete cleanedData.personal_info;
      }
    }

    // Nettoyer les expériences
    if (cleanedData.experiences) {
      cleanedData.experiences = cleanedData.experiences.filter(exp => {
        if (!exp.title || exp.title.includes('trou du cul')) return false;
        if (!exp.company || exp.company.includes('trou du cul')) return false;
        if (!exp.description || exp.description.includes('trou du cul')) return false;
        return true;
      }).map(exp => ({
        ...exp,
        title: exp.title.replace(/test/gi, '').trim() || exp.title,
        company: exp.company.replace(/test/gi, '').trim() || exp.company,
        description: exp.description.replace(/test/gi, '').trim() || exp.description
      }));
    }

    // Nettoyer les compétences
    if (cleanedData.skills) {
      cleanedData.skills = cleanedData.skills.filter(skill => {
        if (!skill.name || skill.name.includes('trou du cul')) return false;
        return true;
      }).map(skill => ({
        ...skill,
        name: skill.name.replace(/test/gi, '').trim() || skill.name
      }));
    }

    // Nettoyer les projets
    if (cleanedData.projects) {
      cleanedData.projects = cleanedData.projects.filter(project => {
        if (!project.title || project.title.includes('trou du cul')) return false;
        if (!project.description || project.description.includes('trou du cul')) return false;
        return true;
      }).map(project => ({
        ...project,
        title: project.title.replace(/test/gi, '').trim() || project.title,
        description: project.description.replace(/test/gi, '').trim() || project.description
      }));
    }

    return cleanedData;
  };

  const handleCleanData = async () => {
    if (!currentData) {
      toast.error('Chargez d\'abord les données actuelles');
      return;
    }

    setIsLoading(true);
    try {
      const cleanedData = cleanData(currentData);
      const result = await saveCVDataToTable(cleanedData);
      
      if (result.success) {
        toast.success('Données CV nettoyées et sauvegardées !');
        await loadCurrentData(); // Recharger pour vérifier
      } else {
        toast.error(`Erreur sauvegarde: ${result.error}`);
      }
    } catch (error) {
      toast.error(`Erreur nettoyage: ${error.message}`);
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefault = async () => {
    setIsLoading(true);
    try {
      const result = await initializeCVData();
      
      if (result.success) {
        toast.success('Données CV réinitialisées avec les valeurs par défaut !');
        await loadCurrentData();
      } else {
        toast.error(`Erreur réinitialisation: ${result.error}`);
      }
    } catch (error) {
      toast.error(`Erreur réinitialisation: ${error.message}`);
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-400" />
          Nettoyage des Données CV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={loadCurrentData}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Eye className="w-4 h-4 mr-2" />
            {isLoading ? 'Chargement...' : 'Analyser les Données'}
          </Button>
          
          <Button
            onClick={handleCleanData}
            disabled={isLoading || !currentData}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Nettoyer les Données
          </Button>
          
          <Button
            onClick={handleResetToDefault}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>

        {/* Analyse des données */}
        {analysis && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Analyse des Données</h3>
            
            {analysis.issues.length > 0 && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h4 className="text-red-300 font-medium mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Problèmes Critiques ({analysis.issues.length})
                </h4>
                <ul className="text-red-200 text-sm space-y-1">
                  {analysis.issues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.warnings.length > 0 && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <h4 className="text-yellow-300 font-medium mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Avertissements ({analysis.warnings.length})
                </h4>
                <ul className="text-yellow-200 text-sm space-y-1">
                  {analysis.warnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.issues.length === 0 && analysis.warnings.length === 0 && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h4 className="text-green-300 font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Données CV Propres
                </h4>
                <p className="text-green-200 text-sm">Aucun problème détecté dans les données CV.</p>
              </div>
            )}
          </div>
        )}

        {/* Aperçu des données */}
        {currentData && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Aperçu des Données</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400">Nom</p>
                <p className="text-white font-medium">
                  {currentData.personalInfo?.name || currentData.personal_info?.name || 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400">Expériences</p>
                <p className="text-white font-medium">{currentData.experiences?.length || 0}</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400">Compétences</p>
                <p className="text-white font-medium">{currentData.skills?.length || 0}</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400">Projets</p>
                <p className="text-white font-medium">{currentData.projects?.length || 0}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-400">
          <p>Cet outil détecte et nettoie le contenu inapproprié ou de test dans vos données CV.</p>
          <p>Utilisez "Nettoyer" pour corriger automatiquement ou "Réinitialiser" pour revenir aux données par défaut.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CVDataCleaner;