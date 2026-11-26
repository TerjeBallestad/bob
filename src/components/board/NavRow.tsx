import React from 'react';

export interface NavRowProps {
  label?: React.ReactNode;
  count?: number | null;
  active?: boolean;
  dot?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function NavRow({ label, count, active = false, dot, onClick, style }: NavRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={active ? 'nav-row nav-row-active' : 'nav-row'}
      style={style}
    >
      {dot}
      <span className="nav-row-label">{label}</span>
      {count != null && <span className="nav-row-count">{count}</span>}
    </button>
  );
}
