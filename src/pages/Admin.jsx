// Admin.jsx - Panel d'administration pour gérer les projets et témoignages avec Supabase
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Save, X, Eye, LogOut, Upload, RefreshCw, Star, MessageSquare, EyeOff, FileText, Zap } from 'lucide-react';
import { supabase, isEmailAllowed } from '../config/supabase';
import { getProjects, saveProject, deleteProject, initializeSupabase, uploadImage } from '../services/supabaseProjectService';
import { getTestimonials, saveTestimonial, deleteTestimonial, toggleTestimonialVisibility, initializeTestimonials } from '../services/testimonialsService';
import { getPendingFeedback, approveFeedback, rejectFeedback, cleanupRejectedFeedback } from '../services/feedbackService';
import { validateImageFile } from '../services/imageUploadService';
import { StatsWidget } from '../components/admin/StatsWidget';
import CVManager from '../components/cv/CVManager';
import CVDataManager from '../components/cv/CVDataManager';
import ProjectFormAI from '../components/admin/ProjectFormAI';
import PerformanceManager from '../components/admin/PerformanceManager';

const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'testimonials', 'feedback', 'cv', 'cvdata', ou 'performance'
    
    // Projects state
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    
    // Testimonials state
    const [testimonials, setTestimonials] = useState([]);
    const [isEditingTestimonial, setIsEditingTestimonial] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(null);
    
    // Feedback state
    const [pendingFeedback, setPendingFeedback] = useState([]);
    
    // Common state
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const loadProjects = async () => {
        const data = await getProjects();
        setProjects(data);
    };

    const loadTestimonials = async () => {
        const data = await getTestimonials();
        setTestimonials(data);
    };

    const loadPendingFeedback = async () => {
        const data = await getPendingFeedback();
        setPendingFeedback(data);
    };

    const loadData = useCallback(async () => {
        setIsLoading(true);
        await Promise.all([loadProjects(), loadTestimonials(), loadPendingFeedback()]);
        setIsLoading(false);
    }, []);

    // Charger les données depuis Supabase
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Écouter les changements d'authentification Supabase
    useEffect(() => {
        // Vérifier la session actuelle
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user && isEmailAllowed(session.user.email)) {
                setUser(session.user);
                setError('');
            } else if (session?.user && !isEmailAllowed(session.user.email)) {
                setError(`Access denied. Your email (${session.user.email}) is not authorized.`);
                supabase.auth.signOut();
                setUser(null);
            }
            setIsLoading(false);
        });

        // Écouter les changements d'auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user && isEmailAllowed(session.user.email)) {
                setUser(session.user);
                setError('');
            } else if (session?.user && !isEmailAllowed(session.user.email)) {
                setError(`Access denied. Your email (${session.user.email}) is not authorized.`);
                supabase.auth.signOut();
                setUser(null);
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Initialiser Supabase avec les projets par défaut
    const handleInitializeSupabase = async () => {
        if (!window.confirm('Initialize Supabase with default projects? This should only be done once.')) {
            return;
        }
        
        setIsLoading(true);
        const result = await initializeSupabase();
        
        if (result.success) {
            setSuccessMessage('✅ Supabase initialized successfully!');
            await loadProjects();
        } else {
            setError('❌ Failed to initialize: ' + result.error);
        }
        
        setIsLoading(false);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    // Connexion avec Google via Supabase
    const handleGoogleLogin = async () => {
        try {
            setError('');
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/admin'
                }
            });
            
            if (error) {
                setError('Login failed: ' + error.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Login failed. Please try again.');
        }
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Créer un nouveau projet
    const handleNewProject = () => {
        const newProject = {
            title: '',
            description: '',
            tags: [],
            image: '',
            links: {},
            features: [],
            year: new Date().getFullYear().toString(),
            status: 'completed',
            duration: '',
            role: '',
            client: '',
            category: '',
            results: '',
            team: '',
            budget: '',
            metrics: {},
            
            // Nouveaux champs pour l'IA (optionnels)
            short_description: '',
            technologies: [],
            visibility: 'public',
            live_url: '',
            github_url: '',
            demo_url: '',
            start_date: null,
            end_date: null,
            duration_months: null,
            team_size: 1,
            my_role: '',
            challenges: [],
            solutions: [],
            screenshots: [],
            complexity_level: 3,
            impact_score: 5,
            is_featured: false,
            featured: false,
            ai_priority: 5
        };
        setCurrentProject(newProject);
        setImagePreview(null);
        setIsEditing(true);
    };

    // Éditer un projet existant
    const handleEdit = (project) => {
        setCurrentProject({ ...project });
        setImagePreview(project.image || null);
        setIsEditing(true);
    };

    // Supprimer un projet
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) {
            return;
        }
        
        const project = projects.find(p => p.id === id);
        
        setIsLoading(true);
        const result = await deleteProject(id, project?.image);
        
        if (result.success) {
            setSuccessMessage('✅ Project deleted successfully!');
            await loadProjects();
        } else {
            setError('❌ Failed to delete: ' + result.error);
        }
        
        setIsLoading(false);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    // Sauvegarder les modifications
    const handleSave = async () => {
        if (!currentProject.title) {
            alert('❌ Title is required!');
            return;
        }

        console.log('💾 Saving project:', currentProject);
        setIsSaving(true);
        
        try {
            // Nettoyer les données avant sauvegarde
            const cleanProject = {
                ...currentProject,
                // S'assurer que les arrays sont bien des arrays
                tags: Array.isArray(currentProject.tags) ? currentProject.tags : [],
                features: Array.isArray(currentProject.features) ? currentProject.features : [],
                technologies: Array.isArray(currentProject.technologies) ? currentProject.technologies : [],
                challenges: Array.isArray(currentProject.challenges) ? currentProject.challenges : [],
                solutions: Array.isArray(currentProject.solutions) ? currentProject.solutions : [],
                screenshots: Array.isArray(currentProject.screenshots) ? currentProject.screenshots : [],
                // S'assurer que les objets sont bien des objets
                links: currentProject.links || {},
                metrics: currentProject.metrics || {},
                // Valeurs par défaut pour les champs requis
                team_size: currentProject.team_size || 1,
                complexity_level: currentProject.complexity_level || 3,
                impact_score: currentProject.impact_score || 5,
                ai_priority: currentProject.ai_priority || 5,
                visibility: currentProject.visibility || 'public',
                status: currentProject.status || 'completed'
            };

            console.log('🧹 Cleaned project data:', cleanProject);
            
            const result = await saveProject(cleanProject);
            
            if (result.success) {
                setSuccessMessage('✅ Project saved successfully!');
                await loadProjects();
                setIsEditing(false);
                setCurrentProject(null);
                setImagePreview(null);
                setShowPreview(false);
            } else {
                console.error('❌ Save failed:', result.error);
                setError('❌ Failed to save: ' + result.error);
            }
        } catch (error) {
            console.error('💥 Unexpected save error:', error);
            setError('❌ Unexpected error: ' + error.message);
        }
        
        setIsSaving(false);
        setTimeout(() => {
            setSuccessMessage('');
            setError('');
        }, 5000);
    };

    // Annuler l'édition
    const handleCancel = () => {
        setIsEditing(false);
        setCurrentProject(null);
        setImagePreview(null);
    };

    // Mettre à jour un champ du projet
    const updateField = (field, value) => {
        setCurrentProject({ ...currentProject, [field]: value });
    };

    // Ajouter/supprimer des tags
    const addTag = (tag) => {
        if (tag && !currentProject.tags.includes(tag)) {
            updateField('tags', [...currentProject.tags, tag]);
        }
    };

    const removeTag = (tag) => {
        updateField('tags', (currentProject.tags || []).filter(t => t !== tag));
    };

    // Ajouter/supprimer des features
    const addFeature = (feature) => {
        if (feature) {
            updateField('features', [...currentProject.features, feature]);
        }
    };

    const removeFeature = (index) => {
        const newFeatures = [...currentProject.features];
        newFeatures.splice(index, 1);
        updateField('features', newFeatures);
    };

    // Gérer l'upload d'image vers Supabase Storage
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log('🖼️ Image upload started:', {
            name: file.name,
            size: file.size,
            type: file.type
        });

        if (!validateImageFile(file)) {
            console.log('❌ Image validation failed');
            return;
        }

        try {
            setSuccessMessage('⏳ Uploading image...');
            setError('');
            
            // Upload vers Supabase Storage
            const result = await uploadImage(file);
            
            console.log('📤 Upload result:', result);
            
            if (result.success) {
                updateField('image', result.url);
                setImagePreview(result.url);
                setSuccessMessage('✅ Image uploaded successfully!');
                console.log('✅ Image uploaded to:', result.url);
            } else {
                console.error('❌ Upload failed:', result.error);
                setError('❌ Failed to upload: ' + result.error);
            }
            
            setTimeout(() => {
                setSuccessMessage('');
                setError('');
            }, 5000);
        } catch (error) {
            console.error('💥 Unexpected upload error:', error);
            setError('❌ Unexpected upload error: ' + error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    // ========================================
    // TESTIMONIALS FUNCTIONS
    // ========================================

    // Créer un nouveau témoignage
    const handleNewTestimonial = () => {
        const newTestimonial = {
            id: Math.max(...testimonials.map(t => t.id), 0) + 1,
            name: '',
            role: '',
            company: '',
            content: '',
            rating: 5,
            avatar: '',
            isVisible: true,
            order: testimonials.length + 1,
            createdAt: new Date().toISOString()
        };
        setCurrentTestimonial(newTestimonial);
        setIsEditingTestimonial(true);
    };

    // Éditer un témoignage existant
    const handleEditTestimonial = (testimonial) => {
        setCurrentTestimonial({ ...testimonial });
        setIsEditingTestimonial(true);
    };

    // Supprimer un témoignage
    const handleDeleteTestimonial = async (id) => {
        if (!window.confirm('Are you sure you want to delete this testimonial?')) {
            return;
        }
        
        setIsLoading(true);
        const result = await deleteTestimonial(id);
        
        if (result.success) {
            setSuccessMessage('✅ Testimonial deleted successfully!');
            await loadTestimonials();
        } else {
            setError('❌ Failed to delete: ' + result.error);
        }
        
        setIsLoading(false);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    // Sauvegarder un témoignage
    const handleSaveTestimonial = async () => {
        if (!currentTestimonial.name || !currentTestimonial.content) {
            alert('❌ Name and content are required!');
            return;
        }

        setIsSaving(true);
        const result = await saveTestimonial(currentTestimonial);
        
        if (result.success) {
            setSuccessMessage('✅ Testimonial saved successfully!');
            await loadTestimonials();
            setIsEditingTestimonial(false);
            setCurrentTestimonial(null);
        } else {
            setError('❌ Failed to save: ' + result.error);
        }
        
        setIsSaving(false);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    // Annuler l'édition d'un témoignage
    const handleCancelTestimonial = () => {
        setIsEditingTestimonial(false);
        setCurrentTestimonial(null);
    };

    // Mettre à jour un champ du témoignage
    const updateTestimonialField = (field, value) => {
        setCurrentTestimonial({ ...currentTestimonial, [field]: value });
    };

    // Toggle visibilité d'un témoignage
    const handleToggleVisibility = async (id, currentVisibility) => {
        const result = await toggleTestimonialVisibility(id, !currentVisibility);
        
        if (result.success) {
            setSuccessMessage(`✅ Testimonial ${!currentVisibility ? 'shown' : 'hidden'} successfully!`);
            await loadTestimonials();
        } else {
            setError('❌ Failed to update visibility: ' + result.error);
        }
        
        setTimeout(() => setSuccessMessage(''), 2000);
    };

    // Initialiser les témoignages
    const handleInitializeTestimonials = async () => {
        if (!window.confirm('Initialize Supabase with default testimonials? This should only be done once.')) {
            return;
        }
        
        setIsLoading(true);
        const result = await initializeTestimonials();
        
        if (result.success) {
            setSuccessMessage('✅ Testimonials initialized successfully!');
            await loadTestimonials();
        } else {
            setError('❌ Failed to initialize: ' + result.error);
        }
        
        setIsLoading(false);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    // ========================================
    // FEEDBACK FUNCTIONS
    // ========================================

    // Approuver un feedback
    const handleApproveFeedback = async (feedbackId) => {
        if (!window.confirm('Approve this feedback and add it as a testimonial?')) {
            return;
        }
        
        setIsLoading(true);
        const result = await approveFeedback(feedbackId);
        
        if (result.success) {
            setSuccessMessage('✅ Feedback approved and added as testimonial!');
            await Promise.all([loadPendingFeedback(), loadTestimonials()]);
        } else {
            setError('❌ Failed to approve: ' + result.error);
        }
        
        setIsLoading(false);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    // Rejeter un feedback (supprime automatiquement)
    const handleRejectFeedback = async (feedbackId) => {
        const reason = prompt('Reason for rejection (optional):\n\n⚠️ This will permanently delete the feedback from the database.');
        if (reason === null) return; // User cancelled
        
        if (!window.confirm('Are you sure you want to reject and permanently delete this feedback?')) {
            return;
        }
        
        setIsLoading(true);
        const result = await rejectFeedback(feedbackId, reason);
        
        if (result.success) {
            setSuccessMessage('✅ Feedback rejected and deleted permanently!');
            await loadPendingFeedback();
        } else {
            setError('❌ Failed to reject: ' + result.error);
        }
        
        setIsLoading(false);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    // Nettoyer les anciens avis rejetés
    const handleCleanupRejected = async () => {
        if (!window.confirm('Clean up any old rejected feedback entries from the database?')) {
            return;
        }
        
        setIsLoading(true);
        const result = await cleanupRejectedFeedback();
        
        if (result.success) {
            setSuccessMessage(`✅ ${result.message}`);
            await loadPendingFeedback();
        } else {
            setError('❌ Failed to cleanup: ' + result.error);
        }
        
        setIsLoading(false);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    // Page de chargement
    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-gradient-to-b from-[#0a1a2e] via-[#1a2a3e] to-[#0a0f1f]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Page de login
    if (!user) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-gradient-to-b from-[#0a1a2e] via-[#1a2a3e] to-[#0a0f1f]">
                <div className="max-w-md w-full">
                    <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
                            <p className="text-gray-400">Sign in with your authorized Google account</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Sign in with Google
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Panel admin
    return (
        <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a1a2e] via-[#1a2a3e] to-[#0a0f1f]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Admin <span className="text-purple-400">Panel</span>
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Logged in as: <span className="text-purple-400">{user.email}</span>
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={loadProjects}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            disabled={isLoading}
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button
                            onClick={handleInitializeSupabase}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            disabled={isLoading}
                        >
                            Initialize Supabase
                        </button>
                        <button
                            onClick={async () => {
                                setIsLoading(true);
                                const { createStorageBucket } = await import('../services/supabaseProjectService');
                                const result = await createStorageBucket();
                                if (result.success) {
                                    setSuccessMessage('✅ Storage bucket created successfully!');
                                } else {
                                    setError('❌ Failed to create storage bucket: ' + result.error);
                                }
                                setIsLoading(false);
                                setTimeout(() => {
                                    setSuccessMessage('');
                                    setError('');
                                }, 3000);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            disabled={isLoading}
                        >
                            Create Storage Bucket
                        </button>
                        <button
                            onClick={async () => {
                                setIsLoading(true);
                                const portfolioDataService = (await import('../services/portfolioDataService')).default;
                                portfolioDataService.clearCache();
                                const newData = await portfolioDataService.getPortfolioData();
                                console.log('🔄 Cache vidé, nouvelles données:', newData);
                                setSuccessMessage('✅ Cache IA vidé et données rechargées!');
                                setIsLoading(false);
                                setTimeout(() => setSuccessMessage(''), 3000);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                            disabled={isLoading}
                        >
                            Vider Cache IA
                        </button>
                        <button
                            onClick={() => navigate('/projects')}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            View Site
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Live Stats Widget */}
                <div className="mb-8">
                    <StatsWidget compact={true} />
                </div>

                {/* Messages */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="text-green-400 text-sm">{successMessage}</p>
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Tabs */}
                {!isEditing && !isEditingTestimonial && (
                    <div className="flex gap-2 mb-8">
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                                activeTab === 'projects'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            <Eye className="w-4 h-4" />
                            Projects ({projects.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('testimonials')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                                activeTab === 'testimonials'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Testimonials ({testimonials.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('feedback')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                                activeTab === 'feedback'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            <Star className="w-4 h-4" />
                            Pending Feedback ({pendingFeedback.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('cv')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                                activeTab === 'cv'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            <FileText className="w-4 h-4" />
                            CV Manager
                        </button>
                        <button
                            onClick={() => setActiveTab('cvdata')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                                activeTab === 'cvdata'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            <FileText className="w-4 h-4" />
                            CV Data
                        </button>
                        <button
                            onClick={() => setActiveTab('performance')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                                activeTab === 'performance'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            <Zap className="w-4 h-4" />
                            Performance IA
                        </button>

                    </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && !isEditing && !isEditingTestimonial ? (
                    <>
                        {/* Bouton nouveau projet */}
                        <button
                            onClick={handleNewProject}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 transition-transform mb-8"
                        >
                            <Plus className="w-5 h-5" />
                            New Project
                        </button>

                        {/* Liste des projets */}
                        <div className="grid gap-6">
                            {projects.map((project) => (
                                <div key={project.id} className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {(project.tags || []).slice(0, 5).map((tag, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-4 text-sm text-gray-400">
                                                <span>Year: {project.year}</span>
                                                <span>Status: {project.status}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(project)}
                                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : activeTab === 'testimonials' && !isEditing && !isEditingTestimonial ? (
                    <>
                        {/* Testimonials Tab */}
                        <div className="flex gap-3 mb-8">
                            <button
                                onClick={handleNewTestimonial}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 transition-transform"
                            >
                                <Plus className="w-5 h-5" />
                                New Testimonial
                            </button>
                            <button
                                onClick={handleInitializeTestimonials}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                disabled={isLoading}
                            >
                                Initialize Testimonials
                            </button>
                        </div>

                        {/* Liste des témoignages */}
                        <div className="grid gap-6">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-4 flex-1">
                                            <img
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/30"
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=7c3aed&color=fff&size=64`;
                                                }}
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-white">{testimonial.name}</h3>
                                                    <div className="flex gap-1">
                                                        {[...Array(testimonial.rating)].map((_, i) => (
                                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        ))}
                                                    </div>
                                                    {!testimonial.isVisible && (
                                                        <span className="px-2 py-1 bg-red-900/30 text-red-300 text-xs rounded-full">
                                                            Hidden
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-purple-400 text-sm mb-1">{testimonial.role}</p>
                                                {testimonial.company && (
                                                    <p className="text-gray-500 text-sm mb-3">{testimonial.company}</p>
                                                )}
                                                <p className="text-gray-300 text-sm italic">"{testimonial.content}"</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleToggleVisibility(testimonial.id, testimonial.isVisible)}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    testimonial.isVisible 
                                                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                                                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                                                }`}
                                                title={testimonial.isVisible ? 'Hide testimonial' : 'Show testimonial'}
                                            >
                                                {testimonial.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleEditTestimonial(testimonial)}
                                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTestimonial(testimonial.id)}
                                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : activeTab === 'feedback' && !isEditing && !isEditingTestimonial ? (
                    <>
                        {/* Feedback Tab */}
                        <div className="mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <h2 className="text-2xl font-bold text-white">Pending Feedback</h2>
                                <button
                                    onClick={loadPendingFeedback}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Refresh
                                </button>
                                <button
                                    onClick={handleCleanupRejected}
                                    className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                    disabled={isLoading}
                                >
                                    🧹 Cleanup
                                </button>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Review and approve feedback submissions to add them as testimonials on your portfolio.
                            </p>
                        </div>

                        {pendingFeedback.length === 0 ? (
                            <div className="text-center py-12">
                                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-400 mb-2">No pending feedback</h3>
                                <p className="text-gray-500">
                                    New feedback submissions will appear here for review.
                                </p>
                                <a
                                    href="/feedback"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Feedback Form
                                </a>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {pendingFeedback.map((feedback) => (
                                    <div key={feedback.id} className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex gap-4 flex-1">
                                                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                    {feedback.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-xl font-bold text-white">{feedback.name}</h3>
                                                        <div className="flex gap-1">
                                                            {[...Array(feedback.rating)].map((_, i) => (
                                                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                            ))}
                                                        </div>
                                                        <span className="px-2 py-1 bg-yellow-900/30 text-yellow-300 text-xs rounded-full">
                                                            Pending
                                                        </span>
                                                    </div>
                                                    <p className="text-purple-400 text-sm">{feedback.email}</p>
                                                    {feedback.role && (
                                                        <p className="text-gray-400 text-sm">{feedback.role}</p>
                                                    )}
                                                    {feedback.company && (
                                                        <p className="text-gray-500 text-sm">{feedback.company}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApproveFeedback(feedback.id)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                                    disabled={isLoading}
                                                >
                                                    ✅ Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRejectFeedback(feedback.id)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                                    disabled={isLoading}
                                                    title="Reject and permanently delete this feedback"
                                                >
                                                    🗑️ Reject & Delete
                                                </button>
                                            </div>
                                        </div>

                                        {/* Feedback Content */}
                                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-4">
                                            <p className="text-gray-300 italic">"{feedback.content}"</p>
                                        </div>

                                        {/* Project Details */}
                                        {(feedback.projectType || feedback.workDuration) && (
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                                                {feedback.project_type && (
                                                    <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded-full">
                                                        {feedback.project_type}
                                                    </span>
                                                )}
                                                {feedback.work_duration && (
                                                    <span>Duration: {feedback.work_duration}</span>
                                                )}
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    feedback.would_recommend 
                                                        ? 'bg-green-900/30 text-green-300' 
                                                        : 'bg-red-900/30 text-red-300'
                                                }`}>
                                                    {feedback.would_recommend ? 'Would recommend' : 'Would not recommend'}
                                                </span>
                                            </div>
                                        )}

                                        {/* Submission Info */}
                                        <div className="text-xs text-gray-500 border-t border-gray-700 pt-3">
                                            <p>Submitted: {new Date(feedback.submitted_at).toLocaleString()}</p>
                                            {feedback.user_agent && (
                                                <p className="truncate">User Agent: {feedback.user_agent}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : activeTab === 'cv' && !isEditing && !isEditingTestimonial ? (
                    <>
                        {/* CV Manager Tab */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-4">
                                CV <span className="text-purple-400">Manager</span>
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">
                                Gérez et générez votre CV dynamique basé sur les données de la base de données.
                            </p>
                        </div>
                        
                        {/* Intégrer CVManager */}
                        <div className="bg-gray-900/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
                            <CVManager />
                        </div>
                    </>
                ) : activeTab === 'cvdata' && !isEditing && !isEditingTestimonial ? (
                    <>
                        {/* CV Data Tab */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-4">
                                CV <span className="text-purple-400">Data</span>
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">
                                Gérez vos expériences, compétences, certifications et langues pour le CV dynamique.
                            </p>
                        </div>
                        
                        {/* Intégrer CVDataManager */}
                        <div className="bg-gray-900/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
                            <CVDataManager />
                        </div>
                    </>
                ) : activeTab === 'performance' && !isEditing && !isEditingTestimonial ? (
                    <>
                        {/* Performance IA Tab */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-4">
                                Performance <span className="text-purple-400">IA</span>
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">
                                Optimisation et monitoring des performances de l'assistant IA avec cache SQL.
                            </p>
                        </div>
                        
                        {/* Intégrer PerformanceManager */}
                        <div className="bg-gray-900/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
                            <PerformanceManager />
                        </div>
                    </>
                ) : isEditingTestimonial ? (
                    // Formulaire d'édition témoignage
                    <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                {currentTestimonial.id && testimonials.find(t => t.id === currentTestimonial.id) ? 'Edit Testimonial' : 'New Testimonial'}
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveTestimonial}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                    disabled={isSaving}
                                >
                                    <Save className="w-4 h-4" />
                                    {isSaving ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    onClick={handleCancelTestimonial}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Name & Role */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                                    <input
                                        type="text"
                                        value={currentTestimonial.name}
                                        onChange={(e) => updateTestimonialField('name', e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        placeholder="Client name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                                    <input
                                        type="text"
                                        value={currentTestimonial.role}
                                        onChange={(e) => updateTestimonialField('role', e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        placeholder="CEO, Developer, etc."
                                    />
                                </div>
                            </div>

                            {/* Company & Avatar */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                                    <input
                                        type="text"
                                        value={currentTestimonial.company}
                                        onChange={(e) => updateTestimonialField('company', e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        placeholder="Company name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Avatar URL</label>
                                    <input
                                        type="text"
                                        value={currentTestimonial.avatar}
                                        onChange={(e) => updateTestimonialField('avatar', e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        placeholder="https://example.com/avatar.jpg"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Testimonial Content *</label>
                                <textarea
                                    value={currentTestimonial.content}
                                    onChange={(e) => updateTestimonialField('content', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    placeholder="What did the client say about your work?"
                                />
                            </div>

                            {/* Rating & Visibility */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                                    <select
                                        value={currentTestimonial.rating}
                                        onChange={(e) => updateTestimonialField('rating', parseInt(e.target.value))}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    >
                                        <option value={5}>5 Stars</option>
                                        <option value={4}>4 Stars</option>
                                        <option value={3}>3 Stars</option>
                                        <option value={2}>2 Stars</option>
                                        <option value={1}>1 Star</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
                                    <select
                                        value={currentTestimonial.isVisible}
                                        onChange={(e) => updateTestimonialField('isVisible', e.target.value === 'true')}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    >
                                        <option value={true}>Visible on website</option>
                                        <option value={false}>Hidden</option>
                                    </select>
                                </div>
                            </div>

                            {/* Preview */}
                            {currentTestimonial.name && currentTestimonial.content && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Preview</label>
                                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <img
                                                src={currentTestimonial.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentTestimonial.name)}&background=7c3aed&color=fff&size=48`}
                                                alt={currentTestimonial.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-white font-semibold">{currentTestimonial.name}</p>
                                                    <div className="flex gap-1">
                                                        {[...Array(currentTestimonial.rating)].map((_, i) => (
                                                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-purple-400 text-sm">{currentTestimonial.role}</p>
                                                {currentTestimonial.company && (
                                                    <p className="text-gray-500 text-xs">{currentTestimonial.company}</p>
                                                )}
                                                <p className="text-gray-300 text-sm mt-2 italic">"{currentTestimonial.content}"</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // Formulaire d'édition
                    <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                {currentProject.id && projects.find(p => p.id === currentProject.id) ? 'Edit Project' : 'New Project'}
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    disabled={isSaving}
                                >
                                    <Eye className="w-4 h-4" />
                                    {showPreview ? 'Edit' : 'Preview'}
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                    disabled={isSaving}
                                >
                                    <Save className="w-4 h-4" />
                                    {isSaving ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            </div>
                        </div>

                        {showPreview ? (
                            // Mode Preview
                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-2 border-purple-500/30 rounded-xl p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Eye className="w-5 h-5 text-purple-400" />
                                        <h3 className="text-lg font-semibold text-purple-400">Preview Mode</h3>
                                    </div>
                                    
                                    {/* Project Card Preview */}
                                    <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group">
                                        {/* Image */}
                                        {(imagePreview || currentProject.image) && (
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={imagePreview || currentProject.image}
                                                    alt={currentProject.title || 'Project preview'}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="p-6">
                                            {/* Title & Status */}
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                                                    {currentProject.title || 'Untitled Project'}
                                                </h3>
                                                {currentProject.status && (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        currentProject.status === 'Live' ? 'bg-green-500/20 text-green-400' :
                                                        currentProject.status === 'In Development' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                        {currentProject.status}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-400 mb-4 line-clamp-3">
                                                {currentProject.description || 'No description provided.'}
                                            </p>

                                            {/* Tags */}
                                            {currentProject.tags && currentProject.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {currentProject.tags.map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full border border-purple-500/20"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Features */}
                                            {currentProject.features && currentProject.features.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Features:</h4>
                                                    <ul className="space-y-1">
                                                        {(currentProject.features || []).slice(0, 3).map((feature, idx) => (
                                                            <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                                                                <span className="text-purple-400 mt-1">•</span>
                                                                <span>{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Meta Info */}
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                                {currentProject.year && <span>📅 {currentProject.year}</span>}
                                                {currentProject.duration && <span>⏱️ {currentProject.duration}</span>}
                                                {currentProject.role && <span>👤 {currentProject.role}</span>}
                                            </div>

                                            {/* Links */}
                                            {currentProject.links && Object.keys(currentProject.links).length > 0 && (
                                                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                                                    {currentProject.links.web && (
                                                        <a
                                                            href={currentProject.links.web}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 transition-transform text-sm font-medium"
                                                        >
                                                            🌐 Live Demo
                                                        </a>
                                                    )}
                                                    {currentProject.links.githubFront && (
                                                        <a
                                                            href={currentProject.links.githubFront}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                                                        >
                                                            💻 Frontend
                                                        </a>
                                                    )}
                                                    {currentProject.links.githubBack && (
                                                        <a
                                                            href={currentProject.links.githubBack}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                                                        >
                                                            ⚙️ Backend
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-center text-gray-500 text-sm mt-4">
                                        👆 Voici comment ton projet apparaîtra sur le portfolio
                                    </p>
                                </div>
                            </div>
                        ) : (
                            // Mode Edit
                            <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={currentProject.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    placeholder="Project title"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={currentProject.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    placeholder="Project description"
                                />
                            </div>

                            {/* Grid pour les champs courts */}
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                                    <input
                                        type="text"
                                        value={currentProject.year}
                                        onChange={(e) => updateField('year', e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                                    <select
                                        value={currentProject.status}
                                        onChange={(e) => updateField('status', e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="Live">Live</option>
                                        <option value="In Development">In Development</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                                    <input
                                        type="text"
                                        value={currentProject.duration || ''}
                                        onChange={(e) => updateField('duration', e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        placeholder="e.g., 3 months"
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                                <input
                                    type="text"
                                    value={currentProject.role || ''}
                                    onChange={(e) => updateField('role', e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    placeholder="e.g., Full-Stack Developer"
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Project Image</label>
                                
                                {/* Upload button */}
                                <div className="flex gap-3">
                                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
                                        <Upload className="w-4 h-4" />
                                        Upload Image (Base64)
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                    
                                    {/* Manual URL input */}
                                    <input
                                        type="text"
                                        value={currentProject.image?.startsWith('data:') ? '' : currentProject.image}
                                        onChange={(e) => {
                                            updateField('image', e.target.value);
                                            setImagePreview(e.target.value);
                                        }}
                                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        placeholder="Or paste image URL"
                                    />
                                </div>

                                {/* Image preview */}
                                {imagePreview && (
                                    <div className="mt-3 relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg border border-gray-700"
                                        />
                                        <button
                                            onClick={() => {
                                                setImagePreview(null);
                                                updateField('image', '');
                                            }}
                                            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {/* Instructions */}
                                <p className="mt-2 text-xs text-gray-500">
                                    💡 Upload une image (max 5MB) - elle sera stockée dans Supabase Storage et tu auras une URL propre
                                </p>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        id="tagInput"
                                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        placeholder="Add a tag"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addTag(e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            const input = document.getElementById('tagInput');
                                            addTag(input.value);
                                            input.value = '';
                                        }}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(currentProject.tags || []).map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="flex items-center gap-1 px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full cursor-pointer hover:bg-purple-900/50"
                                            onClick={() => removeTag(tag)}
                                        >
                                            {tag}
                                            <X className="w-3 h-3" />
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Features */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Features</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        id="featureInput"
                                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        placeholder="Add a feature"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addFeature(e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            const input = document.getElementById('featureInput');
                                            addFeature(input.value);
                                            input.value = '';
                                        }}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                <ul className="space-y-2">
                                    {(currentProject.features || []).map((feature, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-lg text-white"
                                        >
                                            <span className="text-sm">{feature}</span>
                                            <button
                                                onClick={() => removeFeature(idx)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Links */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Links</label>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={(currentProject.links || {}).web || ''}
                                        onChange={(e) => updateField('links', { ...(currentProject.links || {}), web: e.target.value })}
                                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        placeholder="Website URL"
                                    />
                                    <input
                                        type="text"
                                        value={(currentProject.links || {}).githubFront || ''}
                                        onChange={(e) => updateField('links', { ...(currentProject.links || {}), githubFront: e.target.value })}
                                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        placeholder="GitHub Frontend URL"
                                    />
                                    <input
                                        type="text"
                                        value={(currentProject.links || {}).githubBack || ''}
                                        onChange={(e) => updateField('links', { ...(currentProject.links || {}), githubBack: e.target.value })}
                                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        placeholder="GitHub Backend URL"
                                    />
                                </div>
                            </div>

                            {/* Composant IA - Nouveaux champs optimisés */}
                            <ProjectFormAI 
                                currentProject={currentProject} 
                                updateField={updateField} 
                            />
                        </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
