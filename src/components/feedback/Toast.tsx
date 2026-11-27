import React from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';

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

// The stack is Base UI's toast viewport (DD-034): a live region named "Notifications"
// (role="region", aria-live="polite"). It is in the page before any toast arrives, so a screen
// reader reads each toast the app adds to it.
//
// Base UI's Toast.Root needs a toast object from Base UI's toast manager, and its role is
// "dialog". Bob's Toast keeps its declarative props and its roles (status, alert), so the toasts
// are Bob's own elements, and the provider holds no toasts of its own.
export function ToastStack({ children }: ToastStackProps) {
  return (
    <BaseToast.Provider>
      <BaseToast.Viewport className="toast-stack">{children}</BaseToast.Viewport>
    </BaseToast.Provider>
  );
}
