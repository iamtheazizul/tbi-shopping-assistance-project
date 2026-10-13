import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { signPhotos, startingSignsAdded } from '../data/signPhotos';
import { storeMaps } from '../data/storeMaps';
import type { StoreAisleMap } from '../data/storeMaps';
import type { Store } from '../types/app';
import type { SignPhoto, SignPhotoId } from '../types/sign';

interface MapView {
  storeId: string;
  justAdded: number[];
}

interface SignValue {
  storeId: string | null;
  setStoreId: (id: string) => void;
  photo: SignPhoto | null;
  selectPhoto: (id: SignPhotoId) => void;
  signsAdded: number;
  lastSaved: number[];
  save: (aisles: number[], categories: string[]) => void;
  updatedLabel: (store: Store) => string;
  maps: Record<string, StoreAisleMap>;
  mapView: MapView | null;
  openMap: (storeId: string, justAdded?: number[]) => void;
  reset: () => void;
}

const SignContext = createContext<SignValue | null>(null);

export function SignProvider({ children }: {children: React.ReactNode;}) {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [photo, setPhoto] = useState<SignPhoto | null>(null);
  const [signsAdded, setSignsAdded] = useState(startingSignsAdded);
  const [lastSaved, setLastSaved] = useState<number[]>([]);
  const [updated, setUpdated] = useState<Record<string, string>>({});
  const [maps, setMaps] = useState<Record<string, StoreAisleMap>>(storeMaps);
  const [mapView, setMapView] = useState<MapView | null>(null);

  const selectPhoto = useCallback((id: SignPhotoId) => {
    setPhoto(signPhotos.find((p) => p.id === id) ?? signPhotos[0]);
  }, []);

  const save = useCallback(
    (aisles: number[], categories: string[]) => {
      setLastSaved(aisles);
      setSignsAdded((n) => n + 1);
      if (!storeId) return;
      setUpdated((prev) => ({ ...prev, [storeId]: 'just now' }));
      setMaps((prev) => {
        const store = { ...(prev[storeId] ?? {}) };
        aisles.forEach((aisle) => {
          store[aisle] = { categories, updated: 'just now' };
        });
        return { ...prev, [storeId]: store };
      });
    },
    [storeId]
  );

  const openMap = useCallback((id: string, justAdded: number[] = []) => {
    setMapView({ storeId: id, justAdded });
  }, []);

  const updatedLabel = useCallback((store: Store) => updated[store.id] ?? store.updated, [updated]);

  const reset = useCallback(() => {
    setPhoto(null);
  }, []);

  const value = useMemo<SignValue>(
    () => ({
      storeId,
      setStoreId,
      photo,
      selectPhoto,
      signsAdded,
      lastSaved,
      save,
      updatedLabel,
      maps,
      mapView,
      openMap,
      reset
    }),
    [storeId, photo, selectPhoto, signsAdded, lastSaved, save, updatedLabel, maps, mapView, openMap, reset]
  );

  return <SignContext.Provider value={value}>{children}</SignContext.Provider>;
}

export function useSign(): SignValue {
  const ctx = useContext(SignContext);
  if (!ctx) throw new Error('useSign must be used inside SignProvider');
  return ctx;
}