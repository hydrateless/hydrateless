// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as pkg from './index.js';
import { missingFromContract, REMOVED_EXPORTS } from '../../../test-setup/component-contract.js';

const dist = fileURLToPath(new URL('../dist/index.js', import.meta.url));

describe('package surface', () => {
  it('exports every component in the shared contract', () => {
    expect(missingFromContract(Object.keys(pkg))).toEqual([]);
  });

  it('does not export the removed convenience hooks', () => {
    for (const name of REMOVED_EXPORTS) expect(pkg).not.toHaveProperty(name);
  });

  // The bundle is only present after `npm run build` (CI builds before testing).
  it.skipIf(!existsSync(dist))('starts with the use client directive', () => {
    expect(readFileSync(dist, 'utf8').startsWith("'use client';")).toBe(true);
  });
});
