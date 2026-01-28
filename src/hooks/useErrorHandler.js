// Hook pour gérer les erreurs de navigation et d'API
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const useErrorHandler = () => {
    const navigate = useNavigate();

    const handleError = useCallback((error, context = '') => {
        console.error(`Error in ${context}:`, error);

        // Gestion des erreurs spécifiques
        if (error.message?.includes('404') || error.status === 404) {
            navigate('/404', { replace: true });
            return;
        }

        if (error.message?.includes('403') || error.status === 403) {
            toast.error('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
            navigate('/', { replace: true });
            return;
        }

        if (error.message?.includes('500') || error.status === 500) {
            toast.error('Erreur serveur. Veuillez réessayer plus tard.');
            return;
        }

        // Erreur générique
        toast.error(error.message || 'Une erreur inattendue s\'est produite');
    }, [navigate]);

    const handleApiError = useCallback((error, fallbackMessage = 'Erreur de connexion') => {
        if (error.response) {
            // Erreur de réponse du serveur
            const status = error.response.status;
            const message = error.response.data?.message || error.response.statusText;
            
            handleError({ status, message }, 'API');
        } else if (error.request) {
            // Erreur de réseau
            toast.error('Problème de connexion. Vérifiez votre connexion internet.');
        } else {
            // Autre erreur
            handleError(error, 'API');
        }
    }, [handleError]);

    const handleAsyncError = useCallback((asyncFn, context = '') => {
        return async (...args) => {
            try {
                return await asyncFn(...args);
            } catch (error) {
                handleError(error, context);
                throw error; // Re-throw pour permettre la gestion locale si nécessaire
            }
        };
    }, [handleError]);

    return {
        handleError,
        handleApiError,
        handleAsyncError
    };
};