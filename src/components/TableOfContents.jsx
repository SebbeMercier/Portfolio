// TableOfContents.jsx - Table des matières pour les articles
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';

export function TableOfContents({ content }) {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        // Extraire les headings du contenu markdown
        const headingRegex = /^(#{1,6})\s+(.+)$/gm;
        const matches = [];
        let match;

        while ((match = headingRegex.exec(content)) !== null) {
            const level = match[1].length;
            const text = match[2];
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            
            matches.push({
                level,
                text,
                id
            });
        }

        setHeadings(matches);
    }, [content]);

    useEffect(() => {
        // Observer pour détecter le heading actif
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-20% 0% -35% 0%'
            }
        );

        // Observer tous les headings
        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [headings]);

    const scrollToHeading = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    if (headings.length === 0) return null;

    return (
        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <List className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Table of Contents</h3>
            </div>
            
            <nav className="space-y-1">
                {headings.map((heading, index) => (
                    <motion.button
                        key={heading.id}
                        onClick={() => scrollToHeading(heading.id)}
                        className={`block w-full text-left text-sm transition-colors ${
                            activeId === heading.id
                                ? 'text-purple-400 font-medium'
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                        style={{
                            paddingLeft: `${(heading.level - 1) * 12}px`
                        }}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                    >
                        {heading.text}
                    </motion.button>
                ))}
            </nav>
        </div>
    );
}