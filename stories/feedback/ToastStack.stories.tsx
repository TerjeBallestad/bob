import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast, ToastStack } from '../../src';

export default {
  title: 'Feedback/ToastStack',
  component: ToastStack,
  argTypes: { children: { control: false, description: 'The toasts, oldest first.' } },
} satisfies Meta<typeof ToastStack>;

export const Default: StoryObj<typeof ToastStack> = {
  name: 'Bottom centre',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ height: '100vh' }}>
      <ToastStack><Toast>Saved.</Toast><Toast error>Could not save.</Toast></ToastStack>
    </div>
  ),
};
