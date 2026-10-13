import React from 'react';
import { motion, useDragControls } from 'framer-motion';
import { useLine, usePersonality } from '../../hooks/usePersonality';
import { useSignResult } from '../../hooks/useSignResult';
import { confidenceLine } from '../../data/signPhotos';
import { signCategories } from '../../utils/signGeometry';
import { easeOut } from '../../utils/motion';
import { PipSays } from '../PipSays';
import { Chip } from '../ui/Chip';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { AisleField } from './AisleField';
import { EditableChipList } from './EditableChipList';
import type { SignCell, SignPhoto } from '../../types/sign';

interface ResultsSheetProps {
  photo: SignPhoto;
  cells: SignCell[];
  signsInBox: number[];
  onAdjust: () => void;
  onRetake: () => void;
  onTryAnother: () => void;
  onSave: (aisles: number[], categories: string[]) => void;
}

export function ResultsSheet({ photo, cells, signsInBox, onAdjust, onRetake, onTryAnother, onSave }: ResultsSheetProps) {
  const controls = useDragControls();
  const personality = usePersonality();
  const noWordsLine = useLine('noWordsInBox');
  const result = useSignResult(photo, signsInBox);
  const noWords = cells.length === 0;
  const askingNumber = photo.outcome === 'noNumber';

  return (
    <motion.section
      role="dialog"
      aria-labelledby="results-title"
      className="absolute inset-x-0 bottom-0 z-30 flex max-h-[58%] flex-col rounded-t-[28px] border-t-2 border-line bg-card"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.28, ease: easeOut }}
      drag="y"
      dragControls={controls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.7 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 90 || info.velocity.y > 500) onAdjust();
      }}>
      
      <button
        type="button"
        aria-label="Close results and go back to adjusting the box"
        onPointerDown={(e) => controls.start(e)}
        onClick={(e) => {
          if (e.detail === 0) onAdjust();
        }}
        className="flex h-9 w-full shrink-0 cursor-grab touch-none items-center justify-center pt-2">
        
        <span className="h-1.5 w-12 rounded-full bg-line" />
      </button>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
        <PipSays mood={noWords ? 'confused' : photo.mood} size={48}>
          <h2 id="results-title">{noWords ? noWordsLine : photo.message[personality]}</h2>
        </PipSays>

        {noWords &&
        <div className="mt-5 flex flex-col gap-4">
            <PrimaryButton onClick={onAdjust}>Adjust the box</PrimaryButton>
            <SecondaryButton onClick={onRetake}>Retake</SecondaryButton>
          </div>
        }

        {!noWords && photo.outcome === 'unreadable' && !result.manual &&
        <div className="mt-5 flex flex-col gap-4">
            <PrimaryButton onClick={onTryAnother}>Try another photo</PrimaryButton>
            <SecondaryButton onClick={result.startManual}>Type it in myself</SecondaryButton>
          </div>
        }

        {!noWords && photo.outcome === 'question' &&
        <div className="mt-4">
            <p className="text-body font-bold text-ink">Does 'Breads/Crumbs' mean bread AND crumbs, or bread crumbs?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip label="Bread and crumbs" selected={result.answer === 'and'} onClick={() => result.answerQuestion('and')} />
              <Chip label="Bread crumbs" selected={result.answer === 'crumbs'} onClick={() => result.answerQuestion('crumbs')} />
            </div>
          </div>
        }

        {!noWords && photo.outcome === 'multi' &&
        <div role="radiogroup" aria-label="Which sign are you adding?" className="mt-4 grid grid-cols-3 gap-2">
            {photo.signs.map((sign, i) =>
          <SignChoice
            key={i}
            title={`Aisle ${sign.aisle}`}
            detail={signCategories(sign).slice(0, 2).join(', ')}
            selected={result.selected.length === 1 && result.selected[0] === i}
            onSelect={() => result.chooseSigns([i])} />

          )}
            <SignChoice
            title="Both"
            detail="Add two aisles"
            selected={result.selected.length === photo.signs.length}
            onSelect={() => result.chooseSigns(photo.signs.map((_, i) => i))} />
          
          </div>
        }

        {!noWords && result.showFields &&
        <div className="mt-6 flex flex-col gap-6">
            {result.aisles.map((aisle, i) =>
          <AisleField
            key={`${result.selected.join('-')}-${i}`}
            label={result.aisles.length > 1 ? `Sign ${i + 1}` : 'Aisle number'}
            value={aisle}
            startEditing={askingNumber || result.manual}
            onChange={(value) => result.setAisle(i, value)} />

          )}

            <div>
              <p className="text-helper font-bold text-ink-soft">Categories</p>
              <div className="mt-2">
                <EditableChipList label="Categories" items={result.categories} onChange={result.setCategories} />
              </div>
            </div>

            <div>
              <p className="text-helper font-bold text-ink-soft">Stuff you'll probably find here</p>
              <div className="mt-2">
                <EditableChipList label="Items" items={result.guesses} onChange={result.setGuesses} />
              </div>
            </div>

            {!result.manual &&
          <p className="flex items-center gap-2 text-helper font-bold text-ink-soft">
                <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary-edge" />
                {confidenceLine[photo.confidence]}
              </p>
          }
          </div>
        }
      </div>

      {!noWords && result.showFields &&
      <div className="flex shrink-0 flex-col gap-4 border-t-2 border-line px-5 pb-8 pt-4">
          <PrimaryButton
          disabled={!result.canSave}
          onClick={() =>
          onSave(
            result.aisles.filter((a): a is number => a !== null),
            result.categories.filter((c) => c.trim() !== '')
          )
          }>
          
            Save to map
          </PrimaryButton>
          <SecondaryButton onClick={onRetake}>Retake</SecondaryButton>
        </div>
      }
    </motion.section>);

}

interface SignChoiceProps {
  title: string;
  detail: string;
  selected: boolean;
  onSelect: () => void;
}

function SignChoice({ title, detail, selected, onSelect }: SignChoiceProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex min-h-[96px] flex-col items-start rounded-2xl border-2 p-3 text-left transition-[transform,box-shadow,background-color,border-color] duration-100 ease-out active:translate-y-[3px] active:shadow-none ${
      selected ?
      'border-primary-edge bg-primary-soft shadow-[0_3px_0_rgb(var(--c-primary-edge))]' :
      'border-line bg-card shadow-[0_3px_0_rgb(var(--c-line))]'}`
      }>
      
      <span className="font-display text-lead font-semibold text-ink">{title}</span>
      <span className="mt-1 text-[14px] font-bold leading-snug text-ink-soft">{detail}</span>
    </button>);

}