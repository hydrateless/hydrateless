import { defineConfig, devices } from '@playwright/test';
import process from 'node:process';

const PORT = Number(process.env.HL_E2E_PORT ?? 4180);
const HOST = '127.0.0.1';
const baseURL = `http://${HOST}:${PORT}`;
const isCI = Boolean(process.env.CI);

/**
 * Real-browser suite. Fixtures are static HTML served from the repo root so
 * they can link the built CSS bundle and the self-contained CDN auto bundle by
 * absolute path. The same pages run with JavaScript off (the no-JS baseline the
 * library promises) and on (the enhancer-upgraded experience), across the three
 * engines that make up the modern Baseline.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: `node server.mjs ${PORT}`,
    url: `${baseURL}/packages/e2e/fixtures/index.html`,
    reuseExistingServer: !isCI,
    timeout: 30_000,
  },
});
