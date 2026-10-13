import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

const base = 'rounded-3xl border-2 border-line bg-card';

export function Card({ children, className = '', onClick, ariaLabel }: CardProps) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={`${base} w-full text-left shadow-[0_4px_0_rgb(var(--c-line))] transition-[transform,box-shadow,background-color] duration-100 ease-out hover:bg-primary-soft active:translate-y-[4px] active:shadow-none ${className}`}>
        
        {children}
      </button>);

  }
  return <div className={`${base} ${className}`}>{children}</div>;
}