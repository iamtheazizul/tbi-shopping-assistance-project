import React from "react";
import { XIcon, BoxIcon } from "lucide-react";
interface ChipProps {
  label: string;
  icon?: BoxIcon;
  selected?: boolean;
  size?: 'default' | 'small';
  onClick?: () => void;
  onRemove?: () => void;
}
export function Chip({
  label,
  icon: Icon,
  selected,
  size = 'default',
  onClick,
  onRemove
}: ChipProps) {
  if (onRemove) {
    return <span className="inline-flex h-14 items-center rounded-full border-2 border-line bg-card pl-5 pr-1 text-body font-bold text-ink">
        {label}
        <button type="button" onClick={onRemove} aria-label={`Remove ${label}`} className="ml-1 flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-150 ease-out hover:bg-primary-soft">
          <XIcon aria-hidden size={20} strokeWidth={2.5} />
        </button>
      </span>;
  }
  const sizing = size === 'small' ? 'h-11 px-3.5 text-helper' : 'h-14 px-5 text-body';
  return <button type="button" onClick={onClick} aria-pressed={selected === undefined ? undefined : selected} className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border-2 font-bold text-ink transition-colors duration-150 ease-out ${sizing} ${selected ? 'border-primary-edge bg-primary-soft' : 'border-line bg-card hover:bg-primary-soft'}`}>
      {Icon && <Icon aria-hidden size={20} strokeWidth={2.5} />}
      {label}
    </button>;
}