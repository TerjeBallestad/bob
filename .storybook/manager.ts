import { addons } from 'storybook/manager-api';
import { Tokens } from '../stories/tokens/model';
import { bobTheme } from './theme';

// main.ts puts Bob's token CSS and version on window (managerHead).
const bob = (window as unknown as { __BOB__: { css: string[]; version: string } }).__BOB__;

addons.setConfig({
  theme: bobTheme(new Tokens(...bob.css), bob.version),
  sidebar: { showRoots: true },
  ui: { enableShortcuts: true },
});
