<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  let { ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div {...rest} data-hl-toast-region></div>
