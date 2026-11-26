import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '../../src';

export default {
  title: 'Forms/Input',
  component: Input,
  argTypes: {
    placeholder: { control: 'text', description: 'A hint of the format, never the label. Use FormRow for the label.' },
    disabled: { control: 'boolean', description: 'The native attribute.' },
    className: { control: 'text', description: 'Tailwind utilities that win over Bob\'s classes, for example `w-full`.' },
  },
} satisfies Meta<typeof Input>;

export const Default: StoryObj<typeof Input> = {
  render: (args) => <Input {...args} />,
  args: { placeholder: 'Project name' },
};
