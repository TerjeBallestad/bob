import React from 'react';

/** The uppercase 10.5px label pattern — an intentional addition, see readme.md. */
export interface SectionLabelProps {
  children?: React.ReactNode;
  action?: React.ReactNode;
  dot?: React.ReactNode;
  style?: React.CSSProperties;
}

export function SectionLabel({ children, action, dot, style }: SectionLabelProps) {
  return (
    <div className="section-label" style={style}>
      {dot}
      <span>{children}</span>
      {action && <span className="section-label-action">{action}</span>}
    </div>
  );
}
