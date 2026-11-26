import type { StorybookConfig } from '@storybook/react-vite';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import remarkGfm from 'remark-gfm';

const root = join(import.meta.dirname, '..');
const tokenDir = join(root, 'src/tokens');
const version = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version as string;

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.tsx'],
  addons: [
    // GitHub tables in the docs pages.
    { name: '@storybook/addon-docs', options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } } },
    // axe in the Storybook panel (the same rules as visual/axe.ts).
    '@storybook/addon-a11y',
    // Forces :hover and :focus-visible for the state stories (stories/states/).
    'storybook-addon-pseudo-states',
  ],
  typescript: { reactDocgen: 'react-docgen-typescript' },
  core: { disableTelemetry: true },
  // The manager theme (theme.ts) reads Bob's tokens, and the manager cannot import CSS, so the
  // token files go to it as text. The fonts are Bob's own.
  // Docs tables in Bob's colours: Storybook's dark stripe is lighter than any Bob surface.
  previewHead: (head) => `${head}
<style>
  .sbdocs.sbdocs-content table { border-collapse: collapse; font-size: 14px; }
  .sbdocs.sbdocs-content table tr,
  .sbdocs.sbdocs-content table tr:nth-of-type(2n) { background: var(--surface-card); border-top: 1px solid var(--border); }
  .sbdocs.sbdocs-content table th { text-align: left; color: var(--text-2); font-weight: 600; background: var(--surface-sidebar); }
  .sbdocs.sbdocs-content table th, .sbdocs.sbdocs-content table td { border: 1px solid var(--border); padding: 8px 14px; }
</style>`,
  managerHead: (head) => {
    const css = readdirSync(tokenDir)
      .filter((f) => f.endsWith('.css'))
      .map((f) => readFileSync(join(tokenDir, f), 'utf8'));
    return `${head}
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" />
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='#15161b'/><circle cx='16' cy='16' r='7' fill='#7b83eb'/></svg>")}" />
<script>window.__BOB__ = ${JSON.stringify({ css, version }).replace(/</g, '\\u003c')};</script>`;
  },
};
export default config;

