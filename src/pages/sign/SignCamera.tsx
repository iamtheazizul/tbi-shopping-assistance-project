import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useNav } from '../../contexts/NavigationContext';
import { useSign } from '../../contexts/SignContext';
import { useShouldReduceMotion } from '../../hooks/useShouldReduceMotion';
import { signPhotos } from '../../data/signPhotos';
import { FlowHeader } from '../../components/sign/FlowHeader';

const livePhoto = signPhotos[0];

export function SignCamera() {
  const nav = useNav();
  const { selectPhoto } = useSign();
  const reduce = useShouldReduceMotion();
  const drift = useAnimationControls();
  const [shooting, setShooting] = useState(false);
  const [flash, setFlash] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (!reduce) {
      void drift.start({
        x: [0, -6, 4, 0],
        y: [0, 4, -3, 0],
        transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' }
      });
    }
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, [drift, reduce]);

  const shoot = () => {
    if (shooting) return;
    setShooting(true);
    drift.stop();
    setFlash(true);
    timers.current.push(window.setTimeout(() => setFlash(false), 120));
    timers.current.push(
      window.setTimeout(() => {
        selectPhoto(livePhoto.id);
        nav.push('signScan');
      }, 550)
    );
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-black">
      <FlowHeader dark onClose={() => nav.setStack(['signStore'], -1)} />

      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <motion.img
          src={livePhoto.url}
          alt="Live camera view of an aisle sign"
          animate={drift}
          className="absolute inset-0 h-full w-full scale-[1.06] object-cover"
          draggable={false} />
        
        <div aria-hidden className="absolute inset-[7%]">
          <span className="absolute left-0 top-0 h-10 w-10 rounded-tl-2xl border-l-4 border-t-4 border-white" />
          <span className="absolute right-0 top-0 h-10 w-10 rounded-tr-2xl border-r-4 border-t-4 border-white" />
          <span className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-2xl border-b-4 border-l-4 border-white" />
          <span className="absolute bottom-0 right-0 h-10 w-10 rounded-br-2xl border-b-4 border-r-4 border-white" />
        </div>
      </div>

      <p className="mt-4 text-center text-body font-bold text-white">Point at the sign over the aisle</p>

      <div className="flex flex-1 items-center justify-center pb-8">
        <motion.button
          type="button"
          onClick={shoot}
          aria-label="Take photo"
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.1 }}
          className="flex h-20 w-20 items-center justify-center rounded-full border-[5px] border-white">
          
          <motion.span
            className="block h-[58px] w-[58px] rounded-full bg-white"
            animate={{ scale: shooting ? 0.8 : 1 }}
            transition={{ duration: 0.12, ease: 'easeOut' }} />
          
        </motion.button>
      </div>

      <AnimatePresence>
        {flash &&
        <motion.div
          aria-hidden
          className="absolute inset-0 z-20 bg-white"
          initial={{ opacity: 0.95 }}
          animate={{ opacity: 0.95 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }} />

        }
      </AnimatePresence>
    </div>);

}