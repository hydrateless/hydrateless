<script lang="ts">
  import Menu from '../../src/components/Menu.svelte';
  import MenuItem from '../../src/components/MenuItem.svelte';
  import MenuSubmenu from '../../src/components/MenuSubmenu.svelte';

  let value = $state<string | null>(null);
  let selected = $state('');
</script>

<button type="button" onclick={() => (value = 'resources')}>open resources</button>
<button type="button" onclick={() => (value = null)}>close</button>
<Menu aria-label="Main" bind:value onSelect={(v) => (selected = v)}>
  <MenuItem value="home">Home</MenuItem>
  <MenuItem href="/docs">Docs</MenuItem>
  <MenuSubmenu label="Resources" value="resources">
    <MenuItem value="blog">Blog</MenuItem>
    <MenuItem value="guides" href="/guides">Guides</MenuItem>
  </MenuSubmenu>
</Menu>
<output data-testid="value">{value ?? 'null'}</output>
<output data-testid="selected">{selected}</output>
