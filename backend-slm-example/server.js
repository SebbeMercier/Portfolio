// Backend API pour SLM avec Ollama - Optimisé pour Render (GitHub Student Pack)
const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();
const PORT = process.env.PORT || 10000; // Port par défaut Render

// Configuration CORS pour GitHub Pages
app.use(cors({
  origin: ['https://sebbe-mercier.tech', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// Démarrer Ollama au lancement
let ollamaProcess;

const startOllama = () => {
  console.log('🚀 Démarrage d\'Ollama...');
  ollamaProcess = spawn('ollama', ['serve'], {
    stdio: 'inherit',
    env: { ...process.env, OLLAMA_HOST: '0.0.0.0:11434' }
  });
};

// Télécharger le modèle au premier démarrage
const downloadModel = async () => {
  return new Promise((resolve) => {
    console.log('📥 Téléchargement de Phi-3-mini...');
    const download = spawn('ollama', ['pull', 'phi3:mini'], { stdio: 'inherit' });
    download.on('close', () => {
      console.log('✅ Modèle téléchargé');
      resolve();
    });
  });
};

// API endpoint pour le chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Prompt système pour le portfolio
    const systemPrompt = `Tu es l'assistant personnel de Sebbe Mercier, développeur Full Stack spécialisé en React et Node.js.
    
Informations sur Sebbe :
- Développeur Full Stack avec 4+ ans d'expérience
- Spécialités : React, TypeScript, Node.js, Supabase
- Projets : Portfolio moderne, E-commerce, Dashboard Analytics
- Localisation : Belgique
- Email : info@sebbe-mercier.tech
- Disponible pour nouveaux projets

Réponds de manière professionnelle et concise. Reste dans le contexte de son portfolio.
Si on te demande des informations que tu n'as pas, redirige vers ses projets ou son contact.

Message utilisateur : ${message}`;

    // Appel à Ollama
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'phi3:mini',
        prompt: systemPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 256
        }
      })
    });

    const data = await response.json();
    
    res.json({
      response: data.response,
      model: 'phi3:mini',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur API:', error);
    res.status(500).json({ 
      error: 'Erreur du serveur',
      fallback: 'Je rencontre un problème technique. Pouvez-vous me contacter directement à info@sebbe-mercier.tech ?'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    model: 'phi3:mini',
    timestamp: new Date().toISOString()
  });
});

// Démarrage du serveur
const startServer = async () => {
  try {
    startOllama();
    
    // Attendre qu'Ollama soit prêt
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Télécharger le modèle si nécessaire
    await downloadModel();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Serveur SLM démarré sur le port ${PORT}`);
      console.log(`📡 API disponible sur /api/chat`);
    });
    
  } catch (error) {
    console.error('Erreur démarrage:', error);
  }
};

// Nettoyage à l'arrêt
process.on('SIGTERM', () => {
  if (ollamaProcess) {
    ollamaProcess.kill();
  }
  process.exit(0);
});

startServer();