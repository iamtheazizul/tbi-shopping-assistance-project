import React from 'react';
import { motion } from 'framer-motion';
import { useShouldReduceMotion } from '../../hooks/useShouldReduceMotion';
import { easeOut } from '../../utils/motion';

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
}

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const reduce = useShouldReduceMotion();
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className="h-2.5 overflow-hidden rounded-full bg-line">
      
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={false}
        animate={{ width: `${value / max * 100}%` }}
        transition={{ duration: reduce ? 0 : 0.28, ease: easeOut }} />
      
    </div>);

}