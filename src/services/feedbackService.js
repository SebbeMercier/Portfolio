// feedbackService.js - Service sécurisé pour les avis clients
import { supabase } from '../config/supabase';

const TESTIMONIALS_TABLE = 'testimonials';

// Soumettre un témoignage (avec sécurité renforcée)
export const submitTestimonial = async (feedbackData) => {
    try {
        // Validation côté client
        if (!feedbackData.name || !feedbackData.email || !feedbackData.content) {
            return { success: false, error: 'Required fields are missing' };
        }

        if (!feedbackData.captchaToken) {
            return { success: false, error: 'Security verification required' };
        }

        // Vérifier le captcha Cloudflare Turnstile
        const captchaValid = await verifyCaptcha(feedbackData.captchaToken);
        if (!captchaValid) {
            return { success: false, error: 'Security verification failed' };
        }

        // Nettoyer et valider les données (sans ID, laisser Supabase le gérer)
        const now = new Date().toISOString();
        const cleanData = {
            // Pas d'ID - laisser Supabase l'auto-générer
            name: sanitizeInput(feedbackData.name),
            email: sanitizeInput(feedbackData.email).toLowerCase(),
            role: sanitizeInput(feedbackData.role || ''),
            company: sanitizeInput(feedbackData.company || ''),
            content: sanitizeInput(feedbackData.content),
            rating: Math.max(1, Math.min(5, parseInt(feedbackData.rating) || 5)),
            project_type: sanitizeInput(feedbackData.projectType || ''),
            work_duration: sanitizeInput(feedbackData.workDuration || ''),
            would_recommend: Boolean(feedbackData.wouldRecommend),
            submitted_at: now,
            status: 'pending', // pending, approved, rejected
            isVisible: false, // Pas visible tant que pas approuvé
            ip_address: 'hidden', // Sera récupéré côté serveur si nécessaire
            user_agent: feedbackData.userAgent || '',
            order: 999, // Ordre par défaut (sera ajusté lors de l'approbation)
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(feedbackData.name)}&background=7c3aed&color=fff&size=150`,
            createdAt: now
        };

        // Vérifier les doublons (même email dans les 24h)
        const { data: recentSubmissions, error: checkError } = await supabase
            .from(TESTIMONIALS_TABLE)
            .select('id')
            .eq('email', cleanData.email)
            .gte('submitted_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .limit(1);

        // Si la table n'existe pas, on retourne une erreur explicite
        if (checkError && checkError.code === '42P01') {
            return { 
                success: false, 
                error: 'Testimonials table not found. Please run the SQL from fix_testimonials_table.sql in your Supabase SQL Editor.' 
            };
        }

        if (recentSubmissions && recentSubmissions.length > 0) {
            return { 
                success: false, 
                error: 'You have already submitted feedback recently. Please wait 24 hours before submitting again.' 
            };
        }

        // Insérer dans la base de données
        const { data, error } = await supabase
            .from(TESTIMONIALS_TABLE)
            .insert([cleanData])
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            console.error('Error details:', error.details);
            
            // Si la table n'existe pas
            if (error.code === '42P01') {
                return { 
                    success: false, 
                    error: 'Testimonials table not found. Please run the SQL from fix_testimonials_table.sql in your Supabase SQL Editor.' 
                };
            }
            
            // Si une colonne n'existe pas
            if (error.code === '42703') {
                return { 
                    success: false, 
                    error: `Database column missing: ${error.message}. Please run the SQL from fix_testimonials_table.sql to add missing columns.` 
                };
            }
            
            // Autres erreurs de base de données
            return { 
                success: false, 
                error: `Database error: ${error.message}. Check the console for details.` 
            };
        }

        // Envoyer une notification (optionnel)
        await sendNotification(cleanData);

        return { 
            success: true, 
            message: 'Feedback submitted successfully! It will be reviewed before publication.',
            data 
        };

    } catch (error) {
        console.error('Submission error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
};

// Vérifier le captcha Cloudflare Turnstile
const verifyCaptcha = async (token) => {
    try {
        // En production, cette vérification devrait être faite côté serveur
        // Pour l'instant, on simule une vérification basique
        if (!token || token.length < 10) {
            return false;
        }

        // TODO: Implémenter la vérification serveur avec l'API Cloudflare
        // const response = await fetch('/api/verify-captcha', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ token })
        // });
        // return response.ok;

        return true; // Temporaire - à remplacer par une vraie vérification
    } catch (error) {
        console.error('Captcha verification error:', error);
        return false;
    }
};

// Nettoyer les entrées utilisateur
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    
    return input
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Supprimer les scripts
        .replace(/<[^>]*>/g, '') // Supprimer les balises HTML
        .replace(/[<>'"&]/g, (char) => { // Échapper les caractères dangereux
            const entities = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '&': '&amp;'
            };
            return entities[char] || char;
        })
        .substring(0, 1000); // Limiter la longueur
};

// Envoyer une notification (optionnel)
const sendNotification = async (feedbackData) => {
    try {
        // Ici tu peux ajouter une notification par email, Slack, etc.
        console.log('New feedback submitted:', {
            name: feedbackData.name,
            email: feedbackData.email,
            rating: feedbackData.rating,
            submittedAt: feedbackData.submittedAt
        });
        
        // Exemple avec une webhook Slack ou Discord
        // await fetch(process.env.REACT_APP_WEBHOOK_URL, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         text: `New feedback from ${feedbackData.name} (${feedbackData.rating}⭐)`
        //     })
        // });
    } catch (error) {
        console.error('Notification error:', error);
        // Ne pas faire échouer la soumission si la notification échoue
    }
};

// Récupérer les soumissions en attente (pour l'admin)
export const getPendingFeedback = async () => {
    try {
        const { data, error } = await supabase
            .from(TESTIMONIALS_TABLE)
            .select('*')
            .eq('status', 'pending')
            .order('submitted_at', { ascending: false });

        if (error) {
            console.error('Error fetching pending feedback:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching pending feedback:', error);
        return [];
    }
};

// Approuver un témoignage (admin)
export const approveFeedback = async (feedbackId, approvalData = {}) => {
    try {
        // Obtenir le prochain ordre pour les témoignages approuvés
        const nextOrder = await getNextOrder();
        
        const updateData = {
            status: 'approved',
            isVisible: true,
            approved_at: new Date().toISOString(),
            order: nextOrder,
            ...approvalData
        };

        const { error } = await supabase
            .from(TESTIMONIALS_TABLE)
            .update(updateData)
            .eq('id', feedbackId);

        if (error) {
            console.error('Error approving feedback:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Error approving feedback:', error);
        return { success: false, error: error.message };
    }
};

// Rejeter un témoignage (admin) - supprime automatiquement de la DB
export const rejectFeedback = async (feedbackId, reason = '') => {
    try {
        // Optionnel : Log la raison du rejet avant suppression
        if (reason) {
            console.log(`Rejecting feedback ${feedbackId} for reason: ${reason}`);
        }

        // Supprimer directement de la base de données
        const { error } = await supabase
            .from(TESTIMONIALS_TABLE)
            .delete()
            .eq('id', feedbackId);

        if (error) {
            console.error('Error deleting rejected feedback:', error);
            return { success: false, error: error.message };
        }

        return { success: true, message: 'Feedback rejected and removed from database' };
    } catch (error) {
        console.error('Error deleting rejected feedback:', error);
        return { success: false, error: error.message };
    }
};

// Nettoyer les anciens avis rejetés (fonction utilitaire)
export const cleanupRejectedFeedback = async () => {
    try {
        const { data, error } = await supabase
            .from(TESTIMONIALS_TABLE)
            .delete()
            .eq('status', 'rejected');

        if (error) {
            console.error('Error cleaning up rejected feedback:', error);
            return { success: false, error: error.message };
        }

        return { 
            success: true, 
            message: `Cleaned up ${data?.length || 0} rejected feedback entries` 
        };
    } catch (error) {
        console.error('Error cleaning up rejected feedback:', error);
        return { success: false, error: error.message };
    }
};

// Obtenir le prochain ordre pour les témoignages approuvés
const getNextOrder = async () => {
    try {
        const { data } = await supabase
            .from(TESTIMONIALS_TABLE)
            .select('order')
            .eq('status', 'approved')
            .order('order', { ascending: false })
            .limit(1);

        return (data && data[0] ? data[0].order : 0) + 1;
    } catch (error) {
        return 1;
    }
};