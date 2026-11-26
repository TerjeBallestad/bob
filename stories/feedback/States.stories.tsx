import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button, Modal } from '../../src';

// The modal with keyboard focus on its close button, and a modal behind a trigger for the
// keyboard checks in visual/keyboard.visual.ts.
export default { title: 'Feedback/States', tags: ['!autodocs'] } satisfies Meta;

const noop = () => {};

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
