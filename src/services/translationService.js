// Service de traduction automatique
import { supabase } from '../config/supabase';

// Cache des traductions pour éviter les appels répétés
const translationCache = new Map();

// Fonction pour générer une clé de cache
const getCacheKey = (text, targetLang) => `${text.substring(0, 50)}_${targetLang}`;

// Service de traduction avec DeepL (recommandé - très précis)
const translateWithDeepL = async (text, targetLanguage) => {
    const API_KEY = process.env.REACT_APP_DEEPL_API_KEY;
    const API_URL = process.env.REACT_APP_DEEPL_API_URL || 'https://api-free.deepl.com/v2/translate';
    
    if (!API_KEY) {
        throw new Error('DeepL API key not found');
    }

    try {
        // Mapper les codes de langue pour DeepL
        const deepLLanguageMap = {
            'fr': 'FR',
            'nl': 'NL',
            'de': 'DE',
            'es': 'ES',
            'it': 'IT',
            'pt': 'PT',
            'pl': 'PL',
            'ru': 'RU',
            'ja': 'JA',
            'zh': 'ZH'
        };

        const targetLang = deepLLanguageMap[targetLanguage];
        if (!targetLang) {
            throw new Error(`Language ${targetLanguage} not supported by DeepL`);
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                text: text,
                source_lang: 'EN',
                target_lang: targetLang,
                preserve_formatting: '1'
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`DeepL API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        return result.translations?.[0]?.text || text;
    } catch (error) {
        console.error('DeepL error:', error);
        throw error;
    }
};

// Service de traduction avec Azure Translator (Microsoft)
const translateWithAzure = async (text, targetLanguage) => {
    const API_KEY = process.env.REACT_APP_AZURE_TRANSLATOR_KEY;
    const REGION = process.env.REACT_APP_AZURE_TRANSLATOR_REGION || 'global';
    
    if (!API_KEY) {
        throw new Error('Azure Translator API key not found');
    }

    try {
        const response = await fetch(`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${targetLanguage}`, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': API_KEY,
                'Ocp-Apim-Subscription-Region': REGION,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([{ text: text }])
        });

        if (!response.ok) {
            throw new Error(`Azure Translator API error: ${response.status}`);
        }

        const result = await response.json();
        return result[0]?.translations?.[0]?.text || text;
    } catch (error) {
        console.error('Azure Translator error:', error);
        throw error;
    }
};

// Service de traduction automatique utilisant l'API LibreTranslate (gratuite)
const translateWithLibreTranslate = async (text, targetLanguage) => {
    const API_URL = process.env.REACT_APP_LIBRETRANSLATE_URL || 'https://libretranslate.de/translate';
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                source: 'en',
                target: targetLanguage,
                format: 'text'
            })
        });

        if (!response.ok) {
            throw new Error(`LibreTranslate API error: ${response.status}`);
        }

        const result = await response.json();
        return result.translatedText || text;
    } catch (error) {
        console.error('LibreTranslate error:', error);
        throw error;
    }
};

// Service de traduction avec Google Translate (nécessite une clé API)
const translateWithGoogle = async (text, targetLanguage) => {
    const API_KEY = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY;
    
    if (!API_KEY) {
        console.warn('Google Translate API key not found');
        return text;
    }

    try {
        const response = await fetch(
            `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    source: 'en',
                    target: targetLanguage,
                    format: 'text'
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Google Translate API error: ${response.status}`);
        }

        const result = await response.json();
        return result.data.translations[0].translatedText || text;
    } catch (error) {
        console.error('Google Translate error:', error);
        return text;
    }
};

// Fonction principale de traduction avec cache et fallback intelligent
export const translateText = async (text, targetLanguage, sourceLanguage = 'en') => {
    // Si c'est déjà dans la langue cible, pas besoin de traduire
    if (sourceLanguage === targetLanguage) {
        return text;
    }

    // Vérifier le cache
    const cacheKey = getCacheKey(text, targetLanguage);
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey);
    }

    // Services de traduction par ordre de priorité (qualité/précision)
    const translationServices = [
        {
            name: 'DeepL',
            fn: translateWithDeepL,
            condition: () => process.env.REACT_APP_DEEPL_API_KEY,
            priority: 1
        },
        {
            name: 'Azure Translator',
            fn: translateWithAzure,
            condition: () => process.env.REACT_APP_AZURE_TRANSLATOR_KEY,
            priority: 2
        },
        {
            name: 'Google Translate',
            fn: translateWithGoogle,
            condition: () => process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY,
            priority: 3
        },
        {
            name: 'LibreTranslate',
            fn: translateWithLibreTranslate,
            condition: () => true, // Toujours disponible (gratuit)
            priority: 4
        }
    ];

    // Filtrer et trier les services disponibles
    const availableServices = translationServices
        .filter(service => service.condition())
        .sort((a, b) => a.priority - b.priority);

    let translatedText = text;
    let usedService = null;

    // Essayer chaque service dans l'ordre de priorité
    for (const service of availableServices) {
        try {
            console.log(`🌐 Tentative de traduction avec ${service.name}...`);
            translatedText = await service.fn(text, targetLanguage);
            
            // Si la traduction a réussi (texte différent de l'original)
            if (translatedText && translatedText !== text) {
                usedService = service.name;
                console.log(`✅ Traduction réussie avec ${service.name}`);
                break;
            }
        } catch (error) {
            console.warn(`⚠️ ${service.name} a échoué:`, error.message);
            // Continuer avec le service suivant
        }
    }

    // Mettre en cache le résultat avec info du service utilisé
    if (translatedText !== text) {
        translationCache.set(cacheKey, translatedText);
        console.log(`💾 Traduction mise en cache (${usedService})`);
    }
    
    return translatedText;
};

// Sauvegarder une traduction en base de données
export const saveTranslationToDB = async (originalText, translatedText, targetLanguage, contentType = 'testimonial', contentId = null) => {
    try {
        const { error } = await supabase
            .from('translations')
            .upsert([
                {
                    original_text: originalText,
                    translated_text: translatedText,
                    target_language: targetLanguage,
                    content_type: contentType,
                    content_id: contentId,
                    created_at: new Date().toISOString()
                }
            ], {
                onConflict: 'original_text,target_language,content_type'
            });

        if (error) {
            console.error('Error saving translation:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error saving translation:', error);
        return false;
    }
};

// Récupérer une traduction depuis la base de données
export const getTranslationFromDB = async (originalText, targetLanguage, contentType = 'testimonial') => {
    try {
        const { data, error } = await supabase
            .from('translations')
            .select('translated_text')
            .eq('original_text', originalText)
            .eq('target_language', targetLanguage)
            .eq('content_type', contentType)
            .single();

        if (error || !data) {
            return null;
        }

        return data.translated_text;
    } catch (error) {
        console.error('Error fetching translation:', error);
        return null;
    }
};

// Traduire un texte avec cache DB et API
export const translateTextWithCache = async (text, targetLanguage, contentType = 'testimonial', contentId = null) => {
    // Vérifier d'abord en base de données
    const cachedTranslation = await getTranslationFromDB(text, targetLanguage, contentType);
    if (cachedTranslation) {
        return cachedTranslation;
    }

    // Sinon, traduire avec l'API
    const translatedText = await translateText(text, targetLanguage);
    
    // Sauvegarder en base pour la prochaine fois
    if (translatedText !== text) {
        await saveTranslationToDB(text, translatedText, targetLanguage, contentType, contentId);
    }

    return translatedText;
};

// Nettoyer le cache (utile pour les tests)
export const clearTranslationCache = () => {
    translationCache.clear();
};

// Obtenir les statistiques du cache
export const getCacheStats = () => {
    return {
        size: translationCache.size,
        keys: Array.from(translationCache.keys())
    };
};

// Obtenir les services de traduction disponibles
export const getAvailableTranslationServices = () => {
    const services = [
        {
            name: 'DeepL',
            available: !!process.env.REACT_APP_DEEPL_API_KEY,
            quality: '⭐⭐⭐⭐⭐',
            cost: 'Gratuit (500k chars/mois) puis payant',
            languages: ['FR', 'NL', 'DE', 'ES', 'IT', 'PT', 'PL', 'RU', 'JA', 'ZH'],
            description: 'Le plus précis, excellent pour les langues européennes'
        },
        {
            name: 'Azure Translator',
            available: !!process.env.REACT_APP_AZURE_TRANSLATOR_KEY,
            quality: '⭐⭐⭐⭐',
            cost: 'Gratuit (2M chars/mois) puis payant',
            languages: ['FR', 'NL', 'DE', 'ES', 'IT', 'PT', 'RU', 'JA', 'ZH', '+60 langues'],
            description: 'Très bon, support de nombreuses langues'
        },
        {
            name: 'Google Translate',
            available: !!process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY,
            quality: '⭐⭐⭐⭐',
            cost: 'Payant ($20/1M chars)',
            languages: ['FR', 'NL', 'DE', 'ES', 'IT', 'PT', 'RU', 'JA', 'ZH', '+100 langues'],
            description: 'Très répandu, support de nombreuses langues'
        },
        {
            name: 'LibreTranslate',
            available: true,
            quality: '⭐⭐⭐',
            cost: 'Gratuit (open source)',
            languages: ['FR', 'NL', 'DE', 'ES', 'IT', 'PT', 'RU', 'JA', 'ZH'],
            description: 'Gratuit mais plus lent, qualité correcte'
        }
    ];

    return services;
};

// Recommandations pour choisir un service
export const getTranslationServiceRecommendations = () => {
    return {
        recommended: 'DeepL',
        reasons: [
            '🎯 Qualité de traduction supérieure',
            '💰 500k caractères gratuits par mois',
            '🇪🇺 Excellent pour FR/NL/DE',
            '⚡ API rapide et fiable',
            '📊 Utilisé par les professionnels'
        ],
        alternatives: {
            'Azure Translator': 'Si vous avez déjà un compte Microsoft Azure',
            'Google Translate': 'Si vous utilisez déjà d\'autres services Google',
            'LibreTranslate': 'Pour un usage gratuit sans limite (mais plus lent)'
        },
        setup: {
            deepl: {
                url: 'https://www.deepl.com/pro-api',
                steps: [
                    '1. Créer un compte DeepL API (gratuit)',
                    '2. Récupérer votre clé API',
                    '3. Ajouter REACT_APP_DEEPL_API_KEY dans .env',
                    '4. 500k caractères gratuits par mois'
                ]
            }
        }
    };
};