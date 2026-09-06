import type { ComponentDoc } from '../types';
import { attr } from './_util';

export const avatar: ComponentDoc = {
  slug: 'avatar',
  name: 'Avatar',
  category: 'Data Display',
  importName: 'Avatar',
  summary: 'A user image with a graceful text fallback.',
  description: 'A user image with a graceful text fallback. CSS-only.',
  status: 'stable',
  cssOnly: true,
  cssFile: 'avatar.css',
  demos: [
    {
      id: 'playground',
      title: 'Playground',
      layout: 'center',
      knobs: [
        {
          id: 'size',
          type: 'select',
          label: 'Size',
          options: ['xs', 'sm', 'md', 'lg', 'xl'],
          default: 'md',
        },
        {
          id: 'shape',
          type: 'select',
          label: 'Shape',
          options: ['circle', 'square'],
          default: 'circle',
        },
      ],
      render: (v) => {
        const size = v.size !== 'md' ? attr('data-hl-size', v.size) : '';
        const shape = v.shape === 'square' ? attr('data-hl-shape', 'square') : '';
        return `<span class="hl-avatar"${size}${shape}><img src="../avatars/ada.svg" alt="Ada" /></span>
<span class="hl-avatar"${size}${shape}>AL</span>`;
      },
      code: {
        react: (v) =>
          `import { Avatar } from '@hydrateless/react';\n\n<>\n  <Avatar size="${v.size}" shape="${v.shape}" src="../avatars/ada.svg" alt="Ada" />\n  <Avatar size="${v.size}" shape="${v.shape}">AL</Avatar>\n</>`,
        vue: (v) =>
          `<script setup>\nimport { Avatar } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Avatar size="${v.size}" shape="${v.shape}" src="../avatars/ada.svg" alt="Ada" />\n  <Avatar size="${v.size}" shape="${v.shape}">AL</Avatar>\n</template>`,
        svelte: (v) =>
          `<script>\n  import { Avatar } from '@hydrateless/svelte';\n</script>\n\n<Avatar size="${v.size}" shape="${v.shape}" src="../avatars/ada.svg" alt="Ada" />\n<Avatar size="${v.size}" shape="${v.shape}">AL</Avatar>`,
      },
    },
    {
      id: 'group',
      title: 'Avatar group',
      description: 'Overlap several avatars with a group wrapper.',
      layout: 'center',
      render: () =>
        `<div class="hl-avatar-group">
  <span class="hl-avatar"><img src="../avatars/grace.svg" alt="Grace" /></span>
  <span class="hl-avatar"><img src="../avatars/alan.svg" alt="Alan" /></span>
  <span class="hl-avatar"><img src="../avatars/edsger.svg" alt="Edsger" /></span>
  <span class="hl-avatar">+3</span>
</div>`,
    },
  ],
  props: [
    { name: 'src', type: 'string', description: 'Image URL; falls back to children when missing.' },
    {
      name: 'size',
      type: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`,
      default: `'md'`,
      description: 'Diameter.',
    },
    {
      name: 'shape',
      type: `'circle' | 'square'`,
      default: `'circle'`,
      description: 'Avatar shape.',
    },
  ],
  tokens: [
    { name: '--hl-surface-3', description: 'Fallback background.' },
    { name: '--hl-radius-full', description: 'Circle radius.' },
  ],
  a11y: [
    'Always give the `<img>` a meaningful `alt`, or empty `alt=""` when purely decorative.',
    'Text fallbacks (initials) inherit the surrounding contrast tokens.',
  ],
  related: ['badge', 'card', 'skeleton'],
};
