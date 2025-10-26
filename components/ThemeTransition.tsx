import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

const ThemeTransition: React.FC = () => {
  const { theme, buttonBoundingBox } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger the animation whenever the theme changes.
  useEffect(() => {
    if (buttonBoundingBox) {
      setIsAnimating(true);
    }
    // This effect should only re-run when the theme value itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  const endRadius = buttonBoundingBox
    ? Math.hypot(
        Math.max(
          buttonBoundingBox.left,
          window.innerWidth - buttonBoundingBox.right,
        ),
        Math.max(
          buttonBoundingBox.top,
          window.innerHeight - buttonBoundingBox.bottom,
        ),
      )
    : 0;

  const transitionVariants = {
    initial: {
      clipPath: `circle(0px at ${
        buttonBoundingBox ? buttonBoundingBox.left + buttonBoundingBox.width / 2 : 0
      }px ${
        buttonBoundingBox ? buttonBoundingBox.top + buttonBoundingBox.height / 2 : 0
      }px)`,
    },
    animate: {
      clipPath: `circle(${endRadius}px at ${
        buttonBoundingBox ? buttonBoundingBox.left + buttonBoundingBox.width / 2 : 0
      }px ${
        buttonBoundingBox ? buttonBoundingBox.top + buttonBoundingBox.height / 2 : 0
      }px)`,
    },
  };

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          className={`fixed inset-0 z-[100] pointer-events-none ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          // When the animation completes, set state to unmount the overlay.
          onAnimationComplete={() => setIsAnimating(false)}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} // Quintic Out easing
        />
      )}
    </AnimatePresence>
  );
};

export default ThemeTransition;
