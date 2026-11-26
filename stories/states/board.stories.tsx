import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button, Chip, ListRow, Modal, TicketCard } from '../../src';
import { StateGrid, cells } from './states';

// Rows, cards and the modal in each state. A row or card with onClick is a keyboard control
// (role button, Tab, Enter and Space), so it shows the focus ring too.
export default { title: 'States/Board', tags: ['!autodocs'] } satisfies Meta;

// Counts clicks in window.bobClicks, for the keyboard checks in visual/keyboard.visual.ts.
const noop = () => {
  const w = window as unknown as { bobClicks?: number };
  w.bobClicks = (w.bobClicks ?? 0) + 1;
};
const ROW_STATES = ['rest', 'hover', 'focus'] as const;

export const Rows: StoryObj = {
  parameters: { pseudo: { hover: cells(['row', 'done'], 'hover'), focusVisible: cells(['row', 'done'], 'focus') } },
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
  parameters: { pseudo: { hover: cells(['card', 'live'], 'hover'), focusVisible: cells(['card', 'live'], 'focus') } },
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

export const ModalFocus: StoryObj = {
  name: 'Modal focus',
  parameters: { layout: 'fullscreen', pseudo: { focusVisible: ['.modal-close'] } },
  render: () => (
    <div style={{ height: '100vh' }}>
      <Modal
        title="Archive SB-042?"
        onClose={noop}
        footer={
          <>
            <Button variant="ghost">Cancel</Button>
            <Button variant="danger">Archive</Button>
          </>
        }
      >
        The ticket leaves the board. You can find it again under Archive.
      </Modal>
    </div>
  ),
};

// A trigger that opens the modal, for the keyboard checks in visual/keyboard.visual.ts.
export const ModalKeyboard: StoryObj = {
  name: 'Modal keyboard',
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Modal
          open={open}
          title="Archive SB-042?"
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="danger">Archive</Button>
            </>
          }
        >
          The ticket leaves the board.
        </Modal>
      </div>
    );
  },
  parameters: { layout: 'fullscreen' },
};
