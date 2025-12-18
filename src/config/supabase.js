// supabase.js - Configuration Supabase
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase depuis les variables d'environnement
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Créer le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Whitelist des emails autorisés
const allowedEmailsString = process.env.REACT_APP_ALLOWED_EMAILS || 'admin@example.com';
export const ALLOWED_EMAILS = allowedEmailsString.split(',').map(email => email.trim().toLowerCase());

// Fonction pour vérifier si un email est autorisé
export const isEmailAllowed = (email) => {
    if (!email) return false;
    return ALLOWED_EMAILS.includes(email.toLowerCase());
};
