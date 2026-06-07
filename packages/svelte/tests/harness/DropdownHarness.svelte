<script lang="ts">
  import Dropdown from '../../src/components/Dropdown.svelte';
  import DropdownTrigger from '../../src/components/DropdownTrigger.svelte';
  import DropdownMenu from '../../src/components/DropdownMenu.svelte';
  import DropdownItem from '../../src/components/DropdownItem.svelte';
  import DropdownSeparator from '../../src/components/DropdownSeparator.svelte';

  let selected = $state('');
</script>

<Dropdown>
  <DropdownTrigger>Actions</DropdownTrigger>
  <DropdownMenu>
    <DropdownItem onSelect={() => (selected = 'edit')}>Edit</DropdownItem>
    <DropdownSeparator />
    <DropdownItem onSelect={() => (selected = 'delete')}>Delete</DropdownItem>
  </DropdownMenu>
</Dropdown>
<output data-testid="selected">{selected}</output>
