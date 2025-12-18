// EasterEgg Context for managing easter egg state globally
import React, { createContext, useContext, useState } from 'react';

const EasterEggContext = createContext();

export const useEasterEgg = () => {
  const context = useContext(EasterEggContext);
  if (!context) {
    throw new Error('useEasterEgg doit être utilisé dans un EasterEggProvider');
  }
  return context;
};

export const EasterEggProvider = ({ children }) => {
  const [clickCount, setClickCount] = useState(0);
  const [showEffect, setShowEffect] = useState(false);

  const handleLogoClick = (e) => {
    e.preventDefault(); // Empêcher la navigation
    e.stopPropagation();
    
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    console.log(`🎯 Clic ${newCount}/5 sur le logo`);
    
    if (newCount === 5) {
      setShowEffect(true);
      console.log('🎉 5 clics sur le logo ! Easter egg découvert !');
      console.log('🎨 Design & Code: Sebbe Mercier');
      console.log('💜 Merci d\'avoir exploré mon portfolio !');
      
      setTimeout(() => {
        setShowEffect(false);
        setClickCount(0);
      }, 3000);
    }
    
    // Reset après 3 secondes d'inactivité
    setTimeout(() => {
      if (newCount < 5) {
        setClickCount(0);
      }
    }, 3000);
  };

  const value = {
    clickCount,
    showEffect,
    handleLogoClick
  };

  return (
    <EasterEggContext.Provider value={value}>
      {children}
    </EasterEggContext.Provider>
  );
};