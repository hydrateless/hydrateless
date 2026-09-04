import { describe, it, expect } from 'vitest';
import * as pkg from '../src/index.js';
import { missingFromContract, REMOVED_EXPORTS } from '../../../test-setup/component-contract.js';

describe('package surface', () => {
  it('exports every component in the shared contract', () => {
    expect(missingFromContract(Object.keys(pkg))).toEqual([]);
  });

  it('does not export the removed convenience hooks', () => {
    for (const name of REMOVED_EXPORTS) expect(pkg).not.toHaveProperty(name);
  });
});
