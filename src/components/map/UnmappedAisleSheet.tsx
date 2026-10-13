import React from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';

interface UnmappedAisleSheetProps {
  aisle: number | null;
  onClose: () => void;
  onAddPhoto: () => void;
}

export function UnmappedAisleSheet({ aisle, onClose, onAddPhoto }: UnmappedAisleSheetProps) {
  return (
    <BottomSheet open={aisle !== null} onClose={onClose} titleId="unmapped-sheet-title">
      <h2 id="unmapped-sheet-title" className="font-display text-item font-semibold text-ink">
        No photo of aisle {aisle} yet. Want to add one?
      </h2>
      <div className="mt-6 flex flex-col gap-4">
        <PrimaryButton onClick={onAddPhoto}>Add a photo</PrimaryButton>
        <SecondaryButton onClick={onClose}>Not now</SecondaryButton>
      </div>
    </BottomSheet>);

}