import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchInput } from '../../src';

export default {
  title: 'Forms/SearchInput',
  component: SearchInput,
  argTypes: {
    kbd: { control: 'text', description: 'With a key hint, SearchInput renders a button that opens your search (a command palette), not a field.' },
    expandOnFocus: { control: 'boolean', description: 'The field widens from 150 to 210px while it has focus: the topbar pattern.' },
    placeholder: { control: 'text', description: 'The field\'s hint, or the button\'s label when `kbd` is set. Defaults to "Search" on the button.' },
    className: { control: 'text', description: 'Tailwind utilities that win over Bob\'s classes.' },
  },
} satisfies Meta<typeof SearchInput>;

export const Default: StoryObj<typeof SearchInput> = {
  name: 'Key hint',
  render: (args) => <SearchInput {...args} />,
  args: { placeholder: 'Search', kbd: '/' },
};

export const Live: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 10, width: 260 }}>
      <SearchInput placeholder="Filter…" />
      <SearchInput expandOnFocus placeholder="Search" />
      <SearchInput defaultValue="widget" aria-label="Search" />
    </div>
  ),
};
