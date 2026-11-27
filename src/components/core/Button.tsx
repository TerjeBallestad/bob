import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger' | 'danger-ghost' | 'danger-tint' | 'text';
export type ButtonSize = 'xs' | 'sm' | 'md';

// Whole class names, so Tailwind finds them when it scans this file.
const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  accent: 'btn-accent',
  danger: 'btn-danger',
  'danger-ghost': 'btn-danger-ghost',
  'danger-tint': 'btn-danger-tint',
  text: 'btn-text',
};
const SIZE_CLASS: Record<ButtonSize, string> = { xs: 'btn-xs', sm: 'btn-sm', md: 'btn-md' };

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** `text` reads as text: no border, fill or padding; it takes its font and colour from its parent or `className`. */
  variant?: ButtonVariant;
  /** Font size and padding. `xs` is for a button inside a dense row: 10.5px, about 16px high. `text` has neither, so it ignores `size`. */
  size?: ButtonSize;
}

export function Button({ variant = 'primary', size = 'md', className, children, type, ...rest }: ButtonProps) {
  const text = variant === 'text';
  const cls = ['btn', !text && SIZE_CLASS[size], VARIANT_CLASS[variant], className].filter(Boolean).join(' ');
  // A Button never submits a form unless the app says type="submit" (1.2). The native default,
  // submit, made every Cancel in a form send it.
  return (
    <button className={cls} type={type ?? 'button'} {...rest}>
      {children}
    </button>
  );
}
