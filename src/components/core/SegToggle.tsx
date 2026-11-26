import React from 'react';
import { normalizeOption, type DSOptionInput } from '../../types';

export interface SegToggleProps {
  options?: DSOptionInput[];
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}

export function SegToggle({ options = [], value, onChange, style }: SegToggleProps) {
  return (
    <div className="seg" style={style}>
      {options.map((o) => {
        const opt = normalizeOption(o);
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange && onChange(opt.value)}
            className={active ? 'seg-opt seg-active' : 'seg-opt'}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
