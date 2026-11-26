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
    onChange: { description: 'Called with the clicked segment\'s value, also when it is already active.' },
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

/** An interaction test: a click or Enter on a segment makes it the active one. */
export const SwitchSegments: StoryObj<typeof RangeToggle> = {
  name: 'Switch segments (test)',
  parameters: { controls: { disable: true } },
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

    // Each segment is a button in the tab order: Tab reaches it, Enter picks it.
    await userEvent.tab({ shift: true });
    await userEvent.tab({ shift: true });
    await expect(day).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onChange).toHaveBeenLastCalledWith('day');
    await expect(day).toHaveClass('seg-active');
    await expect(month).not.toHaveClass('seg-active');
  },
};
