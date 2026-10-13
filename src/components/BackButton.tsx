import React from 'react';
import { ChevronLeftIcon } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-ml-2 flex h-12 shrink-0 items-center gap-1 rounded-full pl-1 pr-4 text-body font-extrabold text-ink transition-colors duration-150 ease-out hover:bg-primary-soft">
      
      <ChevronLeftIcon aria-hidden size={26} strokeWidth={2.75} />
      Back
    </button>);

}