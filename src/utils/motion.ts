import type { Variants } from 'framer-motion';
import type { MotionCustom } from '../types/app';

export const easeOut = [0.23, 1, 0.32, 1] as const;

const fades = (custom: MotionCustom) => custom.reduce || custom.direction === 0;

export const screenVariants: Variants = {
  enter: (c: MotionCustom) =>
  fades(c) ?
  { opacity: 0, x: 0, zIndex: 1 } :
  { opacity: 1, x: c.direction > 0 ? '100%' : '-28%', zIndex: c.direction > 0 ? 2 : 1 },
  center: { opacity: 1, x: 0 },
  exit: (c: MotionCustom) =>
  fades(c) ?
  { opacity: 0, x: 0, zIndex: 0 } :
  { opacity: 1, x: c.direction > 0 ? '-28%' : '100%', zIndex: c.direction > 0 ? 1 : 2 }
};

export const cardVariants: Variants = {
  enter: (c: MotionCustom) => c.reduce ? { opacity: 0, x: 0 } : { opacity: 1, x: c.direction < 0 ? '-110%' : '110%' },
  center: { opacity: 1, x: 0 },
  exit: (c: MotionCustom) => c.reduce ? { opacity: 0, x: 0 } : { opacity: 1, x: c.direction < 0 ? '110%' : '-110%' }
};

export function motionTransition(fade: boolean) {
  return { duration: fade ? 0.2 : 0.28, ease: easeOut };
}