import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormRow, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '../../src';

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
  render: (args) => (
    <div className="w-80">
      <FormRow {...args} />
    </div>
  ),
  args: { label: 'Name', children: <Input defaultValue="Weekly review" /> },
};

export const Form: StoryObj = {
  name: 'A form',
  render: () => (
    <div className="grid w-80 gap-3">
      <FormRow label="Name"><Input defaultValue="Weekly review" /></FormRow>
      <FormRow label="Stage">
        <Select defaultValue="inbox">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="inbox">inbox</SelectItem>
            <SelectItem value="planned">planned</SelectItem>
          </SelectContent>
        </Select>
      </FormRow>
      <FormRow label="Body"><Textarea rows={3} /></FormRow>
    </div>
  ),
};
