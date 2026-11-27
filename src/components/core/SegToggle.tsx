import React from 'react';
import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { normalizeOption, type DSOptionInput } from '../../types';

export interface SegToggleProps {
  options?: DSOptionInput[];
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}

// Built on Base UI's ToggleGroup and Toggle, from shadcn/ui's Base UI toggle group (DD-034).
// Base UI gives the group one Tab stop and moves focus with the arrow keys, Home and End.
// Bob keeps its props: SegToggle holds no state, `value` alone decides the pressed segment, and
// a click calls onChange with the segment's value, also when it is already pressed.
export function SegToggle({ options = [], value, onChange, style }: SegToggleProps) {
  const opts = options.map(normalizeOption);
  // Base UI names each toggle by a non-empty string. The index is one, whatever the option's
  // value is (an empty string included).
  const active = opts.findIndex((opt) => opt.value === value);
  return (
    <ToggleGroup className="seg" style={style} value={active < 0 ? [] : [String(active)]}>
      {opts.map((opt, i) => (
        <Toggle
          key={opt.value}
          value={String(i)}
          onPressedChange={() => onChange?.(opt.value)}
          className={(state) => (state.pressed ? 'seg-opt seg-active' : 'seg-opt')}
        >
          {opt.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
