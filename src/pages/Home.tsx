import React from 'react';
import { useNav } from '../contexts/NavigationContext';
import { useTrip } from '../contexts/TripContext';
import { useLine, useShowPip } from '../hooks/usePersonality';
import { ScreenLayout } from '../components/ScreenLayout';
import { Pip } from '../components/Pip';
import { Card } from '../components/ui/Card';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';

export function Home() {
  const nav = useNav();
  const { lists, createList, setActiveListId } = useTrip();
  const greeting = useLine('homeGreeting');
  const sub = useLine('homeSub');
  const emptyLine = useLine('emptyLists');
  const showPip = useShowPip();
  const recent = lists[0];

  const startTrip = () => {
    createList();
    nav.push('listDetail');
  };

  return (
    <ScreenLayout
      title={greeting}
      leading={recent && showPip ? <Pip mood="happy" size={48} decorative className="shrink-0" /> : undefined}>
      
      <p className="text-lead text-ink">{sub}</p>
      <PrimaryButton size="large" className="mt-6" onClick={startTrip}>
        Start a shopping trip
      </PrimaryButton>

      {recent ?
      <section aria-labelledby="recent-list" className="mt-10">
          <p className="text-helper font-bold text-ink-soft">Your last list</p>
          <Card className="mt-3 p-5">
            <h2 id="recent-list" className="font-display text-lead font-semibold text-ink">
              {recent.name}, {recent.items.length} {recent.items.length === 1 ? 'item' : 'items'}
            </h2>
            {recent.items.length > 0 &&
          <p className="mt-1 line-clamp-2 text-body text-ink-soft">{recent.items.join(', ')}</p>
          }
            <SecondaryButton
            className="mt-5"
            disabled={recent.items.length === 0}
            onClick={() => {
              setActiveListId(recent.id);
              nav.push('chooseStore');
            }}>
            
              Use this list
            </SecondaryButton>
          </Card>
        </section> :

      <div className="mt-14 flex flex-col items-center text-center">
          <Pip mood="sleepy" size={100} />
          <p className="mt-5 max-w-[17rem] text-body text-ink">{emptyLine}</p>
        </div>
      }
    </ScreenLayout>);

}