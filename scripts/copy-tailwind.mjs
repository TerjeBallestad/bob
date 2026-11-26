// Copy the Tailwind entry to dist/: dist/tailwind.css with the token and component CSS it
// imports, at the same relative paths. An app's Tailwind build reads these files (DD-031).
import { cpSync, existsSync } from 'node:fs';

if (!existsSync('dist/index.js')) throw new Error('dist/index.js is missing: run vite build first');
cpSync('src/tailwind.css', 'dist/tailwind.css');
cpSync('src/tokens', 'dist/tokens', { recursive: true });
cpSync('src/tailwind', 'dist/tailwind', { recursive: true });
