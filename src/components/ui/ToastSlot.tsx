import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2Icon } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { easeOut } from '../../utils/motion';

/**
 * Sits in the page flow under the header. When a toast appears it pushes
 * content down instead of covering a heading.
 */
export function ToastSlot() {
  const { toast, dismissToast } = useToast();

  return (
    <div aria-live="polite" className="shrink-0">
      <AnimatePresence initial={false}>
        {toast &&
        <motion.div
          key={toast.id}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: easeOut }}
          className="overflow-hidden px-5">
          
            <div
            role="status"
            className="mb-3 flex min-h-[52px] items-center gap-3 rounded-2xl bg-ink py-2 pl-4 pr-2 text-body font-bold text-canvas">
            
              <CheckCircle2Icon aria-hidden size={22} className="shrink-0 text-primary" />
              <span className="min-w-0 flex-1 py-1">{toast.message}</span>
              {toast.actionLabel && toast.onAction &&
            <button
              type="button"
              onClick={() => {
                toast.onAction?.();
                dismissToast();
              }}
              className="min-h-[44px] shrink-0 rounded-xl bg-primary px-4 font-extrabold text-on-primary transition-transform duration-100 ease-out active:scale-[0.97]">
              
                  {toast.actionLabel}
                </button>
            }
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}