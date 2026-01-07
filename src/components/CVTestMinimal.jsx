// Test minimal pour vérifier React-PDF
import React, { useState } from 'react';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  }
});

const MinimalPDFDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.title}>Test PDF Minimal</Text>
        <Text style={styles.text}>Ceci est un test de génération PDF avec React-PDF.</Text>
        <Text style={styles.text}>Généré le: {new Date().toLocaleString('fr-FR')}</Text>
        <Text style={styles.text}>Si vous voyez ce texte, React-PDF fonctionne correctement.</Text>
      </View>
    </Page>
  </Document>
);

const CVTestMinimal = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const testMinimalPDF = async () => {
    setIsGenerating(true);
    setResult(null);

    try {
      console.log('🧪 Test minimal React-PDF...');
      
      const doc = <MinimalPDFDocument />;
      console.log('📄 Document créé');
      
      const blob = await pdf(doc).toBlob();
      console.log('✅ Blob généré:', { size: blob.size, type: blob.type });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Test-Minimal-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      setResult({
        success: true,
        message: `PDF généré avec succès (${Math.round(blob.size / 1024)}KB)`,
        details: {
          size: blob.size,
          type: blob.type,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('❌ Erreur test minimal:', error);
      setResult({
        success: false,
        message: `Erreur: ${error.message}`,
        details: {
          name: error.name,
          stack: error.stack,
          timestamp: new Date().toISOString()
        }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const testPreview = async () => {
    setIsGenerating(true);
    
    try {
      console.log('👁️ Test aperçu minimal...');
      
      const doc = <MinimalPDFDocument />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        throw new Error('Popup bloqué par le navigateur');
      }
      
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      
      setResult({
        success: true,
        message: 'Aperçu ouvert avec succès',
        details: {
          size: blob.size,
          type: blob.type,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('❌ Erreur aperçu minimal:', error);
      setResult({
        success: false,
        message: `Erreur aperçu: ${error.message}`,
        details: {
          name: error.name,
          stack: error.stack,
          timestamp: new Date().toISOString()
        }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Test Minimal React-PDF</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={testMinimalPDF}
            disabled={isGenerating}
            className="bg-green-500 hover:bg-green-600"
          >
            {isGenerating ? 'Génération...' : 'Test Téléchargement'}
          </Button>
          
          <Button
            onClick={testPreview}
            disabled={isGenerating}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isGenerating ? 'Génération...' : 'Test Aperçu'}
          </Button>
        </div>

        {result && (
          <div className={`p-4 rounded-lg ${
            result.success 
              ? 'bg-green-500/10 border border-green-500/20' 
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
            <h4 className={`font-medium mb-2 ${
              result.success ? 'text-green-300' : 'text-red-300'
            }`}>
              Résultat du Test
            </h4>
            <p className={`text-sm mb-2 ${
              result.success ? 'text-green-200' : 'text-red-200'
            }`}>
              {result.message}
            </p>
            
            {result.details && (
              <div className="text-xs text-gray-400 font-mono">
                <pre>{JSON.stringify(result.details, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        <div className="text-sm text-gray-400">
          <p>Ce test vérifie que React-PDF peut générer un PDF simple.</p>
          <p>Si ce test échoue, le problème vient de React-PDF lui-même.</p>
          <p>Si ce test réussit mais que le CV échoue, le problème vient du composant CVGenerator.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CVTestMinimal;