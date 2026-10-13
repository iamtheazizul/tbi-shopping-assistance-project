import React from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { useNav } from '../../contexts/NavigationContext';
import { useTrip } from '../../contexts/TripContext';
import { useLine } from '../../hooks/usePersonality';
import { ScreenLayout } from '../../components/ScreenLayout';
import { Pip } from '../../components/Pip';
import { Card } from '../../components/ui/Card';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

export function Lists() {
  const nav = useNav();
  const { lists, createList, setActiveListId } = useTrip();
  const emptyLine = useLine('emptyLists');

  return (
    <ScreenLayout
      title="Lists"
      footer={
      <PrimaryButton
        onClick={() => {
          createList();
          nav.push('listDetail');
        }}>
        
          New list
        </PrimaryButton>
      }>
      
      {lists.length === 0 ?
      <div className="mt-10 flex flex-col items-center text-center">
          <Pip mood="sleepy" size={100} />
          <p className="mt-5 max-w-[17rem] text-body text-ink">{emptyLine}</p>
        </div> :

      <ul className="flex flex-col gap-4">
          {lists.map((list) =>
        <li key={list.id}>
              <Card
            onClick={() => {
              setActiveListId(list.id);
              nav.push('listDetail');
            }}
            className="flex min-h-[88px] items-center gap-4 p-5">
            
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lead font-semibold text-ink">{list.name}</span>
                  <span className="block text-body text-ink-soft">
                    {list.items.length} {list.items.length === 1 ? 'item' : 'items'}
                  </span>
                </span>
                <ChevronRightIcon aria-hidden size={28} strokeWidth={2.5} className="shrink-0 text-ink" />
              </Card>
            </li>
        )}
        </ul>
      }
    </ScreenLayout>);

}