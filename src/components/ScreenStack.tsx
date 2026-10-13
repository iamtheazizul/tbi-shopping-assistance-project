import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNav } from '../contexts/NavigationContext';
import { useShouldReduceMotion } from '../hooks/useShouldReduceMotion';
import { motionTransition, screenVariants } from '../utils/motion';
import { Splash } from '../pages/Splash';
import { Onboarding } from '../pages/Onboarding';
import { Home } from '../pages/Home';
import { Lists } from '../pages/lists/Lists';
import { ListDetail } from '../pages/lists/ListDetail';
import { ChooseStore } from '../pages/trip/ChooseStore';
import { PlanningTrip } from '../pages/trip/PlanningTrip';
import { TripPlan } from '../pages/trip/TripPlan';
import { GuidedTrip } from '../pages/trip/GuidedTrip';
import { TripComplete } from '../pages/trip/TripComplete';
import { SignStore } from '../pages/sign/SignStore';
import { SignCapture } from '../pages/sign/SignCapture';
import { SignCamera } from '../pages/sign/SignCamera';
import { SignRoll } from '../pages/sign/SignRoll';
import { SignScan } from '../pages/sign/SignScan';
import { SignSaved } from '../pages/sign/SignSaved';
import { StoreMapView } from '../pages/sign/StoreMapView';
import { Me } from '../pages/me/Me';
import { About } from '../pages/me/About';
import type { MotionCustom, ScreenName } from '../types/app';

const screens: Record<ScreenName, React.ComponentType> = {
  splash: Splash,
  onboarding: Onboarding,
  home: Home,
  lists: Lists,
  listDetail: ListDetail,
  chooseStore: ChooseStore,
  planning: PlanningTrip,
  tripPlan: TripPlan,
  guided: GuidedTrip,
  tripComplete: TripComplete,
  signStore: SignStore,
  signCapture: SignCapture,
  signCamera: SignCamera,
  signRoll: SignRoll,
  signScan: SignScan,
  signSaved: SignSaved,
  storeMap: StoreMapView,
  me: Me,
  about: About
};

export function ScreenStack() {
  const { current, depth, direction } = useNav();
  const reduce = useShouldReduceMotion();
  const Screen = screens[current];
  const custom: MotionCustom = { direction, reduce };

  return (
    <AnimatePresence initial={false} custom={custom}>
      <motion.div
        key={`${depth}-${current}`}
        custom={custom}
        variants={screenVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={motionTransition(reduce || direction === 0)}
        className="absolute inset-0 bg-canvas">
        
        <Screen />
      </motion.div>
    </AnimatePresence>);

}