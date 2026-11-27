import React from 'react';

// A grid for state stories: one row per item, one column per state. Each cell has an id
// (<row>-<state>), so a story's `pseudo` parameter (storybook-addon-pseudo-states) can force
// :hover or :focus-visible on the control in one cell.
export const STATE_LABEL: React.CSSProperties = { fontSize: 10.5, color: 'var(--text-secondary)', fontFamily: 'var(--sans)' };

export function StateGrid({
  states,
  rows,
  cell,
  width = 'auto',
}: {
  states: readonly string[];
  rows: readonly string[];
  cell: (row: string, state: string) => React.ReactNode;
  width?: number | string;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `90px repeat(${states.length}, ${typeof width === 'number' ? width + 'px' : width})`,
        gap: '12px 14px',
        alignItems: 'center',
      }}
    >
      <span />
      {states.map((s) => (
        <span key={s} style={STATE_LABEL}>
          {s}
        </span>
      ))}
      {rows.map((r) => (
        <React.Fragment key={r}>
          <span style={STATE_LABEL}>{r}</span>
          {states.map((s) => (
            <div key={s} id={`${r}-${s}`}>
              {cell(r, s)}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

/** Selectors for every cell of one state column, for the `pseudo` parameter. */
export const cells = (rows: readonly string[], state: string) => rows.map((r) => `#${r}-${state} > *`);
