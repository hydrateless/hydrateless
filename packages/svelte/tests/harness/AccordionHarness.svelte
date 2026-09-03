<script lang="ts">
  import Accordion from '../../src/components/Accordion.svelte';
  import AccordionItem from '../../src/components/AccordionItem.svelte';

  let { controlled = false }: { controlled?: boolean } = $props();
  let value = $state<string[]>(['a']);
</script>

{#if controlled}
  <button type="button" onclick={() => (value = ['b'])}>open b</button>
  <Accordion bind:value>
    <AccordionItem value="a" title="First">Panel one</AccordionItem>
    <AccordionItem value="b" title="Second">Panel two</AccordionItem>
  </Accordion>
  <output data-testid="value">{value.join(',')}</output>
{:else}
  <Accordion defaultValue={['a']}>
    <AccordionItem value="a" title="First">Panel one</AccordionItem>
    <AccordionItem value="b" title="Second">Panel two</AccordionItem>
  </Accordion>
{/if}
