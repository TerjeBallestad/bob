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
    color: { control: 'text', description: 'The dot\'s colour, a role such as `var(--bg-green)`. `dashed` ignores it and uses `--text-muted`.' },
    size: { control: 'number', description: 'Diameter in px.' },
    square: { control: 'boolean', description: 'A rounded square instead of a circle.' },
    style: { control: false, description: 'Inline styles, merged last.' },
  },
} satisfies Meta<typeof StatusDot>;

export const Default: StoryObj<typeof StatusDot> = {
  render: (args) => <StatusDot {...args} />,
  args: { state: 'live', color: 'var(--bg-green)', size: 9 },
};

export const States: StoryObj = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2.5">
      <StatusDot state="dashed" color="var(--bg-green)" size={9} />
      <StatusDot state="outline" color="var(--bg-green)" size={9} />
      <StatusDot state="staged" color="var(--bg-green)" size={9} />
      <StatusDot state="live" color="var(--bg-green)" size={9} />
      <StatusDot state="solid" color="var(--bg-green)" size={9} />
      <StatusDot state="solid" square color="var(--bg-accent)" size={9} />
    </div>
  ),
};
