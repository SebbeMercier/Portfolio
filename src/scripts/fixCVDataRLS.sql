-- Script pour corriger le problème RLS de la table cv_data

-- Désactiver RLS sur la table cv_data
ALTER TABLE cv_data DISABLE ROW LEVEL SECURITY;

-- Vérifier que la table existe et est accessible
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE tablename = 'cv_data';

-- Insérer des données par défaut si la table est vide
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

-- Vérifier le résultat
SELECT 
    id,
    data->>'personal_info' as has_personal_info,
    jsonb_array_length(data->'experiences') as experiences_count,
    jsonb_array_length(data->'skills') as skills_count,
    jsonb_array_length(data->'projects') as projects_count,
    created_at,
    updated_at
FROM cv_data
ORDER BY created_at DESC
LIMIT 1;

-- Message de confirmation
SELECT 'RLS désactivé et données initialisées avec succès !' as status;