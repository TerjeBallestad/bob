import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip, ListRow, NavRow, SectionLabel, StatusDot, TicketCard } from '../src';

export default { title: 'Board' } satisfies Meta;

export const TicketCardStory: StoryObj<typeof TicketCard> = {
  name: 'TicketCard',
  render: (args) => <div style={{ width: 280 }}><TicketCard {...args} /></div>,
  args: { id: 'SB-042', kind: 'task', title: 'The id counter refuses a second SB-042', age: '2d', priority: 'high' },
};

export const TicketCardStates: StoryObj = {
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

export const ListRowStory: StoryObj<typeof ListRow> = {
  name: 'ListRow',
  render: () => (
    <div style={{ width: 480 }}>
      <ListRow id="SB-042" title="The id counter refuses a second SB-042" meta={<Chip mono>task</Chip>} age="2d" />
      <ListRow id="DD-001" idColor="var(--accent)" title="One server holds every board" age="1d" />
      <ListRow id="SB-030" title="A done row" age="9d" done />
    </div>
  ),
};

export const NavRowStory: StoryObj<typeof NavRow> = {
  name: 'NavRow',
  render: () => (
    <div style={{ width: 220 }}>
      <NavRow label="Inbox" count={12} active dot={<StatusDot state="live" color="var(--green)" />} />
      <NavRow label="Planned" count={4} />
      <NavRow label="Done" count={null} />
    </div>
  ),
};

export const SectionLabelStory: StoryObj<typeof SectionLabel> = {
  name: 'SectionLabel',
  render: () => (
    <div style={{ width: 320 }}>
      <SectionLabel dot={<StatusDot state="solid" color="var(--accent)" />} action={<Chip mono>3</Chip>}>Planned</SectionLabel>
    </div>
  ),
};
