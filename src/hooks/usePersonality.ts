import { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { lines } from '../data/copy';
import type { LineKey } from '../data/copy';
import type { Personality } from '../types/app';

export function usePersonality(): Personality {
  return useSettings().settings.personality;
}

/** In Calm mode Pip only appears on the splash and empty states. */
export function useShowPip(): boolean {
  return usePersonality() !== 'calm';
}

/** Picks one line for this screen visit and keeps it stable while it's open. */
export function useLine(key: LineKey): string {
  const personality = usePersonality();
  const [seed] = useState(Math.random);
  const options = lines[key][personality];
  return options[Math.floor(seed * options.length)];
}