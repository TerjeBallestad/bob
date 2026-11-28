import React from 'react';
import { Frame } from './TokenPages';

// Each class is written whole and rendered as a class, not as an inline style, so the page shows
// what Tailwind builds from Bob's theme (src/tailwind/theme.css). .storybook/tailwind.css scans
// this file. [class, the case or family it needs, size · line height · tracking · weight, use, sample]
const STYLES = [
  ['text-micro', 'uppercase', '9.5 · normal · .05em · 700', 'kind and priority tags', 'Issue · high'],
  ['text-tiny', 'font-mono', '10.5 · normal', 'meta, counts, ages', '3/7 · 2d'],
  ['text-id', 'font-mono', '10.5 · normal · 600', 'ids and codes', 'PLAN-005'],
  ['text-label', 'uppercase', '10.5 · normal · .08em · 600', 'section labels, column heads', 'Planned'],
  ['text-caption', '', '11.5 · normal', 'one-line meta, hints', 'Updated by Ada, 2 hours ago'],
  ['text-note', '', '11.5 · 1.5', 'small text that wraps', 'Overnight ranges roll to the next day.'],
  ['text-body', '', '12.5 · normal', 'rows, cells, inputs', 'Plan the sprint'],
  ['text-subhead', '', '12.5 · normal · 600', 'a heading in a panel, a bar title', 'Plan the sprint'],
  ['text-item', '', '12.5 · normal · 500', "a row's item title, a task input", 'Plan the sprint'],
  ['text-base', '', '13 · normal', 'body default', 'Plan the sprint'],
  ['text-prose', '', '13.5 · 1.65', 'document body', 'A plan holds tasks, and each task a check.'],
  ['text-heading', '', '13.5 · normal · −.01em · 700', 'brand, column titles', 'Plan the sprint'],
  ['text-title', '', '15 · 1.3 · −.01em · 700', 'modal and panel titles', 'Plan the sprint'],
  ['text-headline', '', '18 · 1.3 · −.01em · 700', 'headings inside a document', 'Plan the sprint'],
  ['text-display', '', '21 · 1.3 · −.01em · 700', 'page and document titles', 'Plan the sprint'],
] as const;

const row: React.CSSProperties = { display: 'grid', gridTemplateColumns: '92px 168px 176px 1fr', alignItems: 'baseline', gap: 12, padding: '4px 0', borderBottom: '1px solid var(--border-subtle)' };

export function TypeUtilities() {
  return (
    <Frame
      eyebrow="Type"
      title="Text styles"
      lede="One class sets size, line height, letter spacing and weight (DD-038). A label adds uppercase; an id or a count adds font-mono."
    >
      {STYLES.map(([cls, extra, value, use, sample]) => (
        <div key={cls} style={row}>
          <span className="font-mono text-tiny text-secondary">{cls}</span>
          <span className="font-mono text-tiny text-faint">{value}</span>
          <span className="text-tiny text-muted">{use}</span>
          <span className={`${cls} ${extra}`} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {sample}
          </span>
        </div>
      ))}
    </Frame>
  );
}
