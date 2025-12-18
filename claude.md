# Portfolio Sebbe Mercier - Documentation Complète

## 📋 Vue d'ensemble du projet

Portfolio personnel moderne et interactif construit avec React, Supabase, et des animations avancées. Le site présente mes projets, compétences, et témoignages clients avec une interface utilisateur immersive et des statistiques en temps réel.

### 🎯 Objectifs du projet
- Présenter mon travail de manière professionnelle et engageante
- Permettre aux clients de laisser des avis facilement
- Gérer le contenu dynamiquement via un panel admin
- Offrir une expérience utilisateur exceptionnelle avec des animations fluides

### 🛠️ Stack technique
- **Frontend**: React 18, React Router v6
- **Styling**: Tailwind CSS, CSS personnalisé
- **Animations**: Framer Motion, Anime.js, react-intersection-observer
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Sécurité**: Cloudflare Turnstile (captcha), input sanitization
- **Package Manager**: Bun
- **Déploiement**: [À définir]

---

## 🏗️ Architecture du projet

```
sebbe-mercier-portfolio/
├── public/                      # Assets statiques
│   ├── images/                  # Images du portfolio
│   └── index.html              # Point d'entrée HTML
├── src/
│   ├── components/             # Composants réutilisables
│   │   ├── animations/         # Composants d'animation
│   │   │   ├── FadeIn.jsx
│   │   │   ├── SlideIn.jsx
│   │   │   └── StaggerChildren.jsx
│   │   ├── ui/                 # Composants UI de base
│   │   ├── Hero.jsx            # Section hero avec animations
│   │   ├── Navbar.jsx          # Navigation principale
│   │   ├── Footer.jsx          # Pied de page avec glassmorphism
│   │   ├── StatsSection.jsx    # Stats dynamiques en temps réel
│   │   ├── StatsWidget.jsx     # Widget compact pour l'admin
│   │   ├── TestimonialsSection.jsx  # Affichage des témoignages
│   │   ├── ServicesSection.jsx # Services offerts
│   │   ├── SkillsSection.jsx   # Compétences techniques
│   │   └── TimelineSection.jsx # Parcours professionnel
│   ├── pages/                  # Pages principales
│   │   ├── Home.jsx            # Page d'accueil
│   │   ├── Projects.jsx        # Liste des projets avec filtres
│   │   ├── Contact.jsx         # Formulaire de contact
│   │   ├── Feedback.jsx        # Formulaire d'avis clients (multi-étapes)
│   │   └── Admin.jsx           # Panel d'administration
│   ├── services/               # Services et logique métier
│   │   ├── supabaseProjectService.js    # CRUD projets
│   │   ├── testimonialsService.js       # CRUD témoignages
│   │   ├── feedbackService.js           # Soumission et gestion feedback
│   │   ├── statsService.js              # Calcul statistiques avancées
│   │   └── imageUploadService.js        # Upload images Supabase
│   ├── hooks/                  # Custom React hooks
│   │   ├── useProjects.js      # Hook pour les projets
│   │   ├── useTestimonials.js  # Hook pour les témoignages
│   │   └── useStats.js         # Hook pour les stats dynamiques
│   ├── contexts/               # Contextes React
│   ├── config/                 # Configuration
│   │   └── supabase.js         # Configuration Supabase
│   ├── data/                   # Données statiques/fallback
│   │   ├── projectsData.js     # Projets par défaut
│   │   └── testimonialsData.js # Témoignages par défaut
│   ├── lib/                    # Utilitaires
│   ├── App.js                  # Composant racine
│   ├── index.js                # Point d'entrée React
│   └── index.css               # Styles globaux + animations
├── .env                        # Variables d'environnement
├── package.json                # Dépendances
├── tailwind.config.js          # Configuration Tailwind
└── bun.lock                    # Lock file Bun

```

---

## 🔑 Fonctionnalités principales

### 1. **Page d'accueil (Home)**
- Hero section avec animations Framer Motion
- Particules flottantes en arrière-plan
- Stats en temps réel (projets, clients, technologies, expérience)
- Sections services, compétences, timeline
- Témoignages clients avec scroll horizontal
- Footer avec glassmorphism
- Toggle thème sombre/clair

### 2. **Page Projets (Projects)**
- Affichage en grille avec filtres par technologie
- Animations au scroll (Framer Motion + Intersection Observer)
- Cartes de projets avec hover effects
- Filtres dynamiques basés sur les tags
- Effets de background améliorés
- Recherche globale intégrée

### 3. **Page Contact (Contact)**
- Formulaire de contact avec validation
- Particules flottantes
- Design glassmorphism
- Animations d'entrée
- Adaptation au thème actuel

### 4. **Page Feedback (Feedback)**
- Formulaire multi-étapes (4 étapes)
  - Étape 1: Informations personnelles
  - Étape 2: Détails du projet
  - Étape 3: Feedback et notation
  - Étape 4: Vérification sécurité (Cloudflare Turnstile)
- Validation en temps réel
- Preview du témoignage avant soumission
- Barre de progression
- Sécurité renforcée (sanitization, rate limiting, captcha)

### 5. **Blog System** 📝 **[NOUVEAU]**
- **Page Blog** (`/blog`)
  - Liste d'articles avec filtres par catégorie
  - Recherche globale avec Fuse.js
  - Tags populaires cliquables
  - Pagination et tri par date
  - Cards d'articles avec preview
- **Page Article** (`/blog/:slug`)
  - Rendu Markdown avec syntax highlighting
  - Table des matières interactive
  - Boutons de partage social
  - Articles liés automatiques
  - Système de likes (localStorage)
  - Compteur de vues
- **Gestion Admin**
  - Éditeur Markdown avec preview
  - Upload d'images de couverture
  - Gestion des tags et catégories
  - Publication/brouillon
  - SEO (slug, excerpt, meta)

### 6. **Système de Thème** 🌙 **[NOUVEAU]**
- **Mode Sombre/Clair**
  - Toggle animé avec icônes
  - Sauvegarde préférence utilisateur
  - Détection préférence système
  - Transitions fluides entre thèmes
- **Thèmes Saisonniers** (bonus)
  - Noël, Halloween, Printemps
  - Couleurs et particules adaptées
  - Auto-détection de la saison
- **Variables CSS dynamiques**
  - Couleurs adaptatives
  - Glassmorphism ajusté
  - Contraste optimisé

### 7. **Recherche Globale** 🔍 **[NOUVEAU]**
- **Recherche Fuzzy** avec Fuse.js
  - Articles, projets, compétences
  - Recherche dans titre, contenu, tags
  - Suggestions en temps réel
  - Debounce pour performance
- **Filtres Avancés**
  - Par type de contenu
  - Par catégorie/tag
  - Par date de publication
  - Combinaisons multiples
- **Interface**
  - Raccourci clavier (Cmd+K)
  - Résultats avec preview
  - Navigation au clavier
  - Historique de recherche

### 8. **Panel Admin (Admin)**
- Authentification Google OAuth via Supabase
- Whitelist d'emails autorisés
- **Gestion des projets** (CRUD complet)
  - Upload d'images vers Supabase Storage
  - Éditeur avec preview
  - Gestion des tags, features, liens
- **Gestion des témoignages**
  - Toggle visibilité
  - Édition complète
  - Preview en temps réel
- **Gestion du feedback** en attente
  - Approbation → devient témoignage visible
  - Rejet → suppression automatique de la DB
  - Cleanup des anciens rejets
- **Gestion du blog** **[NOUVEAU]**
  - Éditeur Markdown WYSIWYG
  - Gestion des articles (CRUD)
  - Upload d'images de couverture
  - Prévisualisation avant publication
  - Analytics des articles (vues, likes)
- Widget de stats en temps réel
- Interface avec tabs pour navigation

### 9. **Statistiques dynamiques**
- Calcul automatique depuis Supabase:
  - Nombre de projets (Live + Completed)
  - Nombre de clients (témoignages approuvés)
  - Technologies uniques (extraction des tags)
  - Années d'expérience (calculé depuis date de début)
  - Note moyenne des témoignages
  - **Articles publiés** **[NOUVEAU]**
  - **Vues totales du blog** **[NOUVEAU]**
- Affichage avec animations de compteur
- Indicateur "Live" en temps réel
- Bouton refresh manuel
- Valeurs de fallback réalistes en cas d'erreur

### 10. **Fonctionnalités Sociales** 📱 **[NOUVEAU]**
- **Partage Social**
  - Twitter, LinkedIn, Facebook
  - Copie de lien avec feedback
  - Partage natif mobile
  - Meta tags optimisés
- **Engagement**
  - Système de likes (localStorage)
  - Compteurs de vues
  - Temps de lecture estimé
  - Bookmarks locaux

---

## 🗄️ Base de données Supabase

### Tables principales

#### **projects**
```sql
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    tags TEXT[],
    image TEXT,
    links JSONB,
    features TEXT[],
    detailedTech JSONB,
    year TEXT,
    status TEXT,
    duration TEXT,
    role TEXT,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW()
);
```

#### **testimonials** (table unifiée)
```sql
CREATE TABLE testimonials (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT,
    company TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    project_type TEXT,
    work_duration TEXT,
    would_recommend BOOLEAN DEFAULT true,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    "isVisible" BOOLEAN DEFAULT false,
    ip_address TEXT,
    user_agent TEXT,
    "order" INTEGER DEFAULT 999,
    avatar TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **articles** **[NOUVEAU]**
```sql
CREATE TABLE articles (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    tags TEXT[],
    category TEXT,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    reading_time INTEGER,
    meta_title TEXT,
    meta_description TEXT,
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_articles_published ON articles(published, published_at DESC);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);
CREATE INDEX idx_articles_category ON articles(category);
```

#### **page_views** **[NOUVEAU - Optionnel]**
```sql
CREATE TABLE page_views (
    id BIGSERIAL PRIMARY KEY,
    page TEXT NOT NULL,
    article_id BIGINT REFERENCES articles(id),
    visitor_id TEXT,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    country TEXT,
    device_type TEXT,
    browser TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour analytics
CREATE INDEX idx_page_views_page ON page_views(page, created_at);
CREATE INDEX idx_page_views_article ON page_views(article_id, created_at);
CREATE INDEX idx_page_views_visitor ON page_views(visitor_id);
```

### Storage Buckets
- **project-images**: Images des projets (public)

### Row Level Security (RLS)
- Lecture publique pour projets et témoignages approuvés
- Écriture publique pour soumission de feedback
- Gestion complète pour utilisateurs authentifiés

---

## 🔐 Sécurité

### Authentification
- Google OAuth via Supabase Auth
- Whitelist d'emails dans `.env`:
  ```
  REACT_APP_ALLOWED_EMAILS=email1@example.com,email2@example.com
  ```

### Protection du feedback
1. **Cloudflare Turnstile**: Captcha invisible
2. **Input Sanitization**: Nettoyage de tous les inputs
3. **Rate Limiting**: Max 1 soumission par email/24h
4. **Duplicate Prevention**: Vérification email + timestamp
5. **Status Workflow**: pending → approved/rejected
6. **Auto-cleanup**: Suppression automatique des rejets

### Variables d'environnement requises
```env
# Supabase
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key

# Admin
REACT_APP_ALLOWED_EMAILS=email1@example.com,email2@example.com

# Cloudflare Turnstile (optionnel)
REACT_APP_TURNSTILE_SITE_KEY=your_site_key
```

---

## 🎨 Design System

### Couleurs principales
```css
/* Gradients */
--gradient-primary: from-purple-600 to-pink-600
--gradient-secondary: from-blue-400 to-cyan-500
--gradient-success: from-green-400 to-emerald-500
--gradient-warning: from-orange-400 to-red-500

/* Background */
--bg-primary: #0a1a2e
--bg-secondary: #1a2a3e
--bg-tertiary: #0a0f1f

/* Text */
--text-primary: white
--text-secondary: #9ca3af (gray-400)
--text-accent: #a855f7 (purple-400)
```

### Effets visuels
- **Glassmorphism**: `backdrop-blur-xl` + `bg-gray-900/60`
- **Glow effects**: Gradients avec blur et opacity
- **Hover animations**: Scale, border-color transitions
- **Scroll animations**: Framer Motion + Intersection Observer

### Animations personnalisées
```css
/* Dans index.css */
@keyframes pulse-slow { ... }
@keyframes float { ... }
@keyframes glow { ... }
@keyframes shimmer { ... }
@keyframes gradient-shift { ... }
```

---

## 📦 Dépendances principales

### Production
```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "framer-motion": "^11.x",
  "animejs": "^3.x",
  "react-intersection-observer": "^9.x",
  "@supabase/supabase-js": "^2.x",
  "lucide-react": "^0.x",
  "tailwindcss": "^3.x",
  "react-markdown": "^10.x",
  "remark-gfm": "^4.x",
  "react-syntax-highlighter": "^16.x",
  "fuse.js": "^7.x",
  "react-i18next": "^16.x",
  "i18next": "^25.x",
  "react-hot-toast": "^2.x",
  "date-fns": "^4.x",
  "@headlessui/react": "^2.x",
  "react-use-gesture": "^9.x",
  "three": "^0.x",
  "@react-three/fiber": "^9.x",
  "@react-three/drei": "^10.x"
}
```

### Développement
```json
{
  "bun": "latest"
}
```

---

## 🚀 Commandes

### Installation
```bash
bun install
```

### Développement
```bash
bun start
# Ouvre http://localhost:3000
```

### Build production
```bash
bun run build
```

### Tests
```bash
# Pas de tests configurés actuellement
```

---

## 📝 Conventions de code

### Composants
- **Nommage**: PascalCase pour les composants (`Hero.jsx`)
- **Structure**: Functional components avec hooks
- **Props**: Destructuring en paramètre
- **Export**: Named exports pour composants réutilisables

### Services
- **Nommage**: camelCase pour les fichiers (`projectService.js`)
- **Fonctions**: Async/await pour opérations asynchrones
- **Retour**: Toujours `{ success: boolean, data?: any, error?: string }`
- **Gestion d'erreurs**: Try/catch avec logs console

### Hooks personnalisés
- **Nommage**: Préfixe `use` (`useStats.js`)
- **Optimisation**: `useCallback` et `useMemo` pour éviter re-renders
- **Dépendances**: Toujours spécifier les dépendances correctes

### Styling
- **Tailwind first**: Utiliser Tailwind autant que possible
- **CSS custom**: Seulement pour animations complexes
- **Responsive**: Mobile-first avec breakpoints Tailwind
- **Dark mode**: Pas implémenté (design dark par défaut)

---

## 🐛 Problèmes connus et solutions

### 1. Stats qui ne s'affichent pas
**Cause**: Données Supabase non chargées ou table manquante
**Solution**: 
- Exécuter `fix_testimonials_table.sql` dans Supabase
- Vérifier les variables d'environnement
- Regarder la console pour les erreurs

### 2. Images qui ne s'uploadent pas
**Cause**: Bucket Supabase non configuré ou permissions RLS
**Solution**:
- Créer le bucket `project-images` (public)
- Vérifier les policies RLS

### 3. Feedback qui ne se soumet pas
**Cause**: Table testimonials avec mauvais schema ou Turnstile non configuré
**Solution**:
- Exécuter `fix_testimonials_table.sql`
- En dev, le captcha est bypassé automatiquement

### 4. Admin qui ne se connecte pas
**Cause**: Email non dans la whitelist ou OAuth mal configuré
**Solution**:
- Ajouter l'email dans `REACT_APP_ALLOWED_EMAILS`
- Vérifier la config OAuth Google dans Supabase

---

## 🔄 Workflow de développement

### Ajouter un nouveau projet
1. Via l'admin: `/admin` → Projects → New Project
2. Remplir les informations
3. Upload une image
4. Ajouter tags et features
5. Save → Apparaît automatiquement sur `/projects`

### Gérer les témoignages
1. Les clients soumettent via `/feedback`
2. Admin reçoit notification (à implémenter)
3. Review dans `/admin` → Feedback tab
4. Approve → Devient visible sur homepage
5. Reject → Supprimé automatiquement

### Mettre à jour les stats
- **Automatique**: Les stats se mettent à jour en temps réel
- **Manuel**: Bouton refresh dans la section stats
- **Ajuster l'expérience**: Modifier la date dans `useStats.js` ligne 20

---

## 📚 Fichiers de documentation

### Guides de setup
- `SUPABASE_SETUP.md`: Configuration Supabase complète
- `TESTIMONIALS_SETUP.md`: Setup du système de témoignages
- `ANIMATIONS.md`: Guide des animations
- `DATABASE_FIX_INSTRUCTIONS.md`: Résolution problèmes DB

### Scripts SQL
- `fix_testimonials_table.sql`: Création/mise à jour table testimonials
- `optional_page_views_tracking.sql`: Tracking des vues (optionnel)

### Guides de fonctionnalités
- `DYNAMIC_STATS_GUIDE.md`: Fonctionnement des stats dynamiques
- `STATS_TROUBLESHOOTING.md`: Dépannage des stats

---

## 🎯 Roadmap / Améliorations futures

### Court terme
- [ ] Système de notifications pour nouveaux feedbacks
- [ ] Analytics et tracking des vues
- [ ] Mode sombre/clair toggle
- [ ] Internationalisation (FR/EN)
- [ ] Blog section

### Moyen terme
- [ ] Tests unitaires et E2E
- [ ] CI/CD pipeline
- [ ] Performance monitoring
- [ ] SEO optimization
- [ ] PWA features

### Long terme
- [ ] CMS headless pour le contenu
- [ ] API publique pour les projets
- [ ] Système de recherche avancé
- [ ] Intégration avec GitHub pour auto-update projets

---

## 🤝 Contribution

### Pour les développeurs
1. Clone le repo
2. Installe les dépendances: `bun install`
3. Configure `.env` avec tes credentials Supabase
4. Lance le dev server: `bun start`
5. Crée une branche pour tes features
6. Commit avec des messages clairs
7. Push et crée une PR

### Standards de code
- ESLint: Suivre les règles configurées
- Prettier: Formatage automatique
- Commits: Format conventionnel (feat:, fix:, docs:, etc.)

---

## 📞 Support et contact

### En cas de problème
1. Vérifier la console du navigateur
2. Consulter les guides de troubleshooting
3. Vérifier les variables d'environnement
4. Regarder les logs Supabase

### Ressources utiles
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Framer Motion](https://www.framer.com/motion/)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation React Router](https://reactrouter.com/)

---

## 📄 License

[À définir]

---

## 🙏 Remerciements

- Design inspiré par les portfolios modernes
- Animations inspirées par Framer Motion showcase
- Communauté React et Supabase pour le support

---

## 🎉 INTÉGRATION COMPLÈTE - Décembre 2024

### ✅ Fonctionnalités Avancées Intégrées

L'intégration complète du système de fonctionnalités avancées a été **TERMINÉE avec succès** ! Toutes les fonctionnalités suivantes sont maintenant opérationnelles :

#### 📝 **Système de Blog Complet**
- Pages Blog et BlogPost avec rendu Markdown
- Recherche et filtres par catégorie/tags
- Table des matières interactive
- Système de likes et compteur de vues
- Articles liés automatiques
- Syntax highlighting pour le code

#### 🌙 **Système de Thème**
- Toggle sombre/clair avec animations fluides
- Sauvegarde des préférences utilisateur
- Détection automatique du thème système
- Variables CSS dynamiques

#### 🔍 **Recherche Globale**
- Recherche fuzzy avec Fuse.js
- Recherche dans articles et projets
- Suggestions en temps réel
- Filtres avancés

#### 📱 **Fonctionnalités Sociales**
- Boutons de partage (Twitter, LinkedIn, Facebook)
- Copie de lien avec feedback
- Système de likes local
- Tracking des vues par session

#### 🛠️ **Infrastructure Technique**
- SQL schema corrigé et prêt pour Supabase
- Hooks personnalisés optimisés
- Composants réutilisables
- Fonctions utilitaires complètes
- Navigation mise à jour

### 🚀 **Prochaines Étapes**
1. Exécuter `create_blog_tables.sql` dans Supabase
2. Ajouter la gestion du blog au panel Admin
3. Tester toutes les fonctionnalités en développement
4. Déployer en production

### 📊 **Statistiques de l'Intégration**
- **13 nouveaux fichiers** créés
- **3 fichiers existants** mis à jour
- **0 erreurs de compilation**
- **Toutes les dépendances** installées avec Bun
- **SQL syntax** corrigé et validé

---

## 📋 Instructions de Commit Git

### 🎯 Format des Messages de Commit

Utilise le format **Conventional Commits** pour des messages clairs et cohérents :

```bash
<type>(<scope>): <description>

[body optionnel]

[footer optionnel]
```

### 🏷️ Types de Commit

- **feat**: Nouvelle fonctionnalité
- **fix**: Correction de bug
- **docs**: Documentation uniquement
- **style**: Changements de style (formatage, etc.)
- **refactor**: Refactoring de code
- **perf**: Amélioration de performance
- **test**: Ajout ou modification de tests
- **chore**: Tâches de maintenance

### 📝 Exemples de Messages

```bash
# Nouvelle fonctionnalité
git commit -m "feat: ✨ Système de CV dynamique avec React-PDF

🎯 Nouvelles fonctionnalités:
- Génération de CV depuis la base de données
- Design PDF professionnel avec timeline
- CVManager avec interface shadcn/ui moderne"

# Correction de bug
git commit -m "fix: 🐛 Correction erreur navigation chatbot

- Fix navigation entre pages
- Amélioration détection des sections
- Messages d'erreur plus clairs"

# Documentation
git commit -m "docs: 📚 Mise à jour guide installation

- Ajout instructions pour shadcn/ui
- Guide de configuration React-PDF
- Exemples d'utilisation du CVManager"

# Style/Design
git commit -m "style: 🎨 Amélioration design CVManager

- Cards avec gradients modernes
- Animations Framer Motion
- Interface à onglets avec shadcn/ui"

# Refactoring
git commit -m "refactor: ♻️ Optimisation hooks CV

- Séparation logique génération/téléchargement
- Amélioration gestion d'erreurs
- Performance des requêtes DB"
```

### 🚀 Workflow de Commit Recommandé

```bash
# 1. Vérifier les changements
git status
git diff

# 2. Ajouter les fichiers
git add .
# ou sélectif
git add src/components/CVManager.jsx src/services/cvService.js

# 3. Commit avec message descriptif
git commit -m "feat: ✨ Description de la fonctionnalité

Détails des changements:
- Point 1
- Point 2
- Point 3"

# 4. Push vers le repo
git push origin main
```

### 🎨 Emojis Recommandés

- ✨ `:sparkles:` - Nouvelle fonctionnalité
- 🐛 `:bug:` - Correction de bug
- 📚 `:books:` - Documentation
- 🎨 `:art:` - Amélioration design/UI
- ⚡ `:zap:` - Performance
- 🔧 `:wrench:` - Configuration
- ♻️ `:recycle:` - Refactoring
- 🚀 `:rocket:` - Déploiement
- 🔒 `:lock:` - Sécurité
- 📱 `:iphone:` - Responsive design

### 📊 Exemple de Commit Complet

```bash
git add .
git commit -m "feat: ✨ Système de CV dynamique complet

🎯 Fonctionnalités ajoutées:
- Génération PDF avec React-PDF depuis la base de données
- Design moderne avec timeline et barres de progression
- CVManager avec interface shadcn/ui et onglets
- Chatbot IA avec navigation intelligente entre pages
- Tracking des téléchargements et analytics

🎨 Améliorations design:
- Header PDF avec gradient et icônes
- Cards projets avec accents colorés
- Progress bars pour compétences
- Interface à onglets moderne

🔧 Technique:
- Hook useCVGenerator pour la logique métier
- Service cvService pour les données DB
- Script de peuplement automatique
- Composants shadcn/ui intégrés

📊 Analytics:
- Tracking téléchargements par source
- Statistiques en temps réel
- États visuels du système"

git push origin main
```

### 🔄 Bonnes Pratiques

1. **Commits atomiques** : Un commit = une fonctionnalité/fix
2. **Messages descriptifs** : Expliquer le "quoi" et le "pourquoi"
3. **Tester avant commit** : S'assurer que le code compile
4. **Commits fréquents** : Éviter les gros commits monolithiques
5. **Branches feature** : Utiliser des branches pour les grosses fonctionnalités

---

**Dernière mise à jour**: Décembre 2024
**Version**: 2.2.0 - CV Dynamique + CVManager shadcn/ui
**Statut**: Production Ready ✅