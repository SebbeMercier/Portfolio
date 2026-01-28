// Services Supabase centralisés
import { createClient } from '@supabase/supabase-js';

// Support pour les environnements React et Node.js
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Variables Supabase manquantes. Vérifiez votre fichier .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);



// ==================== PROJETS ====================
export const projectsService = {
  // Récupérer tous les projets
  async getAllProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Récupérer projets featured
  async getFeaturedProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Récupérer un projet par slug
  async getProjectBySlug(slug) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  // Incrémenter les vues
  async incrementViews(id) {
    const { error } = await supabase
      .from('projects')
      .update({ views: supabase.raw('views + 1') })
      .eq('id', id);

    if (error) throw error;
  }
};

// ==================== ANALYTICS ====================
export const analyticsService = {
  // Enregistrer une vue de page
  async trackPageView(pageData) {
    const { error } = await supabase
      .from('page_views')
      .insert([{
        page: pageData.page,
        visitor_id: pageData.visitorId,
        session_id: pageData.sessionId,
        referrer: pageData.referrer,
        country: pageData.country,
        city: pageData.city,
        device: pageData.device,
        browser: pageData.browser,
        os: pageData.os,
        screen_resolution: pageData.screenResolution,
        user_agent: pageData.userAgent
      }]);

    if (error) throw error;
  },

  // Mettre à jour la durée de visite
  async updatePageDuration(viewId, duration) {
    const { error } = await supabase
      .from('page_views')
      .update({ duration })
      .eq('id', viewId);

    if (error) throw error;
  },

  // Statistiques générales
  async getGeneralStats() {
    const { data: totalViews } = await supabase
      .from('page_views')
      .select('id', { count: 'exact' });

    const { data: uniqueVisitors } = await supabase
      .from('page_views')
      .select('visitor_id')
      .not('visitor_id', 'is', null);

    const { data: topPages } = await supabase
      .from('page_views')
      .select('page')
      .not('page', 'is', null);

    return {
      totalViews: totalViews?.length || 0,
      uniqueVisitors: new Set(uniqueVisitors?.map(v => v.visitor_id)).size,
      topPages: topPages?.reduce((acc, curr) => {
        acc[curr.page] = (acc[curr.page] || 0) + 1;
        return acc;
      }, {})
    };
  }
};



// ==================== CONTACT ====================
export const contactService = {
  // Envoyer un message de contact
  async sendMessage(messageData) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([messageData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Envoyer l'email via Backend (Notification + Auto-reply)
  async sendEmail(messageData) {
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: messageData,
      });

      if (error) {
        console.error('Supabase Function error:', error);
        throw new Error(error.message || 'Failed to send email');
      }

      return data;
    } catch (error) {
      console.error('Error calling contact API:', error);
      throw error;
    }
  },

  // S'abonner à la newsletter
  async subscribeNewsletter(email, name, source = 'website') {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email, name, source }]);

    if (error && error.code !== '23505') throw error; // Ignore duplicate emails
  }
};



// ==================== TESTIMONIALS ====================
export const testimonialsService = {
  // Récupérer tous les témoignages
  async getAllTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Récupérer témoignages featured
  async getFeaturedTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// ==================== SKILLS ====================
export const skillsService = {
  // Récupérer toutes les compétences
  async getAllSkills() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Récupérer compétences par catégorie
  async getSkillsByCategory(category) {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('category', category)
      .order('level', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// ==================== EXPERIENCES ====================
export const experiencesService = {
  // Récupérer toutes les expériences
  async getAllExperiences() {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Récupérer expériences par type
  async getExperiencesByType(type) {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('type', type)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// ==================== UTILS ====================
export const generateVisitorId = () => {
  return 'visitor_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

export const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  let device = 'desktop';

  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    device = 'tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
    device = 'mobile';
  }

  return {
    device,
    browser: getBrowser(ua),
    os: getOS(ua),
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    userAgent: ua
  };
};

const getBrowser = (ua) => {
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Unknown';
};

const getOS = (ua) => {
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS')) return 'iOS';
  return 'Unknown';
};