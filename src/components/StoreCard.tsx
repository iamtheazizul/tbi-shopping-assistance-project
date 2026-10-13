import React from 'react';
import { ChevronRightIcon, MapIcon } from 'lucide-react';
import { useSign } from '../contexts/SignContext';
import { Card } from './ui/Card';
import type { Store } from '../types/app';

interface StoreCardProps {
  store: Store;
  onSelect: () => void;
  onViewMap?: () => void;
}

export function StoreCard({ store, onSelect, onViewMap }: StoreCardProps) {
  const { updatedLabel } = useSign();

  const details =
  <>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-lead font-semibold text-ink">{store.name}</span>
        <span className="block text-body text-ink">{store.place}</span>
        <span className="mt-1 block text-helper text-ink-soft">Map updated {updatedLabel(store)}</span>
      </span>
      <ChevronRightIcon aria-hidden size={28} strokeWidth={2.5} className="shrink-0 text-ink" />
    </>;


  if (!onViewMap) {
    return (
      <Card onClick={onSelect} className="flex min-h-[104px] items-center gap-4 p-5">
        {details}
      </Card>);

  }

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-line bg-card shadow-[0_4px_0_rgb(var(--c-line))]">
      <button
        type="button"
        onClick={onSelect}
        className="flex min-h-[104px] w-full items-center gap-4 p-5 text-left transition-colors duration-150 ease-out hover:bg-primary-soft">
        
        {details}
      </button>
      <button
        type="button"
        onClick={onViewMap}
        aria-label={`See the ${store.name} store map`}
        className="flex min-h-[56px] w-full items-center gap-3 border-t-2 border-line px-5 text-left text-body font-extrabold text-ink transition-colors duration-150 ease-out hover:bg-primary-soft">
        
        <MapIcon aria-hidden size={22} strokeWidth={2.25} />
        <span className="flex-1">Store map</span>
        <ChevronRightIcon aria-hidden size={22} strokeWidth={2.5} />
      </button>
    </div>);

}