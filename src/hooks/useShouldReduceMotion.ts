import { useReducedMotion } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';

export function useShouldReduceMotion(): boolean {
  const system = useReducedMotion();
  const { settings } = useSettings();
  return settings.reduceMotion || Boolean(system);
}