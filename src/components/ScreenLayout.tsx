import React from 'react';
import { BackButton } from './BackButton';
import { ToastSlot } from './ui/ToastSlot';

interface ScreenLayoutProps {
  title?: string;
  onBack?: () => void;
  leading?: React.ReactNode;
  right?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  bodyClassName?: string;
  focus?: boolean;
}

export function ScreenLayout({
  title,
  onBack,
  leading,
  right,
  footer,
  children,
  bodyClassName = '',
  focus = false
}: ScreenLayoutProps) {
  const titleRow = (leading || title) &&
  <div className="flex min-w-0 flex-1 items-center gap-3">
      {leading}
      {title && <h1 className="min-w-0 font-display text-title font-semibold text-ink">{title}</h1>}
    </div>;


  return (
    <div className="flex h-full flex-col bg-canvas">
      <header className="shrink-0 px-5 pb-3 pt-12">
        {onBack ?
        <>
            <div className="flex min-h-[48px] items-center justify-between gap-3">
              <BackButton onClick={onBack} />
              {right}
            </div>
            {titleRow && <div className="mt-2 flex">{titleRow}</div>}
          </> :

        <div className="flex min-h-[48px] items-center gap-3">
            {titleRow ?? <div className="flex-1" />}
            {right}
          </div>
        }
      </header>
      <ToastSlot />
      <main className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 pb-6 ${bodyClassName}`}>{children}</main>
      {footer &&
      <div className={`flex shrink-0 flex-col gap-4 border-t-2 border-line bg-canvas px-5 pt-4 ${focus ? 'pb-9' : 'pb-5'}`}>
          {footer}
        </div>
      }
    </div>);

}