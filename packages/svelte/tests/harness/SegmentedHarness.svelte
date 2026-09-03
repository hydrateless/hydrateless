<script lang="ts">
  import SegmentedControl from '../../src/components/SegmentedControl.svelte';

  let { controlled = false }: { controlled?: boolean } = $props();
  let value = $state('grid');
  let changes = $state<string[]>([]);
  const options = [
    { label: 'List', value: 'list' },
    { label: 'Grid', value: 'grid' },
  ];
</script>

{#if controlled}
  <button type="button" onclick={() => (value = 'list')}>set list</button>
  <SegmentedControl bind:value aria-label="View" {options} onValueChange={(v) => changes.push(v)} />
  <output data-testid="value">{value}</output>
{:else}
  <SegmentedControl aria-label="View" {options} onValueChange={(v) => changes.push(v)} />
{/if}
<output data-testid="changes">{changes.join(',')}</output>
