// Home.jsx
import Hero from '../components/Hero';
import AboutComponent from '../components/about';

const Home = () => {
    return (
        <main className="pt-[72px]">
            <Hero />
            <AboutComponent />
        </main>
    );
};

export default Home;