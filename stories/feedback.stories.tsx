import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Modal, Toast, ToastStack } from '../src';

export default { title: 'Feedback' } satisfies Meta;

export const ModalStory: StoryObj<typeof Modal> = {
  name: 'Modal',
  parameters: { layout: 'fullscreen' },
  render: (args) => <div style={{ height: '100vh' }}><Modal {...args} /></div>,
  args: {
    open: true,
    title: 'Archive SB-042?',
    children: 'The ticket leaves the board. You can find it again under Archive.',
    footer: <><Button variant="ghost">Cancel</Button><Button variant="danger">Archive</Button></>,
  },
};

export const ToastStory: StoryObj<typeof Toast> = {
  name: 'Toast',
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      <Toast>Saved.</Toast>
      <Toast error>Could not save. The server did not answer.</Toast>
    </div>
  ),
};

export const ToastStackStory: StoryObj<typeof ToastStack> = {
  name: 'ToastStack',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ height: '100vh' }}>
      <ToastStack><Toast>Saved.</Toast><Toast error>Could not save.</Toast></ToastStack>
    </div>
  ),
};
