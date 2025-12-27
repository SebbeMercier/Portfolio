# 📝 Système de Gestion CV Centralisé

## Vue d'ensemble

Le système de CV utilise maintenant une table centralisée `cv_data` qui stocke toutes les données au format JSONB. Cela permet une gestion plus simple et flexible des données CV.

## 🗄️ Structure de la base de données

### Table `cv_data`

```sql
CREATE TABLE cv_data (
    id SERIAL PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Structure des données JSONB

```json
{
  "personal_info": {
    "name": "Sebbe Mercier",
    "title": "Développeur Full Stack",
    "email": "info@sebbe-mercier.tech",
    "phone": "+33 6 XX XX XX XX",
    "location": "France",
    "website": "https://sebbe-mercier.tech",
    "summary": "Description professionnelle..."
  },
  "experiences": [
    {
      "id": 1,
      "title": "Poste",
      "company": "Entreprise",
      "location": "Lieu",
      "description": "Description du poste",
      "start_date": "2022-01-01",
      "end_date": null,
      "current": true,
      "technologies": ["React", "Node.js"],
      "achievements": ["Réalisation 1", "Réalisation 2"]
    }
  ],
  "skills": [
    {
      "id": 1,
      "name": "React",
      "category": "frontend",
      "level": 5,
      "years_experience": 4
    }
  ],
  "projects": [
    {
      "id": 1,
      "title": "Nom du projet",
      "description": "Description courte",
      "technologies": ["React", "Tailwind"],
      "github_url": "https://github.com/...",
      "demo_url": "https://demo.com"
    }
  ],
  "education": [
    {
      "id": 1,
      "title": "Diplôme",
      "institution": "École",
      "location": "Lieu",
      "start_date": "2017-09-01",
      "end_date": "2019-06-30",
      "description": "Description"
    }
  ],
  "languages": [
    {
      "id": 1,
      "name": "Français",
      "level": "Natif"
    }
  ],
  "achievements": [
    "Réalisation 1",
    "Réalisation 2"
  ]
}
```

## 🚀 Installation

### 1. Créer la table dans Supabase

Exécutez le script SQL dans l'éditeur SQL de Supabase :

```bash
# Le fichier se trouve dans :
src/scripts/createCVDataTable.sql
```

Ou copiez-collez le contenu dans l'éditeur SQL de Supabase.

### 2. Importer les données existantes

Deux options sont disponibles :

#### Option 1 : Via l'interface CVManager (Recommandé)

1. Allez dans le panel Admin
2. Cliquez sur "CV Manager"
3. Allez dans l'onglet "Données CV"
4. Cliquez sur "Importer données existantes"

Cette option synchronise automatiquement :
- ✅ Tous les projets de la table `projects`
- ✅ Toutes les expériences de la table `experiences`
- ✅ Toutes les compétences de la table `skills`

#### Option 2 : Manuellement via SQL

Si vous préférez importer manuellement, le script `createCVDataTable.sql` insère déjà des données par défaut.

## 📋 Utilisation

### Interface CVDataManager

L'interface `CVDataManager` permet de gérer toutes les données CV :

#### Onglets disponibles :

1. **Personnel** : Informations personnelles (nom, email, téléphone, résumé)
2. **Expériences** : Postes et missions professionnelles
3. **Compétences** : Technologies et niveaux de maîtrise
4. **Projets** : Réalisations et projets
5. **Formation** : Parcours éducatif
6. **Langues** : Compétences linguistiques
7. **Réalisations** : Points forts et accomplissements

#### Actions disponibles :

- ➕ **Ajouter** : Créer un nouvel élément
- ✏️ **Éditer** : Modifier un élément existant
- 🗑️ **Supprimer** : Retirer un élément
- 💾 **Sauvegarder** : Enregistrer toutes les modifications
- 📥 **Importer** : Synchroniser depuis les tables séparées

### Utilisation programmatique

```javascript
import { 
  getCVDataFromTable, 
  saveCVDataToTable,
  importFromSeparateTables 
} from '../services/cvDataService';

// Récupérer les données
const cvData = await getCVDataFromTable('fr');

// Sauvegarder les données
await saveCVDataToTable(cvData);

// Importer depuis les tables séparées
const result = await importFromSeparateTables();
```

## 🔄 Système de fallback

Le service `cvService.js` utilise un système de fallback intelligent :

1. **Priorité 1** : Table `cv_data` (nouveau système)
2. **Priorité 2** : Tables séparées (`projects`, `experiences`, `skills`)
3. **Priorité 3** : Données par défaut hardcodées

Cela garantit que le CV fonctionne toujours, même en cas de problème.

## 🎯 Avantages du système centralisé

### ✅ Avantages

- **Simplicité** : Une seule table à gérer
- **Flexibilité** : Structure JSON facilement extensible
- **Performance** : Moins de requêtes SQL
- **Maintenance** : Plus facile à maintenir
- **Versioning** : Possibilité d'ajouter un historique facilement
- **Import/Export** : Facile à sauvegarder et restaurer

### 📊 Comparaison

| Aspect | Ancien système | Nouveau système |
|--------|---------------|-----------------|
| Tables | 4+ tables | 1 table |
| Requêtes | Multiple JOINs | 1 requête simple |
| Flexibilité | Schéma rigide | JSON flexible |
| Maintenance | Complexe | Simple |
| Performance | Moyenne | Excellente |

## 🔧 Maintenance

### Sauvegarder les données

```sql
-- Exporter les données CV
SELECT jsonb_pretty(data) 
FROM cv_data 
WHERE id = 1;
```

### Restaurer les données

```sql
-- Restaurer depuis une sauvegarde
UPDATE cv_data 
SET data = '{ ... votre JSON ... }'::jsonb
WHERE id = 1;
```

### Vérifier l'intégrité

```sql
-- Vérifier que toutes les sections existent
SELECT 
    data ? 'personal_info' as has_personal,
    data ? 'experiences' as has_experiences,
    data ? 'skills' as has_skills,
    data ? 'projects' as has_projects,
    data ? 'education' as has_education,
    data ? 'languages' as has_languages,
    data ? 'achievements' as has_achievements
FROM cv_data
WHERE id = 1;
```

## 🐛 Dépannage

### Problème : Aucune donnée n'apparaît

**Solution** :
1. Vérifiez que la table `cv_data` existe
2. Exécutez le script `createCVDataTable.sql`
3. Utilisez le bouton "Importer données existantes"

### Problème : Les modifications ne sont pas sauvegardées

**Solution** :
1. Vérifiez la console pour les erreurs
2. Assurez-vous que Supabase est bien configuré
3. Vérifiez les permissions RLS (Row Level Security)

### Problème : Import échoue

**Solution** :
1. Vérifiez que les tables `projects`, `experiences`, `skills` existent
2. Vérifiez qu'elles contiennent des données
3. Consultez la console pour les erreurs détaillées

## 📚 Ressources

- [Documentation Supabase JSONB](https://supabase.com/docs/guides/database/json)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [React-PDF Documentation](https://react-pdf.org/)

## 🎉 Prochaines étapes

- [ ] Ajouter un système de versioning
- [ ] Implémenter l'export/import JSON
- [ ] Ajouter des templates de CV
- [ ] Système de traduction des données CV
- [ ] Historique des modifications
