import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn } from 'storybook/test';
import { SegToggle } from '../../src';

export default {
  title: 'Core/SegToggle',
  component: SegToggle,
  argTypes: {
    options: { control: 'object', description: 'The segments. A string is shorthand for `{ value, label }` with both the same.' },
    value: { control: 'text', description: 'The value of the active segment. SegToggle keeps no state: the parent owns it.' },
    onChange: { description: 'Called with the pressed segment\'s value (click, Enter or Space), also when it is already active.' },
    style: { control: false, description: 'Inline styles on the group, merged last.' },
  },
} satisfies Meta<typeof SegToggle>;

export const Default: StoryObj<typeof SegToggle> = {
  render: (args) => <SegToggle {...args} />,
  args: { options: ['day', 'week', 'month'], value: 'week' },
};

/** The usual wiring: the parent keeps the value and sets it in onChange. */
function RangeToggle({ onChange }: { onChange?: (value: string) => void }) {
  const [value, setValue] = useState('week');
  return (
    <SegToggle
      options={['day', 'week', { value: 'month', label: 'Month' }]}
      value={value}
      onChange={(v) => {
        setValue(v);
        onChange?.(v);
      }}
    />
  );
}

/** An interaction test: a click, or the arrow keys and Enter, make a segment the active one. */
export const SwitchSegments: StoryObj<typeof RangeToggle> = {
  name: 'Switch segments (test)',
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: `const [range, setRange] = useState('week');

<SegToggle options={['day', 'week', { value: 'month', label: 'Month' }]} value={range} onChange={setRange} />`,
      },
    },
  },
  args: { onChange: fn() },
  render: (args) => <RangeToggle {...args} />,
  play: async ({ args, canvas, userEvent }) => {
    const day = canvas.getByRole('button', { name: 'day' });
    const week = canvas.getByRole('button', { name: 'week' });
    const month = canvas.getByRole('button', { name: 'Month' });
    await expect(week).toHaveClass('seg-active');

    await userEvent.click(month);
    await expect(args.onChange).toHaveBeenLastCalledWith('month');
    await expect(month).toHaveClass('seg-active');
    await expect(week).not.toHaveClass('seg-active');

    // The arrow keys move focus between the segments (Base UI); Enter picks one.
    await expect(month).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    await expect(day).toHaveFocus();
    await expect(month).toHaveClass('seg-active');
    await userEvent.keyboard('{Enter}');
    await expect(args.onChange).toHaveBeenLastCalledWith('day');
    await expect(day).toHaveClass('seg-active');
    await expect(month).not.toHaveClass('seg-active');

    // Space on the active segment calls onChange again, and the segment stays active.
    await userEvent.keyboard(' ');
    await expect(args.onChange).toHaveBeenCalledTimes(3);
    await expect(args.onChange).toHaveBeenLastCalledWith('day');
    await expect(day).toHaveClass('seg-active');
  },
};
