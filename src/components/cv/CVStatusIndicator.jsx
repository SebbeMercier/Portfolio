// Indicateur de statut pour le système CV
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

const CVStatusIndicator = () => {
  const [status, setStatus] = useState({
    staticFileExists: null,
    reactPdfAvailable: null,
    dynamicGeneration: null,
    lastCheck: null
  });

  const checkStatus = async () => {
    const newStatus = {
      lastCheck: new Date().toISOString()
    };

    // Vérifier si le fichier statique existe
    try {
      const response = await fetch('/cv-sebbe-mercier.pdf', { method: 'HEAD' });
      newStatus.staticFileExists = response.ok;
    } catch (error) {
      newStatus.staticFileExists = false;
    }

    // Vérifier si React-PDF est disponible
    try {
      const { pdf } = await import('@react-pdf/renderer');
      newStatus.reactPdfAvailable = typeof pdf === 'function';
    } catch (error) {
      newStatus.reactPdfAvailable = false;
    }

    // Tester la génération dynamique simple
    try {
      const { pdf, Document, Page, Text } = await import('@react-pdf/renderer');
      const React = await import('react');
      
      const TestDoc = React.createElement(Document, null,
        React.createElement(Page, null,
          React.createElement(Text, null, 'Test')
        )
      );
      
      const blob = await pdf(TestDoc).toBlob();
      newStatus.dynamicGeneration = blob && blob.size > 0;
    } catch (error) {
      newStatus.dynamicGeneration = false;
    }

    setStatus(newStatus);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const getStatusIcon = (value) => {
    if (value === null) return <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />;
    if (value === true) return <CheckCircle className="w-4 h-4 text-green-400" />;
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  const getStatusText = (value) => {
    if (value === null) return 'Vérification...';
    if (value === true) return 'OK';
    return 'Erreur';
  };

  const getStatusColor = (value) => {
    if (value === null) return 'text-gray-400';
    if (value === true) return 'text-green-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          Statut du Système CV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(status.staticFileExists)}
              <span className="text-white">Fichier PDF statique</span>
            </div>
            <span className={getStatusColor(status.staticFileExists)}>
              {status.staticFileExists === false ? 'Supprimé ✓' : 
               status.staticFileExists === true ? 'Présent (problématique)' : 
               getStatusText(status.staticFileExists)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(status.reactPdfAvailable)}
              <span className="text-white">React-PDF disponible</span>
            </div>
            <span className={getStatusColor(status.reactPdfAvailable)}>
              {getStatusText(status.reactPdfAvailable)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(status.dynamicGeneration)}
              <span className="text-white">Génération dynamique</span>
            </div>
            <span className={getStatusColor(status.dynamicGeneration)}>
              {getStatusText(status.dynamicGeneration)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button
            onClick={checkStatus}
            variant="outline"
            size="sm"
            className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Vérifier à nouveau
          </Button>
          
          {status.lastCheck && (
            <span className="text-xs text-gray-400">
              Dernière vérification: {new Date(status.lastCheck).toLocaleTimeString('fr-FR')}
            </span>
          )}
        </div>

        {/* Recommandations */}
        <div className="space-y-2">
          {status.staticFileExists === true && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-300 text-sm">
                ⚠️ Un fichier PDF statique existe encore. Il devrait être supprimé pour forcer la génération dynamique.
              </p>
            </div>
          )}
          
          {status.staticFileExists === false && status.reactPdfAvailable === true && status.dynamicGeneration === true && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-300 text-sm">
                ✅ Configuration optimale ! Le système devrait maintenant utiliser la génération dynamique.
              </p>
            </div>
          )}
          
          {status.reactPdfAvailable === false && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-300 text-sm">
                ❌ React-PDF n'est pas disponible. Vérifiez l'installation: <code>bun add @react-pdf/renderer</code>
              </p>
            </div>
          )}
          
          {status.dynamicGeneration === false && status.reactPdfAvailable === true && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-300 text-sm">
                ❌ La génération dynamique échoue. Vérifiez les logs de la console pour plus de détails.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CVStatusIndicator;