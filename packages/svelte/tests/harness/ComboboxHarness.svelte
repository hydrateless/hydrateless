<script lang="ts">
  import Combobox from '../../src/components/Combobox.svelte';
  import ComboboxInput from '../../src/components/ComboboxInput.svelte';
  import ComboboxList from '../../src/components/ComboboxList.svelte';
  import ComboboxOption from '../../src/components/ComboboxOption.svelte';

  let { controlled = true }: { controlled?: boolean } = $props();
  let value = $state('');
  let open = $state(false);
  let changes = $state<string[]>([]);
</script>

{#if controlled}
  <button type="button" onclick={() => (value = 'cherry')}>pick cherry</button>
  <button type="button" onclick={() => (open = true)}>expand</button>
  <Combobox bind:value bind:open onValueChange={(v) => changes.push(v)}>
    <ComboboxInput placeholder="Fruit" />
    <ComboboxList>
      <ComboboxOption value="apple">Apple</ComboboxOption>
      <ComboboxOption value="banana">Banana</ComboboxOption>
      <ComboboxOption value="cherry" disabled>Cherry</ComboboxOption>
    </ComboboxList>
  </Combobox>
  <output data-testid="value">{value}</output>
  <output data-testid="open">{open}</output>
{:else}
  <Combobox defaultValue="banana" onValueChange={(v) => changes.push(v)}>
    <ComboboxInput placeholder="Fruit" />
    <ComboboxList>
      <ComboboxOption value="apple">Apple</ComboboxOption>
      <ComboboxOption value="banana">Banana</ComboboxOption>
    </ComboboxList>
  </Combobox>
{/if}
<output data-testid="changes">{changes.join(',')}</output>
