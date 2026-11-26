import type { Meta, StoryObj } from '@storybook/react-vite';
import { TicketCard } from '../../src';

export default {
  title: 'Board/TicketCard',
  component: TicketCard,
  argTypes: {
    id: { control: 'text', description: 'The record id, in mono: `SB-042`.' },
    kind: {
      control: 'select',
      options: [undefined, 'research', 'probe', 'grill', 'task', 'gap'],
      description: 'The ticket kind. It colours the id and the kind label; grill and probe also colour the border.',
    },
    title: { control: 'text', description: 'The ticket title. Long titles wrap.' },
    age: { control: 'text', description: 'Time since the last change, short: `2d`.' },
    priority: { control: 'text', description: '`critical` is red; any other value is orange. Leave it out for normal priority.' },
    blocked: { control: 'text', description: 'The id of the record that blocks this one, in orange in the foot.' },
    progress: { control: 'object', description: '`{ done, total }`: a bar and a count in the foot, for plans.' },
    live: { control: 'boolean', description: 'A pulsing green dot: an agent works on it now.' },
    emphasis: { control: 'inline-radio', options: [undefined, 'sdd', 'plan'], description: 'An indigo glow (sdd) or a green border (plan), for the records a board is built around.' },
    label: { control: 'object', description: 'A type label for a record with no kind, for example MAP or PLAN. A kind wins over it.' },
    note: { control: 'text', description: 'Small grey text in the foot: "3 comments", "4 linked".' },
    idColor: { control: 'text', description: 'The id\'s colour when the card has no kind.' },
    onClick: { description: 'Called on a click anywhere on the card.' },
    style: { control: false, description: 'Inline styles, merged last.' },
  },
} satisfies Meta<typeof TicketCard>;

export const Default: StoryObj<typeof TicketCard> = {
  render: (args) => <div style={{ width: 280 }}><TicketCard {...args} /></div>,
  args: { id: 'SB-042', kind: 'task', title: 'The id counter refuses a second SB-042', age: '2d', priority: 'high' },
};

export const States: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 8, width: 280 }}>
      {(['research', 'probe', 'grill', 'task', 'gap'] as const).map((k, i) => (
        <TicketCard key={k} id={`SB-0${40 + i}`} kind={k} title={`A ${k} ticket`} age={`${i + 1}d`} />
      ))}
      <TicketCard id="SB-050" title="Critical and blocked" priority="critical" blocked="SB-049" />
      <TicketCard id="PLAN-001" title="A plan with progress" progress={{ done: 3, total: 7 }} live emphasis="plan" />
      <TicketCard id="SDD-004" title="An SDD" emphasis="sdd" />
    </div>
  ),
};

export const LabelsAndNotes: StoryObj = {
  name: 'Labels and notes',
  render: () => (
    <div style={{ display: 'grid', gap: 8, width: 280 }}>
      <TicketCard id="SDD-005" idColor="#7b83eb" label={{ text: 'map', color: '#7b83eb' }} title="A map with a label and a note" emphasis="sdd" note="4 linked" age="2d" />
      <TicketCard id="PLAN-002" idColor="#46c288" label={{ text: 'plan', color: '#46c288' }} title="A plan with a note and progress" emphasis="plan" note="1 comment" progress={{ done: 1, total: 4 }} />
      <TicketCard id="SB-051" kind="task" title="A kind wins over a label" label={{ text: 'ignored' }} note="3 comments" />
      <TicketCard id="SB-052" kind="grill" title="Blocked, with a note" blocked="SB-049" note="1 comment" />
    </div>
  ),
};
