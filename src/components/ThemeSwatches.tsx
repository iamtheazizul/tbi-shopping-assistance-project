import React from 'react';
import { CheckIcon } from 'lucide-react';
import { themes } from '../data/themes';
import type { ThemeId } from '../types/app';

interface ThemeSwatchesProps {
  value: ThemeId;
  onChange: (value: ThemeId) => void;
}

export function ThemeSwatches({ value, onChange }: ThemeSwatchesProps) {
  return (
    <div role="radiogroup" aria-label="Theme color" className="grid grid-cols-4 gap-2">
      {themes.map((theme) => {
        const selected = theme.id === value;
        return (
          <button
            key={theme.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={theme.name}
            onClick={() => onChange(theme.id)}
            className="flex flex-col items-center gap-2 py-1">
            
            <span
              aria-hidden
              style={{ backgroundColor: theme.primary, boxShadow: `0 4px 0 ${theme.edge}` }}
              className={`flex h-14 w-14 items-center justify-center rounded-full border-[3px] transition-colors duration-150 ${
              selected ? 'border-ink' : 'border-transparent'}`
              }>
              
              {selected && <CheckIcon size={24} strokeWidth={3} className="text-on-primary" />}
            </span>
            <span className={`text-helper ${selected ? 'font-extrabold text-ink' : 'font-bold text-ink-soft'}`}>
              {theme.name}
            </span>
          </button>);

      })}
    </div>);

}