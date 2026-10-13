import { catalog } from '../data/catalog';
import { aisleCount } from '../data/stores';
import type { StoreLocation, TripItem } from '../types/app';

export interface Stop {
  key: string;
  title: string;
  items: string[];
}

export function lookupItem(name: string): TripItem {
  const entry = catalog[name.trim().toLowerCase()];
  if (!entry) {
    return {
      name,
      location: { kind: 'unknown' },
      helper: "I haven't mapped this one yet. A store worker can help."
    };
  }
  return { name, ...entry };
}

export function buildTrip(names: string[]): TripItem[] {
  return names.
  map((name, index) => ({ item: lookupItem(name), index })).
  sort((a, b) => locationOrder(a.item.location) - locationOrder(b.item.location) || a.index - b.index).
  map(({ item }) => item);
}

export function locationTitle(location: StoreLocation): string {
  if (location.kind === 'aisle') return `Aisle ${location.aisle}`;
  if (location.kind === 'area') return location.name;
  return 'Not mapped yet';
}

export function locationKey(location: StoreLocation): string {
  if (location.kind === 'aisle') return `aisle-${location.aisle}`;
  if (location.kind === 'area') return `area-${location.name}`;
  return 'unknown';
}

export function groupStops(items: TripItem[]): Stop[] {
  const stops: Stop[] = [];
  items.forEach((item) => {
    const key = locationKey(item.location);
    const last = stops[stops.length - 1];
    if (last && last.key === key) last.items.push(item.name);else
    stops.push({ key, title: locationTitle(item.location), items: [item.name] });
  });
  return stops;
}

export function skipNote(items: TripItem[]): string {
  const visited = new Set(
    items.flatMap((item) => item.location.kind === 'aisle' ? [item.location.aisle] : [])
  );
  const skipped = aisleCount - visited.size;
  if (skipped === aisleCount) return 'You can skip all the numbered aisles.';
  if (skipped === 0) return 'This trip goes down every aisle.';
  return `You can skip the other ${skipped} aisles.`;
}

export function estimateMinutes(stopCount: number): number {
  return 5 + stopCount * 2;
}

export function capitalize(value: string): string {
  const trimmed = value.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function locationOrder(location: StoreLocation): number {
  if (location.kind === 'aisle') return 10 + location.aisle;
  if (location.kind === 'unknown') return 200;
  if (location.name === 'Produce') return 0;
  if (location.name === 'Dairy wall') return 100;
  return 110; // Bakery sits by the checkout, so it comes last.
}