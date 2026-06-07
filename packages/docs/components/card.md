# Card

A surface for grouping related content, with optional header, body, and footer
regions. CSS-only.

## Demo

<div class="hl-demo">
<div class="hl-card">
  <div class="hl-card-header">
    <h3 class="hl-card-title">Starter plan</h3>
    <p class="hl-card-description">Everything you need to ship.</p>
  </div>
  <div class="hl-card-body">Unlimited projects, 5 GB storage, and email support.</div>
  <div class="hl-card-footer">$9 / month</div>
</div>
</div>

## HTML

```html
<div class="hl-card">
  <div class="hl-card-header">
    <h3 class="hl-card-title">Title</h3>
    <p class="hl-card-description">Subtitle</p>
  </div>
  <div class="hl-card-body">Body content</div>
  <div class="hl-card-footer">Footer</div>
</div>
```

- **CSS**: `hydrateless/card.css`
- **JS**: none.
- **Interactive**: add `data-hl-interactive` for hover/active elevation on
  clickable cards.

## Frameworks

::: code-group

```tsx [React]
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from '@hydrateless/react';

<Card>
  <CardHeader>
    <CardTitle>Starter plan</CardTitle>
    <CardDescription>Everything you need to ship.</CardDescription>
  </CardHeader>
  <CardBody>Unlimited projects, 5 GB storage, and email support.</CardBody>
  <CardFooter>$9 / month</CardFooter>
</Card>;
```

```vue [Vue]
<script setup>
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from '@hydrateless/vue';
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Starter plan</CardTitle>
      <CardDescription>Everything you need to ship.</CardDescription>
    </CardHeader>
    <CardBody>Unlimited projects, 5 GB storage, and email support.</CardBody>
    <CardFooter>$9 / month</CardFooter>
  </Card>
</template>
```

```svelte [Svelte]
<script>
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardBody,
    CardFooter,
  } from '@hydrateless/svelte';
</script>

<Card>
  <CardHeader>
    <CardTitle>Starter plan</CardTitle>
    <CardDescription>Everything you need to ship.</CardDescription>
  </CardHeader>
  <CardBody>Unlimited projects, 5 GB storage, and email support.</CardBody>
  <CardFooter>$9 / month</CardFooter>
</Card>
```

:::
