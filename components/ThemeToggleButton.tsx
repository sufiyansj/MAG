import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme, setButtonBoundingBox } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (buttonRef.current) {
        setButtonBoundingBox(buttonRef.current.getBoundingClientRect());
    }
  }, [buttonRef, setButtonBoundingBox]);

  const handleToggle = () => {
    if (buttonRef.current) {
      setButtonBoundingBox(buttonRef.current.getBoundingClientRect());
    }
    toggleTheme();
  };

  const iconVariants = {
    hidden: { opacity: 0, rotate: -90, scale: 0.5 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 90, scale: 0.5 },
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      className="relative flex h-8 w-8 items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          variants={iconVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggleButton;