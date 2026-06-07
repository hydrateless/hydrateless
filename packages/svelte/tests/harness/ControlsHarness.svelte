<script lang="ts">
  import Field from '../../src/components/Field.svelte';
  import FieldLabel from '../../src/components/FieldLabel.svelte';
  import Select from '../../src/components/Select.svelte';
  import Checkbox from '../../src/components/Checkbox.svelte';
  import Switch from '../../src/components/Switch.svelte';
  import SegmentedControl from '../../src/components/SegmentedControl.svelte';

  let fruit = $state('apple');
  let agree = $state(false);
  let notify = $state(true);
  let view = $state('list');
</script>

<main>
  <Field>
    <FieldLabel>Fruit</FieldLabel>
    <Select bind:value={fruit}>
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
    </Select>
  </Field>
  <Checkbox bind:checked={agree}>I agree</Checkbox>
  <Switch bind:checked={notify}>Notifications</Switch>
  <SegmentedControl
    bind:value={view}
    aria-label="View"
    options={[
      { label: 'List', value: 'list' },
      { label: 'Grid', value: 'grid' },
    ]}
  />
  <output data-testid="fruit">{fruit}</output>
  <output data-testid="agree">{agree}</output>
  <output data-testid="view">{view}</output>
</main>
