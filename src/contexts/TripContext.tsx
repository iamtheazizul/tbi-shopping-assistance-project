import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { buildTrip, capitalize } from '../utils/trip';
import type { ItemResult, SavedList, TripItem } from '../types/app';

interface TripState {
  items: TripItem[];
  index: number;
  results: ItemResult[];
  direction: 1 | -1;
}

interface TripValue {
  lists: SavedList[];
  activeList: SavedList | undefined;
  setActiveListId: (id: string) => void;
  createList: () => string;
  deleteList: (id: string) => void;
  addItem: (listId: string, name: string) => boolean;
  removeItem: (listId: string, name: string) => void;
  storeId: string | null;
  setStoreId: (id: string) => void;
  trip: TripState;
  currentItem: TripItem | undefined;
  startTrip: () => void;
  resolveItem: (result: Exclude<ItemResult, 'pending'>) => boolean;
  reopenItem: (index: number) => void;
  checkFallback: () => void;
  outOfStockReports: string[];
  reportOutOfStock: (itemName: string) => void;
}

const TripContext = createContext<TripValue | null>(null);

interface TripProviderProps {
  initialLists: SavedList[];
  children: React.ReactNode;
}

export function TripProvider({ initialLists, children }: TripProviderProps) {
  const [lists, setLists] = useState<SavedList[]>(initialLists);
  const [activeListId, setActiveListId] = useState<string | null>(initialLists[0]?.id ?? null);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [trip, setTrip] = useState<TripState>({ items: [], index: 0, results: [], direction: 1 });

  const [outOfStockReports, setOutOfStockReports] = useState<string[]>([]);

  const activeList = lists.find((l) => l.id === activeListId);

  // Mock "save": in a real build this would be sent to the shared store map.
  const reportOutOfStock = useCallback((itemName: string) => {
    setOutOfStockReports((prev) => prev.includes(itemName) ? prev : [...prev, itemName]);
  }, []);

  const createList = useCallback(() => {
    const id = `list-${Date.now()}`;
    setLists((prev) => [{ id, name: `List for ${format(new Date(), 'MMM d')}`, items: [] }, ...prev]);
    setActiveListId(id);
    return id;
  }, []);

  const deleteList = useCallback((id: string) => {
    setLists((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const addItem = useCallback(
    (listId: string, name: string) => {
      const clean = capitalize(name);
      const list = lists.find((l) => l.id === listId);
      if (!clean || !list) return false;
      if (list.items.some((item) => item.toLowerCase() === clean.toLowerCase())) return false;
      setLists((prev) => prev.map((l) => l.id === listId ? { ...l, items: [...l.items, clean] } : l));
      return true;
    },
    [lists]
  );

  const removeItem = useCallback((listId: string, name: string) => {
    setLists((prev) => prev.map((l) => l.id === listId ? { ...l, items: l.items.filter((i) => i !== name) } : l));
  }, []);

  const startTrip = useCallback(() => {
    if (!activeList) return;
    const items = buildTrip(activeList.items);
    setTrip({ items, index: 0, results: items.map(() => 'pending'), direction: 1 });
    // The list used most recently moves to the top.
    setLists((prev) => [activeList, ...prev.filter((l) => l.id !== activeList.id)]);
  }, [activeList]);

  const resolveItem = useCallback(
    (result: Exclude<ItemResult, 'pending'>) => {
      const isLast = trip.index >= trip.items.length - 1;
      setTrip((prev) => {
        const results = [...prev.results];
        results[prev.index] = result;
        return { ...prev, results, index: isLast ? prev.index : prev.index + 1, direction: 1 };
      });
      return isLast;
    },
    [trip.index, trip.items.length]
  );

  const reopenItem = useCallback((index: number) => {
    setTrip((prev) => {
      const results = [...prev.results];
      results[index] = 'pending';
      return { ...prev, results, index, direction: -1 };
    });
  }, []);

  const checkFallback = useCallback(() => {
    setTrip((prev) => {
      const item = prev.items[prev.index];
      if (!item?.fallback) return prev;
      const items = [...prev.items];
      items[prev.index] = {
        ...item,
        location: { kind: 'aisle', aisle: item.fallback.aisle, label: item.fallback.label },
        helper: `Look with the ${item.fallback.label.toLowerCase()}.`,
        fallback: undefined
      };
      return { ...prev, items, direction: 1 };
    });
  }, []);

  const value = useMemo<TripValue>(
    () => ({
      lists,
      activeList,
      setActiveListId,
      createList,
      deleteList,
      addItem,
      removeItem,
      storeId,
      setStoreId,
      trip,
      currentItem: trip.items[trip.index],
      startTrip,
      resolveItem,
      reopenItem,
      checkFallback,
      outOfStockReports,
      reportOutOfStock
    }),
    [
    lists,
    activeList,
    createList,
    deleteList,
    addItem,
    removeItem,
    storeId,
    trip,
    startTrip,
    resolveItem,
    reopenItem,
    checkFallback,
    outOfStockReports,
    reportOutOfStock]

  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip(): TripValue {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrip must be used inside TripProvider');
  return ctx;
}