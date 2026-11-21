import React from 'react';
import styles from './TicketCard.module.css';

export type TicketKind = 'research' | 'probe' | 'grill' | 'task' | 'gap';

const KIND_COLORS: Record<TicketKind, string> = {
  research: '#52a9ff',
  probe: '#c084fc',
  grill: '#f0883e',
  task: '#46c288',
  gap: '#e2c541',
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
  let border = 'var(--border)';
  let shadow = 'none';
  if (emphasis === 'sdd') {
    border = '#2a2d52';
    shadow = 'var(--glow-accent)';
  } else if (emphasis === 'plan') border = '#1f4436';
  else if (kind === 'grill') border = 'rgba(240,136,62,.3)';
  else if (kind === 'probe') border = 'rgba(192,132,252,.28)';

  return (
    <div
      onClick={onClick}
      className={styles.card}
      style={{ ['--tc-border' as string]: border, boxShadow: shadow, ...style } as React.CSSProperties}
    >
      <div className={styles.head}>
        {live && <span className={styles.live} />}
        <span className={styles.id} style={{ color: (kind && KIND_COLORS[kind]) || idColor || 'var(--text-2)' }}>
          {id}
        </span>
        {kind && (
          <span className={styles.kind} style={{ color: KIND_COLORS[kind] }}>
            {kind}
          </span>
        )}
        {!kind && label && (
          <span className={styles.kind} style={{ color: label.color || 'var(--text-2)' }}>
            {label.text}
          </span>
        )}
        {priority && (
          <span
            className={styles.priority}
            style={{ color: priority === 'critical' ? 'var(--danger)' : 'var(--orange)' }}
          >
            {priority}
          </span>
        )}
        {age && <span className={styles.age}>{age}</span>}
      </div>
      <div className={styles.title}>{title}</div>
      {(blocked || note || progress) && (
        <div className={styles.foot}>
          {blocked && <span className={styles.blocked}>{blocked}</span>}
          {note && <span className={styles.note}>{note}</span>}
          {progress && (
            <>
              <span className={styles.track}>
                <span
                  className={styles.fill}
                  style={{ width: Math.min(100, (progress.done / progress.total) * 100) + '%' }}
                />
              </span>
              <span className={styles.count}>
                {progress.done}/{progress.total}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
