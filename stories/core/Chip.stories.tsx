import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from '../../src';

const TONES = ['neutral', 'accent', 'blue', 'green', 'orange', 'danger', 'yellow', 'claim'] as const;
const row = { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' } as const;

export default {
  title: 'Core/Chip',
  component: Chip,
  argTypes: {
    tone: { control: 'select', options: TONES, description: 'The colour. Each tone pairs a text colour with its tint.' },
    mono: { control: 'boolean', description: 'JetBrains Mono, for ids, counts, roles and other machine words.' },
    children: { control: 'text', description: 'One or two words.' },
    className: { control: 'text', description: 'Tailwind utilities that win over Bob\'s classes.' },
  },
} satisfies Meta<typeof Chip>;

export const Default: StoryObj<typeof Chip> = {
  render: (args) => <Chip {...args} />,
  args: { tone: 'green', mono: true, children: 'admin' },
};

export const Tones: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 10 }}>
      {[false, true].map((mono) => (
        <div key={String(mono)} style={row}>
          {TONES.map((t) => (
            <Chip key={t} tone={t} mono={mono}>{t}</Chip>
          ))}
        </div>
      ))}
    </div>
  ),
};
