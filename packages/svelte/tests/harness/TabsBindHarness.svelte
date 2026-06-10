<script lang="ts">
  import Tabs from '../../src/components/Tabs.svelte';
  import TabList from '../../src/components/TabList.svelte';
  import Tab from '../../src/components/Tab.svelte';
  import TabPanel from '../../src/components/TabPanel.svelte';

  let value = $state('two');
</script>

<button type="button" onclick={() => (value = 'one')}>go</button>
<span data-testid="value">{value}</span>
<Tabs bind:value>
  <TabList>
    <Tab value="one">One</Tab>
    <Tab value="two">Two</Tab>
  </TabList>
  <TabPanel>First</TabPanel>
  <TabPanel>Second</TabPanel>
</Tabs>
