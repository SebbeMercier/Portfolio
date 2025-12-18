// src/pages/About.jsx
import React from 'react';
import AboutComponent from '../components/about';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { SkillsSection } from '../components/SkillsSection';

const About = () => {
    return (
        <main>
            <AboutComponent />
            <SkillsSection />
            <TestimonialsSection />
        </main>
    );
};

export default About;

