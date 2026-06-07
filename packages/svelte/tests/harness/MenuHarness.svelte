<script lang="ts">
  import Menu from '../../src/components/Menu.svelte';
  import MenuItem from '../../src/components/MenuItem.svelte';

  let selected = $state('');
</script>

<Menu aria-label="Main">
  <MenuItem onSelect={() => (selected = 'home')}>Home</MenuItem>
  <MenuItem href="/docs">Docs</MenuItem>
</Menu>
<output data-testid="selected">{selected}</output>
