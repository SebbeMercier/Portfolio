// Composant d'administration pour gérer les traductions des témoignages
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Languages, 
    RefreshCw, 
    Save, 
    Trash2, 
    Eye, 
    EyeOff, 
    Globe,
    CheckCircle,
    XCircle,
    Loader
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { getTestimonials, saveTestimonial } from '../services/testimonialsService';
import { translateTextWithCache, clearTranslationCache } from '../services/translationService';

const TestimonialsTranslationManager = () => {
    const { t, currentLanguage } = useTranslation();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [translating, setTranslating] = useState({});
    const [editingTranslations, setEditingTranslations] = useState({});

    useEffect(() => {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        setLoading(true);
        try {
            const data = await getTestimonials();
            setTestimonials(data);
        } catch (error) {
            console.error('Error loading testimonials:', error);
        }
        setLoading(false);
    };

    const translateTestimonial = async (testimonial, targetLanguage) => {
        const key = `${testimonial.id}_${targetLanguage}`;
        setTranslating(prev => ({ ...prev, [key]: true }));

        try {
            const translatedText = await translateTextWithCache(
                testimonial.content,
                targetLanguage,
                'testimonial',
                testimonial.id
            );

            // Mettre à jour le témoignage avec la traduction
            const updatedTestimonial = {
                ...testimonial,
                [`content_${targetLanguage}`]: translatedText
            };

            const result = await saveTestimonial(updatedTestimonial);
            
            if (result.success) {
                // Mettre à jour l'état local
                setTestimonials(prev => 
                    prev.map(t => 
                        t.id === testimonial.id 
                            ? { ...t, [`content_${targetLanguage}`]: translatedText }
                            : t
                    )
                );
            }
        } catch (error) {
            console.error('Translation error:', error);
        }

        setTranslating(prev => ({ ...prev, [key]: false }));
    };

    const saveTranslationEdit = async (testimonialId, language, newText) => {
        try {
            const testimonial = testimonials.find(t => t.id === testimonialId);
            if (!testimonial) return;

            const updatedTestimonial = {
                ...testimonial,
                [`content_${language}`]: newText
            };

            const result = await saveTestimonial(updatedTestimonial);
            
            if (result.success) {
                setTestimonials(prev => 
                    prev.map(t => 
                        t.id === testimonialId 
                            ? { ...t, [`content_${language}`]: newText }
                            : t
                    )
                );
                
                // Fermer l'édition
                setEditingTranslations(prev => ({
                    ...prev,
                    [`${testimonialId}_${language}`]: false
                }));
            }
        } catch (error) {
            console.error('Save error:', error);
        }
    };

    const clearCache = () => {
        clearTranslationCache();
        alert('Cache des traductions vidé !');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader className="w-8 h-8 animate-spin text-purple-500" />
                <span className="ml-2 text-gray-400">Chargement des témoignages...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Languages className="w-6 h-6 text-purple-500" />
                    <h2 className="text-xl font-bold text-white">
                        Gestion des Traductions - Témoignages
                    </h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={loadTestimonials}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Actualiser
                    </button>
                    <button
                        onClick={clearCache}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm text-white transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Vider Cache
                    </button>
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-gray-400">Total Témoignages</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{testimonials.length}</span>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-gray-400">Traduits FR</span>
                    </div>
                    <span className="text-2xl font-bold text-white">
                        {testimonials.filter(t => t.content_fr).length}
                    </span>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-orange-400" />
                        <span className="text-sm text-gray-400">Traduits NL</span>
                    </div>
                    <span className="text-2xl font-bold text-white">
                        {testimonials.filter(t => t.content_nl).length}
                    </span>
                </div>
            </div>

            {/* Liste des témoignages */}
            <div className="space-y-4">
                {testimonials.map((testimonial) => (
                    <motion.div
                        key={testimonial.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 rounded-lg p-6"
                    >
                        {/* Header du témoignage */}
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className="w-12 h-12 rounded-full object-cover"
                                onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=7c3aed&color=fff&size=48`;
                                }}
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                                <p className="text-gray-400">{testimonial.role} - {testimonial.company}</p>
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                {testimonial.isVisible ? (
                                    <Eye className="w-5 h-5 text-green-400" />
                                ) : (
                                    <EyeOff className="w-5 h-5 text-gray-500" />
                                )}
                            </div>
                        </div>

                        {/* Contenu original */}
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-300">🇬🇧 Original (EN)</span>
                            </div>
                            <p className="text-gray-300 italic bg-gray-700 p-3 rounded">
                                "{testimonial.content}"
                            </p>
                        </div>

                        {/* Traductions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Français */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-300">🇫🇷 Français</span>
                                    <div className="flex gap-2">
                                        {!testimonial.content_fr && (
                                            <button
                                                onClick={() => translateTestimonial(testimonial, 'fr')}
                                                disabled={translating[`${testimonial.id}_fr`]}
                                                className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded text-xs text-white transition-colors"
                                            >
                                                {translating[`${testimonial.id}_fr`] ? (
                                                    <Loader className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <Languages className="w-3 h-3" />
                                                )}
                                                Traduire
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {testimonial.content_fr ? (
                                    <div className="bg-gray-700 p-3 rounded">
                                        <p className="text-gray-200">"{testimonial.content_fr}"</p>
                                    </div>
                                ) : (
                                    <div className="bg-gray-700 p-3 rounded text-center">
                                        <span className="text-gray-500 text-sm">Pas encore traduit</span>
                                    </div>
                                )}
                            </div>

                            {/* Néerlandais */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-300">🇳🇱 Nederlands</span>
                                    <div className="flex gap-2">
                                        {!testimonial.content_nl && (
                                            <button
                                                onClick={() => translateTestimonial(testimonial, 'nl')}
                                                disabled={translating[`${testimonial.id}_nl`]}
                                                className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded text-xs text-white transition-colors"
                                            >
                                                {translating[`${testimonial.id}_nl`] ? (
                                                    <Loader className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <Languages className="w-3 h-3" />
                                                )}
                                                Traduire
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {testimonial.content_nl ? (
                                    <div className="bg-gray-700 p-3 rounded">
                                        <p className="text-gray-200">"{testimonial.content_nl}"</p>
                                    </div>
                                ) : (
                                    <div className="bg-gray-700 p-3 rounded text-center">
                                        <span className="text-gray-500 text-sm">Nog niet vertaald</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {testimonials.length === 0 && (
                <div className="text-center py-12">
                    <Languages className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Aucun témoignage trouvé</p>
                </div>
            )}
        </div>
    );
};

export default TestimonialsTranslationManager;