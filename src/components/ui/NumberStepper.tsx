import React from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';

interface NumberStepperProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
}

const stepButton =
'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-line bg-card text-ink shadow-[0_4px_0_rgb(var(--c-line))] transition-[transform,box-shadow,background-color] duration-100 ease-out hover:bg-primary-soft active:translate-y-[4px] active:shadow-none disabled:opacity-40';

export function NumberStepper({ label, value, onChange, min = 1, max = 40 }: NumberStepperProps) {
  const step = (delta: number) => {
    const base = value ?? (delta > 0 ? min - 1 : min + 1);
    onChange(Math.min(max, Math.max(min, base + delta)));
  };

  return (
    <div role="group" aria-label={label} className="flex items-center gap-3">
      <button type="button" aria-label="One lower" onClick={() => step(-1)} disabled={value !== null && value <= min} className={stepButton}>
        <MinusIcon aria-hidden size={28} strokeWidth={3} />
      </button>
      <input
        aria-label={label}
        inputMode="numeric"
        value={value ?? ''}
        placeholder="?"
        onChange={(e) => {
          const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
          onChange(digits ? Math.min(max, Number(digits)) : null);
        }}
        className="h-20 w-24 min-w-0 rounded-2xl border-2 border-line bg-card text-center font-display text-area font-bold text-ink placeholder:text-ink-soft focus:border-primary-edge focus:outline-none" />
      
      <button type="button" aria-label="One higher" onClick={() => step(1)} disabled={value !== null && value >= max} className={stepButton}>
        <PlusIcon aria-hidden size={28} strokeWidth={3} />
      </button>
    </div>);

}