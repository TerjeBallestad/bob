import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormRow, Input, SearchInput, Select, Textarea } from '../src';

export default { title: 'Forms' } satisfies Meta;

export const InputStory: StoryObj<typeof Input> = {
  name: 'Input',
  render: (args) => <Input {...args} />,
  args: { placeholder: 'Project name' },
};

export const SearchInputStory: StoryObj<typeof SearchInput> = {
  name: 'SearchInput',
  render: (args) => <SearchInput {...args} />,
  args: { placeholder: 'Search', kbd: '/' },
};

export const SelectStory: StoryObj<typeof Select> = {
  name: 'Select',
  render: (args) => <Select {...args} />,
  args: { options: ['inbox', 'exploring', 'planned', { value: 'done', label: 'Done' }] },
};

export const TextareaStory: StoryObj<typeof Textarea> = {
  name: 'Textarea',
  render: (args) => <Textarea {...args} />,
  args: { placeholder: 'Notes', rows: 4 },
};

export const FormRowStory: StoryObj<typeof FormRow> = {
  name: 'FormRow',
  render: () => (
    <div style={{ display: 'grid', gap: 12, width: 320 }}>
      <FormRow label="Name"><Input defaultValue="Time Turtle" /></FormRow>
      <FormRow label="Stage"><Select options={['inbox', 'planned']} /></FormRow>
      <FormRow label="Body"><Textarea rows={3} /></FormRow>
    </div>
  ),
};
