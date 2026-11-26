import React from 'react';
import { normalizeOption, type DSOptionInput } from '../../types';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: DSOptionInput[];
}

export function Select({ options = [], className, ...rest }: SelectProps) {
  return (
    <select className={['select', className].filter(Boolean).join(' ')} {...rest}>
      {options.map((o) => {
        const opt = normalizeOption(o);
        return (
          <option key={opt.value} value={opt.value} className="select-option">
            {opt.label}
          </option>
        );
      })}
    </select>
  );
}
