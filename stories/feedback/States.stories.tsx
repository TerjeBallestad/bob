import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, screen, waitFor } from 'storybook/test';
import { Button, Modal, ToastStack, useToastManager } from '../../src';

// The modal with keyboard focus on its close button, and a modal and a toast stack behind
// triggers for the keyboard checks in visual/keyboard.visual.ts.
export default { title: 'Feedback/States', tags: ['!autodocs'] } satisfies Meta;

const noop = () => {};

// The dialog renders in a portal outside the story's root, where the pseudo-states addon does
// not reach. So the play function focuses the close button the way a keyboard user does: the
// dialog takes focus when it opens, and Tab moves it to the × button.
export const ModalFocus: StoryObj = {
  name: 'Modal focus',
  parameters: { layout: 'fullscreen' },
  play: async ({ userEvent }) => {
    await waitFor(() => expect(screen.getByRole('dialog')).toHaveFocus());
    await userEvent.tab();
    await expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  },
  render: () => (
    <div className="h-screen">
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
  // A demo with state: the code block shows the usage, not the demo.
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        code: `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open</Button>
<Modal open={open} title="Archive SB-042?" onClose={() => setOpen(false)} footer={…}>
  The ticket leaves the board.
</Modal>`,
      },
    },
  },
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <div className="grid h-screen place-items-center">
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
};

// Buttons that add toasts, for the keyboard and timer checks in visual/keyboard.visual.ts. The
// toasts close themselves after 1.5 seconds, so a test can watch the timer and its pause.
function ToastButtons() {
  const toast = useToastManager();
  return (
    <div className="flex h-screen items-center justify-center gap-2">
      <Button onClick={() => toast.add({ title: 'Title updated' })}>Save</Button>
      <Button variant="secondary" onClick={() => toast.add({ title: 'Could not save', description: 'The server did not answer.', type: 'error' })}>
        Fail
      </Button>
    </div>
  );
}

export const ToastKeyboard: StoryObj = {
  name: 'Toast keyboard',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        code: `<ToastStack timeout={1500}>
  <SaveButtons />
</ToastStack>`,
      },
    },
  },
  render: () => (
    <ToastStack timeout={1500}>
      <ToastButtons />
    </ToastStack>
  ),
};
