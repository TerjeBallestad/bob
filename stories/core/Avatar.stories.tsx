import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '../../src';

export default {
  title: 'Core/Avatar',
  component: Avatar,
  argTypes: {
    initials: { control: 'text', description: 'One or two letters. Defaults to `?`.' },
    tone: { control: 'select', options: ['gold', 'accent', 'green', 'neutral'], description: 'The tint behind the initials.' },
    size: { control: 'number', description: 'Width and height in px. At 24 and over the avatar is a rounded square with larger text; under 24 it is a circle.' },
    style: { control: false, description: 'Inline styles, merged last.' },
  },
} satisfies Meta<typeof Avatar>;

export const Default: StoryObj<typeof Avatar> = {
  render: (args) => <Avatar {...args} />,
  args: { initials: 'TB', tone: 'gold' },
};

export const Tones: StoryObj = {
  name: 'Tones and sizes',
  render: () => (
    <div className="flex flex-wrap items-center gap-2.5">
      <Avatar tone="gold" initials="TB" />
      <Avatar tone="accent" initials="TB" />
      <Avatar tone="green" initials="TB" />
      <Avatar tone="neutral" initials="TB" />
      <Avatar initials="TB" size={32} />
    </div>
  ),
};
