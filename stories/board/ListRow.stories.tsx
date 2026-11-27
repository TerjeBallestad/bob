import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip, ListRow } from '../../src';

export default {
  title: 'Board/ListRow',
  component: ListRow,
  argTypes: {
    id: { control: 'text', description: 'The record id, in mono.' },
    idColor: { control: 'text', description: 'The id\'s colour. Defaults to `var(--accent)`.' },
    title: { control: 'text', description: 'The record title. It truncates with an ellipsis.' },
    meta: { control: false, description: 'Anything small after the title, usually a Chip.' },
    age: { control: 'text', description: 'Time since the last change, right-aligned.' },
    done: { control: 'boolean', description: 'Strikes the title through and dims the row.' },
    onClick: { description: 'Called on a click on the row.' },
    style: { control: false, description: 'Inline styles, merged last.' },
  },
} satisfies Meta<typeof ListRow>;

export const Default: StoryObj<typeof ListRow> = {
  render: (args) => (
    <div className="w-120">
      <ListRow {...args} />
    </div>
  ),
  args: { id: 'SB-042', title: 'The id counter refuses a second SB-042', meta: <Chip mono>task</Chip>, age: '2d', done: false },
};

export const Rows: StoryObj = {
  render: () => (
    <div className="w-120">
      <ListRow id="SB-042" title="The id counter refuses a second SB-042" meta={<Chip mono>task</Chip>} age="2d" />
      <ListRow id="DD-001" idColor="var(--accent)" title="One server holds every board" age="1d" />
      <ListRow id="SB-030" title="A done row" age="9d" done />
    </div>
  ),
};
