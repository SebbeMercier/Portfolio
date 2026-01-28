// supabaseProjectService.js - Service pour gérer les projets avec Supabase
import { supabase } from '../config/supabase';

const PROJECTS_TABLE = 'projects';
const STORAGE_BUCKET = 'project-images';

// Créer le bucket de stockage s'il n'existe pas
export const createStorageBucket = async () => {
    try {
        const { data, error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
            public: true,
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            fileSizeLimit: 5242880 // 5MB
        });

        if (error && !error.message.includes('already exists')) {
            console.error('Error creating bucket:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Storage bucket ready:', STORAGE_BUCKET);
        return { success: true };
    } catch (error) {
        console.error('Error creating bucket:', error);
        return { success: false, error: error.message };
    }
};

// Récupérer tous les projets
export const getProjects = async () => {
    try {
        const { data, error } = await supabase
            .from(PROJECTS_TABLE)
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching projects:', error);
            return [];
        }

        if (!data || data.length === 0) {
            console.log('No projects in Supabase');
            return [];
        }

        return data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
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
        console.log('🔄 Starting image upload...', {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        });

        // Vérifier la taille du fichier (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return { success: false, error: 'File size must be less than 5MB' };
        }

        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
            return { success: false, error: 'File must be an image' };
        }

        // Générer un nom unique
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        console.log('📁 Generated file path:', filePath);

        // Vérifier si le bucket existe
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        console.log('🪣 Available buckets:', buckets);
        
        if (bucketsError) {
            console.error('❌ Error listing buckets:', bucketsError);
            return { success: false, error: `Bucket error: ${bucketsError.message}` };
        }

        const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);
        if (!bucketExists) {
            console.log('🔧 Storage bucket does not exist, attempting to create it...');
            const createResult = await createStorageBucket();
            if (!createResult.success) {
                return { success: false, error: `Failed to create storage bucket: ${createResult.error}. Please create the '${STORAGE_BUCKET}' bucket manually in your Supabase dashboard under Storage.` };
            }
        }

        console.log('✅ Storage bucket exists, proceeding with upload...');

        // Upload le fichier
        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('❌ Error uploading image:', error);
            return { success: false, error: `Upload failed: ${error.message}` };
        }

        console.log('✅ Upload successful:', data);

        // Récupérer l'URL publique
        const { data: { publicUrl } } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(filePath);

        console.log('🔗 Generated public URL:', publicUrl);

        return { success: true, url: publicUrl };
    } catch (error) {
        console.error('💥 Unexpected error uploading image:', error);
        return { success: false, error: `Unexpected error: ${error.message}` };
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

        console.log('No default projects to initialize. Use the admin panel to create projects.');
        return { success: true, message: 'No default projects configured. Create projects manually in the admin panel.' };
    } catch (error) {
        console.error('Error checking Supabase:', error);
        return { success: false, error: error.message };
    }
};
