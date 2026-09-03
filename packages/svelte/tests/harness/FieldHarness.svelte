<script lang="ts">
  import Field from '../../src/components/Field.svelte';
  import FieldLabel from '../../src/components/FieldLabel.svelte';
  import FieldHelp from '../../src/components/FieldHelp.svelte';
  import FieldError from '../../src/components/FieldError.svelte';
  import Input from '../../src/components/Input.svelte';
  import Textarea from '../../src/components/Textarea.svelte';
  import Select from '../../src/components/Select.svelte';
  import Checkbox from '../../src/components/Checkbox.svelte';
  import Switch from '../../src/components/Switch.svelte';
  import Slider from '../../src/components/Slider.svelte';
  import Combobox from '../../src/components/Combobox.svelte';
  import ComboboxInput from '../../src/components/ComboboxInput.svelte';
  import ComboboxList from '../../src/components/ComboboxList.svelte';
  import ComboboxOption from '../../src/components/ComboboxOption.svelte';

  let invalid = $state(false);
  let nameError = $state('');
</script>

<button type="button" onclick={() => (invalid = true)}>invalidate</button>
<button type="button" onclick={() => (nameError = 'Name is required.')}>fail name</button>
<Field label="Name" description="Your full name" error={nameError} required>
  <Input data-testid="name" />
</Field>
<Field {invalid} required data-testid="email-field">
  <FieldLabel>Email</FieldLabel>
  <Input data-testid="email" />
  <FieldHelp>We never share it.</FieldHelp>
  <FieldError
    >{#if invalid}Enter a valid email.{/if}</FieldError
  >
</Field>
<Field id="bio-control">
  <FieldLabel>Bio</FieldLabel>
  <Textarea data-testid="bio" />
</Field>
<Field>
  <FieldLabel>Fruit</FieldLabel>
  <Select data-testid="fruit">
    <option value="apple">Apple</option>
  </Select>
</Field>
<Field>
  <Checkbox data-testid="agree">Agree</Checkbox>
</Field>
<Field>
  <Switch data-testid="notify">Notify</Switch>
</Field>
<Field>
  <FieldLabel>Volume</FieldLabel>
  <Slider data-testid="volume" />
</Field>
<Field>
  <FieldLabel>City</FieldLabel>
  <Combobox>
    <ComboboxInput data-testid="city" />
    <ComboboxList>
      <ComboboxOption value="oslo">Oslo</ComboboxOption>
    </ComboboxList>
  </Combobox>
</Field>
<Input data-testid="lonely" aria-label="Standalone" />
