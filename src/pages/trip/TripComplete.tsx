import React, { useEffect, useState } from 'react';
import { useNav } from '../../contexts/NavigationContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { useTrip } from '../../contexts/TripContext';
import { stockLevels } from '../../data/stockReports';
import { ScreenLayout } from '../../components/ScreenLayout';
import { Pip } from '../../components/Pip';
import { Chip } from '../../components/ui/Chip';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { TextLink } from '../../components/ui/TextLink';
import { tripCompleteLine } from '../../data/copy';
import { usePersonality, useShowPip } from '../../hooks/usePersonality';
import { useSounds } from '../../hooks/useSounds';
import type { StockLevel } from '../../data/stockReports';

type Answer = 'none' | 'yes' | 'notQuite';

export function TripComplete() {
  const nav = useNav();
  const { settings } = useSettings();
  const { showToast } = useToast();
  const { trip } = useTrip();
  const personality = usePersonality();
  const showPip = useShowPip();
  const { jingle } = useSounds();
  const [answer, setAnswer] = useState<Answer>('none');
  const [wrong, setWrong] = useState<string[]>([]);
  const [stock, setStock] = useState<Record<string, StockLevel>>({});

  const foundItems = trip.items.filter((_, i) => trip.results[i] === 'found');
  const [headline] = useState(() => tripCompleteLine(personality, foundItems.length, trip.items.length));

  useEffect(() => {
    jingle();
    // Play once when the screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const showStock = settings.askStock && foundItems.length > 0;
  const hasStockAnswers = Object.keys(stock).length > 0;

  const toggleWrong = (name: string) =>
  setWrong((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);

  const toggleStock = (name: string, level: StockLevel) =>
  setStock((prev) => {
    const next = { ...prev };
    if (next[name] === level) delete next[name];else
    next[name] = level;
    return next;
  });

  const leave = () => nav.setStack(['home'], -1);

  const send = () => {
    if (hasStockAnswers) showToast('Thanks. You just helped the next shopper.');else
    if (answer === 'yes') showToast('Thanks. Good to know.');else
    if (answer === 'notQuite' && wrong.length > 0) showToast("Thanks. I'll fix the map.");
    leave();
  };

  return (
    <ScreenLayout
      focus
      onBack={send}
      footer={
      showStock ?
      <>
            <PrimaryButton onClick={send}>Send</PrimaryButton>
            <TextLink onClick={leave} className="min-h-[56px] w-full no-underline">
              Skip
            </TextLink>
          </> :

      <PrimaryButton onClick={send}>Back home</PrimaryButton>

      }>
      
      {showPip &&
      <div className="mb-6 flex justify-center rounded-[32px] bg-sunny pb-6 pt-9">
          <Pip mood="celebrating" size={120} bounce />
        </div>
      }
      <h1 className="font-display text-title font-semibold text-ink">{headline}</h1>

      {foundItems.length > 0 &&
      <section aria-labelledby="feedback-heading" className="mt-8">
          <h2 id="feedback-heading" className="text-body font-extrabold text-ink">
            Was everything where I said?
          </h2>
          <p className="text-helper text-ink-soft">Optional</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip label="Yes" selected={answer === 'yes'} onClick={() => setAnswer('yes')} />
            <Chip label="Not quite" selected={answer === 'notQuite'} onClick={() => setAnswer('notQuite')} />
          </div>

          {answer === 'notQuite' &&
        <div className="mt-6">
              <p className="text-body text-ink">Tap the items that were somewhere else.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {foundItems.map((item) =>
            <Chip
              key={item.name}
              label={item.name}
              selected={wrong.includes(item.name)}
              onClick={() => toggleWrong(item.name)} />

            )}
              </div>
            </div>
        }
        </section>
      }

      {showStock &&
      <section aria-labelledby="stock-heading" className="mt-10">
          <h2 id="stock-heading" className="text-body font-extrabold text-ink">
            Help the next shopper (optional)
          </h2>
          <p className="text-helper text-ink-soft">How much was left on the shelf?</p>
          <ul className="mt-4 flex flex-col gap-5">
            {foundItems.map((item) =>
          <li key={item.name}>
                <p className="text-body font-bold text-ink">{item.name}</p>
                <div role="group" aria-label={`How much ${item.name} was left`} className="mt-2 flex flex-wrap gap-2">
                  {stockLevels.map((level) =>
              <Chip
                key={level.value}
                size="small"
                label={level.label}
                selected={stock[item.name] === level.value}
                onClick={() => toggleStock(item.name, level.value)} />

              )}
                </div>
              </li>
          )}
          </ul>
        </section>
      }
    </ScreenLayout>);

}