// ThemeToggle.jsx - Bouton pour changer de thème
import { useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle({ className = '' }) {
    const { theme, toggleTheme, setSpecificTheme, isTransitioning } = useTheme();

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={toggleTheme}
                disabled={isTransitioning}
                className="relative p-2 rounded-lg bg-gray-800/50 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
                <AnimatePresence mode="wait">
                    {theme === 'dark' ? (
                        <motion.div
                            key="dark"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Moon className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="light"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Sun className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            </button>
        </div>
    );
}

// Version avancée avec menu dropdown
export function AdvancedThemeToggle({ className = '' }) {
    const { theme, setSpecificTheme, isTransitioning } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themes = [
        { id: 'light', name: 'Light', icon: Sun, color: 'text-yellow-400' },
        { id: 'dark', name: 'Dark', icon: Moon, color: 'text-blue-400' },
        { id: 'system', name: 'System', icon: Monitor, color: 'text-gray-400' }
    ];

    const currentTheme = themes.find(t => t.id === theme) || themes[1];

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isTransitioning}
                className="relative p-2 rounded-lg bg-gray-800/50 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group"
            >
                <currentTheme.icon className={`w-5 h-5 ${currentTheme.color} group-hover:scale-110 transition-transform`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute top-full mt-2 right-0 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-lg p-2 min-w-[120px] z-50"
                    >
                        {themes.map((themeOption) => (
                            <button
                                key={themeOption.id}
                                onClick={() => {
                                    setSpecificTheme(themeOption.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                    theme === themeOption.id
                                        ? 'bg-purple-600/20 text-purple-300'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                }`}
                            >
                                <themeOption.icon className={`w-4 h-4 ${themeOption.color}`} />
                                {themeOption.name}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay pour fermer le menu */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}