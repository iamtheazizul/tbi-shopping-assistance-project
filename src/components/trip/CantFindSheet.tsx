import React, { useEffect, useState } from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { cantFindHeading } from '../../data/copy';
import { usePersonality } from '../../hooks/usePersonality';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { TextLink } from '../ui/TextLink';
import type { TripItem } from '../../types/app';

interface CantFindSheetProps {
  open: boolean;
  item: TripItem;
  onClose: () => void;
  onTryFallback: () => void;
  onSkip: () => void;
  onEmpty: () => void;
  onFound: () => void;
}

export function CantFindSheet({ open, item, onClose, onTryFallback, onSkip, onEmpty, onFound }: CantFindSheetProps) {
  const [mode, setMode] = useState<'options' | 'help'>('options');
  const fallback = item.fallback;
  const personality = usePersonality();

  useEffect(() => {
    if (open) setMode('options');
  }, [open]);

  return (
    <BottomSheet open={open} onClose={onClose} titleId="cant-find-title">
      {mode === 'options' ?
      <>
          <h2 id="cant-find-title" className="font-display text-item font-semibold text-ink">
            {cantFindHeading(personality, fallback?.aisle)}
          </h2>
          <p className="mt-2 text-lead text-ink">
            {fallback ?
          personality === 'calm' ?
          `Try aisle ${fallback.aisle}, ${fallback.label}.` :
          `Look with the ${fallback.label.toLowerCase()}.` :
          'A store worker can help you find it.'}
          </p>
          <div className="mt-6 flex flex-col gap-4">
            {fallback ?
          <>
                <PrimaryButton onClick={onTryFallback}>Go to aisle {fallback.aisle}</PrimaryButton>
                <SecondaryButton onClick={onEmpty}>The spot is empty</SecondaryButton>
                <SecondaryButton onClick={onSkip}>Skip for now</SecondaryButton>
                <TextLink onClick={() => setMode('help')}>Show a help card</TextLink>
              </> :

          <>
                <PrimaryButton onClick={() => setMode('help')}>Show a help card</PrimaryButton>
                <SecondaryButton onClick={onEmpty}>The spot is empty</SecondaryButton>
                <SecondaryButton onClick={onSkip}>Skip for now</SecondaryButton>
              </>
          }
          </div>
        </> :

      <>
          <p id="cant-find-title" className="text-body font-bold text-ink-soft">
            Show this to a store worker.
          </p>
          <div className="mt-3 rounded-3xl bg-primary-soft p-6">
            <p className="font-display text-item font-semibold text-ink">
              Can you help me find {item.name.toLowerCase()}?
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            <PrimaryButton onClick={onFound}>I found it</PrimaryButton>
            <SecondaryButton onClick={() => setMode('options')}>Back</SecondaryButton>
          </div>
        </>
      }
    </BottomSheet>);

}