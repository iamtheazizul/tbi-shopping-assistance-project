import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRotatingPhrase } from '../hooks/useRotatingPhrase';
import { easeOut } from '../utils/motion';

interface LoadingPhraseProps {
  className?: string;
  lineKey?: 'loading' | 'signReading';
}

export function LoadingPhrase({ className = '', lineKey = 'loading' }: LoadingPhraseProps) {
  const phrase = useRotatingPhrase(lineKey);

  return (
    <p role="status" aria-live="polite" className={`min-h-[1.5em] ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={phrase}
          className="block"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: easeOut }}>
          
          {phrase}
        </motion.span>
      </AnimatePresence>
    </p>);

}