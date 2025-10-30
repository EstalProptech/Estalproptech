import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedCounter({ value, duration = 2, prefix = "", suffix = "", decimals = 0 }: AnimatedCounterProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0
  });

  const display = useTransform(spring, (current) =>
    (Math.floor(current * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals)
  );

  useEffect(() => {
    setIsVisible(true);
    spring.set(value);
  }, [value, spring]);

  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const unsubscribe = display.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [display]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
    >
      {prefix}{displayValue}{suffix}
    </motion.span>
  );
}
