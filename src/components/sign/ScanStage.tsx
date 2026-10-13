import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import { useShouldReduceMotion } from '../../hooks/useShouldReduceMotion';
import { boxStyle } from '../../utils/signGeometry';
import { AdjustBox } from './AdjustBox';
import type { PhotoBox, SignCell, SignPhoto } from '../../types/sign';

export type ScanPhase = 'adjust' | 'reading' | 'results';

interface ScanStageProps {
  photo: SignPhoto;
  phase: ScanPhase;
  box: PhotoBox;
  onBoxChange: (box: PhotoBox) => void;
  cells: SignCell[];
  signsInBox: number[];
  onReadDone: () => void;
}

const SCAN_MS = 2400;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const chipSpring = { type: 'spring' as const, stiffness: 420, damping: 32 };

export function ScanStage({ photo, phase, box, onBoxChange, cells, signsInBox, onReadDone }: ScanStageProps) {
  const reduce = useShouldReduceMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [landed, setLanded] = useState<string[]>([]);

  // Only the first copy of each word flies into the chip row (Photo E repeats itself a lot).
  const flyers = useMemo(() => {
    const seen = new Set<string>();
    return new Set(
      cells.
      filter((c) => {
        if (seen.has(c.label)) return false;
        seen.add(c.label);
        return true;
      }).
      map((c) => c.id)
    );
  }, [cells]);

  useEffect(() => {
    if (phase !== 'reading') return;
    setRevealed([]);
    setLanded([]);
    const timers: number[] = [];

    if (reduce) {
      setRevealed(cells.map((c) => c.id));
      setLanded(cells.filter((c) => flyers.has(c.id)).map((c) => c.id));
      timers.push(window.setTimeout(onReadDone, 700));
    } else {
      cells.forEach((cell) => {
        const at = clamp01((cell.box.y + cell.box.h / 2 - box.y) / box.h) * SCAN_MS;
        timers.push(window.setTimeout(() => setRevealed((prev) => [...prev, cell.id]), at));
        if (flyers.has(cell.id)) {
          timers.push(window.setTimeout(() => setLanded((prev) => [...prev, cell.id]), at + 320));
        }
      });
      timers.push(window.setTimeout(onReadDone, SCAN_MS + 700));
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
    // Runs once each time reading starts; cells and box are frozen for the read.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const showFindings = phase !== 'adjust';

  return (
    <LayoutGroup>
      <div ref={containerRef} className="relative select-none overflow-hidden rounded-3xl border-2 border-line bg-card">
        <img src={photo.url} alt={photo.alt} draggable={false} className="block h-auto w-full" />

        {phase === 'adjust' && <AdjustBox box={box} onChange={onBoxChange} containerRef={containerRef} />}

        {showFindings &&
        signsInBox.map((si) =>
        <motion.div
          key={`sign-${si}`}
          aria-hidden
          style={boxStyle(photo.signs[si].box)}
          className="absolute rounded-lg border-[3px] border-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }} />

        )}

        {showFindings &&
        cells.
        filter((c) => revealed.includes(c.id)).
        map((cell) =>
        <motion.div
          key={cell.id}
          aria-hidden
          style={boxStyle(cell.box)}
          className="absolute rounded-md border-2 border-primary bg-primary/20"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 520, damping: 22 }}>
          
                {flyers.has(cell.id) && !landed.includes(cell.id) &&
          <motion.span
            layoutId={`word-${cell.id}`}
            transition={chipSpring}
            className="absolute inset-0 rounded-[4px] bg-primary" />

          }
              </motion.div>
        )}

        {phase === 'reading' && !reduce &&
        <motion.div
          aria-hidden
          className="absolute h-0"
          style={{ left: `${box.x}%`, width: `${box.w}%` }}
          initial={{ top: `${box.y}%` }}
          animate={{ top: `${box.y + box.h}%` }}
          transition={{ duration: SCAN_MS / 1000, ease: 'linear' }}>
          
            <span className="absolute bottom-0 left-0 h-8 w-full bg-primary/20" />
            <span className="absolute -top-[1.5px] left-0 h-[3px] w-full rounded-full bg-primary" />
          </motion.div>
        }
      </div>

      {showFindings &&
      <ul aria-label="Words Pip read" aria-live="polite" className="mt-4 flex min-h-[40px] flex-wrap gap-2">
          {cells.
        filter((c) => landed.includes(c.id)).
        map((cell) =>
        <motion.li
          key={cell.id}
          layoutId={`word-${cell.id}`}
          transition={chipSpring}
          className="inline-flex h-10 items-center whitespace-nowrap rounded-full border-2 border-primary-edge bg-primary-soft px-3.5 text-helper font-extrabold text-ink">
          
                {cell.label}
              </motion.li>
        )}
        </ul>
      }
    </LayoutGroup>);

}