import type { Preview } from '@storybook/react-vite';
// The same stylesheet the package loads: tokens, fonts, base reset and keyframes.
import '../src/styles.css';
import pkg from '../package.json';
import { Tokens } from '../stories/tokens/model';
import { bobTheme } from './theme';

const tokenCss = import.meta.glob('../src/tokens/*.css', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: { disable: true },
    controls: { expanded: true },
    docs: { theme: bobTheme(new Tokens(...Object.values(tokenCss)), pkg.version), toc: { headingSelector: 'h2, h3' } },
    options: {
      storySort: {
        order: ['Foundations', ['Introduction', 'Tokens'], 'Core', 'Forms', 'Feedback', 'Board'],
      },
    },
  },
  tags: ['autodocs'],
};
export default preview;
