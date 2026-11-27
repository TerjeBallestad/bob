import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger' | 'danger-ghost' | 'text';
export type ButtonSize = 'sm' | 'md';

// Whole class names, so Tailwind finds them when it scans this file.
const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  accent: 'btn-accent',
  danger: 'btn-danger',
  'danger-ghost': 'btn-danger-ghost',
  text: 'btn-text',
};
const SIZE_CLASS: Record<ButtonSize, string> = { sm: 'btn-sm', md: 'btn-md' };

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** `text` reads as text: no border, fill or padding; it takes its font and colour from its parent or `className`. */
  variant?: ButtonVariant;
  /** Font size and padding. `text` has neither, so it ignores `size`. */
  size?: ButtonSize;
}

export function Button({ variant = 'primary', size = 'md', className, children, type, ...rest }: ButtonProps) {
  const text = variant === 'text';
  const cls = ['btn', !text && SIZE_CLASS[size], VARIANT_CLASS[variant], className].filter(Boolean).join(' ');
  // A text button sits in rows and bars, often inside a form: it never submits one unless the
  // app says type="submit". The other variants keep the native default.
  return (
    <button className={cls} type={type ?? (text ? 'button' : undefined)} {...rest}>
      {children}
    </button>
  );
}
