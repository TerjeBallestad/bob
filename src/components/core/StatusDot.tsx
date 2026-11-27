import React from 'react';

/** dashed = inbox/unset · outline = in progress · staged = staged · solid = done · live = pulsing agent */
export type StatusDotState = 'dashed' | 'outline' | 'staged' | 'live' | 'solid';

export interface StatusDotProps {
  state?: StatusDotState;
  color?: string;
  size?: number;
  square?: boolean;
  style?: React.CSSProperties;
}

export function StatusDot({
  state = 'solid',
  color = 'var(--bg-green)',
  size = 10,
  square = false,
  style,
}: StatusDotProps) {
  // color/size/square are data-driven, so the visual props stay inline; layout and the live pulse
  // (animate-live, under motion-safe) are classes.
  const s: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: square ? 2 : '50%',
    ...style,
  };
  if (state === 'dashed') return <span className="status-dot" style={{ ...s, border: '1.5px dashed var(--gray-23)' }} />;
  if (state === 'outline') return <span className="status-dot" style={{ ...s, border: `1.5px solid ${color}` }} />;
  if (state === 'staged') {
    return (
      <span
        className="status-dot"
        style={{
          ...s,
          border: `1.5px solid ${color}`,
          background: color.startsWith('var') ? `color-mix(in srgb, ${color} 25%, transparent)` : color + '40',
        }}
      />
    );
  }
  if (state === 'live') {
    return (
      <span className="status-dot status-dot-live" style={{ ...s, background: color, boxShadow: `0 0 6px ${color}` }} />
    );
  }
  return <span className="status-dot" style={{ ...s, background: color }} />;
}
