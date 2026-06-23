import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
// Emulate the Popover API, Invoker Commands, and <dialog> methods that the
// overlay enhancers build on but jsdom doesn't implement.
import '../../test-setup/jsdom-platform.js';

if (typeof globalThis.CSS === 'undefined') {
  (globalThis as Record<string, unknown>).CSS = {
    escape: (value: string) => value.replace(/([^\w-])/g, (match) => `\\${match}`),
  };
}

afterEach(() => {
  cleanup();
});
