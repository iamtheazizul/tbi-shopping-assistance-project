import { useCallback } from 'react';
import { useNav } from '../contexts/NavigationContext';
import { useToast } from '../contexts/ToastContext';
import { useTrip } from '../contexts/TripContext';
import { gotItLine, lineFor } from '../data/copy';
import { usePersonality } from './usePersonality';
import { useSounds } from './useSounds';

export function useTripActions() {
  const { resolveItem, reopenItem, reportOutOfStock, trip, currentItem } = useTrip();
  const { showToast } = useToast();
  const personality = usePersonality();
  const { pop } = useSounds();
  const nav = useNav();

  const found = useCallback(() => {
    if (!currentItem) return;
    const index = trip.index;
    pop();
    const done = resolveItem('found');
    if (done) nav.setStack(['home', 'tripComplete'], 1);
    showToast(gotItLine(personality, currentItem.name), {
      actionLabel: 'Undo',
      duration: 4000,
      onAction: () => {
        reopenItem(index);
        if (done) nav.setStack(['home', 'guided'], -1);
      }
    });
  }, [currentItem, trip.index, pop, resolveItem, reopenItem, showToast, personality, nav]);

  const skip = useCallback(() => {
    if (resolveItem('skipped')) nav.setStack(['home', 'tripComplete'], 1);
  }, [resolveItem, nav]);

  const reportEmpty = useCallback(() => {
    if (!currentItem) return;
    reportOutOfStock(currentItem.name);
    showToast(lineFor('emptyReported', personality));
    if (resolveItem('skipped')) nav.setStack(['home', 'tripComplete'], 1);
  }, [currentItem, reportOutOfStock, showToast, personality, resolveItem, nav]);

  return { found, skip, reportEmpty };
}