// useProjects.js - Hook pour récupérer les projets depuis Supabase
import { useState, useEffect } from 'react';
import { getProjects } from '../services/supabaseProjectService';

export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            const data = await getProjects();
            setProjects(data);
            setLoading(false);
        };

        fetchProjects();
    }, []);

    return { projects, loading };
};
