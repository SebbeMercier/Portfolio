// imageUploadService.js - Service pour gérer l'upload d'images localement
// Les images sont converties en base64 et stockées dans Firestore
// Ou tu peux les mettre manuellement dans /public/images/

/**
 * Convertir une image en base64 pour stockage dans Firestore
 * @param {File} file - Le fichier image
 * @returns {Promise<string>} - L'image en base64
 */
export const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        // Compresser l'image avant conversion
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Limiter la taille max à 1200px de largeur
                const maxWidth = 1200;
                const scale = maxWidth / img.width;
                canvas.width = img.width > maxWidth ? maxWidth : img.width;
                canvas.height = img.width > maxWidth ? img.height * scale : img.height;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Convertir en base64 avec compression
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Valider le fichier image
 * @param {File} file - Le fichier à valider
 * @returns {boolean} - True si valide
 */
export const validateImageFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        return false;
    }

    if (file.size > maxSize) {
        alert('Image size must be less than 5MB');
        return false;
    }

    return true;
};

/**
 * Générer un nom de fichier unique
 * @param {string} originalName - Nom original du fichier
 * @returns {string} - Nom unique
 */
export const generateUniqueFileName = (originalName) => {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    const nameWithoutExt = originalName.replace(`.${extension}`, '').replace(/[^a-z0-9]/gi, '-').toLowerCase();
    return `${nameWithoutExt}-${timestamp}.${extension}`;
};

/**
 * Instructions pour uploader manuellement dans GitHub
 */
export const getUploadInstructions = (fileName) => {
    return `
📸 Pour ajouter cette image à ton site :

1. Sauvegarde ton image localement avec le nom : ${fileName}
2. Place-la dans le dossier : public/images/projects/
3. Commit et push vers GitHub
4. L'image sera accessible à : /images/projects/${fileName}

Ou utilise l'option base64 pour stocker directement dans Firestore (pas besoin de commit).
    `.trim();
};
