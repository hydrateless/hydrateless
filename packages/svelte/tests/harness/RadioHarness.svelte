<script lang="ts">
  import RadioGroup from '../../src/components/RadioGroup.svelte';
  import Radio from '../../src/components/Radio.svelte';

  let value = $state('a');
</script>

<RadioGroup bind:value>
  <Radio value="a">A</Radio>
  <Radio value="b">B</Radio>
</RadioGroup>
<output data-testid="value">{value}</output>
