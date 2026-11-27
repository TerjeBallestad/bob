import type { Preview } from '@storybook/react-vite';
// The same stylesheet the package loads: tokens, fonts, base reset and keyframes.
import '../src/styles.css';
// Tailwind utilities for the layout wrappers in the stories.
import './tailwind.css';
import pkg from '../package.json';
import { Tokens } from '../stories/tokens/model';
import { bobTheme } from './theme';

const tokenCss = import.meta.glob('../src/tokens/*.css', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: { disable: true },
    controls: { expanded: true },
    // "Show code" prints the rendered JSX, so a story's code block reads like app code. A story
    // with state sets parameters.docs.source.code to its usage instead.
    // Props print in the order the story writes them, on one line while they fit.
    jsx: { sortProps: false, maxInlineAttributesLineLength: 100 },
    docs: { source: { type: 'dynamic' }, theme: bobTheme(new Tokens(...Object.values(tokenCss)), pkg.version), toc: { headingSelector: 'h2, h3' } },
    options: {
      storySort: {
        order: ['Foundations', ['Introduction', 'Tokens'], 'Core', 'Forms', 'Feedback', 'Board'],
      },
    },
    // The a11y panel checks WCAG 2.2 AA, as visual/a11y.visual.ts does.
    a11y: { options: { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } },
  },
};
export default preview;
