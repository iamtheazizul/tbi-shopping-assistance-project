import React, { useState } from 'react';
import { NumberStepper } from '../ui/NumberStepper';
import { TextLink } from '../ui/TextLink';

interface AisleFieldProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  startEditing?: boolean;
}

export function AisleField({ label, value, onChange, startEditing = false }: AisleFieldProps) {
  const [editing, setEditing] = useState(startEditing || value === null);

  return (
    <div>
      <p className="text-helper font-bold text-ink-soft">{label}</p>
      {editing ?
      <div className="mt-2">
          <NumberStepper label={`${label} number`} value={value} onChange={onChange} />
        </div> :

      <div className="flex items-center justify-between gap-3">
          <p className="font-display text-area font-bold text-ink">Aisle {value}</p>
          <TextLink onClick={() => setEditing(true)}>Change</TextLink>
        </div>
      }
    </div>);

}