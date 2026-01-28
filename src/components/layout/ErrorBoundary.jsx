// Composant Error Boundary pour capturer les erreurs React
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        
        // Log l'erreur pour le debug
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback 
                error={this.state.error} 
                resetError={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            />;
        }

        return this.props.children;
    }
}

const ErrorFallback = ({ error, resetError }) => {
    const navigate = useNavigate();

    const handleReload = () => {
        resetError();
        window.location.reload();
    };

    const handleGoHome = () => {
        resetError();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1a2e] via-[#1a2a3e] to-[#0a0f1f] 
                        flex items-center justify-center px-4 relative overflow-hidden">
            
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl animate-pulse-slow" />
            </div>

            <motion.div
                className="max-w-2xl mx-auto text-center relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Icon d'erreur */}
                <motion.div
                    className="mb-8"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
                        <div className="relative bg-red-500/10 backdrop-blur-sm border border-red-500/20 
                                      rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
                            <AlertTriangle className="w-12 h-12 text-red-400" />
                        </div>
                    </div>
                </motion.div>

                {/* Message d'erreur */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Oops ! Une erreur s'est produite
                    </h1>
                    <p className="text-gray-400 text-lg mb-6">
                        Quelque chose s'est mal passé. Ne vous inquiétez pas, ce n'est pas de votre faute !
                    </p>
                    
                    {/* Détails de l'erreur en mode développement */}
                    {import.meta.env.DEV && error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ delay: 0.6 }}
                            className="bg-gray-900/60 backdrop-blur-xl border border-red-500/20 
                                     rounded-xl p-4 text-left mb-6 max-w-lg mx-auto"
                        >
                            <h3 className="text-red-400 font-semibold mb-2">Détails de l'erreur :</h3>
                            <pre className="text-xs text-gray-300 overflow-auto max-h-32">
                                {error.toString()}
                            </pre>
                        </motion.div>
                    )}
                </motion.div>

                {/* Boutons d'action */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <motion.button
                        onClick={handleReload}
                        className="group flex items-center justify-center gap-3 px-8 py-4 
                                 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl 
                                 hover:from-red-700 hover:to-orange-700 transition-all duration-300 
                                 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        Recharger la page
                    </motion.button>

                    <motion.button
                        onClick={handleGoHome}
                        className="group flex items-center justify-center gap-3 px-8 py-4 
                                 bg-gray-800/50 backdrop-blur-sm text-white rounded-xl border border-white/10
                                 hover:bg-gray-800/70 hover:border-white/20 transition-all duration-300 
                                 hover:scale-105 font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        Retour à l'accueil
                    </motion.button>
                </motion.div>

                {/* Message de contact */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 p-6 bg-gray-900/30 backdrop-blur-sm border border-white/5 rounded-xl"
                >
                    <p className="text-gray-400 text-sm">
                        Si le problème persiste, n'hésitez pas à me contacter. 
                        Je corrigerai cela dès que possible !
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ErrorBoundary;