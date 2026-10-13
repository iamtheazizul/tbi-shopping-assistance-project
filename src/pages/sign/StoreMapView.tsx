import React, { useState } from 'react';
import { useNav } from '../../contexts/NavigationContext';
import { useSign } from '../../contexts/SignContext';
import { useToast } from '../../contexts/ToastContext';
import { useLine, usePersonality } from '../../hooks/usePersonality';
import { aisleCount, stores } from '../../data/stores';
import { lineFor } from '../../data/copy';
import { ScreenLayout } from '../../components/ScreenLayout';
import { PipSays } from '../../components/PipSays';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { AisleMap } from '../../components/map/AisleMap';
import { MappedAisleSheet } from '../../components/map/MappedAisleSheet';
import { UnmappedAisleSheet } from '../../components/map/UnmappedAisleSheet';

export function StoreMapView() {
  const nav = useNav();
  const { maps, mapView, setStoreId, reset } = useSign();
  const { showToast } = useToast();
  const personality = usePersonality();
  const pipLine = useLine('mapComing');
  const [selected, setSelected] = useState<number | null>(null);

  const store = stores.find((s) => s.id === mapView?.storeId) ?? stores[0];
  const aisles = maps[store.id] ?? {};
  const justAdded = mapView?.justAdded ?? [];
  const mappedCount = Object.keys(aisles).filter((k) => Number(k) <= aisleCount).length;

  const selectedInfo = selected !== null ? aisles[selected] ?? null : null;
  const close = () => setSelected(null);

  return (
    <ScreenLayout title={`${store.name} map`} onBack={nav.back}>
      <p className="text-body font-bold text-ink">
        {mappedCount} of {aisleCount} aisles mapped
      </p>
      <div className="mt-2">
        <ProgressBar value={mappedCount} max={aisleCount} label="Aisles mapped" />
      </div>

      {personality !== 'calm' &&
      <PipSays size={44} className="mt-5">
          {pipLine}
        </PipSays>
      }

      <div className="mt-5">
        <AisleMap aisles={aisles} justAdded={justAdded} onSelect={setSelected} />
      </div>

      <ul aria-label="Map key" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-helper text-ink-soft">
        <li className="flex items-center gap-2">
          <span aria-hidden className="h-4 w-3 rounded-sm bg-line" />
          Mapped
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="h-4 w-3 rounded-sm border-2 border-dashed border-ink-soft" />
          No photo yet
        </li>
        {justAdded.length > 0 &&
        <li className="flex items-center gap-2">
            <span aria-hidden className="h-4 w-3 rounded-sm bg-primary" />
            Just added
          </li>
        }
      </ul>
      <p className="mt-3 text-helper text-ink-soft">Tap an aisle to see what's in it.</p>

      <MappedAisleSheet
        aisle={selectedInfo ? selected : null}
        info={selectedInfo}
        onClose={close}
        onReport={() => {
          close();
          showToast(lineFor('reportThanks', personality));
        }} />
      
      <UnmappedAisleSheet
        aisle={selected !== null && !selectedInfo ? selected : null}
        onClose={close}
        onAddPhoto={() => {
          close();
          reset();
          setStoreId(store.id);
          nav.setStack(['signStore', 'signCapture'], 1);
        }} />
      
    </ScreenLayout>);

}