// Home.jsx
import { Hero } from '../components/Hero';
import AboutComponent from '../components/about';
import { FloatingParticles } from '../components/FloatingParticles';
import { StatsSection } from '../components/StatsSection';
import { ServicesSection } from '../components/ServicesSection';
import { SkillsSection } from '../components/SkillsSection';
import { TimelineSection } from '../components/TimelineSection';
import { InteractiveCursor } from '../components/InteractiveCursor';


const Home = () => {
    return (
        <main className="relative">
            <InteractiveCursor />

            <FloatingParticles />
            <Hero />
            <StatsSection />
            <ServicesSection />
            <SkillsSection />
            <TimelineSection />
            <AboutComponent />
        </main>
    );
};

export default Home;