import { useEffect, useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

const query = '(prefers-color-scheme: dark)';

export function useIsDark(): boolean {
  const { settings } = useSettings();
  const [systemDark, setSystemDark] = useState(
    () => typeof window !== 'undefined' && Boolean(window.matchMedia?.(query).matches)
  );

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return settings.appearance === 'dark' || settings.appearance === 'system' && systemDark;
}