import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip, ListRow, NavRow, TicketCard } from '../../src';
import { StateGrid, cells } from '../shared/StateGrid';

// Rows, cards and nav rows in each state. A row or card with onClick is a keyboard control
// (role button, Tab, Enter and Space), so it shows the focus ring too.
export default { title: 'Board/States', tags: ['!autodocs'] } satisfies Meta;

// Counts clicks in window.bobClicks, for the keyboard checks in visual/keyboard.visual.ts.
const noop = () => {
  const w = window as unknown as { bobClicks?: number };
  w.bobClicks = (w.bobClicks ?? 0) + 1;
};
const ROW_STATES = ['rest', 'hover', 'focus'] as const;

// The grids are test fixtures, so each code block shows the control as an app writes it.
export const Rows: StoryObj = {
  parameters: {
    pseudo: { hover: cells(['row', 'done'], 'hover'), focusVisible: cells(['row', 'done'], 'focus') },
    docs: { source: { code: '<ListRow id="SB-042" title="The id counter" meta={<Chip mono>task</Chip>} onClick={open} />' } },
  },
  render: () => (
    <StateGrid
      states={ROW_STATES}
      rows={['row', 'done']}
      width={210}
      cell={(r) => <ListRow id="SB-042" title="The id counter" meta={<Chip mono>task</Chip>} done={r === 'done'} onClick={noop} />}
    />
  ),
};

export const Cards: StoryObj = {
  parameters: {
    pseudo: { hover: cells(['card', 'live'], 'hover'), focusVisible: cells(['card', 'live'], 'focus') },
    docs: { source: { code: '<TicketCard id="SB-042" kind="task" title="The id counter refuses a second SB-042" age="2d" live onClick={open} />' } },
  },
  render: () => (
    <StateGrid
      states={ROW_STATES}
      rows={['card', 'live']}
      width={200}
      cell={(r) => (
        <TicketCard id="SB-042" kind="task" title="The id counter refuses a second SB-042" age="2d" live={r === 'live'} onClick={noop} />
      )}
    />
  ),
};

export const NavRows: StoryObj = {
  name: 'NavRow',
  parameters: {
    pseudo: { hover: cells(['nav-row', 'active'], 'hover'), focusVisible: cells(['nav-row', 'active'], 'focus') },
    docs: { source: { code: '<NavRow label="Inbox" count={12} active onClick={goToInbox} />' } },
  },
  render: () => (
    <StateGrid
      states={ROW_STATES}
      rows={['nav-row', 'active']}
      width={180}
      cell={(r) => <NavRow label="Inbox" count={12} active={r === 'active'} />}
    />
  ),
};
