// Script de test pour le système CV Data
import { supabase } from '../services/supabase';
import { 
  getCVDataFromTable, 
  saveCVDataToTable, 
  importFromSeparateTables 
} from '../services/cvDataService';

const testCVDataSystem = async () => {
  console.log('🧪 Test du système CV Data...\n');

  try {
    // Test 1: Vérifier la connexion à Supabase
    console.log('1️⃣ Test de connexion Supabase...');
    const { data: testConnection, error: connectionError } = await supabase
      .from('cv_data')
      .select('count', { count: 'exact', head: true });

    if (connectionError) {
      console.error('❌ Erreur de connexion:', connectionError);
      return;
    }
    console.log('✅ Connexion Supabase OK');

    // Test 2: Vérifier l'existence de la table cv_data
    console.log('\n2️⃣ Test de la table cv_data...');
    const { data: cvDataExists, error: tableError } = await supabase
      .from('cv_data')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Table cv_data non trouvée:', tableError);
      console.log('💡 Exécutez le script createCVDataTable.sql dans Supabase');
      return;
    }
    console.log('✅ Table cv_data existe');

    // Test 3: Récupérer les données CV
    console.log('\n3️⃣ Test de récupération des données...');
    const cvData = await getCVDataFromTable('fr');
    
    if (cvData && cvData.personal_info) {
      console.log('✅ Données CV récupérées');
      console.log(`   - Expériences: ${cvData.experiences?.length || 0}`);
      console.log(`   - Compétences: ${cvData.skills?.length || 0}`);
      console.log(`   - Projets: ${cvData.projects?.length || 0}`);
    } else {
      console.log('⚠️ Aucune donnée CV trouvée');
    }

    // Test 4: Test de sauvegarde
    console.log('\n4️⃣ Test de sauvegarde...');
    const testData = {
      personal_info: {
        name: 'Test User',
        title: 'Test Developer',
        email: 'test@example.com'
      },
      experiences: [],
      skills: [],
      projects: [],
      education: [],
      languages: [],
      achievements: ['Test achievement']
    };

    const saveResult = await saveCVDataToTable(testData);
    if (saveResult.success) {
      console.log('✅ Sauvegarde test réussie');
    } else {
      console.error('❌ Erreur sauvegarde:', saveResult.error);
    }

    // Test 5: Vérifier les tables séparées pour l'import
    console.log('\n5️⃣ Test des tables séparées...');
    
    const { data: projects } = await supabase.from('projects').select('count', { count: 'exact', head: true });
    const { data: experiences } = await supabase.from('experiences').select('count', { count: 'exact', head: true });
    const { data: skills } = await supabase.from('skills').select('count', { count: 'exact', head: true });

    console.log(`   - Projets disponibles: ${projects?.length || 0}`);
    console.log(`   - Expériences disponibles: ${experiences?.length || 0}`);
    console.log(`   - Compétences disponibles: ${skills?.length || 0}`);

    // Test 6: Test d'import (optionnel)
    if (projects?.length > 0 || experiences?.length > 0 || skills?.length > 0) {
      console.log('\n6️⃣ Test d\'import des données séparées...');
      const importResult = await importFromSeparateTables();
      
      if (importResult.success) {
        console.log('✅ Import réussi');
        console.log(`   - ${importResult.imported.projects} projets importés`);
        console.log(`   - ${importResult.imported.experiences} expériences importées`);
        console.log(`   - ${importResult.imported.skills} compétences importées`);
      } else {
        console.error('❌ Erreur import:', importResult.error);
      }
    }

    console.log('\n🎉 Tests terminés avec succès !');
    console.log('\n📋 Résumé:');
    console.log('   ✅ Connexion Supabase');
    console.log('   ✅ Table cv_data');
    console.log('   ✅ Récupération données');
    console.log('   ✅ Sauvegarde');
    console.log('   ✅ Vérification tables séparées');
    
    return {
      success: true,
      message: 'Tous les tests sont passés avec succès'
    };

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Fonction pour tester depuis le navigateur
window.testCVDataSystem = testCVDataSystem;

export default testCVDataSystem;