<script lang="ts">
  import Command from '../../src/components/Command.svelte';
  import CommandInput from '../../src/components/CommandInput.svelte';
  import CommandList from '../../src/components/CommandList.svelte';
  import CommandItem from '../../src/components/CommandItem.svelte';
  import CommandEmpty from '../../src/components/CommandEmpty.svelte';

  let { controlled = true }: { controlled?: boolean } = $props();
  let query = $state('');
  let ran = $state('');
</script>

{#if controlled}
  <button type="button" onclick={() => (query = 'set')}>filter settings</button>
  <Command bind:query onCommand={(v) => (ran = v)}>
    <CommandInput placeholder="Search" />
    <CommandList>
      <CommandItem value="new-file">New file</CommandItem>
      <CommandItem value="settings">Settings</CommandItem>
    </CommandList>
    <CommandEmpty />
  </Command>
  <output data-testid="query">{query}</output>
{:else}
  <Command defaultQuery="new" onCommand={(v) => (ran = v)}>
    <CommandInput placeholder="Search" />
    <CommandList>
      <CommandItem value="new-file">New file</CommandItem>
      <CommandItem value="settings">Settings</CommandItem>
    </CommandList>
  </Command>
{/if}
<output data-testid="ran">{ran}</output>
