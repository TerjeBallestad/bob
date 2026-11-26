import type { Preview } from '@storybook/react-vite';
// The same stylesheet the package loads: tokens, fonts, base reset and keyframes.
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: { disable: true },
    controls: { expanded: true },
    options: {
      storySort: {
        order: ['Foundations', ['Introduction', 'Tokens'], 'Core', 'Forms', 'Feedback', 'Board'],
      },
    },
  },
  tags: ['autodocs'],
};
export default preview;
