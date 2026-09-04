/**
 * The public surface every framework package (`@hydrateless/react`, `/vue`,
 * `/svelte`) must export under the same names. Each package's test suite
 * checks its module against this list, so a component added to one binding
 * fails the others until they catch up.
 *
 * Presentational parts (CardTitle, ModalHeader, and so on) and framework-only
 * helpers are allowed to differ and aren't listed.
 */
export const COMPONENT_CONTRACT = [
  // Disclosure
  'Accordion',
  'AccordionItem',
  'Disclosure',
  // Tabs
  'Tabs',
  'TabList',
  'Tab',
  'TabPanel',
  // Dropdown
  'Dropdown',
  'DropdownTrigger',
  'DropdownMenu',
  'DropdownItem',
  'DropdownGroup',
  'DropdownSeparator',
  // Menu
  'Menu',
  'MenuItem',
  'MenuSubmenu',
  // Overlays
  'Modal',
  'ModalHeader',
  'ModalBody',
  'ModalFooter',
  'Drawer',
  'DrawerHeader',
  'DrawerBody',
  'DrawerFooter',
  'Popover',
  'Tooltip',
  // Breadcrumb
  'Breadcrumb',
  'BreadcrumbItem',
  // Combobox
  'Combobox',
  'ComboboxInput',
  'ComboboxList',
  'ComboboxOption',
  // Command palette
  'Command',
  'CommandInput',
  'CommandList',
  'CommandGroup',
  'CommandItem',
  'CommandEmpty',
  // Forms
  'Field',
  'FieldLabel',
  'FieldHelp',
  'FieldError',
  'Fieldset',
  'Input',
  'Textarea',
  'Select',
  'Checkbox',
  'Switch',
  'Slider',
  'RadioGroup',
  'Radio',
  'SegmentedControl',
  // Button
  'Button',
  // Feedback
  'Alert',
  'Badge',
  'Progress',
  'Spinner',
  'Skeleton',
  'ToastRegion',
  // Data display
  'Card',
  'CardHeader',
  'CardBody',
  'CardFooter',
  'CardTitle',
  'CardDescription',
  'Avatar',
  'AvatarGroup',
  'Kbd',
  'Separator',
  'Table',
  // Navigation
  'Pagination',
  'Toc',
  'SkipLink',
  // Low-level layer
  'useEnhancer',
  'useField',
  'useToast',
] as const;

/** Convenience hooks removed before 1.0; no package may bring them back. */
export const REMOVED_EXPORTS = [
  'useTabs',
  'useDropdown',
  'useTooltip',
  'useAccordion',
  'useModalGroup',
] as const;

/** Assert `names` (a module's `Object.keys`) satisfies the contract. */
export function missingFromContract(names: readonly string[]): string[] {
  return COMPONENT_CONTRACT.filter((name) => !names.includes(name));
}
