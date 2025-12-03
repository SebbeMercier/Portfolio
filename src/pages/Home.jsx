// Home.jsx
import {Hero} from '../components/Hero';
import AboutComponent from '../components/about';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <main className="">
            <Navbar />
            <Hero />
            <AboutComponent />
        </main>
    );
};

export default Home;