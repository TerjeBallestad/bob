import type { StorybookConfig } from '@storybook/react-vite';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const tokenDir = join(root, 'src/tokens');
const version = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version as string;

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs'],
  typescript: { reactDocgen: 'react-docgen-typescript' },
  core: { disableTelemetry: true },
  // The manager theme (theme.ts) reads Bob's tokens, and the manager cannot import CSS, so the
  // token files go to it as text. The fonts are Bob's own.
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

