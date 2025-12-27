// Utilitaire pour tester la connexion à la base de données
import { supabase } from '../services/supabase';

export const testDatabaseConnection = async () => {
  console.log('🔍 Test de connexion à la base de données...');
  
  const results = {
    connection: false,
    tables: {},
    errors: []
  };

  try {
    // Test de connexion basique
    const { error: connectionError } = await supabase
      .from('experiences')
      .select('count', { count: 'exact', head: true });

    if (connectionError) {
      results.errors.push(`Connexion: ${connectionError.message}`);
      return results;
    }

    results.connection = true;
    console.log('✅ Connexion à Supabase OK');

    // Test de chaque table
    const tables = ['experiences', 'skills', 'projects', 'testimonials'];
    
    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(1);

        if (error) {
          results.tables[table] = { status: 'error', error: error.message };
          results.errors.push(`${table}: ${error.message}`);
        } else {
          results.tables[table] = { 
            status: 'ok', 
            count: count || 0,
            hasData: (count || 0) > 0,
            sample: data?.[0] || null
          };
        }
      } catch (err) {
        results.tables[table] = { status: 'error', error: err.message };
        results.errors.push(`${table}: ${err.message}`);
      }
    }

    // Test des requêtes CV spécifiques
    try {
      const { data: workExperiences } = await supabase
        .from('experiences')
        .select('*')
        .eq('type', 'work');

      const { data: featuredProjects } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true);

      results.cvQueries = {
        workExperiences: workExperiences?.length || 0,
        featuredProjects: featuredProjects?.length || 0
      };

    } catch (err) {
      results.errors.push(`Requêtes CV: ${err.message}`);
    }

  } catch (err) {
    results.errors.push(`Test général: ${err.message}`);
  }

  return results;
};

export const logDatabaseStatus = async () => {
  const results = await testDatabaseConnection();
  
  console.log('\n📊 RAPPORT DE TEST BASE DE DONNÉES');
  console.log('=====================================');
  
  if (results.connection) {
    console.log('✅ Connexion Supabase: OK');
  } else {
    console.log('❌ Connexion Supabase: ÉCHEC');
  }
  
  console.log('\n📋 État des tables:');
  Object.entries(results.tables).forEach(([table, info]) => {
    if (info.status === 'ok') {
      console.log(`✅ ${table}: ${info.count} entrées ${info.hasData ? '(avec données)' : '(vide)'}`);
    } else {
      console.log(`❌ ${table}: ${info.error}`);
    }
  });

  if (results.cvQueries) {
    console.log('\n🎯 Requêtes CV:');
    console.log(`   Expériences work: ${results.cvQueries.workExperiences}`);
    console.log(`   Projets featured: ${results.cvQueries.featuredProjects}`);
  }

  if (results.errors.length > 0) {
    console.log('\n❌ Erreurs détectées:');
    results.errors.forEach(error => console.log(`   - ${error}`));
  } else {
    console.log('\n🎉 Aucune erreur détectée !');
  }

  console.log('=====================================\n');
  
  return results;
};