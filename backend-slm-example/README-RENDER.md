# 🚀 Déploiement SLM sur Render (GitHub Student Pack)

## 🎓 Prérequis
- Compte GitHub Student Pack activé
- Compte Render connecté à GitHub
- Repository pushé sur GitHub

## 📋 Étapes de déploiement

### 1. Créer le service sur Render
1. Va sur [render.com](https://render.com)
2. Connecte ton compte GitHub
3. Clique sur "New +" → "Web Service"
4. Sélectionne ton repository
5. Configure :
   - **Name** : `sebbe-slm-assistant`
   - **Environment** : `Docker`
   - **Plan** : `Free` (500h/mois avec Student Pack)
   - **Region** : `Frankfurt` (plus proche)

### 2. Variables d'environnement
Render détectera automatiquement :
- `PORT=10000`
- `NODE_ENV=production`
- `OLLAMA_HOST=0.0.0.0:11434`

### 3. Déploiement automatique
- Render va build ton Docker
- Télécharger Ollama + Phi-3-mini
- Démarrer le serveur sur `https://ton-app.onrender.com`

### 4. Mettre à jour ton frontend
Dans `src/services/slmChatService.js` :
```javascript
this.apiUrl = 'https://sebbe-slm-assistant.onrender.com/api';
```

## 🔧 Configuration avancée

### Optimisation mémoire
Le plan gratuit a 512MB RAM. Pour optimiser :

```javascript
// Dans server.js, réduire les options du modèle
options: {
  temperature: 0.7,
  top_p: 0.9,
  max_tokens: 128, // Réduit de 256 à 128
  num_ctx: 1024    // Contexte plus petit
}
```

### Modèles alternatifs plus légers
Si Phi-3-mini est trop lourd :
```bash
# Dans le Dockerfile, remplacer par :
RUN ollama pull tinyllama  # 637MB au lieu de 2.2GB
# ou
RUN ollama pull gemma:2b   # 1.4GB
```

## 📊 Monitoring
- **Logs** : Dashboard Render → Logs
- **Métriques** : CPU/RAM usage
- **Health check** : `/api/health`

## 💰 Coûts avec Student Pack
- ✅ **500 heures/mois gratuit**
- ✅ **SSL automatique**
- ✅ **Auto-deploy depuis GitHub**
- ✅ **Pas de carte de crédit requise**

## 🚨 Limites à surveiller
- **RAM** : 512MB (suffisant pour Phi-3-mini)
- **CPU** : Partagé (peut être lent au démarrage)
- **Stockage** : 1GB (OK pour le modèle)
- **Bande passante** : 100GB/mois

## 🔄 Alternative : Hugging Face Spaces
Si Render ne suffit pas :
```yaml
# spaces/README.md
title: Sebbe SLM Assistant
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
```

Hugging Face Spaces est **100% gratuit** et supporte Docker !

## 🎯 Résultat final
Ton assistant aura :
- ✅ **SLM Phi-3-mini** pour des réponses naturelles
- ✅ **Fallback local** si le serveur est down
- ✅ **Coût zéro** avec Student Pack
- ✅ **Déploiement automatique** depuis GitHub