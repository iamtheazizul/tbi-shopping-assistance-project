import React, { useEffect } from 'react';
import { motion, useIsPresent } from 'framer-motion';
import { useNav } from '../contexts/NavigationContext';
import { useSettings } from '../contexts/SettingsContext';
import { useShouldReduceMotion } from '../hooks/useShouldReduceMotion';
import { LoadingPhrase } from '../components/LoadingPhrase';

const appIconUrl = "/pip_icon.svg";

export function Splash() {
  const { setStack } = useNav();
  const { settings } = useSettings();
  const reduce = useShouldReduceMotion();
  const isPresent = useIsPresent();

  useEffect(() => {
    if (!isPresent) return;
    const timer = window.setTimeout(() => {
      setStack([settings.onboarded ? 'home' : 'onboarding'], 0);
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [setStack, settings.onboarded, isPresent]);

  return (
    <main className="flex h-full flex-col items-center justify-center bg-canvas px-8 text-center">
      <motion.img
        src={appIconUrl}
        alt="Pip app icon"
        width={128}
        height={128}
        className="h-32 w-32"
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={reduce ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} />
      
      <h1 className="mt-6 font-display text-[48px] font-bold leading-none text-ink">Pip</h1>
      <LoadingPhrase className="mt-5 text-body font-bold text-ink-soft" />
    </main>);

}