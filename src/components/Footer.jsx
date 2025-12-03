// Footer.jsx
const Footer = () => {
    return (
        <footer className="bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-white font-bold mb-4">Sebbe Mercier</h3>
                        <p className="text-white/60">A Full stack developper</p>
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-4">Liens rapides</h3>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-white/60 hover:text-purple-400 transition">Accueil</a></li>
                            <li><a href="/about" className="text-white/60 hover:text-purple-400 transition">À propos</a></li>
                            <li><a href="/projects" className="text-white/60 hover:text-purple-400 transition">Projets</a></li>
                        </ul>
                    </div>
                    <div>
                     <a href="/contact"><h3 className="text-white font-bold mb-4">Contact</h3></a>
                        <a href="mailto:info@sebbe-mercier.tech" className="text-white/60">info@sebbe-mercier.tech</a>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-white/60">
                    <p>© {new Date().getFullYear()} Sebbe Mercier. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
