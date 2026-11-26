import type { Meta, StoryObj } from '@storybook/react-vite';
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
  render: (args) => <div style={{ height: '100vh' }}><Modal {...args} /></div>,
  args: {
    open: true,
    title: 'Archive SB-042?',
    children: 'The ticket leaves the board. You can find it again under Archive.',
    footer: <><Button variant="ghost">Cancel</Button><Button variant="danger">Archive</Button></>,
  },
};
