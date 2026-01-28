// testimonialsService.js - Service pour gérer les témoignages avec Supabase
import { supabase } from '../config/supabase';
import { testimonialsData as defaultTestimonials } from '../data/testimonialsData';
import { translateTextWithCache } from './translationService';

const TESTIMONIALS_TABLE = 'testimonials';

// Récupérer tous les témoignages (pour l'admin)
export const getTestimonials = async () => {
    try {
        const { data, error } = await supabase
            .from(TESTIMONIALS_TABLE)
            .select('*')
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching testimonials:', error);
            return defaultTestimonials;
        }

        if (!data || data.length === 0) {
            console.log('No testimonials in Supabase, using defaults');
            return defaultTestimonials;
        }

        return data;
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return defaultTestimonials;
    }
};

// Récupérer seulement les témoignages approuvés et visibles (pour le frontend)
export const getVisibleTestimonials = async (language = 'en') => {
    try {
        const { data, error } = await supabase
            .from(TESTIMONIALS_TABLE)
            .select('*')
            .eq('isVisible', true)
            .eq('status', 'approved')
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching visible testimonials:', error);
            return await translateTestimonials(defaultTestimonials.filter(t => t.isVisible), language);
        }

        return await translateTestimonials(data || [], language);
    } catch (error) {
        console.error('Error fetching visible testimonials:', error);
        return await translateTestimonials(defaultTestimonials.filter(t => t.isVisible), language);
    }
};

// Traduire les témoignages selon la langue
const translateTestimonials = async (testimonials, language) => {
    if (language === 'en') {
        return testimonials; // Pas de traduction nécessaire pour l'anglais
    }
    
    const translatedTestimonials = await Promise.all(
        testimonials.map(async (testimonial) => {
            let translatedContent = testimonial.content;
            
            // Option 1: Vérifier si la traduction existe déjà dans les colonnes multilingues
            if (testimonial[`content_${language}`]) {
                translatedContent = testimonial[`content_${language}`];
            } else {
                // Option 2: Utiliser le service de traduction automatique avec cache
                translatedContent = await translateTextWithCache(
                    testimonial.content, 
                    language, 
                    'testimonial', 
                    testimonial.id
                );
            }
            
            return {
                ...testimonial,
                content: translatedContent
            };
        })
    );
    
    return translatedTestimonials;
};

// Sauvegarder un témoignage (créer ou mettre à jour)
export const saveTestimonial = async (testimonial) => {
    try {
        const { data, error } = await supabase
            .from(TESTIMONIALS_TABLE)
            .upsert(testimonial, { onConflict: 'id' })
            .select()
            .single();

        if (error) {
            console.error('Error saving testimonial:', error);
            return { success: false, error: error.message };
        }

        return { success: true, testimonial: data };
    } catch (error) {
        console.error('Error saving testimonial:', error);
        return { success: false, error: error.message };
    }
};

// Supprimer un témoignage
export const deleteTestimonial = async (testimonialId) => {
    try {
        const { error } = await supabase
            .from(TESTIMONIALS_TABLE)
            .delete()
            .eq('id', testimonialId);

        if (error) {
            console.error('Error deleting testimonial:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        return { success: false, error: error.message };
    }
};

// Mettre à jour la visibilité d'un témoignage
export const toggleTestimonialVisibility = async (testimonialId, isVisible) => {
    try {
        const { error } = await supabase
            .from(TESTIMONIALS_TABLE)
            .update({ isVisible })
            .eq('id', testimonialId);

        if (error) {
            console.error('Error updating testimonial visibility:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating testimonial visibility:', error);
        return { success: false, error: error.message };
    }
};

// Mettre à jour l'ordre des témoignages
export const updateTestimonialOrder = async (testimonialId, newOrder) => {
    try {
        const { error } = await supabase
            .from(TESTIMONIALS_TABLE)
            .update({ order: newOrder })
            .eq('id', testimonialId);

        if (error) {
            console.error('Error updating testimonial order:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating testimonial order:', error);
        return { success: false, error: error.message };
    }
};

// Initialiser Supabase avec les témoignages par défaut
export const initializeTestimonials = async () => {
    try {
        const { data: existingTestimonials } = await supabase
            .from(TESTIMONIALS_TABLE)
            .select('id')
            .limit(1);

        if (existingTestimonials && existingTestimonials.length > 0) {
            return { success: true, message: 'Testimonials already exist' };
        }

        console.log('Initializing Supabase with default testimonials...');

        const { error } = await supabase
            .from(TESTIMONIALS_TABLE)
            .insert(defaultTestimonials);

        if (error) {
            console.error('Error initializing testimonials:', error);
            return { success: false, error: error.message };
        }

        console.log('Testimonials initialized successfully!');
        return { success: true, message: 'Initialized with default testimonials' };
    } catch (error) {
        console.error('Error initializing testimonials:', error);
        return { success: false, error: error.message };
    }
};