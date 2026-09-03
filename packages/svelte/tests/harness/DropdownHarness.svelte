<script lang="ts">
  import Dropdown from '../../src/components/Dropdown.svelte';
  import DropdownTrigger from '../../src/components/DropdownTrigger.svelte';
  import DropdownMenu from '../../src/components/DropdownMenu.svelte';
  import DropdownItem from '../../src/components/DropdownItem.svelte';
  import DropdownGroup from '../../src/components/DropdownGroup.svelte';
  import DropdownSeparator from '../../src/components/DropdownSeparator.svelte';

  let open = $state(false);
  let selected = $state('');
  let checked = $state<string>('');
</script>

<button type="button" onclick={() => (open = true)}>show</button>
<button type="button" onclick={() => (open = false)}>hide</button>
<Dropdown
  bind:open
  closeOnSelect={false}
  onSelect={(value, _item, isChecked) => {
    selected = value;
    checked = String(isChecked);
  }}
>
  <DropdownTrigger>Actions</DropdownTrigger>
  <DropdownMenu>
    <DropdownItem value="edit">Edit</DropdownItem>
    <DropdownItem value="archive" disabled>Archive</DropdownItem>
    <DropdownSeparator />
    <DropdownGroup label="View">
      <DropdownItem role="menuitemcheckbox" value="grid">Grid</DropdownItem>
      <DropdownItem role="menuitemradio" value="asc">Ascending</DropdownItem>
      <DropdownItem role="menuitemradio" value="desc" checked>Descending</DropdownItem>
    </DropdownGroup>
  </DropdownMenu>
</Dropdown>
<output data-testid="open">{open}</output>
<output data-testid="selected">{selected}</output>
<output data-testid="checked">{checked}</output>
