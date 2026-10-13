import React from 'react';
import { useNav } from '../../contexts/NavigationContext';
import { useSign } from '../../contexts/SignContext';
import { useLine, usePersonality, useShowPip } from '../../hooks/usePersonality';
import { useShouldReduceMotion } from '../../hooks/useShouldReduceMotion';
import { savedTitle } from '../../data/copy';
import { Pip } from '../../components/Pip';
import { Confetti } from '../../components/sign/Confetti';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SecondaryButton } from '../../components/ui/SecondaryButton';

export function SignSaved() {
  const nav = useNav();
  const { lastSaved, signsAdded, reset, storeId, openMap } = useSign();
  const personality = usePersonality();
  const showPip = useShowPip();
  const reduce = useShouldReduceMotion();
  const sub = useLine('savedSub');

  return (
    <div className="flex h-full flex-col bg-canvas">
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 pt-12 text-center">
        {showPip &&
        <div className="relative">
            <Pip mood="celebrating" size={140} bounce />
            {!reduce && <Confetti />}
          </div>
        }
        <h1 className="mt-6 font-display text-title font-semibold text-ink">
          {savedTitle(personality, lastSaved.length ? lastSaved : [0])}
        </h1>
        <p className="mt-2 text-lead text-ink">{sub}</p>
        <p className="mt-6 rounded-full bg-primary-soft px-4 py-2 text-helper font-bold text-ink">
          Signs you've added: {signsAdded}
        </p>
      </main>
      <div className="flex shrink-0 flex-col gap-4 px-5 pb-9 pt-4">
        <PrimaryButton
          onClick={() => {
            reset();
            nav.setStack(['signStore', 'signCapture'], 1);
          }}>
          
          Add another sign
        </PrimaryButton>
        <SecondaryButton
          onClick={() => {
            if (storeId) openMap(storeId, lastSaved);
            nav.push('storeMap');
          }}>
          
          See the map
        </SecondaryButton>
        <SecondaryButton
          onClick={() => {
            reset();
            nav.setStack(['home'], 0);
          }}>
          
          Done
        </SecondaryButton>
      </div>
    </div>);

}