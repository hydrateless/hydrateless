<script lang="ts">
  import Combobox from '../../src/components/Combobox.svelte';
  import ComboboxInput from '../../src/components/ComboboxInput.svelte';
  import ComboboxList from '../../src/components/ComboboxList.svelte';
  import ComboboxOption from '../../src/components/ComboboxOption.svelte';

  let value = $state('');
</script>

<Combobox onValueChange={(v) => (value = v)}>
  <ComboboxInput placeholder="Fruit" />
  <ComboboxList>
    <ComboboxOption value="apple">Apple</ComboboxOption>
    <ComboboxOption value="banana">Banana</ComboboxOption>
  </ComboboxList>
</Combobox>
<output data-testid="value">{value}</output>
