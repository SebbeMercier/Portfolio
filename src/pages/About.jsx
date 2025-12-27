// src/pages/About.jsx
import React from 'react';
import { AboutSection } from '../components/AboutSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { SkillsSection } from '../components/SkillsSection';

const About = () => {
    return (
        <main>
            <AboutSection />
            <SkillsSection />
            <TestimonialsSection />
        </main>
    );
};

export default About;

