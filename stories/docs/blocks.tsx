import React from 'react';
import { Kbd } from '../../src';

// Small building blocks for the docs pages. They use Bob's tokens, so the pages look like Bob.

const label: React.CSSProperties = {
  fontSize: 'var(--fs-tiny)',
  fontWeight: 600,
  letterSpacing: 'var(--ls-label)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
};

/** The sentence under a page title: what the component is for. */
export function Lede({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--text-secondary)', margin: '4px 0 24px', maxWidth: 640 }}>{children}</p>;
}

/** Facts about a component in one strip: how to import it, what it renders, its classes. */
export function Facts({ items }: { items: [string, React.ReactNode][] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'max-content 1fr',
        gap: '8px 20px',
        alignItems: 'baseline',
        padding: '14px 18px',
        margin: '0 0 28px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius)',
      }}
    >
      {items.map(([k, v]) => (
        <React.Fragment key={k}>
          <div style={label}>{k}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-primary)', overflowWrap: 'break-word' }}>{v}</div>
        </React.Fragment>
      ))}
    </div>
  );
}

/** A do column and a don't column, side by side. Children are `<Do>` and `<Dont>`. */
export function DoDont({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, margin: '16px 0 28px' }}>
      {children}
    </div>
  );
}

function Column({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div
      className="bob-dodont"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderTop: `2px solid ${color}`,
        borderRadius: 'var(--radius)',
        padding: '12px 18px 4px',
      }}
    >
      <div style={{ ...label, color, display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
        {title}
      </div>
      <div style={{ fontSize: 14 }}>{children}</div>
    </div>
  );
}

export const Do = ({ children }: { children: React.ReactNode }) => <Column title="Do" color="var(--text-green)">{children}</Column>;
export const Dont = ({ children }: { children: React.ReactNode }) => <Column title="Don't" color="var(--text-danger)">{children}</Column>;

/** A keyboard table: each row a key (or keys) and what it does. */
export function Keys({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', overflow: 'hidden', margin: '12px 0 20px' }}>
      {rows.map(([keys, what], i) => (
        <div
          key={keys}
          style={{
            display: 'grid',
            gridTemplateColumns: '160px 1fr',
            gap: 16,
            alignItems: 'center',
            padding: '9px 16px',
            fontSize: 13.5,
            color: 'var(--text-secondary)',
            borderTop: i ? '1px solid var(--border-subtle)' : undefined,
            background: 'var(--bg-card)',
          }}
        >
          <span style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {keys.split(' ').map((k) => <Kbd key={k}>{k}</Kbd>)}
          </span>
          <span>{what}</span>
        </div>
      ))}
    </div>
  );
}

/** A known gap: something the component does not do yet. */
export function Gap({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'baseline',
        padding: '10px 16px',
        margin: '8px 0',
        background: 'var(--bg-yellow-tint)',
        border: '1px solid var(--border-subtle)',
        borderLeft: '2px solid var(--yellow-9)',
        borderRadius: 'var(--radius)',
        fontSize: 14,
        color: 'var(--text-secondary)',
      }}
    >
      <span style={{ ...label, color: 'var(--text-yellow)', flexShrink: 0 }}>Gap</span>
      <span>{children}</span>
    </div>
  );
}
