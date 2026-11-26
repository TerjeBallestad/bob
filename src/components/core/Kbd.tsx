import React from 'react';

export interface KbdProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Kbd({ children, style }: KbdProps) {
  return (
    <kbd className="kbd" style={style}>
      {children}
    </kbd>
  );
}
