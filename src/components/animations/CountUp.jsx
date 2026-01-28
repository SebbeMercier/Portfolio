// CountUp.jsx - Compteur animé
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const CountUp = ({ from = 0, to, duration = 2, suffix = '', className = '' }) => {
    const count = useMotionValue(from);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

    useEffect(() => {
        if (inView) {
            const controls = animate(count, to, {
                duration,
                ease: "easeOut",
            });
            return controls.stop;
        }
    }, [inView, count, to, duration]);

    return (
        <motion.span ref={ref} className={className}>
            {rounded}
            {suffix}
        </motion.span>
    );
};

export default CountUp;
