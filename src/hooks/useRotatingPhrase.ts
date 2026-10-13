import { useEffect, useState } from 'react';
import { lines } from '../data/copy';
import { usePersonality } from './usePersonality';
import { randomIndex } from '../utils/random';

export function useRotatingPhrase(key: 'loading' | 'signReading' = 'loading', intervalMs = 1500): string {
  const personality = usePersonality();
  const options = lines[key][personality];
  const [index, setIndex] = useState(() => randomIndex(options.length));

  useEffect(() => {
    if (options.length <= 1) return;
    const timer = window.setInterval(() => setIndex((prev) => randomIndex(options.length, prev)), intervalMs);
    return () => window.clearInterval(timer);
  }, [options.length, intervalMs]);

  return options[index % options.length];
}