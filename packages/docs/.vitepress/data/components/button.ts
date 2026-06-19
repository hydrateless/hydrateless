import type { ComponentDoc, KnobValues } from '../types';

const attr = (name: string, value: unknown): string =>
  value === false || value == null || value === ''
    ? ''
    : value === true
      ? ` ${name}`
      : ` ${name}="${value}"`;

const label = (v: KnobValues): string => String(v.label || 'Save');

export const button: ComponentDoc = {
  slug: 'button',
  name: 'Button',
  category: 'Forms',
  importName: 'Button',
  summary: 'A native button styled with intent, variant, and size modifiers.',
  description:
    'A native `<button>` styled with intent, variant, and size modifiers. It keeps focus, form submission, and keyboard semantics for free, so there is nothing to enhance and no JavaScript to ship.',
  status: 'stable',
  cssOnly: true,
  native: '<button>',
  cssFile: 'button.css',
  demos: [
    {
      id: 'playground',
      title: 'Playground',
      description:
        'Every modifier maps to a `data-hl-*` attribute (or a prop in the framework bindings).',
      layout: 'center',
      knobs: [
        { id: 'label', type: 'text', label: 'Label', default: 'Save changes' },
        {
          id: 'intent',
          type: 'select',
          label: 'Intent',
          options: ['neutral', 'primary', 'danger', 'success', 'warning', 'info'],
          default: 'primary',
        },
        {
          id: 'variant',
          type: 'select',
          label: 'Variant',
          options: ['solid', 'soft', 'outline', 'ghost', 'link'],
          default: 'solid',
        },
        { id: 'size', type: 'select', label: 'Size', options: ['sm', 'md', 'lg'], default: 'md' },
        { id: 'block', type: 'boolean', label: 'Full width', default: false },
        { id: 'loading', type: 'boolean', label: 'Loading', default: false },
        { id: 'disabled', type: 'boolean', label: 'Disabled', default: false },
      ],
      render: (v) =>
        `<button class="hl-button"${attr('data-hl-intent', v.intent)}${attr('data-hl-variant', v.variant)}${attr(
          'data-hl-size',
          v.size,
        )}${attr('data-hl-block', v.block)}${attr('data-hl-loading', v.loading)}${attr('disabled', v.disabled)}>${label(v)}</button>`,
      code: {
        html: (v) =>
          `<button class="hl-button"${attr('data-hl-intent', v.intent)}${attr('data-hl-variant', v.variant)}${attr(
            'data-hl-size',
            v.size,
          )}${attr('data-hl-block', v.block)}${attr('data-hl-loading', v.loading)}${attr('disabled', v.disabled)}>${label(v)}</button>`,
        react: (v) =>
          `import { Button } from '@hydrateless/react';\n\n<Button intent="${v.intent}" variant="${v.variant}" size="${v.size}"${
            v.block ? ' block' : ''
          }${v.loading ? ' loading' : ''}${v.disabled ? ' disabled' : ''}>\n  ${label(v)}\n</Button>`,
        vue: (v) =>
          `<script setup>\nimport { Button } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Button intent="${v.intent}" variant="${v.variant}" size="${v.size}"${
            v.block ? ' block' : ''
          }${v.loading ? ' loading' : ''}${v.disabled ? ' disabled' : ''}>${label(v)}</Button>\n</template>`,
        svelte: (v) =>
          `<script>\n  import { Button } from '@hydrateless/svelte';\n</script>\n\n<Button intent="${v.intent}" variant="${v.variant}" size="${v.size}"${
            v.block ? ' block' : ''
          }${v.loading ? ' loading' : ''}${v.disabled ? ' disabled' : ''}>${label(v)}</Button>`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      description: 'The five variants pair with any intent.',
      layout: 'row',
      render: () =>
        `<button class="hl-button" data-hl-variant="solid" data-hl-intent="primary">Solid</button>
<button class="hl-button" data-hl-variant="soft" data-hl-intent="primary">Soft</button>
<button class="hl-button" data-hl-variant="outline" data-hl-intent="neutral">Outline</button>
<button class="hl-button" data-hl-variant="ghost" data-hl-intent="danger">Ghost</button>
<button class="hl-button" data-hl-variant="link" data-hl-intent="primary">Link</button>`,
    },
    {
      id: 'icon',
      title: 'Icon and loading',
      description:
        'Use `data-hl-icon` for square icon-only buttons and `data-hl-loading` to show a spinner.',
      layout: 'row',
      render: () =>
        `<button class="hl-button" data-hl-intent="primary" data-hl-icon aria-label="Add">+</button>
<button class="hl-button" data-hl-intent="primary" data-hl-loading>Saving</button>
<button class="hl-button" data-hl-variant="outline" disabled>Disabled</button>`,
    },
  ],
  props: [
    {
      name: 'intent',
      type: `'neutral' | 'primary' | 'danger' | 'success' | 'warning' | 'info'`,
      default: `'neutral'`,
      description: 'Semantic color role.',
    },
    {
      name: 'variant',
      type: `'solid' | 'soft' | 'outline' | 'ghost' | 'link'`,
      default: `'solid'`,
      description: 'Visual emphasis.',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Control height and padding.',
    },
    {
      name: 'block',
      type: 'boolean',
      default: 'false',
      description: 'Stretch to the full width of the container.',
    },
    {
      name: 'icon',
      type: 'boolean',
      default: 'false',
      description: 'Render a square, icon-only button.',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'Show a spinner and disable interaction.',
    },
  ],
  tokens: [
    { name: '--hl-primary', description: 'Solid background for the primary intent.' },
    { name: '--hl-primary-hover', description: 'Hover background for the primary intent.' },
    { name: '--hl-radius-md', description: 'Corner radius.' },
    { name: '--hl-control-height-md', description: 'Default height.' },
    { name: '--hl-focus-ring', description: 'Focus outline.' },
  ],
  a11y: [
    'Renders a real `<button>`, so Enter/Space activation, focus order, and form submission are native.',
    'Icon-only buttons need an `aria-label`; the docs example sets one.',
    'The loading state sets `disabled`, which both blocks clicks and removes the control from the tab order.',
    'Focus is always visible through the shared `--hl-focus-ring` token.',
  ],
  related: ['badge', 'segmented-control', 'dropdown'],
};
