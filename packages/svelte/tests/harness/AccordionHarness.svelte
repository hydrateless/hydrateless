<script lang="ts">
  import Accordion from '../../src/components/Accordion.svelte';
  import AccordionItem from '../../src/components/AccordionItem.svelte';
</script>

<Accordion>
  <AccordionItem defaultOpen>
    {#snippet summary()}First{/snippet}
    Panel one
  </AccordionItem>
  <AccordionItem>
    {#snippet summary()}Second{/snippet}
    Panel two
  </AccordionItem>
</Accordion>
