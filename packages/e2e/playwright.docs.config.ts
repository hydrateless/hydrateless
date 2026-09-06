import { defineConfig, devices } from '@playwright/test';
import process from 'node:process';

const baseURL = `http://127.0.0.1:${process.env.HL_DOCS_PORT ?? 4181}`;

/** Exercise the actual production docs, including Vue hydration and CSS isolation. */
export default defineConfig({
  testDir: './docs',
  outputDir: './docs-test-results',
  timeout: 90_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: 'list',
  use: { baseURL, trace: 'on-first-retry' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: `npm -w @hydrateless/docs run docs:preview -- --host 127.0.0.1 --port ${process.env.HL_DOCS_PORT ?? 4181}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
