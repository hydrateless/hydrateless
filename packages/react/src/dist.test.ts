// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as pkg from './index.js';
import { missingFromContract, REMOVED_EXPORTS } from '../../../test-setup/component-contract.js';

const distIndex = fileURLToPath(new URL('../dist/index.js', import.meta.url));
const distServer = fileURLToPath(new URL('../dist/server.js', import.meta.url));
const distClient = fileURLToPath(new URL('../dist/client.js', import.meta.url));

describe('package surface', () => {
  it('exports every component in the shared contract', () => {
    expect(missingFromContract(Object.keys(pkg))).toEqual([]);
  });

  it('does not export the removed convenience hooks', () => {
    for (const name of REMOVED_EXPORTS) expect(pkg).not.toHaveProperty(name);
  });

  // The bundle is only present after `npm run build` (CI builds before testing).
  it.skipIf(!existsSync(distClient))(
    'keeps server entry hook-free and client entry marked use client',
    () => {
      const indexSrc = readFileSync(distIndex, 'utf8');
      const serverSrc = readFileSync(distServer, 'utf8');
      const clientSrc = readFileSync(distClient, 'utf8');

      expect(indexSrc.startsWith("'use client';")).toBe(false);
      expect(serverSrc.startsWith("'use client';")).toBe(false);
      expect(serverSrc).not.toMatch(/\b(useState|useEffect|useContext|createContext|useRef)\b/);
      expect(serverSrc).not.toContain('@hydrateless/enhancers');
      expect(clientSrc.startsWith("'use client';")).toBe(true);
    },
  );
});
