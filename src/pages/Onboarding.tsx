import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ListIcon, MapIcon } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { useNav } from '../contexts/NavigationContext';
import { useSettings } from '../contexts/SettingsContext';
import { useShouldReduceMotion } from '../hooks/useShouldReduceMotion';
import { Pip } from '../components/Pip';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { TextLink } from '../components/ui/TextLink';
import { OptionCard } from '../components/ui/OptionCard';
import { Card } from '../components/ui/Card';
import { cardVariants, motionTransition } from '../utils/motion';
import type { MotionCustom } from '../types/app';

const stepCount = 3;

export function Onboarding() {
  const nav = useNav();
  const { settings, updateSettings } = useSettings();
  const reduce = useShouldReduceMotion();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const custom: MotionCustom = { direction, reduce };

  const finish = () => {
    updateSettings({ onboarded: true });
    nav.setStack(['home'], 1);
  };

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  return (
    <div className="flex h-full flex-col bg-canvas">
      <header className="flex min-h-[112px] shrink-0 items-center justify-between px-5 pb-3 pt-12">
        {step > 0 ?
        <BackButton onClick={() => go(step - 1)} /> :

        <span />
        }
        <TextLink onClick={finish} className="no-underline">
          Skip
        </TextLink>
      </header>

      <main className="relative grid min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5">
        <AnimatePresence initial={false} custom={custom}>
          <motion.section
            key={step}
            custom={custom}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={motionTransition(reduce)}
            className="[grid-area:1/1]"
            aria-live="polite">
            
            {step === 0 &&
            <div className="pt-8">
                <Pip mood="excited" size={132} />
                <h1 className="mt-8 font-display text-title font-semibold text-ink">Hi, I'm Pip.</h1>
                <p className="mt-3 text-lead text-ink">I'll walk you through the store, one item at a time.</p>
              </div>
            }
            {step === 1 &&
            <div className="pt-4">
                <h1 className="font-display text-title font-semibold text-ink">How should I show directions?</h1>
                <div role="radiogroup" aria-label="Directions style" className="mt-6 flex flex-col gap-4">
                  <OptionCard
                  icon={ListIcon}
                  label="Simple list"
                  description="A big aisle number for each item."
                  selected={settings.directions === 'list'}
                  onSelect={() => updateSettings({ directions: 'list' })} />
                
                  <OptionCard
                  icon={MapIcon}
                  label="Store map"
                  description="A small map with your aisle filled in."
                  selected={settings.directions === 'map'}
                  onSelect={() => updateSettings({ directions: 'map' })} />
                
                </div>
              </div>
            }
            {step === 2 &&
            <div className="pt-4">
                <h1 className="font-display text-title font-semibold text-ink">Pick your text size.</h1>
                <div role="radiogroup" aria-label="Text size" className="mt-6 flex flex-col gap-4">
                  <OptionCard
                  label="Large"
                  selected={settings.textSize === 'large'}
                  onSelect={() => updateSettings({ textSize: 'large' })} />
                
                  <OptionCard
                  label="Extra large"
                  selected={settings.textSize === 'xlarge'}
                  onSelect={() => updateSettings({ textSize: 'xlarge' })} />
                
                </div>
                <Card className="mt-6 p-5">
                  <p className="text-helper font-bold text-ink-soft">Preview</p>
                  <p className="mt-1 font-display text-area font-bold text-ink">Aisle 4</p>
                  <p className="mt-1 text-body text-ink">Chickpeas, with the canned vegetables.</p>
                </Card>
              </div>
            }
          </motion.section>
        </AnimatePresence>
      </main>

      <div className="flex shrink-0 flex-col gap-5 px-5 pb-9 pt-3">
        <div className="flex justify-center gap-2" aria-label={`Step ${step + 1} of ${stepCount}`} role="img">
          {Array.from({ length: stepCount }, (_, i) =>
          <span
            key={i}
            className={`h-2.5 rounded-full transition-[width,background-color] duration-200 ease-out ${
            i === step ? 'w-7 bg-primary-edge' : 'w-2.5 bg-line'}`
            } />

          )}
        </div>
        <PrimaryButton onClick={() => step < stepCount - 1 ? go(step + 1) : finish()}>
          {step < stepCount - 1 ? 'Next' : "Let's go"}
        </PrimaryButton>
      </div>
    </div>);

}