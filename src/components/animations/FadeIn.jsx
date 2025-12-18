// FadeIn.jsx - Animation fade in au scroll
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export const FadeIn = ({ 
    children, 
    delay = 0, 
    duration = 0.6, 
    direction = 'up',
    className = '' 
}) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const directions = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { y: 0, x: 40 },
        right: { y: 0, x: -40 },
    };

    return (
        <motion.div
            ref={ref}
            initial={{
                opacity: 0,
                ...directions[direction],
            }}
            animate={inView ? {
                opacity: 1,
                y: 0,
                x: 0,
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

export default FadeIn;
