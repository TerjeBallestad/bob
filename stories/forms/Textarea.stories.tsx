import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from '../../src';

export default {
  title: 'Forms/Textarea',
  component: Textarea,
  argTypes: {
    rows: { control: 'number', description: 'Visible lines before it scrolls.' },
    placeholder: { control: 'text', description: 'A hint, never the label.' },
    disabled: { control: 'boolean', description: 'The native attribute.' },
    className: { control: 'text', description: 'Tailwind utilities that win over Bob\'s classes.' },
  },
} satisfies Meta<typeof Textarea>;

export const Default: StoryObj<typeof Textarea> = {
  render: (args) => <Textarea {...args} />,
  args: { placeholder: 'Notes', rows: 4 },
};
