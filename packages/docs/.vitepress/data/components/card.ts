import type { ComponentDoc } from '../types';
import { attr } from './_util';

export const card: ComponentDoc = {
  slug: 'card',
  name: 'Card',
  category: 'Data Display',
  importName: 'Card',
  summary: 'A surface for grouping related content.',
  description:
    'A surface for grouping related content, with optional header, body, and footer regions. CSS-only.',
  status: 'stable',
  cssOnly: true,
  cssFile: 'card.css',
  demos: [
    {
      id: 'playground',
      title: 'Playground',
      layout: 'center',
      knobs: [{ id: 'interactive', type: 'boolean', label: 'Interactive', default: false }],
      render: (v) =>
        `<div class="hl-card"${attr('data-hl-interactive', v.interactive)} style="max-width:20rem">
  <div class="hl-card-header">
    <h3 class="hl-card-title">Starter plan</h3>
    <p class="hl-card-description">Everything you need to ship.</p>
  </div>
  <div class="hl-card-body">Unlimited projects, 5 GB storage, and email support.</div>
  <div class="hl-card-footer">$9 / month</div>
</div>`,
      code: {
        react: (v) =>
          `import {\n  Card,\n  CardHeader,\n  CardTitle,\n  CardDescription,\n  CardBody,\n  CardFooter,\n} from '@hydrateless/react';\n\n<Card${v.interactive ? ' interactive' : ''}>\n  <CardHeader>\n    <CardTitle>Starter plan</CardTitle>\n    <CardDescription>Everything you need to ship.</CardDescription>\n  </CardHeader>\n  <CardBody>Unlimited projects, 5 GB storage, and email support.</CardBody>\n  <CardFooter>$9 / month</CardFooter>\n</Card>`,
        vue: (v) =>
          `<script setup>\nimport {\n  Card,\n  CardHeader,\n  CardTitle,\n  CardDescription,\n  CardBody,\n  CardFooter,\n} from '@hydrateless/vue';\n</script>\n\n<template>\n  <Card${v.interactive ? ' interactive' : ''}>\n    <CardHeader>\n      <CardTitle>Starter plan</CardTitle>\n      <CardDescription>Everything you need to ship.</CardDescription>\n    </CardHeader>\n    <CardBody>Unlimited projects, 5 GB storage, and email support.</CardBody>\n    <CardFooter>$9 / month</CardFooter>\n  </Card>\n</template>`,
        svelte: (v) =>
          `<script>\n  import {\n    Card,\n    CardHeader,\n    CardTitle,\n    CardDescription,\n    CardBody,\n    CardFooter,\n  } from '@hydrateless/svelte';\n</script>\n\n<Card${v.interactive ? ' interactive' : ''}>\n  <CardHeader>\n    <CardTitle>Starter plan</CardTitle>\n    <CardDescription>Everything you need to ship.</CardDescription>\n  </CardHeader>\n  <CardBody>Unlimited projects, 5 GB storage, and email support.</CardBody>\n  <CardFooter>$9 / month</CardFooter>\n</Card>`,
      },
    },
  ],
  props: [
    {
      name: 'interactive',
      type: 'boolean',
      default: 'false',
      description: 'Add hover/active elevation for clickable cards.',
    },
  ],
  tokens: [
    { name: '--hl-surface', description: 'Card background.' },
    { name: '--hl-border', description: 'Card border.' },
    { name: '--hl-radius-xl', description: 'Corner radius.' },
    { name: '--hl-shadow-sm', description: 'Resting elevation.' },
  ],
  a11y: [
    'When a whole card is clickable, wrap it in a link or button so it is keyboard reachable.',
  ],
  related: ['avatar', 'badge'],
};
