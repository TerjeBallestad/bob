import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Library build. One JS entry and one stylesheet (dist/bob.css).
// scripts/inject-css.mjs then adds `import './bob.css'` to dist/index.js, so
// `import { Button } from '@terjeballestad/bob'` loads the tokens and the
// component styles, the same as `import { Button } from '../ds'` did in Time Turtle.
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: () => 'index.js', cssFileName: 'bob' },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
    sourcemap: true,
  },
  css: { modules: { generateScopedName: 'bob_[name]_[local]_[hash:base64:5]' } },
});
