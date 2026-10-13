import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const colors = ['rgb(var(--c-primary))', '#FFC94D', '#FF8FA3', '#5BC0FF', '#B99CFF'];

/** A one-time burst from the center. Render only when motion is allowed. */
export function Confetti() {
  const pieces = useMemo(
    () =>
    Array.from({ length: 18 }, (_, i) => {
      const angle = i / 18 * Math.PI * 2 + Math.random() * 0.3;
      const distance = 90 + Math.random() * 60;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 30,
        rotate: Math.random() * 360,
        color: colors[i % colors.length],
        round: i % 3 === 0
      };
    }),
    []
  );

  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2">
      {pieces.map((p) =>
      <motion.span
        key={p.id}
        className={`absolute h-2.5 w-2 ${p.round ? 'rounded-full' : 'rounded-[2px]'}`}
        style={{ backgroundColor: p.color }}
        initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
        animate={{ x: p.x, y: [0, p.y, p.y + 60], opacity: [1, 1, 0], rotate: p.rotate, scale: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }} />

      )}
    </div>);

}