import React from 'react';
import { clickable } from './clickable';

export type TicketKind = 'research' | 'probe' | 'grill' | 'task' | 'gap';

const KIND_COLORS: Record<TicketKind, string> = {
  research: 'var(--text-blue)',
  probe: 'var(--text-purple)',
  grill: 'var(--text-orange)',
  task: 'var(--text-green)',
  gap: 'var(--text-yellow)',
};

export interface TicketCardProps {
  id?: React.ReactNode;
  kind?: TicketKind;
  title?: React.ReactNode;
  age?: React.ReactNode;
  priority?: string;
  blocked?: React.ReactNode;
  progress?: { done: number; total: number };
  live?: boolean;
  emphasis?: 'sdd' | 'plan';
  /** A type label in the head, for records that have no ticket kind, for example MAP or PLAN. */
  label?: { text: string; color?: string };
  /** Small grey text in the foot, for example "3 comments" or "4 linked". */
  note?: React.ReactNode;
  /** The id's colour when the card has no kind. */
  idColor?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function TicketCard({
  id,
  kind,
  title,
  age,
  priority,
  blocked,
  progress,
  live,
  emphasis,
  label,
  note,
  idColor,
  onClick,
  style,
}: TicketCardProps) {
  // Border/shadow are data-driven (emphasis/kind); the hover border comes from CSS (:hover)
  // overriding the --tc-border custom property, so no hover state hook is needed.
  let border = 'var(--border-subtle)';
  let shadow = 'none';
  if (emphasis === 'sdd') {
    border = 'var(--border-accent-subtle)';
    shadow = 'var(--glow-accent)';
  } else if (emphasis === 'plan') border = 'var(--border-green-subtle)';
  else if (kind === 'grill') border = 'var(--border-orange-subtle)';
  else if (kind === 'probe') border = 'var(--border-purple-subtle)';

  return (
    <div
      {...clickable(onClick)}
      className="ticket-card"
      style={{ ['--tc-border' as string]: border, boxShadow: shadow, ...style } as React.CSSProperties}
    >
      <div className="ticket-card-head">
        {live && <span className="ticket-card-live" />}
        <span className="ticket-card-id" style={{ color: (kind && KIND_COLORS[kind]) || idColor || 'var(--text-secondary)' }}>
          {id}
        </span>
        {kind && (
          <span className="ticket-card-kind" style={{ color: KIND_COLORS[kind] }}>
            {kind}
          </span>
        )}
        {!kind && label && (
          <span className="ticket-card-kind" style={{ color: label.color || 'var(--text-secondary)' }}>
            {label.text}
          </span>
        )}
        {priority && (
          <span
            className="ticket-card-priority"
            style={{ color: priority === 'critical' ? 'var(--text-danger)' : 'var(--text-orange)' }}
          >
            {priority}
          </span>
        )}
        {age && <span className="ticket-card-age">{age}</span>}
      </div>
      <div className="ticket-card-title">{title}</div>
      {(blocked || note || progress) && (
        <div className="ticket-card-foot">
          {blocked && <span className="ticket-card-blocked">{blocked}</span>}
          {note && <span className="ticket-card-note">{note}</span>}
          {progress && (
            <>
              <span className="ticket-card-track">
                <span
                  className="ticket-card-fill"
                  style={{ width: Math.min(100, (progress.done / progress.total) * 100) + '%' }}
                />
              </span>
              <span className="ticket-card-count">
                {progress.done}/{progress.total}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
