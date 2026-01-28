// Script de test pour vérifier que le CV peut être généré
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import CVDocument from '../components/cv/CVGenerator';

const testCVPreview = async () => {
  console.log('🧪 Test de génération CV...');

  try {
    // Données de test
    const testData = {
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
          technologies: ['React', 'Node.js', 'TypeScript'],
          achievements: ['Amélioration des performances de 40%']
        }
      ],
      skills: [
        { id: 1, name: 'React', category: 'frontend', level: 5, years_experience: 4 },
        { id: 2, name: 'Node.js', category: 'backend', level: 4, years_experience: 3 }
      ],
      projects: [
        {
          id: 1,
          title: 'Portfolio Moderne',
          description: 'Site portfolio avec animations avancées',
          technologies: ['React', 'Tailwind CSS'],
          github_url: 'https://github.com/sebbe/portfolio',
          demo_url: 'https://sebbe-mercier.tech'
        }
      ],
      education: [],
      languages: [
        { id: 1, name: 'Français', level: 'Natif' },
        { id: 2, name: 'Anglais', level: 'Professionnel' }
      ],
      achievements: [
        'Développeur Full Stack expérimenté',
        'Spécialiste React et Node.js'
      ],
      language: 'fr',
      translations: {
        cv: {
          title: 'Curriculum Vitae',
          contact: 'Contact',
          summary: 'Profil',
          experience: 'Expérience',
          skills: 'Compétences',
          projects: 'Projets',
          education: 'Formation',
          languages: 'Langues',
          achievements: 'Réalisations'
        }
      }
    };

    console.log('📄 Génération du document PDF...');
    
    // Tester la génération
    const blob = await pdf(
      React.createElement(CVDocument, {
        cvData: testData,
        language: 'fr',
        translations: testData.translations
      })
    ).toBlob();

    console.log('✅ PDF généré avec succès !');
    console.log(`📊 Taille du blob: ${(blob.size / 1024).toFixed(2)} KB`);

    // Créer un lien de téléchargement pour test
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CV-Test.pdf';
    link.textContent = 'Télécharger CV Test';
    
    // Ajouter le lien à la page pour test
    document.body.appendChild(link);
    
    console.log('🎉 Test réussi ! Lien de téléchargement ajouté à la page.');
    
    return {
      success: true,
      blobSize: blob.size,
      downloadUrl: url
    };

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    console.error('Stack trace:', error.stack);
    
    return {
      success: false,
      error: error.message,
      stack: error.stack
    };
  }
};

// Fonction pour tester depuis le navigateur
window.testCVPreview = testCVPreview;

export default testCVPreview;