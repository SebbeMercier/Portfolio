# 🚨 Dépannage CV Data - Erreur d'initialisation

## 🔍 Diagnostic rapide

### Étape 1 : Utiliser le diagnostic automatique

1. Allez dans **CV Manager** → onglet **"Données CV"**
2. Cliquez sur le bouton **"🔍 Diagnostic"**
3. Regardez le message qui s'affiche

### Étape 2 : Vérifier la console

1. Ouvrez les **outils de développement** (F12)
2. Allez dans l'onglet **Console**
3. Rechargez la page et regardez les erreurs

## 🛠️ Solutions par type d'erreur

### Erreur : "Table cv_data manquante"

**Cause** : La table `cv_data` n'existe pas dans Supabase

**Solution** :
1. Ouvrez votre projet **Supabase**
2. Allez dans **SQL Editor**
3. Copiez le contenu du fichier `src/scripts/createCVDataTable.sql`
4. Collez-le dans l'éditeur et **exécutez**

### Erreur : "Permissions insuffisantes"

**Cause** : Row Level Security (RLS) bloque l'accès

**Solution** :
1. Dans Supabase, allez dans **Table Editor**
2. Sélectionnez la table `cv_data`
3. Cliquez sur **"RLS disabled"** pour désactiver RLS
4. Ou configurez une politique RLS appropriée

### Erreur : "Connexion Supabase échouée"

**Cause** : Configuration Supabase incorrecte

**Solution** :
1. Vérifiez le fichier `.env` :
   ```
   REACT_APP_SUPABASE_URL=votre_url
   REACT_APP_SUPABASE_ANON_KEY=votre_clé
   ```
2. Redémarrez le serveur : `bun run start`

## 🧪 Test manuel

Si le diagnostic automatique ne fonctionne pas :

### 1. Test de connexion Supabase

Ouvrez la console du navigateur (F12) et tapez :

```javascript
// Test de connexion
const { supabase } = await import('./src/services/supabase');
const { data, error } = await supabase.from('projects').select('count', { count: 'exact', head: true });
console.log('Connexion:', error ? 'ÉCHEC' : 'OK');
```

### 2. Test de la table cv_data

```javascript
// Test de la table
const { data, error } = await supabase.from('cv_data').select('*').limit(1);
console.log('Table cv_data:', error ? 'MANQUANTE' : 'OK');
if (error) console.log('Erreur:', error);
```

### 3. Test d'insertion

```javascript
// Test d'écriture
const testData = { personal_info: { name: 'Test' }, experiences: [], skills: [], projects: [], education: [], languages: [], achievements: [] };
const { data, error } = await supabase.from('cv_data').insert([{ data: testData }]);
console.log('Insertion:', error ? 'ÉCHEC' : 'OK');
if (error) console.log('Erreur:', error);
```

## 📋 Script SQL complet

Si vous devez créer la table manuellement :

```sql
-- Créer la table cv_data
CREATE TABLE IF NOT EXISTS cv_data (
    id SERIAL PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Désactiver RLS temporairement
ALTER TABLE cv_data DISABLE ROW LEVEL SECURITY;

-- Insérer des données par défaut
INSERT INTO cv_data (data) VALUES ('{
  "personal_info": {
    "name": "Sebbe Mercier",
    "title": "Développeur Full Stack • React & Node.js",
    "email": "info@sebbe-mercier.tech",
    "phone": "+33 6 XX XX XX XX",
    "location": "France",
    "website": "https://sebbe-mercier.tech",
    "summary": "Développeur Full Stack passionné avec une expertise en React, Node.js et TypeScript."
  },
  "experiences": [],
  "skills": [],
  "projects": [],
  "education": [],
  "languages": [],
  "achievements": []
}'::jsonb);
```

## 🔄 Réinitialisation complète

Si rien ne fonctionne :

### 1. Supprimer et recréer la table

```sql
DROP TABLE IF EXISTS cv_data;
-- Puis exécuter le script de création complet
```

### 2. Vider le cache du navigateur

1. **Chrome/Edge** : Ctrl+Shift+R
2. **Firefox** : Ctrl+F5
3. Ou vider complètement le cache

### 3. Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C)
bun run start
```

## 📞 Support

Si le problème persiste :

1. **Copiez l'erreur complète** de la console
2. **Faites une capture d'écran** du message d'erreur
3. **Vérifiez** que Supabase est bien configuré
4. **Testez** avec le diagnostic automatique

## ✅ Vérification finale

Une fois le problème résolu :

1. ✅ Le diagnostic affiche "Système opérationnel"
2. ✅ L'onglet "Données CV" se charge sans erreur
3. ✅ Vous pouvez modifier les informations personnelles
4. ✅ Le bouton "Sauvegarder" fonctionne
5. ✅ L'import des données existantes fonctionne

---

**Le système devrait maintenant fonctionner correctement ! 🎉**