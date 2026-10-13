import React from 'react';
import { useNav } from '../../contexts/NavigationContext';
import { useSign } from '../../contexts/SignContext';
import { stores } from '../../data/stores';
import { useLine } from '../../hooks/usePersonality';
import { ScreenLayout } from '../../components/ScreenLayout';
import { PipSays } from '../../components/PipSays';
import { StoreCard } from '../../components/StoreCard';
import { StoreUnavailableCard } from '../../components/StoreUnavailableCard';

export function SignStore() {
  const nav = useNav();
  const { setStoreId, reset, openMap } = useSign();
  const ask = useLine('signStoreAsk');

  return (
    <ScreenLayout title="Add a sign">
      <PipSays mood="happy">{ask}</PipSays>
      <div className="mt-6 flex flex-col gap-4">
        {stores.map((store) =>
        <StoreCard
          key={store.id}
          store={store}
          onSelect={() => {
            reset();
            setStoreId(store.id);
            nav.push('signCapture');
          }}
          onViewMap={() => {
            openMap(store.id);
            nav.push('storeMap');
          }} />

        )}
        <StoreUnavailableCard />
      </div>
    </ScreenLayout>);

}