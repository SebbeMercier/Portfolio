-- Portfolio Database Schema - Version Simplifiée
-- Seulement les tables essentielles

-- 1. Analytics & Page Views (pour tracking)
CREATE TABLE page_views (
    id BIGSERIAL PRIMARY KEY,
    page TEXT NOT NULL,
    visitor_id TEXT,
    session_id TEXT,
    referrer TEXT,
    country TEXT,
    city TEXT,
    device TEXT,
    browser TEXT,
    os TEXT,
    duration INTEGER, -- temps passé sur la page en secondes
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projets (essentiel pour portfolio)
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    long_description TEXT,
    technologies TEXT[],
    github_url TEXT,
    demo_url TEXT,
    images TEXT[],
    featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'completed', -- completed, in-progress
    start_date DATE,
    end_date DATE,
    client TEXT,
    category TEXT,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Témoignages (important pour crédibilité)
CREATE TABLE testimonials (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT,
    company TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    avatar_url TEXT,
    project_id BIGINT REFERENCES projects(id),
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Compétences
CREATE TABLE skills (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- frontend, backend, tools, etc.
    level INTEGER DEFAULT 1, -- 1-5
    icon TEXT,
    color TEXT,
    description TEXT,
    years_experience INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Timeline/Expériences
CREATE TABLE experiences (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT,
    location TEXT,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN DEFAULT false,
    type TEXT DEFAULT 'work', -- work, education, project
    technologies TEXT[],
    achievements TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Contact Messages (essentiel)
CREATE TABLE contact_messages (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    budget_range TEXT,
    project_type TEXT,
    status TEXT DEFAULT 'new', -- new, read, replied
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Chat Messages (pour le live chat)
CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- user, bot
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CV Downloads (tracking)
CREATE TABLE cv_downloads (
    id BIGSERIAL PRIMARY KEY,
    visitor_id TEXT,
    format TEXT DEFAULT 'pdf',
    source TEXT, -- navbar, contact, etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes pour performance
CREATE INDEX idx_page_views_page ON page_views(page);
CREATE INDEX idx_page_views_created_at ON page_views(created_at);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_chat_messages_visitor ON chat_messages(visitor_id);
CREATE INDEX idx_cv_downloads_created_at ON cv_downloads(created_at);

-- RLS (Row Level Security) policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies pour lecture publique
CREATE POLICY "Projets publics" ON projects FOR SELECT USING (true);
CREATE POLICY "Témoignages publics" ON testimonials FOR SELECT USING (true);

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();