import type { KnobValues } from '../types';

/**
 * Serialize one HTML attribute from a knob value: booleans render as bare
 * attributes (or nothing), empty/nullish values are dropped, everything else
 * renders as `name="value"`. Keeps the demo `render` functions terse.
 */
export const attr = (name: string, value: unknown): string =>
  value === false || value == null || value === ''
    ? ''
    : value === true
      ? ` ${name}`
      : ` ${name}="${value}"`;

/** The six semantic intents every themed component shares. */
export const INTENTS = ['neutral', 'primary', 'danger', 'success', 'warning', 'info'];

/** Read a knob value as a string with a fallback. */
export const str = (v: KnobValues, key: string, fallback = ''): string =>
  v[key] == null ? fallback : String(v[key]);
