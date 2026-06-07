# Avatar

A user image with a graceful text fallback. CSS-only.

## Demo

<div class="hl-demo">
<span class="hl-avatar"><img src="https://i.pravatar.cc/80?img=1" alt="Ada" /></span>
<span class="hl-avatar">AL</span>
<div class="hl-avatar-group">
  <span class="hl-avatar"><img src="https://i.pravatar.cc/80?img=2" alt="Grace" /></span>
  <span class="hl-avatar"><img src="https://i.pravatar.cc/80?img=3" alt="Alan" /></span>
  <span class="hl-avatar">+3</span>
</div>
</div>

## HTML

```html
<span class="hl-avatar">
  <img src="https://i.pravatar.cc/80?img=1" alt="Ada" />
</span>
```

When there's no image, put the initials directly inside as a fallback:

```html
<span class="hl-avatar">AL</span>
```

Overlap several avatars with a group wrapper:

```html
<div class="hl-avatar-group">
  <span class="hl-avatar"><img src="…" alt="Grace" /></span>
  <span class="hl-avatar"><img src="…" alt="Alan" /></span>
  <span class="hl-avatar">+3</span>
</div>
```

- **CSS**: `hydrateless/avatar.css`
- **JS**: none.
- **Size**: `data-hl-size` = `xs` | `sm` | `md` | `lg` | `xl`.
- **Shape**: add `data-hl-shape="square"` for a rounded square instead of a
  circle.

## Frameworks

::: code-group

```tsx [React]
import { Avatar, AvatarGroup } from '@hydrateless/react';

<Avatar src="https://i.pravatar.cc/80?img=1" alt="Ada" />;
<Avatar>AL</Avatar>;

<AvatarGroup>
  <Avatar src="https://i.pravatar.cc/80?img=2" alt="Grace" />
  <Avatar src="https://i.pravatar.cc/80?img=3" alt="Alan" />
  <Avatar>+3</Avatar>
</AvatarGroup>;
```

```vue [Vue]
<script setup>
import { Avatar, AvatarGroup } from '@hydrateless/vue';
</script>

<template>
  <Avatar src="https://i.pravatar.cc/80?img=1" alt="Ada" />
  <Avatar>AL</Avatar>

  <AvatarGroup>
    <Avatar src="https://i.pravatar.cc/80?img=2" alt="Grace" />
    <Avatar src="https://i.pravatar.cc/80?img=3" alt="Alan" />
    <Avatar>+3</Avatar>
  </AvatarGroup>
</template>
```

```svelte [Svelte]
<script>
  import { Avatar, AvatarGroup } from '@hydrateless/svelte';
</script>

<Avatar src="https://i.pravatar.cc/80?img=1" alt="Ada" />
<Avatar>AL</Avatar>

<AvatarGroup>
  <Avatar src="https://i.pravatar.cc/80?img=2" alt="Grace" />
  <Avatar src="https://i.pravatar.cc/80?img=3" alt="Alan" />
  <Avatar>+3</Avatar>
</AvatarGroup>
```

:::
