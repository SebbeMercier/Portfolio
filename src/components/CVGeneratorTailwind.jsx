// CVGeneratorTailwind.jsx - Générateur CV avec Tailwind CSS (via react-to-pdf)
import React from 'react';
import { usePDF } from 'react-to-pdf';
import { 
  Briefcase, Mail, Phone, MapPin, Globe, Calendar, Award, 
  ExternalLink, Github, Star, Clock, Users, Code, Download
} from 'lucide-react';

const CVGeneratorTailwind = ({ cvData, onGenerate }) => {
  const { toPDF, targetRef } = usePDF({
    filename: `CV-Sebbe-Mercier-${new Date().toISOString().split('T')[0]}.pdf`,
    page: {
      margin: 0,
      format: 'a4',
      orientation: 'portrait',
    },
    canvas: {
      mimeType: 'image/png',
      qualityRatio: 2
    }
  });

  const handleGenerate = async () => {
    try {
      await toPDF();
      if (onGenerate) onGenerate();
    } catch (error) {
      console.error('Erreur génération PDF Tailwind:', error);
    }
  };

  if (!cvData) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">Données CV non disponibles</p>
      </div>
    );
  }

  const { personalInfo, experiences, skills, projects, education, languages, achievements } = cvData;

  return (
    <div className="w-full">
      {/* Bouton de génération */}
      <div className="mb-6 text-center">
        <button
          onClick={handleGenerate}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Download className="w-5 h-5 mr-2 inline" />
          Générer CV avec Tailwind CSS
        </button>
      </div>

      {/* Contenu du CV avec Tailwind CSS */}
      <div 
        ref={targetRef} 
        className="bg-white text-gray-900 max-w-4xl mx-auto shadow-2xl"
        style={{ 
          width: '210mm', 
          minHeight: '297mm',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {/* Header avec gradient moderne */}
        <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
          {/* Pattern de fond */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-500/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/30 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
          
          <div className="relative z-10 p-12 pb-16">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                {personalInfo?.name || 'Nom'}
              </h1>
              <p className="text-2xl text-purple-200 mb-8 font-light">
                {personalInfo?.title || 'Titre professionnel'}
              </p>
              
              {/* Informations de contact avec icônes */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {personalInfo?.email && (
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <Mail className="w-4 h-4 text-yellow-300" />
                    <span className="text-slate-100">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo?.phone && (
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <Phone className="w-4 h-4 text-yellow-300" />
                    <span className="text-slate-100">{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo?.location && (
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <MapPin className="w-4 h-4 text-yellow-300" />
                    <span className="text-slate-100">{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo?.website && (
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <Globe className="w-4 h-4 text-yellow-300" />
                    <span className="text-slate-100">{personalInfo.website.replace(/^https?:\/\//, '')}</span>
                  </div>
                )}
                {personalInfo?.linkedin && (
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <Users className="w-4 h-4 text-yellow-300" />
                    <span className="text-slate-100">LinkedIn</span>
                  </div>
                )}
                {personalInfo?.github && (
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <Github className="w-4 h-4 text-yellow-300" />
                    <span className="text-slate-100">GitHub</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Corps du CV */}
        <div className="p-12 bg-gray-50">
          {/* Résumé professionnel */}
          {personalInfo?.summary && (
            <div className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border-l-4 border-blue-500 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                PROFIL PROFESSIONNEL
              </h2>
              <p className="text-gray-700 leading-relaxed text-justify italic">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Layout en deux colonnes */}
          <div className="grid grid-cols-3 gap-12">
            {/* Colonne principale */}
            <div className="col-span-2 space-y-12">
              {/* Expériences professionnelles */}
              {experiences && experiences.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3 border-b-2 border-purple-500 pb-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    EXPÉRIENCE PROFESSIONNELLE
                  </h2>
                  
                  <div className="space-y-8 relative">
                    {/* Timeline */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-blue-500"></div>
                    
                    {experiences.slice(0, 4).map((exp, index) => (
                      <div key={index} className="relative pl-16">
                        {/* Timeline marker */}
                        <div className="absolute left-4 top-6 w-4 h-4 bg-purple-500 rounded-full border-4 border-white shadow-lg"></div>
                        
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-800 mb-1">{exp.title}</h3>
                              <p className="text-purple-600 font-semibold text-lg mb-1">{exp.company}</p>
                              {exp.location && (
                                <p className="text-gray-600 text-sm flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {exp.location}
                                </p>
                              )}
                            </div>
                            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                              {new Date(exp.start_date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })} - 
                              {exp.current ? ' Présent' : ` ${new Date(exp.end_date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}`}
                            </div>
                          </div>
                          
                          {exp.description && (
                            <p className="text-gray-700 mb-4 leading-relaxed text-justify">
                              {exp.description}
                            </p>
                          )}
                          
                          {exp.achievements && exp.achievements.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-800 text-sm">Réalisations clés :</h4>
                              <ul className="space-y-1">
                                {exp.achievements.slice(0, 3).map((achievement, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {exp.technologies.slice(0, 6).map((tech, i) => (
                                <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projets clés */}
              {projects && projects.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3 border-b-2 border-cyan-500 pb-3">
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                      <Code className="w-4 h-4 text-white" />
                    </div>
                    PROJETS CLÉS
                  </h2>
                  
                  <div className="grid gap-6">
                    {projects.slice(0, 3).map((project, index) => (
                      <div key={index} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-cyan-500 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold text-gray-800 flex-1">{project.title}</h3>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                            {project.status || 'Terminé'}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4 text-justify leading-relaxed">{project.description}</p>
                        
                        {(project.technologies || project.tags) && (
                          <div className="flex flex-wrap gap-2">
                            {(project.technologies || project.tags)?.slice(0, 6).map((tech, i) => (
                              <span key={i} className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-xs font-medium border border-cyan-200">
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
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-purple-500 pb-2">
                    COMPÉTENCES
                  </h2>
                  
                  <div className="space-y-6">
                    {Object.entries(
                      skills.reduce((acc, skill) => {
                        const category = skill.category || 'other';
                        if (!acc[category]) acc[category] = [];
                        acc[category].push(skill);
                        return acc;
                      }, {})
                    ).map(([category, categorySkills]) => (
                      <div key={category}>
                        <h3 className="font-semibold text-gray-700 mb-3 uppercase text-sm tracking-wide">
                          {category}
                        </h3>
                        <div className="space-y-3">
                          {categorySkills.slice(0, 6).map((skill, index) => (
                            <div key={index}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-gray-800">{skill.name}</span>
                                <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded">
                                  {skill.years_experience ? `${skill.years_experience}ans` : `${skill.level}/5`}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300" 
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
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
                    FORMATION
                  </h2>
                  <div className="space-y-4">
                    {education.map((edu, index) => (
                      <div key={index} className="border-l-3 border-blue-500 pl-4">
                        <h3 className="font-semibold text-gray-800">{edu.title}</h3>
                        <p className="text-blue-600 text-sm font-medium">{edu.company || edu.institution}</p>
                        <p className="text-gray-600 text-xs flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
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
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-green-500 pb-2">
                    LANGUES
                  </h2>
                  <div className="space-y-3">
                    {languages.map((lang, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-800 font-medium">{lang.name}</span>
                        <span className="text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-full">
                          {lang.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Réalisations */}
              {achievements && achievements.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-yellow-500 pb-2 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    RÉALISATIONS
                  </h2>
                  <ul className="space-y-3">
                    {achievements.slice(0, 5).map((achievement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t-2 border-gray-200 text-center">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">
                CV généré automatiquement le {new Date().toLocaleDateString('fr-FR')}
              </p>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2 rounded-full border border-purple-200">
                <span className="text-purple-600 text-sm font-semibold">
                  ⚡ Généré dynamiquement avec Tailwind CSS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVGeneratorTailwind;