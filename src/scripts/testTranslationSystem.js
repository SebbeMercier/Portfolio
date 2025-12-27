// Script de test complet pour le système de traduction
import { 
    translateText, 
    translateTextWithCache, 
    getAvailableTranslationServices,
    getTranslationServiceRecommendations 
} from '../services/translationService.js';
import { getVisibleTestimonials } from '../services/testimonialsService.js';

const testTranslationSystem = async () => {
    console.log('🧪 Test du système de traduction des témoignages\n');
    
    // Test 0: Afficher les services disponibles
    console.log('0️⃣ Services de traduction disponibles');
    console.log('─'.repeat(50));
    
    const services = getAvailableTranslationServices();
    const recommendations = getTranslationServiceRecommendations();
    
    console.log(`Service recommandé: ${recommendations.recommended}\n`);
    
    services.forEach((service, index) => {
        const status = service.available ? '✅' : '❌';
        console.log(`${index + 1}. ${status} ${service.name} ${service.quality}`);
        console.log(`   ${service.description}`);
        console.log(`   Coût: ${service.cost}`);
        if (!service.available) {
            console.log(`   ⚠️  Variable d'environnement manquante`);
        }
        console.log('');
    });
    
    // Test 1: Traduction simple
    console.log('1️⃣ Test de traduction simple');
    console.log('─'.repeat(50));
    
    const testText = "This is a test message for translation.";
    console.log(`Original: "${testText}"`);
    
    try {
        const frTranslation = await translateText(testText, 'fr');
        const nlTranslation = await translateText(testText, 'nl');
        
        console.log(`Français: "${frTranslation}"`);
        console.log(`Nederlands: "${nlTranslation}"`);
        console.log('✅ Traduction simple réussie\n');
    } catch (error) {
        console.error('❌ Erreur traduction simple:', error.message);
        console.log('');
    }
    
    // Test 2: Traduction avec cache
    console.log('2️⃣ Test de traduction avec cache');
    console.log('─'.repeat(50));
    
    try {
        console.log('Premier appel (API)...');
        const start1 = Date.now();
        const cached1 = await translateTextWithCache(testText, 'fr', 'test');
        const time1 = Date.now() - start1;
        console.log(`Résultat: "${cached1}" (${time1}ms)`);
        
        console.log('Deuxième appel (cache)...');
        const start2 = Date.now();
        const cached2 = await translateTextWithCache(testText, 'fr', 'test');
        const time2 = Date.now() - start2;
        console.log(`Résultat: "${cached2}" (${time2}ms)`);
        
        console.log(`✅ Cache fonctionne (${time2 < time1 ? 'plus rapide' : 'même vitesse'})\n`);
    } catch (error) {
        console.error('❌ Erreur cache:', error.message);
        console.log('');
    }
    
    // Test 3: Témoignages traduits
    console.log('3️⃣ Test des témoignages traduits');
    console.log('─'.repeat(50));
    
    const languages = ['en', 'fr', 'nl'];
    
    for (const lang of languages) {
        try {
            console.log(`\n🌐 Langue: ${lang.toUpperCase()}`);
            const testimonials = await getVisibleTestimonials(lang);
            
            if (testimonials.length === 0) {
                console.log('⚠️  Aucun témoignage trouvé');
                continue;
            }
            
            testimonials.slice(0, 2).forEach((testimonial, index) => {
                console.log(`${index + 1}. ${testimonial.name}`);
                console.log(`   "${testimonial.content.substring(0, 80)}..."`);
            });
            
            console.log(`✅ ${testimonials.length} témoignages chargés`);
            
        } catch (error) {
            console.error(`❌ Erreur témoignages ${lang}:`, error.message);
        }
    }
    
    // Test 4: Performance
    console.log('\n4️⃣ Test de performance');
    console.log('─'.repeat(50));
    
    try {
        const testTexts = [
            "Short text",
            "This is a medium length text that should be translated properly.",
            "This is a much longer text that contains multiple sentences and should test the translation service's ability to handle longer content while maintaining accuracy and performance."
        ];
        
        for (let i = 0; i < testTexts.length; i++) {
            const text = testTexts[i];
            const start = Date.now();
            
            const translation = await translateText(text, 'fr');
            const time = Date.now() - start;
            
            console.log(`Texte ${i + 1} (${text.length} chars): ${time}ms`);
            console.log(`  "${translation.substring(0, 60)}..."`);
        }
        
        console.log('✅ Test de performance terminé');
        
    } catch (error) {
        console.error('❌ Erreur performance:', error.message);
    }
    
    console.log('\n🎉 Tests terminés !');
    console.log('\n💡 Conseils:');
    console.log('- Si les traductions échouent, vérifiez votre connexion internet');
    console.log('- LibreTranslate est gratuit mais peut être lent');
    console.log('- Ajoutez REACT_APP_GOOGLE_TRANSLATE_API_KEY pour de meilleures performances');
    console.log('- Les traductions sont mises en cache pour éviter les appels répétés');
};

// Fonction pour tester uniquement les témoignages
const testTestimonialsOnly = async () => {
    console.log('🎯 Test rapide des témoignages\n');
    
    const languages = ['en', 'fr', 'nl'];
    
    for (const lang of languages) {
        console.log(`${lang.toUpperCase()}:`);
        try {
            const testimonials = await getVisibleTestimonials(lang);
            console.log(`  ✅ ${testimonials.length} témoignages chargés`);
            
            if (testimonials.length > 0) {
                const first = testimonials[0];
                console.log(`  📝 "${first.content.substring(0, 50)}..."`);
            }
        } catch (error) {
            console.log(`  ❌ Erreur: ${error.message}`);
        }
    }
};

// Exporter les fonctions
export { testTranslationSystem, testTestimonialsOnly };

// Exécuter selon l'argument
const command = process.argv[2];

switch (command) {
    case 'full':
        testTranslationSystem();
        break;
    case 'quick':
        testTestimonialsOnly();
        break;
    default:
        console.log('Usage:');
        console.log('  node testTranslationSystem.js full   - Test complet');
        console.log('  node testTranslationSystem.js quick  - Test rapide témoignages');
}