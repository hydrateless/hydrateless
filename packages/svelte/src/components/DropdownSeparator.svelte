<script lang="ts">
  import type { HTMLLiAttributes } from 'svelte/elements';

  let { ...rest }: Omit<HTMLLiAttributes, 'role'> = $props();
</script>

<li {...rest} role="separator"></li>
