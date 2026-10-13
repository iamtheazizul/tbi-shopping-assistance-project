import React from 'react';

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex min-h-[72px] w-full items-center justify-between gap-4 px-4 py-3 text-left">
      
      <span className="min-w-0">
        <span className="block text-body font-bold text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-helper text-ink-soft">{description}</span>}
      </span>
      <span
        aria-hidden
        className={`relative h-8 w-14 shrink-0 rounded-full transition-colors duration-200 ease-out ${checked ? 'bg-primary' : 'bg-line'}`}>
        
        <span
          className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform duration-200 ease-out ${
          checked ? 'translate-x-6' : 'translate-x-0'}`
          } />
        
      </span>
    </button>);

}