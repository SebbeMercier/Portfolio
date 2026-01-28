// Composant pour l'effet visuel de l'easter egg
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { useEasterEgg } from '../../hooks/useEasterEgg';

const EasterEggEffect = React.memo(() => {
  const { showEffect } = useEasterEgg();

  return (
    <AnimatePresence>
      {showEffect && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: -20 }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 
                   bg-gradient-to-r from-purple-500 to-pink-500 
                   text-white px-6 py-3 rounded-full shadow-2xl
                   border border-white/20"
        >
          <motion.div 
            className="flex items-center gap-3"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 0.4,
                repeat: 1
              }}
            >
              <Heart className="w-5 h-5 text-red-200" />
            </motion.div>
            
            <span className="font-semibold text-lg">
              🎉 Easter Egg découvert ! 🎉
            </span>
            
            <motion.div
              animate={{ 
                rotate: 180
              }}
              transition={{ 
                duration: 0.5
              }}
            >
              <Sparkles className="w-5 h-5 text-yellow-200" />
            </motion.div>
          </motion.div>
          
          {/* Particules simplifiées */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white rounded-full"
              initial={{ 
                x: 0, 
                y: 0, 
                scale: 0
              }}
              animate={{ 
                x: Math.cos(i * 90 * Math.PI / 180) * 40,
                y: Math.sin(i * 90 * Math.PI / 180) * 40,
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 1,
                delay: 0.2,
                ease: "easeOut"
              }}
              style={{
                left: '50%',
                top: '50%'
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default EasterEggEffect;