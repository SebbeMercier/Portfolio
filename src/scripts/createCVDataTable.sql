-- Script SQL pour créer la table cv_data
-- Cette table centralise toutes les données CV dans un format JSONB

-- Créer la table cv_data si elle n'existe pas
CREATE TABLE IF NOT EXISTS cv_data (
    id SERIAL PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer un index sur les données JSONB pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_cv_data_jsonb ON cv_data USING GIN (data);

-- Créer un index sur updated_at pour les requêtes de tri
CREATE INDEX IF NOT EXISTS idx_cv_data_updated_at ON cv_data (updated_at DESC);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Créer le trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS update_cv_data_updated_at ON cv_data;
CREATE TRIGGER update_cv_data_updated_at
    BEFORE UPDATE ON cv_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insérer une structure par défaut si la table est vide
INSERT INTO cv_data (data)
SELECT '{
  "personal_info": {
    "name": "Sebbe Mercier",
    "title": "Développeur Full Stack • React & Node.js",
    "email": "info@sebbe-mercier.tech",
    "phone": "+33 6 XX XX XX XX",
    "location": "France",
    "website": "https://sebbe-mercier.tech",
    "summary": "Développeur Full Stack passionné avec une expertise en React, Node.js et TypeScript. Spécialisé dans la création d'\''applications web modernes et performantes."
  },
  "experiences": [
    {
      "id": 1,
      "title": "Développeur Full Stack Senior",
      "company": "TechCorp Solutions",
      "location": "Paris, France",
      "description": "Développement d'\''applications web modernes avec React et Node.js. Gestion d'\''équipe de 3 développeurs juniors.",
      "start_date": "2022-01-01",
      "end_date": null,
      "current": true,
      "technologies": ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
      "achievements": [
        "Amélioration des performances de 40%",
        "Migration vers TypeScript",
        "Mise en place CI/CD"
      ]
    }
  ],
  "skills": [
    {"id": 1, "name": "React", "category": "frontend", "level": 5, "years_experience": 4},
    {"id": 2, "name": "Node.js", "category": "backend", "level": 4, "years_experience": 3},
    {"id": 3, "name": "TypeScript", "category": "frontend", "level": 4, "years_experience": 2},
    {"id": 4, "name": "PostgreSQL", "category": "backend", "level": 4, "years_experience": 3},
    {"id": 5, "name": "Tailwind CSS", "category": "frontend", "level": 5, "years_experience": 3}
  ],
  "projects": [
    {
      "id": 1,
      "title": "Portfolio Moderne",
      "description": "Site portfolio avec animations avancées et design responsive",
      "technologies": ["React", "Tailwind CSS", "Framer Motion", "Supabase"],
      "github_url": "https://github.com/sebbe/portfolio",
      "demo_url": "https://sebbe-mercier.tech"
    }
  ],
  "education": [
    {
      "id": 1,
      "title": "Master Informatique",
      "institution": "Université de Technologie",
      "location": "France",
      "start_date": "2017-09-01",
      "end_date": "2019-06-30",
      "description": "Spécialisation en développement web et bases de données"
    }
  ],
  "languages": [
    {"id": 1, "name": "Français", "level": "Natif"},
    {"id": 2, "name": "Anglais", "level": "Professionnel"},
    {"id": 3, "name": "Espagnol", "level": "Intermédiaire"}
  ],
  "achievements": [
    "Développeur Full Stack expérimenté",
    "Spécialiste React et Node.js",
    "Applications web modernes et performantes",
    "Expertise en bases de données relationnelles",
    "Maîtrise des outils DevOps modernes"
  ]
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM cv_data);

-- Commentaires sur la structure des données
COMMENT ON TABLE cv_data IS 'Table centralisée pour toutes les données CV au format JSONB';
COMMENT ON COLUMN cv_data.data IS 'Données CV au format JSON avec sections: personal_info, experiences, skills, projects, education, languages, achievements';
COMMENT ON COLUMN cv_data.created_at IS 'Date de création de l''entrée';
COMMENT ON COLUMN cv_data.updated_at IS 'Date de dernière modification (mise à jour automatique)';

-- Afficher le résultat
SELECT 
    id,
    jsonb_pretty(data) as cv_data_formatted,
    created_at,
    updated_at
FROM cv_data
ORDER BY updated_at DESC
LIMIT 1;