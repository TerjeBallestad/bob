import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormRow, Input, Select, Textarea } from '../../src';

export default {
  title: 'Forms/FormRow',
  component: FormRow,
  argTypes: {
    label: { control: 'text', description: 'The field\'s visible name, above it. Leave it out and no label renders.' },
    children: { control: false, description: 'One field: Input, Select, Textarea or SearchInput.' },
    style: { control: false, description: 'Inline styles on the row, merged last.' },
  },
} satisfies Meta<typeof FormRow>;

export const Default: StoryObj<typeof FormRow> = {
  name: 'A form',
  render: () => (
    <div style={{ display: 'grid', gap: 12, width: 320 }}>
      <FormRow label="Name"><Input defaultValue="Time Turtle" /></FormRow>
      <FormRow label="Stage"><Select options={['inbox', 'planned']} /></FormRow>
      <FormRow label="Body"><Textarea rows={3} /></FormRow>
    </div>
  ),
};
