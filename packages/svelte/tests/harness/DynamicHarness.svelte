<script lang="ts">
  import Tabs from '../../src/components/Tabs.svelte';
  import TabList from '../../src/components/TabList.svelte';
  import Tab from '../../src/components/Tab.svelte';
  import TabPanel from '../../src/components/TabPanel.svelte';
  import Accordion from '../../src/components/Accordion.svelte';
  import AccordionItem from '../../src/components/AccordionItem.svelte';

  // Tabs and items without explicit values fall back to their index, which
  // must stay dense as the list changes.
  let tabs = $state(['One', 'Two', 'Three']);
  let items = $state(['A', 'B']);
</script>

<button type="button" onclick={() => tabs.splice(0, 1)}>drop first tab</button>
<button type="button" onclick={() => items.unshift('Z')}>prepend item</button>

<Tabs defaultValue="1">
  <TabList>
    {#each tabs as label (label)}
      <Tab>{label}</Tab>
    {/each}
  </TabList>
  {#each tabs as label (label)}
    <TabPanel>{label} panel</TabPanel>
  {/each}
</Tabs>

<Accordion defaultValue={['1']}>
  {#each items as label (label)}
    <AccordionItem title={label}>{label} body</AccordionItem>
  {/each}
</Accordion>
