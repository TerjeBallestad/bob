import React from 'react';

export type AvatarTone = 'gold' | 'accent' | 'green' | 'neutral';

// Whole class names, so Tailwind finds them when it scans this file.
const TONE_CLASS: Record<AvatarTone, string> = {
  gold: 'avatar-gold',
  accent: 'avatar-accent',
  green: 'avatar-green',
  neutral: 'avatar-neutral',
};

export interface AvatarProps {
  initials?: string;
  tone?: AvatarTone;
  size?: number;
  style?: React.CSSProperties;
}

export function Avatar({ initials = '?', tone = 'neutral', size = 18, style }: AvatarProps) {
  return (
    <span
      className={`avatar ${TONE_CLASS[tone]}`}
      style={{
        width: size,
        height: size,
        borderRadius: size >= 24 ? 8 : '50%',
        fontSize: size >= 24 ? '11px' : '9px',
        ...style,
      }}
    >
      {initials}
    </span>
  );
}
