// Avatar.jsx - JUSTE LE CERCLE AUTOUR
import React from "react";
import { motion } from "framer-motion";

export function Avatar() {
    return (
        <motion.div
            className="relative w-72 h-72 lg:w-80 lg:h-80"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: 0.2
            }}
        >
            {/* Image normale */}
            <div className="w-full h-full rounded-full overflow-hidden">
                <img
                    src="https://avatars.githubusercontent.com/u/169470778?v=4"
                    alt="Sebbe Mercier"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Cercle gradient PAR-DESSUS */}
            <motion.div
                className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-br from-purple-600 via-pink-500 to-purple-500 bg-clip-border"
                style={{
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '0.8px'
                }}
                animate={{
                    rotate: 360
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
            </motion.div>
        </motion.div>
    );
}
