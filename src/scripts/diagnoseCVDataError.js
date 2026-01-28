// Script de diagnostic pour identifier l'erreur d'initialisation CV Data
import { supabase } from '../services/supabase';

const diagnoseCVDataError = async () => {
  console.log('🔍 Diagnostic des erreurs CV Data...\n');

  try {
    // Test 1: Vérifier la connexion Supabase
    console.log('1️⃣ Test de connexion Supabase...');
    const { error: connectionError } = await supabase
      .from('projects') // Table qui existe sûrement
      .select('count', { count: 'exact', head: true });

    if (connectionError) {
      console.error('❌ Erreur de connexion Supabase:', connectionError);
      return { error: 'Connexion Supabase échouée', details: connectionError };
    }
    console.log('✅ Connexion Supabase OK');

    // Test 2: Vérifier si la table cv_data existe
    console.log('\n2️⃣ Vérification de la table cv_data...');
    const { error: tableError } = await supabase
      .from('cv_data')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Table cv_data non trouvée:', tableError);
      console.log('💡 Solution: Exécutez le script SQL createCVDataTable.sql dans Supabase');
      return { 
        error: 'Table cv_data manquante', 
        details: tableError,
        solution: 'Exécuter createCVDataTable.sql dans l\'éditeur SQL de Supabase'
      };
    }
    console.log('✅ Table cv_data existe');

    // Test 3: Vérifier les permissions d'écriture
    console.log('\n3️⃣ Test des permissions d\'écriture...');
    const testData = {
      personal_info: { name: 'Test' },
      experiences: [],
      skills: [],
      projects: [],
      education: [],
      languages: [],
      achievements: []
    };

    const { data: insertTest, error: insertError } = await supabase
      .from('cv_data')
      .insert([{ data: testData }])
      .select();

    if (insertError) {
      console.error('❌ Erreur d\'insertion:', insertError);
      
      // Vérifier si c'est un problème de RLS (Row Level Security)
      if (insertError.code === '42501' || insertError.message.includes('policy')) {
        console.log('💡 Problème de permissions RLS détecté');
        return {
          error: 'Permissions RLS',
          details: insertError,
          solution: 'Désactiver RLS sur la table cv_data ou configurer les politiques'
        };
      }
      
      return { error: 'Erreur d\'insertion', details: insertError };
    }

    console.log('✅ Permissions d\'écriture OK');

    // Test 4: Nettoyer le test et vérifier les données existantes
    console.log('\n4️⃣ Nettoyage et vérification des données...');
    
    // Supprimer l'entrée de test
    if (insertTest && insertTest[0]) {
      await supabase
        .from('cv_data')
        .delete()
        .eq('id', insertTest[0].id);
    }

    // Vérifier les données existantes
    const { data: existingData, error: selectError } = await supabase
      .from('cv_data')
      .select('*');

    if (selectError) {
      console.error('❌ Erreur de lecture:', selectError);
      return { error: 'Erreur de lecture', details: selectError };
    }

    console.log(`✅ Données existantes: ${existingData?.length || 0} entrée(s)`);

    if (existingData && existingData.length > 0) {
      console.log('📊 Première entrée:', {
        id: existingData[0].id,
        hasPersonalInfo: !!existingData[0].data?.personal_info,
        hasExperiences: !!existingData[0].data?.experiences,
        hasSkills: !!existingData[0].data?.skills,
        hasProjects: !!existingData[0].data?.projects
      });
    }

    console.log('\n🎉 Diagnostic terminé - Aucun problème détecté !');
    return { 
      success: true, 
      message: 'Système CV Data opérationnel',
      existingEntries: existingData?.length || 0
    };

  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
    return { error: 'Erreur générale', details: error };
  }
};

// Fonction pour tester depuis le navigateur
window.diagnoseCVDataError = diagnoseCVDataError;

export default diagnoseCVDataError;