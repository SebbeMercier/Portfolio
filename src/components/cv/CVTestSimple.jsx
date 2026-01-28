// CVTestSimple.jsx - Test simple pour React-PDF
import React, { useState } from 'react';
import { pdf, Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import { Download, Eye, TestTube } from 'lucide-react';
import toast from 'react-hot-toast';

// Styles simples pour le test
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
    color: '#333333',
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    color: '#666666',
  },
});

// Document PDF simple pour test
const SimpleTestDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Test CV - Sebbe Mercier</Text>
      <Text style={styles.text}>Ceci est un test simple de génération PDF.</Text>
      <Text style={styles.text}>Si vous voyez ce document, React-PDF fonctionne correctement.</Text>
      <Text style={styles.text}>Date de génération: {new Date().toLocaleString()}</Text>
      <Text style={styles.text}>Système: CV Manager Test</Text>
    </Page>
  </Document>
);

export default function CVTestSimple() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTestPDF = async (action = 'download') => {
    setIsGenerating(true);
    
    try {
      console.log('🧪 Test génération PDF simple...');
      toast.loading('Test génération PDF...', { id: 'test-pdf' });

      // Générer le PDF
      const blob = await pdf(<SimpleTestDocument />).toBlob();
      
      if (!blob || blob.size === 0) {
        throw new Error('Blob PDF vide');
      }

      console.log('✅ PDF test généré:', {
        size: `${Math.round(blob.size / 1024)}KB`,
        type: blob.type
      });

      const url = URL.createObjectURL(blob);

      if (action === 'download') {
        // Télécharger
        const link = document.createElement('a');
        link.href = url;
        link.download = `CV-Test-${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('PDF test téléchargé !', { id: 'test-pdf' });
      } else {
        // Aperçu
        const newWindow = window.open(url, '_blank');
        if (!newWindow) {
          throw new Error('Popup bloqué');
        }
        toast.success('Aperçu test ouvert !', { id: 'test-pdf' });
      }

      // Nettoyer
      setTimeout(() => URL.revokeObjectURL(url), 5000);

    } catch (error) {
      console.error('❌ Erreur test PDF:', error);
      toast.error(`Erreur test: ${error.message}`, { id: 'test-pdf' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <TestTube className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Test React-PDF Simple</h3>
      </div>
      
      <p className="text-gray-400 mb-6">
        Test basique pour vérifier que la génération PDF fonctionne avec un document minimal.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => generateTestPDF('download')}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Test Téléchargement
        </button>

        <button
          onClick={() => generateTestPDF('preview')}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          Test Aperçu
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded text-sm text-blue-200">
        <strong>Note:</strong> Ce test utilise un document PDF minimal pour isoler les problèmes potentiels 
        de React-PDF des problèmes de données CV.
      </div>
    </div>
  );
}