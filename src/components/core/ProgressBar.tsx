import React from 'react';

export interface ProgressBarProps {
  value?: number;
  max?: number;
  width?: number | string;
  height?: number;
  color?: string;
  style?: React.CSSProperties;
}

export function ProgressBar({
  value = 0,
  max = 1,
  width = 120,
  height = 4,
  color = 'var(--accent)',
  style,
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <span className="progress" style={{ width, height, ...style }}>
      <span className="progress-fill" style={{ width: pct + '%', background: color }} />
    </span>
  );
}
