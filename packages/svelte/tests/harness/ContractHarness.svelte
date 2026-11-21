<script lang="ts">
  import Tabs from '../../src/components/Tabs.svelte';
  import TabList from '../../src/components/TabList.svelte';
  import Tab from '../../src/components/Tab.svelte';
  import TabPanel from '../../src/components/TabPanel.svelte';
  import Modal from '../../src/components/Modal.svelte';
  import ModalTrigger from '../../src/components/ModalTrigger.svelte';
  import ModalBody from '../../src/components/ModalBody.svelte';
  import DrawerTrigger from '../../src/components/DrawerTrigger.svelte';
  import Popover from '../../src/components/Popover.svelte';
  import PopoverTrigger from '../../src/components/PopoverTrigger.svelte';
  import Switch from '../../src/components/Switch.svelte';
  import Breadcrumb from '../../src/components/Breadcrumb.svelte';
  import BreadcrumbItem from '../../src/components/BreadcrumbItem.svelte';

  let lockedTab = $state('one');
  let vetoCalls = $state<string[]>([]);
  let modalOpen = $state(true);
  let closeOnBackdrop = $state(true);
</script>

<Tabs
  bind:value={() => lockedTab, () => {}}
  onValueChange={(next) => vetoCalls.push(next)}
  data-testid="veto-tabs"
>
  <TabList>
    <Tab value="one">One</Tab>
    <Tab value="two">Two</Tab>
  </TabList>
  <TabPanel>First</TabPanel>
  <TabPanel>Second</TabPanel>
</Tabs>
<output data-testid="veto-calls">{vetoCalls.join(',')}</output>

<button type="button" onclick={() => (closeOnBackdrop = !closeOnBackdrop)}>toggle backdrop</button>
<output data-testid="backdrop">{closeOnBackdrop}</output>
<ModalTrigger target="contract-modal" class="hl-button">Open modal</ModalTrigger>
<Modal id="contract-modal" bind:open={modalOpen} {closeOnBackdrop}>
  <ModalBody>Stay open</ModalBody>
</Modal>

<DrawerTrigger target="contract-drawer" command="close">Close drawer</DrawerTrigger>

<PopoverTrigger target="contract-popover" action="show">Show popover</PopoverTrigger>
<Popover id="contract-popover">Popover body</Popover>

<Switch>Notifications</Switch>
<Breadcrumb>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem current>Settings</BreadcrumbItem>
</Breadcrumb>
