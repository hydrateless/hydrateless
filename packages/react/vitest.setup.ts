import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

if (typeof globalThis.CSS === 'undefined') {
  (globalThis as Record<string, unknown>).CSS = {
    escape: (value: string) => value.replace(/([^\w-])/g, (match) => `\\${match}`),
  };
}

afterEach(() => {
  cleanup();
});
