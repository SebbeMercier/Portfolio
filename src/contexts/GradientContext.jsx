// GradientContext.jsx - Context pour partager les couleurs entre sections
import { createContext, useContext, useState } from 'react';

const GradientContext = createContext();

export const useGradient = () => {
    const context = useContext(GradientContext);
    if (!context) {
        return { lastColor: '#0a0a0a', setLastColor: () => {} };
    }
    return context;
};

export const GradientProvider = ({ children }) => {
    const [lastColor, setLastColor] = useState('#0a0a1a');
    console.log('🌈 GradientProvider initialized with color:', lastColor);

    return (
        <GradientContext.Provider value={{ lastColor, setLastColor }}>
            {children}
        </GradientContext.Provider>
    );
};
