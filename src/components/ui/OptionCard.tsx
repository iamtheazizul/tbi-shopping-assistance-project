import React from "react";
import { CheckIcon, BoxIcon } from "lucide-react";
interface OptionCardProps {
  label: string;
  description?: string;
  icon?: BoxIcon;
  selected: boolean;
  onSelect: () => void;
}
export function OptionCard({
  label,
  description,
  icon: Icon,
  selected,
  onSelect
}: OptionCardProps) {
  return <button type="button" role="radio" aria-checked={selected} onClick={onSelect} className={`flex min-h-[84px] w-full items-center gap-4 rounded-3xl border-2 p-4 text-left transition-[transform,box-shadow,background-color,border-color] duration-100 ease-out active:translate-y-[4px] active:shadow-none ${selected ? 'border-primary-edge bg-primary-soft shadow-[0_4px_0_rgb(var(--c-primary-edge))]' : 'border-line bg-card shadow-[0_4px_0_rgb(var(--c-line))]'}`}>
      {Icon && <span aria-hidden className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${selected ? 'bg-card' : 'bg-canvas'}`}>
          <Icon size={26} strokeWidth={2.25} className="text-ink" />
        </span>}
      <span className="min-w-0 flex-1">
        <span className="block text-body font-extrabold text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-helper text-ink-soft">{description}</span>}
      </span>
      <span aria-hidden className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150 ${selected ? 'border-primary-edge bg-primary-edge' : 'border-line'}`}>
        {selected && <CheckIcon size={18} strokeWidth={3} className="text-white" />}
      </span>
    </button>;
}