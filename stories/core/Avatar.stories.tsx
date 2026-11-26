import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '../../src';

const row = { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' } as const;

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
  name: 'Tones and sizes',
  render: () => (
    <div style={row}>
      {(['gold', 'accent', 'green', 'neutral'] as const).map((t) => <Avatar key={t} tone={t} initials="TB" />)}
      <Avatar initials="TB" size={32} />
    </div>
  ),
};
