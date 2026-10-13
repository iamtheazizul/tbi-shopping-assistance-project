import React from 'react';

interface RadioOption<T extends string> {
  value: T;
  label: string;
}

interface RadioListProps<T extends string> {
  label: string;
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function RadioList<T extends string>({ label, options, value, onChange }: RadioListProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="overflow-hidden rounded-3xl border-2 border-line bg-card">
      {options.map((option, i) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`flex min-h-[60px] w-full items-center justify-between gap-4 px-4 text-left transition-colors duration-150 ease-out ${
            i > 0 ? 'border-t-2 border-line' : ''} ${
            selected ? 'bg-primary-soft' : 'hover:bg-canvas'}`}>
            
            <span className="text-body font-bold text-ink">{option.label}</span>
            <span
              aria-hidden
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
              selected ? 'border-primary-edge' : 'border-line'}`
              }>
              
              {selected && <span className="h-3 w-3 rounded-full bg-primary-edge" />}
            </span>
          </button>);

      })}
    </div>);

}