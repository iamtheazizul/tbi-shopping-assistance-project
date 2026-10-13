import React from 'react';
import { useNav } from '../../contexts/NavigationContext';
import { useTrip } from '../../contexts/TripContext';
import { stores } from '../../data/stores';
import { useLine } from '../../hooks/usePersonality';
import { ScreenLayout } from '../../components/ScreenLayout';
import { StoreCard } from '../../components/StoreCard';
import { StoreUnavailableCard } from '../../components/StoreUnavailableCard';

export function ChooseStore() {
  const nav = useNav();
  const { setStoreId } = useTrip();
  const heading = useLine('chooseStore');

  return (
    <ScreenLayout title="Choose a store" onBack={nav.back}>
      <p className="text-lead text-ink">{heading}</p>
      <div className="mt-6 flex flex-col gap-4">
        {stores.map((store) =>
        <StoreCard
          key={store.id}
          store={store}
          onSelect={() => {
            setStoreId(store.id);
            nav.push('planning');
          }} />

        )}
        <StoreUnavailableCard />
      </div>
    </ScreenLayout>);

}