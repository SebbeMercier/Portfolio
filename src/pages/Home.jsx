// Home.jsx
import { Hero } from '../components/Hero';
import { AboutSection } from '../components/AboutSection';
import { FloatingParticles } from '../components/FloatingParticles';
import { StatsSection } from '../components/StatsSection';
import { ServicesSection } from '../components/ServicesSection';
import { SkillsSection } from '../components/SkillsSection';
import { TimelineSection } from '../components/TimelineSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { InteractiveCursor } from '../components/InteractiveCursor';
import DaisyUIDemo from '../components/DaisyUIDemo';

const Home = () => {
    return (
        <main className="relative">
            <InteractiveCursor />
            <FloatingParticles />
            <Hero />
            <StatsSection />
            <ServicesSection />
            <SkillsSection />
            <DaisyUIDemo />
            <TimelineSection />
            <TestimonialsSection />
            <AboutSection />
        </main>
    );
};

export default Home;