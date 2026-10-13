import React from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { endTripLine } from '../../data/copy';
import { usePersonality } from '../../hooks/usePersonality';

interface EndTripSheetProps {
  open: boolean;
  foundCount: number;
  total: number;
  onClose: () => void;
  onEnd: () => void;
}

export function EndTripSheet({ open, foundCount, total, onClose, onEnd }: EndTripSheetProps) {
  const personality = usePersonality();

  return (
    <BottomSheet open={open} onClose={onClose} titleId="end-trip-title">
      <h2 id="end-trip-title" className="font-display text-item font-semibold text-ink">
        {endTripLine(personality, foundCount, total)}
      </h2>
      <div className="mt-6 flex flex-col gap-4">
        <PrimaryButton onClick={onClose}>Keep going</PrimaryButton>
        <SecondaryButton onClick={onEnd}>End trip</SecondaryButton>
      </div>
    </BottomSheet>);

}