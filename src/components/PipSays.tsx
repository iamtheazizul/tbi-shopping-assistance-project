import React from 'react';
import { useShowPip } from '../hooks/usePersonality';
import { Pip } from './Pip';
import type { PipMood } from '../types/app';

interface PipSaysProps {
  mood?: PipMood;
  size?: number;
  children: React.ReactNode;
  className?: string;
}

export function PipSays({ mood = 'happy', size = 52, children, className = '' }: PipSaysProps) {
  const showPip = useShowPip();

  return (
    <div className={`flex items-end gap-3 ${className}`}>
      {showPip && <Pip mood={mood} size={size} decorative className="shrink-0" />}
      <div
        className={`min-w-0 flex-1 rounded-3xl border-2 border-line bg-card px-4 py-3 text-body font-bold text-ink ${
        showPip ? 'rounded-bl-md' : ''}`
        }>
        
        {children}
      </div>
    </div>);

}