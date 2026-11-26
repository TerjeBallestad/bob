import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegToggle } from '../../src';

export default {
  title: 'Core/SegToggle',
  component: SegToggle,
  argTypes: {
    options: { control: 'object', description: 'The segments. A string is shorthand for `{ value, label }` with both the same.' },
    value: { control: 'text', description: 'The value of the active segment. SegToggle keeps no state: the parent owns it.' },
    onChange: { description: 'Called with the clicked segment\'s value, also when it is already active.' },
    style: { control: false, description: 'Inline styles on the group, merged last.' },
  },
} satisfies Meta<typeof SegToggle>;

export const Default: StoryObj<typeof SegToggle> = {
  render: (args) => <SegToggle {...args} />,
  args: { options: ['day', 'week', 'month'], value: 'week' },
};
