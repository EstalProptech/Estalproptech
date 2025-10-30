import { motion } from "motion/react";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  direction?: 'left' | 'right';
}

export function PageTransition({ children, direction = 'right' }: PageTransitionProps) {
  const slideVariants = {
    enter: {
      x: direction === 'right' ? 30 : -30,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: direction === 'right' ? -30 : 30,
      opacity: 0,
    },
  };

  const fadeVariants = {
    enter: {
      opacity: 0,
      scale: 0.98,
    },
    center: {
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
      scale: 0.98,
    },
  };

  // Check for reduced motion preference
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const variants = prefersReducedMotion ? fadeVariants : slideVariants;

  return (
    <motion.div
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ 
        duration: prefersReducedMotion ? 0.15 : 0.25,
        ease: [0.32, 0.72, 0, 1], // Custom easing curve
      }}
    >
      {children}
    </motion.div>
  );
}
