import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNav } from '../../contexts/NavigationContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useTrip } from '../../contexts/TripContext';
import { useShouldReduceMotion } from '../../hooks/useShouldReduceMotion';
import { useTripActions } from '../../hooks/useTripActions';
import { ScreenLayout } from '../../components/ScreenLayout';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SecondaryButton } from '../../components/ui/SecondaryButton';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StoreMap } from '../../components/trip/StoreMap';
import { TripItemCard } from '../../components/trip/TripItemCard';
import { CantFindSheet } from '../../components/trip/CantFindSheet';
import { EndTripSheet } from '../../components/trip/EndTripSheet';
import { cardVariants, motionTransition } from '../../utils/motion';
import { locationKey } from '../../utils/trip';
import type { MotionCustom } from '../../types/app';

export function GuidedTrip() {
  const nav = useNav();
  const { settings } = useSettings();
  const { trip, currentItem, checkFallback } = useTrip();
  const { found, skip, reportEmpty } = useTripActions();
  const reduce = useShouldReduceMotion();
  const [sheet, setSheet] = useState<'none' | 'cantFind' | 'endTrip'>('none');

  if (!currentItem) return null;

  const total = trip.items.length;
  const position = trip.index + 1;
  const showMap = settings.directions === 'map';
  const custom: MotionCustom = { direction: trip.direction, reduce };
  const closeSheet = () => setSheet('none');
  const foundCount = trip.results.filter((r) => r === 'found').length;
  const tripKeys = trip.items.map((item) => locationKey(item.location));
  const upcomingKeys = trip.items.
  filter((_, i) => i > trip.index && trip.results[i] === 'pending').
  map((item) => locationKey(item.location));

  return (
    <div className="relative h-full">
      <ScreenLayout
        focus
        leading={
        <p className="text-lead font-extrabold text-ink">
            Item {position} of {total}
          </p>
        }
        right={
        <button
          type="button"
          onClick={() => setSheet('endTrip')}
          className="h-12 shrink-0 rounded-full border-2 border-line bg-card px-4 text-body font-extrabold text-ink transition-colors duration-150 ease-out hover:bg-primary-soft">
          
            End trip
          </button>
        }
        footer={
        <>
            <PrimaryButton onClick={found}>Got it</PrimaryButton>
            <SecondaryButton onClick={() => setSheet('cantFind')}>Can't find it</SecondaryButton>
          </>
        }>
        
        <ProgressBar value={position} max={total} label="Trip progress" />

        {showMap &&
        <div className="mt-4">
            <StoreMap location={currentItem.location} tripKeys={tripKeys} upcomingKeys={upcomingKeys} />
          </div>
        }

        <div className={`grid ${showMap ? 'mt-4' : 'mt-8'}`}>
          <AnimatePresence initial={false} custom={custom}>
            <motion.div
              key={`${trip.index}-${locationKey(currentItem.location)}`}
              custom={custom}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={motionTransition(reduce)}
              className="[grid-area:1/1]"
              aria-live="polite">
              
              <TripItemCard item={currentItem} compact={showMap} />
            </motion.div>
          </AnimatePresence>
        </div>
      </ScreenLayout>

      <CantFindSheet
        open={sheet === 'cantFind'}
        item={currentItem}
        onClose={closeSheet}
        onTryFallback={() => {
          checkFallback();
          closeSheet();
        }}
        onSkip={() => {
          closeSheet();
          skip();
        }}
        onEmpty={() => {
          closeSheet();
          reportEmpty();
        }}
        onFound={() => {
          closeSheet();
          found();
        }} />
      
      <EndTripSheet
        open={sheet === 'endTrip'}
        foundCount={foundCount}
        total={total}
        onClose={closeSheet}
        onEnd={() => nav.setStack(['home'], -1)} />
      
    </div>);

}