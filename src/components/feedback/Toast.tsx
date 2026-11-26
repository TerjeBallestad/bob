import React from 'react';

export interface ToastProps {
  children?: React.ReactNode;
  error?: boolean;
  style?: React.CSSProperties;
}

/** Copy rule: 2–5 words, past tense, no subject — "Title updated", "SB-341 archived". */
export function Toast({ children, error = false, style }: ToastProps) {
  return (
    // status: a screen reader reads a new toast when it is idle; alert: at once, for an error.
    <div className={error ? 'toast toast-error' : 'toast'} role={error ? 'alert' : 'status'} style={style}>
      {children}
    </div>
  );
}

export interface ToastStackProps {
  children?: React.ReactNode;
}

export function ToastStack({ children }: ToastStackProps) {
  return <div className="toast-stack">{children}</div>;
}
