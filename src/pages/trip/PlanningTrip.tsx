import React, { useEffect } from 'react';
import { useIsPresent } from 'framer-motion';
import { useNav } from '../../contexts/NavigationContext';
import { useShowPip } from '../../hooks/usePersonality';
import { Pip } from '../../components/Pip';
import { LoadingPhrase } from '../../components/LoadingPhrase';

export function PlanningTrip() {
  const { replace } = useNav();
  const isPresent = useIsPresent();
  const showPip = useShowPip();

  // Advance once. Only while this screen is the one on top, so it can never
  // jump in after the user has moved somewhere else.
  useEffect(() => {
    if (!isPresent) return;
    const timer = window.setTimeout(() => replace('tripPlan'), 2000);
    return () => window.clearTimeout(timer);
  }, [replace, isPresent]);

  return (
    <main className="flex h-full flex-col items-center justify-center bg-canvas px-8 text-center">
      {showPip && <Pip mood="squinting" size={112} />}
      <h1 className="sr-only">Planning your trip</h1>
      <LoadingPhrase className="mt-8 text-lead font-bold text-ink" />
    </main>);

}