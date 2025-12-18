#!/usr/bin/env node

// Script pour peupler la base de données avec des données CV
// Usage: bun run scripts/seed-cv-data.js

// Charger les variables d'environnement
import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '../.env') });

// Configuration Supabase directe
const supabaseUrl = 'https://ioeyngwcmjowcloezfmf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZXluZ3djbWpvd2Nsb2V6Zm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzgyMzEsImV4cCI6MjA4MDc1NDIzMX0.1oVPVx3bHRPEiDDdjs7LpwH5xaqPv_tYxTyN4In9pHg';

const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction de peuplement directe
const seedCVData = async () => {
  console.log('🌱 Début du peuplement des données CV...');

  try {
    // 1. Insérer les expériences
    console.log('📊 Insertion des expériences...');
    const experiences = [
      {
        title: 'Développeur Full Stack Senior',
        company: 'TechCorp Solutions',
        location: 'Paris, France',
        description: 'Développement d\'applications web modernes avec React et Node.js. Gestion d\'équipe de 3 développeurs juniors. Architecture et optimisation de bases de données.',
        start_date: '2022-01-01',
        end_date: null,
        current: true,
        type: 'work',
        technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
        achievements: [
          'Amélioration des performances de 40%',
          'Migration vers TypeScript',
          'Mise en place CI/CD',
          'Formation de l\'équipe junior'
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
          'Intégration Stripe et PayPal',
          'Optimisation SEO (+200% trafic)'
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
        achievements: [
          'Mention Bien',
          'Projet de fin d\'études en React'
        ]
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

console.log('🌱 Lancement du script de peuplement des données CV...');

seedCVData()
  .then(result => {
    if (result.success) {
      console.log('🎉 Succès !');
      console.log(`📊 Données insérées:`);
      console.log(`   - ${result.data.experiences} expériences`);
      console.log(`   - ${result.data.skills} compétences`);
      console.log(`   - ${result.data.projects} projets`);
      console.log(`   - ${result.data.testimonials} témoignages`);
      process.exit(0);
    } else {
      console.error('❌ Échec:', result.error);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });