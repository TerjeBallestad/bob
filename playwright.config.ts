import { defineConfig } from '@playwright/test';

// Screenshot tests over the built Storybook (npm run build-storybook first).
// Baselines are taken in the Playwright Linux image, never on macOS, because
// font rendering differs between the two. Run them with `npm run test:visual:docker`.
export default defineConfig({
  testDir: 'visual',
  testMatch: '*.visual.ts',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  // reducedMotion: Bob's animations run only under motion-safe, so none runs in a test, and the
  // live pulse cannot add pixel noise. animations: 'disabled' below stops anything else.
  use: { baseURL: 'http://127.0.0.1:6007', viewport: { width: 800, height: 600 }, deviceScaleFactor: 1, reducedMotion: 'reduce' },
  expect: { toHaveScreenshot: { maxDiffPixels: 0, animations: 'disabled' } },
  webServer: {
    command: 'npx http-server storybook-static -p 6007 -a 127.0.0.1 -s',
    url: 'http://127.0.0.1:6007/index.json',
    reuseExistingServer: !process.env.CI,
  },
});
