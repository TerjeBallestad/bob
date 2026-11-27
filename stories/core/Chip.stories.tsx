import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from '../../src';

export default {
  title: 'Core/Chip',
  component: Chip,
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'accent', 'blue', 'green', 'orange', 'danger', 'yellow', 'claim'], description: 'The colour. Each tone pairs a text colour with its tint.' },
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
    <div className="grid gap-2.5">
      <div className="flex flex-wrap items-center gap-2.5">
        <Chip tone="neutral">neutral</Chip>
        <Chip tone="accent">accent</Chip>
        <Chip tone="blue">blue</Chip>
        <Chip tone="green">green</Chip>
        <Chip tone="orange">orange</Chip>
        <Chip tone="danger">danger</Chip>
        <Chip tone="yellow">yellow</Chip>
        <Chip tone="claim">claim</Chip>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <Chip mono tone="neutral">neutral</Chip>
        <Chip mono tone="accent">accent</Chip>
        <Chip mono tone="blue">blue</Chip>
        <Chip mono tone="green">green</Chip>
        <Chip mono tone="orange">orange</Chip>
        <Chip mono tone="danger">danger</Chip>
        <Chip mono tone="yellow">yellow</Chip>
        <Chip mono tone="claim">claim</Chip>
      </div>
    </div>
  ),
};
