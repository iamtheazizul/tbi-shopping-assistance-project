import { useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { playJingle, playPop } from '../utils/sounds';

export function useSounds() {
  const { settings } = useSettings();
  const pop = useCallback(() => {
    if (settings.sounds) playPop();
  }, [settings.sounds]);
  const jingle = useCallback(() => {
    if (settings.sounds) playJingle();
  }, [settings.sounds]);
  return { pop, jingle };
}