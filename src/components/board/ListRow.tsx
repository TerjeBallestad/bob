import React from 'react';
import { clickable } from './clickable';

export interface ListRowProps {
  id?: React.ReactNode;
  idColor?: string;
  title?: React.ReactNode;
  meta?: React.ReactNode;
  age?: React.ReactNode;
  done?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function ListRow({
  id,
  idColor = 'var(--accent)',
  title,
  meta,
  age,
  done = false,
  onClick,
  style,
}: ListRowProps) {
  return (
    <div {...clickable(onClick)} className={done ? 'list-row list-row-done' : 'list-row'} style={style}>
      <span className="list-row-id" style={{ color: idColor }}>
        {id}
      </span>
      <span className={done ? 'list-row-title list-row-title-done' : 'list-row-title'}>{title}</span>
      {meta && <span className="list-row-meta">{meta}</span>}
      {age && <span className="list-row-age">{age}</span>}
    </div>
  );
}
