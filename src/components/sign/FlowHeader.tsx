import React from 'react';
import { XIcon } from 'lucide-react';

interface FlowHeaderProps {
  title?: string;
  onClose: () => void;
  dark?: boolean;
}

/** Header for the sign flow: an X that always exits back to the store list. */
export function FlowHeader({ title, onClose, dark = false }: FlowHeaderProps) {
  return (
    <header className="relative z-10 flex shrink-0 items-center gap-3 px-5 pb-3 pt-12">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close and go back to the store list"
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-150 ease-out ${
        dark ? 'bg-black/45 text-white hover:bg-black/60' : 'border-2 border-line bg-card text-ink hover:bg-primary-soft'}`
        }>
        
        <XIcon aria-hidden size={24} strokeWidth={2.75} />
      </button>
      {title &&
      <h1 className={`min-w-0 font-display text-title font-semibold ${dark ? 'text-white' : 'text-ink'}`}>{title}</h1>
      }
    </header>);

}