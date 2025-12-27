// Script pour initialiser les traductions des témoignages
import { supabase } from '../config/supabase.js';

const initTestimonialsTranslations = async () => {
    console.log('🚀 Initialisation des traductions des témoignages...');
    
    try {
        // Vérifier si la table existe et récupérer les témoignages existants
        const { data: existingTestimonials, error: fetchError } = await supabase
            .from('testimonials')
            .select('*');
            
        if (fetchError) {
            console.error('❌ Erreur lors de la récupération des témoignages:', fetchError);
            return;
        }
        
        console.log(`📊 ${existingTestimonials?.length || 0} témoignages trouvés`);
        
        // Traductions prédéfinies pour les témoignages existants
        const translations = {
            "Working with this developer was an absolute pleasure. The attention to detail and technical expertise exceeded our expectations. Our project was delivered on time and within budget.": {
                content_fr: "Travailler avec ce développeur a été un vrai plaisir. L'attention aux détails et l'expertise technique ont dépassé nos attentes. Notre projet a été livré dans les temps et dans le budget.",
                content_nl: "Werken met deze ontwikkelaar was een waar genoegen. De aandacht voor detail en technische expertise overtrof onze verwachtingen. Ons project werd op tijd en binnen budget opgeleverd."
            },
            "Exceptional work! The solution provided was not only technically sound but also user-friendly. Great communication throughout the project.": {
                content_fr: "Travail exceptionnel ! La solution fournie était non seulement techniquement solide mais aussi conviviale. Excellente communication tout au long du projet.",
                content_nl: "Uitzonderlijk werk! De geleverde oplossing was niet alleen technisch degelijk maar ook gebruiksvriendelijk. Geweldige communicatie gedurende het hele project."
            },
            "The website redesign transformed our online presence. Performance improvements were remarkable, and our conversion rate increased by 40%.": {
                content_fr: "La refonte du site web a transformé notre présence en ligne. Les améliorations de performance étaient remarquables, et notre taux de conversion a augmenté de 40%.",
                content_nl: "Het herontwerp van de website transformeerde onze online aanwezigheid. Prestatie-verbeteringen waren opmerkelijk, en ons conversiepercentage steeg met 40%."
            }
        };
        
        // Mettre à jour chaque témoignage avec ses traductions
        for (const testimonial of existingTestimonials || []) {
            const translation = translations[testimonial.content];
            
            if (translation) {
                console.log(`🔄 Mise à jour des traductions pour: ${testimonial.name}`);
                
                const { error: updateError } = await supabase
                    .from('testimonials')
                    .update({
                        content_fr: translation.content_fr,
                        content_nl: translation.content_nl,
                        status: testimonial.status || 'approved' // S'assurer que le statut est défini
                    })
                    .eq('id', testimonial.id);
                    
                if (updateError) {
                    console.error(`❌ Erreur mise à jour témoignage ${testimonial.id}:`, updateError);
                } else {
                    console.log(`✅ Témoignage ${testimonial.id} mis à jour avec succès`);
                }
            }
        }
        
        console.log('🎉 Initialisation des traductions terminée !');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
    }
};

// Exporter pour utilisation dans d'autres scripts
export { initTestimonialsTranslations };

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    initTestimonialsTranslations();
}