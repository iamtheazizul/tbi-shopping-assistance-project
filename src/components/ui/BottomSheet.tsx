import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useShouldReduceMotion } from '../../hooks/useShouldReduceMotion';
import { easeOut } from '../../utils/motion';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  titleId: string;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, titleId, children }: BottomSheetProps) {
  const reduce = useShouldReduceMotion();
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => sheetRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const hidden = reduce ? { opacity: 0 } : { y: '100%' };
  const shown = reduce ? { opacity: 1 } : { y: 0 };

  return (
    <AnimatePresence>
      {open &&
      <>
          <motion.div
          key="scrim"
          aria-hidden
          onClick={onClose}
          className="absolute inset-0 z-40 bg-[rgba(12,22,40,0.45)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: easeOut }} />
        
          <motion.div
          key="sheet"
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="absolute inset-x-0 bottom-0 z-50 rounded-t-[28px] border-t-2 border-line bg-card px-5 pb-8 pt-3 focus:outline-none"
          initial={hidden}
          animate={shown}
          exit={hidden}
          transition={{ duration: 0.26, ease: easeOut }}>
          
            <div aria-hidden className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-line" />
            {children}
          </motion.div>
        </>
      }
    </AnimatePresence>);

}