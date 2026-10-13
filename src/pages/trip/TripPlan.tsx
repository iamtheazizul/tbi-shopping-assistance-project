import React, { useMemo } from 'react';
import { useNav } from '../../contexts/NavigationContext';
import { useTrip } from '../../contexts/TripContext';
import { stores } from '../../data/stores';
import { tripPlanHeading } from '../../data/copy';
import { usePersonality } from '../../hooks/usePersonality';
import { ScreenLayout } from '../../components/ScreenLayout';
import { PipTip } from '../../components/PipTip';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { stockNote } from '../../utils/stock';
import { buildTrip, estimateMinutes, groupStops, skipNote } from '../../utils/trip';

export function TripPlan() {
  const nav = useNav();
  const { activeList, storeId, startTrip } = useTrip();
  const store = stores.find((s) => s.id === storeId) ?? stores[0];
  const items = useMemo(() => buildTrip(activeList?.items ?? []), [activeList]);
  const stops = useMemo(() => groupStops(items), [items]);
  const personality = usePersonality();

  return (
    <ScreenLayout
      title="Trip plan"
      onBack={nav.back}
      footer={
      <PrimaryButton
        onClick={() => {
          startTrip();
          nav.push('guided');
        }}>
        
          Start trip
        </PrimaryButton>
      }>
      
      <h2 className="font-display text-item font-semibold text-ink">
        {tripPlanHeading(personality, items.length, stops.length)}
      </h2>
      <p className="mt-1 text-body text-ink">About {estimateMinutes(stops.length)} minutes</p>
      <p className="text-helper text-ink-soft">
        {store.name}, {store.place}
      </p>

      <ol className="mt-6 overflow-hidden rounded-3xl border-2 border-line bg-card">
        {stops.map((stop, i) =>
        <li key={stop.key} className={`flex items-baseline gap-4 px-5 py-4 ${i > 0 ? 'border-t-2 border-line' : ''}`}>
            <span className="w-[6em] shrink-0 font-display text-lead font-semibold text-ink">{stop.title}</span>
            <div className="min-w-0">
              <p className="text-body text-ink">{stop.items.join(', ')}</p>
              {stop.items.map((name) => {
              const note = stockNote(name);
              return note ?
              <p key={name} className="mt-1 text-helper text-ink-soft">
                    {stop.items.length > 1 ? `${name}: ${note}` : note}
                  </p> :
              null;
            })}
            </div>
          </li>
        )}
      </ol>

      <PipTip className="mt-5">{skipNote(items)}</PipTip>
    </ScreenLayout>);

}