import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from '../../src';

export default {
  title: 'Forms/Select',
  component: Select,
  argTypes: {
    options: { control: 'object', description: 'The choices. A string is shorthand for `{ value, label }` with both the same.' },
    value: { control: 'text', description: 'Controlled value. Pass `defaultValue` instead to let the browser keep it.' },
    onChange: { description: 'The native change event: read `e.target.value`.' },
    disabled: { control: 'boolean', description: 'The native attribute.' },
    className: { control: 'text', description: 'Tailwind utilities that win over Bob\'s classes.' },
  },
} satisfies Meta<typeof Select>;

export const Default: StoryObj<typeof Select> = {
  render: (args) => <Select {...args} />,
  args: { options: ['inbox', 'exploring', 'planned', { value: 'done', label: 'Done' }] },
};
