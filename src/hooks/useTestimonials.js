// useTestimonials.js - Hook pour récupérer les témoignages depuis Supabase
import { useState, useEffect } from 'react';
import { getVisibleTestimonials } from '../services/testimonialsService';

export const useTestimonials = (language = 'en') => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            setLoading(true);
            const data = await getVisibleTestimonials(language);
            setTestimonials(data);
            setLoading(false);
        };

        fetchTestimonials();
    }, [language]);

    return { testimonials, loading };
};