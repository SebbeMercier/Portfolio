// Script pour migrer et traduire les témoignages existants
import { supabase } from '../config/supabase.js';
import { translateTextWithCache } from '../services/translationService.js';

const migrateTestimonialsTranslations = async () => {
    console.log('🚀 Migration des traductions des témoignages...\n');
    
    try {
        // 1. Récupérer tous les témoignages existants
        console.log('📊 Récupération des témoignages existants...');
        const { data: testimonials, error: fetchError } = await supabase
            .from('testimonials')
            .select('*');
            
        if (fetchError) {
            console.error('❌ Erreur lors de la récupération:', fetchError);
            return;
        }
        
        if (!testimonials || testimonials.length === 0) {
            console.log('⚠️  Aucun témoignage trouvé');
            return;
        }
        
        console.log(`✅ ${testimonials.length} témoignages trouvés\n`);
        
        // 2. Traduire chaque témoignage
        const languages = ['fr', 'nl'];
        
        for (const testimonial of testimonials) {
            console.log(`🔄 Traitement: ${testimonial.name} (ID: ${testimonial.id})`);
            console.log(`   Original: "${testimonial.content.substring(0, 60)}..."`);
            
            const updates = {};
            
            // Traduire dans chaque langue
            for (const lang of languages) {
                const columnName = `content_${lang}`;
                
                // Vérifier si la traduction existe déjà
                if (testimonial[columnName]) {
                    console.log(`   ✓ ${lang.toUpperCase()}: Traduction existante`);
                    continue;
                }
                
                console.log(`   🌐 Traduction en ${lang.toUpperCase()}...`);
                
                try {
                    const translatedText = await translateTextWithCache(
                        testimonial.content,
                        lang,
                        'testimonial',
                        testimonial.id
                    );
                    
                    updates[columnName] = translatedText;
                    console.log(`   ✅ ${lang.toUpperCase()}: "${translatedText.substring(0, 60)}..."`);
                    
                    // Petite pause pour éviter de surcharger l'API
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                } catch (error) {
                    console.error(`   ❌ Erreur traduction ${lang}:`, error.message);
                }
            }
            
            // 3. Mettre à jour en base de données si on a des traductions
            if (Object.keys(updates).length > 0) {
                console.log(`   💾 Sauvegarde des traductions...`);
                
                const { error: updateError } = await supabase
                    .from('testimonials')
                    .update(updates)
                    .eq('id', testimonial.id);
                    
                if (updateError) {
                    console.error(`   ❌ Erreur sauvegarde:`, updateError);
                } else {
                    console.log(`   ✅ Sauvegarde réussie`);
                }
            }
            
            console.log(''); // Ligne vide pour la lisibilité
        }
        
        // 4. Vérification finale
        console.log('🔍 Vérification finale...');
        const { data: updatedTestimonials, error: verifyError } = await supabase
            .from('testimonials')
            .select('id, name, content_fr, content_nl');
            
        if (verifyError) {
            console.error('❌ Erreur vérification:', verifyError);
            return;
        }
        
        let translatedCount = 0;
        updatedTestimonials.forEach(t => {
            if (t.content_fr || t.content_nl) {
                translatedCount++;
            }
        });
        
        console.log(`✅ Migration terminée !`);
        console.log(`📊 ${translatedCount}/${updatedTestimonials.length} témoignages ont des traductions`);
        
    } catch (error) {
        console.error('❌ Erreur générale:', error);
    }
};

// Fonction pour nettoyer les traductions (utile pour les tests)
const cleanupTranslations = async () => {
    console.log('🧹 Nettoyage des traductions...');
    
    try {
        // Supprimer les colonnes de traduction
        const { error: updateError } = await supabase
            .from('testimonials')
            .update({
                content_fr: null,
                content_nl: null
            })
            .neq('id', 0); // Tous les enregistrements
            
        if (updateError) {
            console.error('❌ Erreur nettoyage:', updateError);
            return;
        }
        
        // Supprimer les traductions en cache
        const { error: deleteError } = await supabase
            .from('translations')
            .delete()
            .eq('content_type', 'testimonial');
            
        if (deleteError) {
            console.error('❌ Erreur suppression cache:', deleteError);
            return;
        }
        
        console.log('✅ Nettoyage terminé');
        
    } catch (error) {
        console.error('❌ Erreur nettoyage:', error);
    }
};

// Fonction pour afficher les statistiques
const showTranslationStats = async () => {
    console.log('📊 Statistiques des traductions...\n');
    
    try {
        // Stats des témoignages
        const { data: testimonials } = await supabase
            .from('testimonials')
            .select('id, name, content_fr, content_nl');
            
        console.log('Témoignages:');
        testimonials?.forEach(t => {
            const hasFr = t.content_fr ? '✅' : '❌';
            const hasNl = t.content_nl ? '✅' : '❌';
            console.log(`  ${t.name}: FR ${hasFr} | NL ${hasNl}`);
        });
        
        // Stats du cache de traductions
        const { data: translations, count } = await supabase
            .from('translations')
            .select('*', { count: 'exact' })
            .eq('content_type', 'testimonial');
            
        console.log(`\nCache de traductions: ${count || 0} entrées`);
        
        if (translations && translations.length > 0) {
            const byLang = translations.reduce((acc, t) => {
                acc[t.target_language] = (acc[t.target_language] || 0) + 1;
                return acc;
            }, {});
            
            Object.entries(byLang).forEach(([lang, count]) => {
                console.log(`  ${lang.toUpperCase()}: ${count} traductions`);
            });
        }
        
    } catch (error) {
        console.error('❌ Erreur stats:', error);
    }
};

// Exporter les fonctions
export { 
    migrateTestimonialsTranslations, 
    cleanupTranslations, 
    showTranslationStats 
};

// Exécuter selon l'argument de ligne de commande
const command = process.argv[2];

switch (command) {
    case 'migrate':
        migrateTestimonialsTranslations();
        break;
    case 'cleanup':
        cleanupTranslations();
        break;
    case 'stats':
        showTranslationStats();
        break;
    default:
        console.log('Usage:');
        console.log('  node migrateTestimonialsTranslations.js migrate  - Migrer les traductions');
        console.log('  node migrateTestimonialsTranslations.js cleanup  - Nettoyer les traductions');
        console.log('  node migrateTestimonialsTranslations.js stats    - Afficher les statistiques');
}