import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from '../../src';

export default {
  title: 'Core/ProgressBar',
  component: ProgressBar,
  argTypes: {
    value: { control: 'number', description: 'How much is done, in the same unit as `max`.' },
    max: { control: 'number', description: 'The total. The fill is `value / max`, capped at 100%; a `max` of 0 shows an empty track.' },
    width: { control: 'text', description: 'Track width: px as a number, or any CSS length.' },
    height: { control: 'number', description: 'Track height in px.' },
    color: { control: 'text', description: 'Fill colour. A role such as `var(--green)`, not a hex value.' },
    style: { control: false, description: 'Inline styles on the track, merged last.' },
  },
} satisfies Meta<typeof ProgressBar>;

export const Default: StoryObj<typeof ProgressBar> = {
  render: (args) => <ProgressBar {...args} />,
  args: { value: 3, max: 7, width: 160 },
};
