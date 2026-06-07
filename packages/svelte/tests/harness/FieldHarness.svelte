<script lang="ts">
  import Field from '../../src/components/Field.svelte';
  import FieldLabel from '../../src/components/FieldLabel.svelte';
  import FieldHelp from '../../src/components/FieldHelp.svelte';
  import Input from '../../src/components/Input.svelte';
</script>

<Field>
  <FieldLabel>Email</FieldLabel>
  <Input />
  <FieldHelp>We never share it.</FieldHelp>
</Field>
