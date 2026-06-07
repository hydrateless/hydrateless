<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Intent = 'neutral' | 'primary' | 'danger' | 'success' | 'warning' | 'info';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    intent?: Intent;
    title?: string;
    icon?: Snippet;
    children?: Snippet;
  }

  let { intent, title, icon, role = 'alert', class: klass, children, ...rest }: Props = $props();
</script>

<div {...rest} {role} class={['hl-alert', klass]} data-hl-intent={intent}>
  {@render icon?.()}
  <div class="hl-alert-body">
    {#if title != null}<p class="hl-alert-title">{title}</p>{/if}
    {@render children?.()}
  </div>
</div>
