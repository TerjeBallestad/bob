import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast } from '../../src';

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
  name: 'Success and error',
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      <Toast>Saved.</Toast>
      <Toast error>Could not save. The server did not answer.</Toast>
    </div>
  ),
};
