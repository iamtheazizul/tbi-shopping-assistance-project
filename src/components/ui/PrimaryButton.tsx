import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'default' | 'large';
}

export function PrimaryButton({ size = 'default', className = '', type = 'button', children, ...rest }: PrimaryButtonProps) {
  const sizing = size === 'large' ? 'min-h-[68px] text-lead' : 'min-h-[56px] text-body';
  return (
    <button
      type={type}
      className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 font-extrabold text-on-primary shadow-[0_4px_0_rgb(var(--c-primary-edge))] transition-[transform,box-shadow,background-color] duration-100 ease-out active:translate-y-[4px] active:shadow-none disabled:bg-line disabled:text-ink-soft disabled:shadow-none disabled:active:translate-y-0 ${sizing} ${className}`}
      {...rest}>
      
      {children}
    </button>);

}