import React from 'react';
import { Frame, tokens } from './TokenPages';

// Each class is written whole and rendered as a class, not as an inline style, so the page shows
// what Tailwind builds from Bob's theme (src/tailwind/theme.css). .storybook/tailwind.css scans
// this file.
const SIZES = [
  ['text-micro', '--fs-micro'],
  ['text-tiny', '--fs-tiny'],
  ['text-caption', '--fs-caption'],
  ['text-body', '--fs-body'],
  ['text-base', '--fs-base'],
  ['text-prose', '--fs-prose'],
  ['text-title', '--fs-title'],
  ['text-doc', '--fs-doc'],
] as const;
const TRACKING = [
  ['tracking-heading', '--ls-heading', 'text-title font-semibold tracking-heading', 'Plan the sprint'],
  ['tracking-label', '--ls-label', 'text-micro font-semibold uppercase tracking-label text-muted', 'Planned'],
] as const;
const LEADING = [
  ['leading-normal', '1.5', 'text-caption leading-normal text-secondary'],
  ['leading-relaxed', '1.625', 'text-caption leading-relaxed text-secondary'],
  ['leading-loose', '2', 'text-caption leading-loose text-secondary'],
] as const;

const row: React.CSSProperties = { display: 'grid', gridTemplateColumns: '130px 110px 1fr', alignItems: 'baseline', gap: 12, padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' };

function Name({ cls, value }: { cls: string; value: string }) {
  return (
    <>
      <span className="font-mono text-tiny text-secondary">{cls}</span>
      <span className="font-mono text-tiny text-faint">{value}</span>
    </>
  );
}

export function TypeUtilities() {
  return (
    <Frame eyebrow="Type" title="Tailwind classes" lede="Bob's ramp and letter spacing as Tailwind classes. A size sets only font-size; for a line height use Tailwind's leading-*.">
      {SIZES.map(([cls, token]) => (
        <div key={cls} style={row}>
          <Name cls={cls} value={`${token.slice(2)} ${tokens.decls.get(token)}`} />
          <span className={cls} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Plan the sprint
          </span>
        </div>
      ))}
      {TRACKING.map(([cls, token, classes, text]) => (
        <div key={cls} style={row}>
          <Name cls={cls} value={tokens.decls.get(token) ?? ''} />
          <span className={classes}>{text}</span>
        </div>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginTop: 14 }}>
        {LEADING.map(([cls, value, classes]) => (
          <div key={cls}>
            <div className="flex gap-3">
              <Name cls={cls} value={value} />
            </div>
            <p className={classes} style={{ marginTop: 4 }}>
              Tailwind's own line heights. Bob has no line-height tokens, so an app uses these.
            </p>
          </div>
        ))}
      </div>
    </Frame>
  );
}
