// supabaseProjectService.js - Service pour gérer les projets avec Supabase
import { supabase } from '../config/supabase';
import { projectsData as defaultProjects } from '../data/projectsData';

const PROJECTS_TABLE = 'projects';
const STORAGE_BUCKET = 'project-images';

// Récupérer tous les projets
export const getProjects = async () => {
    try {
        const { data, error } = await supabase
            .from(PROJECTS_TABLE)
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching projects:', error);
            return defaultProjects;
        }

        if (!data || data.length === 0) {
            console.log('No projects in Supabase, using defaults');
            return defaultProjects;
        }

        return data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return defaultProjects;
    }
};

// Sauvegarder un projet (créer ou mettre à jour)
export const saveProject = async (project) => {
    try {
        const { data, error } = await supabase
            .from(PROJECTS_TABLE)
            .upsert(project, { onConflict: 'id' })
            .select()
            .single();

        if (error) {
            console.error('Error saving project:', error);
            return { success: false, error: error.message };
        }

        return { success: true, project: data };
    } catch (error) {
        console.error('Error saving project:', error);
        return { success: false, error: error.message };
    }
};

// Supprimer un projet
export const deleteProject = async (projectId, imageUrl = null) => {
    try {
        // Supprimer l'image du Storage si elle existe
        if (imageUrl && imageUrl.includes('supabase')) {
            await deleteImage(imageUrl);
        }

        const { error } = await supabase
            .from(PROJECTS_TABLE)
            .delete()
            .eq('id', projectId);

        if (error) {
            console.error('Error deleting project:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting project:', error);
        return { success: false, error: error.message };
    }
};

// Upload une image dans Supabase Storage
export const uploadImage = async (file) => {
    try {
        // Générer un nom unique
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload le fichier
        const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Error uploading image:', error);
            return { success: false, error: error.message };
        }

        // Récupérer l'URL publique
        const { data: { publicUrl } } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(filePath);

        return { success: true, url: publicUrl };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { success: false, error: error.message };
    }
};

// Supprimer une image de Supabase Storage
export const deleteImage = async (imageUrl) => {
    try {
        // Extraire le nom du fichier depuis l'URL
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];

        const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([fileName]);

        if (error) {
            console.error('Error deleting image:', error);
        }
    } catch (error) {
        console.error('Error deleting image:', error);
    }
};

// Initialiser Supabase avec les projets par défaut
export const initializeSupabase = async () => {
    try {
        const { data: existingProjects } = await supabase
            .from(PROJECTS_TABLE)
            .select('id')
            .limit(1);

        if (existingProjects && existingProjects.length > 0) {
            return { success: true, message: 'Supabase already has projects' };
        }

        console.log('Initializing Supabase with default projects...');

        const { error } = await supabase
            .from(PROJECTS_TABLE)
            .insert(defaultProjects);

        if (error) {
            console.error('Error initializing Supabase:', error);
            return { success: false, error: error.message };
        }

        console.log('Supabase initialized successfully!');
        return { success: true, message: 'Initialized with default projects' };
    } catch (error) {
        console.error('Error initializing Supabase:', error);
        return { success: false, error: error.message };
    }
};
