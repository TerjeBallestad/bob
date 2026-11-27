import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip, SectionLabel, StatusDot } from '../../src';

export default {
  title: 'Board/SectionLabel',
  component: SectionLabel,
  argTypes: {
    children: { control: 'text', description: 'The section\'s name. CSS sets it in capitals: write it in sentence case.' },
    dot: { control: false, description: 'A StatusDot before the name.' },
    action: { control: false, description: 'Something small on the right: a count Chip, or a ghost Button.' },
    style: { control: false, description: 'Inline styles, merged last.' },
  },
} satisfies Meta<typeof SectionLabel>;

export const Default: StoryObj<typeof SectionLabel> = {
  name: 'With dot and count',
  render: (args) => (
    <div className="w-80">
      <SectionLabel {...args} />
    </div>
  ),
  args: { children: 'Planned', dot: <StatusDot state="solid" color="var(--bg-accent)" />, action: <Chip mono>3</Chip> },
};
