// src/pages/About.jsx
import React from 'react';
import { AboutSection } from '../components/sections/AboutSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { SkillsSection } from '../components/sections/SkillsSection';

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

