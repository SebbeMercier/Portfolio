// Hook pour analytics et tracking
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService, generateVisitorId, generateSessionId, getDeviceInfo } from '../services/supabase';

export const useAnalytics = () => {
  const location = useLocation();
  const [visitorId, setVisitorId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const pageStartTime = useRef(null);
  const currentViewId = useRef(null);

  // Initialiser les IDs visiteur et session
  useEffect(() => {
    let storedVisitorId = localStorage.getItem('portfolio_visitor_id');
    let storedSessionId = sessionStorage.getItem('portfolio_session_id');

    if (!storedVisitorId) {
      storedVisitorId = generateVisitorId();
      localStorage.setItem('portfolio_visitor_id', storedVisitorId);
    }

    if (!storedSessionId) {
      storedSessionId = generateSessionId();
      sessionStorage.setItem('portfolio_session_id', storedSessionId);
    }

    setVisitorId(storedVisitorId);
    setSessionId(storedSessionId);
  }, []);

  // Tracker les changements de page
  useEffect(() => {
    if (!visitorId || !sessionId) return;

    const trackPageView = async () => {
      // Enregistrer la durée de la page précédente
      if (currentViewId.current && pageStartTime.current) {
        const duration = Math.floor((Date.now() - pageStartTime.current) / 1000);
        try {
          await analyticsService.updatePageDuration(currentViewId.current, duration);
        } catch (error) {
          console.error('Error updating page duration:', error);
        }
      }

      // Démarrer le tracking de la nouvelle page
      pageStartTime.current = Date.now();
      
      const deviceInfo = getDeviceInfo();
      const pageData = {
        page: location.pathname,
        visitorId,
        sessionId,
        referrer: document.referrer,
        ...deviceInfo
      };

      try {
        await analyticsService.trackPageView(pageData);
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();
  }, [location.pathname, visitorId, sessionId]);

  // Tracker la durée avant de quitter la page
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (currentViewId.current && pageStartTime.current) {
        const duration = Math.floor((Date.now() - pageStartTime.current) / 1000);
        try {
          // Utiliser sendBeacon pour envoyer les données même si la page se ferme
          const data = JSON.stringify({ viewId: currentViewId.current, duration });
          navigator.sendBeacon('/api/analytics/duration', data);
        } catch (error) {
          console.error('Error sending final duration:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Fonctions utilitaires
  const trackEvent = async (eventName, eventData = {}) => {
    try {
      await analyticsService.trackPageView({
        page: `event:${eventName}`,
        visitorId,
        sessionId,
        ...eventData
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  const trackClick = (element, data = {}) => {
    trackEvent('click', {
      element,
      page: location.pathname,
      ...data
    });
  };

  const trackDownload = (fileName, fileType) => {
    trackEvent('download', {
      fileName,
      fileType,
      page: location.pathname
    });
  };

  const trackSearch = (query, resultsCount) => {
    trackEvent('search', {
      query,
      resultsCount,
      page: location.pathname
    });
  };

  const trackShare = (platform, content) => {
    trackEvent('share', {
      platform,
      content,
      page: location.pathname
    });
  };

  return {
    visitorId,
    sessionId,
    trackEvent,
    trackClick,
    trackDownload,
    trackSearch,
    trackShare
  };
};

// Hook pour les statistiques du dashboard
export const useAnalyticsStats = () => {
  const [stats, setStats] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    topPages: {},
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await analyticsService.getGeneralStats();
        setStats({
          ...data,
          loading: false,
          error: null
        });
      } catch (error) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    fetchStats();
  }, []);

  const refreshStats = async () => {
    setStats(prev => ({ ...prev, loading: true }));
    try {
      const data = await analyticsService.getGeneralStats();
      setStats({
        ...data,
        loading: false,
        error: null
      });
    } catch (error) {
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  return {
    ...stats,
    refreshStats
  };
};