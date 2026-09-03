<script lang="ts">
  import ToastRegion from '../../src/components/ToastRegion.svelte';
  import { useToast } from '../../src/toast.js';

  const toast = useToast();
</script>

<button type="button" onclick={() => toast.show('Saved', { intent: 'success', duration: 0 })}>
  save
</button>
<button type="button" onclick={() => toast.show('Failed', { intent: 'danger', duration: 0 })}>
  fail
</button>
<ToastRegion data-testid="region" />
