import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { ToastStack, useToastManager } from '../../src';

export default {
  title: 'Feedback/ToastStack',
  component: ToastStack,
  argTypes: {
    children: { control: false, description: 'The app. A component inside it can call `useToastManager()`.' },
    toastManager: { control: false, description: 'A manager from `createToastManager()`, to add toasts from anywhere, also outside React.' },
    timeout: { control: 'number', description: 'Milliseconds before a toast closes itself. 0 keeps it until the user closes it.' },
    limit: { control: 'number', description: 'The most toasts on screen at once. An older one waits, hidden, until a newer one closes.' },
  },
} satisfies Meta<typeof ToastStack>;

function ThreeToasts() {
  const toast = useToastManager();
  useEffect(() => {
    const ids = [
      toast.add({ title: 'SB-341 archived' }),
      toast.add({ title: 'Title updated' }),
      toast.add({ title: 'Could not save', type: 'error' }),
    ];
    return () => ids.forEach((id) => toast.close(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export const Default: StoryObj<typeof ToastStack> = {
  name: 'Bottom centre',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        code: `const toast = createToastManager();

<ToastStack toastManager={toast}>
  <App />
</ToastStack>`,
      },
    },
  },
  render: (args) => (
    <div className="h-screen">
      <ToastStack {...args}>
        <ThreeToasts />
      </ToastStack>
    </div>
  ),
  args: { timeout: 0, limit: 3 },
};
