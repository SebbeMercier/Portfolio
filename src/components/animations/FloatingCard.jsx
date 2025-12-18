// FloatingCard.jsx - Card avec effet de flottement au hover
import { motion } from 'framer-motion';

const FloatingCard = ({ children, className = '' }) => {
    return (
        <motion.div
            whileHover={{
                y: -8,
                transition: {
                    duration: 0.3,
                    ease: 'easeOut',
                },
            }}
            whileTap={{ scale: 0.98 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default FloatingCard;
