// ShareButton.jsx - Bouton de partage avec options multiples
import { useState } from 'react';
import { Share2, Twitter, Linkedin, Facebook, Link, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ShareButton({ url, title, description, className = '' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareOptions = [
        {
            name: 'Twitter',
            icon: Twitter,
            color: 'hover:text-blue-400',
            action: () => {
                const text = `${title} ${url}`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
            }
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            color: 'hover:text-blue-600',
            action: () => {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
            }
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'hover:text-blue-500',
            action: () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            }
        },
        {
            name: 'Copy Link',
            icon: copied ? Check : Copy,
            color: copied ? 'text-green-400' : 'hover:text-purple-400',
            action: async () => {
                try {
                    await navigator.clipboard.writeText(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                } catch (err) {
                    // Fallback pour les navigateurs qui ne supportent pas clipboard API
                    const textArea = document.createElement('textarea');
                    textArea.value = url;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }
            }
        }
    ];

    // Partage natif si disponible
    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: description,
                    url
                });
            } catch (err) {
                console.log('Native share cancelled');
            }
        } else {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={handleNativeShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 text-gray-400 hover:text-white border border-gray-700 rounded-lg transition-colors"
            >
                <Share2 className="w-4 h-4" />
                Share
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute top-full mt-2 right-0 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-lg p-2 min-w-[160px] z-50"
                    >
                        {shareOptions.map((option) => (
                            <button
                                key={option.name}
                                onClick={() => {
                                    option.action();
                                    if (option.name !== 'Copy Link') {
                                        setIsOpen(false);
                                    }
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 transition-colors hover:bg-gray-800/50 ${option.color}`}
                            >
                                <option.icon className="w-4 h-4" />
                                {option.name}
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