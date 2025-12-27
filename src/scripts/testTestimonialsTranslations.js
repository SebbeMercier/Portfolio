// Script de test pour les traductions des témoignages
import { getVisibleTestimonials } from '../services/testimonialsService.js';

const testTranslations = async () => {
    console.log('🧪 Test des traductions des témoignages...\n');
    
    const languages = ['en', 'fr', 'nl'];
    
    for (const lang of languages) {
        console.log(`📝 Test pour la langue: ${lang.toUpperCase()}`);
        console.log('─'.repeat(50));
        
        try {
            const testimonials = await getVisibleTestimonials(lang);
            
            if (testimonials.length === 0) {
                console.log('⚠️  Aucun témoignage trouvé');
                continue;
            }
            
            testimonials.forEach((testimonial, index) => {
                console.log(`${index + 1}. ${testimonial.name} (${testimonial.role})`);
                console.log(`   "${testimonial.content.substring(0, 80)}..."`);
                console.log('');
            });
            
        } catch (error) {
            console.error(`❌ Erreur pour la langue ${lang}:`, error.message);
        }
        
        console.log('');
    }
    
    console.log('✅ Test terminé !');
};

// Exporter pour utilisation
export { testTranslations };

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    testTranslations();
}