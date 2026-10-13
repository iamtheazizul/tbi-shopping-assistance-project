import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useShowPip } from '../hooks/usePersonality';
import { Pip } from './Pip';

interface PipTipProps {
  children: React.ReactNode;
  className?: string;
}

export function PipTip({ children, className = '' }: PipTipProps) {
  const { settings } = useSettings();
  const showPip = useShowPip() && settings.pipTips;

  return (
    <div className={`flex items-start gap-3 rounded-2xl bg-primary-soft p-4 ${className}`}>
      {showPip && <Pip size={30} decorative className="mt-0.5 shrink-0" />}
      <p className="text-body text-ink">{children}</p>
    </div>);

}