import React from 'react';

export type ChipTone = 'neutral' | 'accent' | 'blue' | 'green' | 'orange' | 'danger' | 'yellow' | 'claim';

// Whole class names, so Tailwind finds them when it scans this file.
const TONE_CLASS: Record<ChipTone, string> = {
  neutral: 'chip-neutral',
  accent: 'chip-accent',
  blue: 'chip-blue',
  green: 'chip-green',
  orange: 'chip-orange',
  danger: 'chip-danger',
  yellow: 'chip-yellow',
  claim: 'chip-claim',
};

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: ChipTone;
  mono?: boolean;
}

export function Chip({ tone = 'neutral', mono = false, className, children, ...rest }: ChipProps) {
  const cls = ['chip', TONE_CLASS[tone], mono && 'chip-mono', className].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      {children}
    </span>
  );
}
