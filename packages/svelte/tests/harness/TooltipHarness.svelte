<script lang="ts">
  import Tooltip from '../../src/components/Tooltip.svelte';
  import Button from '../../src/components/Button.svelte';
</script>

<Tooltip content="Saves your work">
  {#snippet children(trigger)}<Button {...trigger}>Save</Button>{/snippet}
</Tooltip>

<Tooltip content="Linked on the client">
  <button type="button">Fallback</button>
</Tooltip>
