// Test simple pour react-to-pdf
import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Download, AlertCircle, CheckCircle } from 'lucide-react';

const CVTestReactToPDFSimple = ({ cvData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const targetRef = useRef();

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setResult(null);

    try {
      console.log('🧪 Test react-to-pdf (méthode alternative)...');
      
      // Méthode alternative : utiliser html2canvas + jsPDF directement
      const html2canvas = await import('html2canvas');
      const jsPDF = await import('jspdf');
      
      if (!targetRef.current) {
        throw new Error('Élément cible non trouvé');
      }

      console.log('📸 Capture de l\'élément...');
      const canvas = await html2canvas.default(targetRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      console.log('📄 Création du PDF...');
      const pdf = new jsPDF.jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      console.log('💾 Téléchargement...');
      pdf.save(`CV-Test-ReactToPDF-Simple-${Date.now()}.pdf`);
      
      setResult({
        success: true,
        message: 'PDF généré avec succès (méthode alternative)',
        method: 'html2canvas + jsPDF',
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ react-to-pdf alternatif réussi');
      
    } catch (error) {
      console.error('❌ Erreur react-to-pdf alternatif:', error);
      setResult({
        success: false,
        message: `Erreur: ${error.message}`,
        error: error.name,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!cvData) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-orange-400" />
            Test React-to-PDF Simple
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">Chargez d'abord les données CV pour tester</p>
        </CardContent>
      </Card>
    );
  }

  const { personalInfo, experiences, skills } = cvData;

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-orange-400" />
          Test React-to-PDF Simple (html2canvas + jsPDF)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleGeneratePDF}
          disabled={isGenerating}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Génération en cours...
            </div>
          ) : (
            'Générer PDF (méthode alternative)'
          )}
        </Button>

        {/* Résultat du test */}
        {result && (
          <div className={`p-4 rounded-lg ${
            result.success 
              ? 'bg-green-500/10 border border-green-500/20' 
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${result.success ? 'text-green-300' : 'text-red-300'}`}>
                  {result.success ? 'Succès' : 'Erreur'}
                </p>
                <p className={`text-sm ${result.success ? 'text-green-200' : 'text-red-200'}`}>
                  {result.message}
                </p>
                {result.method && (
                  <p className="text-xs text-green-300 mt-1">Méthode: {result.method}</p>
                )}
                {result.error && (
                  <p className="text-xs text-red-300 mt-1">Type: {result.error}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contenu simple à convertir en PDF */}
        <div 
          ref={targetRef} 
          className="bg-white text-gray-900 p-6 rounded-lg border-2 border-dashed border-gray-300"
          style={{ minHeight: '300px' }}
        >
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {personalInfo?.name || 'Test CV'}
            </h1>
            <p className="text-lg text-blue-600 mb-3">
              {personalInfo?.title || 'Développeur Full Stack'}
            </p>
            <div className="text-sm text-gray-600">
              {personalInfo?.email && <p>📧 {personalInfo.email}</p>}
              {personalInfo?.phone && <p>📞 {personalInfo.phone}</p>}
            </div>
          </div>

          {personalInfo?.summary && (
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-blue-600 pb-1">
                Profil
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {personalInfo.summary.substring(0, 200)}...
              </p>
            </div>
          )}

          {experiences && experiences.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-blue-600 pb-1">
                Expériences
              </h2>
              <div className="space-y-2">
                {experiences.slice(0, 2).map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-600 pl-3">
                    <h3 className="font-bold text-gray-800 text-sm">{exp.title}</h3>
                    <p className="text-blue-600 text-sm">{exp.company}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-blue-600 pb-1">
                Compétences
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 6).map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="text-center text-xs text-gray-500 mt-6 pt-3 border-t">
            Test react-to-pdf • {new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>

        <div className="text-xs text-gray-400">
          <p>Ce test utilise html2canvas + jsPDF directement pour plus de compatibilité.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CVTestReactToPDFSimple;