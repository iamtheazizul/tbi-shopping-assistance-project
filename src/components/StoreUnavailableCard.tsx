import React from 'react';

export function StoreUnavailableCard() {
  return (
    <div
      aria-disabled="true"
      className="flex min-h-[80px] w-full items-center rounded-3xl border-2 border-dashed border-line p-5">
      
      <span className="text-body font-bold text-ink-soft">More stores coming soon</span>
    </div>);

}