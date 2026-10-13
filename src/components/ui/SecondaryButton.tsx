import React from 'react';

type SecondaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function SecondaryButton({ className = '', type = 'button', children, ...rest }: SecondaryButtonProps) {
  return (
    <button
      type={type}
      className={`flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-line bg-card px-6 text-body font-extrabold text-ink shadow-[0_4px_0_rgb(var(--c-line))] transition-[transform,box-shadow,background-color] duration-100 ease-out hover:bg-primary-soft active:translate-y-[4px] active:shadow-none ${className}`}
      {...rest}>
      
      {children}
    </button>);

}