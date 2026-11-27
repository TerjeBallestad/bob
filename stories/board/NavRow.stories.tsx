import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavRow, StatusDot } from '../../src';

export default {
  title: 'Board/NavRow',
  component: NavRow,
  argTypes: {
    label: { control: 'text', description: 'The destination\'s name.' },
    count: { control: 'number', description: 'A count on the right. `null` or left out shows none; 0 shows 0.' },
    active: { control: 'boolean', description: 'The current destination: a lighter background and brighter text.' },
    dot: { control: false, description: 'A StatusDot before the label.' },
    onClick: { description: 'Called on a click or on Enter and Space: NavRow is a button.' },
    style: { control: false, description: 'Inline styles, merged last.' },
  },
} satisfies Meta<typeof NavRow>;

export const Default: StoryObj<typeof NavRow> = {
  render: (args) => (
    <div className="w-55">
      <NavRow {...args} />
    </div>
  ),
  args: { label: 'Inbox', count: 12, active: true, dot: <StatusDot state="live" color="var(--green)" /> },
};

export const Sidebar: StoryObj = {
  name: 'A sidebar',
  render: () => (
    <div className="w-55">
      <NavRow label="Inbox" count={12} active dot={<StatusDot state="live" color="var(--green)" />} />
      <NavRow label="Planned" count={4} />
      <NavRow label="Done" count={null} />
    </div>
  ),
};
