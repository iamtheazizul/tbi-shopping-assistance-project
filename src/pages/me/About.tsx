import React from 'react';
import { useNav } from '../../contexts/NavigationContext';
import { ScreenLayout } from '../../components/ScreenLayout';
import { Pip } from '../../components/Pip';
import { useShowPip } from '../../hooks/usePersonality';

export function About() {
  const nav = useNav();
  const showPip = useShowPip();

  return (
    <ScreenLayout title="About Pip" onBack={nav.back}>
      {showPip && <Pip size={88} />}
      <div className="mt-6 space-y-5 text-body text-ink">
        <p>Pip helps people recovering from a brain injury shop for groceries on their own.</p>
        <p>
          It started with Ross, a TBI survivor. In rehab, his therapist gave him a paper store map and a list, and asked
          him to plan the fastest route. He found everything except tinfoil. Nobody told him it lives with the paper
          goods.
        </p>
        <p>Pip is that paper map, made easier. You make a list at home, and Pip shows you one item at a time.</p>
        <p>
          Store maps come from shoppers who take photos of aisle signs. Every photo makes the map better for the next
          person.
        </p>
      </div>
      <p className="mt-8 text-helper text-ink-soft">
        Made by a team of five for Hannaford in West Lebanon and the Hanover Co-op. Version 0.2
      </p>
    </ScreenLayout>);

}