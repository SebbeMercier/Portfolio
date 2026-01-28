// Test pour react-to-pdf
import React, { useState } from 'react';
import { usePDF } from 'react-to-pdf';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Download, AlertCircle, CheckCircle } from 'lucide-react';

const CVTestReactToPDF = ({ cvData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const { toPDF, targetRef } = usePDF({
    filename: `CV-Test-ReactToPDF-${Date.now()}.pdf`,
    page: {
      margin: 20,
      format: 'a4',
      orientation: 'portrait',
    }
  });

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setResult(null);

    try {
      console.log('🧪 Test react-to-pdf...');
      
      // Appeler toPDF et attendre qu'il se termine
      await toPDF();
      
      setResult({
        success: true,
        message: 'PDF généré avec succès avec react-to-pdf',
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ react-to-pdf réussi');
      
    } catch (error) {
      console.error('❌ Erreur react-to-pdf:', error);
      setResult({
        success: false,
        message: `Erreur: ${error.message}`,
        error: error.name,
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
            <Download className="w-5 h-5 text-cyan-400" />
            Test React-to-PDF
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">Chargez d'abord les données CV pour tester react-to-pdf</p>
        </CardContent>
      </Card>
    );
  }

  const { personalInfo, experiences, skills, projects } = cvData;

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-cyan-400" />
          Test React-to-PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleGeneratePDF}
          disabled={isGenerating}
          className="w-full bg-cyan-500 hover:bg-cyan-600"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Génération en cours...
            </div>
          ) : (
            'Générer PDF avec react-to-pdf'
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
                {result.error && (
                  <p className="text-xs text-red-300 mt-1">Type: {result.error}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contenu à convertir en PDF */}
        <div 
          ref={targetRef} 
          className="bg-white text-gray-900 p-8 rounded-lg"
          style={{ minHeight: '400px' }}
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {personalInfo?.name || 'Nom'}
            </h1>
            <p className="text-xl text-blue-600 mb-4">
              {personalInfo?.title || 'Titre'}
            </p>
            <div className="text-sm text-gray-600 space-y-1">
              {personalInfo?.email && <p>📧 {personalInfo.email}</p>}
              {personalInfo?.phone && <p>📞 {personalInfo.phone}</p>}
              {personalInfo?.location && <p>📍 {personalInfo.location}</p>}
            </div>
          </div>

          {personalInfo?.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">
                Profil
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {personalInfo.summary}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div>
              {experiences && experiences.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">
                    Expériences
                  </h2>
                  <div className="space-y-3">
                    {experiences.slice(0, 3).map((exp, index) => (
                      <div key={index} className="border-l-4 border-blue-600 pl-4">
                        <h3 className="font-bold text-gray-800">{exp.title}</h3>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(exp.start_date).getFullYear()} - 
                          {exp.current ? ' Présent' : ` ${new Date(exp.end_date).getFullYear()}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              {skills && skills.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">
                    Compétences
                  </h2>
                  <div className="space-y-2">
                    {skills.slice(0, 8).map((skill, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-800">{skill.name}</span>
                        <span className="text-blue-600 text-sm">
                          {skill.level}/5
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {projects && projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">
                Projets
              </h2>
              <div className="space-y-3">
                {projects.slice(0, 2).map((project, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <h3 className="font-bold text-gray-800">{project.title}</h3>
                    <p className="text-gray-700 text-sm">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t">
            CV généré avec react-to-pdf • {new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CVTestReactToPDF;