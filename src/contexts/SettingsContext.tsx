import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Appearance, Directions, Personality, TextSize, ThemeId } from '../types/app';

export interface Settings {
  onboarded: boolean;
  directions: Directions;
  textSize: TextSize;
  theme: ThemeId;
  appearance: Appearance;
  personality: Personality;
  sounds: boolean;
  pipTips: boolean;
  reduceMotion: boolean;
  askStock: boolean;
}

interface SettingsValue {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsValue | null>(null);

interface SettingsProviderProps {
  onboarded: boolean;
  children: React.ReactNode;
}

export function SettingsProvider({ onboarded, children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>({
    onboarded,
    directions: 'list',
    textSize: 'large',
    theme: 'pea',
    appearance: 'light',
    personality: 'cheerful',
    sounds: false,
    pipTips: true,
    reduceMotion: false,
    askStock: true
  });

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo(() => ({ settings, updateSettings }), [settings, updateSettings]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}