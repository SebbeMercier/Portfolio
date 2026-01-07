// CVGeneratorHTML.jsx - Générateur CV avec react-to-pdf (HTML/CSS)
import React from 'react';
import { Briefcase, Mail, Phone, MapPin, Globe, Calendar, Award } from 'lucide-react';
import { usePDF } from 'react-to-pdf';

const CVGeneratorHTML = ({ cvData, onGenerate }) => {
  const { toPDF, targetRef } = usePDF({
    filename: `CV-Sebbe-Mercier-${new Date().toISOString().split('T')[0]}.pdf`,
    page: {
      margin: 20,
      format: 'a4',
      orientation: 'portrait',
    }
  });

  const generatePDF = () => {
    toPDF();
    if (onGenerate) onGenerate();
  };

  const { personalInfo, experiences, skills, projects, education, languages, achievements } = cvData;

  return (
    <div className="w-full">
      {/* Bouton de génération */}
      <div className="mb-4 text-center">
        <button
          onClick={generatePDF}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Générer PDF (HTML vers PDF)
        </button>
      </div>

      {/* Contenu du CV */}
      <div 
        ref={targetRef} 
        className="bg-white text-gray-900 max-w-4xl mx-auto"
        style={{ 
          width: '210mm', 
          minHeight: '297mm', 
          padding: '20mm',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg mb-8">
          <h1 className="text-4xl font-bold mb-2">{personalInfo?.name || 'Nom'}</h1>
          <p className="text-xl text-purple-100 mb-4">{personalInfo?.title || 'Titre'}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            {personalInfo?.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo?.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo?.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Résumé */}
        {personalInfo?.summary && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-600 pb-2">
              PROFIL PROFESSIONNEL
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              {personalInfo.summary}
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="col-span-2 space-y-8">
            {/* Expériences */}
            {experiences && experiences.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-600 pb-2 flex items-center gap-2">
                  <Briefcase className="w-6 h-6" />
                  EXPÉRIENCE PROFESSIONNELLE
                </h2>
                
                <div className="space-y-6">
                  {experiences.slice(0, 4).map((exp, index) => (
                    <div key={index} className="border-l-4 border-purple-600 pl-6 relative">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-purple-600 rounded-full"></div>
                      
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{exp.title}</h3>
                          <p className="text-purple-600 font-semibold">{exp.company}</p>
                          {exp.location && (
                            <p className="text-gray-600 text-sm">{exp.location}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                            {new Date(exp.start_date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })} - 
                            {exp.current ? ' Présent' : ` ${new Date(exp.end_date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}`}
                          </div>
                        </div>
                      </div>
                      
                      {exp.description && (
                        <p className="text-gray-700 mb-3 text-justify leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                      
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                          {exp.achievements.slice(0, 3).map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projets */}
            {projects && projects.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-600 pb-2">
                  PROJETS CLÉS
                </h2>
                
                <div className="grid gap-4">
                  {projects.slice(0, 3).map((project, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-600">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{project.title}</h3>
                      <p className="text-gray-700 mb-3 text-justify">{project.description}</p>
                      
                      {(project.technologies || project.tags) && (
                        <div className="flex flex-wrap gap-2">
                          {(project.technologies || project.tags)?.slice(0, 5).map((tech, i) => (
                            <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Compétences */}
            {skills && skills.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-600 pb-2">
                  COMPÉTENCES
                </h2>
                
                <div className="space-y-4">
                  {Object.entries(
                    skills.reduce((acc, skill) => {
                      const category = skill.category || 'other';
                      if (!acc[category]) acc[category] = [];
                      acc[category].push(skill);
                      return acc;
                    }, {})
                  ).map(([category, categorySkills]) => (
                    <div key={category}>
                      <h3 className="font-semibold text-gray-700 mb-2 uppercase text-sm">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {categorySkills.slice(0, 6).map((skill, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-800">{skill.name}</span>
                              <span className="text-xs text-purple-600 font-bold">
                                {skill.years_experience ? `${skill.years_experience}ans` : `${skill.level}/5`}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full" 
                                style={{ width: `${(skill.level / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formation */}
            {education && education.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-600 pb-2">
                  FORMATION
                </h2>
                <div className="space-y-3">
                  {education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-purple-300 pl-3">
                      <h3 className="font-semibold text-gray-800">{edu.title}</h3>
                      <p className="text-purple-600 text-sm">{edu.company || edu.institution}</p>
                      <p className="text-gray-600 text-xs">
                        {new Date(edu.start_date).getFullYear()}
                        {edu.end_date && ` - ${new Date(edu.end_date).getFullYear()}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Langues */}
            {languages && languages.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-600 pb-2">
                  LANGUES
                </h2>
                <div className="space-y-2">
                  {languages.map((lang, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-800 font-medium">{lang.name}</span>
                      <span className="text-purple-600 text-sm font-semibold">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Réalisations */}
            {achievements && achievements.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-600 pb-2 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  RÉALISATIONS
                </h2>
                <ul className="space-y-2">
                  {achievements.slice(0, 4).map((achievement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-300 text-center">
          <p className="text-gray-500 text-sm">
            CV généré automatiquement le {new Date().toLocaleDateString('fr-FR')} • 
            Système de génération dynamique
          </p>
        </div>
      </div>
    </div>
  );
};

export default CVGeneratorHTML;