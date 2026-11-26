import React from 'react';

export interface FormRowProps {
  label?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function FormRow({ label, children, style }: FormRowProps) {
  return (
    <div className="form-row" style={style}>
      {label && <label className="form-label">{label}</label>}
      {children}
    </div>
  );
}
