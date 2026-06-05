if (typeof globalThis.CSS === 'undefined') {
  (globalThis as Record<string, unknown>).CSS = {
    escape: (value: string) => value.replace(/([^\w-])/g, (match) => `\\${match}`),
  };
}
