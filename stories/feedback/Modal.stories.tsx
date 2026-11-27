import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn } from 'storybook/test';
import { Button, Modal } from '../../src';

export default {
  title: 'Feedback/Modal',
  component: Modal,
  argTypes: {
    open: { control: 'boolean', description: 'Renders nothing when false. The parent owns this state.' },
    title: { control: 'text', description: 'The heading (an `h2`). Phrase it as the decision: "Archive SB-042?".' },
    children: { control: 'text', description: 'The body: what happens, and what can be undone.' },
    footer: { control: false, description: 'The actions, right-aligned. Cancel first, the main action last.' },
    onClose: { description: 'Called by the × button and by a click on the backdrop. Set `open` to false in it.' },
    style: { control: false, description: 'Inline styles on the box, for example a `width`.' },
  },
} satisfies Meta<typeof Modal>;

export const Default: StoryObj<typeof Modal> = {
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div className="h-screen">
      <Modal {...args} />
    </div>
  ),
  args: {
    open: true,
    title: 'Archive SB-042?',
    children: 'The ticket leaves the board. You can find it again under Archive.',
    footer: <><Button variant="ghost">Cancel</Button><Button variant="danger">Archive</Button></>,
  },
};

/** The usual wiring: a button opens the dialog, and onClose sets `open` back to false. */
function ArchiveDialog({ onClose }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  const close = () => {
    setOpen(false);
    onClose?.();
  };
  return (
    <div className="grid h-screen place-items-center">
      <Button variant="danger-ghost" onClick={() => setOpen(true)}>Archive SB-042</Button>
      <Modal
        open={open}
        title="Archive SB-042?"
        onClose={close}
        footer={<><Button variant="ghost" onClick={close}>Cancel</Button><Button variant="danger" onClick={close}>Archive</Button></>}
      >
        The ticket leaves the board. You can find it again under Archive.
      </Modal>
    </div>
  );
}

/** An interaction test: it opens and closes the dialog by keyboard and by pointer. */
export const OpenAndClose: StoryObj<typeof ArchiveDialog> = {
  name: 'Open and close (test)',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      source: {
        code: `const [open, setOpen] = useState(false);

<Button variant="danger-ghost" onClick={() => setOpen(true)}>Archive SB-042</Button>
<Modal
  open={open}
  title="Archive SB-042?"
  onClose={() => setOpen(false)}
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="danger" onClick={archive}>Archive</Button>
    </>
  }
>
  The ticket leaves the board. You can find it again under Archive.
</Modal>`,
      },
    },
  },
  args: { onClose: fn() },
  render: (args) => <ArchiveDialog {...args} />,
  play: async ({ args, canvas, userEvent, step }) => {
    const opener = canvas.getByRole('button', { name: 'Archive SB-042' });

    await step('Enter on the opener opens the dialog', async () => {
      await userEvent.tab();
      await expect(opener).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      await expect(canvas.getByRole('heading', { name: 'Archive SB-042?' })).toBeVisible();
    });

    await step('Tab reaches the close button first, and Enter on it closes the dialog', async () => {
      await userEvent.tab();
      await expect(document.activeElement).toHaveClass('modal-close');
      await userEvent.keyboard('{Enter}');
      await expect(canvas.queryByRole('heading', { name: 'Archive SB-042?' })).toBeNull();
      await expect(args.onClose).toHaveBeenCalledTimes(1);
    });

    await step('A click inside the box keeps it open; a click on the backdrop closes it', async () => {
      await userEvent.click(opener);
      const heading = canvas.getByRole('heading', { name: 'Archive SB-042?' });
      await userEvent.click(heading);
      await expect(heading).toBeVisible();
      await expect(args.onClose).toHaveBeenCalledTimes(1);
      await userEvent.click(heading.closest('.modal')!);
      await expect(canvas.queryByRole('heading', { name: 'Archive SB-042?' })).toBeNull();
      await expect(args.onClose).toHaveBeenCalledTimes(2);
    });
  },
};
