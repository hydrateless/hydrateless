/** Named keyboard keys, to avoid magic strings scattered across enhancers. */
export const Keys = {
  Enter: 'Enter',
  Space: ' ',
  Escape: 'Escape',
  Tab: 'Tab',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Home: 'Home',
  End: 'End',
  PageUp: 'PageUp',
  PageDown: 'PageDown',
} as const;

/**
 * Whether a keydown should feed a typeahead buffer: a single printable
 * character with no Ctrl/Meta/Alt modifier.
 */
export function isTypeaheadKey(e: KeyboardEvent): boolean {
  return e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
}

/** Clamp/wrap an index into `[0, length)`. */
export function wrapIndex(index: number, length: number): number {
  if (length <= 0) return -1;
  return ((index % length) + length) % length;
}

/** Direction argument for {@link nextIndex} list navigation. */
export type MoveDirection = 'next' | 'prev' | 'first' | 'last';

/** Compute the next index for list navigation, optionally looping at the ends. */
export function nextIndex(
  current: number,
  length: number,
  direction: MoveDirection,
  loop = true,
): number {
  if (length <= 0) return -1;
  switch (direction) {
    case 'first':
      return 0;
    case 'last':
      return length - 1;
    case 'next':
      return loop ? wrapIndex(current + 1, length) : Math.min(current + 1, length - 1);
    case 'prev':
      return loop ? wrapIndex(current - 1, length) : Math.max(current - 1, 0);
  }
}

/**
 * Build a typeahead matcher. Repeated keystrokes within `timeout` accumulate
 * into a search string; returns the index of the first item whose text starts
 * with the buffer, searching forward from `from`.
 */
export function createTypeahead(timeout = 500) {
  let buffer = '';
  let last = 0;

  return function match(char: string, labels: string[], from: number): number {
    const now = Date.now();
    if (now - last > timeout) buffer = '';
    last = now;
    buffer += char.toLowerCase();

    const ordered = [...labels.slice(from + 1), ...labels.slice(0, from + 1)];
    const offset = from + 1;
    const found = ordered.findIndex((label) => label.trim().toLowerCase().startsWith(buffer));
    if (found === -1) return -1;
    return (offset + found) % labels.length;
  };
}
