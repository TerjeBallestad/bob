import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd } from '../../src';

export default {
  title: 'Core/Kbd',
  component: Kbd,
  argTypes: {
    children: { control: 'text', description: 'The key or chord, as the user types it: `⌘K`, `/`, `Esc`.' },
    style: { control: false, description: 'Inline styles, merged last.' },
  },
} satisfies Meta<typeof Kbd>;

export const Default: StoryObj<typeof Kbd> = {
  render: (args) => <Kbd {...args} />,
  args: { children: '⌘K' },
};

export const Keys: StoryObj = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2.5">
      <Kbd>⌘K</Kbd>
      <Kbd>/</Kbd>
      <Kbd>Esc</Kbd>
    </div>
  ),
};
