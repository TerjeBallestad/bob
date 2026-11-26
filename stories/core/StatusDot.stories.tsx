import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusDot } from '../../src';

export default {
  title: 'Core/StatusDot',
  component: StatusDot,
  argTypes: {
    state: {
      control: 'select',
      options: ['dashed', 'outline', 'staged', 'live', 'solid'],
      description: 'dashed: inbox or unset. outline: in progress. staged: staged. solid: done. live: an agent works on it now (pulses).',
    },
    color: { control: 'text', description: 'The dot\'s colour, a role such as `var(--green)`. `dashed` ignores it and uses `--text-3`.' },
    size: { control: 'number', description: 'Diameter in px.' },
    square: { control: 'boolean', description: 'A rounded square instead of a circle.' },
    style: { control: false, description: 'Inline styles, merged last.' },
  },
} satisfies Meta<typeof StatusDot>;

export const Default: StoryObj<typeof StatusDot> = {
  name: 'States',
  render: () => (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      {(['dashed', 'outline', 'staged', 'live', 'solid'] as const).map((s) => (
        <StatusDot key={s} state={s} color="var(--green)" size={9} />
      ))}
      <StatusDot state="solid" square color="var(--accent)" size={9} />
    </div>
  ),
};
