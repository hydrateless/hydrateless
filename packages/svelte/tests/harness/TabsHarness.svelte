<script lang="ts">
  import Tabs from '../../src/components/Tabs.svelte';
  import TabList from '../../src/components/TabList.svelte';
  import Tab from '../../src/components/Tab.svelte';
  import TabPanel from '../../src/components/TabPanel.svelte';
</script>

<Tabs>
  <TabList>
    <Tab>One</Tab>
    <Tab>Two</Tab>
  </TabList>
  <TabPanel>First</TabPanel>
  <TabPanel>Second</TabPanel>
</Tabs>
