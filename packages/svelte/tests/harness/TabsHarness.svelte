<script lang="ts">
  import Tabs from '../../src/components/Tabs.svelte';
  import TabList from '../../src/components/TabList.svelte';
  import Tab from '../../src/components/Tab.svelte';
  import TabPanel from '../../src/components/TabPanel.svelte';

  let { defaultValue }: { defaultValue?: string } = $props();
  let changes = $state<string[]>([]);
</script>

<Tabs {defaultValue} onValueChange={(v) => changes.push(v)}>
  <TabList>
    <Tab value="one">One</Tab>
    <Tab value="two">Two</Tab>
  </TabList>
  <TabPanel>First</TabPanel>
  <TabPanel>Second</TabPanel>
</Tabs>
<output data-testid="changes">{changes.join(',')}</output>
