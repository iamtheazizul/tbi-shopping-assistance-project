import React, { useEffect, useState } from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { TextLink } from '../ui/TextLink';
import type { MappedAisle } from '../../data/storeMaps';

type Problem = 'moved' | 'categories';

interface MappedAisleSheetProps {
  aisle: number | null;
  info: MappedAisle | null;
  onClose: () => void;
  onReport: (aisle: number, problem: Problem) => void;
}

export function MappedAisleSheet({ aisle, info, onClose, onReport }: MappedAisleSheetProps) {
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    if (aisle !== null) setReporting(false);
  }, [aisle]);

  return (
    <BottomSheet open={aisle !== null && info !== null} onClose={onClose} titleId="aisle-sheet-title">
      {aisle !== null && info && !reporting &&
      <>
          <h2 id="aisle-sheet-title" className="font-display text-item font-semibold text-ink">
            Aisle {aisle}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {info.categories.map((c) =>
          <li key={c} className="rounded-full bg-primary-soft px-4 py-2 text-body font-bold text-ink">
                {c}
              </li>
          )}
          </ul>
          <p className="mt-4 text-helper text-ink-soft">Last updated {info.updated}</p>
          <div className="mt-6 flex flex-col gap-4">
            <PrimaryButton onClick={onClose}>Close</PrimaryButton>
            <TextLink onClick={() => setReporting(true)} className="min-h-[48px] w-full">
              Something's wrong
            </TextLink>
          </div>
        </>
      }
      {aisle !== null && info && reporting &&
      <>
          <h2 id="aisle-sheet-title" className="font-display text-item font-semibold text-ink">
            What's off with aisle {aisle}?
          </h2>
          <div className="mt-6 flex flex-col gap-4">
            <SecondaryButton onClick={() => onReport(aisle, 'moved')}>The aisle moved</SecondaryButton>
            <SecondaryButton onClick={() => onReport(aisle, 'categories')}>The categories are off</SecondaryButton>
            <TextLink onClick={() => setReporting(false)} className="min-h-[48px] w-full">
              Never mind
            </TextLink>
          </div>
        </>
      }
    </BottomSheet>);

}