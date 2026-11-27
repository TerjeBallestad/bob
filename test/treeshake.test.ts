import { describe, expect, it } from 'vitest';
import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';

// An app that imports one component pays only for it. Base UI is large (Select alone is about
// 49 kB gzip), so a top-level read such as `const Select = SelectPrimitive.Root` would put all
// of it into every app that imports Bob. This bundles a one-import app from the built package,
// as an app's bundler does (esbuild is Vite's), with React external.
async function gzipOf(name: string) {
  const out = await build({
    stdin: { contents: `import { ${name} } from './dist/index.js'; console.log(${name});`, resolveDir: process.cwd() },
    bundle: true,
    minify: true,
    format: 'esm',
    write: false,
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    loader: { '.css': 'empty' },
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'silent',
  });
  return gzipSync(out.outputFiles[0].contents).length;
}

describe('tree shaking', () => {
  it('an app that imports only Button gets no Base UI', async () => {
    expect(await gzipOf('Button')).toBeLessThan(2000);
  });

  // Budgets, measured at Bob 1.0 with @base-ui/react 1.9.0: ToastStack 31.4 kB, Select 48.8 kB.
  it('ToastStack and Select stay within their budgets', async () => {
    expect(await gzipOf('ToastStack')).toBeLessThan(34000);
    expect(await gzipOf('Select')).toBeLessThan(52000);
  });
});
