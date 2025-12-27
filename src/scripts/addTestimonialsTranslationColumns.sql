-- Script SQL pour ajouter les colonnes de traduction à la table testimonials
-- À exécuter dans Supabase SQL Editor

-- Ajouter les colonnes pour les traductions
ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS content_fr TEXT,
ADD COLUMN IF NOT EXISTS content_nl TEXT;

-- Créer une table pour stocker les traductions automatiques (optionnel)
CREATE TABLE IF NOT EXISTS translations (
    id BIGSERIAL PRIMARY KEY,
    original_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    target_language VARCHAR(5) NOT NULL,
    content_type VARCHAR(50) DEFAULT 'testimonial',
    content_id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Index unique pour éviter les doublons
    UNIQUE(original_text, target_language, content_type)
);

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_translations_content_type ON translations(content_type);
CREATE INDEX IF NOT EXISTS idx_translations_target_language ON translations(target_language);
CREATE INDEX IF NOT EXISTS idx_translations_content_id ON translations(content_id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at sur la table translations
DROP TRIGGER IF EXISTS update_translations_updated_at ON translations;
CREATE TRIGGER update_translations_updated_at
    BEFORE UPDATE ON translations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Commentaires pour documenter les colonnes
COMMENT ON COLUMN testimonials.content_fr IS 'Contenu du témoignage en français';
COMMENT ON COLUMN testimonials.content_nl IS 'Contenu du témoignage en néerlandais';
COMMENT ON TABLE translations IS 'Table pour stocker les traductions automatiques';
COMMENT ON COLUMN translations.original_text IS 'Texte original en anglais';
COMMENT ON COLUMN translations.translated_text IS 'Texte traduit';
COMMENT ON COLUMN translations.target_language IS 'Langue cible (fr, nl, etc.)';
COMMENT ON COLUMN translations.content_type IS 'Type de contenu (testimonial, etc.)';
COMMENT ON COLUMN translations.content_id IS 'ID du contenu source (optionnel)';

-- Afficher les colonnes ajoutées
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'testimonials' 
AND column_name IN ('content_fr', 'content_nl');

-- Afficher la structure de la table translations
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'translations'
ORDER BY ordinal_position;