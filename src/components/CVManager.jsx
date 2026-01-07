// Composant pour gérer le système de CV dynamique - Version simplifiée
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, Eye, Database, RefreshCw, 
  CheckCircle, AlertCircle,
  BarChart3, Briefcase, Award
} from 'lucide-react';
import { useCVGenerator } from '../hooks/useCVGenerator';
import { getCVDownloadStats } from '../services/cvService';
import { logDatabaseStatus } from '../utils/testDatabase';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSelector from './LanguageSelector';
import toast from 'react-hot-toast';

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

const CVManager = () => {
  const { t } = useTranslation();
  const { 
    generateAndDownloadCV, 
    previewCV, 
    fetchCVData,
    cvData,
    isGenerating,
    error 
  } = useCVGenerator();

  const [stats, setStats] = useState({ total: 0, thisMonth: 0, sources: {} });
  const [isSeeding, setIsSeeding] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const loadData = useCallback(async () => {
    try {
      await fetchCVData();
      const downloadStats = await getCVDownloadStats();
      setStats(downloadStats);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erreur chargement données:', error);
    }
  }, [fetchCVData]);

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      toast.loading('Peuplement de la base de données...', { id: 'seed-data' });
      
      const result = await seedCVDataBrowser();
      
      if (result.success) {
        toast.success(`Données insérées ! ${result.data.experiences} exp, ${result.data.skills} skills, ${result.data.projects} projets`, 
          { id: 'seed-data', duration: 5000 });
        await loadData(); // Recharger les données
      } else {
        toast.error(`Erreur: ${result.error}`, { id: 'seed-data' });
      }
    } catch (error) {
      toast.error('Erreur lors du peuplement', { id: 'seed-data' });
      console.error('Erreur seed:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleTestDatabase = async () => {
    toast.loading('Test de la base de données...', { id: 'test-db' });
    
    try {
      const results = await logDatabaseStatus();
      
      if (results.connection && results.errors.length === 0) {
        toast.success('Base de données OK ! Vérifiez la console pour les détails.', { id: 'test-db', duration: 5000 });
      } else if (results.connection) {
        toast.error(`Connexion OK mais ${results.errors.length} erreur(s) détectée(s)`, { id: 'test-db', duration: 5000 });
      } else {
        toast.error('Échec de connexion à la base de données', { id: 'test-db', duration: 5000 });
      }
    } catch (error) {
      toast.error('Erreur lors du test', { id: 'test-db' });
      console.error('Erreur test DB:', error);
    }
  };

  // Version browser-compatible du seeding
  const seedCVDataBrowser = async () => {
    console.log('🌱 Début du peuplement des données CV...');

    try {
      // Import dynamique du service supabase
      const { supabase } = await import('../services/supabase');

      // 1. Insérer les expériences
      console.log('📊 Insertion des expériences...');
      const experiences = [
        {
          title: 'Développeur Full Stack Senior',
          company: 'TechCorp Solutions',
          location: 'Paris, France',
          description: 'Développement d\'applications web modernes avec React et Node.js. Gestion d\'équipe de 3 développeurs juniors.',
          start_date: '2022-01-01',
          end_date: null,
          current: true,
          type: 'work',
          technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
          achievements: [
            'Amélioration des performances de 40%',
            'Migration vers TypeScript',
            'Mise en place CI/CD'
          ]
        },
        {
          title: 'Développeur React',
          company: 'StartupInnovante',
          location: 'Lyon, France',
          description: 'Développement d\'une plateforme SaaS en React. Intégration d\'APIs tierces et optimisation SEO.',
          start_date: '2020-06-01',
          end_date: '2021-12-31',
          current: false,
          type: 'work',
          technologies: ['React', 'Redux', 'Node.js', 'MongoDB'],
          achievements: [
            'Développement de 0 à 10k utilisateurs',
            'Intégration Stripe et PayPal'
          ]
        },
        {
          title: 'Master Informatique',
          company: 'Université de Technologie',
          location: 'France',
          description: 'Spécialisation en développement web et bases de données.',
          start_date: '2017-09-01',
          end_date: '2019-06-30',
          current: false,
          type: 'education',
          technologies: ['Java', 'Python', 'SQL', 'JavaScript'],
          achievements: ['Mention Bien', 'Projet de fin d\'études en React']
        }
      ];

      const { error: expError } = await supabase
        .from('experiences')
        .upsert(experiences, { onConflict: 'title,company' });

      if (expError) {
        console.error('❌ Erreur insertion expériences:', expError);
      } else {
        console.log('✅ Expériences insérées');
      }

      // 2. Insérer les compétences
      console.log('🚀 Insertion des compétences...');
      const skills = [
        // Frontend
        { name: 'React', category: 'frontend', level: 5, years_experience: 4, color: '#61DAFB' },
        { name: 'TypeScript', category: 'frontend', level: 4, years_experience: 3, color: '#3178C6' },
        { name: 'Next.js', category: 'frontend', level: 4, years_experience: 2, color: '#000000' },
        { name: 'Tailwind CSS', category: 'frontend', level: 5, years_experience: 3, color: '#06B6D4' },
        { name: 'JavaScript', category: 'frontend', level: 5, years_experience: 5, color: '#F7DF1E' },
        
        // Backend
        { name: 'Node.js', category: 'backend', level: 4, years_experience: 4, color: '#339933' },
        { name: 'PostgreSQL', category: 'backend', level: 4, years_experience: 3, color: '#336791' },
        { name: 'Supabase', category: 'backend', level: 4, years_experience: 2, color: '#3ECF8E' },
        
        // Tools
        { name: 'Git', category: 'tools', level: 5, years_experience: 5, color: '#F05032' },
        { name: 'Docker', category: 'tools', level: 3, years_experience: 2, color: '#2496ED' },
        { name: 'AWS', category: 'tools', level: 3, years_experience: 2, color: '#FF9900' }
      ];

      const { error: skillsError } = await supabase
        .from('skills')
        .upsert(skills, { onConflict: 'name' });

      if (skillsError) {
        console.error('❌ Erreur insertion compétences:', skillsError);
      } else {
        console.log('✅ Compétences insérées');
      }

      // 3. Insérer les projets
      console.log('🎨 Insertion des projets...');
      const projects = [
        {
          title: 'E-commerce Modern',
          slug: 'ecommerce-modern',
          description: 'Plateforme e-commerce complète avec panier, paiements et gestion admin.',
          long_description: 'Développement d\'une plateforme e-commerce moderne avec React, Node.js et Stripe.',
          technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
          github_url: 'https://github.com/sebbe/ecommerce-modern',
          demo_url: 'https://ecommerce-demo.sebbe-mercier.tech',
          images: ['/images/projects/ecommerce-1.jpg'],
          featured: true,
          status: 'completed',
          start_date: '2023-01-01',
          end_date: '2023-03-31',
          client: 'Client Privé',
          category: 'E-commerce'
        },
        {
          title: 'Dashboard Analytics',
          slug: 'dashboard-analytics',
          description: 'Dashboard d\'analytics en temps réel avec graphiques interactifs.',
          long_description: 'Interface de visualisation de données avec graphiques D3.js.',
          technologies: ['React', 'D3.js', 'Node.js', 'MongoDB'],
          github_url: 'https://github.com/sebbe/dashboard-analytics',
          demo_url: 'https://dashboard-demo.sebbe-mercier.tech',
          images: ['/images/projects/dashboard-1.jpg'],
          featured: true,
          status: 'completed',
          start_date: '2023-04-01',
          end_date: '2023-06-30',
          client: 'StartupTech',
          category: 'SaaS'
        }
      ];

      const { error: projectsError } = await supabase
        .from('projects')
        .upsert(projects, { onConflict: 'slug' });

      if (projectsError) {
        console.error('❌ Erreur insertion projets:', projectsError);
      } else {
        console.log('✅ Projets insérés');
      }

      console.log('🎉 Peuplement des données CV terminé avec succès !');
      
      return {
        success: true,
        data: {
          experiences: experiences.length,
          skills: skills.length,
          projects: projects.length
        }
      };

    } catch (error) {
      console.error('❌ Erreur lors du peuplement:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1" />
            <div className="flex-1 text-center">
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {t('interface.cvManager', 'Gestionnaire CV Dynamique')}
              </h1>
            </div>
            <div className="flex-1 flex justify-end">
              <LanguageSelector />
            </div>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('interface.cvManagerDesc', 'Génération de CV basée sur les données de la base de données avec design moderne')}
          </p>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Database className="w-4 h-4 mr-2" />
            {t('interface.poweredBySupabase', 'Alimenté par Supabase')}
          </Badge>
        </motion.div>
      </div>

      {/* Stats Cards avec shadcn/ui */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Expériences</p>
                  <p className="text-2xl font-bold text-white">
                    {cvData?.experiences?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <Award className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Compétences</p>
                  <p className="text-2xl font-bold text-white">
                    {cvData?.skills?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Téléchargements</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Interface simplifiée - Actions principales uniquement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CV Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-purple-400" />
                Actions CV
              </CardTitle>
              <CardDescription className="text-gray-400">
                Générer, prévisualiser et télécharger votre CV
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => generateAndDownloadCV('manager')}
                disabled={isGenerating}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                size="lg"
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent 
                                rounded-full animate-spin mr-2" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Générer et Télécharger
              </Button>

              <Button
                onClick={previewCV}
                disabled={isGenerating}
                variant="outline"
                className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                size="lg"
              >
                <Eye className="w-4 h-4 mr-2" />
                Aperçu
              </Button>

              <Button
                onClick={loadData}
                variant="secondary"
                className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser les données
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Database Management */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-green-400" />
                Gestion Base de Données
              </CardTitle>
              <CardDescription className="text-gray-400">
                Peupler et gérer les données de votre CV
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleSeedData}
                disabled={isSeeding}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                size="lg"
              >
                {isSeeding ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent 
                                rounded-full animate-spin mr-2" />
                ) : (
                  <Database className="w-4 h-4 mr-2" />
                )}
                Peupler les données
              </Button>

              <Button
                onClick={handleTestDatabase}
                variant="outline"
                className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                size="lg"
              >
                <Database className="w-4 h-4 mr-2" />
                Tester la connexion DB
              </Button>

              <Alert className="bg-green-500/10 border-green-500/20">
                <AlertCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300">
                  Injecte des données d'exemple dans la base de données pour tester le système de CV dynamique.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* État du système */}
      <Card className="bg-white/5 border-white/10 mt-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            État du Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3">
              {cvData ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              )}
              <span className="text-white">
                Données CV: {cvData ? 'Chargées' : 'Non chargées'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {error ? (
                <AlertCircle className="w-5 h-5 text-red-400" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
              <span className="text-white">
                Système: {error ? 'Erreur' : 'Opérationnel'}
              </span>
            </div>
          </div>

          {lastUpdate && (
            <p className="text-sm text-gray-400 mb-4">
              Dernière mise à jour: {lastUpdate.toLocaleString('fr-FR')}
            </p>
          )}

          {error && (
            <Alert className="bg-red-500/10 border-red-500/20">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>


    </div>
  );
};

export default CVManager;