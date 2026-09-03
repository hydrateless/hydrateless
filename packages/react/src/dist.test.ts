// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as pkg from './index.js';

const dist = fileURLToPath(new URL('../dist/index.js', import.meta.url));

/** The component list every framework package must export (shared contract). */
const COMPONENTS = [
  'Accordion',
  'AccordionItem',
  'Alert',
  'Avatar',
  'Badge',
  'Breadcrumb',
  'BreadcrumbItem',
  'Button',
  'Card',
  'CardHeader',
  'CardBody',
  'CardFooter',
  'Checkbox',
  'Combobox',
  'ComboboxOption',
  'Command',
  'CommandGroup',
  'CommandItem',
  'CommandEmpty',
  'Disclosure',
  'Drawer',
  'Dropdown',
  'DropdownItem',
  'DropdownGroup',
  'DropdownSeparator',
  'Field',
  'Input',
  'Kbd',
  'Menu',
  'MenuItem',
  'MenuSubmenu',
  'Modal',
  'Pagination',
  'Popover',
  'Progress',
  'RadioGroup',
  'Radio',
  'SegmentedControl',
  'Select',
  'Separator',
  'Skeleton',
  'SkipLink',
  'Slider',
  'Spinner',
  'Switch',
  'Table',
  'Tabs',
  'Tab',
  'TabPanel',
  'Textarea',
  'Toc',
  'ToastRegion',
  'useToast',
  'Tooltip',
  'useEnhancer',
  'useField',
];

describe('package surface', () => {
  it('exports every component in the shared contract', () => {
    const names = Object.keys(pkg);
    for (const name of COMPONENTS) expect(names, name).toContain(name);
  });

  it('does not export the removed convenience hooks', () => {
    for (const name of ['useTabs', 'useDropdown', 'useTooltip', 'useAccordion', 'useModalGroup']) {
      expect(pkg).not.toHaveProperty(name);
    }
  });

  // The bundle is only present after `npm run build` (CI builds before testing).
  it.skipIf(!existsSync(dist))('starts with the use client directive', () => {
    expect(readFileSync(dist, 'utf8').startsWith("'use client';")).toBe(true);
  });
});
