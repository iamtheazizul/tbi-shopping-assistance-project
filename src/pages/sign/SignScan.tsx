import React, { useCallback, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNav } from '../../contexts/NavigationContext';
import { useSign } from '../../contexts/SignContext';
import { useLine, useShowPip } from '../../hooks/usePersonality';
import { FlowHeader } from '../../components/sign/FlowHeader';
import { ScanStage } from '../../components/sign/ScanStage';
import { ResultsSheet } from '../../components/sign/ResultsSheet';
import { PipSays } from '../../components/PipSays';
import { Pip } from '../../components/Pip';
import { LoadingPhrase } from '../../components/LoadingPhrase';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SecondaryButton } from '../../components/ui/SecondaryButton';
import { centerInside, paddedUnion, signCells } from '../../utils/signGeometry';
import type { ScanPhase } from '../../components/sign/ScanStage';
import type { SignPhoto } from '../../types/sign';

const titles: Record<ScanPhase, string> = {
  adjust: 'Adjust the box',
  reading: 'Reading...',
  results: 'Check it'
};

export function SignScan() {
  const { photo } = useSign();
  return photo ? <ScanFlow key={photo.id} photo={photo} /> : null;
}

function ScanFlow({ photo }: {photo: SignPhoto;}) {
  const nav = useNav();
  const { save } = useSign();
  const showPip = useShowPip();
  const adjustLine = useLine('adjustBox');

  const allCells = useMemo(() => signCells(photo), [photo]);
  const [box, setBox] = useState(() => paddedUnion(photo.signs.map((s) => s.box)));
  const [readBox, setReadBox] = useState(box);
  const [phase, setPhase] = useState<ScanPhase>('adjust');

  const cells = useMemo(() => allCells.filter((c) => centerInside(c.box, readBox)), [allCells, readBox]);
  const signsInBox = useMemo(() => Array.from(new Set(cells.map((c) => c.signIndex))), [cells]);
  const onReadDone = useCallback(() => setPhase('results'), []);

  const exit = () => nav.setStack(['signStore'], -1);
  const read = () => {
    setReadBox(box);
    setPhase('reading');
  };

  return (
    <div className="relative flex h-full flex-col bg-canvas">
      <FlowHeader title={titles[phase]} onClose={exit} />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 pb-6">
        <ScanStage
          photo={photo}
          phase={phase}
          box={phase === 'adjust' ? box : readBox}
          onBoxChange={setBox}
          cells={cells}
          signsInBox={signsInBox}
          onReadDone={onReadDone} />
        

        {phase === 'adjust' &&
        <PipSays mood="happy" className="mt-5">
            {adjustLine}
          </PipSays>
        }

        {phase === 'reading' &&
        <div className="mt-4 flex items-center gap-3">
            {showPip && <Pip mood="squinting" size={56} decorative className="shrink-0" />}
            <LoadingPhrase lineKey="signReading" className="text-body font-bold text-ink" />
          </div>
        }
      </main>

      {phase === 'adjust' &&
      <div className="flex shrink-0 flex-col gap-4 border-t-2 border-line bg-canvas px-5 pb-9 pt-4">
          <PrimaryButton onClick={read}>Read it</PrimaryButton>
          <SecondaryButton onClick={nav.back}>Retake</SecondaryButton>
        </div>
      }

      <AnimatePresence>
        {phase === 'results' &&
        <ResultsSheet
          key={`results-${readBox.x}-${readBox.y}-${readBox.w}-${readBox.h}`}
          photo={photo}
          cells={cells}
          signsInBox={signsInBox}
          onAdjust={() => setPhase('adjust')}
          onRetake={nav.back}
          onTryAnother={() => nav.setStack(['signStore', 'signCapture', 'signRoll'], -1)}
          onSave={(aisles, categories) => {
            save(aisles, categories);
            nav.setStack(['signStore', 'signSaved'], 1);
          }} />

        }
      </AnimatePresence>
    </div>);

}