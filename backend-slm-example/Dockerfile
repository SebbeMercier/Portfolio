# Dockerfile optimisé pour Render avec GitHub Student Pack
FROM node:18-bullseye

# Installer les dépendances système pour Ollama
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Installer Ollama
RUN curl -fsSL https://ollama.ai/install.sh | sh

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer les dépendances Node.js
RUN npm ci --only=production

# Copier le code source
COPY . .

# Exposer le port Render (10000)
EXPOSE 10000

# Variables d'environnement
ENV OLLAMA_HOST=0.0.0.0:11434
ENV NODE_ENV=production
ENV PORT=10000

# Commande de démarrage
CMD ["node", "server.js"]