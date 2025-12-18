// ScaleIn.jsx - Animation scale au scroll
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ScaleIn = ({ 
    children, 
    delay = 0, 
    duration = 0.5,
    className = '' 
}) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <motion.div
            ref={ref}
            initial={{
                opacity: 0,
                scale: 0.8,
            }}
            animate={inView ? {
                opacity: 1,
                scale: 1,
            } : {}}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScaleIn;
