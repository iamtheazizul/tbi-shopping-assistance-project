import React from 'react';
import { motion } from 'framer-motion';
import { aisleCount } from '../../data/stores';
import { useShouldReduceMotion } from '../../hooks/useShouldReduceMotion';
import type { StoreAisleMap } from '../../data/storeMaps';

interface AisleMapProps {
  aisles: StoreAisleMap;
  justAdded: number[];
  onSelect: (aisle: number) => void;
}

// Layout in map units (same store outline as the trip map, drawn taller so aisles are tappable).
const W = 320;
const H = 300;
const AISLE_X0 = 54;
const GAP = 3;
const AISLE_W = (W - AISLE_X0 - GAP * (aisleCount - 1)) / aisleCount;
const AISLE_Y = 38;
const AISLE_H = 170;

const pos = (x: number, y: number, w: number, h: number): React.CSSProperties => ({
  left: `${x / W * 100}%`,
  top: `${y / H * 100}%`,
  width: `${w / W * 100}%`,
  height: `${h / H * 100}%`
});

export function AisleMap({ aisles, justAdded, onSelect }: AisleMapProps) {
  const reduce = useShouldReduceMotion();
  const numbers = Array.from({ length: aisleCount }, (_, i) => i + 1);

  return (
    <div className="rounded-3xl border-2 border-line bg-card p-3">
      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <Area label="Dairy wall" style={pos(0, 0, W, 28)} />
        <Area label="Produce" style={pos(0, AISLE_Y, 46, AISLE_H)} vertical />
        <Area label="Bakery" style={pos(0, 218, 46, 40)} />

        <ul aria-label="Aisles" className="contents">
          {numbers.map((n) => {
            const mapped = aisles[n];
            const isNew = justAdded.includes(n);
            const x = AISLE_X0 + (n - 1) * (AISLE_W + GAP);
            const label = mapped ?
            `Aisle ${n}${isNew ? ', just added' : ''}: ${mapped.categories.join(', ')}` :
            `Aisle ${n}, no photo yet`;

            return (
              <li key={n} className="absolute" style={pos(x, AISLE_Y, AISLE_W, AISLE_H)}>
                <motion.button
                  type="button"
                  onClick={() => onSelect(n)}
                  aria-label={label}
                  initial={false}
                  animate={isNew && !reduce ? { scale: [1, 1.14, 1] } : undefined}
                  transition={isNew && !reduce ? { duration: 0.3, delay: 0.4, ease: 'easeOut' } : undefined}
                  className={`flex h-full w-full flex-col items-center rounded-md pt-2 transition-colors duration-150 ease-out ${
                  isNew ?
                  'bg-primary text-on-primary' :
                  mapped ?
                  'bg-line text-ink hover:bg-primary-soft' :
                  'border-2 border-dashed border-ink-soft bg-card text-ink-soft hover:bg-primary-soft'}`
                  }>
                  
                  <span className="text-[13px] font-extrabold leading-none">{n}</span>
                  {!mapped &&
                  <span aria-hidden className="mt-auto pb-2 text-[13px] font-extrabold leading-none">
                      ?
                    </span>
                  }
                </motion.button>
              </li>);

          })}
        </ul>

        {justAdded.
        filter((n) => aisles[n]).
        map((n) => {
          const cx = AISLE_X0 + (n - 1) * (AISLE_W + GAP) + AISLE_W / 2;
          const left = Math.min(Math.max(cx / W * 100, 13), 85);
          return (
            <span
              key={`tag-${n}`}
              aria-hidden
              className="absolute -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-2.5 py-1 text-[12px] font-extrabold leading-none text-on-primary"
              style={{ left: `${left}%`, top: `${(AISLE_Y + AISLE_H + 8) / H * 100}%` }}>
              
                Just added
              </span>);

        })}

        <span
          aria-hidden
          className="absolute -translate-x-1/2 text-[12px] font-extrabold text-ink-soft"
          style={{ left: `${187 / W * 100}%`, top: `${276 / H * 100}%` }}>
          
          Entrance
        </span>
      </div>
    </div>);

}

interface AreaProps {
  label: string;
  style: React.CSSProperties;
  vertical?: boolean;
}

function Area({ label, style, vertical = false }: AreaProps) {
  return (
    <div
      aria-hidden
      style={style}
      className="absolute flex items-center justify-center rounded-md bg-line/60 text-[12px] font-extrabold text-ink-soft">
      
      <span className={vertical ? '[writing-mode:vertical-rl] rotate-180' : ''}>{label}</span>
    </div>);

}