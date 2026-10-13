import React from 'react';
import { aisleCount } from '../../data/stores';
import { locationKey, locationTitle } from '../../utils/trip';
import type { StoreLocation } from '../../types/app';

type BlockState = 'current' | 'upcoming' | 'onTrip' | 'off';

interface StoreMapProps {
  location: StoreLocation;
  tripKeys: string[];
  upcomingKeys: string[];
}

const AISLE_X0 = 54;
const AISLE_GAP = 4;
const AISLE_W = (320 - AISLE_X0 - AISLE_GAP * (aisleCount - 1)) / aisleCount;
const AISLE_Y = 28;
const AISLE_H = 66;
const WALK_Y = 112;
const ENTRANCE: [number, number] = [187, 132];

export function StoreMap({ location, tripKeys, upcomingKeys }: StoreMapProps) {
  const currentKey = locationKey(location);
  const path = routeTo(location);

  const stateFor = (key: string): BlockState => {
    if (key === currentKey) return 'current';
    if (upcomingKeys.includes(key)) return 'upcoming';
    if (tripKeys.includes(key)) return 'onTrip';
    return 'off';
  };

  return (
    <div
      role="img"
      aria-label={`Store map. ${locationTitle(location)} is highlighted, with a dotted path from the entrance.`}
      className="rounded-3xl border-2 border-line bg-card p-2.5">
      
      <svg viewBox="0 0 320 150" className="block h-auto w-full" aria-hidden>
        <Block x={0} y={0} w={320} h={20} label="Dairy wall" state={stateFor('area-Dairy wall')} />
        <Block x={0} y={AISLE_Y} w={46} h={AISLE_H} label="Produce" state={stateFor('area-Produce')} />
        <Block x={0} y={102} w={46} h={26} label="Bakery" state={stateFor('area-Bakery')} />
        {Array.from({ length: aisleCount }, (_, i) => i + 1).map((n) =>
        <Block
          key={n}
          x={AISLE_X0 + (n - 1) * (AISLE_W + AISLE_GAP)}
          y={AISLE_Y}
          w={AISLE_W}
          h={AISLE_H}
          label={String(n)}
          state={stateFor(`aisle-${n}`)} />

        )}
        {path &&
        <>
            <polyline
            points={path.map((p) => p.join(',')).join(' ')}
            fill="none"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="0.1 8"
            className="stroke-ink" />
          
            <circle cx={ENTRANCE[0]} cy={ENTRANCE[1]} r={4.5} className="fill-ink" />
          </>
        }
        <text x={ENTRANCE[0]} y={148} textAnchor="middle" fontSize="11" fontWeight={800} className="fill-ink-soft">
          Entrance
        </text>
      </svg>
    </div>);

}

interface BlockProps {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  state: BlockState;
}

function Block({ x, y, w, h, label, state }: BlockProps) {
  const rectClass =
  state === 'current' ?
  'fill-primary' :
  state === 'upcoming' ?
  'fill-primary-soft stroke-primary' :
  'fill-line';
  const textClass = state === 'current' ? 'fill-on-primary' : state === 'off' ? 'fill-ink-soft' : 'fill-ink';

  return (
    <g opacity={state === 'off' ? 0.35 : 1} className="transition-opacity duration-200 ease-out">
      <rect
        x={state === 'upcoming' ? x + 1 : x}
        y={state === 'upcoming' ? y + 1 : y}
        width={state === 'upcoming' ? w - 2 : w}
        height={state === 'upcoming' ? h - 2 : h}
        rx={5}
        strokeWidth={state === 'upcoming' ? 2 : 0}
        className={`transition-[fill] duration-200 ease-out ${rectClass}`} />
      
      <text
        x={x + w / 2}
        y={y + h / 2 + 4.5}
        textAnchor="middle"
        fontSize={label.length > 2 ? 12 : 13}
        fontWeight={800}
        className={textClass}>
        
        {label}
      </text>
    </g>);

}

function routeTo(location: StoreLocation): [number, number][] | null {
  const start: [number, number][] = [ENTRANCE, [ENTRANCE[0], WALK_Y]];
  if (location.kind === 'aisle') {
    const cx = AISLE_X0 + (location.aisle - 1) * (AISLE_W + AISLE_GAP) + AISLE_W / 2;
    return [...start, [cx, WALK_Y], [cx, AISLE_Y + AISLE_H + 2]];
  }
  if (location.kind === 'area') {
    if (location.name === 'Bakery') return [...start, [50, WALK_Y]];
    if (location.name === 'Produce') return [...start, [50, WALK_Y], [50, AISLE_Y + AISLE_H / 2]];
    return [...start, [50, WALK_Y], [50, 24]];
  }
  return null;
}