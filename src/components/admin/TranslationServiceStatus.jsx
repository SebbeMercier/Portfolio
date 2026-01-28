// Composant pour afficher le statut des services de traduction
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Settings, 
    CheckCircle, 
    XCircle, 
    Info, 
    ExternalLink,
    ChevronDown,
    ChevronUp,
    Star,
    Zap,
    Globe
} from 'lucide-react';
import { 
    getAvailableTranslationServices, 
    getTranslationServiceRecommendations,
    getCacheStats 
} from '../services/translationService';

const TranslationServiceStatus = () => {
    const [showDetails, setShowDetails] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(false);
    
    const services = getAvailableTranslationServices();
    const recommendations = getTranslationServiceRecommendations();
    const cacheStats = getCacheStats();
    
    const availableServices = services.filter(s => s.available);
    const unavailableServices = services.filter(s => !s.available);

    return (
        <div className="space-y-4">
            {/* Header avec statut global */}
            <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-purple-400" />
                        <div>
                            <h3 className="text-lg font-semibold text-white">
                                Services de Traduction
                            </h3>
                            <p className="text-sm text-gray-400">
                                {availableServices.length} service{availableServices.length > 1 ? 's' : ''} configuré{availableServices.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Cache: {cacheStats.size} traductions</span>
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            {showDetails ? (
                                <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showDetails && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                    >
                        {/* Services disponibles */}
                        {availableServices.length > 0 && (
                            <div className="bg-gray-800 rounded-lg p-4">
                                <h4 className="text-md font-semibold text-green-400 mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Services Actifs
                                </h4>
                                <div className="space-y-3">
                                    {availableServices.map((service, index) => (
                                        <div key={service.name} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-white">
                                                        #{index + 1} {service.name}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {service.quality}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-300">{service.cost}</p>
                                                <p className="text-xs text-gray-500">{service.languages.slice(0, 3).join(', ')}...</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Services non configurés */}
                        {unavailableServices.length > 0 && (
                            <div className="bg-gray-800 rounded-lg p-4">
                                <h4 className="text-md font-semibold text-orange-400 mb-3 flex items-center gap-2">
                                    <XCircle className="w-4 h-4" />
                                    Services Non Configurés
                                </h4>
                                <div className="space-y-2">
                                    {unavailableServices.map((service) => (
                                        <div key={service.name} className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-300">{service.name}</span>
                                                <span className="text-xs text-gray-500">{service.quality}</span>
                                            </div>
                                            <span className="text-xs text-gray-500">Clé API manquante</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recommandations */}
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-md font-semibold text-blue-400 flex items-center gap-2">
                                    <Star className="w-4 h-4" />
                                    Recommandations
                                </h4>
                                <button
                                    onClick={() => setShowRecommendations(!showRecommendations)}
                                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                >
                                    {showRecommendations ? 'Masquer' : 'Voir détails'}
                                    <Info className="w-3 h-3" />
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm text-white font-medium">
                                    Service recommandé: {recommendations.recommended}
                                </span>
                            </div>

                            <AnimatePresence>
                                {showRecommendations && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-3 space-y-3"
                                    >
                                        <div>
                                            <h5 className="text-sm font-medium text-gray-300 mb-2">Pourquoi DeepL ?</h5>
                                            <ul className="space-y-1">
                                                {recommendations.reasons.map((reason, index) => (
                                                    <li key={index} className="text-xs text-gray-400 flex items-center gap-2">
                                                        <span>{reason}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h5 className="text-sm font-medium text-gray-300 mb-2">Configuration DeepL</h5>
                                            <div className="bg-gray-700 p-3 rounded text-xs space-y-1">
                                                {recommendations.setup.deepl.steps.map((step, index) => (
                                                    <p key={index} className="text-gray-300">{step}</p>
                                                ))}
                                                <a
                                                    href={recommendations.setup.deepl.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 mt-2"
                                                >
                                                    Créer un compte DeepL
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Ordre de priorité */}
                        <div className="bg-gray-800 rounded-lg p-4">
                            <h4 className="text-md font-semibold text-purple-400 mb-3 flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                Ordre de Priorité
                            </h4>
                            <p className="text-xs text-gray-400 mb-3">
                                Le système essaie les services dans cet ordre jusqu'à ce qu'une traduction réussisse :
                            </p>
                            <div className="space-y-2">
                                {services.map((service, index) => (
                                    <div key={service.name} className="flex items-center gap-3 text-sm">
                                        <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs">
                                            {index + 1}
                                        </span>
                                        <span className={service.available ? 'text-white' : 'text-gray-500'}>
                                            {service.name}
                                        </span>
                                        {service.available ? (
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-gray-500" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TranslationServiceStatus;