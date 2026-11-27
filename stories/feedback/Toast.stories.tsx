import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { expect, waitFor } from 'storybook/test';
import { Button, ToastStack, useToastManager, type ToastOptions } from '../../src';

// A toast is a call, not an element: toast.add({ title, description, type }). These stories
// add their toasts when they mount, with timeout 0, so a screenshot finds them on screen.
type Args = Pick<ToastOptions, 'title' | 'description' | 'type' | 'timeout'>;

function AddOnMount({ toasts }: { toasts: ToastOptions[] }) {
  const toast = useToastManager();
  useEffect(() => {
    const ids = toasts.map((t) => toast.add({ timeout: 0, ...t }));
    return () => ids.forEach((id) => toast.close(id));
    // The args change as a whole: show the new toasts in place of the old ones.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(toasts)]);
  return null;
}

export default {
  title: 'Feedback/Toast',
  argTypes: {
    title: { control: 'text', description: 'Two to five words, past tense, no subject: "Title updated", "SB-341 archived".' },
    description: { control: 'text', description: 'An optional second line, in a quieter colour.' },
    type: {
      control: 'inline-radio',
      options: ['success', 'error'],
      description: '`error` gives a red border and light red text, and a screen reader reads it at once (assertive).',
    },
    timeout: { control: 'number', description: 'Milliseconds before it closes itself. 0 keeps it until the user closes it. ToastStack sets the default, 4000.' },
  },
} satisfies Meta<Args>;

export const Default: StoryObj<Args> = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        code: `const toast = createToastManager();

<ToastStack toastManager={toast} />

toast.add({ title: 'Saved' });`,
      },
    },
  },
  render: (args) => (
    <div className="h-48">
      <ToastStack>
        <AddOnMount toasts={[args]} />
      </ToastStack>
    </div>
  ),
  args: { title: 'Saved', type: 'success' },
};

export const SuccessAndError: StoryObj = {
  name: 'Success and error',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        code: `toast.add({ title: 'Saved', description: 'SB-042 moved to Planned' });
toast.add({ title: 'Could not save', description: 'The server did not answer.', type: 'error' });`,
      },
    },
  },
  render: () => (
    <div className="h-48">
      <ToastStack>
        <AddOnMount
          toasts={[
            { title: 'Saved', description: 'SB-042 moved to Planned' },
            { title: 'Could not save', description: 'The server did not answer.', type: 'error' },
          ]}
        />
      </ToastStack>
    </div>
  ),
};

/** The usual wiring: a component inside the stack calls useToastManager().add. */
function SaveButtons() {
  const toast = useToastManager();
  return (
    <div className="flex h-screen items-center justify-center gap-2">
      <Button onClick={() => toast.add({ title: 'Title updated' })}>Save</Button>
      <Button variant="secondary" onClick={() => toast.add({ title: 'Could not save', type: 'error' })}>
        Save offline
      </Button>
    </div>
  );
}

/** An interaction test: each action adds a toast, a screen reader gets each one once, the focus stays where it was, and Close removes a toast. */
export const ShowToasts: StoryObj = {
  name: 'Show toasts (test)',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        code: `function SaveButton() {
  const toast = useToastManager();
  return <Button onClick={() => toast.add({ title: 'Title updated' })}>Save</Button>;
}

<ToastStack>
  <SaveButton />
</ToastStack>`,
      },
    },
  },
  render: () => (
    <ToastStack timeout={0}>
      <SaveButtons />
    </ToastStack>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    // The stack is in the page, empty, before the first toast. Two live regions sit beside it,
    // so a screen reader reads each new toast.
    const region = canvas.getByRole('region', { name: 'Notifications' });
    await expect(region).toHaveAttribute('aria-live', 'off');
    await expect(region).toBeEmptyDOMElement();
    const polite = canvasElement.querySelector('[data-bob-toast-announcer="polite"]')!;
    const assertive = canvasElement.querySelector('[data-bob-toast-announcer="assertive"]')!;
    await expect(polite).toHaveAttribute('aria-live', 'polite');
    await expect(assertive).toHaveAttribute('aria-live', 'assertive');

    const save = canvas.getByRole('button', { name: 'Save' });
    await userEvent.click(save);
    const saved = await canvas.findByRole('dialog', { name: 'Title updated' });
    // The toast fades in (toast-in), so it becomes visible a moment after it is added.
    await waitFor(() => expect(saved).toBeVisible());
    await expect(saved).not.toHaveClass('toast-error');
    await expect(save).toHaveFocus();
    await expect(polite).toHaveTextContent('Title updated');

    await userEvent.click(canvas.getByRole('button', { name: 'Save offline' }));
    const failed = await canvas.findByRole('dialog', { name: 'Could not save' });
    await expect(failed).toHaveClass('toast-error');
    await expect(assertive).toHaveTextContent('Could not save');
    await expect(polite).not.toHaveTextContent('Could not save');

    // Each toast has a Close button. Close removes the toast and its text.
    await userEvent.click(canvas.getAllByRole('button', { name: 'Close' })[0]);
    await waitFor(() => expect(canvas.queryByRole('dialog', { name: 'Could not save' })).toBeNull());
    await expect(assertive).toBeEmptyDOMElement();
    await expect(canvas.getByRole('dialog', { name: 'Title updated' })).toBeVisible();
  },
};
