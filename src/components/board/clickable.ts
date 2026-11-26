import type React from 'react';

/** Props that make a clickable div a keyboard control: Tab reaches it, Enter and Space click it.
 *  With no onClick, the div stays plain. */
export function clickable(onClick?: () => void): React.HTMLAttributes<HTMLDivElement> {
  if (!onClick) return {};
  return {
    onClick,
    role: 'button',
    tabIndex: 0,
    onKeyDown: (e) => {
      if (e.target !== e.currentTarget) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
  };
}
