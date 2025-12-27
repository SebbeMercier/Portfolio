// Gestionnaire complet des données CV dans la table cv_data
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Edit, Trash2, Save, X, User, Briefcase, 
  Award, Code, GraduationCap, Globe, Trophy, Database
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { importFromSeparateTables } from '../services/cvDataService';
import toast from 'react-hot-toast';

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const CVDataManager = () => {
  const [cvData, setCvData] = useState({
    personal_info: {},
    experiences: [],
    skills: [],
    projects: [],
    education: [],
    languages: [],
    achievements: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  // Charger les données CV
  const loadCVData = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Chargement des données CV...');
      
      const { data, error } = await supabase
        .from('cv_data')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Erreur lors du chargement:', error);
        throw error;
      }

      if (data) {
        console.log('✅ Données CV trouvées:', data);
        setCvData(data.data || {
          personal_info: {},
          experiences: [],
          skills: [],
          projects: [],
          education: [],
          languages: [],
          achievements: []
        });
      } else {
        console.log('⚠️ Aucune donnée trouvée, initialisation...');
        // Créer une entrée par défaut
        await initializeDefaultData();
      }
    } catch (error) {
      console.error('❌ Erreur chargement CV data:', error);
      
      // Messages d'erreur plus spécifiques
      if (error.code === '42P01') {
        toast.error('Table cv_data manquante. Exécutez le script SQL d\'initialisation.');
      } else if (error.code === '42501') {
        toast.error('Permissions insuffisantes. Vérifiez les politiques RLS.');
      } else {
        toast.error(`Erreur lors du chargement: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialiser les données par défaut
  const initializeDefaultData = async () => {
    const defaultData = {
      personal_info: {
        name: 'Sebbe Mercier',
        title: 'Développeur Full Stack • React & Node.js',
        email: 'info@sebbe-mercier.tech',
        phone: '+33 6 XX XX XX XX',
        location: 'France',
        website: 'https://sebbe-mercier.tech',
        summary: 'Développeur Full Stack passionné avec une expertise en React, Node.js et TypeScript.'
      },
      experiences: [
        {
          id: 1,
          title: 'Développeur Full Stack Senior',
          company: 'TechCorp Solutions',
          location: 'Paris, France',
          description: 'Développement d\'applications web modernes avec React et Node.js.',
          start_date: '2022-01-01',
          end_date: null,
          current: true,
          technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
          achievements: ['Amélioration des performances de 40%', 'Migration vers TypeScript']
        }
      ],
      skills: [
        { id: 1, name: 'React', category: 'frontend', level: 5, years_experience: 4 },
        { id: 2, name: 'Node.js', category: 'backend', level: 4, years_experience: 3 },
        { id: 3, name: 'TypeScript', category: 'frontend', level: 4, years_experience: 2 }
      ],
      projects: [
        {
          id: 1,
          title: 'Portfolio Moderne',
          description: 'Site portfolio avec animations avancées',
          technologies: ['React', 'Tailwind CSS', 'Framer Motion'],
          github_url: 'https://github.com/sebbe/portfolio',
          demo_url: 'https://sebbe-mercier.tech'
        }
      ],
      education: [
        {
          id: 1,
          title: 'Master Informatique',
          institution: 'Université de Technologie',
          location: 'France',
          start_date: '2017-09-01',
          end_date: '2019-06-30',
          description: 'Spécialisation en développement web'
        }
      ],
      languages: [
        { id: 1, name: 'Français', level: 'Natif' },
        { id: 2, name: 'Anglais', level: 'Professionnel' }
      ],
      achievements: [
        'Développeur Full Stack expérimenté',
        'Spécialiste React et Node.js',
        'Applications web modernes'
      ]
    };

    try {
      console.log('🌱 Initialisation des données par défaut...');
      
      const { error } = await supabase
        .from('cv_data')
        .insert([{ data: defaultData }]);

      if (error) {
        console.error('❌ Erreur lors de l\'insertion:', error);
        throw error;
      }

      setCvData(defaultData);
      toast.success('Données par défaut initialisées');
      console.log('✅ Données initialisées avec succès');
    } catch (error) {
      console.error('❌ Erreur initialisation:', error);
      
      // Messages d'erreur spécifiques
      if (error.code === '42P01') {
        toast.error('Table cv_data manquante. Exécutez le script SQL d\'initialisation.');
      } else if (error.code === '23505') {
        toast.error('Données déjà initialisées.');
      } else {
        toast.error(`Erreur lors de l'initialisation: ${error.message}`);
      }
    }
  };

  // Importer les données depuis les tables séparées
  const handleImportData = async () => {
    setIsImporting(true);
    try {
      toast.loading('Import des données en cours...', { id: 'import-data' });

      const result = await importFromSeparateTables();

      if (result.success) {
        toast.success(
          `Import réussi ! ${result.imported.projects} projets, ${result.imported.experiences} expériences, ${result.imported.skills} compétences importés.`,
          { id: 'import-data', duration: 5000 }
        );
        
        // Recharger les données
        await loadCVData();
      } else {
        toast.error(`Erreur lors de l'import: ${result.error}`, { id: 'import-data' });
      }
    } catch (error) {
      console.error('Erreur import:', error);
      toast.error('Erreur lors de l\'import', { id: 'import-data' });
    } finally {
      setIsImporting(false);
    }
  };

  // Sauvegarder les données CV
  const saveCVData = async () => {
    try {
      toast.loading('Sauvegarde...', { id: 'save-cv' });

      const { error } = await supabase
        .from('cv_data')
        .upsert([{ 
          id: 1, // ID fixe pour une seule entrée
          data: cvData,
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast.success('Données sauvegardées !', { id: 'save-cv' });
      setEditingSection(null);
      setEditingItem(null);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde', { id: 'save-cv' });
    }
  };

  // Ajouter un élément
  const addItem = (section) => {
    const newItem = {
      id: Date.now(),
      ...(section === 'experiences' && {
        title: '',
        company: '',
        location: '',
        description: '',
        start_date: '',
        end_date: null,
        current: false,
        technologies: [],
        achievements: []
      }),
      ...(section === 'skills' && {
        name: '',
        category: 'frontend',
        level: 1,
        years_experience: 0
      }),
      ...(section === 'projects' && {
        title: '',
        description: '',
        technologies: [],
        github_url: '',
        demo_url: ''
      }),
      ...(section === 'education' && {
        title: '',
        institution: '',
        location: '',
        start_date: '',
        end_date: '',
        description: ''
      }),
      ...(section === 'languages' && {
        name: '',
        level: ''
      })
    };

    setCvData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
    setEditingItem(newItem.id);
    setEditingSection(section);
  };

  // Supprimer un élément
  const deleteItem = (section, id) => {
    setCvData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  // Mettre à jour un élément
  const updateItem = (section, id, updates) => {
    setCvData(prev => ({
      ...prev,
      [section]: prev[section].map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  useEffect(() => {
    loadCVData();
  }, [loadCVData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            📝 Gestionnaire de Données CV
          </h1>
          <p className="text-gray-400">
            Gérez toutes vos données CV dans une interface centralisée
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleImportData} 
            disabled={isImporting}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isImporting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Database className="w-4 h-4 mr-2" />
            )}
            Importer données existantes
          </Button>
          <Button 
            onClick={async () => {
              const { default: diagnoseCVDataError } = await import('../scripts/diagnoseCVDataError');
              const result = await diagnoseCVDataError();
              if (result.error) {
                toast.error(`Diagnostic: ${result.error}. ${result.solution || ''}`);
              } else {
                toast.success('Diagnostic: Système opérationnel !');
              }
            }}
            variant="outline"
            className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
          >
            🔍 Diagnostic
          </Button>
          <Button onClick={saveCVData} className="bg-green-500 hover:bg-green-600">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-white/5 border border-white/10">
          <TabsTrigger value="personal">
            <User className="w-4 h-4 mr-2" />
            Personnel
          </TabsTrigger>
          <TabsTrigger value="experiences">
            <Briefcase className="w-4 h-4 mr-2" />
            Expériences
          </TabsTrigger>
          <TabsTrigger value="skills">
            <Code className="w-4 h-4 mr-2" />
            Compétences
          </TabsTrigger>
          <TabsTrigger value="projects">
            <Award className="w-4 h-4 mr-2" />
            Projets
          </TabsTrigger>
          <TabsTrigger value="education">
            <GraduationCap className="w-4 h-4 mr-2" />
            Formation
          </TabsTrigger>
          <TabsTrigger value="languages">
            <Globe className="w-4 h-4 mr-2" />
            Langues
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Trophy className="w-4 h-4 mr-2" />
            Réalisations
          </TabsTrigger>
        </TabsList>

        {/* Informations personnelles */}
        <TabsContent value="personal">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Informations Personnelles</CardTitle>
              <CardDescription>Vos coordonnées et informations de base</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nom</label>
                  <input
                    type="text"
                    value={cvData.personal_info?.name || ''}
                    onChange={(e) => setCvData(prev => ({
                      ...prev,
                      personal_info: { ...prev.personal_info, name: e.target.value }
                    }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Titre</label>
                  <input
                    type="text"
                    value={cvData.personal_info?.title || ''}
                    onChange={(e) => setCvData(prev => ({
                      ...prev,
                      personal_info: { ...prev.personal_info, title: e.target.value }
                    }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={cvData.personal_info?.email || ''}
                    onChange={(e) => setCvData(prev => ({
                      ...prev,
                      personal_info: { ...prev.personal_info, email: e.target.value }
                    }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={cvData.personal_info?.phone || ''}
                    onChange={(e) => setCvData(prev => ({
                      ...prev,
                      personal_info: { ...prev.personal_info, phone: e.target.value }
                    }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Résumé</label>
                <textarea
                  value={cvData.personal_info?.summary || ''}
                  onChange={(e) => setCvData(prev => ({
                    ...prev,
                    personal_info: { ...prev.personal_info, summary: e.target.value }
                  }))}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expériences */}
        <TabsContent value="experiences">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white">Expériences Professionnelles</CardTitle>
                  <CardDescription>Vos postes et missions</CardDescription>
                </div>
                <Button onClick={() => addItem('experiences')} className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cvData.experiences?.map((exp) => (
                  <div key={exp.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    {editingSection === 'experiences' && editingItem === exp.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Titre du poste"
                            value={exp.title || ''}
                            onChange={(e) => updateItem('experiences', exp.id, { title: e.target.value })}
                            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                          <input
                            type="text"
                            placeholder="Entreprise"
                            value={exp.company || ''}
                            onChange={(e) => updateItem('experiences', exp.id, { company: e.target.value })}
                            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                          <input
                            type="text"
                            placeholder="Lieu"
                            value={exp.location || ''}
                            onChange={(e) => updateItem('experiences', exp.id, { location: e.target.value })}
                            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              placeholder="Date début"
                              value={exp.start_date || ''}
                              onChange={(e) => updateItem('experiences', exp.id, { start_date: e.target.value })}
                              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                            <input
                              type="date"
                              placeholder="Date fin"
                              value={exp.current ? '' : exp.end_date || ''}
                              disabled={exp.current}
                              onChange={(e) => updateItem('experiences', exp.id, { end_date: e.target.value })}
                              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white disabled:opacity-50"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={exp.current || false}
                            onChange={(e) => updateItem('experiences', exp.id, { 
                              current: e.target.checked,
                              end_date: e.target.checked ? null : exp.end_date
                            })}
                            className="rounded"
                          />
                          <label className="text-gray-300 text-sm">Poste actuel</label>
                        </div>
                        <textarea
                          placeholder="Description du poste"
                          value={exp.description || ''}
                          onChange={(e) => updateItem('experiences', exp.id, { description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                        <input
                          type="text"
                          placeholder="Technologies (séparées par des virgules)"
                          value={exp.technologies?.join(', ') || ''}
                          onChange={(e) => updateItem('experiences', exp.id, { 
                            technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                          })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                        <textarea
                          placeholder="Réalisations (une par ligne)"
                          value={exp.achievements?.join('\n') || ''}
                          onChange={(e) => updateItem('experiences', exp.id, { 
                            achievements: e.target.value.split('\n').filter(a => a.trim())
                          })}
                          rows={3}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => { setEditingItem(null); setEditingSection(null); }}>
                            <Save className="w-4 h-4 mr-1" />
                            Sauver
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setEditingItem(null); setEditingSection(null); }}>
                            <X className="w-4 h-4 mr-1" />
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-white font-semibold">{exp.title}</h3>
                          <p className="text-gray-400">{exp.company} • {exp.location}</p>
                          <p className="text-gray-500 text-sm">
                            {exp.start_date} - {exp.current ? 'Présent' : exp.end_date}
                          </p>
                          {exp.description && <p className="text-gray-300 text-sm mt-2">{exp.description}</p>}
                          {exp.achievements && exp.achievements.length > 0 && (
                            <ul className="text-gray-300 text-sm mt-2 list-disc list-inside">
                              {exp.achievements.map((achievement, idx) => (
                                <li key={idx}>{achievement}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingItem(exp.id);
                              setEditingSection('experiences');
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteItem('experiences', exp.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    {exp.technologies && exp.technologies.length > 0 && !editingItem && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {exp.technologies.map((tech, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Autres sections similaires... */}
        <TabsContent value="skills">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white">Compétences Techniques</CardTitle>
                  <CardDescription>Vos technologies et niveaux</CardDescription>
                </div>
                <Button onClick={() => addItem('skills')} className="bg-green-500 hover:bg-green-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cvData.skills?.map((skill) => (
                  <div key={skill.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    {editingSection === 'skills' && editingItem === skill.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Nom de la compétence"
                          value={skill.name || ''}
                          onChange={(e) => updateItem('skills', skill.id, { name: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                        <select
                          value={skill.category || 'frontend'}
                          onChange={(e) => updateItem('skills', skill.id, { category: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        >
                          <option value="frontend">Frontend</option>
                          <option value="backend">Backend</option>
                          <option value="database">Base de données</option>
                          <option value="tools">Outils</option>
                          <option value="mobile">Mobile</option>
                          <option value="devops">DevOps</option>
                        </select>
                        <div>
                          <label className="block text-gray-300 text-sm mb-1">
                            Niveau: {skill.level}/5
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={skill.level || 1}
                            onChange={(e) => updateItem('skills', skill.id, { level: parseInt(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                        <input
                          type="number"
                          placeholder="Années d'expérience"
                          value={skill.years_experience || 0}
                          onChange={(e) => updateItem('skills', skill.id, { years_experience: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => { setEditingItem(null); setEditingSection(null); }}>
                            <Save className="w-4 h-4 mr-1" />
                            Sauver
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setEditingItem(null); setEditingSection(null); }}>
                            <X className="w-4 h-4 mr-1" />
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-white font-medium">{skill.name}</h4>
                          <p className="text-gray-400 text-sm capitalize">{skill.category}</p>
                          <p className="text-gray-500 text-xs">{skill.years_experience} ans d'expérience</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingItem(skill.id);
                              setEditingSection('skills');
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteItem('skills', skill.id)}
                            className="text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                    {!editingItem && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${(skill.level / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{skill.level}/5</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projets */}
        <TabsContent value="projects">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white">Projets</CardTitle>
                  <CardDescription>Vos réalisations et projets</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleImportData} 
                    disabled={isImporting}
                    variant="outline"
                    className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                  >
                    {isImporting ? (
                      <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Database className="w-4 h-4 mr-2" />
                    )}
                    Importer projets
                  </Button>
                  <Button onClick={() => addItem('projects')} className="bg-purple-500 hover:bg-purple-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {(!cvData.projects || cvData.projects.length === 0) && (
                <div className="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Aucun projet</h3>
                  <p className="text-gray-400 mb-4">
                    Vous pouvez ajouter un nouveau projet ou importer vos projets existants depuis l'admin.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      onClick={handleImportData} 
                      disabled={isImporting}
                      variant="outline"
                      className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Importer projets existants
                    </Button>
                    <Button onClick={() => addItem('projects')} className="bg-purple-500 hover:bg-purple-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un nouveau projet
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cvData.projects?.map((project) => (
                  <div key={project.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    {editingSection === 'projects' && editingItem === project.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Nom du projet"
                          value={project.title || ''}
                          onChange={(e) => updateItem('projects', project.id, { title: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                        <textarea
                          placeholder="Description du projet"
                          value={project.description || ''}
                          onChange={(e) => updateItem('projects', project.id, { description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                        <input
                          type="text"
                          placeholder="Technologies (séparées par des virgules)"
                          value={project.technologies?.join(', ') || ''}
                          onChange={(e) => updateItem('projects', project.id, { 
                            technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                          })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="url"
                            placeholder="URL GitHub"
                            value={project.github_url || ''}
                            onChange={(e) => updateItem('projects', project.id, { github_url: e.target.value })}
                            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                          <input
                            type="url"
                            placeholder="URL Démo"
                            value={project.demo_url || ''}
                            onChange={(e) => updateItem('projects', project.id, { demo_url: e.target.value })}
                            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => { setEditingItem(null); setEditingSection(null); }}>
                            <Save className="w-4 h-4 mr-1" />
                            Sauver
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setEditingItem(null); setEditingSection(null); }}>
                            <X className="w-4 h-4 mr-1" />
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-white font-semibold">{project.title}</h3>
                          <p className="text-gray-400 text-sm">{project.description}</p>
                          {(project.github_url || project.demo_url) && (
                            <div className="flex gap-2 mt-2">
                              {project.github_url && (
                                <a 
                                  href={project.github_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 text-xs"
                                >
                                  GitHub
                                </a>
                              )}
                              {project.demo_url && (
                                <a 
                                  href={project.demo_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-green-400 hover:text-green-300 text-xs"
                                >
                                  Démo
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingItem(project.id);
                              setEditingSection('projects');
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteItem('projects', project.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    {project.technologies && project.technologies.length > 0 && !editingItem && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {project.technologies.map((tech, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Autres onglets... */}
        <TabsContent value="education">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white">Formation</CardTitle>
                  <CardDescription>Votre parcours éducatif</CardDescription>
                </div>
                <Button onClick={() => addItem('education')} className="bg-indigo-500 hover:bg-indigo-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cvData.education?.map((edu) => (
                  <div key={edu.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    {editingSection === 'education' && editingItem === edu.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Diplôme/Formation"
                            value={edu.title || ''}
                            onChange={(e) => updateItem('education', edu.id, { title: e.target.value })}
                            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                          <input
                            type="text"
                            placeholder="Institution"
                            value={edu.institution || ''}
                            onChange={(e) => updateItem('education', edu.id, { institution: e.target.value })}
                            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                          <input
                            type="text"
                            placeholder="Lieu"
                            value={edu.location || ''}
                            onChange={(e) => updateItem('education', edu.id, { location: e.target.value })}
                            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              placeholder="Date début"
                              value={edu.start_date || ''}
                              onChange={(e) => updateItem('education', edu.id, { start_date: e.target.value })}
                              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                            <input
                              type="date"
                              placeholder="Date fin"
                              value={edu.end_date || ''}
                              onChange={(e) => updateItem('education', edu.id, { end_date: e.target.value })}
                              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                          </div>
                        </div>
                        <textarea
                          placeholder="Description"
                          value={edu.description || ''}
                          onChange={(e) => updateItem('education', edu.id, { description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => { setEditingItem(null); setEditingSection(null); }}>
                            <Save className="w-4 h-4 mr-1" />
                            Sauver
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setEditingItem(null); setEditingSection(null); }}>
                            <X className="w-4 h-4 mr-1" />
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-white font-semibold">{edu.title}</h3>
                          <p className="text-gray-400">{edu.institution} • {edu.location}</p>
                          <p className="text-gray-500 text-sm">{edu.start_date} - {edu.end_date}</p>
                          {edu.description && <p className="text-gray-300 text-sm mt-2">{edu.description}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingItem(edu.id);
                              setEditingSection('education');
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteItem('education', edu.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="languages">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white">Langues</CardTitle>
                  <CardDescription>Vos compétences linguistiques</CardDescription>
                </div>
                <Button onClick={() => addItem('languages')} className="bg-teal-500 hover:bg-teal-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cvData.languages?.map((lang) => (
                  <div key={lang.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    {editingSection === 'languages' && editingItem === lang.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Langue"
                          value={lang.name || ''}
                          onChange={(e) => updateItem('languages', lang.id, { name: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                        <select
                          value={lang.level || ''}
                          onChange={(e) => updateItem('languages', lang.id, { level: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        >
                          <option value="">Niveau</option>
                          <option value="Débutant">Débutant</option>
                          <option value="Intermédiaire">Intermédiaire</option>
                          <option value="Avancé">Avancé</option>
                          <option value="Professionnel">Professionnel</option>
                          <option value="Natif">Natif</option>
                        </select>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => { setEditingItem(null); setEditingSection(null); }}>
                            <Save className="w-4 h-4 mr-1" />
                            Sauver
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setEditingItem(null); setEditingSection(null); }}>
                            <X className="w-4 h-4 mr-1" />
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-white font-medium">{lang.name}</h4>
                          <p className="text-gray-400 text-sm">{lang.level}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingItem(lang.id);
                              setEditingSection('languages');
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteItem('languages', lang.id)}
                            className="text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white">Réalisations</CardTitle>
                  <CardDescription>Vos accomplissements et points forts</CardDescription>
                </div>
                <Button 
                  onClick={() => {
                    const newAchievement = `Nouvelle réalisation ${cvData.achievements?.length + 1 || 1}`;
                    setCvData(prev => ({
                      ...prev,
                      achievements: [...(prev.achievements || []), newAchievement]
                    }));
                  }} 
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cvData.achievements?.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <Trophy className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => {
                        const newAchievements = [...cvData.achievements];
                        newAchievements[index] = e.target.value;
                        setCvData(prev => ({ ...prev, achievements: newAchievements }));
                      }}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newAchievements = cvData.achievements.filter((_, i) => i !== index);
                        setCvData(prev => ({ ...prev, achievements: newAchievements }));
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {(!cvData.achievements || cvData.achievements.length === 0) && (
                  <p className="text-gray-400 text-center py-8">
                    Aucune réalisation ajoutée. Cliquez sur "Ajouter" pour commencer.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CVDataManager;