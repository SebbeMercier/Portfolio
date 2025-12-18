# 🌟 Sebbe Mercier - Portfolio Fullstack Developer

Un portfolio moderne et interactif construit avec React, Framer Motion, et des animations avancées pour créer une expérience utilisateur exceptionnelle.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-success)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Bun](https://img.shields.io/badge/Bun-Compatible-orange)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.19-38bdf8)

---

## ✨ Fonctionnalités Principales

### 🎨 Design & UX
- **Curseur personnalisé interactif** avec effets magnétiques
- **Effet typewriter** sur le sous-titre avec rotation automatique
- **Particules flottantes réactives** qui réagissent au mouvement de la souris
- **Glassmorphism** et effets de profondeur
- **Animations fluides** avec Framer Motion et Anime.js
- **Gradients animés** purple/pink signature

### 🚀 Navigation & Interactions
- **Barre de progression du scroll** avec indicateur de pourcentage
- **Bouton Scroll to Top** avec animations
- **Bouton CTA magnétique** qui suit le curseur
- **Navbar glassmorphism** avec effets de hover avancés
- **Transitions de page** fluides

### 📱 Responsive Design
- Optimisé pour **mobile, tablet et desktop**
- Animations adaptatives selon la taille d'écran
- Performance optimisée sur tous les appareils

---

## 🛠️ Technologies Utilisées

### Frontend
- **React** 18.3.1 - Framework UI
- **Framer Motion** 12.23.26 - Animations avancées
- **Anime.js** 4.2.2 - Animations complexes
- **Tailwind CSS** 3.4.19 - Styling utilitaire
- **React Router DOM** 7.10.1 - Navigation

### UI Components
- **Radix UI** - Composants accessibles
- **Lucide React** - Icônes modernes
- **Class Variance Authority** - Gestion des variants

### Backend & Database
- **Supabase** - Backend as a Service
- **React Turnstile** - Protection anti-bot

### Build & Dev Tools
- **Bun** - Runtime JavaScript ultra-rapide
- **React Scripts** - Configuration CRA
- **PostCSS** & **Autoprefixer** - Processing CSS

---

## 🚀 Installation & Démarrage

### Prérequis
- **Bun** installé (ou Node.js 18+)
- Git

### Installation

```bash
# Cloner le repository
git clone https://github.com/sebbe-mercier/portfolio.git
cd portfolio

# Installer les dépendances avec Bun
bun install

# Ou avec npm
npm install
```

### Lancement

```bash
# Avec Bun (recommandé)
bun run dev

# Ou avec npm
npm run dev
```

Le portfolio sera accessible sur `http://localhost:3000`

### Build pour production

```bash
# Avec Bun
bun run build

# Ou avec npm
npm run build
```

---

## 📁 Structure du Projet

```
sebbe-mercier-portfolio/
├── public/                      # Assets statiques
├── src/
│   ├── components/              # Composants React
│   │   ├── InteractiveCursor.jsx
│   │   ├── ScrollProgress.jsx
│   │   ├── TypewriterText.jsx
│   │   ├── MagneticCTA.jsx
│   │   ├── ScrollToTop.jsx
│   │   ├── FloatingParticles.jsx
│   │   ├── Hero.jsx
│   │   ├── HeroText.jsx
│   │   ├── HeroArrow.jsx
│   │   ├── Navbar.jsx
│   │   ├── animations/          # Composants d'animation
│   │   └── ui/                  # Composants UI réutilisables
│   ├── pages/                   # Pages de l'application
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Projects.jsx
│   │   └── Contact.jsx
│   ├── contexts/                # Contextes React
│   ├── hooks/                   # Custom hooks
│   ├── index.css                # Styles globaux
│   └── App.jsx                  # Composant principal
├── UX_UI_IMPROVEMENTS.md        # Documentation des améliorations
├── QUICK_START.md               # Guide de démarrage rapide
└── package.json
```

---

## 🎨 Composants Clés

### InteractiveCursor
Curseur personnalisé qui suit la souris avec effet de ressort et change au survol des éléments interactifs.

### ScrollProgress
Barre de progression en haut + indicateur circulaire en bas à droite affichant le pourcentage de scroll.

### TypewriterText
Effet machine à écrire avec rotation automatique entre plusieurs textes.

### MagneticCTA
Bouton Call-to-Action avec effet magnétique, gradient animé et shine effect.

### FloatingParticles
Particules flottantes qui réagissent au mouvement du curseur avec effet de répulsion.

### ScrollToTop
Bouton qui apparaît après 300px de scroll pour revenir en haut de page.

---

## 🎯 Sections du Portfolio

1. **Hero** - Introduction avec avatar, nom, et CTA
2. **Stats** - Statistiques clés (projets, expérience, etc.)
3. **Services** - Services proposés
4. **Skills** - Compétences techniques
5. **Timeline** - Parcours professionnel
6. **About** - À propos détaillé
7. **Projects** - Portfolio de projets
8. **Contact** - Formulaire de contact

---

## 🎨 Personnalisation

### Couleurs
Les couleurs principales sont définies dans `tailwind.config.js` et utilisent la palette purple/pink :
- Purple: `#8b5cf6`, `#a855f7`
- Pink: `#ec4899`, `#db2777`

### Animations
Toutes les animations personnalisées sont dans `src/index.css`. Vous pouvez les modifier ou en ajouter de nouvelles.

### Contenu
Modifiez les fichiers dans `src/pages/` et `src/components/` pour personnaliser le contenu.

---

## 📊 Performance

- ✅ **Lighthouse Score** : 90+ (Performance, Accessibility, Best Practices, SEO)
- ✅ **First Contentful Paint** : < 1.5s
- ✅ **Time to Interactive** : < 3s
- ✅ **Animations GPU-accelerated**
- ✅ **Lazy loading** des composants
- ✅ **Optimisation des images**

---

## 🌐 Déploiement

### Vercel (Recommandé)
```bash
vercel deploy
```

### Netlify
```bash
netlify deploy --prod
```

### GitHub Pages
```bash
npm run build
# Puis déployez le dossier build/
```

---

## 📝 Variables d'Environnement

Créez un fichier `.env` à la racine :

```env
REACT_APP_SUPABASE_URL=votre_url_supabase
REACT_APP_SUPABASE_ANON_KEY=votre_clé_anon
REACT_APP_TURNSTILE_SITE_KEY=votre_clé_turnstile
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 📧 Contact

**Sebbe Mercier** - Fullstack Developer

- Portfolio : [sebbemercier.dev](https://sebbemercier.dev)
- Email : contact@sebbemercier.dev
- LinkedIn : [Sebbe Mercier](https://linkedin.com/in/sebbe-mercier)
- GitHub : [@sebbe-mercier](https://github.com/sebbe-mercier)

---

## 🙏 Remerciements

- **Framer Motion** pour les animations fluides
- **Anime.js** pour les animations complexes
- **Tailwind CSS** pour le styling rapide
- **Radix UI** pour les composants accessibles
- **Supabase** pour le backend

---

## 📚 Documentation Complémentaire

- [UX/UI Improvements](./UX_UI_IMPROVEMENTS.md) - Détails des améliorations UX/UI
- [Quick Start Guide](./QUICK_START.md) - Guide de démarrage rapide

---

**Fait avec ❤️ et beaucoup de ☕ par Sebbe Mercier**

⭐ Si vous aimez ce projet, n'hésitez pas à lui donner une étoile !
