import React from 'react';

type TextLinkProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function TextLink({ className = '', type = 'button', children, ...rest }: TextLinkProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-[48px] items-center justify-center px-2 text-body font-extrabold text-ink underline decoration-primary-edge decoration-2 underline-offset-4 transition-colors duration-150 ease-out hover:decoration-ink ${className}`}
      {...rest}>
      
      {children}
    </button>);

}