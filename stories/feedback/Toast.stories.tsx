import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, waitFor } from 'storybook/test';
import { Button, Toast, ToastStack } from '../../src';

export default {
  title: 'Feedback/Toast',
  component: Toast,
  argTypes: {
    children: { control: 'text', description: 'Two to five words, past tense, no subject: "Title updated", "SB-341 archived".' },
    error: { control: 'boolean', description: 'A red border and light red text, for an action that failed.' },
    style: { control: false, description: 'Inline styles, merged last.' },
  },
} satisfies Meta<typeof Toast>;

export const Default: StoryObj<typeof Toast> = {
  render: (args) => <Toast {...args} />,
  args: { children: 'Saved.', error: false },
};

export const SuccessAndError: StoryObj = {
  name: 'Success and error',
  render: () => (
    <div className="grid gap-2">
      <Toast>Saved.</Toast>
      <Toast error>Could not save. The server did not answer.</Toast>
    </div>
  ),
};

/** The usual wiring: the app keeps a list of toasts and renders them in a ToastStack. */
function SaveWithToasts() {
  const [toasts, setToasts] = useState<{ id: number; text: string; error?: boolean }[]>([]);
  const push = (text: string, error?: boolean) => setToasts((t) => [...t, { id: t.length, text, error }]);
  return (
    <div className="flex h-screen items-center justify-center gap-2">
      <Button onClick={() => push('Title updated')}>Save</Button>
      <Button variant="secondary" onClick={() => push('Could not save', true)}>Save offline</Button>
      <ToastStack>
        {toasts.map((t) => <Toast key={t.id} error={t.error}>{t.text}</Toast>)}
      </ToastStack>
    </div>
  );
}

/** An interaction test: each action adds a toast to the stack, and the focus stays where it was. */
export const ShowToasts: StoryObj = {
  name: 'Show toasts (test)',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        code: `const [toasts, setToasts] = useState([]);
const push = (text, error) => setToasts((t) => [...t, { id: t.length, text, error }]);

<Button onClick={() => push('Title updated')}>Save</Button>
<ToastStack>
  {toasts.map((t) => <Toast key={t.id} error={t.error}>{t.text}</Toast>)}
</ToastStack>`,
      },
    },
  },
  render: () => <SaveWithToasts />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const save = canvas.getByRole('button', { name: 'Save' });
    await userEvent.click(save);
    const saved = canvas.getByText('Title updated');
    // The toast fades in (toast-in), so it becomes visible a moment after it is added.
    await waitFor(() => expect(saved).toBeVisible());
    await expect(saved).not.toHaveClass('toast-error');
    await expect(save).toHaveFocus();

    await userEvent.click(canvas.getByRole('button', { name: 'Save offline' }));
    await expect(canvas.getByText('Could not save')).toHaveClass('toast-error');

    // Both sit in the one stack, oldest first.
    const stack = canvasElement.querySelector('.toast-stack')!;
    await expect([...stack.children].map((t) => t.textContent)).toEqual(['Title updated', 'Could not save']);
  },
};
