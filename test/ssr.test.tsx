import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { samples } from './samples';

// Server rendering, in Node with no DOM. render.test.tsx and tailwind.test.tsx render in
// happy-dom, because Modal's dialog is a portal. This file keeps server rendering covered:
// every sample renders to a string without throwing. A closed or open Modal renders nothing on
// the server (Base UI mounts the portal in the browser).
describe('server rendering', () => {
  for (const [name, sample] of Object.entries(samples)) {
    it(`${name} renders to a string in Node`, () => {
      expect(typeof document).toBe('undefined');
      const html = renderToString(sample());
      expect(typeof html).toBe('string');
      if (name !== 'Modal') expect(html.length).toBeGreaterThan(0);
    });
  }
});
