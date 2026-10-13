import React from 'react';
import { MotionConfig } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';
import { useIsDark } from '../hooks/useIsDark';
import { useShouldReduceMotion } from '../hooks/useShouldReduceMotion';
import { themeVars } from '../utils/theme';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  const { settings } = useSettings();
  const isDark = useIsDark();
  const reduce = useShouldReduceMotion();
  const style = {
    ...themeVars(settings.theme, isDark),
    '--ts': settings.textSize === 'xlarge' ? '1.18' : '1',
    colorScheme: isDark ? 'dark' : 'light'
  } as React.CSSProperties;

  return (
    <MotionConfig reducedMotion={reduce ? 'always' : 'never'}>
      <div className="flex min-h-screen w-full items-center justify-center bg-backdrop sm:py-8">
        <div
          style={style}
          className="relative h-[100dvh] w-full overflow-hidden bg-canvas font-sans font-medium text-ink sm:h-[844px] sm:max-h-[calc(100vh-4rem)] sm:w-[390px] sm:rounded-[44px] sm:border-2 sm:border-line">
          
          {children}
        </div>
      </div>
    </MotionConfig>);

}