// Home.jsx
import { Hero } from '../components/sections/Hero';
import { AboutSection } from '../components/sections/AboutSection';
import { FloatingParticles } from '../components/ui/FloatingParticles';
import { StatsSection } from '../components/sections/StatsSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { SkillsSection } from '../components/sections/SkillsSection';
import { TimelineSection } from '../components/sections/TimelineSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { InteractiveCursor } from '../components/ui/InteractiveCursor';

const Home = () => {
    return (
        <main className="relative bg-[#0a0a1a] w-full">
            <InteractiveCursor />
            <FloatingParticles />
            <Hero />
            <StatsSection />
            <ServicesSection />
            <SkillsSection />
            <TimelineSection />
            <TestimonialsSection />
            <AboutSection />
        </main>
    );
};

export default Home;