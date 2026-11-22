import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger' | 'danger-ghost';
export type ButtonSize = 'sm' | 'md';

// Whole class names, so Tailwind finds them when it scans this file.
const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  accent: 'btn-accent',
  danger: 'btn-danger',
  'danger-ghost': 'btn-danger-ghost',
};
const SIZE_CLASS: Record<ButtonSize, string> = { sm: 'btn-sm', md: 'btn-md' };

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: ButtonProps) {
  const cls = ['btn', SIZE_CLASS[size], VARIANT_CLASS[variant], className].filter(Boolean).join(' ');
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
