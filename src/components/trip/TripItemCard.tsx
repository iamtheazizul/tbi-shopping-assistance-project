import React from 'react';
import { Card } from '../ui/Card';
import { PipTip } from '../PipTip';
import { locationTitle } from '../../utils/trip';
import { stockNote } from '../../utils/stock';
import type { TripItem } from '../../types/app';

interface TripItemCardProps {
  item: TripItem;
  compact?: boolean;
}

export function TripItemCard({ item, compact = false }: TripItemCardProps) {
  const { location } = item;
  const note = stockNote(item.name);

  return (
    <Card className={compact ? 'p-5' : 'p-6'}>
      {location.kind === 'aisle' ?
      <>
          <p aria-label={`Aisle ${location.aisle}`} className="flex items-baseline gap-2 font-display font-bold text-ink">
            <span className="text-aisle-word">Aisle</span>
            <span className={compact ? 'text-aisle-sm' : 'text-aisle'}>{location.aisle}</span>
          </p>
          <p className="mt-1 text-helper font-bold text-ink-soft">{location.label}</p>
        </> :

      <p className="font-display text-area font-bold text-ink">{locationTitle(location)}</p>
      }
      <h1 className={`${compact ? 'mt-3' : 'mt-5'} font-display text-item font-semibold text-ink`}>{item.name}</h1>
      {note && <p className="mt-1 text-helper text-ink-soft">{note}</p>}
      {item.helper && <PipTip className={compact ? 'mt-4' : 'mt-5'}>{item.helper}</PipTip>}
    </Card>);

}