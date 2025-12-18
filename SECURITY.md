# 🔒 Sécurité du Portfolio

## ⚠️ Variables d'Environnement

### Configuration Requise

1. **Copiez le fichier d'exemple** :
   ```bash
   cp .env.example .env
   ```

2. **Remplissez vos vraies valeurs** dans `.env`

3. **JAMAIS** commiter le fichier `.env` !

### Variables Requises

```env
# Supabase (OBLIGATOIRE)
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key

# Admin (OBLIGATOIRE)
REACT_APP_ALLOWED_EMAILS=your@email.com

# Cloudflare Turnstile (OPTIONNEL)
REACT_APP_TURNSTILE_SITE_KEY=your_site_key
```

## 🚨 En Cas de Compromission

Si des clés sont exposées :

1. **Révoquer immédiatement** les clés sur Supabase
2. **Générer de nouvelles clés**
3. **Nettoyer l'historique Git** si nécessaire
4. **Mettre à jour** les variables d'environnement

## 🛡️ Bonnes Pratiques

- ✅ Utiliser `.env` pour les secrets
- ✅ Ajouter `.env` au `.gitignore`
- ✅ Utiliser `.env.example` pour la documentation
- ❌ JAMAIS hardcoder les clés dans le code
- ❌ JAMAIS commiter les fichiers `.env`

## 📞 Signaler une Vulnérabilité

Si vous trouvez une faille de sécurité, contactez-moi directement.